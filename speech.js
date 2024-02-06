class Speech {
  chosenVoice = null;

  constructor() {
    this.onVoicesChangeHandler = this.onVoicesChangeHandler.bind(this);
    this.onVoicesChangeHandler();
    window.speechSynthesis.addEventListener(
      'voiceschanged',
      this.onVoicesChangeHandler
    );
  }

  onVoicesChangeHandler() {
    let foundVoices = window.speechSynthesis
      .getVoices();
    let coolVoices = foundVoices
      // .filter((v) => v.name.indexOf('Google US English') !== -1);
      .filter((v) => v.voiceURI.includes('Fred'));

    console.log('voiceschanged', foundVoices, coolVoices);

    if (foundVoices.length > 0) {
      this.chosenVoice = (coolVoices && coolVoices[0]) || foundVoices[0];
    }
  }

  speak(message) {
    console.log('speak', message);
    return new Promise(resolve => {
      let utterance = new SpeechSynthesisUtterance(message);
      if (this.chosenVoice) {
        utterance.voice = this.chosenVoice;
      }
      utterance.onend = () => {
        resolve();
      };
      speechSynthesis.speak(utterance);
    });
  }
}
