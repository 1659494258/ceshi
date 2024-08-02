<template>
  <div class="condition_group" ref="condition_group">
    <div style="display: flex">
      <!-- 第一层 + -->
      <div class="levelClass" v-if="level === 1">
        <el-popover placement="top" trigger="click">
          <div>
            <div class="conditionType" @click="addCondition('empty_param')">参数条件</div>
            <div class="line"></div>
            <div class="conditionType" @click="addCondition('empty_logic')">逻辑条件</div>
          </div>
          <template #reference>
            <el-icon>
              <Plus />
            </el-icon>
          </template>
        </el-popover>

        <el-select
          v-if="props.conditionListAll?._lod?.length > 1"
          style="width: 80px"
          v-model="firstLevelValue"
          placeholder="请选择"
          @change="firstLevelOrChange"
          filterable
          clearable
          remote
          reserve-keyword
        >
          <el-option
            v-for="item in logicalOperation"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>

      <div class="">
        <div
          :style="{
            paddingBottom: conditionItem?.inputConditions?._lod?.length > 0 ? '10px' : '',
          }"
          v-for="(conditionItem, conditionIndex) in props.conditionListAll?._lod"
          :key="conditionIndex"
        >
          <div class="condition_item" ref="condition_item">
            <!-- 二层及后面括号 -->
            <div class="levelClass" v-if="conditionItem?._lop">
              <el-popover placement="top" trigger="click" v-model="conditionItem.visible" v-if="conditionItem?._lop">
                <div>
                  <div class="conditionType" @click="addCondition('param', conditionIndex)">参数条件</div>
                  <div class="line"></div>
                  <div class="conditionType" @click="addCondition('logic', conditionIndex)">逻辑条件</div>
                </div>
                <template #reference>
                  <el-icon>
                    <Plus />
                  </el-icon>
                </template>
              </el-popover>

              <div style="margin-left: 10px">
                <el-tooltip :open-delay="700" effect="dark" content="删除此条件" placement="top-start">
                  <el-icon @click="deleteCondition(conditionIndex)">
                    <remove />
                  </el-icon>
                </el-tooltip>
              </div>
              <el-select
                v-if="conditionItem?._lod?.length > 1"
                style="width: 120px"
                v-model="conditionItem._lop"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in andOrOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>

              <div class="son" v-if="conditionItem?._lop">
                <input-condition
                  :conditionListAll="conditionItem"
                  :level="childLevel"
                  :conditionIndex="conditionIndex"
                  :paramsData="$props.paramsData"
                ></input-condition>
              </div>
            </div>

            <!-- 纯条件 -->
            <div v-else class="levelClass">
              <el-select
                ref="myselect"
                v-model="conditionItem._rod._in"
                placeholder="请选择"
                @change="firstChange($event, conditionIndex)"
                filterable
                clearable
                remote
                reserve-keyword
              >
                <el-option
                  v-for="item in tableList"
                  :key="item.name"
                  :label="item._label"
                  :value="item._id"
                ></el-option>
              </el-select>
              <!-- 条件 -->
              <el-select
                v-model="conditionItem._rop"
                placeholder="请选择"
                filterable
                clearable
                remote
                reserve-keyword
                style="width: 100px"
              >
                <el-option
                  v-for="item in parameterOperation"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <!-- <el-select v-model="conditionItem._rop" placeholder="请选择">
                <el-option
                  v-for="item in conditionItem.operatorOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select> -->
              <!--  -->
              <el-select
                v-model="conditionItem._rod._out"
                placeholder="请选择"
                filterable
                clearable
                remote
                reserve-keyword
                style="width: 150px"
                v-if="conditionItem.secondOption && conditionItem.secondOption.length"
              >
                <el-option
                  v-for="item in conditionItem.secondOption"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-input
                v-model="conditionItem._rod._out"
                placeholder="请输入"
                style="margin-left: 20px; width: 150px"
                v-if="!conditionItem.secondOption || !conditionItem.secondOption.length"
              ></el-input>
              <!-- 删除的标志 -->
              <div style="margin-left: 10px">
                <el-tooltip :open-delay="700" effect="dark" content="删除此条件" placement="top-start">
                  <el-icon @click="deleteCondition(conditionIndex)">
                    <remove />
                  </el-icon>
                </el-tooltip>
              </div>
            </div>
            <div
              class="relationVerticalLine"
              v-if="props.conditionListAll?._lod?.length > 1"
              :style="{
                height:
                  props.conditionListAll?._lod?.length === 1 ||
                  conditionIndex === props.conditionListAll?._lod?.length - 1
                    ? '0px'
                    : nodeSide[conditionIndex] + 'px',
                top: selfHeight[conditionIndex] / 2 + 'px',
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, watch, nextTick, onMounted } from 'vue'
import { getList, codeById } from '../services/index'
import codeJson from './code.json'
const tableList = ref([])
const user = ref(JSON.parse(window.localStorage.getItem('user')))
//逻辑操作的码值
const logicalOperation = [
  {
    label: 'and',
    value: 'and',
  },
  {
    label: 'or',
    value: 'or',
  },
]
//参数操作的码值
const parameterOperation = [
  {
    label: '小于',
    value: 'lt',
  },
  {
    label: '小于等于',
    value: 'le',
  },
  {
    label: '等于',
    value: 'eq',
  },
  {
    label: '大于',
    value: 'gt',
  },
  {
    label: '大于等于',
    value: 'ge',
  },
]

interface condition {
  _lop: string
  _lod: Array<any>
}

const props = defineProps<{
  level: number
  conditionItem?: Array<any>
  conditionListAll: condition
  conditionIndex?: number
  paramsData?: Array<any>
}>()

