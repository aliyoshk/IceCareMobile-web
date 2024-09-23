import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './presentation/router'
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import VueApexCharts from 'vue3-apexcharts';

const app = createApp(App)

app.use(router)

app.use(createPinia());

app.use(Toast);

app.use(VueApexCharts);
app.component('apexchart', VueApexCharts);

app.mount('#app')
