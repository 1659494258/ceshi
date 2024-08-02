<template>
  <div class="formItemBox">
    <!-- 布局配置 -->
    <div class="handlerItem">
      <!-- <p class="handlerItem_title">布局配置：</p>
      <div class="main_header">
        <div class="header_item">
          <span class="item_label">视图类型：</span>
          <el-select
            v-model="formData._layout._view_type"
            placeholder=" "
            filterable
            clearable
            remote
            reserve-keyword
            style="width: 150px"
          >
            <el-option v-for="(key, value, index) in viewTypeList" :label="key" :value="value" :key="index" />
          </el-select>
        </div>
        <div class="header_item">
          <span class="item_label">是否只读：</span>
          <el-select
            v-model="formData._layout._readonly"
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
        <div class="header_item" v-if="formData._layout._view_type === '1'">
          <span class="item_label">栏数：</span>
          <el-input v-model="formData._layout._columns" style="width: 140px" clearable />
        </div>
        <div class="header_item" v-if="formData._layout._view_type === '1'">
          <span class="item_label">分组：</span>
          <el-input v-model="formData._layout._groups" style="width: 140px" clearable placeholder="多个用‘，’隔开" />
        </div>
        <div class="header_item" v-if="formData._layout._view_type === '2'">
          <span class="item_label">默认每页大小：</span>
          <el-input v-model="formData._layout._pageSize" style="width: 140px" clearable />
        </div>
        <div class="header_item" v-if="formData._layout._view_type === '2'">
          <span class="item_label">可选每页大小：</span>
          <el-input
            v-model="formData._layout._pageSizeOpt"
            style="width: 140px"
            clearable
            placeholder="多个用‘，’隔开"
          />
        </div>
        <div class="header_item" v-if="formData._layout._view_type === '2'">
          <span class="item_label">是否展示查询字段：</span>
          <el-select
            v-model="formData._layout._search"
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
      </div> -->
    </div>
    <!-- 按钮配置 -->
    <div class="handlerItem">
      <p class="handlerItem_title">
        按钮配置：
        <el-icon size="18px" class="iconType" @click.stop="addButton('button')">
          <Plus />
        </el-icon>
      </p>
      <el-table v-if="formData._buttons.length" :data="formData._buttons" style="width: 98%; margin-bottom: 20px">
        <el-table-column prop="_label" label="名字" align="center" />
        <el-table-column prop="_method" label="方法名" align="center" />
        <el-table-column prop="_icon" label="图标" align="center" />
        <el-table-column prop="_showOnInit" label="默认展示" align="center">
          <template #default="scope">
            <span v-if="scope.row._showOnInit === '0'">否</span>
            <span v-else>是</span>
          </template>
        </el-table-column>
        <el-table-column prop="_showOnReadonly" label="只读时展示" align="center">
          <template #default="scope">
            <span v-if="scope.row._showOnReadonly === '0'">否</span>
            <span v-else>是</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template #default="scope">
            <!-- <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index, scope.row, 'button')">
              删除
            </el-button> -->
            <el-button link type="primary" size="small" @click.prevent="editRow(scope.$index, scope.row, 'button')">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 接口 -->
    <div class="handlerItem" v-if="formData._layout._view_type === '1' || formData._layout._view_type === '2'">
      <p class="handlerItem_title">
        接口：
        <el-icon size="18px" class="iconType" @click.stop="addButton('service')">
          <Plus />
        </el-icon>
      </p>
      <el-table v-if="formData._service.length" :data="formData._service" style="width: 98%; margin-bottom: 20px">
        <el-table-column prop="_id" label="接口类型" align="center" />
        <el-table-column prop="_api" label="接口名字" align="center" />
        <el-table-column prop="_params" label="接口参数" align="center" />
        <el-table-column align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click.prevent="editRow(scope.$index, scope.row, 'service')">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 字段 -->
    <div class="handlerItem" v-if="formData._layout._view_type === '1' || formData._layout._view_type === '2'">
      <p class="handlerItem_title">
        字段：
        <el-icon size="18px" class="iconType" @click.stop="addButton('field')">
          <Plus />
        </el-icon>
      </p>
      <el-table v-if="formData?._fields.length" :data="formData?._fields" style="width: 98%; margin-bottom: 20px">
        <el-table-column prop="_id" label="参数编号" align="center" />
        <el-table-column prop="_label" label="显示名称" align="center" />
        <el-table-column prop="_visible" label="是否显示" align="center">
          <template #default="scope">
            <span v-if="scope.row._visible === '0'">否</span>
            <span v-else>是</span>
          </template>
        </el-table-column>
        <el-table-column prop="_editable" label="是否可编辑" align="center">
          <template #default="scope">
            <span v-if="scope.row._editable === '0'">否</span>
            <span v-else>是</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click.prevent="editRow(scope.$index, scope.row, 'field')">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 查询字段 -->
    <div class="handlerItem" v-if="formData._layout._view_type === '2'">
      <p class="handlerItem_title">
        查询字段：
        <el-icon size="18px" class="iconType" @click.stop="addButton('filter')">
          <Plus />
        </el-icon>
      </p>
      <el-table v-if="formData._filter.length" :data="formData._filter" style="width: 98%; margin-bottom: 20px">
        <el-table-column prop="_id" label="字段名" align="center" />
        <el-table-column prop="_filter_type" label="查询条件" align="center"></el-table-column>
        <el-table-column align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click.prevent="editRow(scope.$index, scope.row, 'filter')">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- step -->
    <div class="handlerItem" v-if="formData._layout._view_type === '3'">
      <p class="handlerItem_title">
        step页配置：
        <el-icon size="18px" class="iconType" @click.stop="addButton('step')">
          <Plus />
        </el-icon>
      </p>
      <el-table v-if="formData._steps.length" :data="formData._steps" style="width: 98%; margin-bottom: 20px">
        <el-table-column prop="id" label="编号" align="center" />
        <el-table-column prop="name" label="名字" align="center" />
        <el-table-column align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click.prevent="editRow(scope.$index, scope.row, 'step')">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--添加button的dialog弹出框 -->
    <el-dialog
      v-model="addButtonVisible"
      v-if="addButtonVisible"
      title=""
      width="50%"
      align-center
      center
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div style="max-height: 660px">
        <!-- 按钮 -->
        <el-form
          v-if="addType === 'button' || editType === 'button'"
          :model="currentButton"
          label-width="auto"
          style=""
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="按钮名称：">
                <el-input v-model="currentButton._label" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="方法名：">
                <el-input v-model="currentButton._method" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图标：">
                <el-input v-model="currentButton._icon" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否默认展示：">
                <el-select
                  v-model="currentButton._showOnInit"
                  size="large"
                  placeholder=" "
                  style="width: 150px"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                >
                  <el-option label="否" value="0" />
                  <el-option label="是" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否只读时展示：">
                <el-select
                  v-model="currentButton._showOnReadonly"
                  size="large"
                  placeholder=" "
                  style="width: 150px"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                >
                  <el-option label="否" value="0" />
                  <el-option label="是" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 接口 -->
        <el-form
          v-if="addType === 'service' || editType === 'service'"
          :model="currentService"
          label-width="auto"
          style=""
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="接口名称：">
                <el-input v-model="currentService._id" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请求地址：">
                <el-input v-model="currentService._api" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请求参数：">
                <el-input v-model="currentService._params" style="width: 150px" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 字段 -->
        <el-form v-if="addType === 'field' || editType === 'field'" :model="currentField" label-width="auto">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="参数编号：">
                <el-input v-model="currentField._id" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="显示名称：">
                <el-input v-model="currentField._label" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否显示：">
                <el-select
                  v-model="currentField._visible"
                  size="large"
                  placeholder=" "
                  style="width: 150px"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                >
                  <el-option label="否" value="0" />
                  <el-option label="是" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否可编辑：">
                <el-select
                  v-model="currentField._editable"
                  size="large"
                  placeholder=" "
                  style="width: 150px"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                >
                  <el-option label="否" value="0" />
                  <el-option label="是" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="提示信息：">
                <el-input v-model="currentField._tips" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属分组：">
                <el-input v-model="currentField._group" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位：">
                <el-input v-model="currentField._unit" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下拉枚举：">
                <el-input v-model="currentField._options" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否必填：">
                <el-select
                  v-model="currentField._required"
                  size="large"
                  placeholder=" "
                  style="width: 150px"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                >
                  <el-option label="否" value="0" />
                  <el-option label="是" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="长度：">
                <el-input v-model="currentField._length" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="其他校验器：">
                <el-input v-model="currentField._validator" style="width: 150px" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 查询条件 -->
        <el-form
          v-if="addType === 'filter' || editType === 'filter'"
          :model="currentFilter"
          label-width="auto"
          style=""
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="字段名称：">
                <el-input v-model="currentFilter._id" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="参数类型:" class="fromItem">
                <el-select
                  v-model="currentFilter._filter_type"
                  placeholder=" "
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  style="width: 150px"
                >
                  <el-option
                    v-for="(key, value, index) in codeValue.filterType"
                    :label="key"
                    :value="key"
                    :key="index"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- step -->
        <div style="max-height: 660px; overflow-y: scroll" v-if="addType === 'step' || editType === 'step'">
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
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelAdd">取消</el-button>
          <el-button type="primary" @click="confirmAdd">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch, defineExpose } from 'vue'
