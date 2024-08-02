<template>
  <el-main>
    <!--路由的出口-->
    <router-view :key="$route.fullPath"></router-view>
  </el-main>
</template>
<script setup lang="ts"></script>
<style lang="scss">
.el-main {
  width: 100%;
  height: 100%;
  padding: 10px 0 0 10px;
  background-color: #f2f2f2;
}
</style>
