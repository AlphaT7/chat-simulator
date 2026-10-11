const $ = document.querySelector.bind(document);
const userColor = "#19ab33";
const aiColor = "#1e90ff";
const cancelColor = "#ff4d4d";

export default class UI {
  constructor() { }

  async typeIt(el, text, scrollEl) {
    // control how many characters it will chunk at a time by changing the "num" variable;
    const num = 2;
    const delay = 100;
    const chars = Array.from(text);
    const cursor = el.querySelector("#cursor");

    for (let i = 0; i < chars.length; i += num) {
      // Insert before the cursor so it stays at the end of the message.
      el.insertBefore(document.createTextNode(chars.slice(i, i + num).join("")), cursor);
      if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  async update(func, options) {
    return this[func](options);
  }

  async isSpeechOn() {
    return $("#isSpeechOn").checked;
  }

  async aiProcessing() {
    $("#listening").style.color = aiColor;
    $("#listening").innerHTML = "AI processing...";
    $("#buttonIcon").style.color = cancelColor;
    $("#button").style.borderColor = cancelColor;
    $("#button").dataset.type = "cancel";
    $("#buttonIcon").classList.add("fa-ban");
    $("#buttonIcon").classList.remove("fa-microphone");
    $("#micOnIndicator").style.color = aiColor;
    $("#micOnIndicator").style.textShadow = `0 0 5px ${ aiColor }`;
    $("#micOnIndicator").classList.add("fa-clock-o");
    $("#micOnIndicator").classList.remove("fa-microphone");
  }

  async isListening() {
    $("#listening").style.color = userColor;
    $("#listening").innerHTML = "Listening...";
    $("#buttonIcon").style.color = userColor;
    $("#button").style.borderColor = userColor;
    $("#button").classList.add("box-ripple");
    setTimeout(() => {
      $("#button").classList.remove("box-ripple");
    }, 900);
    $("#micOnIndicator").style.color = userColor;
    $("#micOnIndicator").style.textShadow = `0 0 5px ${ userColor }`;
  }

  async scrollToEnd() {
    $("#tabContent1").scrollTop = $("#tabContent1").scrollHeight;
  }

  async showCancelSpeech() {
    $("#listening").style.color = aiColor;
    $("#listening").innerHTML = "AI speech in process...";
    $("#buttonIcon").classList.remove("fa-microphone");
    $("#buttonIcon").classList.add("fa-ban");
    $("#buttonIcon").style.color = cancelColor;;
    $("#button").style.borderColor = cancelColor;
    $("#button").dataset.type = "cancel";
    $("#micOnIndicator").style.color = aiColor;
    $("#micOnIndicator").style.textShadow = `0 0 5px ${ aiColor }`;
    $("#micOnIndicator").classList.add("fa-volume-up");
    $("#micOnIndicator").classList.remove("fa-clock-o");
  }

  async isNotListening() {
    $("#micOnIndicator").classList.remove("fa-clock-o", "fa-volume-up");
    $("#micOnIndicator").classList.add("fa-microphone");
    $("#buttonIcon").classList.remove("fa-clock-o", "fa-ban");
    $("#buttonIcon").classList.add("fa-microphone");
    $("#button").dataset.type = "listen";
    $("#listening").innerHTML = "Press the button and start talking! =)";
    // Clearing the inline overrides restores the stylesheet's default theme.
    $("#listening").style.color = "";
    $("#micOnIndicator").style.textShadow = "";
    $("#micOnIndicator").style.color = "";
    $("#buttonIcon").style.color = "";
    $("#button").style.borderColor = "";
  }

  async hideCancelSpeech() {
    $("#buttonIcon").classList.remove("fa-ban");
    $("#buttonIcon").classList.add("fa-microphone");
    $("#button").dataset.type = "listen";
  }

  async createCursor() {
    const cursor = document.createElement("span");
    cursor.id = "cursor";
    return cursor;
  }

  // Appends a message bubble without re-parsing #terminal, so existing element references stay valid.
  async addMessage(className, text = "") {
    $("#scrollMargin")?.remove();
    $("#cursor")?.remove();
    const el = document.createElement("div");
    el.className = className;
    el.textContent = text;
    const margin = document.createElement("div");
    margin.id = "scrollMargin";
    el.append(await this.createCursor());
    $("#terminal").append(el, margin);
    $("#tabContent1").scrollTop = $("#tabContent1").scrollHeight + 35;
    return el;
  }

  async userTranscript(input) {
    await this.addMessage("userTranscript", input);
  }

  async aiTranscript(input) {
    const el = await this.addMessage("aiTranscript");
    await this.typeIt(el, input, $("#tabContent1"));
  }
}
