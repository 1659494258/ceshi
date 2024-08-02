<template>
  <div class="main_view">
    <div class="main_header">
      <div class="header_item">
        <span class="item_label">名字：</span>
        <el-input v-model="propsData._label" style="width: 140px" clearable />
      </div>
      <div class="header_item">
        <span class="item_label">继承自：</span>
        <el-select
          v-model="propsData._extends"
          multiple
          size="large"
          placeholder="选择同类型政策"
          style="width: 150px"
          filterable
          clearable
          remote
          reserve-keyword
        >
          <el-option v-for="(ite, ind) in tableData" :label="ite.policyName" :value="ite.id" :key="ind" />
          <!-- <el-option label="业务活动" value="业务活动" />
          <el-option label="其他配置" value="其他配置" /> -->
        </el-select>
      </div>
      <div class="header_item">
        <span class="item_label">所属服务编号：</span>
        <el-input v-model="propsData._serviceId" style="width: 150px" clearable />
      </div>
      <div class="header_item">
        <span class="item_label">流程引擎中的引擎编号：</span>
        <el-input v-model="propsData._external" style="width: 150px" clearable />
      </div>
    </div>
    <div class="main_conent">
      <el-tabs type="border-card">
        <el-tab-pane label="流程定义">
          <div style="max-height: 550px">
            <img src="../assets/images/processor.jpg" style="width: 100%; height: auto" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="节点定义">
          <div style="max-height: 550px; overflow-y: scroll">
            <el-table :data="nodeData" style="width: 100%" :row-class-name="getRowClass" :highlight-current-row="true">
              <!-- default-expand-all -->
              <el-table-column type="expand" style="display: flex; align-items: center; justify-content: space-around">
                <template #default="props">
                  <!-- 引入处理器类型参数 -->
                  <p class="itemTitle" style="display: flex; align-items: center">
                    <span>引入处理器类型参数：</span>
                    <el-icon size="18px" style="margin-left: 10px" @click.stop="addProcessor(props.$index, props.row)">
                      <Plus />
                    </el-icon>
                  </p>
                  <ProcessorParams
                    v-if="props.row._processor.length"
                    :dataDefault="props.row._processor"
                  ></ProcessorParams>
                  <!-- 重试 -->
                  <p class="itemTitle">
                    重试：
                    <el-input v-model="props.row._retry" style="width: 150px" />
                  </p>
                  <!-- 重复 -->
                  <p class="itemTitle">
                    重复：
                    <el-input v-model="props.row._repeat" style="width: 150px" />
                  </p>
                  <div class="itemTitle">
                    <p>引入流程节点类型参数：</p>
                    <div
                      style="
                        width: 98%;
                        display: flex;
                        align-items: center;
                        justify-content: space-around;
                        border-radius: 5px;
                        margin: 10px;
                        border: 1px solid #e4e7ed;
                        box-sizing: border-box;
                      "
                    >
                      <el-table :data="props._router" style="width: 97%">
                        <el-table-column label="名字">
                          <template #default="scope">启用</template>
                        </el-table-column>
                        <el-table-column label="类型">
                          <template #default="scope">人工</template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column prop="_label" label="名字" align="center" />
              <el-table-column label="状态">
                <template #default="scope">启用</template>
              </el-table-column>
              <el-table-column label="节点类型">
                <template #default="scope">人工</template>
              </el-table-column>
              <!-- <el-table-column prop="status" label="状态" align="center" />
              <el-table-column prop="operator" label="岗位" align="center" />
              <el-table-column prop="nodeType" label="节点类型" align="center" /> -->
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- dialog弹出框 -->
    <el-dialog
      v-model="centerDialogVisible"
      v-if="centerDialogVisible"
      title=""
      width="60%"
      align-center
      center
      :append-to-body="true"
    >
      <div style="">
        <el-table
          ref="multipleTableRef"
          :data="tableList"
          highlight-current-row
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column property="id" label="编号" />
          <el-table-column property="name" label="名称" />
        </el-table>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAdd">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, defineExpose } from 'vue'
