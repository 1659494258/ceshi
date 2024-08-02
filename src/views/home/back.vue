<template>
  <div class="">dsfksddfagafsdg</div>
</template>
<script setup lang="ts">
import { ref, onMounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
// 跳转至指定页面

const reload = inject("reload");

const url = ref();
onMounted(() => {
  router.replace({
    path: "/home/index",
  });
  console.log("router:", router.currentRoute.value.query.path);
  url.value = router.currentRoute.value.query.path;
  const param = {
    UserID: "admin",
    Password: "000000als",
  };
  console.log(param);
});
</script>

<style scoped></style>
