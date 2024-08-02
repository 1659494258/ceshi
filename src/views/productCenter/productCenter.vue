<template>
  <div class="productCenter">
    <div style="width: 94%; display: flex; flex-direction: column; height: 90vh">
      <div style="display: flex">
        <el-button @click="addParam">新增</el-button>
        <el-button @click="editRow">编辑</el-button>
        <el-button @click="duplication">复制</el-button>
        <el-button @click="exportItem">导出</el-button>
        <el-upload
          style="display: inline-block; padding-left: 10px"
          class="upload-demo"
          action="#"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :limit="3"
          multiple
          :on-exceed="handleExceed"
          :show-file-list="false"
          ref="upload"
        >
          <el-button>导入</el-button>
        </el-upload>
        <el-button @click="deleteRow" style="margin-left: 10px">删除</el-button>
        <!-- <el-button   @click="addCode">新增码值</el-button> -->
      </div>
      <div class="tableBox">
        <el-table
          :data="tableData"
          ref="multipleTableRef"
          highlight-current-row
          style="width: 100%; height: 66.5vh"
          @selection-change="handleCurrentChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column property="policyId" label="编号" />
          <el-table-column property="policyName" label="名称" />
          <el-table-column label="类型" width="120">
            <template #default="scope">
              {{ policyTypeList[scope.row.policyType] }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="120">
            <template #default="scope">
              {{ policyStatusList[scope.row.status] }}
            </template>
          </el-table-column>
          <!-- <el-table-column property="remarks" label="备注" /> -->
          <!-- <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button   type="primary" size="small" @click.prevent="deleteRow(scope.row)">删除</el-button>
              <el-button   type="primary" size="small" @click.prevent="editRow(scope.row)">编辑</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="demo-pagination-block">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 40]"
            small="true"
            layout=" prev, pager, next, jumper,total, sizes"
            :total="totalNum"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>
      <!-- 分页 -->

      <!-- dialog弹出框 -->
      <el-dialog
        v-model="centerVisible"
        v-if="centerVisible"
        title=""
        width="85%"
        align-center
        center
        :close-on-click-modal="false"
      >
        <div style="">
          <el-form :model="addFrom" style="display: flex; flex-wrap: wrap; justify-content: space-between">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="编号:" class="fromItem">
                  <el-input v-model="addFrom.policyId" placeholder=" " clearable style="width: 150px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="名字:" class="fromItem">
                  <el-input v-model="addFrom.policyName" placeholder=" " clearable style="width: 150px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="标签:" class="fromItem">
                  <el-input v-model="addFrom.policyTag" placeholder=" " clearable style="width: 150px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="政策分组:" class="fromItem">
                  <el-select
                    v-model="addFrom.policyGroup"
                    placeholder=" "
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    style="width: 150px"
                  >
                    <el-option
                      v-for="(key, value, index) in codeValue.PolicyGroup"
                      :label="key"
                      :value="value"
                      :key="index"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="政策类型:" class="fromItem">
                  <el-select
                    v-model="addFrom.policyType"
                    placeholder=" "
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    style="width: 150px"
                  >
                    <el-option
                      v-for="(key, value, index) in codeValue.PolicyType"
                      :label="key"
                      :value="value"
                      :key="index"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="有效期:" class="fromItem">
                  <el-date-picker
                    v-model="addFrom.validityPeriod"
                    type="daterange"
                    value-format="YYYY-MM-DD"
                    start-placeholder="生效日"
                    end-placeholder="到期日"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="政策状态:" class="fromItem">
                  <el-select
                    v-model="addFrom.status"
                    placeholder=" "
                    style="width: 150px"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                  >
                    <el-option label="无效" value="0" />
                    <el-option label="有效" value="1" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="继承自:" class="fromItem">
                  <div class="rightItem">
                    <el-button
                      @click="rightItem(item)"
                      type=""
                      v-for="(ite, index) in addFrom.info._extends"
                      style="margin: 0 5px"
                      link
                    >
                      {{ ite }}
                    </el-button>
                  </div>
                  <el-popover placement="left" title="" :width="300" trigger="click">
                    <template #reference>
                      <el-icon color="black" size="18px" style="margin-left: 10px; cursor: pointer"><Plus /></el-icon>
                    </template>
                    <div style="display: flex; flex-direction: column">
                      <el-select
                        v-model="addFrom.info._extends"
                        multiple
                        placeholder="继承其他同类型政策的编号"
                        style="width: auto"
                      >
                        <el-option
                          v-for="(value, key, index) in extendsLsit"
                          :key="index"
                          :label="value.policyId"
                          :value="value.policyName"
                        />
                      </el-select>
                    </div>
                  </el-popover>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="适用岗位:" class="fromItem">
                  <div class="rightItem">
                    <el-button
                      @click="rightItem(item)"
                      link
                      type=""
                      v-for="(ite, index) in addFrom.roles"
                      style="margin: 0 5px"
                    >
                      {{ rolesList[ite] }}
                    </el-button>
                  </div>
                  <el-popover placement="left" title="" :width="300" trigger="click">
                    <template #reference>
                      <el-icon color="black" size="18px" style="margin-left: 10px"><Plus /></el-icon>
                    </template>
                    <div style="display: flex; flex-direction: column">
                      <el-select
                        v-model="addFrom.roles"
                        multiple
                        placeholder="选择适用岗位"
                        style="width: auto"
                        :teleported="false"
                      >
                        <el-option label="产品岗" value="1" />
                        <el-option label="风险岗" value="2" />
                        <el-option label="运营岗" value="3" />
                        <el-option label="财务岗" value="4" />
                        <el-option label="系统岗" value="5" />
                      </el-select>
                    </div>
                  </el-popover>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div style="border-top: 1px solid #eceff7; padding: 0px; margin-top: 10px">
            <component
              :is="currentComponent(addFrom.policyType)"
              :dataDefault="addFrom?.info"
              :formData="addFrom"
              :policyGroup="props.group"
              @getParams="getParams"
              ref="childComponent"
              style=""
            ></component>
          </div>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="centerVisible = false">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 导入数据的dialog弹出框 -->
      <el-dialog
        v-model="dataVisible"
        v-if="dataVisible"
        title=""
        width="85%"
        align-center
        center
        :close-on-click-modal="false"
      >
        <div style="border-top: 1px solid #eceff7; padding: 0px; margin-top: 10px">
          <!-- <dataParsing
            :dataDefault="dataParsingList"
            @getParams="getParams"
            ref="dataComponent"
            style=""
          ></dataParsing> -->
          <el-table
            :data="dataParsingList"
            ref="multipleDataRef"
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
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dataVisible = false">取消</el-button>
            <el-button type="primary" @click="submitImport">导入</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch, defineProps } from 'vue'
