import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: {
      name: "visual"
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
  {
    path: '/visual',
    name: 'visual',
    meta: {
      title: 'Visualized Analysis Test'
    },
    component: () => import('@/views/VisualizedAnalysis.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
