import { conversation } from '../aiServices/llmConversationService';

onmessage = async function(event) {
  console.log(event);
  const { data: { type, data } } = event
  if (type === "conversation") {
    const result = await conversation(data);
    self.postMessage({ type: 'conversation-result', data: result });
  }
}
