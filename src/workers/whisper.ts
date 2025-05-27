import { transcribe } from '../aiServices/voiceService';

onmessage = async function(event) {
  console.log(event);
  const { data: { type, data } } = event
  if (type === "whisper") {
    const result = await transcribe(new Float32Array(data));
    self.postMessage({ type: 'whisper-result', data: result });
  }
}
