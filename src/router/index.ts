import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import EventView from '../views/EventView.vue'
import ViewEvent from '../components/ViewEvent.vue'
import AddEvent from '../components/AddEvent.vue'
import EditEvent from '../components/UpdateEvent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/events',
      name: 'events',
      component: EventView,
    },
    {
      path: '/events/:id',
      name: 'view-event',
      component: ViewEvent,
      props: true,
    },
    {
      path: '/events/add',
      name: 'add-event',
      component: AddEvent,
    },
    {
      path: '/events/:id/edit',
      name: 'edit-event',
      component: EditEvent,
      props: true,
    },
  ],
})

export default router
