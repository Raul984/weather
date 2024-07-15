import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import FavoritePage from '../pages/FavoritePage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/favorites', component: FavoritePage }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
