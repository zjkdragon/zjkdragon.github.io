export const recognition = (cb: (result: string) => void) => {
  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = 'zh-CN';
  // recognition.interimResults = true; // 启用中间结果
  recognition.continuous = true; // 启用连续识别

  document.querySelector('#recognition')!.addEventListener('click', async () => {
    console.log('开始录音...');
    recognition.start();
    setTimeout(() => {
      recognition.stop();
    }, 5 * 1000);
  });

  // 语音识别开始时的回调
  recognition.onstart = () => {
    console.log('语音识别已启动。');
  };

  // 语音识别出错时的回调
  recognition.onerror = (event: any) => {
    console.error('语音识别错误:', event.error);
    alert(`语音识别错误: ${event.error}`);
  };

  // 语音识别结束时的回调
  recognition.onend = () => {
    console.log('语音识别已结束。');
  };

  // 语音识别结果时的回调
  recognition.onresult = (event: any) => {
    console.log(event.results[0][0].transcript.trim());
    cb(event.results[0][0].transcript.trim());
  }
}
