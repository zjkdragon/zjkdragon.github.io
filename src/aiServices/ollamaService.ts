import { Ollama } from '@langchain/ollama';
// import { PromptTemplate } from '@langchain/core/prompts';
// import { LLMChain } from 'langchain/chains'

export const init = async () => { }

export const conversation = async (message: string) => {
  // const promptTemplate = new PromptTemplate({
  //   template: '1加{value}等于几',
  //   inputVariables: ['value'],
  // });

  const model = new Ollama({
    model: "qwen3:14b",
  });

  // const prompt = await promptTemplate.format({value: '2'});
  // console.log(prompt);
  const response = await model.call(message);
  return response.split("</think>\n\n")[1];

  // const chain = new LLMChain({ llm: model, prompt: promptTemplate });
  //
  // const response = await chain.call({
  //   value: '2'
  // });
  // console.log(response);

}
