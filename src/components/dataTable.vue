<template>
  <div class="collapseItem">
    <div style="display: flex; align-items: center; justify-content: space-around; padding-top: 10px">
      <div style="display: flex; align-items: center; padding: 0 10px">
        <p
          class="ruleName"
          v-if="data._label"
          style="font-size: 16px; line-height: 32px; margin: 0 5px 0 0; font-weight: 500"
        >
          {{ data._label + ':' }}
        </p>
        <el-popover placement="right" title="" :width="310" trigger="click">
          <template #reference>
            <el-icon :size="12" style="" hover="color:bule">
              <EditPen />
            </el-icon>
          </template>
          <div style="display: flex; flex-direction: column">
            <el-form :model="data._right" label-width="auto" style="">
              <el-form-item label="名称:">
                <el-input v-model="data._label" style="width: 215px" clearable />
              </el-form-item>
              <el-form-item label="被继承后是否允许被修改：">
                <el-select v-model="data._right._editable" placeholder=" ">
                  <el-option label="否" value="0" />
                  <el-option label="是" value="1" />
                </el-select>
              </el-form-item>
              <el-form-item label="被继承后是否允许被停用：">
                <el-select v-model="data._right._disable" placeholder=" ">
                  <el-option label="否" value="0" />
                  <el-option label="是" value="1" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-popover>
      </div>
    </div>
    <div style="padding: 10px; box-sizing: border-box">
      <!-- 左侧表格 -->
      <div>
        <el-button @click="addColumn">添加列</el-button>
        <!-- <el-button @click="removeColumn">删除列</el-button> -->
        <el-button @click="addRow(tableParams.length)">添加行</el-button>
      </div>
      <el-table :data="tableParams" style="width: 100%" @row-dblclick="handleRowDoubleClick">
        <template v-for="(value, key, index) in tableHeader" :key="index">
          <el-table-column :prop="key" align="center">
            <template #header>
              <template style="display: flex; align-items: center; justify-content: center; color: black">
                <p class="ruleName" style="font-size: 16px; line-height: 32px; margin: 0 5px 0 0; font-weight: 300">
                  {{ value }}
                </p>
                <el-popover placement="top" title="" :width="300" trigger="click">
                  <template #reference>
                    <el-icon :size="12" style="" hover="color:bule">
                      <EditPen />
                    </el-icon>
                  </template>
                  <div style="display: flex; flex-direction: column">
                    <el-form :model="params[key]._right" label-width="auto" style="">
                      <el-form-item :label="params[key]._label">
                        <el-input v-model="params[key]._label" style="width: 215px" />
                      </el-form-item>
                      <el-form-item label="被继承后是否允许被修改：">
                        <el-select v-model="params[key]._right._editable" placeholder=" ">
                          <el-option label="否" value="0" />
                          <el-option label="是" value="1" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="被继承后是否允许被停用：">
                        <el-select v-model="params[key]._right._disable" placeholder=" ">
                          <el-option label="否" value="0" />
                          <el-option label="是" value="1" />
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-popover>
              </template>
            </template>
            <template #default="scope">
              <template v-if="!params[key]._option_method">
                <el-input
                  :disabled="scope.row != editingRow && !params[key]._option_method"
                  v-model="scope.row[key]"
                  class="custom-disabled-input"
                  style="width: 100px"
                ></el-input>
              </template>
              <template v-if="params[key]._option_method">
                <el-select
                  v-model="scope.row[key]"
                  placeholder=" "
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  style="width: 100px"
                  :disabled="scope.row != editingRow && params[key]._option_method"
                >
                  <el-option
                    v-for="(ite, iteKey, ind) in codeValueList[key]"
                    :key="ind"
                    :label="ite.name"
                    :value="ite.id"
                  />
                </el-select>
              </template>
              <!-- <span v-if="scope.row != editingRow && !params[key]._option_method">{{ scope.row[key] }}</span> -->
              <!-- <span v-if="scope.row != editingRow && !params[key]._option_method">{{ scope.row[key] }}</span> -->
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>

    <!-- dialog弹出框 -->
    <el-dialog v-model="centerDialogVisible" v-if="centerDialogVisible" title="" width="60%" align-center center>
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
          <el-table-column property="policyId" label="编号" />
          <el-table-column property="policyName" label="名称" />
        </el-table>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAdd">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, defineExpose, watch } from 'vue'
import { getList, codeById, addOne, removeOne } from '../services/index'
import { ElTable } from 'element-plus'
const props = defineProps(['dataDefault', 'formData', 'policyGroup'])
const emit = defineEmits(['getParams'])
const centerDialogVisible = ref(false) //控制dialog的显示与隐藏
const tableList = ref([]) //参数的集合
const selectAdd = ref({}) //添加列是所选的参数
const codeValueList = ref({}) //所有码值的集合
const tabValues = ref([])
const tableParams = ref([]) //表格的数据
const editingRow = ref(null)
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref([])
const handleSelectionChange = (val: any) => {
  console.log('val', val)
  multipleSelection.value = val
}
// 返回数据
const pushParams = () => {
  let paramsData = { ...data.value }
  paramsData._params = params.value
  let table = []
  if (tableParams.value.length) {
    for (let i = 0; i < tableParams.value.length; i++) {
      table.push({
        _row: { ...tableParams.value[i] },
        _right: {
          _delete: '1',
          _modify: '1',
        },
      })
    }
  }
  paramsData._values = table
  paramsData._label = props?.formData?.policyName ? props?.formData?.policyName : data.value._label
  paramsData._type = props?.formData?.policyType
  paramsData._right = data.value?._right
    ? data.value?._right
    : {
        _disable: '',
        _editable: '',
      }
  console.log(paramsData)
  emit('getParams', {
    ...paramsData,
  })
}
defineExpose({
  pushParams,
})
watch(codeValueList, newX => {
  console.log(newX, 'newX')
})

