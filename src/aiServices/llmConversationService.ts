import * as web_llm from '@mlc-ai/web-llm';

// Callback function to update model loading progress
const initProgressCallback = (report: any) => {
  console.log("init model: ", report.text);
}

let engine: any;
(async () => {
  engine = await web_llm.CreateMLCEngine(
    "Qwen3-0.6B-q0f16-MLC",
    {
      initProgressCallback: initProgressCallback,
    }, // engineConfig
  );
})();

//添加检查缓存模型的函数
// async function checkModelCache() {
//   const cache = await caches.open(modelCacheName);
//   const response = await cache.match(modelCachePerfix);
//   return response ? true : false;
// }

// const hasCachedModel = await checkModelCache();

// const engineConfig = {
//   initProgressCallback: initProgressCallback,
//   // 如果有缓存模型，使用缓存路径
//   ...(hasCachedModel && { modelLib: modelCachePerfix })
// };

// const engine = await web_llm.CreateMLCEngine(
//   "Qwen3-0.6B-q0f16-MLC",
//   engineConfig
// );

export const conversation = async (message: string) => {

  const reply0 = await (engine.chat.completions.create({
    messages: [{
      role: "system", content: "你需要记住你的信息。姓名：小明，性别：男，年龄：24岁，职业：程序员。" +
        "下次问到这些信息的时候，问哪个信息你回答哪个。" +
        "被询问哪个信息就只说出被询问的信息，不要说没有问的信息，问一个回一个，问两个回两个，问三个回三个。"
    },
    { role: "user", content: message }],
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
  const text = result?.split("</think>\n\n")[1];
  console.log(reply0.usage);
  return text;
}
