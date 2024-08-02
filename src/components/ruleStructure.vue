<template>
  <div style="flex: 1; padding-top: 8px" class="collapseItem">
    <!-- <div style="display: flex; align-items: center; justify-content: space-around; padding-top: 10px">
      <div style="display: flex; align-items: center; padding: 0 10px">
        <p
          class="ruleName"
          v-if="infoObject._label"
          style="font-size: 16px; line-height: 32px; margin: 0 5px 0 0; font-weight: 500"
        >
          {{ infoObject._label + ':' }}
        </p>
        <el-popover placement="right" title="" :width="310" trigger="click">
          <template #reference>
            <el-icon :size="12" style="" hover="color:bule">
              <EditPen />
            </el-icon>
          </template>
          <div style="display: flex; flex-direction: column">
            <el-form :model="infoObject._right" label-width="auto" style="">
              <el-form-item label="名称:">
                <el-input v-model="infoObject._label" style="width: 215px" clearable />
              </el-form-item>
              <el-form-item label="被继承后是否允许被修改：">
                <el-select v-model="infoObject._right._editable" placeholder=" ">
                  <el-option label="否" value="1" />
                  <el-option label="是" value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="被继承后是否允许被停用：">
                <el-select v-model="infoObject._right._disable" placeholder=" ">
                  <el-option label="否" value="1" />
                  <el-option label="是" value="2" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-popover>
      </div>
    </div> -->
    <div
      style="
        box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05), -1px -1px 1px 1px rgba(0, 0, 0, 0.05);
        box-sizing: border-box;
        margin: 0 10px;
        box-sizing: border-box;
        border-radius: 6px;
        padding-top: 10px;
      "
    >
      <div style="display: flex; align-items: center; padding-left: 10px; font-size: 16px; color: #606266">
        <span>参数集合：</span>
        <el-icon size="18px" class="iconType" @click.stop="addParams">
          <Plus />
        </el-icon>
      </div>
      <div style="width: 98%; margin: 10px; border-radius: 6px">
        <el-table :data="infoObject._params" style="width: 98%">
          <el-table-column prop="_id" label="参数编号" align="center" />
          <el-table-column prop="_label" label="参数名" align="center" />
        </el-table>
      </div>
    </div>
    <div class="" style="padding: 10px; flex: 1">
      <ifRule :dataDefault="infoObject._rule._if" ref="childComponentIf" :paramsData="infoObject._params"></ifRule>
      <thenRule
        :dataDefault="infoObject._rule._then"
        ref="childComponentThen"
        :paramsData="infoObject._params"
      ></thenRule>
      <elseRule
        :dataDefault="infoObject._rule._else"
        ref="childComponentElse"
        :paramsData="infoObject._params"
      ></elseRule>
    </div>
  </div>
  <!-- dialog弹出框 -->
  <el-dialog v-model="dialogVisible" v-if="dialogVisible" title="" width="60%" align-center center>
    <div style="">
      <el-table
        ref="multipleTableRef"
        :data="tableList"
        highlight-current-row
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column property="id" label="编号" />
        <el-table-column property="name" label="名称" />
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, defineExpose } from 'vue'
import { getList } from '../services/index'
const emit = defineEmits(['getParams'])
import ifRule from './ifRule.vue'
import thenRule from './thenRule.vue'
import elseRule from './elseRule.vue'
const props = defineProps(['dataDefault', 'formData'])
const childComponentIf = ref(null) //if的数据
const childComponentThen = ref(null) //then的数据
const childComponentElse = ref(null) //else的数据
const tableList = ref([]) //参数的集合
const multipleSelection = ref([])
const dialogVisible = ref(false)
const user = ref(JSON.parse(window.localStorage.getItem('user')))
const handleSelectionChange = (val: any) => {
  console.log('handleSelectionChange', val)
  multipleSelection.value = val
}
const data = ref({
  ...props.dataDefault,
})
const pushParams = () => {
  returnInfo()
  emit('getParams', {
    ...infoObject.value,
  })
}
defineExpose({
  pushParams,
})
const infoObject = ref({
  _extend: [],
  _label: '',
  _params: [],
  _right: {
    _editable: '2',
    _disable: '1',
  },
  _rule: {
    _if: {},
    _then: {},
    _else: {},
  },
  _type: '',
}) //规则里面对应的数据

onMounted(() => {
  getFormList()
})
// 初始化
const init = () => {
  console.log(props, 'props')
  if (props.formData?.info?._type) {
    console.log(props.formData.info, 'props.formData.info')
    infoObject.value._rule = {
      ...props.formData?.info?._rule,
    }
    infoObject.value._params = [...props.formData?.info?._params]
    infoObject.value._label = props.formData.policyName
    infoObject.value._type = props.formData.policyType
  }
  if (props.formData?._type) {
    console.log(props.formData, 'props.formData')
    infoObject.value._rule = {
      ...props.formData?._rule,
    }
    infoObject.value._params = [...props.formData?._params]
    infoObject.value._label = props.formData._label
    infoObject.value._type = props.formData._type
  } else {
    infoObject.value._label = props.formData.policyName
    infoObject.value._type = props.formData.policyType
  }
  console.log(props, 'props', 'info', infoObject.value)
}
init()

// 获取表格数据
const getFormList = () => {
  let params = {
    message: {
      policyId: '',
      policyGroup: '1',
      policyType: '1',
      orgId: user.orgId,
      status: '',
      roles: [],
    },
  }
  getList(params).then(response => {
    tableList.value = response.data.message.list
  })
}
const addParams = () => {
  dialogVisible.value = true
}
// 点击确定，锁定添加的参数
const confirm = () => {
  let params = []
  multipleSelection.value.forEach(item => {
    let object = { ...item.info }
    object._id = item.id
    infoObject.value._params.push(object)
    // params.push(object)
  })
  console.log('params', infoObject.value._params)
  // if (!tabValues.value.length) {
  //   let paramObject = {
  //     _right: {
  //       _delete: '1',
  //       _modify: '1',
  //     },
  //     _row: {},
  //   }
  //   multipleSelection.value.forEach(item => {
  //     paramObject._row[item.id] = ''
  //   })
  //   tabValues.value.push(paramObject)
  // }

  dialogVisible.value = false
  // console.log('params', params.value, tabValues.value)
}
const returnInfo = () => {
  infoObject.value._rule._if = childComponentIf.value.conditionListAll
  infoObject.value._rule._then = childComponentThen.value.outputConditionListAll
  infoObject.value._rule._else = childComponentElse.value.outputConditionListAll
  console.log('info', infoObject.value)
  console.log('childComponentIf', childComponentIf.value)
  // console.log('childComponentThen', childComponentThen.value.outputConditionListAll)
  // console.log('childComponentElse', childComponentElse.value.outputConditionListAll)
}
</script>

<style scoped>
:deep(.el-dialog--center .el-dialog__body) {
  max-height: 80vh; /* 设置最大高度为视口高度的80% */
  overflow-y: auto; /* 当内容超出最大高度时，显示垂直滚动条 */
}
.iconType {
  margin-left: 10px;
  color: #409eff;
}
.collapseItem {
  /* display: flex; */
  border-radius: 8px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.04), -1px -1px 1px 1px rgba(0, 0, 0, 0.04);
  margin: 10px 0;
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
