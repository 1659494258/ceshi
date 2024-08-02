<template>
  <div class="postBox">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="待处理" name="toDealWith">
        <el-card>
          <div style="margin-top: 20px">
            <el-table
              ref="singleTableRef"
              :data="todoListData"
              highlight-current-row
              style="width: 100%; height: 450px"
              :append-to-body="true"
              @current-change="handleChange"
              show-overflow-tooltip
            >
              <el-table-column type="index" width="50"> </el-table-column>
              <el-table-column
                prop="flowInstanceId"
                label="流程实例编号"
                width=""
              />
              <!-- <el-table-column prop="productName" label="产品名称" width="150" /> -->
              <el-table-column
                prop="objectNo"
                label="产品政策名称"
                width="200"
              />
              <el-table-column label="任务类型" width="120">
                <template #default="scope">
                  {{ taskTypeList[scope.row.taskType] }}
                </template>
              </el-table-column>
              <el-table-column label="流程阶段" width="90">
                <template #default="scope">
                  {{ flowPhaseList[scope.row.flowPhase] }}
                </template>
              </el-table-column>
              <el-table-column
                prop="createUserId"
                label="创建人员"
                width="90"
              />
              <el-table-column prop="createTime" label="创建时间" width="160" />
              <el-table-column prop="remark" label="流程说明" width="150" />
              <el-table-column label="操作" width="120" align="center">
                <template #default="scope">
                  <el-button
                    @click.prevent="dealWith(scope.row)"
                    link
                    type="primary"
                    >处理</el-button
                  >
                  <el-button
                    @click.prevent="cancelTodo(scope.row)"
                    link
                    v-if="user.roleType === '1'"
                    type="primary"
                  >
                    取消
                  </el-button>
                </template>
              </el-table-column>
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
          <div style="margin-top: 20px">
            <el-table
              ref="singleTableRef"
              :data="doneListData"
              highlight-current-row
              style="width: 100%; box-sizing: border-box; height: 450px"
              :append-to-body="true"
              @current-change="handleChange"
            >
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column
                prop="flowInstanceId"
                label="流程实例编号"
                width=""
              />
              <el-table-column
                prop="objectNo"
                label="产品政策名称"
                width="200"
              />
              <el-table-column label="任务类型" width="120">
                <template #default="scope">
                  {{ taskTypeList[scope.row.taskType] }}
                </template>
              </el-table-column>
              <el-table-column label="流程阶段" width="120">
                <template #default="scope">
                  {{ flowPhaseList[scope.row.flowPhase] }}
                </template>
              </el-table-column>
              <el-table-column
                prop="createUserId"
                label="创建人员"
                width="100"
              />
              <el-table-column prop="createTime" label="创建时间" width="200" />
              <el-table-column prop="remark" label="流程说明" width="150" />
              <el-table-column label="操作" width="100">
                <template #default="scope">
                  <el-button @click="review(scope.row)" link type="primary"
                    >查看</el-button
                  >
                </template>
              </el-table-column>
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
    <div class="buttonList" v-if="activeName === 'toDealWith' && showVisible">
      <el-button @click="prolicyOperate('add', '1')">新建政策</el-button>
      <el-button @click="prolicyOperate('edit', '2')">修订政策</el-button>
      <el-button @click="prolicyOperate('stop', '3')">停用政策</el-button>
    </div>
    <!-- 新建流程信息收集 -->
    <el-dialog
      v-model="operationVisible"
      v-if="operationVisible"
      :title="processType"
      width="40%"
      align-center
      center
      :close-on-click-modal="false"
    >
      <div style="width: 100%; display: flex; justify-content: space-around">
        <el-form
          :model="policyForm"
          label-width="auto"
          style="max-width: 600px"
        >
          <el-form-item label="产品编号:">
            <el-input
              v-model="policyForm.productId"
              disabled="true"
              style="width: 300px; margin-right: 5px"
            />
            <el-button type="primary" link @click="productSelect"
              >选择</el-button
            >
          </el-form-item>
          <el-form-item label="政策编号:">
            <el-input
              v-model="policyForm.orgPolicyId"
              disabled="true"
              style="width: 300px; margin-right: 5px"
            />
            <el-button type="primary" link @click="policySelect"
              >选择</el-button
            >
          </el-form-item>
          <el-form-item label="新政策编号:">
            <el-input
              v-model="policyForm.policyId"
              style="width: 300px; margin-right: 5px"
            />
          </el-form-item>
          <el-form-item label="补充操作:">
            <el-input
              v-model="policyForm.operate"
              style="width: 300px; margin-right: 5px"
            />
          </el-form-item>
          <el-form-item label="说明:">
            <el-input
              v-model="policyForm.remark"
              style="width: 300px; margin-right: 5px"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer" style="margin-top: 0">
          <el-button @click="operationVisible = false">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 导入数据的dialog弹出框 -->
    <el-dialog
      v-model="addTodoVisible"
      v-if="addTodoVisible"
      :title="dataTitle"
      :width="dialogWidth"
      align-center
      center
      :close-on-click-modal="false"
    >
      <div style="width: 100%">
        <component
          :is="currentComponent(componentType)"
          :dataDefault="currentTodo"
          @submitTodo="submitTodo"
          :productId="policyForm.productId"
          :type="policyOperateType"
        ></component>
      </div>
    </el-dialog>
    <!-- 关联政策的编辑的窗口 -->
    <el-dialog
      v-model="editpolicyVisible"
      v-if="editpolicyVisible"
      title=""
      width="90%"
      align-center
      center
      :close-on-click-modal="false"
      @close="beforeClose"
    >
      <div style="position: relative">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="政策配置" name="policyAllocation">
            <div style="max-height: 80vh; overflow-y: scroll">
              <el-card>
                <template #header>
                  <div class="card-header">
                    <el-form
                      :model="currentRow"
                      style="
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                        align-items: center;
                      "
                    >
                      <el-form-item
                        label="名字:"
                        class="fromItem"
                        style="margin-bottom: 1px !important"
                      >
                        <el-input
                          v-model="currentRow.policyName"
                          placeholder=" "
                          clearable
                          style="width: 150px"
                        />
                      </el-form-item>
                      <el-form-item
                        label="描述:"
                        class="fromItem"
                        style="margin-bottom: 1px !important"
                      >
                        <el-input
                          v-model="currentRow.remark"
                          placeholder=" "
                          clearable
                          style="width: 150px"
                        />
                      </el-form-item>
                      <el-form-item
                        label="有效期:"
                        class="fromItem"
                        style="margin-bottom: 1px !important"
                      >
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
                      <el-form-item
                        label="政策状态:"
                        class="fromItem"
                        style="margin-bottom: 1px !important"
                      >
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
                  <div style="width: 190px; overflow: hidden">
                    <!-- <div style="width: 190px; overflow: hidden" v-if="treeData.length > 1"> -->
                    <el-tree
                      style="
                        max-width: 600px;
                        width: 180px;
                        font-size: 17px !important;
                      "
                      :data="treeData"
                      default-expand-all
                      indent="16"
                      :highlight-current="true"
                      @node-click="handleNodeClick"
                    />
                  </div>
                  <component
                    :is="currentCom(currentRow.policyType)"
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
                  <el-button type="primary" @click="submitPolicy"
                    >保存</el-button
                  >
                </div>
              </el-card>
            </div>
          </el-tab-pane>
          <el-tab-pane label="关联信息" name="relatedInformation">
            <div style="height: 70vh">
              <RelatedInfo
                :relevanceNumber="relevanceNumber"
                :data="currentRow"
              ></RelatedInfo>
            </div>
          </el-tab-pane>
          <el-tab-pane label="产品文档" name="productDocumentation">
            <div style="height: 70vh; overflow-y: scroll">
              <ProductInfo
                :relevanceNumber="relevanceNumber"
                :data="currentRow"
              ></ProductInfo>
            </div>
          </el-tab-pane>
          <el-tab-pane label="签署意见" name="signOpinion">
            <div style="height: 70vh; box-sizing: border-box">
              <Signopinion
                :dataDefault="currentTodo"
                @submitTodo="submitTodo"
                :history="false"
                :signType="signType"
              ></Signopinion>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div
          class="buttonList"
          style="top: -10px"
          v-if="activeName === 'toDealWith'"
        >
          <el-button @click="submitReview">提交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type {
  TabsPaneContext,
  ElNotification,
  ElMessage,
  ElMessageBox,
} from "element-plus";
import {
  flowTodoList,
  productFlowCancel,
  flowDoneList,
  productFlowSubmit,
  productFlowItemInfo,
  productFlowAdd,
  getOne,
  updateOne,
  policeRelativeModpolicy,
} from "../../../services/index";
import SelectProduct from "../../../components/selectProduct.vue";
import SelectPolicy from "../../../components/selectPolicy.vue";
import AddFlow from "../../../components/addFlow.vue";
import Parameter from "../../../components/parameter.vue";
import ParameterGroup from "../../../components/parameterGroup.vue";
import RuleStructure from "../../../components/ruleStructure.vue";
import DateTable from "../../../components/dataTable.vue";
import FlowPath from "../../../components/flowPath.vue";
import Processor from "../../../components/processor.vue";
import Interface from "../../../components/interface.vue";
import RelatedInfo from "../../../components/relatedInfo.vue";
import ProductInfo from "../../../components/productInfo.vue";
import Signopinion from "../../../components/signopinion.vue";
const activeName = ref("toDealWith");
const pageSize = ref(10);
const currentPage = ref(1);
const totalNum = ref(null);
const doneTotalNum = ref(null);
const childComponent = ref(null); //组件的数据
const activeTab = ref("policyAllocation"); //tab当前选择
const dataTitle = ref(""); //选择的弹框上方的标题
const componentType = ref(""); //区分组件类型
const policyOperateType = ref(""); //区分政策操作类型
const processType = ref(""); //区分政策操作类型
const taskTyp = ref(""); //任务类型:1-新增政策;2-修订政策;3-停用政策
const objectType = ref(""); //对象类型
const currentRow = ref(); //选择的政策
const treeData = ref([]); //锚点数据
const productId = ref("");
const productName = ref("");
const policyId = ref("");
const policyName = ref("");
const orgPolicId = ref("");
const relevanceNumber = ref(""); //关联编号
const dialogWidth = ref("80%");
const policyForm = ref({
  //政策操作的from
  productId: "", //产品编号
  orgPolicyId: "", //政策编号
  policyId: "", //新政策编号
  operate: "", //补充编号
  remark: "", //备注说明
});
const todoListData = ref([]); //待办列表数据
const doneListData = ref([]); //已处理列表数据
const currentTodo = ref({}); //所选的todo
const componentParams = ref({}); //数据
const addTodoVisible = ref(false); //新增申请的dialog

