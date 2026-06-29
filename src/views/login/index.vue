<template>
  <div class="login" ref="containerRef">
    <div class="login-logo">
      <a-image style="padding-left: 10px; cursor: pointer" :src="logoUrl" @click="router.push('/')" :height="24" :preview="false" />
    </div>
    <div v-if="!isMobileDevice" class="login-danmaku-container">
      <div
        v-for="danmaku in danmakuList"
        :key="danmaku.id"
        class="danmaku-item"
        :style="{
          fontSize: `${danmaku.fontSize}px`,
          color: danmaku.color,
          top: trackCount > 1 ? `${(danmaku.track * 100) / (trackCount - 1)}%` : '50%',
          left: `${danmaku.left}%`,
        }"
      >
        {{ danmaku.text }}
      </div>
    </div>
    <div class="login-title">
      <a-image width="432px" :preview="false" :src="loginTtitle" />
    </div>

    <a-flex vertical align="center" justify="center">
      <div class="login-body" :style="{ height: wrapHeight + 'px' }">
        <div class="wrap" ref="wrapRef">
          <transition-group @enter="enter" @leave="leave" @before-enter="beforeEnter" @before-leave="beforeLeave">
            <div class="login-content" :key="1" v-if="activeKey === 'login'">
              <a-flex style="height: 100%" align="center" gap="50">
                <a-flex vertical gap="20" style="min-width: 420px" class="left">
                  <div class="logi-content-title">{{ getI18nLabel('login.title') }}</div>
                  <a-form ref="loginFormRef" :model="loginForm" :rules="loginRules" autocomplete="off" @keyup.enter="handleLogin">
                    <m-form-item name="email" size="large" required :no-style="false">
                      <a-input
                        class="mui-font-size-18"
                        :maxlength="50"
                        style="height: 50px; font-size: 18px"
                        :placeholder="getI18nLabel('placeholder.4')"
                        v-model:value.trim="loginForm.email"
                      />
                    </m-form-item>
                    <a-flex gap="10" style="width: 100%">
                      <div style="flex: 1">
                        <m-form-item name="captcha" size="large" required :no-style="false">
                          <a-input
                            :maxlength="25"
                            style="height: 50px; font-size: 18px"
                            :placeholder="getI18nLabel('placeholder.1')"
                            v-model:value.trim="loginForm.captcha"
                          />
                        </m-form-item>
                      </div>
                      <div
                        style="cursor: pointer; display: flex; align-items: center; justify-content: center; width: 140px; height: 50px"
                        @click="handleRefreshCaptcha('login')"
                      >
                        <a-spin v-if="!captchas.login.image" />
                        <a-image
                          v-else
                          class="mui-message-code big"
                          :preview="false"
                          :src="captchas.login.image"
                          style="max-width: 100%; max-height: 100%"
                        />
                      </div>
                    </a-flex>
                    <m-form-item name="password" size="large" required :no-style="false">
                      <a-input
                        :type="showPassword.login ? 'text' : 'password'"
                        :maxlength="25"
                        style="height: 50px; font-size: 18px"
                        :placeholder="getI18nLabel('placeholder.2')"
                        v-model:value.trim="loginForm.password"
                      >
                        <template #suffix>
                          <span @click="showPassword.login = !showPassword.login" style="cursor: pointer; display: flex; align-items: center">
                            <svg-icon :name="showPassword.login ? 'eyes-open' : 'eyes-close'" />
                          </span>
                        </template>
                      </a-input>
                    </m-form-item>
                    <a-flex vertical align="flex-end" gap="30">
                      <a-button @click="setActiveKey('forgetPassword')" type="link" size="small">{{ getI18nLabel('forgetPassword') }}</a-button>
                      <a-button
                        class="mui-font-size-20"
                        style="background: rgba(0, 106, 255, 1); height: 50px"
                        type="primary"
                        block
                        :loading="loading.login"
                        @click="handleLogin"
                      >
                        {{ getI18nLabel('login.submit') }}
                      </a-button>
                    </a-flex>
                  </a-form>
                </a-flex>
                <div class="line"></div>
                <a-flex vertical gap="40" class="right">
                  <a-flex vertical gap="10" align="flex-start">
                    <div class="mui-font-size-16">{{ getI18nLabel('login.help', 1) }}</div>
                    <a-button @click="setActiveKey('register')" style="padding: 0" type="link" size="small">
                      <a-flex align="center" class="mui-font-size-20" gap="8">
                        <span>{{ getI18nLabel('login.help', 2) }}</span>
                        <svg-icon name="arrow-right" />
                      </a-flex>
                    </a-button>
                  </a-flex>
                  <a-flex vertical style="line-height: 22px">
                    <span class="mui-font-size-14 mui-desc-text">{{ getI18nLabel('tips.0') }}</span>
                    <span class="mui-font-size-14 mui-desc-text">{{ getI18nLabel('tips.1') }}</span>
                    <span class="mui-font-size-14 mui-desc-text">{{ getI18nLabel('tips.2') }}</span>
                    <span class="mui-font-size-14 mui-desc-text">{{ getI18nLabel('tips.3') }}</span>
                    <span class="mui-font-size-14 mui-desc-text">{{ getI18nLabel('tips.4') }}</span>
                  </a-flex>
                </a-flex>
              </a-flex>
            </div>
            <div class="login-content" :key="2" v-if="activeKey === 'forgetPassword'">
              <a-flex style="height: 100%" align="center" gap="50">
                <a-flex vertical gap="40" style="min-width: 420px" class="left">
                  <div class="logi-content-title">{{ getI18nLabel('resetPassword') }}</div>
                  <a-form ref="forgetFormRef" :model="forgetForm" :rules="forgetRules" autocomplete="off" @keyup.enter="handleResetPassword">
                    <m-form-item name="phone" size="large" required :no-style="false">
                      <a-flex>
                        <m-phone-prefixe-select
                          isCustomerIcon
                          v-model:value="loginForm.countryCode"
                          :placeholder="getI18nLabel('login.selectCountry')"
                          style="height: 50px; font-size: 18px; width: 124px; flex-shrink: 0"
                        />
                        <a-input
                          class="mui-font-size-18"
                          :maxlength="12"
                          :placeholder="getI18nLabel('placeholder.0')"
                          v-model:value.trim="forgetForm.phone"
                        />
                      </a-flex>
                    </m-form-item>
                    <m-form-item name="email" size="large" :no-style="false">
                      <a-flex align="center" style="width: 100%">
                        <a-input
                          :maxlength="50"
                          style="height: 50px; font-size: 18px"
                          :placeholder="getI18nLabel('placeholder.5')"
                          v-model:value.trim="forgetForm.email"
                        />
                        <a-button
                          type="link"
                          size="small"
                          class="mui-font-size-18"
                          style="padding-right: 24px; line-height: 18px; flex-shrink: 0"
                          :disabled="!forgetForm.email || emailCountdown > 0"
                          :loading="loading.sendEmail"
                          @click.prevent="handleSendEmailCode"
                        >
                          {{ emailCountdown > 0 ? `${getI18nLabel('sendMessage')} (${emailCountdown}s)` : getI18nLabel('sendMessage') }}
                        </a-button>
                      </a-flex>
                    </m-form-item>
                    <m-form-item name="emailCode" size="large" required :no-style="false">
                      <a-input
                        :maxlength="25"
                        style="height: 50px; font-size: 18px"
                        :placeholder="getI18nLabel('placeholder.6')"
                        v-model:value.trim="forgetForm.emailCode"
                      />
                    </m-form-item>
                    <m-form-item name="password1" size="large" required :no-style="false">
                      <a-input
                        :type="showPassword.forgetPassword1 ? 'text' : 'password'"
                        :maxlength="25"
                        style="height: 50px; font-size: 18px"
                        :placeholder="getI18nLabel('placeholder.7')"
                        v-model:value.trim="forgetForm.password1"
                      >
                        <template #suffix>
                          <span
                            @click="showPassword.forgetPassword1 = !showPassword.forgetPassword1"
                            style="cursor: pointer; display: flex; align-items: center"
                          >
                            <svg-icon :name="showPassword.forgetPassword1 ? 'eyes-open' : 'eyes-close'" />
                          </span>
                        </template>
                      </a-input>
                    </m-form-item>
                    <m-form-item name="password2" size="large" required :no-style="false">
                      <a-input
                        :type="showPassword.forgetPassword2 ? 'text' : 'password'"
                        :maxlength="25"
                        style="height: 50px; font-size: 18px"
                        :placeholder="getI18nLabel('placeholder.8')"
                        v-model:value.trim="forgetForm.password2"
                      >
                        <template #suffix>
                          <span
                            @click="showPassword.forgetPassword2 = !showPassword.forgetPassword2"
                            style="cursor: pointer; display: flex; align-items: center"
                          >
                            <svg-icon :name="showPassword.forgetPassword2 ? 'eyes-open' : 'eyes-close'" />
                          </span>
                        </template>
                      </a-input>
                    </m-form-item>
                    <a-flex vertical align="flex-start" gap="30">
                      <a-button
                        class="mui-font-size-20"
                        style="background: rgba(0, 106, 255, 1); height: 50px"
                        type="primary"
                        block
                        :loading="loading.forget"
                        @click="handleResetPassword"
                      >
                        {{ getI18nLabel('login.submit') }}
                      </a-button>
                    </a-flex>
                  </a-form>
                </a-flex>
                <div class="line"></div>
                <a-flex vertical gap="40" class="right">
                  <a-flex vertical gap="10" align="flex-start">
                    <div class="mui-font-size-16">{{ getI18nLabel('register.help', 1) }}</div>
                    <a-button @click="setActiveKey('login')" style="padding: 0" type="link" size="small">
                      <a-flex align="center" class="mui-font-size-20" gap="8">
                        <span>{{ getI18nLabel('register.help', 2) }}</span>
                        <svg-icon name="arrow-right" />
                      </a-flex>
                    </a-button>
                  </a-flex>
                  <a-flex vertical style="line-height: 22px">
                    <span class="mui-font-size-14 mui-desc-text">{{ getI18nLabel('tips.0') }}</span>
                    <span class="mui-font-size-14 mui-desc-text">{{ getI18nLabel('tips.1') }}</span>
                    <span class="mui-font-size-14 mui-desc-text">{{ getI18nLabel('tips.2') }}</span>
                    <span class="mui-font-size-14 mui-desc-text">{{ getI18nLabel('tips.3') }}</span>
                    <span class="mui-font-size-14 mui-desc-text">{{ getI18nLabel('tips.4') }}</span>
                  </a-flex>
                </a-flex>
              </a-flex>
            </div>
            <div class="login-content" :key="3" v-if="activeKey === 'register'">
              <a-flex style="height: 100%" align="center" gap="50">
                <a-flex vertical gap="30" style="min-width: 420px" class="left">
                  <a-tabs class="register-tabs" ref="tabsRef" @change="onTabsChange" centered v-model:activeKey="registerTabKey">
                    <a-tab-pane key="job" :tab="getI18nLabel('register.tab', 1)" />
                    <a-tab-pane key="company" :tab="getI18nLabel('register.tab', 2)" />
                  </a-tabs>
                  <a-form
                    :key="registerTabKey"
                    ref="registerFormRef"
                    :model="currentRegisterForm"
                    :rules="registerRules"
                    autocomplete="off"
                    @keyup.enter="handleRegisterSubmit"
                  >
                    <m-form-item name="email" size="large" required :no-style="false">
                      <a-input
                        :maxlength="50"
                        style="height: 50px; font-size: 18px"
                        :placeholder="getI18nLabel('placeholder.4')"
                        v-model:value.trim="currentRegisterForm.email"
                      />
                    </m-form-item>
                    <m-form-item name="password" size="large" required :no-style="false">
                      <a-input
                        :type="showPassword.register ? 'text' : 'password'"
                        :maxlength="25"
                        style="height: 50px; font-size: 18px"
                        :placeholder="getI18nLabel('placeholder.3')"
                        v-model:value.trim="currentRegisterForm.password"
                      >
                        <template #suffix>
                          <span @click="showPassword.register = !showPassword.register" style="cursor: pointer; display: flex; align-items: center">
                            <svg-icon :name="showPassword.register ? 'eyes-open' : 'eyes-close'" />
                          </span>
                        </template>
                      </a-input>
                    </m-form-item>
                    <m-form-item name="telegramAccount" size="large" :no-style="false">
                      <a-flex align="center" style="width: 100%">
                        <a-input
                          :maxlength="30"
                          style="height: 50px; font-size: 18px; flex: 1"
                          :placeholder="getI18nLabel('placeholder.9')"
                          v-model:value.trim="currentRegisterForm.telegramAccount"
                        />
                        <a-button
                          type="link"
                          size="small"
                          class="mui-font-size-18"
                          style="padding-right: 24px; line-height: 18px; flex-shrink: 0"
                          @click.prevent="handleTelegramGuide"
                        >
                          {{ getI18nLabel('register.registerTelegram') }}
                        </a-button>
                      </a-flex>
                    </m-form-item>
                    <a-flex gap="10" style="width: 100%">
                      <div style="flex: 1">
                        <m-form-item name="captcha" size="large" required :no-style="false">
                          <a-input
                            :maxlength="25"
                            style="height: 50px; font-size: 18px"
                            :placeholder="getI18nLabel('placeholder.1')"
                            v-model:value.trim="currentRegisterForm.captcha"
                          />
                        </m-form-item>
                      </div>
                      <div
                        style="cursor: pointer; display: flex; align-items: center; justify-content: center; width: 140px; height: 50px"
                        @click="handleRefreshCaptcha(registerCaptchaScene.value)"
                      >
                        <a-spin v-if="!currentRegisterCaptcha.image" />
                        <a-image
                          v-else
                          class="mui-message-code big"
                          :preview="false"
                          :src="currentRegisterCaptcha.image"
                          style="max-width: 100%; max-height: 100%"
                        />
                      </div>
                    </a-flex>
                    <a-flex vertical align="flex-start" gap="30">
                      <a-button
                        class="mui-font-size-20"
                        style="background: rgba(0, 106, 255, 1); height: 50px"
                        type="primary"
                        block
                        :loading="loading.register"
                        @click="handleRegisterSubmit"
                      >
                        {{ getI18nLabel('login.submit') }}
                      </a-button>
                    </a-flex>
                  </a-form>
                </a-flex>
                <div class="line"></div>
                <a-flex vertical gap="40" class="right">
                  <a-flex vertical gap="10" align="flex-start">
                    <div class="mui-font-size-16">{{ getI18nLabel('register.help', 1) }}</div>
                    <a-button @click="setActiveKey('login')" style="padding: 0" type="link" size="small">
                      <a-flex align="center" class="mui-font-size-20" gap="8">
                        <span>{{ getI18nLabel('register.help', 2) }}</span>
                        <svg-icon name="arrow-right" />
                      </a-flex>
                    </a-button>
                  </a-flex>
                  <a-flex vertical style="line-height: 22px">
                    <span class="mui-font-size-14 mui-desc-text">{{ getI18nLabel('tips.0') }}</span>
                    <span class="mui-font-size-14 mui-desc-text">{{ getI18nLabel('tips.1') }}</span>
                    <span class="mui-font-size-14 mui-desc-text">{{ getI18nLabel('tips.2') }}</span>
                    <span class="mui-font-size-14 mui-desc-text">{{ getI18nLabel('tips.3') }}</span>
                  </a-flex>
                </a-flex>
              </a-flex>
            </div>
            <div class="login-content" :key="4" v-if="activeKey === 'invite'">
              <a-flex style="height: 100%" align="center" gap="50">
                <a-flex vertical gap="30" style="min-width: 420px" class="left">
                  <div class="logi-content-title">{{ getI18nLabel('invite.title') }}</div>
                  <a-form ref="inviteFormRef" :model="inviteForm" :rules="inviteRules" @keyup.enter="handleInviteSubmit">
                    <m-form-item name="inviteCode" size="middle" required :no-style="false">
                      <a-flex align="center" gap="50">
                        <span class="mui-font-size-18" style="flex-shrink: 0; padding-left: 15px">{{ getI18nLabel('invite.inviteCode') }}</span>
                        <a-input
                          style="height: 50px; font-size: 18px"
                          :maxlength="12"
                          :placeholder="getI18nLabel('placeholder.10')"
                          v-model:value.trim="inviteForm.inviteCode"
                        />
                      </a-flex>
                    </m-form-item>
                    <m-form-item name="email" size="middle" required :no-style="false">
                      <a-input
                        :maxlength="50"
                        style="height: 50px; font-size: 18px"
                        :placeholder="getI18nLabel('placeholder.4')"
                        v-model:value.trim="inviteForm.email"
                      />
                    </m-form-item>
                    <m-form-item name="password" size="middle" required :no-style="false">
                      <a-input
                        :type="showPassword.invite ? 'text' : 'password'"
                        :maxlength="25"
                        style="height: 50px; font-size: 18px"
                        :placeholder="getI18nLabel('placeholder.3')"
                        v-model:value.trim="inviteForm.password"
                      >
                        <template #suffix>
                          <span @click="showPassword.invite = !showPassword.invite" style="cursor: pointer; display: flex; align-items: center">
                            <svg-icon :name="showPassword.invite ? 'eyes-open' : 'eyes-close'" />
                          </span>
                        </template>
                      </a-input>
                    </m-form-item>
                    <m-form-item name="telegramAccount" size="middle" :no-style="false">
                      <a-flex align="center" style="width: 100%">
                        <a-input
                          :maxlength="30"
                          style="height: 50px; font-size: 18px"
                          :placeholder="getI18nLabel('placeholder.9')"
                          v-model:value.trim="inviteForm.telegramAccount"
                        />
                        <a-button
                          type="link"
                          size="small"
                          class="mui-font-size-18"
                          style="padding-right: 24px; line-height: 18px"
                          @click.prevent="handleTelegramGuide"
                        >
                          {{ getI18nLabel('register.registerTelegram') }}
                        </a-button>
                      </a-flex>
                    </m-form-item>
                    <a-flex gap="10" style="width: 100%">
                      <div style="flex: 1">
                        <m-form-item name="captcha" size="middle" required :no-style="false">
                          <a-input
                            :maxlength="25"
                            style="height: 50px; font-size: 18px"
                            :placeholder="getI18nLabel('placeholder.1')"
                            v-model:value.trim="inviteForm.captcha"
                          />
                        </m-form-item>
                      </div>
                      <div
                        style="cursor: pointer; display: flex; align-items: center; justify-content: center; width: 140px; height: 50px"
                        @click="handleRefreshCaptcha('invite')"
                      >
                        <a-spin v-if="!captchas.invite.image" />
                        <a-image
                          v-else
                          class="mui-message-code big"
                          :preview="false"
                          :src="captchas.invite.image"
                          style="max-width: 100%; max-height: 100%"
                        />
                      </div>
                    </a-flex>
                    <a-flex vertical align="flex-start" gap="30">
                      <a-button
                        class="mui-font-size-20"
                        style="background: rgba(0, 106, 255, 1); height: 50px"
                        type="primary"
                        block
                        :loading="loading.invite"
                        @click="handleInviteSubmit"
                      >
                        {{ getI18nLabel('login.submit') }}
                      </a-button>
                    </a-flex>
                  </a-form>
                </a-flex>
                <div class="line"></div>
                <a-flex vertical gap="40" class="right">
                  <a-flex vertical gap="10" align="flex-start">
                    <div class="mui-font-size-16">{{ getI18nLabel('register.help', 1) }}</div>
                    <a-button @click="setActiveKey('login')" style="padding: 0" type="link" size="small">
                      <a-flex align="center" class="mui-font-size-20" gap="8">
                        <span>{{ getI18nLabel('register.help', 2) }}</span>
                        <svg-icon name="arrow-right" />
                      </a-flex>
                    </a-button>
                  </a-flex>
                  <a-flex vertical style="line-height: 22px">
                    <span class="mui-font-size-14 mui-desc-text">{{ getI18nLabel('invite.tips.0') }}</span>
                    <span class="mui-font-size-14 mui-desc-text">{{ getI18nLabel('invite.tips.1') }}</span>
                    <span class="mui-font-size-14 mui-desc-text">{{ getI18nLabel('invite.tips.2') }}</span>
                    <span class="mui-font-size-14 mui-desc-text">{{ getI18nLabel('invite.tips.3') }}</span>
                  </a-flex>
                </a-flex>
              </a-flex>
            </div>
          </transition-group>
        </div>
      </div>
    </a-flex>
  </div>
