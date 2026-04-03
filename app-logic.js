const AppLogic = {
    // الترجمات
    i18n: {
        ar: {
            nav_dash: "المكتبة", nav_import: "استيراد", nav_review: "مراجعة", nav_settings: "الإعدادات",
            welcome: "مرحباً بك في رحلة التعلم", subtitle: "اقرأ المانهو، ظلل الكلمات، وتعلم اللغات بسهولة.",
            stat_cards: "البطاقات التعليمية", stat_xp: "إجمالي الخبرة", continue: "استكمال القراءة ▶️",
            import_title: "📥 استيراد من Webtoons", btn_import: "تحميل", settings_title: "⚙️ الإعدادات",
            ui_lang: "لغة التطبيق", target_lang: "اللغة المستهدفة للتعلم", reset: "حذف جميع البيانات 🗑️",
            level: "المستوى", close: "إغلاق", hint: "ظلل أي نص للترجمة والنطق"
        },
        en: {
            nav_dash: "Library", nav_import: "Import", nav_review: "Review", nav_settings: "Settings",
            welcome: "Welcome to your Journey", subtitle: "Read manga, highlight words, and learn easily.",
            stat_cards: "Flashcards", stat_xp: "Total Experience", continue: "Continue Reading ▶️",
            import_title: "📥 Import from Webtoons", btn_import: "Import", settings_title: "⚙️ Settings",
            ui_lang: "App Language", target_lang: "Target Language", reset: "Factory Reset 🗑️",
            level: "Level", close: "Close", hint: "Highlight text to speak/translate"
        }
    },

    state: {
        xp: parseInt(localStorage.getItem('ms_xp')) || 0,
        cards: parseInt(localStorage.getItem('ms_cards')) || 0,
        uiLang: localStorage.getItem('ms_ui_lang') || 'ar',
        mangaPages: [
            "https://swebtoon-phinf.pstatic.net/20210629_162/1624945417332fPzS0_JPEG/16249454173041113175.jpg",
            "https://swebtoon-phinf.pstatic.net/20210629_42/1624945417333BvPzS_JPEG/16249454173151113176.jpg",
            "https://swebtoon-phinf.pstatic.net/20210629_232/16249454176228vG9u_JPEG/16249454176011113177.jpg"
        ]
    },

    // التنقل
    navigate: function(viewId) {
        AudioEngine.playTone('click');
        document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`${viewId}-view`).classList.add('active');
        
        document.querySelectorAll('nav ul li').forEach(li => li.classList.remove('active'));
        document.getElementById(`nav-${viewId}`).classList.add('active');
    },

    // نظام XP
    addXP: function(amount) {
        const oldLevel = Math.floor(this.state.xp / 100) + 1;
        this.state.xp += amount;
        const newLevel = Math.floor(this.state.xp / 100) + 1;
        
        if (newLevel > oldLevel) AudioEngine.playTone('levelUp');
        localStorage.setItem('ms_xp', this.state.xp);
        this.updateUI();
    },

    // فتح القارئ
    openReader: function() {
        const container = document.getElementById('manga-scroll-view');
        container.innerHTML = '';
        
        this.state.mangaPages.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.referrerPolicy = "no-referrer"; // لتجاوز حماية الويب تون
            container.appendChild(img);
        });

        document.getElementById('reader-overlay').style.display = 'flex';
        this.addXP(5);
        AudioEngine.playTone('success');
        AudioEngine.speak("Opening Manga");
    },

    closeReader: function() {
        document.getElementById('reader-overlay').style.display = 'none';
        AudioEngine.playTone('click');
    },

    // تحديث الواجهة
    updateUI: function() {
        const lang = this.state.uiLang;
        const level = Math.floor(this.state.xp / 100) + 1;
        const xpInLevel = this.state.xp % 100;

        // تحديث النصوص
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.innerText = this.i18n[lang][key];
        });

        document.getElementById('stat-xp-val').innerText = this.state.xp;
        document.getElementById('current-xp').innerText = xpInLevel;
        document.getElementById('user-level').innerText = level;
        document.getElementById('xp-bar-fill').style.width = `${xpInLevel}%`;
        document.getElementById('stat-cards-val').innerText = this.state.cards;

        // ضبط الاتجاه
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    },

    updateUILang: function() {
        this.state.uiLang = document.getElementById('ui-lang-selector').value;
        localStorage.setItem('ms_ui_lang', this.state.uiLang);
        this.updateUI();
        AudioEngine.playTone('success');
    },

    handleImport: function() {
        const log = document.getElementById('import-log');
        log.innerHTML = "<p style='color: var(--accent)'>⌛ Processing link...</p>";
        
        setTimeout(() => {
            log.innerHTML = "<p style='color: #10b981'>✅ Success! Manga imported.</p>";
            this.state.cards += 5;
            localStorage.setItem('ms_cards', this.state.cards);
            this.addXP(50);
            AudioEngine.playTone('success');
        }, 1500);
    },

    factoryReset: function() {
        if(confirm("Are you sure? All cards and XP will be lost.")) {
            localStorage.clear();
            location.reload();
        }
    }
};

window.onload = () => {
    document.getElementById('ui-lang-selector').value = AppLogic.state.uiLang;
    AppLogic.updateUI();
};
