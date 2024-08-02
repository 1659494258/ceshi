<template>
  <!-- 流程的新增 -->
  <div>
    <el-card>
      <template #header>选择产品：</template>
      <el-table
        :data="tableData"
        ref="singleTableRef"
        highlight-current-row
        style="width: 100%"
        @current-change="handleSelectionChange"
      >
        <el-table-column type="index" label="序号" width="55" />
        <el-table-column prop="id" label="产品编号" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="createUserId" label="创建人" width="150" />
        <el-table-column prop="remark" label="描述" width="150" />
      </el-table>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :small="true"
        layout="prev, pager, next, jumper,total, sizes"
        :total="totalNum"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        style="float: right; margin: 5px 0"
      />
    </el-card>
    <el-card style="margin-top: 10px">
      <template #header>选择产品政策：</template>
      <el-table
        :data="policyRelativeList"
        ref="singleTableRef0"
        highlight-current-row
        style="width: 100%"
        @current-change="handlePolicyChange"
      >
        <el-table-column prop="policyId" label="政策编号" />
        <el-table-column prop="policyName" label="政策名字" width="200" />

        <el-table-column label="有效期" width="200">
          <template #default="scope">
            <span>{{ scope.row.validityPeriod[0] }}-{{ scope.row.validityPeriod[1] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="描述" width="200" />

        <el-table-column label="状态" width="60">
          <template #default="scope">
            <span v-if="scope.row.status === '1'">有效</span>
            <span v-if="scope.row.status === '2'">无效</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="currentPagePolicy"
        v-model:page-size="pageSizePolicy"
        :small="true"
        layout="prev, pager, next, jumper,total, sizes"
        :total="totalNumPolicy"
        @size-change="handleSizeChangePolicy"
        @current-change="handlePageChangePolicy"
        style="float: right; margin: 5px 0"
      />
      <div style="margin-top: 5px">
        <span>备注：</span>
        <el-input v-model="remark" placeholder=" " clearable style="width: 250px" />
      </div>
    </el-card>
    <div class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { productInfoPage, policeRelative, productFlowAdd } from '../services/index'
import { ElTable, ElNotification, ElMessage } from 'element-plus'
import codeValue from '../assets/json/codeValue.json'
const props = defineProps(['dataDefault'])
const emit = defineEmits(['submitTodo'])
const tableData = ref([]) //产品的数据
const policyRelativeList = ref([]) //产品对应政策的数据
const editingRow = ref(null)
const singleTableRef = ref<InstanceType<typeof ElTable>>()
const currentProduct = ref({}) //选择的产品
const currentPolicy = ref({}) //产品对应的政策
const remark = ref('') //说明
const pageSize = ref(10)
const currentPage = ref(1)
const pageSizePolicy = ref(10)
const currentPagePolicy = ref(1)
const totalNumPolicy = ref(0)
const totalNum = ref(0)
const handleSelectionChange = (val: any) => {
  console.log('val', val)
  currentProduct.value = val
  getPoliceRelative(val.id)
}
const handlePolicyChange = (val: any) => {
  console.log('val', val)
  currentPolicy.value = val
}

onMounted(() => {
  console.log('props', props.dataDefault)
  getProductPage()
})
const getProductPage = () => {
  productInfoPage(1, 10).then(res => {
    console.log('productInfoPage', res.data.message)
    tableData.value = res.data.message.list
    totalNum.value = res.data.message.total
  })
}
// 分页形式获取对应产品下的政策
const getPoliceRelative = async (id: string) => {
  let messge = {
    begin: 1,
    pageSize: 10,
    orderBy: [],
    objectType: '1',
    objectNo: id,
    relativeType: '1',
  }
  await policeRelative(messge).then(response => {
    console.log('policeRelative', response)
    policyRelativeList.value = response.data.message.list
    totalNumPolicy.value = response.data.message.total
  })
}
const submit = () => {
  if (currentProduct.value.id) {
  } else {
    ElNotification({
      title: '提示',
      message: '请选择产品',
      type: 'warning',
    })
    return
  }
  if (currentPolicy.value.policyId) {
  } else {
    ElNotification({
      title: '提示',
      message: '请选择产品对应的政策',
      type: 'warning',
    })
    return
  }
  productFlowAdd(currentProduct.value.id, currentPolicy.value.policyId, remark.value).then(res => {
    console.log('productFlowAdd', res.data)
    emit('submitTodo', '')
  })
}
const cancel = () => {
  emit('submitTodo', 'cancel')
}
const handleSizeChangePolicy = (val: number) => {
  currentPage.value = val
  console.log(`${val} items per page`)
}
const handlePageChangePolicy = (val: number) => {
  console.log(`current page: ${val}`)
}
const handleSizeChange = (val: number) => {
  currentPage.value = val
  console.log(`${val} items per page`)
}
const handlePageChange = (val: number) => {
  console.log(`current page: ${val}`)
}
</script>

<style scoped>
:deep(.el-dialog--center .el-dialog__body) {
  max-height: 80vh; /* 设置最大高度为视口高度的80% */
  overflow-y: auto; /* 当内容超出最大高度时，显示垂直滚动条 */
}
.demo-pagination-block {
  display: flex;
  flex-direction: row-reverse;
  padding-top: 10px;
  width: 100%;
}
.collapseItem {
  /* display: flex; */
  border-radius: 8px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.04), -1px -1px 1px 1px rgba(0, 0, 0, 0.04);
  margin: 10px 0;
}
:deep(.custom-disabled-input .el-input__inner) {
  text-align: center;
  background-color: #ffffff;
  box-shadow: none;
  border: none !important;
  opacity: 0.8;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #ffffff;
  box-shadow: 0 0 0 0px var(--el-disabled-border-color) inset;
}
.dialog-footer {
  display: flex;
  justify-content: space-around;
  width: 30%;
  margin: 0px auto;
  margin-top: 20px;
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
