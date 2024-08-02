<template>
  <div
    style="
      padding-top: 0px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05), -1px -1px 1px 1px rgba(0, 0, 0, 0.05);
    "
    :id="props?.formData.policyId"
  >
    <div>
      <el-collapse v-model="collapseLsit" @change="handleChange" style="">
        <el-collapse-item name="1" id="1">
          <template #title class="collapseTitle">
            <div class="collapseTitle_left">
              <!-- collapse标题左侧 -->
              <div style="display: flex; align-items: center; margin-left: 5px">
                <input
                  v-model="parameterGroupData._label"
                  class="collapseTitle_left_title"
                  style="border: none; width: 240px"
                />
                <el-icon :size="16" hover="color:bule" @click.stop="changeUnfoldStatus(key)" v-if="!unfoldStatus">
                  <ArrowRightBold />
                </el-icon>
                <el-icon :size="16" hover="color:bule" @click.stop="changeUnfoldStatus(key)" v-if="unfoldStatus">
                  <ArrowLeftBold />
                </el-icon>
              </div>
              <!-- collapse标题右侧 -->
              <div
                style="display: flex; align-items: center; width: 90%; justify-content: end"
                v-if="unfoldStatus && parameterTitleIndex === key"
              >
                <div class="productTitle_right">
                  <!-- 标题相关的权限 -->
                  <div class="rightItem">
                    <el-button
                      @click="rightItem(item)"
                      link
                      type=""
                      v-for="(ite, index) in data._extends"
                      style="margin: 0 5px"
                    >
                      {{ ite }}
                    </el-button>
                  </div>
                  <!-- 添加继承 -->
                  <el-popover placement="left" title="" :width="300" trigger="click">
                    <template #reference>
                      <el-icon color="black" size="18px" style="margin-left: 10px"><Plus /></el-icon>
                    </template>
                    <div style="display: flex; flex-direction: column">
                      <el-select
                        v-model="data._extends"
                        multiple
                        size="large"
                        placeholder="继承其他同类型政策的编号"
                        style="width: auto"
                      >
                        <el-option label="授信对象" value="授信对象" />
                        <el-option label="定价方案" value="定价方案" />
                        <el-option label="用信方案" value="用信方案" />
                      </el-select>
                    </div>
                  </el-popover>
                  <div class="rightItem">
                    <span style="margin-right: 10px">被继承后是否允许被修改：</span>
                    <el-select v-model="parameterGroupData._right._editable" placeholder=" " style="width: 70px">
                      <el-option label="否" value="0" />
                      <el-option label="是" value="1" />
                    </el-select>
                  </div>
                  <div class="rightItem">
                    <span style="margin-right: 10px">被继承后是否允许被修改：</span>
                    <el-select v-model="parameterGroupData._right._disable" placeholder=" " style="width: 70px">
                      <el-option label="否" value="0" />
                      <el-option label="是" value="1" />
                    </el-select>
                  </div>
                </div>
              </div>
              <!-- 添加组件的按钮 -->
              <el-icon
                :style="{ color: iconColor }"
                @mouseover="changeIconColor"
                @mouseout="resetIconColor"
                size="22px"
                style="margin-left: 20px"
                @click.stop="addExtends"
              >
                <Plus />
              </el-icon>
            </div>
          </template>
          <div style="padding: 0 18px">
            <template v-for="(ite, iteKey) in parameterGroupData._params" :key="iteKey">
              <div class="collapseItem" v-if="ite._type === '1'">
                <div style="width: 200px" v-if="ite._type === '1'">
                  <!-- <div style="width: 250px" v-if="ite._type === '1'"> -->
                  <div style="display: flex; align-items: center; padding: 0 10px">
                    <p class="ruleName" v-if="ite._label">
                      {{ ite._label + ':' }}
                    </p>
                    <el-popover placement="right" title="" :width="320" trigger="click">
                      <template #reference>
                        <el-icon :size="12" style="" hover="color:bule">
                          <EditPen />
                        </el-icon>
                      </template>
                      <div style="display: flex; flex-direction: column">
                        <el-form :model="ite._right" label-width="auto" style="">
                          <el-form-item label="名称:">
                            <el-input v-model="ite._label" style="width: 215px" clearable />
                          </el-form-item>
                          <el-form-item label="被继承后是否允许被修改：">
                            <el-select v-model="ite._right._editable" placeholder=" ">
                              <el-option label="否" value="0" />
                              <el-option label="是" value="1" />
                            </el-select>
                          </el-form-item>
                          <el-form-item label="被继承后是否允许被停用：">
                            <el-select v-model="ite._right._disable" placeholder=" ">
                              <el-option label="否" value="0" />
                              <el-option label="是" value="1" />
                            </el-select>
                          </el-form-item>
                          <el-form-item
                            label="值控制："
                            v-if="
                              ite._value_type != '7' &&
                              ite._value_type != '8' &&
                              ite._value_type != '9' &&
                              ite._value_type != '10' &&
                              ite._value_type != '11'
                            "
                          >
                            <el-dropdown @command="changeCommand($event, ite, iteKey)">
                              <p class="el-dropdown-link">
                                <span style="">{{ getControl(ite._control) }}</span>
                                <el-icon class="el-icon--right" style="margin-right: 10px" color="#a8abb2">
                                  <arrow-down />
                                </el-icon>
                              </p>
                              <template #dropdown>
                                <el-dropdown-menu>
                                  <el-dropdown-item
                                    :command="controlItem.value"
                                    v-for="(controlItem, index) in controlList"
                                    :key="index"
                                  >
                                    <span :class="getClass(ite, controlItem)">{{ controlItem.label }}</span>
                                  </el-dropdown-item>
                                </el-dropdown-menu>
                              </template>
                            </el-dropdown>
                          </el-form-item>
                          <el-form-item
                            label="显示方式："
                            v-if="
                              ite._value_type === '7' ||
                              ite._value_type === '8' ||
                              ite._value_type === '9' ||
                              ite._value_type === '10' ||
                              ite._value_type === '11'
                            "
                          >
                            <el-select
                              v-model="ite._view_type"
                              placeholder=" "
                              :teleported="false"
                              :data-item="ite"
                              @change="changeViewType"
                            >
                              <el-option label="内嵌" value="0" />
                              <el-option label="弹框" value="1" />
                            </el-select>
                          </el-form-item>
                        </el-form>
                      </div>
                    </el-popover>
                  </div>
                </div>
                <component
                  ref="childRefs"
                  :is="currentComponent(ite._type)"
                  :dataDefault="ite"
                  :formData="ite"
                  :policyGroup="props.policyGroup"
                  :dataKey="ite._id"
                  :viewType="ite._view_type"
                  :id="ite._id"
                ></component>
                <div style="position: absolute; right: 10px; top: 10px">
                  <el-tooltip :open-delay="700" effect="dark" content="删除此参数" placement="top-start">
                    <el-icon @click="deleteCondition(ite, iteKey)">
                      <remove />
                    </el-icon>
                  </el-tooltip>
                </div>
              </div>
              <div v-else style="margin-bottom: 10px">
                <component
                  :is="currentComponent(ite._type)"
                  :dataDefault="ite"
                  :dataKey="iteKey"
                  :formData="ite"
                  :policyGroup="props.policyGroup"
                  :viewType="ite._view_type"
                  :id="ite._id"
                ></component>
              </div>
            </template>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- dialog弹出框 -->
    <el-dialog v-model="centerDialogVisible" title="" width="60%" align-center center>
      <span>Open the dialog from the center from the screen</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="centerDialogVisible = false">Confirm</el-button>
        </div>
      </template>
    </el-dialog>
    <!--最外层+号的 dialog弹出框 -->
    <el-dialog v-model="addDialogVisible" title="" width="80%" align-center center>
      <el-table
        :data="incomeArray"
        highlight-current-row
        @selection-change="handleSelectionChange"
        ref="multipleTableRef"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column property="policyId" label="编号" />
        <el-table-column property="policyName" label="名称" />
        <el-table-column property="remark" label="描述" />
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAdd">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, defineExpose, computed } from 'vue'
import { getList } from '../services/index'
const emit = defineEmits(['getParams'])
import parameterGroupCopy from './parameterGroupCopy.vue'
import parameterGroup from './parameterGroup.vue'
import RuleStructure from './ruleStructure.vue'
import DateTable from './dataTable.vue'
import FlowPath from './flowPath.vue'
const childRefs = ref([]) // 用来存储所有子组件的引用
const props = defineProps(['dataDefault', 'formData', 'policyGroup'])
const user = ref(JSON.parse(window.localStorage.getItem('user')))
const parameterGroupData = ref({
  _extends: [],
  _type: '',
  _label: '',
  _right: {
    _editable: '',
    _disable: '',
  },
  _params: [],
})
const data = ref({
  ...props.dataDefault,
})

