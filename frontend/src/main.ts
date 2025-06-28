import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'
import App from './App.vue'
import router from './router'
import { createORM } from 'pinia-orm';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { initAuth0 } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

await initAuth0();
const pinia = createPinia().use(createORM()).use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(pinia)

const authStore = useAuthStore();
await authStore.handleAuth();

app.use(PiniaColada, {})
app.use(router)

app.mount('#app')
