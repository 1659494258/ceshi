<template>
  <!-- 视图 -->
  <div class="processorBox">
    <div class="centerContent">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item class="borderItem" title="基本信息：" name="1">
          <div class="main_header">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="header_item">
                  <span class="item_label">名字：</span>
                  <el-input v-model="currentTableItem._label" style="width: 140px" clearable />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="header_item" v-if="currentTableItem._right">
                  <span class="item_label">被继承后是否允许被修改：</span>
                  <el-select
                    v-model="currentTableItem._right._editable"
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
              </el-col>
              <el-col :span="8">
                <div class="header_item" v-if="currentTableItem._right">
                  <span class="item_label">被继承后是否允许被停用：</span>
                  <el-select
                    v-model="currentTableItem._right._disable"
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
              </el-col>
              <!-- <el-col :span="8">
                <div class="header_item">
                  <span class="item_label">继承自：</span>
                  <el-select
                    v-model="currentTableItem._extends"
                    size="large"
                    placeholder="继承同类型政策"
                    style="width: 150px"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                  >
                    <el-option v-for="(ite, ind) in extendsTableData" :label="ite.name" :value="ite.id" :key="ind" />
                  </el-select>
                </div>
              </el-col> -->
              <el-col :span="8">
                <div class="header_item">
                  <span class="item_label">视图类型：</span>
                  <el-select
                    v-model="currentTableItem._view_type"
                    size="large"
                    placeholder="请选择"
                    style="width: 150px"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                  >
                    <el-option
                      v-for="(key, value, index) in codeValue.viewTypeList"
                      :label="key"
                      :value="value"
                      :key="index"
                    />
                  </el-select>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="header_item">
                  <span class="item_label">组件名称：</span>
                  <el-input v-model="currentTableItem._component" style="width: 140px" clearable />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="header_item">
                  <span class="item_label">是否只读：</span>
                  <el-select
                    v-model="currentTableItem._readonly"
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
              </el-col>
              <el-col :span="8" v-if="currentTableItem._view_type === '1'">
                <div class="header_item">
                  <span class="item_label">栏数：</span>
                  <el-input v-model="currentTableItem._column" style="width: 140px" clearable />
                </div>
              </el-col>
              <el-col :span="8" v-if="currentTableItem._view_type === '1'">
                <div class="header_item">
                  <span class="item_label">分组：</span>
                  <el-input
                    v-model="currentTableItem._group"
                    style="width: 140px"
                    clearable
                    placeholder="多个用‘，’隔开"
                  />
                </div>
              </el-col>
              <el-col :span="8" v-if="currentTableItem._view_type === '2'">
                <div class="header_item">
                  <span class="item_label">默认每页大小：</span>
                  <el-input v-model="currentTableItem._pageSize" style="width: 140px" clearable />
                </div>
              </el-col>
              <el-col :span="8" v-if="currentTableItem._view_type === '2'">
                <div class="header_item">
                  <span class="item_label">可选每页大小：</span>
                  <el-input
                    v-model="currentTableItem._pageSizeOpt"
                    style="width: 140px"
                    clearable
                    placeholder="多个用‘，’隔开"
                  />
                </div>
              </el-col>
              <el-col :span="8" v-if="currentTableItem._view_type === '2'">
                <div class="header_item">
                  <span class="item_label">是否展示查询字段：</span>
                  <el-select
                    v-model="currentTableItem._search"
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
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <el-collapse-item
          class="borderItem"
          name="2"
          v-if="currentTableItem._view_type != '3' && currentTableItem._view_type != '4'"
        >
          <template #title>
            参数集合：
            <el-icon size="18px" class="iconType" @click.stop="addParams">
              <Plus />
            </el-icon>
          </template>
          <div>
            <el-table
              v-if="paramsTabData.length"
              :data="paramsTabData"
              style="width: 94%"
              row-key="id"
              highlight-current-row="true"
            >
              <el-table-column prop="_id" label="参数编号" align="center" />
              <el-table-column prop="_label" label="参数名" align="center" />
              <el-table-column label="" width="120">
                <template #default="scope">
                  <el-button
                    link
                    type="primary"
                    size="small"
                    @click.prevent="deleteRow(scope.$index, scope.row, '_params')"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item name="3" class="borderItem">
          <template #title>
            按钮配置：
            <el-icon size="18px" class="iconType" @click.stop="addButton('button')">
              <Plus />
            </el-icon>
          </template>
          <el-table v-if="currentTableItem._buttons.length" :data="currentTableItem._buttons" style="width: 98%">
            <el-table-column prop="_label" label="名字" align="center" />
            <el-table-column prop="_method" label="方法名" align="center" />
            <el-table-column prop="_icon" label="图标" align="center" />
            <el-table-column prop="_showOnInit" label="默认展示" align="center">
              <template #default="scope">
                <span v-if="scope.row._showOnInit === '0'">否</span>
                <span v-else>是</span>
              </template>
            </el-table-column>
            <el-table-column prop="_showOnReadonly" label="只读时展示" align="center">
              <template #default="scope">
                <span v-if="scope.row._showOnReadonly === '0'">否</span>
                <span v-else>是</span>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click.prevent="deleteRow(scope.$index, scope.row, '_buttons')"
                >
                  删除
                </el-button>
                <el-button link type="primary" size="small" @click.prevent="editRow(scope.$index, scope.row, 'button')">
                  编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item
          name="4"
          class="borderItem"
          v-if="currentTableItem._view_type === '1' || currentTableItem._view_type === '2'"
        >
          <template #title>
            接口配置：
            <el-icon size="18px" class="iconType" @click.stop="addButton('service')">
              <Plus />
            </el-icon>
          </template>
          <el-table v-if="currentTableItem._apis.length" :data="currentTableItem._apis" style="width: 98%">
            <el-table-column prop="_id" label="接口编号" align="center" />
            <el-table-column prop="_label" label="接口名字" align="center" />
            <el-table-column prop="_url" label="接口地址" align="center" />
            <el-table-column align="center">
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click.prevent="deleteRow(scope.$index, scope.row, '_apis')"
                >
                  删除
                </el-button>
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click.prevent="editRow(scope.$index, scope.row, 'service')"
                >
                  编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item
          name="5"
          class="borderItem"
          v-if="currentTableItem._view_type === '1' || currentTableItem._view_type === '2'"
        >
          <template #title>
            字段配置：
            <el-icon size="18px" class="iconType" @click.stop="addButton('field')">
              <Plus />
            </el-icon>
          </template>
          <el-table v-if="currentTableItem?._fields.length" :data="currentTableItem?._fields" style="width: 98%">
            <el-table-column prop="_id" label="参数编号" align="center" />
            <el-table-column prop="_label" label="显示名称" align="center" />
            <el-table-column prop="_visible" label="是否显示" align="center">
              <template #default="scope">
                <span v-if="scope.row._visible === '0'">否</span>
                <span v-else>是</span>
              </template>
            </el-table-column>
            <el-table-column prop="_editable" label="是否可编辑" align="center">
              <template #default="scope">
                <span v-if="scope.row._editable === '0'">否</span>
                <span v-else>是</span>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click.prevent="deleteRow(scope.$index, scope.row, '_fields')"
                >
                  删除
                </el-button>
                <el-button link type="primary" size="small" @click.prevent="editRow(scope.$index, scope.row, 'field')">
                  编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item name="6" class="borderItem" v-if="currentTableItem._view_type === '2'">
          <template #title>
            查询字段配置：
            <el-icon size="18px" class="iconType" @click.stop="addButton('filter')">
              <Plus />
            </el-icon>
          </template>
          <el-table v-if="currentTableItem._filter.length" :data="currentTableItem._filter" style="width: 98%">
            <el-table-column prop="_id" label="字段名" align="center" />
            <el-table-column prop="_method" label="查询条件" align="center"></el-table-column>
            <el-table-column align="center">
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click.prevent="deleteRow(scope.$index, scope.row, '_filter')"
                >
                  删除
                </el-button>
                <el-button link type="primary" size="small" @click.prevent="editRow(scope.$index, scope.row, 'filter')">
                  编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item name="7" class="borderItem" v-if="currentTableItem._view_type === '3'">
          <template #title>
            step页配置：
            <el-icon size="18px" class="iconType" @click.stop="addButton('step')">
              <Plus />
            </el-icon>
          </template>
          <el-table v-if="currentTableItem._steps.length" :data="currentTableItem._steps" style="width: 98%">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="_id" label="编号" align="center" />
            <el-table-column prop="_label" label="名字" align="center" />
            <el-table-column align="center">
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click.prevent="deleteRow(scope.$index, scope.row, '_steps')"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item name="8" class="borderItem" v-if="currentTableItem._view_type === '4'">
          <template #title>
            tab页配置：
            <el-icon size="18px" class="iconType" @click.stop="addButton('tab')">
              <Plus />
            </el-icon>
          </template>
          <el-table v-if="currentTableItem._tabs.length" :data="currentTableItem._tabs" style="width: 98%">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="_id" label="编号" align="center" />
            <el-table-column prop="_label" label="名字" align="center" />
            <el-table-column align="center">
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click.prevent="deleteRow(scope.$index, scope.row, '_tabs')"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!--添加参数的dialog弹出框 -->
    <el-dialog
      v-model="addParamsVisible"
      v-if="addParamsVisible"
      title=""
      width="60%"
      align-center
      center
      :append-to-body="true"
    >
      <div style="max-height: 660px; overflow-y: scroll">
        <el-table
          ref="multipleTableRef"
          :data="tableList"
          highlight-current-row
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column property="policyId" label="编号" />
          <el-table-column property="policyName" label="名称" />
        </el-table>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addParamsVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAdd">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!--添加button的dialog弹出框 -->
    <el-dialog
      v-model="addButtonVisible"
      v-if="addButtonVisible"
      title=""
      width="50%"
      align-center
      center
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div style="max-height: 660px">
        <!-- 按钮 -->
        <el-form
          v-if="addType === 'button' || editType === 'button'"
          :model="currentButton"
          label-width="auto"
          style=""
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="按钮名称：">
                <el-input v-model="currentButton._label" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="方法名：">
                <el-input v-model="currentButton._method" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图标：">
                <el-input v-model="currentButton._icon" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否默认展示：">
                <el-select
                  v-model="currentButton._show"
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
                  v-model="currentButton._always"
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
        <!-- 接口 -->
        <el-form
          v-if="addType === 'service' || editType === 'service'"
          :model="currentService"
          label-width="auto"
          style=""
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="接口编号：">
                <!-- <el-input v-model="currentService._id" style="width: 150px" /> -->
                <span>{{ currentService._id }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="接口名称：">
                <!-- <el-input v-model="currentService._label" style="width: 150px" /> -->
                <span>{{ currentService._label }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="接口地址：">
                <!-- <el-input v-model="currentService._url" style="width: 150px" /> -->
                <span>{{ currentService._url }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请求报文：">
                <!-- <el-input v-model="currentService._request" style="width: 150px" /> -->
                <span>{{ currentService._request }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="响应报文：">
                <!-- <el-input disabled v-model="currentService._response" style="width: 150px" /> -->
                <span>{{ currentService._response }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 字段 -->
        <el-form v-if="addType === 'field' || editType === 'field'" :model="currentField" label-width="auto">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="参数编号：">
                <el-input v-model="currentField._id" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="显示名称：">
                <el-input v-model="currentField._label" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否显示：">
                <el-select
                  v-model="currentField._visible"
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
              <el-form-item label="是否可编辑：">
                <el-select
                  v-model="currentField._editable"
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
              <el-form-item label="提示信息：">
                <el-input v-model="currentField._tips" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属分组：">
                <el-input v-model="currentField._group" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位：">
                <el-input v-model="currentField._unit" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下拉枚举：">
                <el-input v-model="currentField._options" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否必填：">
                <el-select
                  v-model="currentField._required"
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
              <el-form-item label="长度：">
                <el-input v-model="currentField._length" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="其他校验器：">
                <el-input v-model="currentField._validator" style="width: 150px" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 查询条件 -->
        <el-form
          v-if="addType === 'filter' || editType === 'filter'"
          :model="currentFilter"
          label-width="auto"
          style=""
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="字段名称：">
                <el-input v-model="currentFilter._id" style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="参数类型:" class="fromItem">
                <el-select
                  v-model="currentFilter._method"
                  placeholder=" "
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  style="width: 150px"
                >
                  <el-option
                    v-for="(key, value, index) in codeValue.filterType"
                    :label="key"
                    :value="key"
                    :key="index"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- step -->
        <div
          style="max-height: 660px; overflow-y: scroll"
          v-if="addType === 'step' || editType === 'step' || addType === 'tab' || editType === 'tab'"
        >
          <el-table
            ref="multipleTableRef"
            :data="extendsTableData"
            highlight-current-row
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column property="policyId" label="编号" />
            <el-table-column property="policyName" label="名称" />
          </el-table>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelAdd">取消</el-button>
          <el-button type="primary" @click="confirmButton">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { get } from 'http'
import { ref, reactive, onMounted, computed, defineExpose, watch } from 'vue'
import { getList } from '../services/index'
import { ElTable } from 'element-plus'
import codeValue from '../assets/json/codeValue.json'
const emit = defineEmits(['getParams'])
import FromItem from './formItem.vue'
import TableItem from './tableItem.vue'
import HandlerLogic from './handlerLogic.vue'
const props = defineProps(['dataDefault', 'formData'])
const data = ref({
  ...props.dataDefault,
})

const centerDialogVisible = ref(false) //控制处理的器的弹出框
const addParamsVisible = ref(false) //控制器里面控制添加参数的dialog
const currentTableItem = ref({
  _extends: [],
  _view_type: '',
  _readonly: '',
  _label: '',
  _type: '',
  _component: '',
  _params: {},
  _buttons: [],
  _right: {
    _editable: '',
    _disable: '',
  },
})
const tableData = ref([])
const tableList = ref([]) //参数的集合
const extendsTableData = ref([]) //继承的数据
const childHanler = ref(null)
const addButtonVisible = ref(false) //分组的数据
const addType = ref('') //点击+，赋值相应的类型
const editType = ref('') //点击编辑，赋值相应的类型
const editIndex = ref(0) //点击编辑，赋值相应的类型
const deleteType = ref('') //点击删除，赋值相应的类型
const deleteIndex = ref(0) //点击删除
const tableService = ref([]) //服务的数据
const tableColumns = ref([]) //参数的数据
const currentButton = ref({}) //当前所选Button的数据（新增和编辑通用）
const currentService = ref({}) //当前所选Service的数据（新增和编辑通用）
const currentField = ref({}) //当前所选Field的数据（新增和编辑通用）
const currentFilter = ref({}) //当前所选Filter的数据（新增和编辑通用）
// const paramsTabData = ref([]) //dialog弹框里参数的数据
const activeNames = ref(['1', '2', '3', '4', '5', '6', '7', '8'])
const user = ref(JSON.parse(window.localStorage.getItem('user')))
const handleChange = (val: string[]) => {
  console.log(val)
}
// 筛选出参数表格需要的数据
const paramsTabData = computed(() => {
  let list = []
  if (currentTableItem.value && currentTableItem.value._params && Object.keys(currentTableItem.value._params).length) {
    list = currentTableItem.value._params
  }
  return list
})

const handlerData = computed(() => {
  return currentTableItem.value._handler
})
watch(
  currentTableItem,
  (newValue, oldValue) => {
    if (!newValue._apis) {
      newValue._apis = []
    }
    if (!newValue._fields) {
      newValue._fields = []
    }
    if (!newValue._filter) {
      newValue._filter = []
    }
    if (!newValue._steps) {
      newValue._steps = []
    }
    if (newValue._view_type === '1') {
      console.log('_view_type', newValue._view_type)
    }
    console.log('newValuetype, oldValuetype', newValue, oldValue)
  },
  { deep: true, immediate: true }
)
// 返回数据
const pushParams = () => {
  childHanler.value?.pushParams()
  console.log('currentTableItem', currentTableItem.value)
  emit('getParams', {
    ...currentTableItem.value,
  })
}
defineExpose({
  pushParams,
})
onMounted(() => {
  getFormList()
  getParamsList()
  currentTableItem.value._label = props.formData.name
  currentTableItem.value._type = props.formData.policyType
  if (props.formData?.info?._type) {
    currentTableItem.value = { ...props.formData.info }
  }
  if (props.formData?._type) {
    currentTableItem.value = { ...props.formData }
  }
  console.log('视图', props, currentTableItem.value)
})
const addButton = (type: string) => {
  addType.value = type
  if (type === 'button') {
    currentButton.value = {
      _label: '',
      _method: '',
      _icon: '',
      _show: '',
      _always: '',
    }
  }
  if (type === 'service') {
    currentService.value = {
      _id: '',
      _api: '',
      _params: '',
    }
  }
  if (type === 'field') {
    currentField.value = {
      _id: '',
      _label: '',
      _visible: '',
      _editable: '',
      _tips: '',
      _group: '',
      _unit: '',
      _options: '',
      _required: '',
      _length: '',
      _validator: '',
    }
  }
  if (type === 'filter') {
    currentFilter.value = {
      _id: '',
      _filter_type: '',
    }
  }
  addButtonVisible.value = true
}

// 获取可以继承的数据
const getFormList = async () => {
  let params = {
    message: {
      policyId: '',
      policyGroup: '',
      policyType: '8',
      orgId: user.orgId,
      status: '',
    },
  }
  await getList(params).then(response => {
    extendsTableData.value = response.data.message.list
  })
}

// 获取参数表格数据
const getParamsList = async () => {
  let params = {
    message: {
      policyId: '',
      policyGroup: '',
      policyType: '1',
      orgId: user.orgId,
      status: '',
    },
  }
  await getList(params).then(response => {
    tableList.value = response.data.message.list
  })
}
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}
// 点击编辑，根据type进行区分
const editRow = (index: number, row: object, type: string) => {
  editType.value = type
  editIndex.value = index
  if (type === 'button') {
    currentButton.value = {
      ...row,
    }
  }
  if (type === 'service') {
    currentService.value = {
      ...row,
    }
  }
  if (type === 'field') {
    currentField.value = {
      ...row,
    }
  }
  if (type === 'filter') {
    currentFilter.value = {
      ...row,
    }
  }
  addButtonVisible.value = true
  console.log(index, row, type, 'row')
}
// 点击确定添加的按钮
const confirmButton = () => {
  console.log('currentTableItem', currentTableItem.value)
  if (addType.value === 'button') {
    currentTableItem.value._buttons.push(currentButton.value)
  }
  if (editType.value === 'button') {
    currentTableItem.value._buttons[editIndex.value] = {
      ...currentButton.value,
    }
  }
  if (addType.value === 'service') {
    currentTableItem.value._apis.push(currentService.value)
  }
  if (editType.value === 'service') {
    currentTableItem.value._apis[editIndex.value] = { ...currentService.value }
  }
  if (addType.value === 'field') {
    currentTableItem.value._fields.push(currentField.value)
  }
  if (editType.value === 'field') {
    currentTableItem.value._fields[editIndex.value] = { ...currentField.value }
  }
  if (addType.value === 'filter') {
    currentTableItem.value._filter.push(currentFilter.value)
  }
  if (editType.value === 'filter') {
    currentTableItem.value._filter[editIndex.value] = {
      ...currentFilter.value,
    }
  }
  if (addType.value === 'step') {
    multipleSelection.value.forEach(item => {
      let params = { ...item.info }
      params._id = item.policyId
      currentTableItem.value._steps.push(params)
    })
  }
  if (addType.value === 'tab') {
    multipleSelection.value.forEach(item => {
      let params = { ...item.info }
      params._id = item.policyId
      currentTableItem.value._tabs.push(params)
    })
  }
  // console.log('step', currentTableItem.value._steps)
  addButtonVisible.value = false
  addType.value = ''
  editType.value = ''
}
// 点击确定，锁定添加的参数
const confirmAdd = () => {
  let params = {}
  multipleSelection.value.forEach(item => {
    let params = { ...item.info }
    params._id = item.policyId
    currentTableItem.value._params.push(params)
  })
  addParamsVisible.value = false
  console.log('multipleSelection.value', multipleSelection.value, currentTableItem.value)
}
// 点击取消的按钮
const cancelAdd = () => {
  addButtonVisible.value = false
  addType.value = ''
  editType.value = ''
}
// 删除某一个参数
const deleteRow = (index: number, row: object, key: string) => {
  currentTableItem.value[key].splice(index, 1)
  // console.log('deleteRow', index, row, key, currentTableItem.value[key])
}
const addParams = () => {
  addParamsVisible.value = true
}
// 获取自组件的数据
const getParams = (params: object) => {
  console.log('params-processor', params)
  currentTableItem.value._handler = { ...params }
}
</script>

<style scoped>
.iconType {
  margin-left: 10px;
  color: #409eff;
}
.processorBox {
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 8px;
  /* border: 1px solid #e4e7ed; */
  box-sizing: border-box;
}
:deep(.el-collapse) {
  border-top: 0px !important;
  border-bottom: 0px !important;
}
/* 滚动条整体样式 */
::-webkit-scrollbar {
  width: 2px; /* 滚动条的宽度 */
}
.centerContent {
  max-height: 70vh;
  overflow-y: scroll;
  width: 100%;
  box-sizing: border-box;
  /* padding: 5px; */
}

.borderItem {
  border-radius: 6px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05), -1px -1px 1px 1px rgba(0, 0, 0, 0.05);
  padding-left: 10px;
  margin: 10px;
  box-sizing: border-box;
}
.main_header {
  padding-left: 16px;
}
.header_item {
  display: inline-block;
  margin: 0 5px;
}
:dee(.el-select .el-input__suffix .el-input__suffix-inner) {
  display: none !important;
}
:dee(.el-collapse-item__content) {
  padding-bottom: 10px !important;
}
:deep(.selectType .el-icon-arrow-up:before) {
  content: '';
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
