import './style.css'

import { run } from './three/three';
import { recognition } from './recognition/record';
import { conversation } from './conversation/qwen3';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <button id="recognition" type="button">对话</button>
    <button id="loadModel" type="button">模型</button>
  </div>
`;

run();

(async function() {
  recognition(conversation);
})();

// 添加模型加载按钮事件
document.getElementById('loadModel')!.addEventListener('click', async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.webkitdirectory = true;  // 启用文件夹选择
  input.multiple = false;  // 添加多选支持
  input.accept = '.bin,.json,.params,.mlc,.onnx';

  input.onchange = async (e) => {
    const files = (e.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;

    const modelCache = await caches.open("transformers-cache");

    let folderPath = "";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.name === "config.json") {
        // 读取 json 文件内容
        const jsonContent = await file.text();
        const json = JSON.parse(jsonContent);
        folderPath = json.architectures;
        break;
      }
    }

    if (!folderPath) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // 路径处理
      const subPath = file.webkitRelativePath.replace(/^.*?\//, "");
      if (subPath.startsWith(".") || file.name.startsWith(".")) continue;

      const relativePath = `${folderPath}/resolve/main/${subPath}`;
      console.log(`处理文件: ${relativePath} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

      try {
        // 完全使用流式API处理
        const stream = file.stream();

        // 创建新的Response对象（使用流而不是Blob）
        const response = new Response(stream, {
          headers: {
            'Content-Type': file.type,
            'Content-Length': file.size.toString()
          }
        });

        // 尝试放入缓存
        await modelCache.put(relativePath, response);
        console.log(`✅ Model ${file.name} 缓存成功`);

      } catch (error: any) {
        console.error(`❌ 文件处理失败: ${file.name}`, error);

        // 增强错误处理
        if (error.name === 'QuotaExceededError') {
          console.error('存储配额不足，请清理缓存');
        } else if (error.message.includes('internal error')) {
          console.error('浏览器内部错误，尝试分片缓存方案...');
        }
      }
    }
  };

  input.click();
});
