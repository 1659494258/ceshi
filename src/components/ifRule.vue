<template>
  <div class="thenBox">
    <div style="display: flex; align-items: center; width: 100%; justify-content: space-between">
      <div style="display: flex; align-items: center; min-width: 50%; width: auto; font-size: 16px">
        <p style="width: 150px">输入条件:</p>
        <el-input v-model="statementRef" style="height: 40px" placeholder=" " size="small" />
      </div>
      <el-button size="mini" slot="reference" @click="getInputList()" text>获取输入条件列表</el-button>
    </div>
    <InputCondition
      :paramsData="$props.paramsData"
      :conditionListAll="conditionListAll"
      :level="level"
      :conditionIndex="conditionIndex"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, defineExpose, watch } from 'vue'
import InputCondition from './inputCondition.vue'
const props = defineProps(['dataDefault', 'paramsData'])
const data = ref({
  ...props.dataDefault,
})
const dataOptons = ref([
  {
    label: '小于',
    value: 'lt',
  },
  {
    label: '包含',
    value: 'in',
  },
  {
    label: '等于',
    value: 'eq',
  },
  {
    label: '或',
    value: 'or',
  },
  {
    label: '大于',
    value: 'gt',
  },
])
let conditionListAll = ref({
  _lop: '',
  _lod: [],
})
watch(
  props.paramsData,
  (newValue, oldValue) => {
    console.log('newparamsData', newValue, oldValue)
  },
  { deep: true, immediate: true }
)
// 放到onmounted里面时机不对，所以要放在外边
if (props.dataDefault?._lop) {
  conditionListAll.value = props.dataDefault
}
defineExpose({
  conditionListAll,
})
onMounted(() => {
  console.log(conditionListAll.value, 'ifValue', props)
})

let level: number = 1
let conditionIndex: number = 0
let statementRef = ref<string>('')
let finalConditionList = ref<Array<any>>([])

// 获取输入条件列表
const getInputList = () => {
  finalConditionList.value = conditionListAll.value._lod
  let firstOperator: string = conditionListAll?.value._lop
  let statement = ''
  if (finalConditionList.value.length > 0 && firstOperator) {
    for (let i = 0; i <= finalConditionList.value.length - 1; i++) {
      statement +=
        getInnerCondition(finalConditionList.value[i]) +
        ' ' +
        (i === finalConditionList.value.length - 1 ? '' : firstOperator) +
        ' '
    }
  }
  console.log('conditionListAll', conditionListAll.value)
  statementRef.value = statement
}

const getInnerCondition = (obj: any) => {
  if (!obj?._lop) {
    if (!obj?._rod?._in || !obj?._rop || !obj?._rod?._out) {
      // debugger
      return `" "`
    }
    return `"` + obj?._rod?._in + ' ' + obj?._rop + ' ' + obj?._rod?._out + `"`
  }
  if (obj?._lop && obj?._lod.length > 0) {
    let statement = ''
    for (let i = 0; i <= obj?._lod.length - 1; i++) {
      statement +=
        (i === 0 ? '(' : '') +
        getInnerCondition(obj?._lod[i]) +
        (i === obj?._lod.length - 1 ? '' : obj?._lop) +
        (i === obj?._lod.length - 1 ? ')' : '')
    }
    return statement
  }
  return '" "'
}
</script>

<style scoped>
.thenBox {
  border-radius: 6px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05), -1px -1px 1px 1px rgba(0, 0, 0, 0.05);
  margin-bottom: 10px;
  padding-left: 10px;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

:deep(.el-select .el-select__tags .el-tag--info) {
  background-color: #ffffff !important;
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

.ruleLeft {
  background-color: #fff;
  /* border: 1px solid #666; */
}
.ruleRight {
  background-color: #fff;
  /* border: 1px solid #666; */
}
</style>
