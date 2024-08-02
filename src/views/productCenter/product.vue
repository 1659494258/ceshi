<template>
  <div class="productCenter">
    <!-- 左侧树图 -->
    <div style="padding-top: 20px">
      <el-tree
        style="max-width: 600px; width: 180px; font-size: 17px !important"
        :data="treeData"
        default-expand-all
        @node-click="handleNodeClick"
      />
    </div>
    <!--  -->
    <div style="flex: 1; height: 100%; overflow-y: scroll; padding-top: 10px; box-sizing: border-box">
      <div class="product" v-for="(item, key, index) in policy._data" :key="index" :id="key">
        <div class="productTitle">
          <!-- 左侧标题和图标 -->
          <div class="productTitle_left">
            <input
              v-model="item._label"
              style="
                font-size: 22px;
                line-height: 50px;
                margin: 0 5px 0 0;
                font-weight: 600;
                border: none;
                width: 100px;
              "
            />
            <el-icon :size="16" hover="color:bule" @click="changeUnfoldStatus(index)" v-if="!unfoldStatus">
              <ArrowRightBold />
            </el-icon>
            <el-icon :size="16" hover="color:bule" @click="changeUnfoldStatus(index)" v-if="unfoldStatus">
              <ArrowLeftBold />
            </el-icon>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; width: 90%">
            <div style="display: flex; align-items: center; width: 95%; justify-content: end">
              <div class="rightItem">
                <!-- primary -->
                <el-button
                  @click="rightItem(item)"
                  link
                  type=""
                  v-for="(item, index) in policyData._extends"
                  style="margin: 0 5px"
                >
                  {{ item }}
                </el-button>
              </div>
              <!-- 添加继承 -->
              <el-popover
                placement="left"
                title=""
                :width="300"
                trigger="click"
                class="productTitle_right"
                v-if="productTitleIndex === index && unfoldStatus"
              >
                <template #reference>
                  <el-icon
                    :style="{ color: iconColor }"
                    @mouseover="changeIconColor"
                    @mouseout="resetIconColor"
                    size="18px"
                    style="margin: 0 10px"
                  >
                    <Plus />
                  </el-icon>
                </template>
                <div style="display: flex; flex-direction: column">
                  <el-select
                    v-model="policyData._extends"
                    multiple
                    size="large"
                    placeholder="继承其他同类型政策的编号"
                    style="width: auto"
                  >
                    <el-option label="业务要素" value="业务要素" />
                    <el-option label="业务活动" value="业务活动" />
                    <el-option label="其他配置" value="其他配置" />
                  </el-select>
                </div>
              </el-popover>

              <!-- 标题相关的权限 -->
              <div class="productTitle_right" v-if="productTitleIndex === index && unfoldStatus">
                <!-- <div class="rightItem">
                  <span style="margin-right: 10px">名称：</span>
                  <el-input v-model="item._label" style="width: 100px" />
                </div> -->
                <div class="rightItem">
                  <span style="margin-right: 10px">被继承后是否允许被修改：</span>
                  <el-select v-model="item._right._editable" placeholder=" " style="width: 60px">
                    <el-option label="否" value="0" />
                    <el-option label="是" value="1" />
                  </el-select>
                </div>
                <div class="rightItem">
                  <span style="margin-right: 10px">被继承后是否允许被修改：</span>
                  <el-select v-model="item._right._disable" placeholder=" " style="width: 60px">
                    <el-option label="否" value="0" />
                    <el-option label="是" value="1" />
                  </el-select>
                </div>
              </div>
            </div>
            <!-- 添加组件的按钮 -->
            <el-icon
              @click.stop="addExtends(item)"
              :style="{ color: iconColor }"
              @mouseover="changeIconColor"
              @mouseout="resetIconColor"
              size="22px"
              style="margin-left: 20px"
            >
              <Plus />
            </el-icon>
          </div>
        </div>
        <component :is="currentComponent(item._type)" :dataDefault="item._data"></component>
      </div>
    </div>
    <!-- dialog弹出框 -->
    <el-dialog v-model="centerDialogVisible" title="业务要素" width="80%" align-center center>
      <ParameterGroup :dataDefault="paramsGroup"></ParameterGroup>
    </el-dialog>
    <!--最外层+号的 dialog弹出框 -->
    <el-dialog v-model="addDialogVisible" title="" width="60%" align-center center>
      <el-table :data="gridData" highlight-current-row @selection-change="handleSelectionChange" ref="multipleTableRef">
        <el-table-column type="selection" width="55" />
        <el-table-column property="id" label="编号" />
        <el-table-column property="name" label="名称" />
        <el-table-column property="description" label="描述" />
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addDialogVisible = false">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import productData from '../../assets/json/ruleStructure.json'
import product from './product'
import paramsGroup from '../../assets/json/paramsGroup.json'
import dataTableStructure from '../../assets/json/dataTableStructure.json'
import test from '../../assets/json/test.json'
import policy from '../../assets/json/policy.json'
import Parameter from '../../components/parameter.vue'
import ParameterGroup from '../../components/parameterGroup0328.vue'
import RuleStructure from '../../components/ruleStructure copy.vue'
import DateTable from '../../components/dataTable.vue'
import { ref, reactive, onMounted } from 'vue'
import { getList, getOne } from '../../services/index'
// const policyData = ref('Parameter')
const currentCon = ref('Parameter')
const unfoldStatus = ref(false) //title右侧的东西是否展示的一个状态
const centerDialogVisible = ref(false) //控制dialog的显示与隐藏
const addDialogVisible = ref(false) //控制+号的dialog的显示与隐藏
const productTitleIndex = ref() //记录点击的是那个title
const productDa = ref({
  ...productData,
})
const originalIconColor = ref('#000000')
const iconColor = ref(originalIconColor.value)

