<template>
  <div class="thenBox">
    <div style="display: flex; align-items: center; width: 100%; justify-content: space-between">
      <div style="display: flex; align-items: center; min-width: 50%; width: auto; font-size: 16px">
        <p style="width: 160px">不满足条件结果:</p>
        <el-input v-model="statementRef" style="height: 40px" placeholder=" " size="small" />
      </div>
      <el-button size="mini" slot="reference" @click="getOutputList()" text>获取输入条件列表</el-button>
    </div>
    <OutputComp
      :conditionListAll="outputConditionListAll"
      :level="level"
      :conditionIndex="conditionIndex"
      :paramsData="$props.paramsData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, defineExpose } from 'vue'
import { codeById } from '../services/index'
import OutputComp from './outputCondition.vue'
let outputConditionListAll = ref([])
let level: number = 1
let conditionIndex: number = 0
let statementRef = ref<string>('')
const user = ref(JSON.parse(window.localStorage.getItem('user')))
const props = defineProps(['dataDefault', 'paramsData'])
const thenValue = ref([])
const conponentData = ref({}) //dialog中组件的初始数据
const thenOptionList = ref([]) //当为component是右侧的下拉框数值
const componentList = ref([]) //当为component是右侧的下拉框数值
const centerDialogVisible = ref(false) //控制dialog的显示与隐藏
const data = ref({
  ...props.dataDefault,
})
defineExpose({
  outputConditionListAll,
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
    label: '大于',
    value: 'gt',
  },
])
// 根据选的显示对应的label
const thenValueLink = computed(() => {
  let list = []
  // for (let j = 0; j < thenOptionList.value.length; j++) {
  //   for (let i = 0; i < thenValue.value.length; i++) {
  //     if (thenValue.value[i] === thenOptionList.value[j].value) {
  //       list.push(thenOptionList.value[j].label)
  //     }
  //   }
  // }
  return list
})
// 放到onmounted里面时机不对，所以要放在外边
if (props.dataDefault?.length) {
  outputConditionListAll.value = props.dataDefault
}
onMounted(() => {
  // console.log(data.value);
  // 根据component筛选出相应的多选条件
  // if (data.value._rule._else._od[1]._op === 'component') {
  //   for (let i = 0; i < data.value._rule._else._od[1]._od.length; i++) {
  //     thenOptionList.value.push({
  //       label: data.value._rule._else._od[1]._od[i]._label,
  //       value: data.value._rule._else._od[1]._od[i]._id,
  //     })
  //     thenValue.value.push(data.value._rule._else._od[1]._od[i]._id)
  //   }
  //   // console.log(thenOptionList.value, 'thenOptionList.value', thenValueLink.value)
  // }
  // componentList.value = data.value._rule._else._od[1]._od
})
// 获取输出条件列表
const getOutputList = () => {
  let finalConditionList: Array<any> = outputConditionListAll.value
  let statement: string = ''
  for (let i = 0; i <= finalConditionList.length - 1; i++) {
    statement += i + 1 + ':' + getInnerCondition(finalConditionList[i]) + '\n'
  }
  console.log(statement)
  statementRef.value = statement
}
const getInnerCondition = (obj: any) => {
  if (!obj?._lop) {
    if (!obj?._rod?._in || !obj?._rop || !obj?._rod?._out) {
      return `" "`
    }
    return `"` + obj?._rod?._in + obj?._rop + obj?._rod?._out + `"`
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

const rightItem = (item: any) => {
  // 根据所点找出对应的模板里的数据
  for (let i = 0; i < componentList.value.length; i++) {
    if (componentList.value[i]._label === item) {
      conponentData.value = {
        ...componentList.value[i],
      }
    }
  }
  centerDialogVisible.value = true
}
</script>

<style scoped>
.thenBox {
  border-radius: 6px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05), -1px -1px 1px 1px rgba(0, 0, 0, 0.05);
  margin-bottom: 10px;
  padding-left: 10px;
}
:deep(.el-select .el-select__tags .el-tag--info) {
  background-color: #ffffff !important;
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
/* :deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 0px !important;
}
:deep(.el-select .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 0px !important;
}
:deep(.el-select) {
  --el-select-border-color-hover: #fff;
} */
</style>
