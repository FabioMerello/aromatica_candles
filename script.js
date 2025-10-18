document.addEventListener('DOMContentLoaded', () => {
    // ====== NAVBAR / HERO SAFE ======
    const navbar = document.getElementById('navbar');
    const hero = document.getElementById('hero') || document.querySelector('.hero'); // fallback per pagine categoria
    const nav = document.getElementById('nav');
    const menuToggle = document.getElementById('menu-toggle');

    const updateNavbarOnScroll = () => {
        if (!navbar) return;
        if (hero) {
            const heroBottom = hero.offsetTop + hero.offsetHeight;
            if (window.scrollY > heroBottom - 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        } else {
            // Se non c'è hero (pagine categoria), applica scrolled dopo poco scroll
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    };

    updateNavbarOnScroll();
    window.addEventListener('scroll', updateNavbarOnScroll);

    // ====== MENU TOGGLE (robusto) ======
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('open');
            menuToggle.classList.toggle('active');
            const opened = nav.classList.contains('open');
            menuToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });

        // Chiudi il menu al click su un link (UX mobile)
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ====== SCROLL FLUIDO (solo anchor locali "#") ======
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href') || '';
            // Solo se l'anchor è locale (#qualcosa). Per link tipo "index.html#about" non intercettiamo.
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetID = href.substring(1);
                const targetElement = document.getElementById(targetID);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ====== AOS (se presente) ======
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true });
    }

    // ====== SWIPER (solo se presente nella pagina) ======
    if (typeof Swiper !== 'undefined' && document.querySelector('.mySwiper')) {
        new Swiper('.mySwiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: { delay: 2500, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        });
    }

    // ====== COOKIE BANNER (solo se presente nella pagina) ======
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');

    if (banner && acceptBtn) {
        function hideBanner() {
            banner.classList.remove('show');
            setTimeout(() => { banner.style.display = 'none'; }, 600);
        }
        function showBanner() {
            banner.style.display = 'flex';
            setTimeout(() => { banner.classList.add('show'); }, 50);
        }
        if (localStorage.getItem('cookieAccepted') !== 'true') {
            showBanner();
        }
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            hideBanner();
        });
    }

    // ====== FILTRI PRODOTTI (sezione categoria) ======
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        const searchInput = document.getElementById('search-input');       // testo libero
        const sortPrice = document.getElementById('sort-price');           // default | asc | desc
        const categoryFilter = document.getElementById('filter-category'); // all | candela | set | ...
        const priceBand = document.getElementById('filter-price');         // all | low | mid | high

        const getCards = () => Array.from(productsGrid.querySelectorAll('.product-card'));

        function matchesPriceBand(price, band) {
            if (band === 'low') return price < 15;
            if (band === 'mid') return price >= 15 && price <= 20;
            if (band === 'high') return price > 20;
            return true; // 'all'
        }

        function applyFilters() {
            const text = (searchInput?.value || '').toLowerCase();
            const cat = categoryFilter?.value || 'all';
            const band = priceBand?.value || 'all';

            getCards().forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
                const price = parseFloat(card.dataset.price || '0');
                const cardCat = card.dataset.category || '';

                const okText = title.includes(text) || desc.includes(text);
                const okCat = (cat === 'all') || (cardCat === cat);
                const okPrice = matchesPriceBand(price, band);

                card.style.display = (okText && okCat && okPrice) ? 'flex' : 'none';
            });
        }

        function applySort() {
            if (!sortPrice || sortPrice.value === 'default') return;
            const cards = getCards();

            cards.sort((a, b) => {
                const pa = parseFloat(a.dataset.price || '0');
                const pb = parseFloat(b.dataset.price || '0');
                return sortPrice.value === 'asc' ? pa - pb : pb - pa;
            });

            // Ri-append solo le card visibili, mantenendo anche quelle nascoste in fondo
            const visible = cards.filter(c => c.style.display !== 'none');
            const hidden = cards.filter(c => c.style.display === 'none');

            productsGrid.innerHTML = '';
            visible.concat(hidden).forEach(c => productsGrid.appendChild(c));
        }

        function updateList() {
            applyFilters();
            applySort();
        }

        // Event listeners (solo se gli elementi esistono)
        if (searchInput) searchInput.addEventListener('input', updateList);
        if (sortPrice) sortPrice.addEventListener('change', updateList);
        if (categoryFilter) categoryFilter.addEventListener('change', updateList);
        if (priceBand) priceBand.addEventListener('change', updateList);

        // Prima applicazione
        updateList();
    }
});


