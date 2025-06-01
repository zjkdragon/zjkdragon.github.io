import ConversationWorker from '../workers/qwen3?worker';
import { speak } from '../speak/speak';
import { animate } from '../three/three';

const conversationWorker = new ConversationWorker();
conversationWorker.postMessage({ type: "init" });

export const conversation = (message: string) => {
  conversationWorker.onmessage = (event) => {
    const { data: { type, data } } = event;
    if (type === "conversation-result") {
      const {animations, result} = JSON.parse(data);
      result && speak(result);
      if(animations) {
        animate(animations);
      }
    }
  }

  conversationWorker.postMessage({ type: "conversation", data: message });
}
