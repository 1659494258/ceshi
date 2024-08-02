<template>
  <div style="padding-top: 20px">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-button @click="addPolicyRelative" style="font-size: 16px">新增</el-button>
        </div>
      </template>
      <div>
        <el-table
          :data="policyRelativeList"
          height="300"
          style="width: 100%; margin-bottom: 20px"
          row-key="id"
          default-expand-all
        >
          <el-table-column label="关联对象类型" width="">
            <template #default="scope">
              <span v-if="scope.row.objectType === '1'">产品</span>
              <span v-if="scope.row.objectType === '2'">机构</span>
              <span v-if="scope.row.objectType === '3'">产品资料</span>
            </template>
          </el-table-column>
          <el-table-column label="关联类型" width="">
            <template #default="scope">
              <span v-if="scope.row.relativeType === '1'">营销机构</span>
              <span v-if="scope.row.relativeType === '2'">管理机构</span>
            </template>
          </el-table-column>
          <el-table-column prop="relativeId" label="关联对象编号" width="">
            <!-- <template #default="scope">
              <span v-if="scope.row.objectNo === '637582'">机构A</span>
              <span v-if="scope.row.objectNo === '2'">机构B</span>
              <span v-if="scope.row.objectNo === '3'">机构C</span>
              <span v-if="scope.row.objectNo === '4'">机构D</span>
            </template> -->
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="200" />
          <el-table-column prop="remark" label="描述" width="150" />
          <el-table-column label="操作" width="120" align="center">
            <template #default="scope">
              <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.row)">删除</el-button>
              <el-button link type="primary" size="small" @click.prevent="editRow(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
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
    </el-card>
    <!-- <div class="buttonBox">
      <el-button @click="addPolicyRelative" style="font-size: 16px"
        >新增</el-button
      >
    </div> -->
    <el-dialog
      v-model="dialogVisible"
      v-if="dialogVisible"
      title=""
      width="60%"
      align-center
      center
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form :model="currentRow" style="display: flex; flex-wrap: wrap; justify-content: space-between">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="关联对象类型:" class="fromItem">
              <el-select
                v-model="currentRow.objectType"
                placeholder=" "
                filterable
                clearable
                remote
                reserve-keyword
                style="width: 150px"
              >
                <el-option label="产品" value="1" />
                <el-option label="机构" value="2" />
                <el-option label="产品资料" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关联类型:" class="fromItem">
              <el-select
                v-model="currentRow.relativeType"
                placeholder=" "
                filterable
                clearable
                remote
                reserve-keyword
                style="width: 150px"
              >
                <el-option
                  v-for="(item, index) in associationTypeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关联对象编号:" class="fromItem">
              <el-tree-select
                v-model="currentRow.objectNo"
                :data="queryorgTreeList"
                :render-after-expand="false"
                :default-expand-all="true"
                style="width: 240px"
                filterable
                clearable
                remote
                reserve-keyword
                :check-strictly="true"
              />
              <!-- <el-select
                v-model="currentRow.objectNo"
                placeholder=" "
                filterable
                clearable
                remote
                reserve-keyword
                style="width: 150px"
              >
                <el-option
                  v-for="(item, index) in queryorgTreeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, defineProps, computed } from 'vue'