// LEGGI DI PIù
document.querySelectorAll('.show-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const fullDesc = btn.nextElementSibling;

        if (fullDesc.style.maxHeight && fullDesc.style.maxHeight !== '0px') {
            // Chiudi
            fullDesc.style.maxHeight = '0';
            fullDesc.style.opacity = 0;
            btn.textContent = 'Leggi di più';
        } else {
            // Apri
            fullDesc.style.maxHeight = fullDesc.scrollHeight + 'px';
            fullDesc.style.opacity = 1;
            btn.textContent = 'Chiudi';
        }
    });
});



// FORM PRODOTTI
document.querySelectorAll('.toggle-form-btn').forEach(button => {
    button.addEventListener('click', () => {
        const form = button.nextElementSibling;
        form.classList.toggle('active');
        button.textContent = form.classList.contains('active')
            ? 'Chiudi Modulo ✖'
            : 'Richiedi Preventivo';
    });
});


// FAQ toggle
document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
        const answer = btn.nextElementSibling;
        btn.classList.toggle("active");
        if (answer.style.display === "block") {
            answer.style.display = "none";
            btn.querySelector("span").textContent = "+";
        } else {
            answer.style.display = "block";
            btn.querySelector("span").textContent = "−";
        }
    });
});

// costo variabile prodotti
document.addEventListener("DOMContentLoaded", () => {
    const sizeSelect = document.getElementById("size");
    const packagingSelect = document.getElementById("packaging");
    const priceDisplay = document.getElementById("teddy-price");

    const prices = {
        no: { S: 2.5, M: 4, L: 6.5 },
        yes: { S: 4.5, M: 6, L: 8.5 }
    };

    function updatePrice() {
        const size = sizeSelect.value;
        const pack = packagingSelect.value;
        const price = prices[pack][size];
        priceDisplay.textContent = `€${price.toFixed(2).replace('.', ',')}`;
    }

    sizeSelect.addEventListener("change", updatePrice);
    packagingSelect.addEventListener("change", updatePrice);

    updatePrice();

    // Gestione "Leggi di più"
    document.querySelectorAll(".show-more-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const desc = btn.nextElementSibling;
            desc.classList.toggle("active");
            btn.textContent = desc.classList.contains("active")
                ? "Nascondi dettagli"
                : "Dettagli tecnici";
        });
    });

    // Gestione form a comparsa
    document.querySelectorAll(".toggle-form-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const form = btn.nextElementSibling;
            form.classList.toggle("active");
        });
    });
});











// Counter animati
const counters = document.querySelectorAll('.counter');
let countersStarted = false;

function animateCounters() {
    counters.forEach(counter => {
        const update = () => {
            const target = +counter.getAttribute('data-target');
            const current = +counter.innerText;
            const increment = Math.ceil(target / 100);

            if (current < target) {
                counter.innerText = current + increment;
                setTimeout(update, 30);
            } else {
                counter.innerText = target;
            }
        };
        update();
    });
}

window.addEventListener('scroll', () => {
    const section = document.querySelector('#counters');
    const sectionPos = section.getBoundingClientRect().top;
    const screenPos = window.innerHeight;
    if (sectionPos < screenPos && !countersStarted) {
        animateCounters();
        countersStarted = true;
    }
});