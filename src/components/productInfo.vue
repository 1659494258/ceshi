<template>
  <div style="padding-top: 20px; display: flex; flex-wrap: wrap">
    <el-card
      style="width: 23.5%; height: 272px; margin: 0 10px 5px 0; position: relative"
      v-for="(item, index) in policyRelativeList"
      :key="index"
    >
      <template #header>
        <div style="position: relative">
          <span>{{ item.remark }}</span>
          <el-button
            type="danger"
            :icon="Delete"
            size="small"
            circle
            style="position: absolute; top: -15px; right: -15px"
            @click="deleteRow(item)"
          />
        </div>
      </template>
      <p>{{ item.remark }}</p>
      <div class="card-footer">
        <p>{{ item.createUserId }}-{{ item.createTime }}</p>
        <el-button link type="primary" @click="downloadItem(item.objectNo)">下载</el-button>
      </div>
    </el-card>
    <el-card>
      <el-upload
        class=""
        ref="upload"
        drag
        action=""
        :http-request="handleUpload"
        :auto-upload="false"
        :limit="1"
        style=""
        :on-success="handleAvatarSuccess"
        :on-exceed="handleExceed"
        :before-upload="beforeUpload"
        @change="handleFileChange"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          通过点击或者拖拽
          <em>选择文件</em>
        </div>
      </el-upload>
      <div style="display: flex; align-items: center">
        <el-input v-model="describe" placeholder=" 请输入描述" clearable style="width: 145px; margin-right: 5px" />
        <el-button type="primary" @click="submitFiles">点击上传</el-button>
      </div>
    </el-card>
    <div style=""></div>

    <div>
      <!-- <el-table
        :data="policyRelativeList"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        default-expand-all
      >
        <el-table-column label="关联对象类型">
          <template #default="scope">
            <span v-if="scope.row.objectType === '1'">产品</span>
            <span v-if="scope.row.objectType === '2'">机构</span>
            <span v-if="scope.row.objectType === '3'">产品资料</span>
          </template>
        </el-table-column>
        <el-table-column label="关联类型">
          <template #default="scope">
            <span v-if="scope.row.relativeType === '1'">身份证（国徽）</span>
            <span v-if="scope.row.relativeType === '2'">身份证（头像）</span>
          </template>
        </el-table-column>
        <el-table-column label="关联对象编号">
          <template #default="scope">
            <span v-if="scope.row.objectNo === '1'">产品介绍资料</span>
            <span v-if="scope.row.objectNo === '2'">产品营销资料</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="deleteRow(scope.row)"
              >删除</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="editRow(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table> -->
      <!-- 分页 -->
      <!-- <div class="demo-pagination-block">
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
      </div> -->
    </div>
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
  policeRelativeDocList,
  policeRelative,
  policeRelativeAddition,
  policeRelativeRemove,
  policeRelativeMod,
  policeAttachmentDownload,
} from '../services/index'
import { ElNotification, ElUpload, ElMessage, genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import axios from 'axios'
import codeValue from '../assets/json/codeValue.json'
const props = defineProps(['relevanceNumber', 'data'])
const policyRelativeList = ref([]) //政策的关联信息表
const optionsType = ref('') //用于区分是新增还是编辑
const describe = ref('') //添加时候的描述
const currentFile = ref<File | null>(null) //添加时候的文件
const editItem = ref({}) //用于区分是新增还是编辑
const currentRow = ref({
  objectType: '',
  objectNo: '',
  relativeType: '',
}) //
const currentPage = ref(1) //当前是第几页
const pageSize = ref(10) //页面大小
const totalNum = ref(null) //政策的关联信息表
const dialogVisible = ref(false) //政策的关联信息表
let formData = new FormData()
const service = axios.create({
  baseURL: '/config/',
  timeout: 5000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})
const upload = ref<UploadInstance>()

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
const handleFileChange = (file: File | Blob, fileList: FileList) => {
  if (fileList.length > 0) {
    currentFile.value = fileList[0] as File // 获取用户选择的第一个文件
    console.log('文件已选择:', currentFile.value)
  } else {
    currentFile.value = null // 如果没有选择文件，则清空 selectedFile
    console.log('没有选择文件')
  }
}
const handleExceed: UploadProps['onExceed'] = files => {
  console.log('files', files)
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}
const beforeUpload = (file: File) => {
  formData.append('attachment', file)
  handleUpload(file)
  return false
}
const submitFiles = () => {
  if (currentFile.value) {
    if (describe.value) {
      formData.append('remark', describe.value)
      formData.append('policyId', props.data.policyId)
      upload.value!.submit()
    } else {
      ElNotification({
        title: '提示',
        message: '文件描述不能为空',
        type: 'warning',
      })
    }
  } else {
    console.log('currentFile', currentFile.value)
    ElNotification({
      title: '提示',
      message: '请选择要上传的文件',
      type: 'warning',
    })
  }
}
// 上传
const handleUpload = async (file: File) => {
  try {
    const headers = {
      'User-id': 'admin',
      'Org-id': '1000',
    }
    console.log('attachment', file, 'formData', formData)
    const response = await service.post('policy/relative/doc/add', formData, {
      headers,
    })
    getPoliceRelative()
    // ElMessage.success("数据解析成功");
    // dataParsingList.value = response.data.message.list;
    // dataVisible.value = true;
    console.log('response.data', response.data)
  } catch (error) {
    ElMessage.error('发生错误')
  }
}
// 分页形式获取对应产品下的政策的关联信息列表
const getPoliceRelative = async () => {
  let messge = {
    policyId: props.data.policyId,
  }
  // 确认编辑的时候就可以通过id去查它的关联信息
  await policeRelativeDocList(props.data.policyId).then(response => {
    console.log('policeRelativeDocList', response.data.message)
    policyRelativeList.value = response.data.message.list
    // totalNum.value = response.data.message.total;
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
      props.data.policyId,
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
  await policeRelativeRemove(row.relativeId).then(res => {
    console.log('policeRelativeRemove', res.data)
    getPoliceRelative()
  })
}
// 点击下载
const downloadItem = async (row: string) => {
  console.log('downloadItem', row)
  await policeAttachmentDownload(row).then(res => {
    console.log(
      'policeAttachmentDownload',
      res,
      res.headers['content-disposition'].slice(22).substring(0, res.headers['content-disposition'].slice(22).length - 1)
    )
    const blob = new Blob([res.data], {
      type: 'application/octet-stream',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = res.headers['content-disposition']
      .slice(22)
      .substring(0, res.headers['content-disposition'].slice(22).length - 1) // 设置文件名和扩展名
    a.click()
    URL.revokeObjectURL(url) // 释放URL对象
  })
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
  /* border-top: 1px solid #e4e7ed; */
  width: 86%;
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
