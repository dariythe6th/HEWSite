// Mobile Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", !isExpanded);
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    
    // Toggle body scroll lock
    document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "";
});

document.querySelectorAll(".nav-menu a").forEach(link => {
    link.addEventListener("click", () => {
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.style.overflow = "";
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Indicator
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Scroll Animation
const fadeElements = document.querySelectorAll('.fade-in');
        
const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('appear');
            appearOnScroll.unobserve(entry.target);
        }
    });
}, appearOptions);

fadeElements.forEach(element => {
    appearOnScroll.observe(element);
});

// Form Submission and Validation
const form = document.getElementById('feedback-form');
const inputs = form.querySelectorAll('input, textarea');

// Real-time validation
inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (!input.checkValidity()) {
            input.classList.add('invalid');
        } else {
            input.classList.remove('invalid');
        }
    });
});

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    inputs.forEach(input => {
        if (!input.checkValidity()) {
            input.classList.add('invalid');
            isValid = false;
        }
    });
    
    if (isValid) {
        // Create success message
        const toast = document.createElement('div');
        toast.textContent = 'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 15px 25px;
            background: var(--dark-green);
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.4s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Animate toast in
        setTimeout(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        }, 10);
        
        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 4000);
        
        form.reset();
        inputs.forEach(input => input.classList.remove('invalid'));
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const isMenuOpen = navMenu.classList.contains('active');
    const isClickInsideMenu = navMenu.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);
    
    if (isMenuOpen && !isClickInsideMenu && !isClickOnHamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = "";
    }
});