</template>

<script setup>
  import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import MFormItem from '/@/components/mui/m-form-item/m-form-item.vue';
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';
  import { useSlideAnime } from '/@/hooks/use-anime';
  import { useDanmaku } from '/@/hooks/use-danmaku';
  import i18n from '/@/i18n';
  import loginTtitle from '/@/assets/images/login/login-title.png';
  import {
    checkExistence,
    forgotPassword,
    generateCompanyCaptcha,
    generateInviteCaptcha,
    generateJobSeekerCaptcha,
    generateLoginCaptcha,
    getUserInfo,
    loginByPasswordWithCaptcha,
    registerCompany,
    registerInvite,
    registerJobSeeker,
    sendForgotPasswordEmail,
  } from '/@/api/auth';
  import { useUserStore } from '/@/store/modules/system/user';
  import { HOME_PAGE_PATH } from '/@/constants/common-const';
  import LocalStorageKeyConst from '/@/constants/local-storage-key-const';
  import { localSave } from '/@/utils/local-util';
  import { useRoute } from 'vue-router';
  import MPhonePrefixeSelect from '/@/components/mui/m-phone-prefixe-select/m-phone-prefixe-select.vue';
  import { USER_TYPE_ENUM } from '/@/constants/api-const';
  import defaultLogoUrl from '/@/assets/images/logo/logo-white.png';
  import { nextTick } from 'vue';
  import { isMobile } from '/@/utils/common';
  import { getBasicRules } from '/@/config/rule-config';
  const router = useRouter();
  const route = useRoute();
  const userStore = useUserStore();

  const logoUrl = computed(() => userStore.logoUrl || defaultLogoUrl);
  const getI18nLabel = (name, ...arg) => i18n.global.t(`account.${name}`, ...arg);

  const { enter, leave, beforeEnter, beforeLeave } = useSlideAnime();
  const isMobileDevice = isMobile();
  const danmakuResult = isMobileDevice
    ? { danmakuList: ref([]), containerRef: ref(null), trackCount: ref(0) }
    : useDanmaku({
        baseSpeed: 30,
        trackCount: 8,
      });
  const { danmakuList, containerRef, trackCount } = danmakuResult;

  const wrapRef = ref();

  const wrapHeight = ref(482);

  const activeKey = ref(route.query.key || 'login');

  const registerTabKey = ref(route.query.tab === 'company' ? 'company' : 'job');

  const loginFormRef = ref();

  const forgetFormRef = ref();

  const registerFormRef = ref();

  const tabsRef = ref();

  const inviteFormRef = ref();

  const loginForm = reactive({
    email: '',
    captcha: '',
    password: '',
  });

  const forgetForm = reactive({
    countryCode: '+86',
    phone: '',
    email: '',
    emailCode: '',
    password1: '',
    password2: '',
  });

  const createRegisterFormState = () => ({
    email: '',
    password: '',
    telegramAccount: '',
    captcha: '',
  });

  const registerForms = reactive({
    job: createRegisterFormState(),
    company: createRegisterFormState(),
  });

  const inviteForm = reactive({
    inviteCode: route.query.code ?? '',
    email: '',
    password: '',
    telegramAccount: '',
    captcha: '',
  });

  const loading = reactive({
    login: false,
    forget: false,
    register: false,
    invite: false,
    sendEmail: false,
  });

  const showPassword = reactive({
    login: false,
    forgetPassword1: false,
    forgetPassword2: false,
    register: false,
    invite: false,
  });

  const emailCountdown = ref(0);
  let emailTimer = null;

  const createCaptchaState = () => ({ key: '', image: '' });
  const captchas = reactive({
    login: createCaptchaState(),
    registerJob: createCaptchaState(),
    registerCompany: createCaptchaState(),
    invite: createCaptchaState(),
  });

  const captchaApiMap = {
    login: generateLoginCaptcha,
    registerJob: generateJobSeekerCaptcha,
    registerCompany: generateCompanyCaptcha,
    invite: generateInviteCaptcha,
  };

  const getWrapHeight = () => {
    return wrapRef.value?.clientHeight + 80;
  };

  const loginRules = {
    email: [
      { required: true, message: getI18nLabel('placeholder.4'), trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: getI18nLabel('valid.emailFormat'), trigger: 'blur' },
    ],
    captcha: [{ required: true, message: getI18nLabel('placeholder.1'), trigger: 'blur' }],
    password: [{ required: true, message: getI18nLabel('placeholder.2'), trigger: 'blur' }],
  };

  const emailRules = [
    { required: true, message: getI18nLabel('placeholder.4'), trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: getI18nLabel('valid.emailFormat'), trigger: 'blur' },
  ];

  const registerRules = {
    email: [...emailRules, { validator: (rule, value) => validateFieldExistence('register', 'email', rule, value), trigger: 'blur' }],
    password: [{ validator: validateStrongPassword, trigger: 'blur' }],
    telegramAccount: [
      ...getBasicRules(['telegram'], undefined, ['change', 'blur']),
      { validator: (rule, value) => validateFieldExistence('register', 'telegram', rule, value), trigger: 'blur' },
    ],
    captcha: [{ required: true, message: getI18nLabel('placeholder.1'), trigger: 'blur' }],
  };

  const inviteRules = {
    inviteCode: [{ required: true, message: getI18nLabel('placeholder.10'), trigger: 'blur' }],
    email: [...emailRules, { validator: (rule, value) => validateFieldExistence('invite', 'email', rule, value), trigger: 'blur' }],
    password: [{ validator: validateStrongPassword, trigger: 'blur' }],
    telegramAccount: [
      ...getBasicRules(['telegram']),
      { validator: (rule, value) => validateFieldExistence('invite', 'telegram', rule, value), trigger: 'blur' },
    ],
    captcha: loginRules.captcha,
  };

  const forgetRules = {
    phone: [{ required: true, message: getI18nLabel('placeholder.0'), trigger: 'blur' }],
    email: emailRules,
    emailCode: [{ required: true, message: getI18nLabel('placeholder.6'), trigger: 'blur' }],
    password1: [{ validator: validateStrongPassword, trigger: 'blur' }],
    password2: [{ validator: validateConfirmPassword, trigger: 'blur' }],
  };

  const currentRegisterForm = computed(() => registerForms[registerTabKey.value]);
  const currentRegisterCaptcha = computed(() => (registerTabKey.value === 'job' ? captchas.registerJob : captchas.registerCompany));
  const registerCaptchaScene = computed(() => (registerTabKey.value === 'job' ? 'registerJob' : 'registerCompany'));

  const setActiveKey = (key) => {
    activeKey.value = key;
  };

  const handleTelegramGuide = () => {
    window.open('https://web.telegram.org/k/');
  };

  const formatCaptchaImage = (value) => {
    if (!value) return '';
    if (value.startsWith('data:') || value.startsWith('http')) return value;
    return `data:image/png;base64,${value}`;
  };

  const handleRefreshCaptcha = async (scene) => {
    const api = captchaApiMap[scene];
    if (!api) return;
    try {
      const data = await api();
      captchas[scene].key = data?.captchaKey || data?.captchaId || data?.key || data?.id || '';
      captchas[scene].image = formatCaptchaImage(
        data?.captchaImage || data?.captchaBase64 || data?.image || data?.img || data?.imageBase64 || data?.data
      );
    } catch (error) {
      message.error(getI18nLabel('messages.captchaLoadFailed'));
    }
  };

  const onTabsChange = (key) => {
    if (activeKey.value === 'register') {
      ensureCaptcha(key === 'job' ? 'registerJob' : 'registerCompany');
    }
  };

  const ensureCaptcha = (scene) => {
    if (!captchas[scene].key || !captchas[scene].image) {
      handleRefreshCaptcha(scene);
    }
  };

  watch(
    () => activeKey.value,
    (key) => {
      if (key === 'login') {
        ensureCaptcha('login');
      } else if (key === 'register') {
        ensureCaptcha(registerCaptchaScene.value);
      } else if (key === 'invite') {
        ensureCaptcha('invite');
      }
      nextTick(() => {
        wrapHeight.value = getWrapHeight();
      });
    },
    { immediate: true }
  );

  onBeforeUnmount(() => {
    if (emailTimer) {
      clearInterval(emailTimer);
      emailTimer = null;
    }
  });

  async function handleLoginAfterRegister(loginResponse) {
    if (loginResponse?.token) {
      localSave(LocalStorageKeyConst.USER_TOKEN, loginResponse.token);
      userStore.setToken(loginResponse.token);
    }
    await hydrateUserInfo();
    switch (userStore.userType) {
      case USER_TYPE_ENUM.PERSON.value:
        router.push({ name: 'user-center' });
        break;
      case USER_TYPE_ENUM.COMPANY.value:
        router.push({ name: 'enterprise-center' });
        break;
      case USER_TYPE_ENUM.INVITED.value:
        router.push({ name: 'invite-center' });
        break;
    }
  }

  async function handleLogin() {
    try {
      await loginFormRef.value?.validate();
      if (!captchas.login.key) {
        await handleRefreshCaptcha('login');
      }
      loading.login = true;
      const payload = {
        email: loginForm.email,
        captcha: loginForm.captcha,
        captchaKey: captchas.login.key,
        password: loginForm.password,
      };

      const loginResponse = await loginByPasswordWithCaptcha(payload);
      await handleLoginAfterRegister(loginResponse);
    } catch (error) {
      if (error?.errorFields) return;
      handleRefreshCaptcha('login');
    } finally {
      loading.login = false;
    }
  }

  async function handleRegisterSubmit() {
    const scene = registerCaptchaScene.value;
    const api = scene === 'registerJob' ? registerJobSeeker : registerCompany;

    try {
      await registerFormRef.value?.validate();
      if (!captchas[scene].key) {
        await handleRefreshCaptcha(scene);
      }
      loading.register = true;

      const payload = {
        email: currentRegisterForm.value.email,
        password: currentRegisterForm.value.password,
        telegramAccount: currentRegisterForm.value.telegramAccount,
        captcha: currentRegisterForm.value.captcha,
        captchaKey: captchas[scene].key,
      };

      const registerResponse = await api(payload);
      // 如果注册返回了token，自动登录
      if (registerResponse?.token) {
        await handleLoginAfterRegister(registerResponse);
      } else {
        message.success(getI18nLabel('messages.registerSuccess'));
        Object.assign(registerForms[registerTabKey.value], createRegisterFormState());
        setActiveKey('login');
        handleRefreshCaptcha(scene);
      }
    } catch (error) {
      if (error?.errorFields) return;
      handleRefreshCaptcha(scene);
    } finally {
      loading.register = false;
    }
  }

  async function handleInviteSubmit() {
    try {
      await inviteFormRef.value?.validate();
      if (!captchas.invite.key) {
        await handleRefreshCaptcha('invite');
      }
      loading.invite = true;
      const payload = {
        inviteCode: inviteForm.inviteCode,
        email: inviteForm.email,
        password: inviteForm.password,
        telegramAccount: inviteForm.telegramAccount,
        captcha: inviteForm.captcha,
        captchaKey: captchas.invite.key,
      };
      const registerResponse = await registerInvite(payload);
      // 如果注册返回了token，自动登录
      if (registerResponse?.token) {
        await handleLoginAfterRegister(registerResponse);
      } else {
        Object.assign(inviteForm, {
          inviteCode: '',
          countryCode: '+86',
          email: '',
          password: '',
          telegramAccount: '',
          captcha: '',
        });
        setActiveKey('login');
        handleRefreshCaptcha('invite');
      }
    } catch (error) {
      if (error?.errorFields) return;
      handleRefreshCaptcha('invite');
    } finally {
      loading.invite = false;
    }
  }

  async function handleResetPassword() {
    try {
      await forgetFormRef.value?.validate();
      loading.forget = true;
      const payload = {
        countryCode: forgetForm.countryCode,
        phone: forgetForm.phone,
        email: forgetForm.email,
        verifyCode: forgetForm.emailCode,
        password: forgetForm.password1,
        confirmPassword: forgetForm.password2,
      };
      await forgotPassword(payload);
      message.success(getI18nLabel('messages.passwordResetSuccess'));
      setActiveKey('login');
    } finally {
      loading.forget = false;
    }
  }

  async function handleSendEmailCode() {
    if (!forgetForm.email || emailCountdown.value > 0 || !forgetForm.phone) return;
    try {
      loading.sendEmail = true;
      await sendForgotPasswordEmail(forgetForm);
      message.success(getI18nLabel('messages.emailCodeSent'));
      emailCountdown.value = 60;
      emailTimer = setInterval(() => {
        if (emailCountdown.value <= 1) {
          clearInterval(emailTimer);
          emailTimer = null;
          emailCountdown.value = 0;
        } else {
          emailCountdown.value -= 1;
        }
      }, 1000);
    } finally {
      loading.sendEmail = false;
    }
  }

  async function hydrateUserInfo() {
    try {
      const userInfo = await getUserInfo();
      await userStore.setUserLoginInfo({
        ...userInfo,
        menuList: userInfo?.userDetails?.menus ?? [],
      });
    } catch (error) {
      message.warning(getI18nLabel('messages.getUserInfoFailed'));
    }
  }

  function validateStrongPassword(_rule, value) {
    if (!value) {
      return Promise.reject(new Error(getI18nLabel('valid.password')));
    }
    const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!reg.test(value)) {
      return Promise.reject(new Error(getI18nLabel('valid.min', { num: 6 })));
    }
    return Promise.resolve();
  }

  function validateConfirmPassword(_rule, value) {
    if (!value) {
      return Promise.reject(new Error(getI18nLabel('valid.password')));
    }
    if (value !== forgetForm.password1) {
      return Promise.reject(new Error(getI18nLabel('valid.passwordNotMatch')));
    }
    return Promise.resolve();
  }

  /**
   * 统一的注册字段防重校验方法
   * 整合邀请人注册、个人注册和企业注册的邮箱和Telegram防重校验
   * @param {string} registrationType - 注册类型：'personal' | 'company' | 'invite'
   * @param {string} fieldType - 字段类型：'email' | 'telegram'
   * @param {string} value - 待校验的值
   * @returns {Promise}
   */
  async function validateRegistrationFieldDuplication(registrationType, fieldType, value) {
    if (!value) {
      return Promise.resolve();
    }

    // 获取对应的表单数据
    let formData;
    switch (registrationType) {
      case 'personal':
      case 'company':
        formData = currentRegisterForm.value;
        break;
      case 'invite':
        formData = inviteForm;
        break;
      default:
        return Promise.resolve();
    }

    try {
      const payload = {};

      if (fieldType === 'email') {
        payload.email = value;
      } else if (fieldType === 'telegram') {
        payload.telegramAccount = value;
        // 邀请人注册的Telegram校验还需要传递邮箱
        if (registrationType === 'invite') {
          payload.email = formData.email;
        }
      }

      const response = await checkExistence(payload);

      // axios拦截器会返回res.data，所以直接检查response.success
      // 如果success为false，说明字段值已存在
      const errorMessage = fieldType === 'email' ? getI18nLabel('valid.emailExists') : getI18nLabel('valid.telegramExists');

      if (response?.success === false) {
        return Promise.reject(new Error(errorMessage));
      }
      return Promise.resolve();
    } catch (error) {
      // 如果接口返回业务错误，检查响应数据
      const responseData = error?.response?.data;
      if (responseData?.data?.success === false || responseData?.success === false) {
        const errorMessage = fieldType === 'email' ? getI18nLabel('valid.emailExists') : getI18nLabel('valid.telegramExists');
        return Promise.reject(new Error(errorMessage));
      }
      // 网络错误或其他错误，不阻止用户继续填写表单
      return Promise.resolve();
    }
  }

  /**
   * 统一的字段存在性校验方法
   * @param {string} registrationType - 注册类型：'personal' | 'company' | 'invite'
   * @param {string} fieldType - 字段类型：'email' | 'telegram'
   * @param {Object} _rule - 验证规则对象
   * @param {string} value - 待校验的值
   * @returns {Promise}
   */
  async function validateFieldExistence(registrationType, fieldType, _rule, value) {
    // 将旧的 'register' 类型映射到具体的注册类型
    const mappedType = registrationType === 'register' ? (registerTabKey.value === 'job' ? 'personal' : 'company') : registrationType;
    return validateRegistrationFieldDuplication(mappedType, fieldType, value);
  }

  onMounted(() => {
    wrapHeight.value = getWrapHeight();
  });
