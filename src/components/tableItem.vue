<template>
  <div style="">
    <el-table
      :data="tableData"
      style="width: 94%; margin-bottom: 20px"
      row-key="id"
    >
      <!-- <el-table :data="tableData" style="width: 94%; margin-bottom: 20px" row-key="id" highlight-current-row="true"> -->
      <el-table-column prop="id" label="编号" align="center" />
      <el-table-column prop="name" label="名字" align="center" />
      <el-table-column prop="status" label="状态" align="center" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";

const props = defineProps<{ handlerData: object }>();
const tableData = ref([]);
const conponentData = ref({}); //dialog中组件的初始数据
const thenOptionList = ref([]); //当为component是右侧的下拉框数值
const componentList = ref([]); //当为component是右侧的下拉框数值
console.log("props", props.handlerData._items);
onMounted(() => {
  // 筛选出表格想要的数据
  for (const key in props.handlerData?._items) {
    tableData.value.push({
      id: key,
      name: props.handlerData?._items[key]._label,
      status: props.handlerData?._items[key]._status,
      extends: props.handlerData?._items[key]._extends,
      data: props.handlerData?._items[key]._data,
      right: props.handlerData?._items[key]._right,
    });
    console.log(tableData.value, "tableData");
  }
});
</script>

<style scoped>
:dee(.el-select .el-input__suffix .el-input__suffix-inner) {
  display: none !important;
}
:deep(.selectType .el-icon-arrow-up:before) {
  content: "";
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
</style>