import codeValue from '../assets/json/codeValue.json'
import { getList } from '../services/index'
import { ElTable } from 'element-plus'
const emit = defineEmits(['getParams'])
const props = defineProps<{ handlerData: object }>()
const formData = ref({
  _layout: {
    _view_type: '',
    _readonly: '',
  },
  _buttons: [],
}) //分组的数据
const tableList = ref([]) //处理器的集合
const tableGroups = ref([]) //分组的数据
const addButtonVisible = ref(false) //分组的数据
const addType = ref('') //点击+，赋值相应的类型
const editType = ref('') //点击编辑，赋值相应的类型
const editIndex = ref(0) //点击编辑，赋值相应的类型
const deleteType = ref('') //点击删除，赋值相应的类型
const deleteIndex = ref(0) //点击删除
const tableService = ref([]) //服务的数据
const tableColumns = ref([]) //参数的数据
const currentButton = ref({}) //当前所选Button的数据（新增和编辑通用）
const currentService = ref({}) //当前所选Service的数据（新增和编辑通用）
const currentField = ref({}) //当前所选Field的数据（新增和编辑通用）
const currentFilter = ref({}) //当前所选Filter的数据（新增和编辑通用）
const viewTypeList = ref({
  //视图类型的码值数据
  ...codeValue.viewTypeList,
})
const user = ref(JSON.parse(window.localStorage.getItem('user')))
const componentList = ref([]) //当为component是右侧的下拉框数值
watch(
  formData,
  (newValue, oldValue) => {
    if (!newValue._service) {
      newValue._service = []
    }
    if (!newValue._fields) {
      newValue._fields = []
    }
    if (!newValue._filter) {
      newValue._filter = []
    }
    if (!newValue._steps) {
      newValue._steps = []
    }
    console.log('newValuetype, oldValuetype', newValue, oldValue)
  },
  { deep: true, immediate: true }
)
watch(
  props,
  (newValue, oldValue) => {
    // console.log('newValue, oldValue', newValue, oldValue)
    if (props.handlerData?._layout?._view_type) {
      // console.log('props.handlerData', props.handlerData)
      formData.value = {
        ...props.handlerData,
      }
    }
  },
  { deep: true, immediate: true }
)
// 返回数据
const pushParams = () => {
  console.log('formData', formData.value)
  emit('getParams', {
    ...formData.value,
  })
}
defineExpose({
  pushParams,
})
console.log('props-handleLogic', props)