import {
  getList,
  updateOne,
  addOne,
  removeOne,
  getPage,
  getOne,
  codeSave,
  codeList,
  policyExport,
  policyImportCheck,
  policyCopy,
  policyImportwithoutcheck,
} from '../../services/index'
import axios from 'axios'
import { ElTable, ElNotification, ElUpload, ElMessage, ElMessageBox } from 'element-plus'
// import type { UploadProps, UploadUserFile } from 'element-plus'
import codeValue from '../../assets/json/codeValue.json'
import Parameter from '../../components/parameter.vue'
import ParameterGroup from '../../components/parameterGroup.vue'
import RuleStructure from '../../components/ruleStructure.vue'
import DateTable from '../../components/dataTable.vue'
import FlowPath from '../../components/flowPath.vue'
import Processor from '../../components/processor.vue'
import Interface from '../../components/interface.vue'
import dataParsing from '../../components/dataParsing.vue'
const upload = ref<InstanceType<typeof ElUpload> | null>(null)
const fileList = ref<Array<any>>([])
const props = defineProps(['group'])
const dataParsingList = ref([]) //解析的导入的数据
const tableData = ref([]) //表格的数据
const extendsLsit = ref([]) //继承的选择数据
const childComponent = ref(null) //表格的数据
const dataComponent = ref(null) //表格的数据
const componentParams = ref({}) //数据
const currentPage = ref(1)
const dataVisible = ref(false) //控制导出的数据的显示与隐藏
const pageSize = ref(10)
const totalNum = ref(0)
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref([])