const controlSelect = ref([])
const _view_type = ref([]) //显示样式
const incomeArray = ref([])
const addDialogVisible = ref(false) //控制+号的dialog的显示与隐藏

const multipleTableRef = ref()
const multipleSelection = ref([]) //选中添加的数据
const selectionParams = ref({}) //选中添加的数据转换成，接口需要的格式

const controlList = reactive([
  {
    label: '可选码值控制',
    value: '_available',
  },
  {
    label: '不可选码值控制',
    value: '_unavailable',
  },
  {
    label: '最大值',
    value: '_max',
  },
  {
    label: '最小值',
    value: '_min',
  },
])
const unfoldStatus = ref(false) //title右侧的东西是否展示的一个状态
const centerDialogVisible = ref(false) //控制dialog的显示与隐藏
const parameterTitleIndex = ref() //记录点击的是那个title
const originalIconColor = ref('#000000')

const iconColor = ref(originalIconColor.value)
const activeNames = ref(['0'])
const collapseLsit = ref(['1'])
const handleChange = (val: string[]) => {}

onMounted(() => {
  // 为了使所有的collapse默认展开
  for (let key in data.value) {
    collapseLsit.value.push(key)
  }
  console.log(data.value, 'parameterGroup-data', props)
  parameterGroupData.value._label = props?.formData?.policyName ? props?.formData?.policyName : data.value._label
  parameterGroupData.value._type = props?.formData?.policyType
  if (data.value?._params && Object.keys(data.value._params).length) {
    parameterGroupData.value._params = data.value._params
  }
  parameterGroupData.value._extends = data.value?.__extends ? data.value?.__extends : []
  // console.log(parameterGroupData.value, 'parameterGroupData')
  parameterGroupData.value._params.forEach(() => {
    childRefs.value.push(null)
  })
})
// 根据type匹配不同的组件
const currentComponent = (type: any) => {
  if (type === '1') {
    return parameterGroupCopy
  } else if (type === '2') {
    return parameterGroup
  } else if (type === '3') {
    return DateTable
  } else if (type === '4') {
    return RuleStructure
  } else if (type === '5') {
    return FlowPath
  }
}
//
const getControl = (ite: any) => {
  let controlList = ''
  if ('_available' in ite) {
    controlList = controlList + '可选码值控制,'
  }
  if ('_unavailable' in ite) {
    controlList = controlList + '不可选码值控制,'
  }
  if ('_min' in ite) {
    controlList = controlList + '最小值,'
  }
  if ('_max' in ite) {
    controlList = controlList + '最大值,'
  }
  return controlList
}
//点击菜单项触发的事件回调
const changeCommand = (command: string, ite: any, iteKey: any) => {
  if (command in ite._control) {
    delete ite._control[command]
    console.log(command, 'changeCommand', ite, iteKey)
  } else {
    ite._control[command] = {
      _right: '3',
      _value: '',
    }
  }
  // parameterGroupData.value._params[iteKey] = ite
  parameterGroupData.value._params.splice(iteKey, 1, ite)
  console.log(command, 'changeCommand1', ite, iteKey, parameterGroupData.value)
}
//
const getClass = (ite: any, controlItem: any) => {
  if (controlItem.value in ite._control) {
    console.log(ite, 'getClass', ite, controlItem)
    return 'activeClass'
  }
}
// 返回数据
const pushParams = () => {
  collectValues()
  // console.log('parameterGroupData', parameterGroupData.value)
  emit('getParams', {
    ...parameterGroupData.value,
  })
}
defineExpose({
  pushParams,
})
function collectValues() {
  const values = childRefs.value
    .map(childRef => {
      if (childRef && childRef.getValue) {
        return childRef.getValue()
      }
      return null
    })
    .filter(value => value !== null) // 过滤掉 null 值
  parameterGroupData.value._params = values
  console.log('collectValues', values, parameterGroupData.value) // 输出收集到的值
}