watch(
  props.conditionListAll,
  (newValue, oldValue) => {
    console.log('newValue, oldValue', newValue, oldValue)
    nextTick(() => {
      getNodeSide()
    })
  },
  { deep: true, immediate: true }
)

let childLevel: number = getCurrentInstance()?.parent ? props.level + 1 : props.level

let nodeSide = ref<Array<any>>([])
let selfHeight = ref<Array<any>>([])
let andOrOption = ref<Array<any>>(codeJson?.code?.andOr)
let firstOption = ref<Array<any>>(codeJson?.code?.firstOption)
let secondOption = ref<any>(codeJson?.code?.secondOption)
let operateOption = ref<any>(codeJson?.code?.operate)
let firstLevelValue = ref<string>('and') //最外侧的逻辑参数

let condition_item = ref<Array<HTMLElement>>([])
let condition_group = ref<HTMLElement | undefined>()
onMounted(() => {
  getFormList()
  console.log('propsinput', props)
})
watch(
  props.paramsData,
  (newValue, oldValue) => {
    console.log('innewparamsData', newValue, oldValue)
    if (newValue.length) {
      tableList.value = newValue
    }
  },
  { deep: true, immediate: true }
)
// 添加括号
const addSonCondition = (conditionIndex: number, type: string) => {
  let obj: Object | null = null
  if (type === 'param')
    obj = {
      _rop: '',
      _rod: [],
    }
  if (type === 'logic')
    obj = {
      _lop: 'and',
      _lod: [],
    }

  let conditionList = props.conditionListAll?._lod
  conditionList[conditionIndex]?._lod?.push(obj)
}
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
    // tableList.value = response.data.message.list
    // console.log(' tableList.value', tableList.value)
  })
}
// 添加条件(同级条件 且 | 或)
const addCondition = (type: string, conditionIndex?: number) => {
  condition_group.value?.click()
  let conditionList = props.conditionListAll?._lod
  let inputConditions = props.conditionListAll
  let obj: Object = {}
  if (props.level === 1 && !inputConditions._lop) {
    inputConditions._lop = firstLevelValue.value
  }
  // 第一层添加
  if (type === 'empty_param') {
    obj = {
      _rop: '',
      _rod: {
        _in: '',
        _out: '',
      },
    }
    conditionList.push(obj)
    console.log('empty_param')
  }
  // 第一层添加
  if (type === 'empty_logic') {
    obj = {
      _lop: 'and',
      _lod: [],
    }
    console.log('empty_logic')
    conditionList.push(obj)
  }

  if (type === 'logic' || type === 'param') {
    addSonCondition(conditionIndex as number, type)
  }
}

// 删除条件
const deleteCondition = (conditionIndex: number) => {
  let conditionList = props.conditionListAll?._lod
  conditionList.splice(conditionIndex, 1)
}

// 计算节点距离
const getNodeSide = () => {
  let allItem = condition_item.value

  let newArr: any = []
  let heightArr: any = []
  if (allItem?.length > 1) {
    newArr = allItem.slice(1).map((value: any, index: number) => {
      return value.offsetTop - allItem[index].offsetTop + value.clientHeight / 2 - allItem[index].clientHeight / 2
    })

    heightArr = allItem.map((value: any) => {
      return value.clientHeight
    })
  }

  if (newArr?.length > 0) {
    nodeSide.value = newArr
  }

  if (heightArr?.length > 0) {
    selfHeight.value = heightArr
  }
}

// // 最外层逻辑符
const firstLevelOrChange = (e: any) => {
  props.conditionListAll._lop = e
}

// 条件第一个下拉框选择
const firstChange = (e: any, conditionIndex: number) => {
  let first = tableList.value.filter(item => {
    return item._id === e
  })
  // 判断第一个所选的类型
  if (first[0]?._option_method) {
    codeById(first[0]?._id).then(res => {
      console.log('selected', res.data.message.codes[0].items)
      props.conditionListAll._lod[conditionIndex as number].secondOption = res.data.message.codes[0].items
    })
  } else {
    console.log('input')
    props.conditionListAll._lod[conditionIndex as number].secondOption = []
  }
  console.log('e', e, first)

  let key = firstOption.value.find(item => item.value === e)?.mark
  // props.conditionListAll._lod[conditionIndex as number].secondOption = secondOption.value[key]
  // 可选操作
  // props.conditionListAll._lod[conditionIndex as number].operatorOption = operateOption.value[key]
}
</script>

<script lang="ts">
export default {
  name: 'inputCondition', //给组件命名
}
</script>

<style scoped>
.condition_group {
  padding: 10px;
  border-radius: 5px;
  display: flex;
  align-items: flex-start;
}

.el-select {
  margin-left: 20px;
  /* width: 120px; */
}

.rule_item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

.addBtn {
  display: flex;
  height: 100%;
  align-items: flex-start;
}

.condition_item {
  display: flex;
  align-items: center;
  position: relative;
  padding: 10px;
}

.relation {
  position: absolute;
  top: 50%;
  transform: translate(20px, -75px);
  display: flex;
  align-items: flex-start;
}

.sonRelation {
  position: absolute;
  top: 50%;
  transform: translate(80px, 26px);
}

.relationVerticalLine {
  width: 5px;
  border: 1px solid black;
  border-right: 0px solid;
  border-bottom: 0px solid;
  position: absolute;
  margin-right: 20px;
}

.relationHorizontalLine {
  width: 10px;
  height: 1px;
  background-color: black;
  transform: translateY(27px);
}

.son {
  margin: 20px;
}

.conditionType {
  height: 30px;
  line-height: 30px;
  text-align: center;
}

.conditionType:hover {
  color: deepskyblue;
  background-color: #e8f1fc;
}

.showBackground {
  padding: 10px;
}

.levelClass {
  display: flex;
  align-items: center;
}
</style>
