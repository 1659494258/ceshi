<template>
  <!-- 参数组件 -->
  <el-form :model="compoentData" label-width="auto" style="">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="from_item">
          <p>参数类型：</p>
          <el-select
            v-model="compoentData._value_type"
            placeholder=" "
            style="width: 150px"
            filterable
            remote
            reserve-keyword
          >
            <el-option v-for="(key, value, index) in codeValue.ValueType" :label="key" :value="value" :key="index" />
          </el-select>
        </div>
      </el-col>
      <el-col :span="12" v-if="compoentData._value_type === '3'">
        <div class="from_item">
          <p>小数位数：</p>
          <el-input v-model="compoentData._precision" style="width: 215px" />
        </div>
      </el-col>
      <el-col :span="12" v-if="compoentData._value_type === '1'">
        <div class="from_item">
          <p>是否使用码值：</p>
          <el-select
            v-model="optionStatus"
            placeholder="  "
            style="width: 150px"
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

      <el-col :span="12" v-if="compoentData._value_type === '1' && optionStatus === '1'">
        <div class="from_item">
          <p>码值获取方式：</p>
          <el-select
            v-model="compoentData._option_method"
            placeholder="  "
            style="width: 150px"
            filterable
            clearable
            remote
            reserve-keyword
          >
            <el-option v-for="(key, value, index) in codeValue.CodeMethod" :label="key" :value="value" :key="index" />
          </el-select>
        </div>
      </el-col>
      <el-col :span="12" v-if="compoentData._value_type === '1' && optionStatus === '1'">
        <div class="from_item">
          <p>码值方法传参：</p>
          <el-input v-model="compoentData._option_params" style="width: 150px" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="from_item">
          <p>参数值：</p>
          <!-- 引用类型 -->
          <el-select
            v-model="paramValue"
            placeholder="  "
            style="width: 150px"
            filterable
            clearable
            remote
            reserve-keyword
            v-if="
              compoentData._value_type === '7' ||
              compoentData._value_type === '8' ||
              compoentData._value_type === '9' ||
              compoentData._value_type === '10' ||
              compoentData._value_type === '11'
            "
          >
            <el-option v-for="(item, index) in tableList" :key="index" :label="item.policyName" :value="item.info" />
          </el-select>
          <el-input v-else v-model="paramValue" style="width: 150px" />
          <el-button
            v-if="
              compoentData._value_type === '7' ||
              compoentData._value_type === '8' ||
              compoentData._value_type === '9' ||
              compoentData._value_type === '10' ||
              compoentData._value_type === '11'
            "
            type="primary"
            link
            @click="configuration"
            style="margin-left: 10px"
          >
            配置
          </el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="from_item">
          <p>被继承后是否允许被修改：</p>
          <el-select
            v-model="compoentData._right._editable"
            placeholder="  "
            style="width: 150px"
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
      <el-col :span="12">
        <div class="from_item">
          <p>被继承后是否允许被修改：</p>
          <el-select
            v-model="compoentData._right._disable"
            placeholder="  "
            style="width: 150px"
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
      <!-- <el-col :span="12" v-if="controlList.includes('_available')">
        <div class="from_item">
          <p>可选码值：</p>
          <el-select
            v-model="compoentData._control._available._value"
            placeholder="  "
            style="width: 150px"
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
      <el-col :span="12" v-if="controlList.includes('_unavailable')">
        <div class="from_item">
          <p>不可选码值：</p>
          <el-select
            v-model="compoentData._control._unavailable._value"
            placeholder="  "
            style="width: 150px"
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
      <el-col :span="12" v-if="controlList.includes('_max')">
        <div class="from_item">
          <p>最大值：</p>
          <el-input v-model="compoentData._control._max._value" placeholder=" " style="width: 150px" />
        </div>
      </el-col>
      <el-col :span="12" v-if="controlList.includes('_min')">
        <div class="from_item">
          <p>最小值：</p>
          <el-input v-model="compoentData._control._min._value" placeholder=" " style="width: 150px" />
        </div>
      </el-col> -->
      <el-col
        :span="24"
        v-if="
          compoentData._value_type != '7' &&
          compoentData._value_type != '8' &&
          compoentData._value_type != '9' &&
          compoentData._value_type != '10' &&
          compoentData._value_type != '11'
        "
      >
        <div class="from_item">
          <p>值控制：</p>
          <el-checkbox-group v-model="controlList">
            <el-checkbox v-for="(ke, val, ind) in codeValue.controlOptionsList" :label="val" :value="ke" :key="ind" />
          </el-checkbox-group>
        </div>
      </el-col>
    </el-row>
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
    :show-close="false"
  >
    <div style="">
      <div style="border-top: 1px solid #eceff7; padding: 0px; margin-top: 10px">
        <component
          :is="currentComponent(paramValue?._type)"
          :dataDefault="paramValue"
          :formData="paramValue"
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
</template>
<!-- 不行的话就直接用单个的字段 -->
<script setup lang="ts">
import { ref, reactive, onMounted, watch, defineExpose, computed } from 'vue'
import { ElNotification } from 'element-plus'
import codeValue from '../assets/json/codeValue.json'
import { getList, codeById } from '../services/index'
import Parameter from './parameter.vue'
import ParameterGroup from './parameterGroup.vue'
import RuleStructure from './ruleStructure.vue'
import DateTable from './dataTable.vue'
import FlowPath from './flowPath.vue'
import Processor from './processor.vue'
import Interface from './interface.vue'
const props = defineProps(['dataDefault', 'formData'])
const emit = defineEmits(['getParams'])
const typeStatus = ref('')
const paramValue = ref(null)
const centerDialogVisible = ref(false) //dialog弹出框的显示控制
const user = ref(JSON.parse(window.localStorage.getItem('user')))
const optionStatus = ref('')
const controlBase = ref({})
const controlList = ref([])
const optionsList = ref([]) //当参数有码值的时候，码值的集合
const tableList = ref([]) //参数值的可选码值
const propsData = ref({
  ...props.dataDefault,
})
const compoentData = ref({
  _value_type: '',
  _precision: '',
  _option_params: '',
  _option_method: '',
  _unit: '',
  _value: '',
  _control: {},
  _roles: [],
  _right: {
    _editable: '',
    _disable: '',
  },
})
const valuetypeList = {
  '7': '3',
  '8': '4',
  '9': '5',
  '10': '7',
  '11': '8',
}
watch(
  compoentData,
  (newValue, oldValue) => {
    // console.log('compoentData', newValue)
    if (compoentData.value?._option_method) {
      optionStatus.value = '1'
    } else {
      optionStatus.value = '0'
    }
    if (
      newValue._value_type === '7' ||
      newValue._value_type === '8' ||
      newValue._value_type === '9' ||
      newValue._value_type === '10' ||
      newValue._value_type === '11'
    ) {
      getParamsList(valuetypeList[newValue._value_type])
      controlList.value = []
    }

    if (compoentData.value?._value && !paramValue.value) {
      paramValue.value = compoentData.value?._value
    } else if (!paramValue.value) {
      paramValue.value = null
    }

    let list = []
    if (compoentData.value?._control && Object.keys(compoentData.value._control).length) {
      for (const key in compoentData.value._control) {
        list.push(key)
      }
    }
    controlList.value = list
    console.log('compoentData', newValue, oldValue, controlList.value)
  },
  { deep: true, immediate: true }
)