const operationVisible = ref(false); //右上角操作按钮控制的dialog
const signType = ref(true); //
const editpolicyVisible = ref(false); //关联政策的编辑dialog
const currentFlow = ref({}); //新增申请的dialog
const flowPhase = "2";
const flowPhaseList = {
  "2": "产品岗",
  "3": "风险岗",
  "4": "运营岗",
  "5": "财务岗",
  "6": "系统岗",
};
const taskTypeList = {
  "1": "新增政策",
  "2": "修订政策",
  "3": "停用政策",
};
const user = ref(JSON.parse(window.localStorage.getItem("user")));
// tab选择的变化
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab.props.label, event);
};
const begin = computed(() => {
  return currentPage.value === 1 ? 1 : currentPage.value * pageSize.value + 1;
});
const handleSizeChange = (val: number) => {
  currentPage.value = val;
};
const handlePageChange = (val: number) => {};
const showVisible = computed(() => {
  //右上角三个按钮的控制
  if (user.value.flowPhase === "2") {
    return true;
  } else {
    return false;
  }
});
onMounted(() => {
  getTodoList();
  getDoneList();
});
// 获取待处理数据
const getTodoList = () => {
  flowTodoList(
    begin.value,
    pageSize.value,
    // productId.value,
    // productName.value,
    // policyId.value,
    // policyName.value,
    user.value.flowPhase
  ).then((res) => {
    todoListData.value = res.data.message.list;
    totalNum.value = res.data.message.total;
    console.log("flowTodoList", todoListData.value, totalNum.value);
  });
};
// 获取已处理数据
const getDoneList = () => {
  flowDoneList(
    begin.value,
    pageSize.value,
    // productId.value,
    // productName.value,
    // policyId.value,
    // policyName.value,
    user.value.flowPhase
  ).then((res) => {
    doneListData.value = res.data.message.list;
    doneTotalNum.value = res.data.message.total;
    console.log("flowDoneList", doneListData.value, doneTotalNum.value);
  });
};
// 锚点
const handleNodeClick = (data: any) => {
  console.log("data", data);
  const element = document.getElementById(data.id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" }); // 平滑滚动到元素
  }
};
// 点击政策配置的保存
const submitPolicy = () => {
  console.log("activeName", activeName.value, currentRow.value);
  if (activeTab.value === "policyAllocation") {
    childComponent.value.pushParams();
    currentRow.value.info = { ...componentParams.value };
    console.log(
      relevanceNumber.value,
      currentRow.value.policyId,
      orgPolicId.value,
      currentRow.value
    );
    updateOne({
      message: {
        ...currentRow.value,
      },
    }).then((res) => {
      ElNotification({
        title: "成功",
        message: "政策信息更新成功",
        type: "success",
      });
      console.log("updateOne", res.data);
    });
    // await policeRelativeModpolicy(
    //   relevanceNumber.value,
    //   currentRow.value.policyId,
    //   editItem.value.id,
    //   orgPolicId.value,
    //   currentRow.value
    // ).then(res => {
    //   editpolicyVisible.value = false
    //   // getPoliceRelative(editItem.value.id) //成功之后再次请求查询产品政策的接口
    // })
  }
};
// 点击产品后面的新增
const productSelect = () => {
  addTodoVisible.value = true;
  componentType.value = "product";
  dataTitle.value = "选择产品";
};
// 点击政策后面的新增
const policySelect = () => {
  // if (!policyForm.value.productId) {
  //   ElNotification({
  //     title: '提示',
  //     message: '请选择产品编号',
  //     type: 'warning',
  //   })
  //   return
  // }
  addTodoVisible.value = true;
  componentType.value = "policy";
  dataTitle.value = "选择政策";
};
// 点击确定
const confirm = () => {
  productFlowAdd(
    taskTyp.value,
    objectType.value,
    policyForm.value.orgPolicyId,
    policyForm.value.remark,
    policyForm.value
  ).then((res) => {
    operationVisible.value = false;
    getTodoList();
    getDoneList();
    console.log("productFlowAdd", res.data);
  });
};

