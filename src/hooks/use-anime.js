import { animate } from 'animejs';

export const useFadeAnime = ({ duration } = { duration: 300 }) => {
  return {
    enter: (el, done) => {
      animate(el, {
        opacity: 1,
        translateX: 0,
        duration,
        easing: 'easeInOut',
        complete: done, // Call done after the animation finishes
      });
    },
    beforeEnter(el) {
      el.style.opacity = 0;
    },
    leave(el, done) {
      animate(el, {
        opacity: 0,
        translateX: '0',
        duration,
        easing: 'easeInOutSine',
        complete: done, // Call done after the animation finishes
      });
    },
  };
};
export const useSlideAnime = () => {
  return {
    enter: (el, done) => {
      animate(el, {
        opacity: 1,
        translateX: 0,
        duration: 300,
        complete: done, // Call done after the animation finishes
      });
    },
    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.transform = 'translateX(300px)';
      el.style.position = 'relative';
    },
    leave(el, done) {
      animate(el, {
        opacity: 0,
        translateX: '300px',
        duration: 300,
        complete: done,
      });
    },
    beforeLeave(el) {
      el.style.opacity = 1;
      el.style.transform = 'translateX(0px);';
    },
  };
};
