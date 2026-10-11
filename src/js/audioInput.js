import UI from "./ui.js";
import AI from "./ai.js";
const userState = new UI();
const ai = new AI();

export default class AudioInput {
  constructor(audioOutput, AppState) {
    this.audioOutput = audioOutput;
    this.SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.AudioAnalysis = new this.SpeechRecognition();
    this.AppState = AppState;
    this.AudioAnalysis.continuous = false;
    this.AudioAnalysis.interimResults = false;
    this.finalTranscript = "";
    this.cancelled = false;
  }

  cancelProcessing() {
    this.cancelled = true;
    ai.stop();
  }

  async resetToIdle() {
    this.AppState.setAiProcessingState(false);
    this.AppState.setListeningState(false);
    await userState.update("isNotListening");
  }

  async handleCancelled() {
    await userState.update(
      "aiTranscript",
      "Query canceled by user before processing finished."
    );
    await this.resetToIdle();
  }

  async submitQuery(input) {
    this.cancelled = false;
    await userState.update("aiProcessing");
    try {
      const output = await ai.Query(input);
      if (this.cancelled) return this.handleCancelled();
      if (!output.trim()) {
        throw new Error("The local model returned an empty response.");
      }

      await userState.update("aiTranscript", output);
      if (await userState.update("isSpeechOn")) {
        await this.audioOutput.speak(output);
        await userState.update("showCancelSpeech");
      } else {
        await this.resetToIdle();
      }
    } catch (error) {
      if (this.cancelled) return this.handleCancelled();
      console.error("Local model query failed:", error);
      await userState.update(
        "aiTranscript",
        "Sorry, I couldn't generate a response. Please try again."
      );
      await this.resetToIdle();
    }
  }

  async start() {
    if (
      this.AppState.getListeningState() ||
      this.AppState.getAiProcessingState()
    ) {
      return;
    }

    this.finalTranscript = "";
    this.AppState.setListeningState(true);
    this.AudioAnalysis.onresult = (event) => {
      this.finalTranscript = Array.from(event.results)
        .filter((result) => result.isFinal)
        .map((result) => result[0].transcript)
        .join(" ")
        .trim();
    };

    this.AudioAnalysis.onstart = () => {
      userState.update("isListening");
    };

    this.AudioAnalysis.onend = async () => {
      const transcript = this.finalTranscript.toLowerCase();
      this.finalTranscript = "";

      if (!transcript) {
        userState.update("isNotListening");
        this.AppState.setListeningState(false);
        return;
      }

      await userState.update("userTranscript", transcript);
      this.AppState.setAiProcessingState(true);
      await userState.update("aiProcessing");
      await this.submitQuery(transcript);
    };

    this.AudioAnalysis.onerror = (event) => {
      console.error(`Recognition error: ${ event.error }`);
      this.finalTranscript = "";
      userState.update("aiTranscript", "Sorry, I didn't catch that.");
      userState.update("isNotListening");
      this.AppState.setAiProcessingState(false);
      this.AppState.setListeningState(false);
    };

    this.AudioAnalysis.start();
  }
}
