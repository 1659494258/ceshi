<template>
    <el-button  @click="handleSubmit">登录</el-button> 
        

  </template>
   
  <script lang="ts">
  import { defineComponent, reactive } from "vue";
  import { login } from '../../services/index'
   
  import { useRouter } from 'vue-router'
   
  export default defineComponent({
    name: "index",
    components: {

    },
    setup(){
      const loginForm = reactive({
        account: '',
        password:''
      })
      const router = useRouter()
   
      const handleSubmit  = (e: Event)=> {
        console.log('res')
        const param =  {

        }
        login(param).then(response => {
            
          const res: any = response.data
          if(res.code === 200){
            localStorage.setItem('ACCESS_TOKEN', res.data);
            router.push("/flow")
          }
        })
      }
      return{
        loginForm,
        handleSubmit
      }
    }
  })
  </script>
   
  <style lang="scss" scoped>
  /* 背景 */
  .login-container {
    position: absolute;
    width: 100%;
    height: 100%;
    .content {
      position: absolute;
      width:400px;
      height:300px;
      left:50%;
      top:50%;
      margin-left:-200px;
      margin-top:-150px;
   
      border-radius: 10px;
      background: #f6efef;
      box-shadow:  5px 5px 10px #626060,
        -2px -2px 2px #de18ff;
    }
  }
   
   
  </style>