// 添加列
const addColumn = () => {
  // columns.value.push({ prop: `col${columns.value.length}`, label: `列${columns.value.length + 1}` })
  centerDialogVisible.value = true
  getFormList()
}
// 删除列
const removeColumn = () => {
  if (columns.value.length > 0) {
    columns.value.pop()
  }
}
// 添加行
const addRow = (index: number) => {
  const newRow = { ...tableParams.value[index - 1] }
  tableParams.value.push(newRow)
  console.log('index', index, tableParams.value)
}
// 删除行
const removeRow = (index: number) => {
  tableData.value.splice(index, 1)
}
const params = ref({})
watch(
  params,
  newX => {
    if (Object.keys(params.value).length) {
      for (const key in params.value) {
        if (params.value[key]._option_method) {
          console.log(params.value, 'paramsnewX')
          codeById(key).then(res => {
            codeValueList.value[key] = res.data.message.codes[0].items
          })
        }
      }
    }
  },
  {
    deep: true,
    immediate: true,
  }
)
watch(
  tabValues,
  (newValue, oldValue) => {
    if (newValue.length) {
      let table = []
      for (let i = 0; i < newValue.length; i++) {
        table.push(newValue[i]._row)
      }
      tableParams.value = table
    }
    console.log('newtabValues, oldtabValues', newValue, oldValue)
  },
  { deep: true, immediate: true }
)
const data = ref({
  _extends: [],
  _type: '',
  _label: '',
  _right: {
    _editable: '',
    _disable: '',
  },
  _params: [],
  _values: [],
})

// 表头数据
const tableHeader = computed(() => {
  let header = {}
  if (Object.keys(params.value).length) {
    for (const key in params.value) {
      header[key] = params.value[key]._label
    }
  }
  console.log('header', header)
  return header
})
const user = ref(JSON.parse(window.localStorage.getItem('user')))
onMounted(() => {
  tabValues.value = props.dataDefault?._values ? [...props.dataDefault?._values] : []
  params.value = props.dataDefault?._params ? { ...props.dataDefault?._params } : {}
  if (!data.value._label) {
    data.value._label = props?.formData?.policyName ? props?.formData?.policyName : props?.formData?._label
    data.value._type = props?.formData?.policyType ? props?.formData?.policyType : props?.formData?._type
    data.value._right = {
      _disable: '1',
      _editable: '2',
    }
  }
  console.log('props-dataTable', props, props.formDatam, props.dataDefault)
})
// 获取表格数据
const getFormList = () => {
  let params = {
    message: {
      policyId: '',
      policyGroup: props.policyGroup,
      policyType: '1',
      orgId: user.orgId,
      status: '',
    },
  }
  getList(params).then(response => {
    tableList.value = response.data.message.list
  })
}
// 双击表格
const handleRowDoubleClick = (row, column, event) => {
  event.preventDefault()
  event.stopPropagation()
  editingRow.value = row // 设置当前正在编辑的行
  console.log('editingRow', editingRow.value, row)
}
const handleCurrentChange = (val: any) => {
  selectAdd.value = val
  console.log('val', val)
}
// 点击确定，锁定添加的列
const confirmAdd = () => {
  multipleSelection.value.forEach(item => {
    params.value[item.policyId] = { ...item.info }
  })
  if (!tabValues.value.length) {
    let paramObject = {
      _right: {
        _delete: '1',
        _modify: '1',
      },
      _row: {},
    }
    multipleSelection.value.forEach(item => {
      paramObject._row[item.policyId] = ''
    })
    tabValues.value.push(paramObject)
  }
  centerDialogVisible.value = false
  console.log('params', params.value, tabValues.value)
}
</script>

<style scoped>
:deep(.el-dialog--center .el-dialog__body) {
  max-height: 80vh; /* 设置最大高度为视口高度的80% */
  overflow-y: auto; /* 当内容超出最大高度时，显示垂直滚动条 */
}
.collapseItem {
  /* display: flex; */
  border-radius: 8px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.04), -1px -1px 1px 1px rgba(0, 0, 0, 0.04);
  margin: 10px 0;
}
:deep(.custom-disabled-input .el-input__inner) {
  text-align: center;
  background-color: #ffffff;
  box-shadow: none;
  border: none !important;
  opacity: 0.8;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #ffffff;
  box-shadow: 0 0 0 0px var(--el-disabled-border-color) inset;
}
</style>