const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
  console.log(multipleSelection.value, 'multipleSelection.value')
}
// 获取引入的表格数据
const getFormList = async () => {
  let params = {
    message: {
      policyId: '',
      policyGroup: props.policyGroup,
      policyType: '1',
      orgId: user.orgId,
      status: '',
    },
  }
  await getList(params).then(response => {
    incomeArray.value = response.data.message.list
    // console.log('incomeArray', incomeArray.value)
  })
}
// 确认需要引入的数据
const confirmAdd = () => {
  if (multipleSelection.value.length) {
    multipleSelection.value.forEach(item => {
      parameterGroupData.value._params.push({
        _id: item.policyId,
        ...item.info,
      })
    })
    addDialogVisible.value = false
  } else {
    ElMessage({
      message: '至少选择一条数据',
      type: 'warning',
    })
  }
  console.log('parameterGroupData', parameterGroupData.value)
}
// 控制标题旁边的展开与收缩
const changeUnfoldStatus = (key: any) => {
  console.log('index', parameterTitleIndex.value, key)
  if (parameterTitleIndex.value === key) {
    unfoldStatus.value = !unfoldStatus.value
  } else {
    parameterTitleIndex.value = key
    unfoldStatus.value = !unfoldStatus.value
  }
}
// 显示样式的更改
const changeViewType = (value: any, event: any) => {
  console.log('changeViewType', value, event, parameterGroupData.value._params)
}
const rightItem = (item: any) => {
  console.log(item)
  centerDialogVisible.value = true
}
// 删除某一个参数
const deleteCondition = (item, index) => {
  parameterGroupData.value._params.splice(index, 1)
}