// 点击右上角政策操作
const prolicyOperate = (type: string, taskType: string) => {
  policyForm.value = {
    productId: "",
    orgPolicyId: "",
    policyId: "",
    operate: "",
    remark: "",
  };
  operationVisible.value = true;
  policyOperateType.value = type;
  objectType.value = "1";
  taskTyp.value = taskType;
  if (type === "add") {
    processType.value = "新建政策";
  }
  if (type === "edit") {
    processType.value = "修订政策";
  }
  if (type === "stop") {
    processType.value = "停用政策";
  }
};
// 根据类型的不同，匹配不同的组件
const currentCom = (type: any) => {
  if (type === "1") {
    return Parameter;
  } else if (type === "2") {
    return ParameterGroup;
  } else if (type === "3") {
    return DateTable;
  } else if (type === "4") {
    return RuleStructure;
  } else if (type === "5") {
    return FlowPath;
  } else if (type === "7") {
    return Interface;
  } else if (type === "8") {
    return Processor;
  }
};
const getParams = (params: object) => {
  componentParams.value = params;
  console.log("params", componentParams.value);
};
//匹配dialog显示的组件
const currentComponent = (type: string) => {
  if (type === "add") {
    return AddFlow;
  }
  if (type === "opinion") {
    return Signopinion;
  }
  if (type === "product") {
    return SelectProduct;
  }
  if (type === "policy") {
    return SelectPolicy;
  }
};
// 点击弹框右上角的叉号
const beforeClose = () => {
  console.log("beforeClose");
  editpolicyVisible.value = false;
};
// 点击签署意见
const signOpinion = () => {
  if (currentTodo.value.policyId) {
    signType.value = true;
    addTodoVisible.value = true;
    dialogWidth.value = "55%";
    componentType.value = "opinion";
  } else {
    ElNotification({
      title: "提示",
      message: "请选择一条记录",
      type: "warning",
    });
  }
};
// 点击查看意见
const viewOpinion = () => {
  if (currentTodo.value.policyId) {
    signType.value = true;
    addTodoVisible.value = true;
    dialogWidth.value = "50%";
    componentType.value = "opinion";
  } else {
    ElNotification({
      title: "提示",
      message: "请选择一条记录",
      type: "warning",
    });
  }
};
// 点击提交审核
const submitReview = () => {
  if (currentTodo.value.flowInstanceId) {
    productFlowItemInfo(currentTodo.value.flowItemId).then((res) => {
      if (res.data.message.opinion) {
        console.log("productFlowItemInfo", res);
        productFlowSubmit(
          currentTodo.value.flowItemId,
          currentTodo.value.flowInstanceId,
          user.value.flowPhase,
          taskTyp.value
        ).then((res) => {
          getTodoList();
          getDoneList();
          console.log("productFlowSubmit", res);
          ElNotification({
            title: "成功",
            message: "提交成功",
            type: "success",
          });
          editpolicyVisible.value = false;
        });
      } else {
        ElNotification({
          title: "提示",
          message: "请先签署意见，再进行提交审核",
          type: "warning",
        });
      }
    });
  } else {
    ElNotification({
      title: "提示",
      message: "请选择一条记录",
      type: "warning",
    });
  }
};
// 用于产品或者政策选择之后的传参
const submitTodo = (type: string) => {
  console.log("submitTodo", type);
  if (
    componentType.value === "product" &&
    policyForm.value.productId != type &&
    type
  ) {
    policyForm.value.productId = type;
  }
  if (
    componentType.value === "policy" &&
    policyForm.value.orgPolicyId != type &&
    type
  ) {
    policyForm.value.orgPolicyId = type;
  }
  console.log(type, "policyForm.value", policyForm.value);
  addTodoVisible.value = false;
  editpolicyVisible.value = false;
  dialogWidth.value = "70%";
  currentTodo.value = {};
};
// 点击查看
const review = (row: any | undefined) => {
  console.log("review", row);
  getOneDetails(row.objectNo);
  relevanceNumber.value = row.flowItemId;
};
// 点击处理
const dealWith = (row: any | undefined) => {
  activeTab.value = "policyAllocation";
  taskTyp.value = row.taskType;
  console.log("dealWith", row);
  getOneDetails(row.objectNo);
  relevanceNumber.value = row.flowItemId;
};
// 点击取消
const cancelTodo = (row: any | undefined) => {
  console.log("cancelTodo", row);
  ElMessageBox.confirm("是否取消这条记录", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    center: true,
  })
    .then(() => {
      productFlowCancel(row.flowInstanceId).then((res) => {
        ElMessage({
          type: "success",
          message: "取消成功",
        });
        getTodoList();
        getDoneList();
      });
    })
    .catch(() => {});
};
// 获取表格单个数据详情
const getOneDetails = async (id: string) => {
  await getOne(id).then((response) => {
    currentRow.value = response.data.message;
    editpolicyVisible.value = true;
    orgPolicId.value = response.data.message.policyId;
    editpolicyVisible.value = true;
    console.log(response.data.message, "res", "row", currentRow.value);
    let anchorData = [];
    anchorData.push({
      label: currentRow.value.policyName,
      id: currentRow.value.policyId,
      children: [],
    });
    let params = currentRow.value.info?._params;
    if (params?.length && currentRow.value.policyType === "2") {
      for (let i = 0; i < params.length; i++) {
        anchorData[0].children.push({
          label: params[i]._label,
          id: params[i]._id,
          children: [],
        });
      }
    }
    treeData.value = anchorData;
    // console.log('anchorData', anchorData)
  });
};
// 表格选择的改变
const handleChange = (val: any | undefined) => {
  currentTodo.value = val;
};
</script>

<style scoped>
:deep(.el-dialog--center .el-dialog__body) {
  max-height: 80vh; /* 设置最大高度为视口高度的80% */
  overflow-y: auto; /* 当内容超出最大高度时，显示垂直滚动条 */
}
.buttonList {
  position: absolute;
  right: 10px;
  top: 0px;
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
  position: relative;
}
.card-footer {
  padding: 20px 0 2px 0;
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 auto;
}
.componentBox {
  flex: 1;
}
.componentBox::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
:deep(.componentBox .groupItem .el-form-item) {
  margin-bottom: 0px !important;
}
:deep(.el-tree-node__content) {
  height: 30px !important;
}
</style>
