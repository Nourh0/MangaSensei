const AudioEngine = {
    // نطق النصوص
    speak: function(text) {
        if (!text) return;
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        
        // جلب اللغة المستهدفة من الإعدادات
        const targetLang = localStorage.getItem('ms_target_lang') || 'ja-JP';
        
        // إذا كان النص يحتوي على حروف عربية، ينطق بالعربية تلقائياً
        const isArabic = /[\u0600-\u06FF]/.test(text);
        msg.lang = isArabic ? 'ar-SA' : targetLang;
        
        msg.rate = 0.85;
        window.speechSynthesis.speak(msg);
    },

    // نغمات الواجهة
    playTone: function(type) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === 'click') {
            osc.frequency.setValueAtTime(600, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now); osc.stop(now + 0.1);
        } else if (type === 'levelUp') {
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.5);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now); osc.stop(now + 0.5);
        }
    }
};

// النطق عند التظليل
document.addEventListener('mouseup', () => {
    const selected = window.getSelection().toString().trim();
    if (selected.length > 0) AudioEngine.speak(selected);
});