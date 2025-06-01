import { Ollama } from '@langchain/ollama';
import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
} from "@langchain/core/prompts";

let chain: any;

const funcs: { [key: string]: any } = {
  "mcp_add": (a: string, b: string) => {
    return Number(a) + Number(b);
  },
  "mcp_time": () => {
    return new Date().toLocaleString();
  },
  "mcp_animation": (...animations: string[]) => {
    let actions = [];
    console.log('animation:', animations);
    for (let animation of animations) {
      actions.push([
        "Dance",
        "Death",
        "Idle",
        "Jump",
        "Shake Head",
        "Punch",
        "Running",
        "Sitting",
        "Standing",
        "ThumbsUp",
        "Walking",
        "WalkJump",
        "Wave",
        "Nod"
      ].indexOf(animation))
    }
    return actions;
  }
}

export const init = async () => {
  function template(params: { func_feature: string, func_name: string, wait: boolean }) {
    const { func_feature, func_name, wait } = params;
    return `我有一个可以让你${func_feature}的方法，你想要使用的时候可以告诉我你想要调用这个方法，格式是"<call>${func_name}:["参数1","参数2",...]</call>"${wait ? "，调用后等待回复的结果，然后再给出相应回答" : ""}。`
  }

  const systemMessage = template({
    "func_feature": "计算两个数相加结果",
    'func_name': "mcp_add",
    "wait": true
  }) + template({
    "func_feature": "仅获取当前时间但是无法计算时间",
    'func_name': "mcp_time",
    "wait": true
  }) + template({
    "func_feature": `做列表里的这些动作[ "Dance", "Death", "Idle", "Jump", "Shake Head", "Punch", "Running", "Sitting", "Standing", "ThumbsUp", "Walking", "WalkJump", "Wave", "Nod" ]`,
    'func_name': "mcp_animation",
    "wait": false
  })
  console.log(systemMessage);

  const promptTemplate = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(systemMessage),
    HumanMessagePromptTemplate.fromTemplate("{userInput}"), // 用户输入占位符
  ]);

  const model = new Ollama({
    model: "qwen3:14b",
  });

  chain = promptTemplate.pipe(model);
}

export const conversation = async (message: string): Promise<string> => {
  const response = await chain.invoke({
    userInput: message, // 用户输入
  });

  console.log(response);
  const reMsg = response.split("</think>\n\n")[1];
  const [callMsg1, callMsg2] = reMsg.split("</call");
  if (callMsg2) {
    const call = callMsg1.split("<call>")[1];
    console.log(call);
    const [func_name, args] = call.split(":");
    const data = funcs[func_name].apply(undefined, JSON.parse(args));
    const msg = `<call>${func_name}:${args}</call>的结果是${data}`;
    console.log(`mcp msg: ${msg}`);
    let info: { result: string, animations?: number[] } = { result: "" };
    if (func_name === "mcp_animation") {
      info.animations = data;
      return JSON.stringify(info);
    } else {
      return await conversation(msg);
    }
  } else {
    return JSON.stringify({ result: reMsg });
  }
}
