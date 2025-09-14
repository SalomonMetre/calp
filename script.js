// script.js
// Translation data will be loaded from external JSON file
let translations = {};
let currentLang = 'en';
let isInitialized = false;

// Load translations from external JSON file
async function loadTranslations() {
    try {
        const response = await fetch('./translations.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translations = await response.json();
        console.log('Translations loaded successfully');
        return true;
    } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback: you could provide minimal translations here
        translations = {
            en: { "nav.home": "Home", "nav.about": "About" },
            fr: { "nav.home": "Accueil", "nav.about": "À propos" }
        };
        return false;
    }
}

// Function to change language
function changeLanguage(lang) {
    if (!translations[lang]) {
        console.warn(`Language '${lang}' not found in translations`);
        return;
    }
    
    currentLang = lang;
    
    // Update language button active state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        } else {
            console.warn(`Translation key '${key}' not found for language '${lang}'`);
        }
    });
    
    // Update all placeholder texts
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.setAttribute('placeholder', translations[lang][key]);
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Store language preference
    localStorage.setItem('preferred-language', lang);
}

// Mobile Navigation Toggle
function setupMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Smooth Scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80; // Account for fixed header
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form Submission
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById("name")?.value || '';
            const email = document.getElementById("email")?.value || '';
            const subject = document.getElementById("subject")?.value || '';
            const message = document.getElementById("message")?.value || '';

            // Basic validation
            if (!name || !email || !message) {
                const alertMsg = currentLang === 'fr' ? 
                    'Veuillez remplir tous les champs obligatoires.' : 
                    'Please fill in all required fields.';
                alert(alertMsg);
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                const alertMsg = currentLang === 'fr' ? 
                    'Veuillez entrer une adresse email valide.' : 
                    'Please enter a valid email address.';
                alert(alertMsg);
                return;
            }

            // Always send to this recipient
            const recipient = "ctuzolana@gmail.com";
            
            // Build comprehensive mailto link
            const emailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject || 'Contact from CALP Website')}&body=${encodeURIComponent(emailBody)}`;

            // Open default mail client
            window.location.href = mailtoLink;

            // Show success message
            const successMsg = currentLang === 'fr' ? 
                'Merci pour votre message. Votre client email va s\'ouvrir.' : 
                'Thank you for your message. Your email client will open.';
            alert(successMsg);

            // Reset form
            this.reset();
        });
    }
}

// Language switcher functionality
function setupLanguageSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.dataset.lang;
            if (lang && lang !== currentLang) {
                changeLanguage(lang);
            }
        });
    });
}

// Header scroll effect
function setupScrollEffects() {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.backgroundColor = 'white';
                header.style.backdropFilter = 'none';
            }
        }
    });
}

// Initialize everything
async function initializeApp() {
    if (isInitialized) return;
    
    console.log('Initializing CALP website...');
    
    // Load translations first
    const translationsLoaded = await loadTranslations();
    
    if (!translationsLoaded) {
        console.error('Failed to load translations, using fallback');
    }
    
    // Get saved language preference or default to English
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && translations[savedLang]) {
        currentLang = savedLang;
    }
    
    // Setup all functionality
    setupMobileNavigation();
    setupSmoothScrolling();
    setupContactForm();
    setupLanguageSwitcher();
    setupScrollEffects();
    
    // Apply initial language
    changeLanguage(currentLang);
    
    isInitialized = true;
    console.log('CALP website initialized successfully');
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already ready
    initializeApp();
}