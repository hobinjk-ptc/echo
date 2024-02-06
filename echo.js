const speech = new Speech();

const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

let isRecognitionRunning = false;
let lastAddedFinalResultIndex = -1;

recognition.onstart = () => {
  console.log('onstart');
  isRecognitionRunning = true;
};

recognition.onend = () => {
  console.log('onend');
  isRecognitionRunning = false;
};

recognition.onerror = error => {
  console.log('Recognition error', error);
  // Check if the error is 'no-speech'
  if (error.error === 'no-speech') {
    console.log('No speech detected, restarting recognition...');
    restartDictation(); // Call your restart function
  } else {
    console.error('Fatal recognition error', error);
    isRecognitionRunning = false;
  }
};

let answerTimeout = null;
let silenceMs = 1500;

let answering = false;

/**
 * Need to do a rolling submission window or something
 * because you won't get isFinal
 */
recognition.onresult = event => {
  if (answering) {
    return;
  }
  const newMessages = [];
  console.log('onresult', event);
  Array.from(event.results).forEach((result, resultIndex) => {
    newMessages.push(result[0].transcript);
  });

  if (newMessages.length > 0) {
    const transcription = newMessages.join(' ').trim();
    console.log('onresult', transcription);
    if (answerTimeout) {
      clearTimeout(answerTimeout);
      answerTimeout = null;
    }
    answerTimeout = setTimeout(() => {
      onNewTranscription(transcription);
    }, silenceMs);
  }
};

if (!isRecognitionRunning) {
  recognition.start();
}

  speech.speak('sphinx of black quartz judge my vow');
async function onNewTranscription(transcription) {
  answering = true;
  recognition.stop();
  await speech.speak(transcription);
  answering = false;
  recognition.start();
  const elt = document.createElement('p');
  elt.textContent = transcription;
  document.body.appendChild(elt);
}

recognition.onspeechend = function(event) {
  console.log('onspeechend', event);
}

recognition.onnomatch = function(event) {
  console.log('noma', event);
}
