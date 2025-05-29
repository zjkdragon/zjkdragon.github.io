import WhisperWorker from '../workers/whisper?worker';

const whisperWorker = new WhisperWorker();
whisperWorker.postMessage({ type: "init" });

const whisperAudio = async (data: Blob) => {
  async function convertAudio(blob: Blob) {
    const audioContext = new AudioContext({ sampleRate: 16000 });
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // 转换为单声道
    const channel = audioBuffer.getChannelData(0);
    return Float32Array.from(channel);
  }
  const d1 = await convertAudio(data);
  const audioBuffer = d1.buffer;
  whisperWorker.postMessage({ type: 'whisper', data: audioBuffer }, [audioBuffer]);
}

export const recognition = (cb: (text: string) => void) => {
  whisperWorker.onmessage = (event) => {
    const { data: { type, data } } = event;
    if (type === "whisper-result") {
      cb(data.text);
    }
  }

  let mediaRecorder: MediaRecorder;
  let audioChunks: Blob[] = [];

  document.querySelector('#recognition')!.addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);

      console.log('开始录音...');

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        whisperAudio(audioBlob);
        audioChunks = [];
      };

      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
      }, 5 * 1000);

    } catch (error) {
      console.error('录音错误:', error);
      alert(`录音错误: ${error}`);
    }
  });
}
