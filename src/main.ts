import './style.css'
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

import { run } from './three/three';
import { recognition } from './recognition/record';
import { conversation } from './conversation/qwen3';
// import { speak } from './speak/speak';
// import { transcribe } from './voiceService';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <button id="recognition" type="button">说话2</button>
    <button id="loadModel" type="button">模型</button>
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


// const modelCacheName = "webllm/model";
// const modelConfigCacheName = "webllm/config";
// const modelCachePerfix = "";

(async function() {
  recognition(conversation);
})();
(async function() {



  console.log("start engine");

  recognition(console.log);
    // const reply0 = await (engine.chat.completions.create({
    //   messages: [{
    //     role: "system", content: "你需要记住你的信息。姓名：小明，性别：男，年龄：24岁，职业：程序员。" +
    //       "下次问到这些信息的时候，问哪个信息你回答哪个。" +
    //       "被询问哪个信息就只说出被询问的信息，不要说没有问的信息，问一个回一个，问两个回两个，问三个回三个。"
    //   },
    //   { role: "user", content: d2.text }],
    //   // below configurations are all optional
    //   n: 1,
    //   temperature: 1,
    //   max_tokens: 20000,
    //   logit_bias: {
    //     "46510": -100,
    //     "7188": -100,
    //     "8421": 5,
    //     "51325": 5,
    //   },
    //   logprobs: true,
    //   top_logprobs: 2,
    // }));
    // const result = reply0.choices[0].message.content;
    // const txt = result?.split("</think>\n\n")[1];
    // console.log(txt);
    // txt && speak(txt);
    // console.log(reply0.usage);
  // });
});

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

    // 处理每个文件
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // 路径处理
      const subPath = file.webkitRelativePath.replace(/^.*?\//, "");
      debugger;
      if (subPath.startsWith(".") || file.name.startsWith(".")) continue;

      const relativePath = `${folderPath}/resolve/main/${subPath}`
      console.log(`处理文件: ${relativePath}`);

      try {
        const arrayBuffer = await file.arrayBuffer();
        await modelCache.put(relativePath, new Response(arrayBuffer));
        console.log(`Model ${file.name} cached successfully`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  input.click();
});
