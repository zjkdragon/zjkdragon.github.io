import { conversation, init } from '../aiServices/ollamaService';

onmessage = async function(event) {
  console.log(event);
  const { data: { type, data } } = event
  if (type === "init") {
    console.log('ollama init');
    await init();
    console.log('ollama init end');
  }
  if (type === "conversation") {
    const result = await conversation(data);
    console.log(result);
    self.postMessage({ type: 'conversation-result', data: result });
  }
}
