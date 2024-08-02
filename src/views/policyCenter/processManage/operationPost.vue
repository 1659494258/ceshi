<template>
  <div class="postBox">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="待处理" name="toDealWith">
        <el-card>
          <template #header>
            <div class="buttonList">
              <el-button @click="signOpinion">签署意见</el-button>
              <el-button @click="submitReview">提交审核</el-button>
            </div>
          </template>
          <div style="margin-top: 20px">
            <el-table
              ref="singleTableRef"
              :data="todoListData"
              highlight-current-row
              style="width: 100%"
              :append-to-body="true"
              @current-change="handleChange"
            >
              <el-table-column type="index" width="50">
                <!-- <template #header>
            <el-popover placement="right" :width="350" trigger="hover">
              <template #reference>
                <el-icon><Search /></el-icon>
              </template>
              <el-form
                :model="searchForm"
                label-width="auto"
                style="display: flex; flex-wrap: wrap; justify-content: space-between"
              >
                <el-row :gutter="20">
                  <el-col :span="24">
                    <el-form-item label="编号:" class="fromItem">
                      <el-input v-model="searchForm.id" placeholder=" " clearable style="width: 250px" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-button type="primary" @click="searchPolicy" style="float: right">搜索</el-button>
            </el-popover>
          </template> -->
              </el-table-column>
              <el-table-column prop="flowInstanceId" label="流程实例编号" />
              <el-table-column prop="productName" label="产品名称" />
              <el-table-column prop="policyName" label="产品政策名称" />
              <el-table-column label="流程阶段" width="100">
                <template #default="scope">
                  {{ flowPhaseList[scope.row.flowPhase] }}
                </template>
              </el-table-column>
              <el-table-column prop="createUserId" label="创建人员" width="150" />
              <el-table-column prop="createTime" label="创建时间" width="160" />
              <el-table-column prop="remark" label="流程说明" width="150" />
            </el-table>
          </div>
          <!-- 分页 -->
          <div class="demo-pagination-block">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 30, 40]"
              :small="true"
              layout=" prev, pager, next, jumper,total, sizes"
              :total="totalNum"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            />
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="已处理" name="handled">
        <el-card>
          <template #header>
            <div class="buttonList">
              <el-button @click="viewOpinion">查看意见</el-button>
            </div>
          </template>
          <div style="margin-top: 20px">
            <el-table
              ref="singleTableRef"
              :data="doneListData"
              highlight-current-row
              style="width: 100%"
              :append-to-body="true"
              @current-change="handleChange"
            >
              <el-table-column type="index" width="50">
                <!-- <template #header>
            <el-popover placement="right" :width="350" trigger="hover">
              <template #reference>
                <el-icon><Search /></el-icon>
              </template>
              <el-form
                :model="searchForm"
                label-width="auto"
                style="display: flex; flex-wrap: wrap; justify-content: space-between"
              >
                <el-row :gutter="20">
                  <el-col :span="24">
                    <el-form-item label="编号:" class="fromItem">
                      <el-input v-model="searchForm.id" placeholder=" " clearable style="width: 250px" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-button type="primary" @click="searchPolicy" style="float: right">搜索</el-button>
            </el-popover>
          </template> -->
              </el-table-column>
              <el-table-column prop="flowInstanceId" label="流程实例编号" />
              <el-table-column prop="productName" label="产品名称" />
              <el-table-column prop="policyName" label="产品政策名称" />
              <el-table-column label="流程阶段" width="100">
                <template #default="scope">
                  {{ flowPhaseList[scope.row.flowPhase] }}
                </template>
              </el-table-column>
              <el-table-column prop="createUserId" label="创建人员" width="150" />
              <el-table-column prop="createTime" label="创建时间" width="160" />
              <el-table-column prop="remark" label="流程说明" width="150" />
            </el-table>
          </div>
          <!-- 分页 -->
          <div class="demo-pagination-block">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 30, 40]"
              :small="true"
              layout=" prev, pager, next, jumper,total, sizes"
              :total="doneTotalNum"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            />
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 导入数据的dialog弹出框 -->
    <el-dialog
      v-model="addTodoVisible"
      v-if="addTodoVisible"
      title=""
      :width="dialogWidth"
      align-center
      center
      :close-on-click-modal="false"
    >
      <div style="width: 100%">
        <!-- <AddFlow @submitTodo="submitTodo"></AddFlow> -->
        <component
          :is="currentComponent(componentType)"
          :dataDefault="currentTodo"
          @submitTodo="submitTodo"
          :history="true"
          :signType="signType"
        ></component>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import type { TabsPaneContext, ElNotification } from 'element-plus'
