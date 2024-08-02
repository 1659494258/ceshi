import { ref, watch } from "vue";

export default function (key: string, value: any) {
  let data: any = ref(value);
  if (value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  } else {
    data.value = JSON.parse(window.localStorage.getItem(key) || ""); //判断一下不为空
  }
  watch(data, (newValue) => {
    window.localStorage.setItem(key, JSON.stringify(newValue));
  });
}
