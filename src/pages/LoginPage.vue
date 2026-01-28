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

const goToLogin = () => {
  step.value = 'login';
  error.value = '';
};

const login = () => {
  error.value = '';
  const result = auth.login(username.value.trim(), password.value);
  if (!result.ok) {
    error.value = result.message;
    return;
  }
  router.push({ name: 'form' });
};

const sendCode = () => {
  error.value = '';
  if (!auth.hasUser(username.value.trim())) {
    error.value = 'کاربر یافت نشد.';
    return;
  }
  window.alert('کد بازیابی: 123456');
  step.value = 'verify';
};

const resetPassword = () => {
  error.value = '';
  const result = auth.resetPassword(
    username.value.trim(),
    code.value.trim(),
    newPassword.value,
  );
  if (!result.ok) {
    error.value = result.message;
    return;
  }
  window.alert('رمز عبور با موفقیت تغییر کرد.');
  code.value = '';
  newPassword.value = '';
  step.value = 'login';
};
</script>

<template>
  <div class="flex min-h-[80vh] items-center justify-center">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body text-center">
        <h2 class="text-2xl font-bold text-primary">سامانه ثبت پرداخت هوشمند</h2>
        <p class="text-base text-base-content/60">آواگستر اندیشان شرق</p>

        <div v-if="step === 'login'" class="mt-6 space-y-4">
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
          <button class="btn btn-primary w-full" type="button" @click="login">
            ورود
          </button>
          <button class="btn btn-link" type="button" @click="step = 'forgot'">
            فراموشی رمز عبور؟
          </button>
        </div>

        <div v-else-if="step === 'forgot'" class="mt-6 space-y-4">
          <label class="form-control w-full">
            <span class="label-text">نام کاربری</span>
            <input
              v-model.trim="username"
              class="input input-bordered"
              placeholder="نام کاربری"
            />
          </label>
          <button class="btn btn-primary w-full" type="button" @click="sendCode">
            ارسال کد تایید
          </button>
          <button class="btn btn-ghost" type="button" @click="goToLogin">
            بازگشت
          </button>
        </div>

        <div v-else class="mt-6 space-y-4">
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
          <button class="btn btn-primary w-full" type="button" @click="resetPassword">
            تغییر رمز عبور
          </button>
          <button class="btn btn-ghost" type="button" @click="goToLogin">
            بازگشت
          </button>
        </div>

        <p v-if="error" class="text-sm text-error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>
