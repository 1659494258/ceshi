<template>
  <!-- 接口 -->
  <div class="processorBox">
    <div class="centerContent">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item class="borderItem" title="" name="1">
          <template #title>
            <p style="font-size: 16px">基本信息：</p>
          </template>
          <div class="main_header">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="header_item">
                  <span class="item_label">名字：</span>
                  <el-input v-model="currentTableItem._label" style="width: 140px" clearable />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="header_item">
                  <span class="item_label">被继承后是否允许被修改：</span>
                  <el-select
                    v-model="currentTableItem._right._editable"
                    size="large"
                    placeholder=" "
                    style="width: 100px"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                  >
                    <el-option label="否" value="0" />
                    <el-option label="是" value="1" />
                  </el-select>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="header_item">
                  <span class="item_label">被继承后是否允许被停用：</span>
                  <el-select
                    v-model="currentTableItem._right._disable"
                    size="large"
                    placeholder=" "
                    style="width: 100px"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                  >
                    <el-option label="否" value="0" />
                    <el-option label="是" value="1" />
                  </el-select>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="header_item">
                  <span class="item_label">接口地址：</span>
                  <el-input v-model="currentTableItem._url" style="width: 150px" clearable />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="header_item">
                  <span class="item_label">请求报文：</span>
                  <el-input v-model="currentTableItem._request" style="width: 150px" clearable />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="header_item">
                  <span class="item_label">响应报文：</span>
                  <el-input v-model="currentTableItem._response" style="width: 150px" clearable />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="header_item">
                  <span class="item_label">继承自：</span>
                  <el-select
                    v-model="currentTableItem._extends"
                    size="large"
                    placeholder="继承同类型政策"
                    style="width: 150px"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                  >
                    <el-option v-for="(ite, ind) in extendsTableData" :label="ite.name" :value="ite.id" :key="ind" />
                  </el-select>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { get } from 'http'
import { ref, reactive, onMounted, computed, defineExpose } from 'vue'
import { getList } from '../services/index'
import { ElTable } from 'element-plus'
import codeValue from '../assets/json/codeValue.json'
const emit = defineEmits(['getParams'])
const props = defineProps(['dataDefault', 'formData'])
const data = ref({
  ...props.dataDefault,
})

const currentTableItem = ref({
  _extends: [],
  _label: '',
  _type: '',
  _right: {
    _editable: '',
    _disable: '',
  },
  _url: '',
  _request: '',
  _response: '',
})
const tableData = ref([])
const tableList = ref([]) //参数的集合
const extendsTableData = ref([]) //继承的数据
const childHanler = ref(null) //表格的数据
const activeNames = ref(['1'])
const handleChange = (val: string[]) => {
  console.log(val)
}
const user = ref(JSON.parse(window.localStorage.getItem('user')))
// 返回数据
const pushParams = () => {
  childHanler.value?.pushParams()
  console.log('currentTableItem', currentTableItem.value)
  emit('getParams', {
    ...currentTableItem.value,
  })
}
defineExpose({
  pushParams,
})
onMounted(() => {
  getFormList()
  currentTableItem.value._label = props.formData.name
  currentTableItem.value._type = props.formData.policyType
  if (props.formData?.info?._type) {
    currentTableItem.value = { ...props.formData.info }
  }
  if (props.formData?._type) {
    currentTableItem.value = { ...props.formData }
  }
  console.log('接口', props, currentTableItem.value)
})
// 获取可以继承的数据
const getFormList = () => {
  let params = {
    message: {
      policyId: '',
      policyGroup: '',
      policyType: '7',
      orgId: user.orgId,
      status: '',
    },
  }
  getList(params).then(response => {
    extendsTableData.value = response.data.message.list
  })
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref([])
const handleSelectionChange = (val: any) => {
  console.log('val', val)
  multipleSelection.value = val
}
// 点击确定，锁定添加的参数
const confirmAdd = () => {
  let params = {}
  multipleSelection.value.forEach(item => {
    currentTableItem.value._params[item.id] = { ...item.info }
  })
  addParamsVisible.value = false
  console.log('multipleSelection.value', multipleSelection.value, currentTableItem.value)
}

// 获取自组件的数据
const getParams = (params: object) => {
  console.log('params-processor', params)
  currentTableItem.value._handler = { ...params }
}
</script>

<style scoped>
.iconType {
  margin-left: 10px;
  color: #409eff;
}
.processorBox {
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 8px;
  box-sizing: border-box;
}
:deep(.el-collapse) {
  border-top: 0px !important;
  border-bottom: 0px !important;
}
/* 滚动条整体样式 */
::-webkit-scrollbar {
  width: 2px; /* 滚动条的宽度 */
}
.centerContent {
  max-height: 70vh;
  overflow-y: scroll;
  width: 100%;
  box-sizing: border-box;
}

.borderItem {
  border-radius: 6px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05), -1px -1px 1px 1px rgba(0, 0, 0, 0.05);
  padding-left: 10px;
  margin: 10px;
  box-sizing: border-box;
}
.main_header {
  padding-left: 16px;
}
.header_item {
  display: inline-block;
  margin: 0 5px;
}
:dee(.el-select .el-input__suffix .el-input__suffix-inner) {
  display: none !important;
}
:deep(.selectType .el-icon-arrow-up:before) {
  content: '';
}

:deep(.el-input) {
  --el-input-focus-border: #c0c4cc;
  --el-input-transparent-border: 0 0 0 0px;
  --el-input-border-color: #fff;
  /* --el-input-hover-border:0px !important;
		--el-input-hover-border-color:#fff; */
  --el-input-focus-border-color: #c0c4cc;
  --el-input-clear-hover-color: #fff;
  box-shadow: 0 0 0 0px !important;
  --el-input-border: 0px;
}

:deep(.el-select__wrapper) {
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  padding: 4px 12px;
  gap: 6px;
  min-height: 32px;
  line-height: 24px;
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-fill-color-blank);
  transition: var(--el-transition-duration);
  box-shadow: 0 0 0 1px #fff inset;
}
</style>
