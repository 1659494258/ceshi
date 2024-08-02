import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Layout from "../views/layout/layout.vue";
const history = createWebHistory();
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/policyCenter/componentDefinition/product"
  },
  {
    path: "/policyCenter",
    component: Layout,
    children: [
      {
        path: "componentDefinition/product",
        // component: () => import("../views/productCenter/productCenter.vue"),
        component: () => import("../views/policyCenter/componentDefinition/product.vue"),
      },
      {
        path: "componentDefinition/afterLoaning",
        component: () => import("../views/policyCenter/componentDefinition/afterLoaning.vue"),
      },
      {
        path: "componentDefinition/authorization",
        component: () => import("../views/policyCenter/componentDefinition/authorization.vue"),
      },
      {
        path: "productDefinition/productDefinition",
        component: () => import("../views/policyCenter/productDefinition/productDefinition.vue"),
      },
      {
        path: "processManage/productPost",
        component: () => import("../views/policyCenter/processManage/productPost.vue"),
      },
      {
        path: "processManage/riskPost",
        component: () => import("../views/policyCenter/processManage/riskPost.vue"),
      },
      {
        path: "processManage/operationPost",
        component: () => import("../views/policyCenter/processManage/operationPost.vue"),
      },
      {
        path: "processManage/financialPost",
        component: () => import("../views/policyCenter/processManage/financialPost.vue"),
      },
      {
        path: "processManage/systemPost",
        component: () => import("../views/policyCenter/processManage/systemPost.vue"),
      },
      {
        path: "productPolicyMaintain/productPolicyMaintain",
        component: () => import("../views/policyCenter/productPolicyMaintain/productPolicyMaintain.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login/login.vue"),
  },
  {
    path: "/product",
    name: "product",
    component: () => import("../views/productCenter/product.vue"),
  },
  {
    path: "/productCenter",
    name: "productCenter",
    component: () => import("../views/productCenter/productCenter.vue"),
  },
  {
    path: "/home",
    name: "LayOut",
    component: Layout,
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("../views/home/home.vue"),
      },
      {
        path: "index",
        name: "index",
        component: () => import("../views/home/index.vue"),
      },
    ],
  },
  {
    path: "/productCenter",
    component: Layout,
    children: [
      {
        path: "/index",
        component: () => import("../views/productCenter/productCenter.vue"),
      },
    ],
  },
  // {
  //   path: "/index",
  //   name: "index",
  //   component: () => import("../views/home/index.vue"),
  // },

];
const router = createRouter({
  history,
  routes,
});
router.beforeEach((to, from) => { });
router.afterEach((to, from) => {
  // console.log('路由跳转完成')
});
export default router;
