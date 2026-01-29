import { createRouter, createWebHistory } from 'vue-router';

import Chat from '@/views/Chat.vue';


const routes = [
  {
    path: '/gms',
    name: 'GMS',
    component: Chat,
    meta: {
      icon: h(Icon, { icon: 'ph:list-heart' })
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export { router };
