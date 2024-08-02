<template>
  <!-- 签署意见 -->
  <div style="position: relative; width: 100%; height: 100%">
    <div style="">
      <el-card v-if="props.history || historyOpinion">
        <template #header>历史意见：</template>
        <el-table :data="historyData" ref="singleTableRef" highlight-current-row style="width: 90%; margin: 0 auto">
          <el-table-column type="index" label="序号" width="55" />
          <el-table-column prop="flowInstanceId" label="流程实例编号" />
          <!-- <el-table-column prop="opinion" label="意见" width="60" /> -->
          <el-table-column label="意见" width="100">
            <template #default="scope">
              <span v-if="scope.row.opinion === '1'">同意</span>
              <span v-if="scope.row.opinion === '0'">否决</span>
              <span v-if="scope.row.opinion === '2'">退回上一步</span>
            </template>
          </el-table-column>
          <el-table-column prop="detail" label="说明" width="200" />
        </el-table>
      </el-card>
    </div>
    <div class="fromBox">
      <el-card>
        <div class="boxItem">
          <span>意见:</span>
          <el-radio-group v-model="opinionItem.opinion">
            <el-radio :label="'1'">同意</el-radio>
            <el-radio :label="'0'">否决</el-radio>
            <el-radio :label="'2'" v-if="user.roleType != '1'">退回上一步</el-radio>
          </el-radio-group>
        </div>
        <div class="boxItem">
          <span>说明:</span>
          <el-input v-model="opinionItem.detail" placeholder=" " type="textarea" clearable style="width: 250px" />
        </div>
      </el-card>
    </div>
    <div class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
    <!-- <div style="width: 25%; margin: 0 auto">
      <el-form :model="opinionItem" label-width="auto">
        <el-form-item label="意见:" class="fromItem">
          <el-radio-group v-model="opinionItem.opinion">
            <el-radio :label="'1'">同意</el-radio>
            <el-radio :label="'0'">否决</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="说明:" class="fromItem">
          <el-input v-model="opinionItem.detail" placeholder=" " type="textarea" clearable style="width: 250px" />
        </el-form-item>
      </el-form>

    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { productFlowItemInfo, productFlowItemMod, productFlowItemList } from '../services/index'
import { ElTable, ElNotification, ElMessage } from 'element-plus'
import codeValue from '../assets/json/codeValue.json'
const props = defineProps(['dataDefault', 'history', 'signType'])
const emit = defineEmits(['submitTodo'])
const tableData = ref([]) //产品的数据
const historyData = ref([]) //历史意见
const policyRelativeList = ref([]) //产品对应政策的数据
const editingRow = ref(null)
const opinionItem = ref({
  opinion: null,
  detail: '',
})
let user = JSON.parse(window.localStorage.getItem('user'))
const historyOpinion = computed(() => {
  if (user.flowPhase != '2') {
    return true
  } else {
    return false
  }
})
onMounted(() => {
  console.log('props', props)
})
const getCurrentOpinion = () => {
  productFlowItemInfo(props.dataDefault.flowItemId).then(res => {
    opinionItem.value = res.data.message
    console.log('opinionItem', opinionItem.value)
    // opinionItem.value.detail = res.data.message.detail
  })
  // 历史意见
  productFlowItemList(props.dataDefault.flowInstanceId).then(res => {
    let list = res.data.message.filter(
      item => !(item.flowPhase == '1' || item.flowPhase == props.dataDefault.flowPhase)
    )
    historyData.value = list
    console.log(list, 'productFlowItemList', res.data.message)
  })
}
getCurrentOpinion()

const submit = () => {
  console.log('submit', opinionItem.value, props.signType)
  if (props.signType) {
    productFlowItemMod(
      opinionItem.value.id,
      opinionItem.value.flowInstanceId,
      opinionItem.value.opinion,
      opinionItem.value.detail,
      opinionItem.value.flowPhase
    ).then(res => {
      console.log('productFlowItemMod', res.data)
      getCurrentOpinion()
      emit('submitTodo', '')
    })
  } else {
    emit('submitTodo', '')
  }
}
const cancel = () => {
  emit('submitTodo', 'cancel')
}
</script>

<style scoped>
.fromBox {
  margin-top: 10px;
}
.boxItem {
  display: flex;
  align-items: center;
  margin: 10px 0;
}
.boxItem span {
  margin-right: 10px;
}
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
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, 0%);
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
