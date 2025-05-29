import { pipeline } from "@huggingface/transformers";

// 不允许跨域
// env.remoteHost = "https://hf-mirror.com";

let transcriber: any;

export const init = async () => {
  // Create automatic speech recognition pipeline
  transcriber = await pipeline(
    "automatic-speech-recognition",
    "WhisperForConditionalGeneration",
    { device: "webgpu" },
  );
}

export const transcribe = async (audio: Float32Array): Promise<any> => {
  // Transcribe audio from a URL
  //const url = "https://img.tukuppt.com/ai_audio/wav/zhida.wav";
  const output = await transcriber(audio, {
    language: 'chinese', // 指定目标语言
    task: 'transcribe', //1 指定任务类型
    chunk_length_s: 30, // 分块处理长音频
    stride_length_s: 5, //设置步长
    generation_kwargs: {
      prompt: "以下是普通话的句子，输出的时候请带上标点符号。切记！"
    }
  });
  console.log(output);
  return output;
}
