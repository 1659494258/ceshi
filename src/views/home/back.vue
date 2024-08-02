<template>
  <div class="">
    dsfksd
  </div>
</template>
  <script setup lang="ts">
  import { ref ,onMounted,inject  } from 'vue'
  import { useRoute, useRouter } from 'vue-router';
  const router = useRouter();
// 跳转至指定页面

  const reload = inject('reload')
  
  const url = ref()
  onMounted(() => {
    router.replace({
        path:"/home/index",
    })
    console.log('router:', router.currentRoute.value.query.path)
    url.value = router.currentRoute.value.query.path
    const param =  {
        UserID: 'admin',
        Password: '000000als',
    }
      console.log(param)
    // localStorage.setItem('ACCESS_TOKEN', res.data);
    // router.push("/flow")
    // router.push({
    //     path: '/index',
    //     query: {
    //         ...url
    //     }
    // })
    })

  </script>
  
<style scoped>
</style>
