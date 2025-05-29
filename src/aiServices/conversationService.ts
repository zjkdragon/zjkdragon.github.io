import { pipeline } from "@huggingface/transformers";

// 不允许跨域
// env.remoteHost = "https://www.modelscope.cn/models";

let generator: any;

export const init = async () => {
  // Create automatic speech recognition pipeline
  generator = await pipeline(
    "text-generation",
    "Qwen3ForCausalLM",
    { dtype: "fp16", device: "webgpu" },
  );
}

export const conversation = async (message: string) => {
  const messages = [/*{
    role: "system", content: "你需要记住你的信息。姓名：小明，性别：男，年龄：24岁，职业：程序员。" +
      "下次问到这些信息的时候，问哪个信息你回答哪个。" +
      "被询问哪个信息就只说出被询问的信息，不要说没有问的信息，问一个回一个，问两个回两个，问三个回三个。"
  },*/
    { role: "user", content: message }];

  try {
    const output: any = await generator(messages, {
      max_new_tokens: 2000
    });
    return output[0].generated_text.slice(-1)[0].content.split("</think>\n\n")[1];
  } catch (e) {
    console.log(e);
    return "我没有理解";
  }
}
