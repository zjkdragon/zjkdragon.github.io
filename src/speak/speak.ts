export const speak = (txt: string) => {
  console.log('speak:', txt);
  const synth = window.speechSynthesis;
  const utterThis = new SpeechSynthesisUtterance(txt);
  synth.speak(utterThis);
}
