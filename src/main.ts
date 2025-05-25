import './style.css'
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

import { run } from './three/three';
import { recognition } from './recognition/recognition';
import { speak } from './speak/speak';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <button id="recognition" type="button">说话</button>
  </div>
`;

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//       <button id="loadModel" type="button">Load Local Model</button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `
//
// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

run();


const selectedModel = "Qwen3-0.6B-q0f16-MLC";
const modelCacheName = "webllm/model";
// const modelConfigCacheName = "webllm/config";
const modelCachePerfix = `/mlc-ai/${selectedModel}/resolve/main`;

(async function() {
  const web_llm = await import("@mlc-ai/web-llm");
  // Callback function to update model loading progress
  const initProgressCallback = (report: any) => {
    console.log("init model: ", report.text);
  }

  // 添加检查缓存模型的函数
  async function checkModelCache() {
    const cache = await caches.open(modelCacheName);
    const response = await cache.match(modelCachePerfix);
    return response ? true : false;
  }

  // const engine = await web_llm.CreateMLCEngine(
  //   selectedModel,
  //   { initProgressCallback: initProgressCallback,
  //    }, // engineConfig
  // );

  const hasCachedModel = await checkModelCache();

  const engineConfig = {
    initProgressCallback: initProgressCallback,
    // 如果有缓存模型，使用缓存路径
    ...(hasCachedModel && { modelLib: modelCachePerfix })
  };

  console.log("start engine");
  const engine = await web_llm.CreateMLCEngine(
    selectedModel,
    engineConfig
  );

  recognition(async (data: string) => {
    const reply0 = await (engine.chat.completions.create({
      messages: [{
        role: "system", content: "你需要记住你的信息。姓名：小明，性别：男，年龄：24岁，职业：程序员。" +
          "下次问到这些信息的时候，问哪个信息你回答哪个。" +
          "被询问哪个信息就只说出被询问的信息，不要说没有问的信息，问一个回一个，问两个回两个，问三个回三个。"
      },
      { role: "user", content: data }],
      // below configurations are all optional
      n: 1,
      temperature: 1,
      max_tokens: 20000,
      logit_bias: {
        "46510": -100,
        "7188": -100,
        "8421": 5,
        "51325": 5,
      },
      logprobs: true,
      top_logprobs: 2,
    }));
    const result = reply0.choices[0].message.content;
    const txt = result?.split("</think>\n\n")[1];
    console.log(txt);
    txt && speak(txt);
    console.log(reply0.usage);
  });
})();

// 添加模型加载按钮事件
// document.getElementById('loadModel')!.addEventListener('click', async () => {
//   const input = document.createElement('input');
//   input.type = 'file';
//   input.multiple = true;  // 添加多选支持
//   input.accept = '.bin,.json,.params,.mlc';
//
//   input.onchange = async (e) => {
//     const files = (e.target as HTMLInputElement).files;
//     if (!files || files.length === 0) return;
//
//     const modelCache = await caches.open(modelCacheName);
//     const configCache = await caches.open(modelConfigCacheName);
//
//     // 处理每个文件
//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const arrayBuffer = await file.arrayBuffer();
//       console.log(`${modelCachePerfix}/${file.name}`);
//       try {
//         if (file.name.endsWith(".json")) {
//           await configCache.put(`${modelCachePerfix}/${file.name}`, new Response(arrayBuffer));
//           console.log(`Config ${file.name} cached successfully`);
//         } else {
//           await modelCache.put(`${modelCachePerfix}/${file.name}`, new Response(arrayBuffer));
//           console.log(`Model ${file.name} cached successfully`);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   };
//
//   input.click();
// });
