import ConversationWorker from '../workers/qwen2?worker';

const conversationWorker = new ConversationWorker();

export const conversation = (message: string) => {
  conversationWorker.onmessage = (event) => {
    const { data: { type, data } } = event;
    if (type === "conversation-result") {
      console.log(data);
    }
  }

  conversationWorker.postMessage({ type: "conversation", data: message });
}
