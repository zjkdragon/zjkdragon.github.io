import { pipeline } from '@huggingface/transformers';

// 初始化 TTS pipeline
let tts: any = null;

export async function init() {
  tts = await pipeline('text-to-speech', 'suno/bark');
}

export async function speak(text: string) {
  // 合成语音
  const audio = await tts(text, { voice_preset: 'v2/en_speaker_6' });
  // 播放音频
  const audioContext = new AudioContext();
  const buffer = await audio.arrayBuffer();
  const decoded = await audioContext.decodeAudioData(buffer);
  const source = audioContext.createBufferSource();
  source.buffer = decoded;
  source.connect(audioContext.destination);
  source.start();
}