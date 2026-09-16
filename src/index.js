const questionInput = document.getElementById("question");
const sendButton = document.getElementById("sendBtn");
const voiceButton = document.getElementById("voiceBtn");
const answer = document.getElementById("answer");
const status = document.getElementById("status");

function falar(texto) {
  if (!("speechSynthesis" in window)) {
    status.textContent = "A voz não é compatível com este navegador.";
    return;
  }

  window.speechSynthesis.cancel();

  const voz = new SpeechSynthesisUtterance(texto);
  voz.lang = "pt-BR";
  voz.rate = 1;
  voz.pitch = 1;
  voz.volume = 1;

  window.speechSynthesis.speak(voz);
}

function responder(pergunta) {
  const texto = pergunta.toLowerCase();

  if (texto.includes("oi") || texto.includes("olá")) {
    return "Olá! Eu sou Raphael IA. Como posso ajudar?";
  }

  if (texto.includes("seu nome") || texto.includes("quem é você")) {
    return "Meu nome é Raphael IA. Sou seu assistente virtual.";
  }

  if (texto.includes("hora")) {
    return "Agora são " + new Date().toLocaleTimeString("pt-BR") + ".";
  }

  if (
    texto.includes("obrigado") ||
    texto.includes("obrigada") ||
    texto.includes("valeu")
  ) {
    return "De nada! Estou aqui para ajudar.";
  }

  return (
    'Entendi sua pergunta: "' +
    pergunta +
    '". Ainda estou aprendendo, mas posso ajudar com explicações e ideias.'
  );
}

function enviarPergunta() {
  const pergunta = questionInput.value.trim();

  if (!pergunta) {
    answer.textContent = "Digite uma pergunta primeiro.";
    return;
  }

  answer.textContent = "Analisando sua pergunta...";
  status.textContent = "Raphael IA está processando...";

  questionInput.value = "";

  setTimeout(function () {
    const resposta = responder(pergunta);

    answer.textContent = resposta;
    status.textContent = "Resposta pronta";

    falar(resposta);
  }, 500);
}

sendButton.addEventListener("click", enviarPergunta);

questionInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    enviarPergunta();
  }
});

const ReconhecimentoDeVoz =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (ReconhecimentoDeVoz) {
  const reconhecimento = new ReconhecimentoDeVoz();

  reconhecimento.lang = "pt-BR";
  reconhecimento.continuous = false;
  reconhecimento.interimResults = false;

  reconhecimento.onstart = function () {
    voiceButton.classList.add("listening");
    status.textContent = "Estou ouvindo...";
  };

  reconhecimento.onend = function () {
    voiceButton.classList.remove("listening");
    status.textContent = "Toque no microfone para falar";
  };

  reconhecimento.onresult = function (event) {
    const textoFalado = event.results[0][0].transcript;

    questionInput.value = textoFalado;
    enviarPergunta();
  };

  reconhecimento.onerror = function () {
    voiceButton.classList.remove("listening");
    status.textContent = "Não consegui ouvir. Tente novamente.";
  };

  voiceButton.addEventListener("click", function () {
    reconhecimento.start();
  });
} else {
  voiceButton.addEventListener("click", function () {
    status.textContent =
      "O reconhecimento de voz não funciona neste navegador.";
  });
}