const multipleDataRef = ref<InstanceType<typeof ElTable>>()
const multipleData = ref([])
const handleSelectionChange = (val: any) => {
  console.log('multipleData', val)
  multipleData.value = val
}
let user = JSON.parse(window.localStorage.getItem('user'))
const rolesList = {
  '1': '产品岗',
  '2': '风险岗',
  '3': '运营岗',
  '4': '财务岗',
  '5': '系统岗',
}
// 表格数据
const beginFrom = computed(() => {
  return currentPage.value === 1 ? 1 : (currentPage.value - 1) * pageSize.value + 1
})
const handleSizeChange = (val: number) => {
  pageSize.value = val
  console.log(`${val} items per page`)
  getPageFromLsit()
}
const handlePageChange = (val: number) => {
  getPageFromLsit()
  currentPage.value = val
  console.log(`current page: ${val}`)
}
// 值域类型码值
const policyTypeList = ref({
  ...codeValue.PolicyType,
})
//状态码值
const policyStatusList = ref({
  ...codeValue.PolicyStatus,
})
const operateStatus = ref('')
const centerVisible = ref(false) //控制dialog的显示与隐藏
const addFrom = ref({
  policyId: '',
  policyName: '',
  policyTag: '',
  policyGroup: props.group,
  policyType: '',
  info: {
    _extends: [],
    roles: [],
  },
  roles: [],
  validityPeriod: '',
  orgId: user.orgId,
  status: '1',
  remark: '',
})
let formData = new FormData()
const service = axios.create({
  baseURL: '/config/',
  timeout: 5000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})
watch(
  addFrom,
  (newValue, oldValue) => {
    if (newValue.policyType) {
      getExtendsList(newValue.policyType)
    }
  },
  { deep: true, immediate: true }
)
const currentRow = ref()
const singleTableRef = ref<InstanceType<typeof ElTable>>()
// 新增码值
const addCode = async () => {
  let message = {
    items: [
      {
        codeNo: 'CustomerType',
        codeName: '客户类型',
        itemNo: '1',
        itemName: '个人',
      },
      {
        codeNo: 'CustomerType',
        codeName: '客户类型',
        itemNo: '2',
        itemName: '公司',
      },
      {
        codeNo: 'CustomerType',
        codeName: '客户类型',
        itemNo: '3',
        itemName: '其他',
      },
      // { codeNo: 'YesNo', codeName: '是否', itemNo: '1', itemName: '是' },
      // { codeNo: 'YesNo', codeName: '是否', itemNo: '0', itemName: '否' },
    ],
  }
  await codeSave(message).then(response => {
    console.log('codeSave', response)
    codeList(['YesNo', 'NationArea', 'CustomerType']).then(res => {
      console.log('codeList', res)
    })
  })
}
const setCurrent = (row: any) => {
  singleTableRef.value!.setCurrentRow(row)
}
const handleCurrentChange = (val: any | undefined) => {
  multipleSelection.value = val
  console.log('val', multipleSelection.value)
  currentRow.value = val[0]
}

onMounted(() => {
  getPageFromLsit()
  // getFormList()
})
//选择导入的数据
const submitImport = () => {
  if (multipleData.value.length) {
    policyImportCheck(multipleData.value).then(res => {
      console.log('res-policyImportCheck', res.data)
      if (res.data.message.repeat.length) {
        ElMessageBox.confirm('存在重复组件:' + res.data.message.repeat, '提示', {
          confirmButtonText: '继续导入',
          cancelButtonText: '重新选择',
          type: 'warning',
          center: true,
        })
          .then(() => {
            policyImportwithoutcheck(multipleData.value).then(res => {
              console.log('res-policyImportwithoutcheck', res.data)
              dataVisible.value = false
              ElMessage({
                type: 'success',
                message: '导入成功',
              })
              getPageFromLsit()
            })
          })
          .catch(() => {})
      } else {
        ElMessage({
          type: 'success',
          message: '导入成功',
        })
      }
    })
  } else {
    ElNotification({
      title: '提示',
      message: '至少选择一条数据进行导入',
      type: 'warning',
    })
  }
}

