import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAuth0Client } from '@/services/auth.service';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const user = ref<any>(null);
  const accessToken = ref<string | null>(null);

  const login = async () => {
    const auth0 = getAuth0Client();
    await auth0.loginWithRedirect(
      {
        appState: { returnTo: '/dashboard' }
      }
    );
  };

  const logout = async () => {
    const auth0 = getAuth0Client();
    accessToken.value = null;
    await auth0.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const handleAuth = async () => {
    const auth0 = getAuth0Client();
    console.log(auth0);
  console.log(await auth0.isAuthenticated());

    isAuthenticated.value = await auth0.isAuthenticated();
    if (isAuthenticated.value) {
      user.value = await auth0.getUser();

      const auth0Token = await auth0.getTokenSilently();
      const res = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth0Token}`,
        },
      });

      const data = await res.json();
      accessToken.value = data.access_token; // this is our own Berry-issued JWT
    }
  };

  return {
    isAuthenticated,
    user,
    accessToken,
    login,
    logout,
    handleAuth,
  };
});
