import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "./views/Dashboard.vue";
import Header from "./views/Header.vue";

Vue.use(VueRouter);

const routerOptions = {
  mode: "history",
  routes: [{ path: "/", name: "root", components: { default: Dashboard } }]
};

routerOptions.routes.forEach(route => {
  // set default header/footer if not set
  if (!route.components.header) {
    route.components.header = Header;
  }
});

const router = new VueRouter(routerOptions);

export default router;