watch(
  controlList,
  (newValue, oldValue) => {
    if (newValue.includes('_available') && !compoentData.value?._control.hasOwnProperty('_available')) {
      compoentData.value._control['_available'] = {
        _value: '',
        _right: '',
      }
    } else if (!newValue.includes('_available') && compoentData.value?._control.hasOwnProperty('_available')) {
      delete compoentData.value?._control['_available']
    }
    if (newValue.includes('_unavailable') && !compoentData.value?._control.hasOwnProperty('_unavailable')) {
      compoentData.value._control['_unavailable'] = {
        _value: '',
        _right: '',
      }
    } else if (!newValue.includes('_unavailable') && compoentData.value?._control.hasOwnProperty('_unavailable')) {
      delete compoentData.value?._control['_unavailable']
    }
    if (newValue.includes('_max') && !compoentData.value?._control.hasOwnProperty('_max')) {
      compoentData.value._control['_max'] = {
        _value: '',
        _right: '',
      }
    } else if (!newValue.includes('_max') && compoentData.value?._control.hasOwnProperty('_max')) {
      delete compoentData.value?._control['_max']
    }
    if (newValue.includes('_min') && !compoentData.value?._control.hasOwnProperty('_min')) {
      compoentData.value._control['_min'] = {
        _value: '',
        _right: '',
      }
    } else if (!newValue.includes('_min') && compoentData.value?._control.hasOwnProperty('_min')) {
      delete compoentData.value?._control['_min']
    }
    console.log('compoentData.value', compoentData.value, newValue)
  },
  { deep: true, immediate: true }
)

