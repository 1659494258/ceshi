<template>节点</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
const props = defineProps(['dataDefault'])
const data = ref({
  ...props.dataDefault.data,
})
onMounted(() => {
  console.log(data.value)
})
</script>

<style lang="scss">
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
