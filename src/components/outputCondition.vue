<template>
  <div class="condition_group" ref="condition_group">
    <div style="display: flex">
      <el-button @click="addCondition" text>+</el-button>
      <div style="display: flex; flex-direction: column">
        <div v-for="(conditionItem, conditionIndex) in props.conditionListAll" :key="conditionIndex">
          <div class="condition_item" ref="condition_item">
            <!-- 纯条件 -->
            <div class="levelClass">
              <el-select
                ref="myselect"
                v-model="conditionItem._rod._in"
                placeholder="请选择"
                @change="firstChange($event, conditionIndex)"
                filterable
                clearable
                remote
                reserve-keyword
                style="width: 150px"
              >
                <el-option
                  v-for="item in tableList"
                  :key="item.name"
                  :label="item._label"
                  :value="item._id"
                ></el-option>
              </el-select>

              <!-- 操作条件 -->
              <el-select
                v-model="conditionItem._rop"
                placeholder="请选择"
                style="width: 100px"
                filterable
                clearable
                remote
                reserve-keyword
              >
                <el-option
                  v-for="item in parameterOperation"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="conditionItem._rod._out"
                placeholder="请选择"
                filterable
                clearable
                remote
                reserve-keyword
                style="width: 150px"
                v-if="
                  conditionItem.secondOption &&
                  conditionItem.secondOption.length &&
                  conditionItem._rop === '=' &&
                  conditionItem._rod._in
                "
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
                v-if="
                  !conditionItem.secondOption ||
                  (!conditionItem.secondOption.length && conditionItem._rop === '=' && conditionItem._rod._in)
                "
              ></el-input>
              <template v-if="conditionItem._rop === 'in' && conditionItem._rod._in">
                <div style="display: inline-block; margin-left: 10px">
                  <div class="rightItem">
                    <!-- 显示的可点击的 -->
                    <el-link
                      href=""
                      v-for="(item, index) in thenValueLink"
                      target="_blank"
                      @click="rightItem(item)"
                      style="margin-left: 10px"
                    >
                      {{ item }}
                    </el-link>
                    <!-- 点击加号显示的东西 -->
                    <el-popover placement="right" :width="300" trigger="click">
                      <template #reference>
                        <el-icon color="#2e46e6" size="16px" style="margin-left: 10px"><Plus /></el-icon>
                      </template>
                      <div style="display: flex; flex-direction: column">
                        <el-select v-model="thenValue" multiple size="large" placeholder=" " style="width: auto">
                          <el-option v-for="(item, index) in tableList" :label="item.name" :value="item.id" />
                        </el-select>
                      </div>
                    </el-popover>
                  </div>
                  <!-- 添加继承 -->
                </div>
              </template>

              <div style="margin-left: 20px">
                <el-tooltip :open-delay="700" effect="dark" content="删除此条件" placement="top-start">
                  <el-icon @click="deleteCondition(conditionIndex)">
                    <remove />
                  </el-icon>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { getList, codeById } from '../services/index'
interface _rod {
  _in: string
  _out: string
}
const user = ref(JSON.parse(window.localStorage.getItem('user')))
const thenValue = ref([])
const tableList = ref([])
// 根据选的显示对应的label
const thenValueLink = computed(() => {
  let list = []
  for (let j = 0; j < tableList.value.length; j++) {
    for (let i = 0; i < thenValue.value.length; i++) {
      // console.log('thenValue.value', thenValue.value)
      if (thenValue.value[i] === tableList.value[j].id) {
        list.push(tableList.value[j].name)
      }
    }
  }
  return list
})
//参数操作的码值
const parameterOperation = [
  {
    label: '等于',
    value: 'eq',
  },
  {
    label: '包含',
    value: 'in',
  },
]
interface condition {
  _rop: string
  _rod: _rod
  secondOption: any
}

const props = defineProps<{
  level: number
  conditionItem?: Array<any>
  conditionListAll: Array<condition>
  conditionIndex?: number
  paramsData?: Array<any>
}>()
watch(
  props.paramsData,
  (newValue, oldValue) => {
    console.log('outnewparamsData', newValue, oldValue)
    if (newValue.length) {
      tableList.value = newValue
    }
  },
  { deep: true, immediate: true }
)
let condition_item = ref<Array<HTMLElement>>([])
let condition_group = ref<HTMLElement | undefined>()

onMounted(() => {
  getFormList()
})

const rightItem = (item: any) => {
  console.log('item', item)
  // 根据所点找出对应的模板里的数据
  // for (let i = 0; i < componentList.value.length; i++) {
  //   if (componentList.value[i]._label === item) {
  //     conponentData.value = {
  //       ...componentList.value[i],
  //     }
  //   }
  // }
  // centerDialogVisible.value = true
}
// 获取表格数据
const getFormList = () => {
  let params = {
    message: {
      policyId: '',
      policyGroup: '',
      policyType: '1',
      orgId: user.orgId,
      status: '',
      roles: [],
    },
  }
  getList(params).then(response => {
    // tableList.value = response.data.message.list
  })
}
// 添加条件(同级条件 且 | 或)
const addCondition = () => {
  condition_group.value?.click()
  let conditionList = props.conditionListAll
  let obj: Object = {}
  obj = {
    _rop: '',
    _rod: {
      _in: '',
      _out: '',
    },
  }
  conditionList.push(obj as condition)
}

// 删除条件
const deleteCondition = (conditionIndex: number) => {
  console.log('conditionIndex:', conditionIndex)
  let conditionList = props.conditionListAll
  conditionList.splice(conditionIndex, 1)
}

// 条件第一个下拉框选择
const firstChange = (e: any, conditionIndex: number) => {
  let first = tableList.value.filter(item => {
    return item._id === e
  })
  // console.log('e', e, first)
  // 判断第一个所选的类型
  if (first[0]?._option_method) {
    codeById(first[0]?._id).then(res => {
      console.log('selected', res.data.message.codes[0].items)
      props.conditionListAll[conditionIndex as number].secondOption = res.data.message.codes[0].items
    })
  } else {
    props.conditionListAll[conditionIndex as number].secondOption = []
  }

  console.log('props.conditionListAll', props.conditionListAll)
}
</script>

<script lang="ts">
export default {
  name: 'outputCondition', //给组件命名
}
</script>

<style scoped>
.rightItem {
  display: flex;
  align-items: center;
}
.condition_group {
  padding: 10px 10px 10px 0;
  border-radius: 5px;
  display: flex;
  align-items: flex-start;
}

.el-select {
  margin-left: 20px;
  width: 120px;
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
