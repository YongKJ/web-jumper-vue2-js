import Vue from 'vue'
import App from './App.vue'
import router from './router'

import APlayer from '@moefe/vue-aplayer-latest';
Vue.use(APlayer, {
  defaultCover: 'https://github.com/u3u.png',
  productionTip: false,
});

  import HappyScroll from "vue-happy-scroll";
import "vue-happy-scroll/docs/happy-scroll.css";

Vue.use(HappyScroll);

import "element-ui/lib/theme-chalk/index.css";
import {ElementUI} from "@/common/config/ElementUI";

Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
  switch (to.path) {
    case "/test":
      document.title = to.meta?.title;
      next();
      break;
    case "/":
      next();
      break;
    default:
      next({path: "/"});
  }
});

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
