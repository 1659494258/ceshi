<template>
  <el-header style="background-color: #0052d9">
    <div class="header-left">
      <img class="imgLogo" src="../../../assets/images/logo-small.png" @click="gohome" />
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#0052d9"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
      >
        <template v-for="(item, index) in menuList" :key="index">
          <el-menu-item v-if="!item.children" :index="item.id" @click="dealNavLink(item.path, item.id)">
            <template #title>
              <el-icon :size="16"><component :is="item.icon" /></el-icon>
              <span class="menuItem">{{ item.title }}</span>
            </template>
          </el-menu-item>
          <el-sub-menu v-else :index="item.id">
            <template #title>{{ item.title }}</template>
            <el-menu-item
              v-for="subItem in item.children"
              :index="subItem.id"
              :key="subItem.id"
              @click="dealNavLink(subItem.path, subItem.id)"
            >
              {{ subItem.title }}
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
    <div class="header-right">
      <p style="color: #fff">{{ user.userId }}:{{ user.role }}</p>
      <el-dropdown>
        <el-icon class="right-item" color="#fff">
          <Avatar />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleCommand('1')" data-command="1">用户1</el-dropdown-item>
            <el-dropdown-item @click="handleCommand('2')" data-command="2">用户2</el-dropdown-item>
            <el-dropdown-item @click="handleCommand('3')" data-command="3">用户3</el-dropdown-item>
            <el-dropdown-item @click="handleCommand('4')" data-command="4">用户4</el-dropdown-item>
            <el-dropdown-item @click="handleCommand('5')" data-command="4">用户5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-icon class="right-item" @click="open" color="#fff">
        <SwitchButton />
      </el-icon>
    </div>
  </el-header>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logut } from '../../../services/index'
import menuConfig from '../../../assets/menuConfig.json'
import fatherData from '../../../assets/father.json'
import sonData from '../../../assets/son.json'
import { ElMessage, ElMessageBox } from 'element-plus'

const changeStatus = defineEmits(['changeStatus'])
const router = useRouter()
const menuList: any = ref(JSON.stringify(fatherData))
const son = ref(JSON.stringify(sonData))
const activeIndex = ref()
const name = ref()
const roleType = ref(null) //用户类型
const org = ref()
const email = ref()
const language = ref()
const mobile = ref()
const compTel = ref()
const onSubmit = () => {}
const userList = {
  '1': {
    userId: 'test11',
    orgId: '637582',
    roleType: '1',
    role: '产品岗',
    flowPhase: '2',
  },
  '2': {
    userId: 'test12',
    orgId: '637582',
    roleType: '2',
    role: '风险岗',
    flowPhase: '3',
  },
  '3': {
    userId: 'test13',
    orgId: '637582',
    roleType: '3',
    role: '运营岗',
    flowPhase: '4',
  },
  '4': {
    userId: 'test14',
    orgId: '637582',
    roleType: '4',
    role: '财务岗',
    flowPhase: '5',
  },
  '5': {
    userId: 'test99',
    orgId: '637582',
    roleType: '5',
    role: '系统岗',
    flowPhase: '6',
  },
}
const user = ref(JSON.parse(window.localStorage.getItem('user')))
if (!user.value) {
  window.localStorage.setItem('user', JSON.stringify(userList[1]))
}
onMounted(() => {
  menuList.value = JSON.parse(menuList.value)
  const List = window.localStorage.getItem('menuInfo')
  const info = window.localStorage.getItem('personInfo')
  roleType.value = user.roleType
  // roleType.value = window.localStorage.getItem('roleType')
  // console.log('roleType', roleType.value)
  activeIndex.value = window.sessionStorage.getItem('activeId')
})
const selectChange = (val: any) => {
  roleType.value = val
  window.localStorage.setItem('roleType', val)
  window.localStorage.setItem('user', JSON.stringify(userList[val]))
  console.log('selectChange', userList[val])
}
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleCommand = (type: string) => {
  roleType.value = type
  window.localStorage.setItem('roleType', type)
  window.localStorage.setItem('user', JSON.stringify(userList[type]))
  user.value = JSON.parse(window.localStorage.getItem('user'))
  location.reload(true) //重新加载页面,刷新数据
}
//点击menu选项进行跳转，应该是还需要一个验证cookie的接口进行验证
const dealNavLink = (activePath: string, activeId: string) => {
  console.log(activePath)
  let list = JSON.parse(son.value)
  let sonList = []
  for (let index = 0; index < list.length; index++) {
    if (list[index].prentID === activeId) {
      sonList.push(list[index])
    }
  }
  console.log(sonList, 'sonList')
  window.localStorage.setItem('sonList', JSON.stringify(sonList))
  if (sonList.length != 0) {
    changeStatus('changeStatus', true, sonList)
    router.push({
      path: '/policyCenter',
    })
  } else {
    changeStatus('changeStatus', false, sonList)
    router.push({
      path: '/home',
      query: {
        path: activePath,
      },
    })
  }
  // 要把activeId持久化
  window.sessionStorage.setItem('activeId', activeId)
  activeIndex.value = activeId
}
// 返回首页
const gohome = () => {
  changeStatus('changeStatus', false, [])
  window.sessionStorage.clear()
  window.localStorage.clear()
  router.push({
    path: '/index',
  })
}
// 退出登录
const open = () => {
  ElMessageBox.confirm('你确定要退出吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    center: true,
  })
    .then(() => {
      //   logut().then((res) => {
      ElMessage({
        type: 'success',
        message: '退出成功',
      })
      router.push({
        path: '/login',
        query: {},
      })
      //   })
    })
    .catch(() => {
      // ElMessage({
      //   type: 'error',
      //   message: '退出失败',
      // })
    })
}
</script>
<style lang="scss">
.imgLogo {
  cursor: pointer;
}
.menuItem {
  font-size: 18px;
  font-weight: bold;
}
:deep(.el-menu--horizontal > .el-menu-item .is-active) {
  border-bottom: 2px solid #0052d9;
  color: #0052d9 !important;
  background-color: #fff !important;
}
.el-menu--horizontal {
  border: none;
  width: 95%;
  // width: 98%;
}
.el-header {
  width: 100%;
  padding: 0;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #dcdfe6;
  color: #303133;
  .header-left {
    display: flex;
    align-items: center;
    width: 85%;
    padding-left: 15px;
    box-sizing: border-box;
    img {
      height: 70%;
      margin-right: 60px;
    }
  }
  .header-right {
    display: flex;
    align-items: center;
    margin-right: 20px;
    // width: 20%;
    .right-item {
      // color: #fff;
      cursor: pointer;
      margin: 0 10px;
    }
    .right-item:hover {
      // color: #ffd04b;
      cursor: pointer;
    }
  }
}
</style>
