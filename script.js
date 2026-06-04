/* ============================================================
   HEWS — Premium Interactive Experience
   ============================================================ */

(function() {
    'use strict';

    // ============================================================
    // CUSTOM CURSOR
    // ============================================================
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states for cursor
    const hoverTargets = document.querySelectorAll('a, button, .btn, .risk-nav, .faq-q, input, .theme-toggle, .hamburger');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        el.addEventListener('mousedown', () => cursor.classList.add('click'));
        el.addEventListener('mouseup', () => cursor.classList.remove('click'));
    });

    // ============================================================
    // THEME TOGGLE (Dark/Light Mode)
    // ============================================================
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;

    // Check saved preference
    const savedTheme = localStorage.getItem('hews-theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('hews-theme', next);
            updateThemeIcon(next);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        themeToggle.innerHTML = theme === 'dark'
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    }

    // ============================================================
    // MOBILE MENU
    // ============================================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ============================================================
    // HEADER SCROLL EFFECT
    // ============================================================
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // ============================================================
    // RISK CARD 3D TILT & SPOTLIGHT
    // ============================================================
    const riskCardWrap = document.querySelector('.risk-card-wrap');
    const riskCard = document.querySelector('.risk-card');

    if (riskCard && riskCardWrap) {
        riskCard.addEventListener('mousemove', (e) => {
            const rect = riskCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            riskCardWrap.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            riskCard.style.setProperty('--mouse-x', (x / rect.width * 100) + '%');
            riskCard.style.setProperty('--mouse-y', (y / rect.height * 100) + '%');
        });

        riskCard.addEventListener('mouseleave', () => {
            riskCardWrap.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }

    // ============================================================
    // RISK CAROUSEL (6 diseases, risks <15%)
    // ============================================================
    const diseases = [
        { name: "Сахарный диабет 2 типа", risk: 8, message: "Низкий риск. Рекомендуется контроль раз в 6 месяцев." },
        { name: "Артериальная гипертония", risk: 14, message: "Пограничный риск. Следите за давлением." },
        { name: "Сердечно-сосудистые заболевания", risk: 5, message: "Очень низкий риск. Отличные показатели." },
        { name: "Синдром апноэ сна", risk: 9, message: "Небольшой риск. Обратите внимание на качество сна." },
        { name: "Хроническая болезнь почек", risk: 3, message: "Минимальный риск. Продолжайте наблюдение." },
        { name: "Аритмия", risk: 7, message: "Низкий риск. Контроль ЭКГ раз в год." }
    ];
    let currentDisease = 0;
    let autoInterval;

    function updateRiskCard(index) {
        const d = diseases[index];
        const nameEl = document.getElementById("disease-name");
        const valueEl = document.getElementById("risk-value");
        const progressEl = document.getElementById("risk-progress");
        const messageEl = document.getElementById("risk-message");

        if (!nameEl) return;

        // Animate text change
        nameEl.style.opacity = '0';
        valueEl.style.opacity = '0';
        messageEl.style.opacity = '0';

        setTimeout(() => {
            nameEl.textContent = d.name;
            valueEl.textContent = d.risk;
            progressEl.style.width = d.risk + "%";
            messageEl.textContent = d.message;

            nameEl.style.opacity = '1';
            valueEl.style.opacity = '1';
            messageEl.style.opacity = '1';
        }, 200);
    }

    function nextDisease() {
        currentDisease = (currentDisease + 1) % diseases.length;
        updateRiskCard(currentDisease);
    }
    function prevDisease() {
        currentDisease = (currentDisease - 1 + diseases.length) % diseases.length;
        updateRiskCard(currentDisease);
    }

    document.querySelector(".risk-nav.next")?.addEventListener("click", () => {
        clearInterval(autoInterval);
        nextDisease();
        startAutoSwitch();
    });
    document.querySelector(".risk-nav.prev")?.addEventListener("click", () => {
        clearInterval(autoInterval);
        prevDisease();
        startAutoSwitch();
    });

    function startAutoSwitch() {
        if (autoInterval) clearInterval(autoInterval);
        autoInterval = setInterval(() => nextDisease(), 4000);
    }

    if (document.querySelector(".risk-card")) {
        updateRiskCard(0);
        startAutoSwitch();
    }

    // ============================================================
    // COUNTER ANIMATION
    // ============================================================
    const counters = document.querySelectorAll(".counter");
    let counted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !counted) {
            counters.forEach(counter => {
                const target = +counter.getAttribute("data-target");
                const duration = 2000;
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out expo
                    const ease = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(ease * target);
                    counter.innerText = current.toLocaleString();

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        counter.innerText = target.toLocaleString();
                    }
                }
                requestAnimationFrame(update);
            });
            counted = true;
        }
    }, { threshold: 0.5 });

    if (counters.length) {
        const heroStats = document.querySelector(".hero-stats");
        if (heroStats) counterObserver.observe(heroStats);
    }

    // ============================================================
    // EARLY ACCESS FORM
    // ============================================================
    const earlyForm = document.getElementById("early-access");
    if (earlyForm) {
        earlyForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = earlyForm.querySelector("input").value;
            if (email && email.includes("@")) {
                showToast("Спасибо! Вы записаны в лист ожидания пилотного проекта.");
                earlyForm.reset();
            } else {
                showToast("Введите корректный email", 'error');
            }
        });
    }

    // Toast notification
    function showToast(message, type = 'success') {
        const existing = document.querySelector('.hews-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'hews-toast';
        toast.innerHTML = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: ${type === 'error' ? '#c0392b' : 'var(--accent)'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-weight: 600;
            font-size: 0.95rem;
            z-index: 10001;
            box-shadow: 0 8px 30px rgba(0,0,0,0.2);
            transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
            backdrop-filter: blur(10px);
        `;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // ============================================================
    // FAQ ACCORDION
    // ============================================================
    document.querySelectorAll(".faq-q").forEach(q => {
        q.addEventListener("click", () => {
            const parent = q.parentElement;
            const wasActive = parent.classList.contains("active");

            // Close all
            document.querySelectorAll(".faq-item").forEach(item => {
                item.classList.remove("active");
            });

            // Open clicked if wasn't active
            if (!wasActive) {
                parent.classList.add("active");
            }
        });
    });

    // ============================================================
    // BACK TO TOP
    // ============================================================
    const backBtn = document.getElementById("back-to-top");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) backBtn?.classList.add("visible");
        else backBtn?.classList.remove("visible");
    }, { passive: true });

    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ============================================================
    // SCROLL REVEAL
    // ============================================================
    const revealElements = document.querySelectorAll('.reveal');
    const staggerParents = document.querySelectorAll('.stagger-children');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
    staggerParents.forEach(el => revealObserver.observe(el));

    // ============================================================
    // MAGNETIC BUTTONS
    // ============================================================
    const magneticBtns = document.querySelectorAll('.magnetic-wrap .btn, .magnetic-wrap .risk-nav');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // ============================================================
    // PARALLAX ON SCROLL
    // ============================================================
    const parallaxElements = document.querySelectorAll('.hero-blob');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        parallaxElements.forEach((el, i) => {
            const speed = 0.1 + (i * 0.05);
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, { passive: true });

    // ============================================================
    // SMOOTH PAGE TRANSITIONS
    // ============================================================
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        }
    });

    // Fade in on load
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    });

    // ============================================================
    // GLASS CARD SPOTLIGHT EFFECT
    // ============================================================
    document.querySelectorAll('.glass, .tech-card, .doc-card, .blog-card, .research-item').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--spotlight-x', x + '%');
            card.style.setProperty('--spotlight-y', y + '%');
        });
    });

    // ============================================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ============================================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ============================================================
    // PHONE MOCKUP 3D CAROUSEL
    // ============================================================
    const phoneItems = document.querySelectorAll('.phone-carousel-item');
    const phoneDots = document.querySelectorAll('.phone-dot');
    const phoneLabels = document.querySelectorAll('.phone-label');
    const phonePrev = document.querySelector('.phone-nav.prev');
    const phoneNext = document.querySelector('.phone-nav.next');
    let currentPhone = 0;
    let phoneAutoInterval;
    const totalPhones = phoneItems.length;

    function updatePhoneCarousel(index) {
        phoneItems.forEach((item, i) => {
            item.classList.remove('active', 'prev', 'next', 'hidden');
            if (i === index) {
                item.classList.add('active');
            } else if (i === (index - 1 + totalPhones) % totalPhones) {
                item.classList.add('prev');
            } else if (i === (index + 1) % totalPhones) {
                item.classList.add('next');
            } else {
                item.classList.add('hidden');
            }
        });

        phoneDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        phoneLabels.forEach((label, i) => {
            label.classList.toggle('active', i === index);
        });

        currentPhone = index;
    }

    function nextPhone() {
        updatePhoneCarousel((currentPhone + 1) % totalPhones);
    }

    function prevPhone() {
        updatePhoneCarousel((currentPhone - 1 + totalPhones) % totalPhones);
    }

    if (phonePrev) {
        phonePrev.addEventListener('click', () => {
            clearInterval(phoneAutoInterval);
            prevPhone();
            startPhoneAuto();
        });
    }

    if (phoneNext) {
        phoneNext.addEventListener('click', () => {
            clearInterval(phoneAutoInterval);
            nextPhone();
            startPhoneAuto();
        });
    }

    phoneDots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            clearInterval(phoneAutoInterval);
            updatePhoneCarousel(i);
            startPhoneAuto();
        });
    });

    function startPhoneAuto() {
        if (phoneAutoInterval) clearInterval(phoneAutoInterval);
        phoneAutoInterval = setInterval(() => nextPhone(), 5000);
    }

    if (phoneItems.length > 0) {
        updatePhoneCarousel(0);
        startPhoneAuto();
    }

    

})();
