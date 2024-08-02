import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/************************************* 路径配置 start ********************************/
import { resolve } from 'path'
// 自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
const pathResolve = (dir: string): any => {
  return resolve(__dirname, ".", dir)
}

const alias: Record<string, string> = {
  '@': pathResolve("src")
}
/************************************* 路径配置 end ********************************/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {  // ****************** 路径配置新增
    alias
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/config': {
        target: 'http://10.2.65.205:9202/',
        // target: 'http://192.168.66.16:9200/',
        // target: 'http://192.168.66.122:9202/',
        changeOrigin: true,
        secure: false, // 请求是否为https
      },
      '/system': {
        target: 'http://10.2.65.205:9202/',
        // target: 'http://192.168.66.16:9200/',
        changeOrigin: true,
        secure: false, // 请求是否为https
      },
    },
  },
})


