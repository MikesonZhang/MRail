  import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router';

  import homeIndexPage from "../views/homePage/homeIndexPage.vue";
  import schedulingRoute from "../views/schedulingRoute/index.vue";
  import ticketsPage from "../views/tickets/ticketsPage.vue";
  import timetablePage from "../views/timetable/timetablePage.vue";
  import eltable from "../components/testPage/eltable.vue"

  const routes = [
    { path: '/', component: homeIndexPage },
    { path: '/schedulingRoute', component: schedulingRoute },
    { path: '/ticketsPage/:id', component: ticketsPage },
    { path: '/timetablePage', component: timetablePage },
    { path: '/eltable', component: eltable },
  ];

  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  });

  export default router;