import { getList } from '../services/index'
import { ElTable } from 'element-plus'
const emit = defineEmits(['getParams'])
import Parameter from './parameter.vue'
import ParameterGroup from './parameterGroup.vue'
import RuleStructure from './ruleStructure.vue'
import ProcessorParams from './processorParams.vue'
import FlowPath from './flowPath.vue'
const props = defineProps(['dataDefault'])
const propsData = ref({
  ...props.dataDefault,
})
const user = ref(JSON.parse(window.localStorage.getItem('user')))
// 所有节点集合的对象
const nodesList = ref({
  ...propsData.value._nodes,
})
const addNodeKey = ref('') //添加处理器的节点，在nodesList里面的key
const addNodeValue = ref({}) //添加处理器的节点，在nodesList里面的value
// 节点对应的table数据
const nodeData = computed(() => {
  let header = []
  for (const key in nodesList.value) {
    header.push({
      ...nodesList.value[key],
    })
  }
  return header
})

const tableData = ref([]) //所选继承的同类型的选项
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref([])
const tableList = ref([]) //参数的集合
const centerDialogVisible = ref(false) //控制dialog的显示与隐藏
const handleSelectionChange = (val: any) => {
  console.log('val', val)
  multipleSelection.value = val
}
// 返回数据
const pushParams = () => {
  // returnControl()
  let keyList = Object.keys(nodesList.value)
  for (let index = 0; index < nodeData.value.length; index++) {
    nodesList.value[keyList[index]] = nodeData.value[index]
  }
  propsData.value._nodes = nodesList.value
  console.log('nodesList', nodesList.value, 'propsData', propsData.value, 'nodedata', nodeData.value)

  emit('getParams', {
    ...propsData.value,
  })
}
defineExpose({
  pushParams,
})
onMounted(() => {
  getFormList()
  getProcessorList()
  console.log(
    props,
    'nodeData-prop',
    nodeData.value,
    tableData.value.map((_, index) => index.toString())
  )
})
// 获取处理器表格数据
const getProcessorList = () => {
  let params = {
    message: {
      policyId: '',
      policyGroup: '',
      policyType: '7,8',
      orgId: user.orgId,
      status: '',
      roles: [],
    },
  }
  getList(params).then(response => {
    tableList.value = response.data.message.list
  })
}
// 点击确定，锁定添加的节点
const confirmAdd = () => {
  multipleSelection.value.forEach(item => {
    let params = { ...item.info }
    params._id = item.id
    nodesList.value[addNodeKey.value]._processor.push(params)
    // nodesList.value[addNodeKey.value]._processor[item.id] = { ...item.info }
  })

  centerDialogVisible.value = false
  console.log('multipleSelection.value', multipleSelection.value, nodesList.value[addNodeKey.value])
}

// 获取表格数据
const getFormList = () => {
  let params = {
    message: {
      policyId: '',
      policyGroup: '',
      policyType: '5',
      orgId: user.orgId,
      status: '',
      roles: [],
    },
  }
  getList(params).then(response => {
    tableData.value = response.data.message.list
  })
}

const currentComponent = (type: any) => {
  if (type === '1') {
    return ParameterGroup
  } else if (type === '2') {
    return Parameter
  } else if (type === '3') {
    return RuleStructure
  } else if (type === '5') {
    return FlowPath
  }
}
// 动态显示是否有展示的按钮
const getRowClass = (row: any) => {
  if (!Object.keys(row.row._processor).length) {
    return 'row-expand-cover'
  }
}
//
const addProcessor = (index: number, row: any) => {
  let arrayList = Object.keys(nodesList.value)
  addNodeKey.value = Object.keys(nodesList.value)[index]
  addNodeValue.value = nodesList.value[Object.keys(nodesList.value)[index]]
  console.log('add', index, row, addNodeKey.value, addNodeValue.value)
  centerDialogVisible.value = true
}
</script>

<style scoped>
/* 滚动条整体样式 */
::-webkit-scrollbar {
  width: 0px; /* 滚动条的宽度 */
}
:deep(.el-dialog--center .el-dialog__body) {
  max-height: 70vh; /* 设置最大高度为视口高度的80% */
  overflow-y: auto; /* 当内容超出最大高度时，显示垂直滚动条 */
}
.main_view {
  /* height: 90%; */
  border-radius: 8px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.08), -1px -1px 1px 1px rgba(0, 0, 0, 0.08);
  padding: 10px;
  box-sizing: border-box;
  margin: 10px 0;
  width: 100%;
  box-sizing: border-box;
}
.itemTitle {
  padding-left: 10px;
}
:deep(.el-table .row-expand-cover .cell .el-table__expand-icon) {
  display: none;
}
.main_header {
  margin-bottom: 10px;
}
.header_item {
  display: inline-block;
  margin: 0 5px;
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
