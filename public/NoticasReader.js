function speak(text, language) {
    var s = new SpeechSynthesisUtterance(text);
    s.lang = language;	speechSynthesis.speak(s);
}
function speakArticle() {
    var container = document.getElementsByTagName("cuerpo")[0];
    var contentToSpeak = container.innerText;
    speak(contentToSpeak, 'es-es');
}