const multipleTableRef = ref()
const multipleSelection = ref([])
const toggleSelection = rows => {
  if (rows) {
    rows.forEach(row => {
      multipleTableRef.value!.toggleRowSelection(row, undefined)
    })
  } else {
    multipleTableRef.value!.clearSelection()
  }
}
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}

const gridData = [
  {
    id: 'a1',
    name: '业务要素',
    description: '产品业务相关要素的设置与定义',
  },
  {
    id: 'a2',
    name: '业务活动',
    description: '产品业务相关的活动的设置与定义',
  },
  {
    id: 'a3',
    name: '产品其他配置',
    description: '关于产品的其他相关的配置',
  },
]
const policyData = ref({
  ...policy,
})

// const treeData = ref([])
// interface Tree {
//   label: string
//   id: string
//   children?: Tree[]
// }
// const defaultProps = {
//   children: 'children',
//   label: 'label',
//   label: 'label',
// }
// const treeData: Tree[] = ref([])
const treeData = ref([])
onMounted(() => {
  let params = {
    message: {
      id: '',
      policyGroup: '',
      policyType: '',
      orgId: '1000',
      status: '',
    },
  }
  const config = {
    headers: {
      id: 'CustomerType',
    },
  }

  getList(params).then(response => {
    console.log('getList', response)
  })
  // getOne(config).then(response => {
  //   console.log('getOne', response)
  // })

  for (const key in policy._data) {
    if (policy._data[key]._label && policy._data[key].hasOwnProperty('_extends')) {
      treeData.value.push({
        label: policy._data[key]._label,treeData
        id: key,
        children: [],
      })
      // console.log(policy._data[key]._label,treeData.value.length);
      if (Object.keys(policy._data[key]._data).length) {
        for (const key1 in policy._data[key]._data) {
          treeData.value[treeData.value.length - 1].children.push({
            label: policy._data[key]._data[key1]._label,
            id: key1,
            children: [],
          })
          // console.log(policy._data[key]._data[key1], treeData.value)
        }
      }
    }
  }
  // console.log(treeData.value)
})

const currentComponent = (type: any) => {
  if (type === '1') {
    return ParameterGroup
  } else if (type === '2') {
    return Parameter
  } else if (type === '3') {
    return RuleStructure
  }
}
// 控制标题旁边的展开与收缩
const changeUnfoldStatus = (index: any) => {
  console.log('index', productTitleIndex.value, index)
  if (productTitleIndex.value === index) {
    unfoldStatus.value = !unfoldStatus.value
  } else {
    productTitleIndex.value = index
    unfoldStatus.value = !unfoldStatus.value
  }
}

const scrollTo = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
const handleNodeClick = (data: any) => {
  if (!data.children.length) {
    scrollTo(data.id)
  }
}
const rightItem = (item: any) => {
  console.log(item)
  centerDialogVisible.value = true
}
const addExtends = (item: any) => {
  console.log(item)
  addDialogVisible.value = true
}

const onSubmit = () => {
  // console.log('submit!')
}

const changeIconColor = () => {
  iconColor.value = '#2e46e6'
}
const resetIconColor = () => {
  iconColor.value = 'black'
}
</script>

<style scoped>
:deep(.el-dialog--center .el-dialog__body) {
  max-height: 80vh; /* 设置最大高度为视口高度的80% */
  overflow-y: auto; /* 当内容超出最大高度时，显示垂直滚动条 */
}
input:focus {
  box-shadow: 0 0 0 1px #c0c4cc !important;
  border: none !important;
  outline: none;
  border-radius: 5px;
}
.productTitle_right {
  max-width: 90%;
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
/* 设置滚动条的样式 */
/* .productTitle_right::-webkit-scrollbar {
  height: 2px;
}

.productTitle_right::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
} */
.rightItem {
  display: inline-block;
  margin-left: 10px;
}
.productTitle_left {
  display: flex;
  align-items: center;
}
.productTitle_left p {
  font-size: 22px;
  line-height: 60px;
  margin: 0 5px 0 0;
  font-weight: 600;
}
.productTitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

:deep(.el-form-item) {
  margin-bottom: 0px !important;
}
:deep(.el-tree-node__label) {
  font-size: 16px !important;
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
.productCenter {
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.product {
  width: 100%;
  /* height: 100%; */
  /* background-color: #eceff7; */
  box-sizing: border-box;
  border-left: 1px solid #eceff7;
  padding: 0px 20px 0 20px;
}
</style>
