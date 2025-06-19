import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'
import App from './App.vue'
import router from './router'
import { createORM } from 'pinia-orm';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia().use(createORM()).use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(pinia)
app.use(PiniaColada, {})
app.use(router)

app.mount('#app')
