<template>
  <div class="proDebox">
    <!-- <el-card>
      <template #header> -->
    <div class="headerSelect">
      <el-tree-select
        v-model="legalPerson"
        :data="options"
        :render-after-expand="false"
        :default-expand-all="true"
        style="width: 240px"
        filterable
        clearable
        remote
        reserve-keyword
        :check-strictly="true"
      />
      <div class="buttonBox" v-if="showStatus">
        <el-dropdown>
          <el-button>
            <el-icon><Plus /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleCommand('1')" data-command="1">产品目录</el-dropdown-item>
              <el-dropdown-item @click="handleCommand('2')" data-command="2">基础产品</el-dropdown-item>
              <el-dropdown-item @click="handleCommand('3')" data-command="3">标准产品</el-dropdown-item>
              <el-dropdown-item @click="handleCommand('4')" data-command="4">方案产品</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- </template> -->
    <div v-if="showStatus">
      <el-card>
        <div>
          <el-table
            :data="treeTableData"
            highlight-current-row
            style="width: 100%"
            @selection-change="handleCurrentChange"
            row-key="value"
            default-expand-all
          >
            <el-table-column prop="value" label="编号" />
            <el-table-column prop="label" label="名称" />
            <el-table-column label="类型">
              <template #default="scope">
                {{ optionType[scope.row.ext.type] }}
              </template>
            </el-table-column>
            <el-table-column label="说明" width="150">
              <template #default="scope">
                {{ scope.row.ext.remark }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="60">
              <template #default="scope">
                {{ optionStatus[scope.row.ext.status] }}
              </template>
            </el-table-column>

            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button link @click="editProduct(scope.row)" type="primary">编辑</el-button>
                <el-button link type="danger" @click="deleteProduct(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    <!-- </el-card> -->
    <!-- <el-divider v-if="showStatus" /> -->
    <!-- 添加产品或者目录的dialog弹出框 -->
    <el-dialog
      v-model="centerVisible"
      v-if="centerVisible"
      title=""
      width="80%"
      align-center
      center
      :close-on-click-modal="false"
    >
      <el-card>
        <el-form
          :model="editItem"
          label-width="auto"
          style="display: flex; flex-wrap: wrap; justify-content: space-between"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="编号:" class="fromItem">
                <el-input v-model="editItem.id" placeholder=" " clearable style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类型:" class="fromItem">
                <el-select
                  v-model="editItem.type"
                  placeholder=" "
                  style="width: 150px"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  :disabled="true"
                >
                  <el-option label="产品目录" value="1" />
                  <el-option label="基础产品" value="2" />
                  <el-option label="标准产品" value="3" />
                  <el-option label="方案产品" value="4" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="名称:" class="fromItem">
                <el-input v-model="editItem.name" placeholder=" " clearable style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="上级目录:" class="fromItem">
                <el-tree-select
                  v-model="editItem.parent"
                  :data="catalogTreeList"
                  :render-after-expand="false"
                  :default-expand-all="true"
                  style="width: 240px"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  :check-strictly="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排序号:" class="fromItem">
                <el-input v-model="editItem.sortNo" placeholder=" " clearable style="width: 150px" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态:" class="fromItem">
                <el-select
                  v-model="editItem.status"
                  placeholder=" "
                  style="width: 150px"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                >
                  <el-option label="有效" value="1" />
                  <el-option label="无效" value="2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注:" class="fromItem">
                <el-input
                  v-model="editItem.remark"
                  placeholder=" "
                  type="textarea"
                  :rows="2"
                  clearable
                  style="border: none !important; box-shadow: none !important"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <el-card v-if="editItem.type && editItem.type != '1'" style="margin-top: 10px">
        <template #header>
          <div class="card-header">
            <span>产品政策列表</span>
          </div>
        </template>
        <div>
          <div class="buttonBox">
            <el-button @click="addPolicy" style="font-size: 16px">新增</el-button>
          </div>
          <div>
            <el-table
              :data="policyRelativeList"
              style="width: 100%; margin-bottom: 20px"
              row-key="id"
              default-expand-all
            >
              <el-table-column prop="policyId" label="政策编号" />
              <el-table-column prop="policyName" label="政策名字" />
              <el-table-column label="有效期">
                <template #default="scope">
                  <span>{{ scope.row.validityPeriod[0] }}-{{ scope.row.validityPeriod[1] }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="描述" />
              <el-table-column label="状态" width="60">
                <template #default="scope">
                  <span v-if="scope.row.status === '1'">有效</span>
                  <span v-if="scope.row.status === '0'">无效</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <el-button link type="primary" size="small" @click.prevent="editRow(scope.row)">编辑</el-button>
                  <el-button link type="danger" size="small" @click.prevent="deleteRow(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerVisible = false">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 新增产品关联政策的dialog选择窗口 -->
    <el-dialog
      v-model="addpolicyVisible"
      v-if="addpolicyVisible"
      title="添加政策"
      width="65%"
      align-center
      center
      :close-on-click-modal="false"
    >
      <!-- <el-card> -->
      <div>
        <el-table
          ref="singleTableRef"
          :data="policyListData"
          highlight-current-row
          style="width: 100%"
          height="450"
          :append-to-body="true"
          @current-change="handleChange"
        >
          <el-table-column type="index" width="50" align="center">
            <template #header>
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
                    <!-- <el-col :span="24">
                      <el-form-item label="名称:" class="fromItem">
                        <el-input
                          v-model="searchForm.name"
                          placeholder=" "
                          clearable
                          style="width: 250px"
                        />
                      </el-form-item>
                    </el-col> -->
                  </el-row>
                </el-form>
                <el-button type="primary" @click="searchPolicy" style="float: right">搜索</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="policyId" label="编号" />
          <el-table-column prop="policyName" label="名字" />
          <el-table-column prop="remark" label="描述" width="150" />
          <el-table-column label="状态" width="60">
            <template #default="scope">
              {{ policyStatusList[scope.row.status] }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="demo-pagination-block" style="margin-bottom: 5px">
        <el-form :model="addPolicyItem" label-width="auto" style="">
          <el-form-item label="新的政策编号:" class="fromItem" style="margin-bottom: 0 !important">
            <el-input v-model="addPolicyItem.policyId" placeholder="输入新的政策编号 " clearable style="width: 250px" />
          </el-form-item>
        </el-form>
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
      <!-- <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注:" class="fromItem">
            <el-input
              v-model="addPolicyItem.remark"
              placeholder=" "
              type="textarea"
              :rows="2"
              clearable
              style="border: none !important; box-shadow: none !important"
            />
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- </el-card> -->
      <template #footer>
        <div class="dialog-footer" style="margin-top: 0">
          <el-button @click="addpolicyVisible = false">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 新增产品关联政策的编辑的窗口 -->
    <el-dialog
      v-model="editpolicyVisible"
      v-if="editpolicyVisible"
      title=""
      width="90%"
      align-center
      center
      :close-on-click-modal="false"
    >
      <div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="政策配置" name="policyAllocation">
            <div style="max-height: 80vh; overflow-y: scroll">
              <el-card>
                <template #header>
                  <div class="card-header">
                    <el-form
                      :model="currentRow"
                      style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center"
                    >
                      <el-form-item label="名字:" class="fromItem" style="margin-bottom: 1px !important">
                        <el-input v-model="currentRow.policyName" placeholder=" " clearable style="width: 150px" />
                      </el-form-item>
                      <el-form-item label="描述:" class="fromItem" style="margin-bottom: 1px !important">
                        <el-input v-model="currentRow.remark" placeholder=" " clearable style="width: 150px" />
                      </el-form-item>
                      <el-form-item label="有效期:" class="fromItem" style="margin-bottom: 1px !important">
                        <div class="demo-date-picker">
                          <div class="block">
                            <el-date-picker
                              v-model="currentRow.validityPeriod"
                              type="daterange"
                              start-placeholder="生效日"
                              end-placeholder="到期日"
                              style="width: 220px"
                            />
                          </div>
                        </div>
                      </el-form-item>
                      <el-form-item label="政策状态:" class="fromItem" style="margin-bottom: 1px !important">
                        <el-select
                          v-model="currentRow.status"
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
                    </el-form>
                  </div>
                </template>
                <div style="padding: 0px; margin-top: 10px; display: flex">
                  <!-- 左侧树图 -->
                  <div style="width: 190px; overflow: hidden" v-if="treeData.length > 1">
                    <el-tree
                      style="max-width: 600px; width: 180px; font-size: 17px !important"
                      :data="treeData"
                      default-expand-all
                      @node-click="handleNodeClick"
                    />
                  </div>
                  <!-- <div style="width: auto">
                    <el-tree
                      style="max-width: 600px; width: 190px; font-size: 17px !important"
                      :data="treeData"
                      default-expand-all
                      @node-click="handleNodeClick"
                    />
                  </div> -->
                  <component
                    :is="currentComponent(currentRow.policyType)"
                    :dataDefault="currentRow?.info"
                    :formData="currentRow"
                    @getParams="getParams"
                    ref="childComponent"
                    class="componentBox"
                    :id="currentRow.policyId"
                    style="height: 50vh; overflow-y: scroll"
                  ></component>
                </div>
                <div class="card-footer">
                  <el-button @click="editpolicyVisible = false">取消</el-button>
                  <el-button type="primary" @click="submit">保存</el-button>
                </div>
              </el-card>
            </div>
          </el-tab-pane>
          <el-tab-pane label="关联信息" name="relatedInformation">
            <div style="height: 60vh; overflow-y: scroll">
              <RelatedInfo :relevanceNumber="relevanceNumber" :data="currentRow"></RelatedInfo>
            </div>
          </el-tab-pane>
          <el-tab-pane label="产品文档" name="productDocumentation">
            <!-- <el-card> -->
            <div style="height: 60vh; overflow-y: scroll">
              <ProductInfo :relevanceNumber="relevanceNumber" :data="currentRow"></ProductInfo>
            </div>
            <!-- </el-card> -->
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import {
  productTreeDel,
  productTreeone,
  productTreeAdd,
  productTreeEdit,
  productTree,
  policeRelative,
  getList,
  getOne,
  policeRelativeAdd,
  policeRelativeModpolicy,
  policeRelativeDel,
  getPage,
  querycorporationtree,
  productCatalogTree,
} from '../../../services/index'
import codeValue from '../../../assets/json/codeValue.json'
import { ElTable, ElNotification, ElMessage, ElMessageBox } from 'element-plus'
import Parameter from '../../../components/parameter.vue'
import ParameterGroup from '../../../components/parameterGroup.vue'
import RuleStructure from '../../../components/ruleStructure.vue'
import DateTable from '../../../components/dataTable.vue'
import FlowPath from '../../../components/flowPath.vue'
import Processor from '../../../components/processor.vue'
import Interface from '../../../components/interface.vue'
import RelatedInfo from '../../../components/relatedInfo.vue'
import ProductInfo from '../../../components/productInfo.vue'
const centerVisible = ref(false)
const addpolicyVisible = ref(false)
const editpolicyVisible = ref(false)
//用于存储要编辑的产品或目录的数据
const editItem = ref({
  id: '',
  name: '',
  orgId: '',
  parent: null,
  remark: '',
  sortNo: '',
  status: '',
  type: '',
})
const addPolicyItem = ref({
  orgPolicId: '',
  policyId: '',
})
const currentPage = ref(1)
const pageSize = ref(10)
const totalNum = ref(0)
//状态码值
const policyStatusList = {
  ...codeValue.PolicyStatus,
}
//政策添加的时候的搜索条件
const searchForm = ref({
  id: '',
  name: '',
})
const treeTableData = ref([])
const treeData = ref([]) //锚点数据
const legalPerson = ref() //法人
const activeName = ref('policyAllocation') //tab当前选择
const childComponent = ref(null) //组件的数据
const currentProcuctId = ref('') //当前产品的id
const orgPolicId = ref('') //新增产品政策的时候，原始的id
const typeStatus = ref('') //用于区分是产品还是目录
const operationStatus = ref('') //用于区分是新增还是编辑
const policyStatusType = ref('') //用于区分是新增产品政策还是编辑产品政策
const relevanceNumber = ref('') //产品政策关联编号
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref([])
const componentParams = ref({}) //子组件收集的数据
const currentRow = ref() //新增的时候选择的政策
const singleTableRef = ref<InstanceType<typeof ElTable>>()
const handleCurrentChange = (val: any | undefined) => {
  multipleSelection.value = val
}
const handleChange = (val: any | undefined) => {
  console.log('handleChange', val)
  getOne(val.policyId).then(response => {
    currentRow.value = response.data.message
  })
  addPolicyItem.value.orgPolicId = val.policyId
}
const optionType = {
  '1': '产品目录',
  '2': '标准产品',
  '3': '基础产品',
  '4': '方案产品',
}
const optionStatus = {
  '1': '有效',
  '2': '无效',
}
const tableData = ref([])
const catalogTreeList = ref([])
const policyListData = ref([]) //可选择的政策的数据
const policyRelativeList = ref([]) //产品的关联政策列表
const options = ref([])
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
const getParams = (params: object) => {
  componentParams.value = params
  console.log('params', params, componentParams.value, currentRow.value)
}
const showStatus = computed(() => {
  if (legalPerson.value) {
    getProductList()
    getCatalogTree()
    return true
  } else {
    return false
  }
})
const handleCommand = (type: string) => {
  typeStatus.value = type
  console.log('handleCommand', type)
  addProduct()
}
let user = JSON.parse(window.localStorage.getItem('user'))
onMounted(() => {
  getCorporationtree()
})
//获取产品目录树
const getCatalogTree = async () => {
  productCatalogTree(legalPerson.value).then(res => {
    catalogTreeList.value = res.data.message.children
    // catalogTreeList.value = res.data.ResponseMessage.message.children
  })
}
// 获取法人机构
const getCorporationtree = async () => {
  querycorporationtree().then(res => {
    options.value = res.data.message.children
  })
}
// 锚点
const handleNodeClick = (data: any) => {
  console.log('data', data)
  const element = document.getElementById(data.id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' }) // 平滑滚动到元素
  }
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getFormList()
}
const handlePageChange = (val: number) => {
  currentPage.value = val
  getFormList()
}
// 获取政策数据
const getFormList = async () => {
  let params = {
    begin: currentPage.value === 1 ? 1 : (currentPage.value - 1) * pageSize.value + 1,
    pageSize: pageSize.value,
    orderBy: [],
    roles: [user.roleType],
    query_policyType: {
      name: 'policyType',
      values: ['2'],
      queryFilterType: 'equals',
    },
    query_policyGroup: {
      name: 'policyGroup',
      values: ['1'],
      queryFilterType: 'equals',
    },
    orgId: legalPerson.value,
  }
  await getPage(params).then(response => {
    policyListData.value = response.data.message.list
    totalNum.value = response.data.message.total
  })
}
// 点击添加产品的关联政策
const addPolicy = () => {
  addpolicyVisible.value = true
  policyStatusType.value = 'add'
  getFormList()
}

// 对某一条数据的提交更新
const submit = async () => {
  console.log('activeName', relevanceNumber.value, orgPolicId.value, editItem.value.id, currentRow.value)
  if (activeName.value === 'policyAllocation') {
    childComponent.value.pushParams()
    currentRow.value.info = { ...componentParams.value }
    currentRow.value.originPolicyId = orgPolicId.value
    await policeRelativeModpolicy(
      relevanceNumber.value,
      editItem.value.id,
      currentRow.value.policyId,
      currentRow.value
    ).then(res => {
      editpolicyVisible.value = false
      addpolicyVisible.value = false
      getPoliceRelative(editItem.value.id) //成功之后再次请求查询产品政策的接口
    })
  }
}
// 点击确定，添加产品的关联政策
const confirm = async () => {
  console.log(addPolicyItem.value.policyId, addPolicyItem.value.orgPolicId, editItem.value.id)
  if (addPolicyItem.value.policyId) {
    await policeRelativeAdd(addPolicyItem.value.policyId, addPolicyItem.value.orgPolicId, editItem.value.id).then(
      res => {
        console.log('res-policeRelativeAdd', res.data)
        orgPolicId.value = res.data.message.policyId
        relevanceNumber.value = res.data.message.id
        editpolicyVisible.value = true //打开政策编辑的dialog
      }
    )
  } else {
    ElNotification({
      title: '提示',
      message: '请输入新的政策编号',
      type: 'warning',
    })
  }
}
// 政策添加的时候的搜索条件
const searchPolicy = () => {
  let params = {
    begin: 1,
    pageSize: 10,
    orderBy: [],
    query_policyId: {
      name: 'policyId',
      values: [searchForm.value.id],
      queryFilterType: 'equals',
    },
    // query_policyName: {
    //   name: "policyName",
    //   values: [searchForm.value.name],
    //   queryFilterType: "equals",
    // },
    orgId: '',
  }
  console.log('params', params)
  getPage(params).then(res => {
    console.log('getPage', res.data)
    policyListData.value = res.data.message.list
  })
}
// 查询产品树的信息
const getProductList = async () => {
  await productTree(legalPerson.value).then(res => {
    treeTableData.value = res.data.message.children
    for (let i = 0; i < treeTableData.value.length; i++) {
      const element = treeTableData.value[i]
      if (!element.children.length) {
        delete element.children
      }
      treeTableData.value[i] = element
    }
    console.log(res.data.message, 'res-tree', treeTableData.value)
  })
}
// 点击产品目录表格上面的编辑
const editProduct = async (row: object) => {
  operationStatus.value = 'edit'
  currentProcuctId.value = row.value
  await productTreeone(row.value).then(res => {
    editItem.value = res.data.message
    centerVisible.value = true
  })
  getPoliceRelative(row.value)
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
  // 确认编辑的时候就可以通过id去查它的关联信息
  await policeRelative(messge).then(response => {
    console.log('policeRelative', response)
    policyRelativeList.value = response.data.message.list
  })
}

// 点击目录产品表格上方的删除
const deleteProduct = (row: object) => {
  console.log('deleteProduct', row)
  ElMessageBox.confirm('是否删除这条产品记录', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    center: true,
  })
    .then(() => {
      productTreeDel(row.value).then(res => {
        ElMessage({
          message: '删除成功',
          type: 'success',
        })
        getProductList()
      })
    })
    .catch(() => {})
}
// 点击产品政策表格的删除
const deleteRow = (row: object) => {
  policeRelativeDel(row.id, row.policyId).then(res => {
    getPoliceRelative(multipleSelection.value[0].id)
    ElNotification({
      title: '成功',
      message: '删除成功',
      type: 'success',
    })
  })
}
// 点击产品政策表格的编辑
const editRow = async (row: object) => {
  console.log('editRow', row)
  await getOne(row.policyId).then(res => {
    currentRow.value = res.data.message
    orgPolicId.value = res.data.message.id
    relevanceNumber.value = row.relativeId
    editpolicyVisible.value = true
    console.log(res.data.message, 'res', 'row', currentRow.value)
    let anchorData = []
    anchorData.push({
      label: currentRow.value.policyName,
      id: currentRow.value.policyId,
      children: [],
    })
    let params = currentRow.value.info?._params
    if (params?.length) {
      for (let i = 0; i < params.length; i++) {
        anchorData[0].children.push({
          label: params[i]._label,
          id: params[i]._id,
          children: [],
        })
      }
    }
    treeData.value = anchorData
    console.log('anchorData', anchorData)
  })
}
// 点击保存
const save = async () => {
  // 区分一下是新增还是保存
  editItem.value.orgId = legalPerson.value
  console.log('editItem', editItem.value)
  if (operationStatus.value === 'add') {
    await productTreeAdd(editItem.value).then(res => {
      ElMessage({
        message: '添加成功',
        type: 'success',
      })
      centerVisible.value = false
      getProductList()
    })
  } else {
    await productTreeEdit(editItem.value).then(res => {
      ElMessage({
        message: '修改成功',
        type: 'success',
      })
      centerVisible.value = false
      getProductList()
    })
  }
  // getProductList()
  // centerVisible.value = false
}
// 点击新增（产品或目录）
const addProduct = () => {
  editItem.value = {
    id: '',
    name: '',
    orgId: legalPerson.value,
    parent: null,
    remark: '',
    sortNo: '',
    status: '',
    type: typeStatus.value,
  }
  operationStatus.value = 'add'
  centerVisible.value = true
}
</script>

<style scoped>
.demo-pagination-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  width: 100%;
}
.card-footer {
  padding: 20px 0 2px 0;
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 auto;
}
.card-header {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}
::-webkit-scrollbar {
  display: none;
}
:deep(.el-dialog--center .el-dialog__body) {
  max-height: 80vh;
  overflow-y: auto;
}
.fromItem {
  /* width: 200px; */
  max-width: 91%;
}
:deep(.fromItem .el-textarea__inner) {
  border: 0;
  box-shadow: none;
  resize: none;
}
:deep(.fromItem .el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}
.componentBox {
  flex: 1;
}
:deep(.componentBox .groupItem .el-form-item) {
  margin-bottom: 0px !important;
}
.proDebox {
  padding: 20px 20px 0 20px;
  box-sizing: border-box;
  background-color: #fff;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
.buttonBox {
  /* margin-bottom: 10px; */
}
.headerSelect {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 0px !important;
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
