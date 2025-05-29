import ConversationWorker from '../workers/qwen3?worker';
import { speak } from '../speak/speak';

const conversationWorker = new ConversationWorker();
conversationWorker.postMessage({ type: "init" });

export const conversation = (message: string) => {
  conversationWorker.onmessage = (event) => {
    const { data: { type, data } } = event;
    if (type === "conversation-result") {
      speak(data);
    }
  }

  conversationWorker.postMessage({ type: "conversation", data: message });
}
