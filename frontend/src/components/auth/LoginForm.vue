<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-full max-w-md shadow-xl bg-base-100">
      <div class="card-body">
        <h2 class="text-3xl font-bold text-center mb-4">Login to Berry-Proof</h2>
        <p class="text-sm text-center text-base-content/70 mb-6">
          Please authenticate to continue
        </p>

        <button
          class="btn btn-primary w-full"
          @click="handleLogin"
        >
          Login with Auth0
        </button>

        <p class="text-sm text-center mt-4 text-base-content/60">
          No account? Ask your admin for access.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();

const handleLogin = () => {
  authStore.login();
};
</script>
