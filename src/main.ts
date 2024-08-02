createApp(App).mount("#app");
//main.ts

import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// element-plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
// axios
// import axios from 'axios';
import VueAxios from "vue-axios";

import { Request } from "./services/request";
//导入router配置文件
import router from "./route/router";
// 图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);
//全局注册

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(router);
app.use(ElementPlus, { locale: zhCn });
app.use(VueAxios, Request.init());

app.mount("#app");