// 获取参数表格数据
const getParamsList = () => {
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
    tableList.value = response.data.message.list
  })
}
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref([])
const handleSelectionChange = (val: any) => {
  console.log('val', val)
  multipleSelection.value = val
}
onMounted(() => {
  getParamsList()
})
// 点击编辑，根据type进行区分
const editRow = (index: number, row: object, type: string) => {
  deleteType.value = type
  deleteIndex.value = index
  if (type === 'button') {
    currentButton.value = {
      ...row,
    }
  }
  if (type === 'service') {
    currentService.value = {
      ...row,
    }
  }
  if (type === 'field') {
    currentField.value = {
      ...row,
    }
  }
  if (type === 'filter') {
    currentFilter.value = {
      ...row,
    }
  }
  addButtonVisible.value = true
  console.log(index, row, type, 'row')
}
// 点击删除，根据type进行区分
const deleteRow = (index: number, row: object, type: string) => {
  editType.value = type
  editIndex.value = index
  // if (type === 'button') {
  //   currentButton.value = {
  //     ...row,
  //   }
  // }
  // if (type === 'service') {
  //   currentService.value = {
  //     ...row,
  //   }
  // }
  // if (type === 'field') {
  //   currentField.value = {
  //     ...row,
  //   }
  // }
  // if (type === 'filter') {
  //   currentFilter.value = {
  //     ...row,
  //   }
  // }
  // addButtonVisible.value = true
  // console.log(index, row, type, 'row', currentButton.value, currentService.value)
}
// 点击取消的按钮
const cancelAdd = () => {
  addButtonVisible.value = false
  addType.value = ''
  editType.value = ''
}
// 点击确定添加的按钮
const confirmAdd = () => {
  console.log('formdata', formData.value)
  if (addType.value === 'button') {
    formData.value._buttons.push(currentButton.value)
  }
  if (editType.value === 'button') {
    formData.value._buttons[editIndex.value] = { ...currentButton.value }
  }
  if (addType.value === 'service') {
    formData.value._service.push(currentService.value)
  }
  if (editType.value === 'service') {
    formData.value._service[editIndex.value] = { ...currentService.value }
  }
  if (addType.value === 'field') {
    formData.value._fields.push(currentField.value)
  }
  if (editType.value === 'field') {
    formData.value._fields[editIndex.value] = { ...currentField.value }
  }
  if (addType.value === 'filter') {
    formData.value._filter.push(currentFilter.value)
  }
  if (editType.value === 'filter') {
    formData.value._filter[editIndex.value] = { ...currentFilter.value }
  }
  if (addType.value === 'step') {
    formData.value._steps.push(multipleSelection.value)
  }
  console.log('step', formData.value._steps)
  addButtonVisible.value = false
  addType.value = ''
  editType.value = ''
}
const addButton = (type: string) => {
  addType.value = type
  if (type === 'button') {
    currentButton.value = {
      _label: '',
      _method: '',
      _icon: '',
      _showOnInit: '',
      _showOnReadonly: '',
    }
  }
  if (type === 'service') {
    currentService.value = {
      _id: '',
      _api: '',
      _params: '',
    }
  }
  if (type === 'field') {
    currentField.value = {
      _id: '',
      _label: '',
      _visible: '',
      _editable: '',
      _tips: '',
      _group: '',
      _unit: '',
      _options: '',
      _required: '',
      _length: '',
      _validator: '',
    }
  }
  if (type === 'filter') {
    currentFilter.value = {
      _id: '',
      _filter_type: '',
    }
  }
  addButtonVisible.value = true
}
</script>

<style scoped>
.iconType {
  margin-left: 10px;
  color: #409eff;
}
.handlerItem_title {
  line-height: 40px;
  font-size: 14px;
  display: flex;
  align-items: center;
}
.handlerItem {
  padding-left: 5px;
  border-radius: 6px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05), -1px -1px 1px 1px rgba(0, 0, 0, 0.05);
}
.main_header {
  padding-left: 16px;
}
.header_item {
  display: inline-block;
  margin: 0 5px;
}
.formItemBox {
  width: 98%;
  height: 99%;
  box-sizing: border-box;
  /* padding: 10px 10px; */
  border-radius: 8px;
  margin: 2px auto;
  /* box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.04), -1px -1px 1px 1px rgba(0, 0, 0, 0.04); */
}
:dee(.el-select .el-input__suffix .el-input__suffix-inner) {
  display: none !important;
}
:deep(.selectType .el-icon-arrow-up:before) {
  content: '';
}
.rightItem {
  display: flex;
  align-items: center;
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
