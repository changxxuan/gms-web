import { createApp } from 'vue';
import {router} from '@/router';
import App from './App.vue';
import './style.css';
import TDesign from 'tdesign-vue-next';
import TDesignChat from '@tdesign-vue-next/chat'; // 引入chat组件
import 'tdesign-vue-next/es/style/index.css'; // 引入少量全局样式变量

import { i18n } from './locales';

const app = createApp(App);

app.use(TDesign)
   .use(TDesignChat)
   .use(router)
   .use(i18n);

app.mount('#app');
