<template>
  <div class="group_Item">
    <el-form
      :model="data._control"
      label-width="auto"
      v-if="data._label"
      style="flex: 1; background-color: #fff; display: flex; flex-wrap: wrap; width: 100%"
    >
      <el-form-item
        label="可选码值:"
        v-if="data._control?._available"
        style="margin-right: 20px; display: flex; align-items: center"
      >
        <!-- align-items: flex-start不改为向上对齐的原因是：后面有输入框的时候，输入框的内容是居中的 -->
        <div class="rightItem">
          <!-- 显示的可点击的 -->
          <!-- <div ref="buttonRef"> -->
          <span
            href=""
            v-for="(item, index) in availableValueLink"
            target="_blank"
            style="margin-left: 10px"
            v-click-outside="onClickOutside"
          >
            {{ item }}
          </span>
          <!-- </div> -->

          <!-- 点击加号显示的东西 -->
          <el-popover placement="bottom" title="" :width="300" ref="popoverRef" trigger="click">
            <!-- <el-popover
            placement="bottom"
            title=""
            :width="300"
            ref="popoverRef"
            :virtual-ref="buttonRef"
            trigger="click"
            virtual-triggering
          > -->
            <template #reference>
              <el-icon
                size="16px"
                style="margin-left: 10px"
                :style="{ color: iconColor }"
                @mouseover="changeIconColor"
                @mouseout="resetIconColor"
              >
                <Plus />
              </el-icon>
              <el-icon color="#2e46e6" size="16px" style="margin-left: 10px"><Plus /></el-icon>
            </template>
            <div style="display: flex; flex-direction: column">
              <el-select
                v-model="data._control._available._value"
                multiple
                size="large"
                placeholder="可选码值"
                filterable
                remote
                reserve-keyword
                class="autoWidth"
              >
                <el-option v-for="(item, index) in optionsList" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </div>
          </el-popover>
        </div>
      </el-form-item>

      <el-form-item
        label="不可选码值:"
        v-if="data._control?._unavailable"
        style="margin-right: 20px; display: flex; align-items: center"
      >
        <div class="rightItem">
          <!-- 显示的可点击的 -->
          <span
            href=""
            v-for="(item, index) in thenValueLink"
            target="_blank"
            @click="rightItem(item)"
            style="margin-left: 10px"
          >
            {{ item }}
          </span>
          <!-- <div ref="buttonRe">
            <span
              href=""
              v-for="(item, index) in thenValueLink"
              target="_blank"
              style="margin-left: 10px"
              v-click-outside="onClickOutside"
            >
              {{ item }}
            </span>
          </div> -->
          <!-- 点击加号显示的东西 -->
          <el-popover placement="bottom" title="" :width="300" ref="popoverRef" trigger="click">
            <template #reference>
              <el-icon
                :style="{ color: iconColor }"
                @mouseover="changeIconColor"
                @mouseout="resetIconColor"
                size="16px"
                style="margin-left: 10px"
              >
                <Plus />
              </el-icon>
            </template>
            <div style="display: flex; flex-direction: column">
              <el-select
                v-model="data._control._unavailable._value"
                multiple
                size="large"
                placeholder="不可选码值"
                filterable
                remote
                reserve-keyword
                class="autoWidth"
              >
                <el-option v-for="(item, index) in optionsList" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </div>
          </el-popover>
        </div>
      </el-form-item>

      <el-form-item label="  " v-if="data._control?._max || data._control?._min" style="margin-right: 20px">
        <el-input
          v-if="data._control?._min"
          v-model="data._control._min._value"
          placeholder="最小值"
          style="width: 80px"
          input-style="text-align:center"
        />
        <span style="margin: 0 5px" v-if="data._control?._max && data._control?._min">-</span>
        <el-input
          v-if="data._control?._max"
          v-model="data._control._max._value"
          placeholder="最大值"
          style="width: 80px"
          input-style="text-align:center"
        />
      </el-form-item>
      <!-- <el-form-item label="  " style="margin-right: 20px"> -->
      <el-form-item
        label="  "
        style="margin-right: 20px"
        :style="
          data._value_type === '7' ||
          data._value_type === '8' ||
          data._value_type === '9' ||
          data._value_type === '10' ||
          data._value_type === '11'
            ? 'width: 100%'
            : ''
        "
      >
        <div style="width: 100%">
          <div style="margin: 5px 0">
            <el-select
              v-model="data._value"
              placeholder=" 请录入 "
              style="width: 150px"
              filterable
              clearable
              remote
              reserve-keyword
              v-if="
                data._value_type === '7' ||
                data._value_type === '8' ||
                data._value_type === '9' ||
                data._value_type === '10' ||
                data._value_type === '11'
              "
            >
              <el-option v-for="(item, index) in tableList" :key="index" :label="item.policyName" :value="item.info" />
            </el-select>
            <el-select
              v-model="data._value"
              placeholder=" 请录入 "
              style="width: 150px"
              filterable
              clearable
              remote
              reserve-keyword
              v-if="data._option_method && optionsList.length"
            >
              <!-- <el-option label="是" value="1" />
              <el-option label="否" value="0" /> -->
              <el-option v-for="(item, index) in optionsList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
            <el-input
              v-if="
                data._value_type != '7' &&
                data._value_type != '8' &&
                data._value_type != '9' &&
                data._value_type != '10' &&
                data._value_type != '11' &&
                !optionsList.length
              "
              v-model="data._value"
              style="width: 150px"
              placeholder=""
            />
            <el-button
              v-show="
                data._value_type === '7' ||
                data._value_type === '8' ||
                data._value_type === '9' ||
                data._value_type === '10' ||
                data._value_type === '11'
              "
              type="primary"
              link
              @click="configuration"
              style="margin-left: 10px"
            >
              配置
            </el-button>
          </div>
          <component
            v-if="
              (data._value_type === '7' ||
                data._value_type === '8' ||
                data._value_type === '9' ||
                data._value_type === '10' ||
                data._value_type === '11') &&
              props.viewType === '0' &&
              showComponent
            "
            :is="currentComponent(valuetypeList[data._value_type])"
            :dataDefault="data._value"
            :formData="data._value"
            @getParams="getParams"
            ref="childComponent"
            style="flex: 1"
          ></component>
        </div>
      </el-form-item>
    </el-form>
    <!-- dialog弹出框 -->
    <el-dialog
      v-model="centerDialogVisible"
      v-if="centerDialogVisible"
      title=""
      width="85%"
      align-center
      center
      :close-on-click-modal="false"
    >
      <div style="">
        <div style="border-top: 1px solid #eceff7; padding: 0px; margin-top: 10px">
          <component
            :is="currentComponent(valuetypeList[data._value_type])"
            :dataDefault="data._value"
            :formData="data._value"
            @getParams="getParams"
            ref="childComponent"
          ></component>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, unref, defineExpose, watch } from 'vue'
