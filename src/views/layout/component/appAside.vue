<template>
  <el-aside>
    <div class="aside">
      <el-menu
        :default-active="activeIndex"
        text-color="#717376"
        active-text-color="#0052d9"
        class="el-menu-vertical-demo"
      >
        <template v-for="(item, index) in list" dealNavLink :key="index">
          <el-menu-item v-if="!item.children" :index="item.id" @click="dealNavLink(item.path, item.id)">
            <template #title>
              <el-icon :size="15"><component :is="item.icon" /></el-icon>
              <span class="menuItem">{{ item.title }}</span>
            </template>
          </el-menu-item>
          <el-sub-menu v-else :index="item.id">
            <template #title>
              <el-icon :size="15"><component :is="item.icon" /></el-icon>
              <span class="menuItem">{{ item.title }}</span>
            </template>
            <el-menu-item
              v-for="subItem in item.children"
              :index="subItem.id"
              :key="subItem.id"
              @click="dealNavLink(subItem.path, subItem.id)"
            >
              <el-icon :size="15"><component :is="subItem.icon" /></el-icon>
              <span class="menuItem">{{ subItem.title }}</span>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, onUpdated, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import menuConfig from '../../../assets/menuConfig.json'

const activeIndex = ref()
let list: any = ref([])
const router = useRouter()
const props = defineProps({
  menuList: Array,
})

onMounted(() => {
  activeIndex.value = window.sessionStorage.getItem('sonId')
  let son: any = props.menuList
  let menu: any = window.localStorage.getItem('sonList')
  if (menu === '[]') {
    window.localStorage.setItem('sonList', JSON.stringify(son))
    menu = window.localStorage.getItem('sonList')
  } else {
  }
  list.value = JSON.parse(menu)
})
const dealNavLink = (activePath: string, activeId: string) => {
  console.log(activePath)
  router.push({
    path: activePath,
    // query: {
    //   path: activePath,
    // },
  })
  // 要把activeId持久化
  window.sessionStorage.setItem('sonId', activeId)
  activeIndex.value = activeId
}
nextTick(() => {})
onUpdated(() => {})
</script>

<style lang="scss" scoped>
.menuItem {
  font-size: 14px;
}
.el-aside {
  width: auto;
}
.el-menu {
  height: 95%;
  border: none !important;
}
.aside {
  height: 100%;
  background: #fff;
}
</style>
