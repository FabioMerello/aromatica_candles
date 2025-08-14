document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const hero = document.getElementById('hero');
    const nav = document.getElementById('nav');
    const menuToggle = document.getElementById('menu-toggle');

    // Funzione per aggiornare la navbar dopo scroll
    const updateNavbarOnScroll = () => {
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        if (window.scrollY > heroBottom - 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    // Chiama subito all'apertura
    updateNavbarOnScroll();

    // Scroll listener
    window.addEventListener('scroll', updateNavbarOnScroll);

    // Toggle del menu mobile
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });

    // Chiudi menu mobile al click su un link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            menuToggle.classList.remove('active');
        });
    });

    // Scroll fluido
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetID = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetID);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Inizializzazione AOS se presente
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true });
    }
});

//swiper
const swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

// Funzione per nascondere banner
const banner = document.getElementById('cookie-banner');
const acceptBtn = document.getElementById('accept-cookies');

function hideBanner() {
    banner.classList.remove('show');
    setTimeout(() => {
        banner.style.display = 'none';
    }, 600); // aspetta la fine della transizione
}

function showBanner() {
    banner.style.display = 'flex'; // necessario per flex box
    // piccola pausa per triggerare la transizione
    setTimeout(() => {
        banner.classList.add('show');
    }, 50);
}

// Se non ha accettato, mostra il banner
if (localStorage.getItem('cookieAccepted') !== 'true') {
    showBanner();
}

acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookieAccepted', 'true');
    hideBanner();
});