import {
  flowTodoList,
  productFlowCancel,
  flowDoneList,
  productFlowSubmit,
  productFlowItemInfo,
} from '../../../services/index'
import AddFlow from '../../../components/addFlow.vue'
import Signopinion from '../../../components/signopinion.vue'
const activeName = ref('toDealWith')
const pageSize = ref(10)
const currentPage = ref(1)
const signType = ref(false) //签署意见的状态
const totalNum = ref(null)
const doneTotalNum = ref(null)
const componentType = ref('') //区分组件类型
const productId = ref('')
const productName = ref('')
const policyId = ref('')
const policyName = ref('')
const dialogWidth = ref('80%')
const todoListData = ref([]) //待办列表数据
const doneListData = ref([]) //已处理列表数据
const currentTodo = ref({}) //所选的todo
const addTodoVisible = ref(false) //新增申请的dialog
const currentFlow = ref({}) //新增申请的dialog
const flowPhase = '4'
const flowPhaseList = {
  '2': '产品岗',
  '3': '风险岗',
  '4': '运营岗',
  '5': '财务岗',
  '6': '系统岗',
}
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab.props.label, event)
}
const begin = computed(() => {
  return currentPage.value === 1 ? 1 : currentPage.value * pageSize.value + 1
})
const handleSizeChange = (val: number) => {
  currentPage.value = val
  console.log(`${val} items per page`)
}
const handlePageChange = (val: number) => {
  console.log(`current page: ${val}`)
}

onMounted(() => {
  getTodoList()
  getDoneList()
})
const getTodoList = () => {
  flowTodoList(
    begin.value,
    pageSize.value,
    // productId.value,
    // productName.value,
    // policyId.value,
    // policyName.value,
    flowPhase
  ).then(res => {
    todoListData.value = res.data.message.list
    totalNum.value = res.data.message.total
    console.log('flowTodoList', todoListData.value, totalNum.value)
  })
}
const getDoneList = () => {
  flowDoneList(
    begin.value,
    pageSize.value,
    // productId.value,
    // productName.value,
    // policyId.value,
    // policyName.value,
    flowPhase
  ).then(res => {
    doneListData.value = res.data.message.list
    doneTotalNum.value = res.data.message.total
    console.log('flowDoneList', doneListData.value, doneTotalNum.value)
  })
}

//
const currentComponent = (type: string) => {
  if (type === 'add') {
    return AddFlow
  }
  if (type === 'opinion') {
    return Signopinion
  }
}
// 点击签署意见
const signOpinion = () => {
  if (currentTodo.value.policyId) {
    addTodoVisible.value = true
    signType.value = true
    dialogWidth.value = '50%'
    componentType.value = 'opinion'
  } else {
    ElNotification({
      title: '提示',
      message: '请选择一条记录',
      type: 'warning',
    })
  }
}
// 点击查看意见
const viewOpinion = () => {
  if (currentTodo.value.policyId) {
    signType.value = false
    addTodoVisible.value = true
    dialogWidth.value = '50%'
    componentType.value = 'opinion'
  } else {
    ElNotification({
      title: '提示',
      message: '请选择一条记录',
      type: 'warning',
    })
  }
}
//
const submitReview = () => {
  // 点击提交审核
  if (currentTodo.value.flowInstanceId) {
    productFlowItemInfo(currentTodo.value.flowItemId).then(res => {
      if (res.data.message.opinion) {
        console.log('productFlowItemInfo', res)
        productFlowSubmit(
          currentTodo.value.flowItemId,
          currentTodo.value.flowInstanceId,
          currentTodo.value.flowPhase
        ).then(res => {
          getTodoList()
          getDoneList()
          console.log('productFlowSubmit', res)
          ElNotification({
            title: '成功',
            message: '提交成功',
            type: 'success',
          })
        })
      } else {
        ElNotification({
          title: '提示',
          message: '请先签署意见，再进行提交审核',
          type: 'warning',
        })
      }
    })
  } else {
    ElNotification({
      title: '提示',
      message: '请选择一条记录',
      type: 'warning',
    })
  }
}

//
const submitTodo = (type: string) => {
  if (!type) {
    getTodoList()
  }
  addTodoVisible.value = false
  dialogWidth.value = '80%'
  // currentTodo.value = {}
}
const handleChange = (val: any | undefined) => {
  console.log('handleChange', val)
  currentTodo.value = val
}
</script>

<style scoped>
:deep(.el-dialog--center .el-dialog__body) {
  max-height: 80vh; /* 设置最大高度为视口高度的80% */
  overflow-y: auto; /* 当内容超出最大高度时，显示垂直滚动条 */
}
.buttonList {
  margin: 10px 0;
}
.demo-pagination-block {
  display: flex;
  flex-direction: row-reverse;
  padding-top: 10px;
  width: 100%;
}
.postBox {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: scroll;
}
</style>