</script>

<style lang="less" scoped>
  .login {
    position: relative;
    overflow: hidden;
    background-image: url('/@/assets/images/login/background.png');
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 40px;

    .login-logo {
      width: 1440px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 12px;
    }

    .login-danmaku-container {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }

    .danmaku-item {
      position: absolute;
      white-space: nowrap;
      font-weight: 500;
      user-select: none;
      will-change: left;
    }

    .login-body {
      position: relative;
      z-index: 1;

      box-sizing: border-box;
      width: 840px;
      background: @base-bg-color;
      border-radius: 8px;
      overflow: hidden;
      transition: height 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding: 0 50px;
    }

    .wrap {
      box-sizing: border-box;
    }
    .login-content {
      .logi-content-title {
        font-size: 28px;
        text-align: center;
        color: @primary-color;
      }
      .line {
        width: 1px;
        align-self: stretch;
        background: @border-color;
      }
    }

    .register-tabs {
      :deep(.ant-tabs-tab) {
        font-size: 20px;
        padding-bottom: 6px;
        padding-top: 0;
        .ant-tabs-tab-btn {
          line-height: 37px;
        }
        &.ant-tabs-tab-active {
          font-size: 28px;
          font-weight: 700;
        }
      }
      :deep(.ant-tabs-nav) {
        margin-bottom: 0;
        &:before {
          border-bottom: none;
        }
      }
      :deep(.ant-tabs-ink-bar) {
        background: transparent !important;
        height: 4px;
        display: flex;
        justify-content: center;
        &:before {
          content: '';
          display: block;
          width: 30px;
          border-radius: 12px;
          background-color: @primary-color !important;
        }
      }
    }
  }
</style>

<route>
{
parentId: 0,
hideInMenu: true,
auth: 'login',
}
</route>