const changeIconColor = () => {
  iconColor.value = '#2e46e6'
}
const resetIconColor = () => {
  iconColor.value = 'black'
}
const addExtends = (item: any) => {
  getFormList()
  addDialogVisible.value = true
}
</script>

<style scoped>
.ruleName {
  font-size: 16px;
  line-height: 32px;
  margin: 0 5px 0 0;
  font-weight: 500;
  white-space: nowrap;
}
.el-dropdown-link {
  width: 114px;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
}
.activeClass {
  color: #409eff;
}
:deep(.el-dialog--center .el-dialog__body) {
  max-height: 80vh; /* 设置最大高度为视口高度的80% */
  overflow-y: auto; /* 当内容超出最大高度时，显示垂直滚动条 */
}
.collapseItem {
  position: relative;
  display: flex;
  border-radius: 8px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.04), -1px -1px 1px 1px rgba(0, 0, 0, 0.04);
  margin: 10px 0;
}
:deep(.el-popover) {
  max-width: calc(100vw - 100px); /* 假设你希望最大宽度不超过视口宽度减去100px */
  width: auto; /* 让宽度根据内容自适应 */
}
:deep(.el-collapse-item__content) {
  padding-bottom: 10px !important;
}
.productTitle_right {
  /* width: 80%; */
  display: flex;
  align-items: center;
  overflow: auto;
  white-space: nowrap;
  /* 隐藏滚动条位置 */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
.rightItem {
  display: inline-block;
  margin-left: 10px;
}
input:focus {
  box-shadow: 0 0 0 1px #c0c4cc !important;
  border: none !important;
  outline: none;
  border-radius: 5px;
}
.collapseTitle_left_title {
  font-size: 18px;
  line-height: 36px;
  margin: 0 5px 0 0;
  font-weight: 400;
}
.collapseTitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
}

.collapseTitle_left {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 97%;
}

.groupItem {
  width: 100%;
  height: auto;
  display: flex;
  /* border-bottom: 1px solid #eceff7; */
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
  text-align: center;
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