import { codeByMethod, codeByKey, getList, codeList } from '../services/index'
import { ClickOutside as vClickOutside } from 'element-plus'
import Parameter from './parameter.vue'
import ParameterGroup from './parameterGroup.vue'
import RuleStructure from './ruleStructure.vue'
import DateTable from './dataTable.vue'
import FlowPath from './flowPath.vue'
import Processor from './processor.vue'
import Interface from './interface.vue'
import { ElMessage } from 'element-plus'
const buttonRef = ref()
const buttonRe = ref()
const popoverRef = ref()
const componentValue = ref('')
const centerDialogVisible = ref(false) //dialog弹出框的显示控制
const showComponent = ref(false) //dialog弹出框的显示控制
const tableList = ref([]) //参数值的可选码值
const user = ref(JSON.parse(window.localStorage.getItem('user')))
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}

const props = defineProps(['dataDefault', 'dataKey', 'viewType'])
const data = ref({
  ...props.dataDefault,
})
const originalIconColor = ref('#000000')
const iconColor = ref(originalIconColor.value)
const optionsList = ref([])
const valuetypeList = {
  '7': '3',
  '8': '4',
  '9': '5',
  '10': '7',
  '11': '8',
}
// 根据选的显示对应的label
const thenValueLink = computed(() => {
  let list = []
  for (let j = 0; j < optionsList.value.length; j++) {
    for (let i = 0; i < unavailableValue.value.length; i++) {
      if (unavailableValue.value[i] === optionsList.value[j].id) {
        list.push(optionsList.value[j].name)
      }
    }
  }
  return list
})
// // 根据选的显示对应的label
const availableValueLink = computed(() => {
  let list = []
  if (optionsList.value) {
    for (let j = 0; j < optionsList.value.length; j++) {
      for (let i = 0; i < availableValue.value.length; i++) {
        if (availableValue.value[i] === optionsList.value[j].id) {
          list.push(optionsList.value[j].name)
        }
      }
    }
  }
  return list
})
const unavailableValue = computed(() => {
  let list = []
  if (data.value._control.hasOwnProperty('_unavailable')) {
    list = data.value._control._unavailable._value ? data.value._control._unavailable._value : []
    // console.log(list, '_unavailable', data.value._control)
  }
  return list
})
const availableValue = computed(() => {
  let list = []
  if (data.value._control.hasOwnProperty('_available')) {
    list = data.value._control._available._value
  }
  return list
})
watch(
  data,
  (newValue, oldValue) => {
    if (
      newValue._value_type === '7' ||
      newValue._value_type === '8' ||
      newValue._value_type === '9' ||
      newValue._value_type === '10' ||
      newValue._value_type === '11'
    ) {
      componentValue.value = newValue._value._id
      console.log('valueName', componentValue.value)
    }
    if (newValue._value_type === '8') {
      console.log('规则组件', newValue)
    }
  },
  { deep: true, immediate: true }
)
watch(
  props,
  (newValue, oldValue) => {
    console.log('props', newValue)
    if (!props.viewType) {
      showComponent.value = true
    }
    if (props.viewType === '1') {
      showComponent.value = false
    }
  },
  { deep: true, immediate: true }
)
// const valueName = computed(() => {
//   if (
//     data.value._value_type === '7' ||
//     data.value._value_type === '8' ||
//     data.value._value_type === '9' ||
//     data.value._value_type === '10' ||
//     data.value._value_type === '11'
//   ) {
//     console.log('valueName', data.value)
//   }
//   return 0
// })
function getValue() {
  return data.value
}

