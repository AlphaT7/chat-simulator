import appState from "./appState.js";
import AudioInput from "./audioInput.js";
import AudioOutput from "./audioOutput.js";

const synth = speechSynthesis;
const $ = document.querySelector.bind(document);
let initialized = false;

async function init(synth) {
  if (initialized || typeof speechSynthesis === "undefined") return;
  initialized = true;

  let defaultVoice =
    speechSynthesis.getVoices().find((voice) => voice.name == "Daniel") ||
    speechSynthesis.getVoices().find((voice) => voice.default);

  const synthObj = {
    synth: synth,
    defaultVoice: defaultVoice,
  };

  const AppState = new appState();

  const audioOutput = new AudioOutput(synthObj, AppState);

  const audioAnalysis = new AudioInput(audioOutput, AppState);

  $("#button").addEventListener("pointerup", () => {
    if ($("#button").dataset.type == "listen") {
      if (AppState.getListeningState()) return;
      audioOutput.speak(""); // necessary to start the speech synthesis; if not included, audioOutput.speak() will not work on IOS;
      audioAnalysis.start();
    } else if (AppState.getAiProcessingState()) {
      audioAnalysis.cancelProcessing();
    } else {
      audioOutput.stop();
    }
  });
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "hidden") {
    setTimeout(() => init(synth), 100)
  }
});

document.addEventListener("DOMContentLoaded", () => { init(synth); });