import {
  policeRelativeOne,
  policeRelative,
  policeRelativeAddition,
  policeRelativeRemove,
  policeRelativeMod,
  policeRelativeList,
  queryorgTree,
} from '../services/index'
import { ElTable, ElNotification, ElMessageBox } from 'element-plus'
import codeValue from '../assets/json/codeValue.json'
const props = defineProps(['relevanceNumber', 'data'])
const policyRelativeList = ref([]) //政策的关联信息表
const optionsType = ref('') //用于区分是新增还是编辑
const editItem = ref({}) //用于区分是新增还是编辑
const currentPage = ref(1) //当前是第几页
const pageSize = ref(10) //页面大小
const queryorgTreeList = ref([]) //机构列表
const currentRow = ref({
  objectType: '',
  objectNo: null,
  relativeType: '',
}) //
const totalNum = ref(null) //政策的关联信息表
const dialogVisible = ref(false) //政策的关联信息表
//
const associationTypeList = computed(() => {
  if (currentRow.value.objectType === '1') {
    queryorgTreeList.value = []
    return [
      {
        label: '产品政策',
        value: '1',
      },
    ]
  }
  if (currentRow.value.objectType === '2') {
    queryorgTree().then(res => {
      queryorgTreeList.value = res.data.message.children
    })
    return [
      {
        label: '营销机构',
        value: '1',
      },
      {
        label: '管理机构',
        value: '2',
      },
    ]
  }
  if (currentRow.value.objectType === '3') {
    queryorgTreeList.value = []
    return [
      {
        label: '身份证（国徽）',
        value: '1',
      },
      {
        label: '身份证（头像）',
        value: '2',
      },
    ]
  }
})
const beginFrom = computed(() => {
  if (currentPage.value === 1 || currentPage.value === 0) {
    return 1
  } else {
    return (currentPage.value - 1) * pageSize.value + 1
  }
})
onMounted(() => {
  console.log('props', props.relevanceNumber, props.data)
  getPoliceRelative()
})
// 分页形式获取对应产品下的政策的关联信息列表
const getPoliceRelative = async () => {
  let messge = {
    begin: beginFrom.value,
    pageSize: pageSize.value,
    orderBy: [],
    objectType: '2',
    objectNo: '',
    policyId: props.data.policyId,
    relativeType: '1,2',
  }
  // 确认编辑的时候就可以通过id去查它的关联信息
  await policeRelative(messge).then(response => {
    console.log('policeRelative', response.data.message)
    policyRelativeList.value = response.data.message.list
    totalNum.value = response.data.message.total
  })
}
// 点击新增
const addPolicyRelative = () => {
  optionsType.value = 'add'
  dialogVisible.value = true
  currentRow.value = {
    objectType: '',
    objectNo: '',
    relativeType: '',
  }
}
// 点击确定,新增关联信息
const confirm = () => {
  if (optionsType.value == 'add') {
    console.log(
      'res-policeRelativeAddition',
      currentRow.value.objectNo,
      currentRow.value.objectType,
      currentRow.value.relativeType
    )
    policeRelativeAddition(
      props.data.policyId,
      currentRow.value.objectNo,
      currentRow.value.objectType,
      currentRow.value.relativeType
    ).then(res => {
      console.log('res-policeRelativeAddition', res)
      getPoliceRelative()
      dialogVisible.value = false
    })
  } else {
    policeRelativeMod(
      editItem.value.id,
      props.data.id,
      currentRow.value.objectNo,
      currentRow.value.objectType,
      currentRow.value.relativeType
    ).then(res => {
      console.log('res-policeRelativeAddition', res)
      getPoliceRelative()
      dialogVisible.value = false
    })
  }
}
// 点击删除  目前只做了单个的（接口是支持多个的，用，隔开）
const deleteRow = async (row: object) => {
  console.log('deleteRow', row)
  ElMessageBox.confirm('是否确定删除这条记录', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    center: true,
  })
    .then(() => {
      policeRelativeRemove(row.relativeId).then(res => {
        console.log('policeRelativeRemove', res.data)
        ElNotification({
          title: '成功',
          message: '删除成功',
          type: 'success',
        })
        getPoliceRelative()
      })
    })
    .catch(() => {})
}
// 点击编辑
const editRow = (row: object) => {
  console.log('edit', row)
  optionsType.value = 'edit'
  editItem.value = row
  currentRow.value.objectNo = row.objectNo
  currentRow.value.objectType = row.objectType
  currentRow.value.relativeType = row.relativeType
  dialogVisible.value = true
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
}
const handlePageChange = (val: number) => {
  currentPage.value = val
}
</script>

<style scoped>
.card-footer {
  padding: 20px 0 2px 0;
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 auto;
}
.buttonBox {
  margin-bottom: 10px;
}
.demo-pagination-block {
  display: flex;
  flex-direction: row-reverse;
  padding-top: 10px;
  width: 100%;
}
</style>