// 暴露 getValue 方法给父组件
defineExpose({
  getValue,
})
onMounted(() => {
  console.log('props-参数', props.dataDefault, props)
  // 判断参数类型是是否有码值
  if (props?.dataDefault?._option_method && props?.dataDefault?._option_params) {
    // if (props?.dataDefault?._option_method === '2') {
    //   codeList([props?.dataDefault?._option_params]).then(res => {
    //     optionsList.value = res.data.message.codeList[0].items
    //     console.log('optionsList', optionsList.value)
    //   })
    // }
    // let params = {
    //   id: props?.dataKey,
    //   codeMethod: props?.dataDefault?._option_method,
    //   codeParams: props?.dataDefault?._option_params,
    // }
    // codeByMethod(params).then(res => {
    //   optionsList.value = res.data.message.items
    //   console.log('res', optionsList.value)
    // })
    codeByKey(props.dataDefault._id).then(res => {
      optionsList.value = res.data.message.codes[0].items
      console.log('res', optionsList.value)
    })
  }
  if (
    data.value._value_type === '7' ||
    data.value._value_type === '8' ||
    data.value._value_type === '9' ||
    data.value._value_type === '10' ||
    data.value._value_type === '11'
  ) {
    getParamsList(valuetypeList[data.value._value_type])
  }
})

// 获取参数值的表格数据
const getParamsList = async (type: string) => {
  let params = {
    message: {
      policyId: '',
      policyGroup: '',
      policyType: type,
      orgId: user.orgId,
      status: '',
    },
  }
  await getList(params).then(response => {
    tableList.value = response.data.message.list
  })
}
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
const valueChange = value => {
  console.log('valueChange', value)
}
const getParams = (params: object) => {
  console.log('params', params)
}
// 点击配置
const configuration = () => {
  if (!data.value._value) {
    console.log(data.value)
    ElMessage({
      message: '请先进行选择，再配置',
      type: 'warning',
    })
  } else {
    console.log(!props.viewType)
    if (props.viewType === '1') {
      centerDialogVisible.value = true
    } else {
      showComponent.value = true
    }
  }
}
const changeIconColor = () => {
  iconColor.value = '#2e46e6'
}
const resetIconColor = () => {
  iconColor.value = 'black'
}
const rightItem = (item: any) => {}
</script>

<style scoped>
.rightItem {
  display: flex;
  align-items: center;
}
:deep(.el-select .el-select__tags .el-tag--info) {
  background-color: white;
}
:deep(.el-form-item) {
  margin-bottom: 2px !important;
}

.group_Item {
  flex: 1;
  height: auto;
  min-height: 40px;
  display: flex;
  width: 73%;
  /* padding: 5px 0; */
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