onMounted(() => {
  compoentData.value = { ...props.dataDefault }
  typeStatus.value = 'add'
  if (compoentData.value.hasOwnProperty('_control')) {
    typeStatus.value = 'edit'
    // getControl(compoentData.value._control)
  } else {
    compoentData.value._control = {}
  }
  if (typeStatus.value === 'add') {
    // compoentData.value._control = []
    compoentData.value._right = {
      _editable: '',
      _disable: '',
    }
  }
  compoentData.value._type = props.formData?.policyType
  compoentData.value._label = props.formData?.policyName
  console.log(compoentData.value, 'compoentData', props)
})
// 点击配置
const configuration = () => {
  console.log(paramValue.value, 'configuration')
  if (paramValue.value) {
    centerDialogVisible.value = true
  } else {
    ElNotification({
      title: '提示',
      message: '未选择数据',
      type: 'warning',
    })
  }
}
const getParams = (params: object) => {
  // componentParams.value = params
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
// 获取参数值的表格数据
const getParamsList = async (type: string) => {
  let params = {
    message: {
      policyId: '',
      policyGroup: '1',
      policyType: type,
      // orgId: '637582',
      orgId: user.orgId,
      status: '',
      roles: [],
    },
  }
  await getList(params).then(response => {
    tableList.value = response.data.message.list
  })
}
// 获取模板中需要的control数据
const getControl = control => {
  let _control = []
  if (Object.keys(control).length) {
    Object.keys(control).forEach(key => {
      _control.push(key)
    })
  }
  compoentData.value._control = _control
}
// 返回参数需要的control数据
const returnControl = () => {
  let _control: any = {}
  if (compoentData.value._control.length) {
    console.log('compoentData', compoentData.value._control.length)
    for (let index = 0; index < compoentData.value._control.length; index++) {
      _control[compoentData.value._control[index]] = {}
      if (typeStatus.value === 'add') {
        _control[compoentData.value._control[index]] = {}
      } else {
        _control[compoentData.value._control[index]] = propsData.value?._control[compoentData.value._control[index]]
          ? propsData.value?._control[compoentData.value._control[index]]
          : {}
      }
    }
  }
  controlBase.value = _control
  console.log('controlBase', controlBase.value)
}

const pushParams = () => {
  // returnControl()
  compoentData.value._value = paramValue.value
  compoentData.value._roles = props.formData.roles
  emit('getParams', {
    ...compoentData.value,
  })
}
defineExpose({
  pushParams,
})
</script>

<style scoped>
.from_item {
  display: flex;
  align-items: center;
}
.from_item p {
  margin-right: 10px;
}
.fromItem {
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
