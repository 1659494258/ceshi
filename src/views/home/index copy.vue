<template>
  <div class="main">
    <div class="left-item">
      <el-card class="box-card-left">
        <template #header>
          <div class="card-header">
            <img src="../../assets/images/task.png" />
            <h3>我的任务</h3>
          </div>
        </template>
        <div class="demo-collapse">
          <el-collapse accordion v-model="activeNames">
            <el-collapse-item name="1">
              <template #title>
                <h4>
                  贷款申请任务<span style="color: red">{{ loanNumber }}</span
                  >条
                </h4>
              </template>
              <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="customerNumber" label="客户号" />
                <el-table-column prop="name" label="客户名称" />
                <el-table-column prop="product" label="产品名称" />
                <el-table-column prop="account" label="申请金额" />
                <el-table-column prop="date" label="任务生成时间" />
              </el-table>
              <el-link
                type="primary"
                style="float: right; margin-right: 10px"
                @click="toDetail"
                >更多>></el-link
              >
            </el-collapse-item>
            <el-collapse-item name="2">
              <template #title>
                <h4>XX任务</h4>
              </template>
              <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="customerNumber" label="客户号" />
                <el-table-column prop="name" label="客户名称" />
                <el-table-column prop="product" label="产品名称" />
                <el-table-column prop="account" label="申请金额" />
                <el-table-column prop="date" label="任务生成时间" />
              </el-table>
              <el-link type="primary" style="float: right; margin-right: 10px"
                >更多>></el-link
              >
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-card>
    </div>
    <div class="right-item">
      <div class="item">
        <el-collapse accordion>
          <el-card class="box-card-right">
            <el-collapse-item name="1">
              <template #title>
                <img
                  src="../../assets/images/performance.png"
                  style="height: 40px; width: 40px; margin-right: 20px"
                />
                <h3>我的业绩驱蚊器翁</h3>
              </template>
              <div>
                <p class="item">本月贷款受理笔数：30000笔</p>
                <p class="item">本月投放笔数：10笔</p>
                <p class="item">本月投放逾期笔数：20笔</p>
                <p class="item">本月总放款金额：299,000,000人民币</p>
              </div>
            </el-collapse-item>
          </el-card>
          <el-card class="box-card-right">
            <el-collapse-item name="2">
              <template #title>
                <img
                  src="../../assets/images/remind.png"
                  style="height: 40px; width: 40px; margin-right: 20px"
                />
                <h3>我的提醒</h3>
              </template>
              <div>
                <p>
                  <el-link type="primary">营销线索分配提醒</el-link>
                </p>
                <p>
                  <el-link type="primary">营销线索分配提醒</el-link>
                </p>
                <p>
                  <el-link type="primary">营销线索分配提醒</el-link>
                </p>
              </div>
            </el-collapse-item>
          </el-card>
          <el-card class="box-card-right">
            <el-collapse-item name="3">
              <template #title>
                <img
                  src="../../assets/images/notice.png"
                  style="height: 40px; width: 40px; margin-right: 20px"
                />
                <h3>通知中心</h3>
              </template>
              <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="customerNumber" label="客户号" />
                <el-table-column prop="name" label="客户名称" />
              </el-table>
              <el-link type="primary" style="float: right; margin-right: 10px"
                >更多>></el-link
              >
            </el-collapse-item>
          </el-card>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
let activeNames = ref(["1"]);
let loanNumber = ref();
let data = reactive({
  age: 18,
});
let tableData = [
  {
    date: "2016-05-03",
    customerNumber: "123443",
    name: "Tom",
    product: "市民贷",
    path: "189",
  },
  {
    date: "2016-05-02",
    customerNumber: "123448",
    name: "Tom",
    product: "信用付",
    account: "175",
  },
  {
    date: "2016-05-04",
    customerNumber: "123445",
    name: "Tom",
    product: "信用付",
    account: "165",
  },
  {
    date: "2016-05-01",
    customerNumber: "123442",
    name: "Tom",
    product: "信用付",
    account: "180",
  },
];

let toDetail = () => {
  console.log(loanNumber.value);
  // 在这里进行跳转到指定的页面需要携带的东西
};
onMounted(() => {
  window.sessionStorage.clear();
  window.localStorage.clear();
  loanNumber.value = tableData.length;
  // window.parent.postMessage('message', '这是传递的信息')
});
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 95%;
  padding: 10px 80px 0;
  background-color: #f9f9f9;
  .left-item {
    display: block;
    height: 91%;
    width: 50%;
  }
  .right-item {
    height: 91%;
    width: 42%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .right-item::-webkit-scrollbar {
    display: none;
  }
}
:deep(.el-collapse) {
  max-height: 100%;
  width: 100%;
  overflow-y: scroll;
  .el-collapse-item {
    max-height: 30%;
    padding-left: 10px;
  }
}
:deep(.el-card__header) {
  padding: 10px;
}
:deep(.el-card__body) {
  height: 80%;
  padding: 15px 15px;
  overflow-y: scroll;
}
:deep(.el-collapse-item__content) {
  padding: 10px 0;
}
:deep(.el-card__body)::-webkit-scrollbar,
:deep(.el-collapse)::-webkit-scrollbar {
  display: none;
}
.card-header {
  display: flex;
  align-items: center;

  // font-weight: bold;
  img {
    height: 40px;
    width: 40px;
    margin-right: 20px;
  }
}

.text {
  font-size: 14px;
}

.box-card-left {
  width: 100%;
  height: 100%;
  border-radius: 15px;
}
.box-card-right {
  width: 100%;
  max-height: 60%;
  border-radius: 15px;
  margin: 40px 0;
}
.item {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  :deep(.el-collapse) {
    height: 100%;
    width: 80%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
}

.box-card {
  width: 100%;
  border-radius: 15px;
  a {
    color: #0d4ff7;
    text-decoration: underline;
  }
}
</style>
