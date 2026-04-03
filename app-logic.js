const AppLogic = {
    // 1. نظام الترجمة
    translations: {
        ar: {
            nav_dash: "المكتبة", nav_import: "استيراد", nav_review: "مراجعة", nav_settings: "الإعدادات",
            welcome: "أهلاً بك، مستكشف اللغات", subtitle: "رحلتك التعليمية تبدأ من هنا.",
            stat_cards: "إجمالي البطاقات", stat_xp: "نقاط الخبرة XP", current_read: "القراءة الحالية",
            continue: "استكمال القراءة ▶️", import_title: "📥 استيراد مانهو جديدة", btn_import: "تحميل",
            settings_title: "⚙️ الإعدادات", ui_lang: "لغة التطبيق", target_lang: "اللغة المستهدفة",
            reset: "إعادة ضبط المصنع 🗑️", level: "المستوى", close: "إغلاق ⬅️"
        },
        en: {
            nav_dash: "Library", nav_import: "Import", nav_review: "Review", nav_settings: "Settings",
            welcome: "Welcome, Explorer", subtitle: "Your journey starts here.",
            stat_cards: "Total Cards", stat_xp: "Experience XP", current_read: "Currently Reading",
            continue: "Continue Reading ▶️", import_title: "📥 Import New Manga", btn_import: "Import",
            settings_title: "⚙️ Settings", ui_lang: "UI Language", target_lang: "Learning Language",
            reset: "Factory Reset 🗑️", level: "Level", close: "Close ⬅️"
        }
    },

    state: {
        xp: parseInt(localStorage.getItem('ms_xp')) || 0,
        cards: parseInt(localStorage.getItem('ms_cards')) || 0,
        uiLang: localStorage.getItem('ms_ui_lang') || 'ar'
    },

    // 2. إدارة الواجهة والتنقل
    navigate: function(page) {
        AudioEngine.playTone('click');
        document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`${page}-view`).classList.add('active');
        document.querySelectorAll('nav ul li').forEach(li => li.classList.remove('active'));
        document.getElementById(`nav-${page}`).classList.add('active');
    },

    // 3. نظام الخبرة والتقدم
    addXP: function(amount) {
        this.state.xp += amount;
        localStorage.setItem('ms_xp', this.state.xp);
        this.updateUI();
        if (this.state.xp % 100 === 0) AudioEngine.playTone('levelUp');
    },

    updateUI: function() {
        const level = Math.floor(this.state.xp / 100) + 1;
        const xpInLevel = this.state.xp % 100;
        
        document.getElementById('stat-xp').innerText = this.state.xp;
        document.getElementById('stat-total').innerText = this.state.cards;
        document.getElementById('user-level').innerText = level;
        document.getElementById('xp-fill').style.width = `${xpInLevel}%`;

        // تحديث الترجمة
        const lang = this.state.uiLang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.innerText = this.translations[lang][key];
        });
        
        // تحديث اتجاه الصفحة
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    },

    // 4. منطق القارئ والاستيراد
    openReader: function() {
        const container = document.getElementById('manga-scroll-container');
        container.innerHTML = `<img src="https://swebtoon-phinf.pstatic.net/20210629_162/1624945417332fPzS0_JPEG/16249454173041113175.jpg" referrerpolicy="no-referrer">`;
        document.getElementById('reader-overlay').style.display = 'flex';
        this.addXP(10); // زيادة XP عند القراءة
    },

    closeReader: function() {
        document.getElementById('reader-overlay').style.display = 'none';
    },

    handleImport: function() {
        const status = document.getElementById('import-status');
        status.innerHTML = "⌛ Processing...";
        setTimeout(() => {
            status.innerHTML = "✅ Success!";
            this.state.cards += 5;
            localStorage.setItem('ms_cards', this.state.cards);
            this.addXP(50);
            this.updateUI();
        }, 1500);
    },

    // 5. الإعدادات
    changeUILanguage: function() {
        this.state.uiLang = document.getElementById('ui-lang-select').value;
        localStorage.setItem('ms_ui_lang', this.state.uiLang);
        this.updateUI();
    },

    saveSettings: function() {
        const target = document.getElementById('target-lang-select').value;
        localStorage.setItem('ms_target_lang', target);
        AudioEngine.playTone('success');
    },

    resetApp: function() {
        if(confirm("Reset everything?")) { localStorage.clear(); location.reload(); }
    }
};

window.onload = () => {
    // ضبط القيم في السلكتورات عند التحميل
    document.getElementById('ui-lang-select').value = AppLogic.state.uiLang;
    document.getElementById('target-lang-select').value = localStorage.getItem('ms_target_lang') || 'ja-JP';
    AppLogic.updateUI();
};