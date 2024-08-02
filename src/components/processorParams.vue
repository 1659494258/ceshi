<template>
  <div class="processBox">
    <el-table :data="tableData" style="width: 94%; margin-bottom: 20px" row-key="id" highlight-current-row="true">
      <el-table-column prop="_id" label="编号" align="center" />
      <el-table-column prop="_label" label="名字" align="center" />
      <el-table-column label="状态" align="center">
        <template #default="scope">启用</template>
      </el-table-column>
      <el-table-column label="" align="center" width="100">
        <template #default="scope">
          <el-link type="primary" @click="editRow(scope.$index, scope.row)">编辑</el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 -->
    <el-dialog
      v-model="centerDialogVisible"
      title=""
      width="72%"
      align-center
      append-to-body
      center
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="centerContent">
        <component
          :is="currentComponent(currentTableItem._type)"
          :dataDefault="currentTableItem"
          :formData="currentTableItem"
          @getParams="getParams"
          ref="childComponent"
        ></component>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="centerDialogVisible = false">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!--添加参数的dialog弹出框 -->
    <el-dialog
      v-model="addParamsVisible"
      v-if="addParamsVisible"
      title=""
      width="60%"
      align-center
      center
      :append-to-body="true"
    >
      <div style="max-height: 660px; overflow-y: scroll">
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
          <el-button @click="addParamsVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAdd">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { get } from 'http'
import { ref, reactive, onMounted, computed } from 'vue'
import { getList } from '../services/index'
import { ElTable } from 'element-plus'
import codeValue from '../assets/json/codeValue.json'
import Parameter from './parameter.vue'
import ParameterGroup from './parameterGroup.vue'
import RuleStructure from './ruleStructure.vue'
import DateTable from './dataTable.vue'
import FlowPath from './flowPath.vue'
import Processor from './processor.vue'
import Interface from './interface.vue'
import FromItem from './formItem.vue'
const props = defineProps(['dataDefault'])
const data = ref({
  ...props.dataDefault,
})
const user = ref(JSON.parse(window.localStorage.getItem('user')))
const centerDialogVisible = ref(false) //控制处理的器的弹出框
const addParamsVisible = ref(false) //控制器里面控制添加参数的dialog
const currentTableItem = ref({})
const handlerData = ref({})
const tableData = ref([])
const tableList = ref([]) //参数的集合
const extendsTableData = ref([]) //继承的数据
const handleTypeList = ref([
  //处理器类型
  {
    label: '接口',
    value: '1',
  },
  {
    label: '视图',
    value: '2',
  },
])
// const paramsTabData = ref([]) //dialog弹框里参数的数据
const activeNames = ref(['1', '2', '3'])
const handleChange = (val: string[]) => {
  console.log(val)
}
// 筛选出参数表格需要的数据
const paramsTabData = computed(() => {
  let list = []
  if (currentTableItem.value && Object.keys(currentTableItem.value._params).length) {
    for (const key in currentTableItem.value._params) {
      list.push({
        name: key,
        ...currentTableItem.value._params[key],
      })
    }
  }
  return list
})

onMounted(() => {
  getFormList()
  getParamsList()
  console.log('处理器', props)
  tableData.value = props.dataDefault
  console.log(tableData.value, 'tableData')

  // 筛选出表格想要的数据
  // for (const key in data.value) {
  //   let children = []
  //   if (data.value[key]._handler?._items && Object.keys(data.value[key]._handler?._items).length) {
  //     for (const key1 in data.value[key]._handler._items) {
  //       children.push({
  //         ...data.value[key]._handler._items[key1],
  //         // id: key1,
  //         // name: data.value[key]._handler._items[key1]._label,
  //         // status: data.value[key]._handler._items[key1]._status,
  //         // extends: data.value[key]._handler._items[key1]._extends,
  //         // data: data.value[key]._handler._items[key1]._data,
  //       })
  //     }
  //   }
  //   tableData.value.push({
  //     id: key,
  //     ...data.value[key],
  //     // name: data.value[key]._label,
  //     // extends: data.value[key]._extends,
  //     // data: data.value[key]._data,
  //     // right: data.value[key]._right,
  //     children: children,
  //   })
  // }
})

// 根据类型的不同，匹配不同的组件
const currentComponent = (type: any) => {
  if (type === '1') {
    return Parameter
  } else if (type === '2') {
    return ParameterGroup
  } else if (type === '3') {
    return DateTable
  } else if (type === '4') {
    return RuleStructure
  } else if (type === '5') {
    return FlowPath
  } else if (type === '7') {
    return Interface
  } else if (type === '8') {
    return Processor
  }
}
const getParams = (params: object) => {
  // componentParams.value = params
  console.log('params', params)
}
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

// 获取参数表格数据
const getParamsList = () => {
  let params = {
    message: {
      policyId: '',
      policyGroup: '',
      policyType: '1',
      status: '',
      orgId: user.orgId,
    },
  }
  getList(params).then(response => {
    tableList.value = response.data.message.list
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
const editRow = (index: number, row: any) => {
  currentTableItem.value = row
  if (row?._handler) {
    handlerData.value = row._handler
  }
  centerDialogVisible.value = true
  console.log('currentTableItem', currentTableItem.value, 'handlerData.value', handlerData.value)
  // getParamsTabData()
}
const getComponent = (type: string) => {
  if (type === '1') {
    return FromItem
  } else if (type === '2') {
    return FromItem
  }
}
const addParams = () => {
  addParamsVisible.value = true
}
</script>

<style scoped>
.processBox {
  width: 98%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 8px;
  margin: 10px;
  border: 1px solid #e4e7ed;
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
}

.borderItem {
  border-radius: 6px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05), -1px -1px 1px 1px rgba(0, 0, 0, 0.05);
  padding-left: 10px;
  margin: 5px;
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