const beforeUpload = (file: File) => {
  formData.append('attachment', file)
  submitFiles()
  return false
}
const submitFiles = async () => {
  try {
    const headers = {
      'User-id': 'admin',
      'Org-id': user.orgId,
    }
    const response = await service.post('/policy/info/importresolve', formData, {
      headers,
    })
    ElMessage.success('数据解析成功')
    dataParsingList.value = response.data.message.list
    dataVisible.value = true
    console.log('response.data', response.data)
  } catch (error) {
    ElMessage.error('导入过程中发生错误')
  }
}
const handleSuccess = (response: any, file: File, fileList: any[]) => {
  console.log('handleSuccess', response, file, fileList)
}
const handleExceed = (files: File[], fileList: any[]) => {}

const rightItem = (item: any) => {
  console.log(item)
  // centerDialogVisible.value = true
}
// 对某一条数据的提交更新
const submit = async () => {
  childComponent.value.pushParams()
  addFrom.value.info = { ...componentParams.value }
  let params = {
    message: {
      ...addFrom.value,
    },
  }
  console.log('params-productCenter', params)
  if (operateStatus.value === 'edit') {
    updateOne(params).then(res => {
      // 更新之后重刷列表
      getPageFromLsit()
      centerVisible.value = false
      ElMessage({
        type: 'success',
        message: '更新成功',
      })
    })
  } else {
    await addOne(params).then(res => {
      // 更新之后重刷列表
      getPageFromLsit()
      centerVisible.value = false
      ElMessage({
        type: 'success',
        message: '新增成功',
      })
    })
  }
}
// 获取表格数据
const getFormList = async () => {
  let params = {
    message: {
      policyId: '',
      policyGroup: props.group,
      policyType: '',
      orgId: user.orgId,
      status: '',
    },
  }
  await getList(params).then(response => {
    tableData.value = response.data.message.list
    totalNum.value = tableData.value.length
  })
}
// 获取继承的表格数据
const getExtendsList = async (type: string) => {
  let params = {
    message: {
      policyId: '',
      policyGroup: props.group,
      policyType: type,
      orgId: user.orgId,
      status: '',
    },
  }
  await getList(params).then(response => {
    extendsLsit.value = response.data.message.list
  })
}
// 获取表格单个数据详情
const getOneDetails = async (id: string) => {
  await getOne(id).then(response => {
    console.log('res-one', response)
    addFrom.value = response.data.message
    currentRow.value = response.data.message
  })
}
// 分页形式获取表格数据
const getPageFromLsit = async () => {
  let params = {
    begin: beginFrom.value,
    pageSize: pageSize.value,
    orgId: user.orgId,
    orderBy: [],
    roles: [],
    valid: '',
    query_policyGroup: {
      name: 'policyGroup',
      values: [props.group],
      queryFilterType: 'equals',
    },
  }
  await getPage(params).then(response => {
    tableData.value = response.data.message.list
    totalNum.value = response.data.message.total
  })
}
// 根据类型的不同，匹配不同的组件
const currentComponent = (type: any) => {
  if (type === '1') {
    return Parameter
  } else if (type === '2') {
    return ParameterGroup
  } else if (type === '3') {
    return DateTable
  } else if (type === '4') {
    return RuleStructure
  } else if (type === '5') {
    return FlowPath
  } else if (type === '7') {
    return Interface
  } else if (type === '8') {
    return Processor
  }
}

