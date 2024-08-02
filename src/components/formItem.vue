<template>
  <div class="formItemBox">
    <div>
      <p>布局配置：</p>
      <div class="main_header">
        <div class="header_item">
          <span class="item_label">视图类型：</span>
          <el-select
            v-model="formData._layout._view_type"
            placeholder=" "
            filterable
            clearable
            remote
            reserve-keyword
            style="width: 150px"
          >
            <el-option
              v-for="(key, value, index) in viewTypeList"
              :label="key"
              :value="value"
              :key="index"
            />
          </el-select>
        </div>
        <div class="header_item">
          <span class="item_label">是否只读：</span>
          <el-select
            v-model="formData._layout._readonly"
            size="large"
            placeholder=" "
            style="width: 100px"
            filterable
            clearable
            remote
            reserve-keyword
          >
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </div>
        <div class="header_item">
          <span class="item_label">栏数：</span>
          <el-input
            v-model="formData._layout._columns"
            style="width: 140px"
            clearable
          />
        </div>
        <div class="header_item">
          <span class="item_label">分组：</span>
          <el-input
            v-model="formData._layout._groups"
            style="width: 140px"
            clearable
            placeholder="多个用‘，’隔开"
          />
        </div>
      </div>
    </div>
    <div>
      <p style="display: flex">
        按钮配置：
        <el-icon size="18px" style="margin-left: 10px" @click.stop="addButton">
          <Plus />
        </el-icon>
      </p>
      <!-- <el-table :data="tableGroups" style="width: 94%; margin-bottom: 20px">
        <el-table-column prop="name" label="分组序号" align="center" />
        <el-table-column prop="label" label="名字" align="center" />
      </el-table> -->
    </div>
    <div>
      <p>接口：</p>
      <!-- <el-table :data="tableService" style="width: 94%; margin-bottom: 20px">
        <el-table-column prop="name" label="接口类型" align="center" />
        <el-table-column prop="api" label="接口名字" align="center" />
        <el-table-column prop="params" label="接口参数" align="center" />
      </el-table> -->
    </div>
    <div>
      <p>字段：</p>
      <!-- <el-table :data="tableColumns" style="width: 94%; margin-bottom: 20px">
        <el-table-column prop="name" label="字段名字" align="center" />
        <el-table-column prop="_label" label="字段描述" align="center" />
        <el-table-column prop="_tips" label="提示信息" align="center" />
        <el-table-column prop="_group" label="所属分组" align="center" />
      </el-table> -->
    </div>
    <!--添加button的dialog弹出框 -->
    <el-dialog
      v-model="addButtonVisible"
      v-if="addButtonVisible"
      title="新增按钮配置"
      width="50%"
      align-center
      center
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div style="max-height: 660px">
        <el-form :model="currentButton" label-width="auto" style="">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="按钮名称：">
                <el-input v-model="currentButton[0]" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="方法名：">
                <el-input v-model="currentButton[1]" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图标：">
                <el-input v-model="currentButton[4]" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否默认展示：">
                <el-select
                  v-model="currentButton[2]"
                  size="large"
                  placeholder=" "
                  style="width: 150px"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                >
                  <el-option label="否" value="0" />
                  <el-option label="是" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否只读时展示：">
                <el-select
                  v-model="currentButton[3]"
                  size="large"
                  placeholder=" "
                  style="width: 150px"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                >
                  <el-option label="否" value="0" />
                  <el-option label="是" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addButtonVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAdd">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from "vue";
import codeValue from "../assets/json/codeValue.json";
const props = defineProps<{ handlerData: object }>();
const formData = ref({
  _layout: {
    _view_type: "",
    _readonly: "",
  },
  _buttons: {},
}); //分组的数据
const tableGroups = ref([]); //分组的数据
const addButtonVisible = ref(false); //分组的数据
const tableService = ref([]); //服务的数据
const tableColumns = ref([]); //参数的数据
const currentButton = ref([]); //当前所选Button的数据（新增和编辑通用）
const viewTypeList = ref({
  //视图类型的码值数据
  ...codeValue.viewTypeList,
});
const componentList = ref([]); //当为component是右侧的下拉框数值
watch(
  props,
  (newValue, oldValue) => {
    console.log("newValue, oldValue", newValue, oldValue);
    if (props.handlerData?._layout?._view_type) {
      console.log("props.handlerData", props.handlerData);
      formData.value = {
        ...props.handlerData,
      };
      // for (const key in formData.value._layout?._groups) {
      //   tableGroups.value.push({
      //     name: key,
      //     // label: formData.value._layout?._groups[key]._label,
      //   })
      //   // console.log(tableGroups.value, 'tableGroups')
      // }
      // for (const key in formData.value._service) {
      //   // tableService.value.push({
      //   //   name: key,
      //   //   api: formData.value._service[key]._api,
      //   //   params: formData.value._service[key]._params,
      //   // })
      //   console.log(tableService.value, 'tableService')
      // }
      // for (const key in formData.value._columns) {
      //   // tableColumns.value.push({
      //   //   name: key,
      //   //   ...formData.value._columns[key],
      //   // })
      //   console.log(tableColumns.value, 'tableColumns')
      // }
    }
  },
  { deep: true, immediate: true }
);
console.log("props", props);
onMounted(() => {});
const confirmAdd = () => {};
const addButton = () => {
  addButtonVisible.value = true;
};
</script>

<style scoped>
.main_header {
  padding-left: 16px;
}
.header_item {
  display: inline-block;
  margin: 0 5px;
}
.formItemBox {
  width: 98%;
  height: 99%;
  box-sizing: border-box;
  padding: 10px 10px;
  border-radius: 8px;
  margin: 2px auto;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.04),
    -1px -1px 1px 1px rgba(0, 0, 0, 0.04);
}
:deep(.el-select .el-input__suffix .el-input__suffix-inner) {
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
