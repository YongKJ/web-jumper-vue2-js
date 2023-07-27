import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: {
      name: "test"
    }
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/views/DemoTest.vue"),
    meta: {
      title: "例子测试"
    }
  },
]

const router = new VueRouter({
  routes
})

export default router
