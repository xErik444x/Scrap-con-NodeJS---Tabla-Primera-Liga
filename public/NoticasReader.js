const btn = document.getElementById("leerNota");
  btn.addEventListener('click', () => {
    alert("Click en boton leer nota");
    speakArticle() ;
  });

function speak(text, language) {
    var s = new SpeechSynthesisUtterance(text);
    s.lang = language;	speechSynthesis.speak(s);
}
function speakArticle() {
  console.warn("Speak");
    var container = document.getElementsByTagName("cuerpo")[0];
    var contentToSpeak = container.innerText;
    speak(contentToSpeak, 'es-es');
}
