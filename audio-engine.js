const AudioEngine = {
    // محرك نطق النصوص (Text-to-Speech)
    speak: function(text, lang = null) {
        if (!text) return;
        window.speechSynthesis.cancel(); // إيقاف أي نطق حالي

        const utterance = new SpeechSynthesisUtterance(text);
        
        // الكشف التلقائي للغة إذا لم تحدد
        if (!lang) {
            const isArabic = /[\u0600-\u06FF]/.test(text);
            const isJapanese = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(text);
            utterance.lang = isArabic ? 'ar-SA' : (isJapanese ? 'ja-JP' : 'en-US');
        } else {
            utterance.lang = lang;
        }

        utterance.rate = 0.85; // سرعة هادئة ومثالية للتعلم
        window.speechSynthesis.speak(utterance);
    },

    // نغمات واجهة المستخدم باستخدام Web Audio API
    playTone: function(type) {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'click') {
            oscillator.frequency.setValueAtTime(600, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now); oscillator.stop(now + 0.1);
        } 
        else if (type === 'success') {
            oscillator.frequency.setValueAtTime(500, now);
            oscillator.frequency.exponentialRampToValueAtTime(1000, now + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now); oscillator.stop(now + 0.3);
        }
        else if (type === 'levelUp') {
            oscillator.frequency.setValueAtTime(400, now);
            oscillator.frequency.linearRampToValueAtTime(800, now + 0.5);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
            oscillator.start(now); oscillator.stop(now + 0.6);
        }
    }
};

// النطق التلقائي عند تظليل نص في القارئ أو أي مكان
document.addEventListener('mouseup', () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 1) {
        AudioEngine.speak(selectedText);
        // إضافة XP صغير عند الترجمة
        if(typeof AppLogic !== 'undefined') AppLogic.addXP(2);
    }
});