const addParam = () => {
  centerVisible.value = true
  addFrom.value = {
    policyId: '',
    policyName: '',
    policyTag: '',
    policyGroup: props.group,
    policyType: '',
    roles: [],
    info: {
      _extends: [],
      _roles: [],
    },
    validityPeriod: '',
    orgId: user.orgId,
    status: '1',
    remark: '',
  }
  operateStatus.value = 'add'
  console.log('addFrom', addFrom.value)
}
const getParams = (params: object) => {
  componentParams.value = params
  console.log('params', componentParams.value, addFrom.value)
}
// 删除选中的表格里的数据
const deleteRow = () => {
  if (!multipleSelection.value.length) {
    ElNotification({
      title: '提示',
      message: '至少选择一条数据',
      type: 'warning',
    })
  } else {
    let id = ''
    for (let index = 0; index < multipleSelection.value.length; index++) {
      if (id) {
        id = id + ',' + multipleSelection.value[index].policyId
      } else {
        id = id + multipleSelection.value[index].policyId
      }
    }
    let params = {
      message: {
        id: id,
      },
    }
    ElMessageBox.confirm('是否确定删除组件', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
    })
      .then(() => {
        removeOne(params).then(res => {
          ElNotification({
            title: '成功',
            message: '删除成功',
            type: 'success',
          })
          // 更新之后重刷列表
          getPageFromLsit()
        })
      })
      .catch(() => {})
  }
}
// 复制选中的表格中的一条数据
const duplication = async () => {
  if (multipleSelection.value.length > 1 || multipleSelection.value.length === 0) {
    ElNotification({
      title: '提示',
      message: '请选择一条数据',
      type: 'warning',
    })
  } else {
    // 这里去加复制的逻辑，出现个弹框，输入名字和ID。调接口进行保存
    ElMessageBox.prompt('请输入新的政策编号', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      center: true,
    })
      .then(({ value }) => {
        policyCopy(multipleSelection.value[0].policyId, value).then(res => {
          // 复制之后重刷列表
          getPageFromLsit()
          ElNotification({
            title: '成功',
            message: '复制成功',
            type: 'success',
          })
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Input canceled',
        })
      })
  }
}

// 导出
const exportItem = () => {
  if (!multipleSelection.value.length) {
    ElNotification({
      title: '提示',
      message: '至少选择一条数据',
      type: 'warning',
    })
  } else {
    let id = ''
    for (let index = 0; index < multipleSelection.value.length; index++) {
      if (id) {
        id = id + ',' + multipleSelection.value[index].policyId
      } else {
        id = id + multipleSelection.value[index].policyId
      }
    }
    policyExport(id).then(res => {
      console.log('id', id, res)
      const blob = new Blob([res.data], {
        type: 'application/octet-stream',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'file.zip' // 设置文件名和扩展名
      a.click()
      URL.revokeObjectURL(url) // 释放URL对象
      // ElNotification({
      //   title: "成功",
      //   message: "导出成功",
      //   type: "success",
      // });
    })
  }
}
// 编辑
const editRow = async (row: object) => {
  // 如果是通过分页形式获取的数据的话，点击编辑的时候就需要去查单个数据的详情，目前是通过list的形式
  if (multipleSelection.value.length > 1 || multipleSelection.value.length === 0) {
    ElNotification({
      title: '提示',
      message: '请选择一条数据',
      type: 'warning',
    })
  } else {
    await getOneDetails(currentRow.value.policyId)
    if (currentRow.value.policyType === '4') {
      addFrom.value.info = {
        _extends: [],
        _label: '',
        _type: '',
        _params: [],
        _right: {},
        _rule: {},
      }
    }
    addFrom.value = { ...currentRow.value }
    console.log('editRow', currentRow.value, addFrom.value)
    centerVisible.value = true
    operateStatus.value = 'edit'
  }
}
</script>

<style scoped>
:deep(.el-date-editor.el-input__wrapper) {
  box-shadow: none;
}
.rightItem {
  display: inline-block;
  margin-left: 10px;
  max-width: 85%;
  overflow: scroll;
  white-space: nowrap;
}
.rightItem::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
/* Firefox */
.rightItem {
  scrollbar-width: none; /* Firefox */
}
.rightItem::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  width: 15px; /* 滚动条的宽度 */
  height: 100%;
  pointer-events: none;
  background: inherit;
  clip-path: polygon(100% 0, 100% 100%, 95% 100%, 95% 0);
}
:deep(.el-dialog--center .el-dialog__body) {
  max-height: 80vh; /* 设置最大高度为视口高度的80% */
  overflow-y: auto; /* 当内容超出最大高度时，显示垂直滚动条 */
}
.tableBox {
  width: 100%;
  margin-top: 20px;
  height: 70vh;
}
.demo-pagination-block {
  display: flex;
  flex-direction: row-reverse;
  padding-top: 10px;
  width: 100%;
}

.fromItem {
  margin: 10px 0;
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
  align-items: center;
  /* justify-content: space-around; */
  padding-top: 20px;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
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
