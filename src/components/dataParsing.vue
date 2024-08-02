<template>
  <!-- 导入数据的解析 -->
  <div>
    <el-table
      :data="tableData"
      ref="multipleTableRef"
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="policyId" label="编号" />
      <el-table-column prop="policyName" label="名称" />
      <el-table-column prop="remark" label="描述" />

      <el-table-column label="类型" width="120">
        <template #default="scope">
          {{ codeValue.PolicyType[scope.row.policyType] }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template #default="scope">
          {{ codeValue.PolicyStatus[scope.row.status] }}
        </template>
      </el-table-column>
      <!-- <el-table-column property="remarks" label="备注" /> -->
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, defineExpose, watch } from 'vue'
import { codeById, addOne, removeOne } from '../services/index'
import { ElTable } from 'element-plus'
import codeValue from '../assets/json/codeValue.json'
const props = defineProps(['dataDefault'])
const emit = defineEmits(['getParams'])
const tableData = ref([]) //表格的数据
const editingRow = ref(null)
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref([])
const handleSelectionChange = (val: any) => {
  console.log('val', val)
  multipleSelection.value = val
}
// 返回数据
const pushParams = () => {
  emit('getParams', {
    ...paramsData,
  })
}
defineExpose({
  pushParams,
})
tableData.value = props.dataDefault
onMounted(() => {
  console.log('props', props.dataDefault)
})
</script>

<style scoped>
:deep(.el-dialog--center .el-dialog__body) {
  max-height: 80vh; /* 设置最大高度为视口高度的80% */
  overflow-y: auto; /* 当内容超出最大高度时，显示垂直滚动条 */
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
</style>
