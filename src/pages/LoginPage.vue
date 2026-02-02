<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

const router = useRouter();
const auth = useAuthStore();

const step = ref('login');
const username = ref('');
const password = ref('');
const code = ref('');
const newPassword = ref('');
const error = ref('');
const loading = ref(false);

const goToLogin = () => {
  step.value = 'login';
  error.value = '';
};

const login = async () => {
  if (loading.value) return;
  error.value = '';
  loading.value = true;
  const result = await auth.login(username.value.trim(), password.value);
  loading.value = false;
  if (!result.ok) {
    error.value = result.message;
    return;
  }
  router.push({ name: 'form' });
};

const sendCode = async () => {
  if (loading.value) return;
  error.value = '';
  loading.value = true;
  const result = await auth.requestResetCode(username.value.trim());
  loading.value = false;
  if (!result.ok) {
    error.value = result.message;
    return;
  }
  step.value = 'verify';
};

const resetPassword = async () => {
  if (loading.value) return;
  error.value = '';
  loading.value = true;
  const result = await auth.resetPassword(
    username.value.trim(),
    code.value.trim(),
    newPassword.value,
  );
  loading.value = false;
  if (!result.ok) {
    error.value = result.message;
    return;
  }
  code.value = '';
  newPassword.value = '';
  step.value = 'login';
};
</script>

<template>
  <div class="flex min-h-[80vh] items-center justify-center">
    <div class="w-full max-w-md">
      <div class="mb-6 text-center">
        <h1 class="text-3xl font-bold text-primary">سامانه ثبت پرداخت هوشمند</h1>
        <p class="mt-2 text-sm text-base-content/60">ورود امن و مدیریت متمرکز پرداخت‌ها</p>
      </div>
      <div class="app-card-strong">
        <div class="card-body text-center">
          <div class="mb-4 rounded-2xl bg-base-200/70 px-4 py-3 text-sm text-base-content/70">
            آواگستر اندیشان شرق
          </div>

          <div v-if="step === 'login'" class="mt-6 space-y-4 text-right">
            <label class="form-control w-full">
              <span class="label-text">نام کاربری</span>
              <input
                v-model.trim="username"
                class="input input-bordered"
                placeholder="نام کاربری را وارد کنید"
              />
            </label>
            <label class="form-control w-full">
              <span class="label-text">رمز عبور</span>
              <input
                v-model="password"
                type="password"
                class="input input-bordered"
                placeholder="رمز عبور"
              />
            </label>
            <button class="btn btn-primary w-full" type="button" :disabled="loading" @click="login">
              {{ loading ? 'در حال بررسی...' : 'ورود' }}
            </button>
            <button class="btn btn-ghost btn-sm" type="button" @click="step = 'forgot'">
              فراموشی رمز عبور؟
            </button>
          </div>

          <div v-else-if="step === 'forgot'" class="mt-6 space-y-4 text-right">
            <label class="form-control w-full">
              <span class="label-text">نام کاربری</span>
              <input
                v-model.trim="username"
                class="input input-bordered"
                placeholder="نام کاربری"
              />
            </label>
            <button class="btn btn-primary w-full" type="button" :disabled="loading" @click="sendCode">
              {{ loading ? 'در حال ارسال...' : 'ارسال کد تایید' }}
            </button>
            <button class="btn btn-ghost btn-sm" type="button" @click="goToLogin">
              بازگشت
            </button>
          </div>

          <div v-else class="mt-6 space-y-4 text-right">
            <label class="form-control w-full">
              <span class="label-text">کد تایید</span>
              <input v-model.trim="code" class="input input-bordered" placeholder="123456" />
            </label>
            <label class="form-control w-full">
              <span class="label-text">رمز عبور جدید</span>
              <input
                v-model="newPassword"
                type="password"
                class="input input-bordered"
                placeholder="رمز جدید"
              />
            </label>
            <button class="btn btn-primary w-full" type="button" :disabled="loading" @click="resetPassword">
              {{ loading ? 'در حال ذخیره...' : 'تغییر رمز عبور' }}
            </button>
            <button class="btn btn-ghost btn-sm" type="button" @click="goToLogin">
              بازگشت
            </button>
          </div>

          <p v-if="error" class="text-sm text-error">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
