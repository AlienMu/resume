import { useUserStore } from '/@/store/modules/system/user';
import { createVNode, render } from 'vue';
import lodash from 'lodash';
import { Tooltip } from 'ant-design-vue';

export function privilegeDirective(el, binding) {
  const userStore = useUserStore();
  // Super administrator
  if (userStore.administratorFlag) {
    return true;
  }
  // Get feature-point permissions
  const userPointsList = userStore.getPointList;

  if (!userPointsList) {
    return false;
  }

  let value = binding.value;
  let status = 'disabled';

  if (Array.isArray(binding.value)) {
    value = binding.value[0];
    status = binding.value[1];
  }

  if (!lodash.some(userPointsList, ['identifier', value])) {
    if (status === 'hide') {
      const parent = el.parentNode;
      if (parent) {
        parent.removeChild(el);
      }
      return false;
    }
    // Disable button
    el.disabled = true;

    // Extract the button's attributes
    const attributes = Array.from(el.attributes).reduce((acc, attr) => {
      acc[attr.name] = attr.value;
      return acc;
    }, {});
    // Create a cloned button VNode
    const clonedVNode = createVNode(el.type, { ...attributes, disabled: true }, el.textContent);

    // Create Tooltip node
    const tooltipNode = createVNode(Tooltip, { title: 'No permission', placement: 'top', destroyTooltipOnHide: true }, { default: () => clonedVNode });

    // Replace the original DOM node
    const parent = el.parentNode;
    if (parent) {
      parent.removeChild(el);
      render(tooltipNode, parent);
    }
  }
  return true;
}
