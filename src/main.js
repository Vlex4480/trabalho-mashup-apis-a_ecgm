// main.js (para Vue 3)
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

// Axios default config
axios.defaults.baseURL = 'https://trabalho-2-mashup-apis-a-ecgm-backend.onrender.com/api';
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}


const app = createApp(App);
app.use(router);
app.mount('#app');
