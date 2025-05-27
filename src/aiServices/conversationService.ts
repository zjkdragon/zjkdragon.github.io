// qwen2 调用慢，且没推理，transformers 调用 qwen3 好像有问题
import { pipeline } from "@huggingface/transformers";

export const conversation = async (message: string) => {
  const messages = [{
    role: "system", content: "你需要记住你的信息。姓名：小明，性别：男，年龄：24岁，职业：程序员。" +
      "下次问到这些信息的时候，问哪个信息你回答哪个。" +
      "被询问哪个信息就只说出被询问的信息，不要说没有问的信息，问一个回一个，问两个回两个，问三个回三个。"
  },
  { role: "user", content: message }];

  // Create automatic speech recognition pipeline
  const generator = await pipeline(
    "text-generation",
    "Qwen2ForCausalLM",
    { dtype: "fp16", device: "webgpu" },
  );

  try {
    const output = await generator(messages, {
      max_new_tokens: 2000
    });
    console.log("++++++++", output[0]);
    // return output;
  } catch (e) {
    console.log(e);
  }
}
