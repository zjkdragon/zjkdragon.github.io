import { conversation, init } from '../aiServices/conversationService';

onmessage = async function(event) {
  console.log(event);
  const { data: { type, data } } = event
  if (type === "init") {
    await init();
  }
  if (type === "conversation") {
    const result = await conversation(data);
    console.log(result);
    self.postMessage({ type: 'conversation-result', data: result });
  }
}
