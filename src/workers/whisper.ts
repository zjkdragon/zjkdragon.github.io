import { init, transcribe } from '../aiServices/voiceService';

onmessage = async function(event) {
  console.log(event);
  const { data: { type, data } } = event
  if (type === "init") {
    console.log('call init');
    await init();
    console.log('init end');
  }
  if (type === "whisper") {
    console.log('call whisper', transcribe);
    const result = await transcribe(new Float32Array(data));
    console.log("result:", result);
    self.postMessage({ type: 'whisper-result', data: result });
  }
}
