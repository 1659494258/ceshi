<template>
  <div class="common-layout">
    <el-container>
      <AppHeader :showStatus="showStatus" @changeStatus="changeStatus"></AppHeader>
      <el-container class="center">
        <AppAside v-if="showStatus" :showStatus="showStatus" :key="state.timer" :menuList="list.menuList"></AppAside>
        <AppMain></AppMain>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './component/appHeader.vue'
import AppMain from './component/appMain.vue'
import AppAside from './component/appAside.vue'
import { ref, reactive, onMounted } from 'vue'
const activeIndex = ref()
const isCollapse = ref(false)
const showStatus = ref(true)
let menuList = ref([])
let list = reactive({ menuList: [] })
const state = reactive({
  timer: 0,
})

const reload = () => {
  state.timer = new Date().getTime()
}
onMounted(() => {
  if (window.sessionStorage.getItem('status') === 'true') {
    showStatus.value = true
  } else {
    showStatus.value = false
  }
})
const changeStatus = (status: any, List: any) => {
  window.sessionStorage.setItem('status', status)
  console.log(window.sessionStorage.getItem('status'))
  showStatus.value = status
  list.menuList = List
  reload()
  console.log(status, list.menuList)
}
</script>

<style lang="scss">
.common-layout {
  width: 100%;
  height: 100%;
}
.el-container {
  display: block;
  width: 100%;
  height: 93%;
}
.el-aside {
  width: auto;
}
.aside {
  height: 100%;
  // background: #fff;
}
.center {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
