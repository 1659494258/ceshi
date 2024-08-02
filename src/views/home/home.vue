<template>
  <div class="content"
       v-loading="loadingStatus"
       element-loading-text="拼命加载中，请稍后..."
       element-loading-svg-view-box="-10, -10, 50, 50"
       element-loading-background="rgba(122, 122, 122, 0.8)">
    <iframe @load="loading"
            name="myiframe"
            id="iframe"
            ref="fiframe"
            :src="url"
            frameborder="0"
            align="middle"
            width="100%"
            height="700px"></iframe>
  </div>
</template>
<script setup lang="ts">
import { Loading } from 'element-plus/es/components/loading/src/service'
import { ElLoading } from 'element-plus'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../../services/index'
const iframe = ref()
const loadingStatus = ref()
const router = useRouter()
const url = ref()

onMounted(() => {
  loadingStatus.value = true
  // const loading = ElLoading.service({
  //   lock: true,
  //   text: "拼命加载中，请稍后...",
  //   background: "rgba(0, 0, 0, 0.7)",
  // });
  // setTimeout(() => {
  //   loading.close();
  // }, 500);
  // console.log('router:', router.currentRoute.value.query)
  // url.value = 'http://192.168.13.173:8083/cfs/Redirector?ComponentURL=/AppMain/Welcome/Welcome.jsp'
  url.value = router.currentRoute.value.query.path
})
// iframe 加载完成之后
const loading = () => {
  loadingStatus.value = false
}
</script>

<style scoped>
.content {
  background-color: aliceblue;
  width: 100%;
  height: 100%;
}
</style>
