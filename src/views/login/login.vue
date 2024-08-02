<template>
  <div class="main">
    <div class="center">
      <div class="login-from">
        <p class="title">
          网络贷款平台
        </p>
        <div class="loginFrom">
          <el-form ref="ruleFormRef"
                   :model="ruleForm"
                   status-icon
                   :rules="rules"
                   label-width="120px"
                   class="demo-ruleForm">
            <el-form-item label="用户名ID："
                          prop="account">
              <el-input v-model.trim="ruleForm.account"
                        type="string"
                        maxlength="15"
                        clearable
                        placeholder="请输入用户名"
                        autocomplete="off"
                        @keyup.enter="submitForm(ruleFormRef)" />
            </el-form-item>
            <el-form-item label="密码 ："
                          prop="password">
              <el-input v-model.trim="ruleForm.password"
                        placeholder="请输入密码"
                        type="password"
                        show-password
                        clearable
                        autocomplete="off"
                        @keyup.enter="submitForm(ruleFormRef)" />
            </el-form-item>
            <el-form-item class="buttonList">
              <el-button @click="resetForm(ruleFormRef)">重置</el-button>

              <el-button type="primary"
                         @click="submitForm(ruleFormRef)"
                         @keyup.enter="submitForm(ruleFormRef)">登录</el-button>
            </el-form-item>
          </el-form>

        </div>
      </div>
    </div>
    <!-- <p class="title-bottom">Copyright 2022,XX银行</p> -->
    <!--在这里进行请求新的数据 -->
  </div>

</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
// import { localSet }  from "../../common/index.js"
import { login, main, home } from '../../services/index'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  account: '',
  password: '',
  // account: 'admin',
  // password: '123456',
})
const personInfo = reactive({
  org: '',
  username: '',
  email: '',
  mobile: '',
  comptel: '',
  language: '',
})

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('密码不能为空'))
  } else {
    callback()
  }
}

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('用户名不能为空'))
  } else {
    callback()
  }
}
// 规则
const rules = reactive({
  account: [{ validator: validatePass2, trigger: 'blur' }],
  password: [{ validator: validatePass, trigger: 'blur' }],
})
onMounted(() => {})

// 提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      const param = {
        UserID: ruleForm.account,
        Password: ruleForm.password,
        ScreenWidth: 1,
      }
      // 在这里进行请求登录接口，加个判断确定是登录成功后才进行跳转和提示
      router.push({
        path: '/index',
      })
      ElMessage({
        type: 'success',
        message: '登录成功',
      })
      // 登录
      // login(param).then(response => {
      //   const res: any = response.data
      //   if(res.status=== '1'){
      //     ElMessage({
      //         type: 'success',
      //         message: '登录成功',
      //     })
      //     // 登录成功的话请求首页的数据以及头部menu的数据
      //     main().then(response => {
      //       const res: any = response.data
      //       const fatherData:any=res.fatherNode
      //       const son:any=res.son
      //       // 筛选数据
      //       fatherData.forEach((item:any) => {
      //         console.log(item.menuID)
      //         item.children=[]
      //         son.forEach((sonItem:any) => {
      //           console.log(sonItem.parent.menuID)
      //           if(item.menuID===sonItem.parent.menuID){
      //             item.children.push(sonItem)
      //           }
      //         });
      //       });
      //       console.log(fatherData)
      //       personInfo.org=res.org
      //       personInfo.username=res.username
      //       personInfo.email=res.email
      //       personInfo.mobile=res.mobile
      //       personInfo.comptel=res.comptel
      //       personInfo.language=res.language
      //       window.localStorage.setItem('personInfo',JSON.stringify(personInfo))
      //       window.localStorage.setItem('menuInfo',JSON.stringify(fatherData))
      //       home()
      //     })
      //     } else {
      //       ElMessage({
      //           type: 'error',
      //           message: '登录失败,请检查后重新登录',
      //       })
      //       console.log('error ')
      //       return false
      //     }

      // })
      //清除浏览器的缓存，避免进去页面的时候显示的是之前的东西，清理之后每次都是显示的这次所选择的，刷新之后显示的东西不变
      window.sessionStorage.clear()
      window.localStorage.clear()
    } else {
      return false
    }
  })
}
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
const handleKeyDown = (event)=> {
    let key = null;
    if (window.event === undefined) {
      key = event.keyCode;
    } else {
      key = window.event.keyCode;
      // 事件的确认，与
    }
    if (key === 13) {
      //触发的事件
      handleSubmit
      console.log('按下了回车键')
    }
}
// 提交
const handleSubmit = (e: Event) => {
  const param = {
    UserID: ruleForm.account,
    Password: ruleForm.password,
  }
  console.log(param)
  // login(param).then(response => {
  //   const res: any = response.data
  //   if(res.code === 200){
  //   }
  // })
}
</script>
   
  <style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  background-color: #b9b9b9;
  position: relative;
  background: url('../../assets/images/bg.jpg');
  background-size: cover;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .center {
    width: 36%;
    height: 400px;
    box-sizing: border-box;
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.6);
    .title {
      color: #fff;
      text-align: center;
      margin: 60px 0;
      font-size: 30px;
    }
    .login-from {
      width: 100%;
      box-sizing: border-box;
      .loginFrom {
        margin-top: 50px;
        box-sizing: border-box;
      }
      :deep(.el-form) {
        box-sizing: border-box;
      }
      :deep(.el-form-item) {
        margin-bottom: 30px;
        font-size: 21px;
        box-sizing: border-box;
      }
      :deep(.el-icon) {
        font-size: 15px;
      }
      :deep(.el-form-item__error) {
        font-size: 14px;
        padding-top: 8px;
        padding-left: 5px;
      }
      :deep(.el-form-item__content) {
        .el-input {
          width: 90%;
        }
      }
      :deep(.el-input__inner) {
        font-size: 18px;
        width: 60%;
        height: 40px;
      }
      :deep(.el-form-item__label) {
        font-size: 18px;
        height: 40px;
        line-height: 40px;
        color: #fff;
      }
      :deep(.el-button) {
        font-size: 22px;
        height: 50px;
        width: 35%;
        margin-right: 30px;
      }
    }
  }
  .title-bottom {
    width: 100%;
    font-size: 21px;
    text-align: center;
    position: absolute;
    bottom: 200px;
    color: #818181;
    font-family: '宋体', Tahoma;
  }
}
.buttonList {
  margin-top: 50px;
  display: flex;
  justify-content: space-around;
}
</style>