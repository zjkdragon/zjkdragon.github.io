import { defineConfig } from 'vite'
// import legacy from '@vitejs/plugin-legacy'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    // legacy({
    //   targets: ['defaults', 'not IE 11']
    // }),
    VitePWA({
      includeAssets: ['favicon.svg'],
      manifest: false,
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 1200000000000000,
        runtimeCaching: [
          // {
          //   urlPattern: /(.*?)\.(html)/, // 接口缓存 此处填你想缓存的接口正则匹配
          //   handler: 'NetworkFirst',
          // },
          // 添加模型缓存路径
          {
            urlPattern: /.*?(\/mlc-ai\/Qwen3-0.6B-q0f16-MLC\/resolve\/main\/.*?\.bin)/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'webllm/model',
              plugins: [
                {
                  // 确保优先返回手动写入的缓存
                  cachedResponseWillBeUsed: async ({ request, cachedResponse }) => {
                    const customCache = await caches.open('webllm/model');
                    const response = await customCache.match(request.url.match(/.*?(\/mlc-ai\/Qwen3-0.6B-q0f16-MLC\/resolve\/main\/.*?\.bin)/)[1]);
                    return response || cachedResponse;
                  },
                },
              ],
            }
          },
          {
            urlPattern: /.*?(\/mlc-ai\/Qwen3-0.6B-q0f16-MLC\/resolve\/main\/.*?\.json)/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'webllm/config',
              plugins: [
                {
                  // 确保优先返回手动写入的缓存
                  cachedResponseWillBeUsed: async ({ request, cachedResponse }) => {
                    const customCache = await caches.open('webllm/config');
                    const response = await customCache.match(request.url.match(/.*?(\/mlc-ai\/Qwen3-0.6B-q0f16-MLC\/resolve\/main\/.*?\.json)/)[1]);
                    return response || cachedResponse;
                  },
                },
              ],
            }
          },
          {
            urlPattern: /https:\/\/huggingface.co.*?(\/resolve\/main\/.*?\.(json|onnx|bin))/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'transformers-cache',
              plugins: [
                {
                  // 确保优先返回手动写入的缓存
                  cachedResponseWillBeUsed: async ({ request, cachedResponse }) => {
                    const customCache = await caches.open('transformers-cache');
                    const response = await customCache.match(request.url.match(/https:\/\/huggingface.co(.*?\/resolve\/main\/.*?\.(json|onnx|bin))/)[1]);
                    console.log(response);
                    return response || cachedResponse;
                  },
                },
              ],
            }
          },
        ]
      }
    }),
  ],
  build: {
    outDir: 'docs',
    target: 'es2020'
  },
  base: './'
})
