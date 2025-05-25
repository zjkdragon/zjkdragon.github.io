export const speak = (txt: string) => {
  const synth = window.speechSynthesis;
  const utterThis = new SpeechSynthesisUtterance(txt);
  synth.speak(utterThis);
}
