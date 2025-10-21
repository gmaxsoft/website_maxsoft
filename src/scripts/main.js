// src/scripts/main.js
import $ from 'jquery';
import gsap from 'gsap';
import { ScrollTrigger, ScrollToPlugin } from 'gsap/all';
import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import Swiper from 'swiper';
import { Navigation, Pagination, FreeMode, Thumbs, Mousewheel, Autoplay, Parallax, EffectFade, Scrollbar } from 'swiper/modules';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const accent = 'rgba(255, 152, 0, 1)';
const dark = '#000';
const light = '#fff';

const cursor = document.querySelector('.mil-ball');
if (cursor) {
    gsap.set(cursor, {
        xPercent: -50,
        yPercent: -50,
    });
}

/**
 * Inicjalizuje animację Preloadera.
 */
function initPreloader() {
    // Sprawdzenie, czy preloader nie został już ukryty (dla Swup)
    $('.mil-progress').hide();

    if ($('.mil-preloader').hasClass('mil-hidden')) {
        return;
    }
    const timeline = gsap.timeline();

    timeline.to(".mil-preloader-animation", {
        opacity: 1,
    });
    // ... reszta Twojego kodu preloadera ...
    timeline.fromTo(
        ".mil-animation-1 .mil-h3", {
        y: "30px",
        opacity: 0
    }, {
        y: "0px",
        opacity: 1,
        stagger: 0.4
    });
    timeline.to(".mil-animation-1 .mil-h3", {
        opacity: 0,
        y: '-30',
    }, "+=.3");
    timeline.fromTo(".mil-reveal-box", 0.1, {
        opacity: 0,
    }, {
        opacity: 1,
        x: '-30',
    });
    timeline.to(".mil-reveal-box", 0.45, {
        width: "100%",
        x: 0,
    }, "+=.1");
    timeline.to(".mil-reveal-box", {
        right: "0"
    });
    timeline.to(".mil-reveal-box", 0.3, {
        width: "0%"
    });
    timeline.fromTo(".mil-animation-2 .mil-h3", {
        opacity: 0,
    }, {
        opacity: 1,
    }, "-=.5");
    timeline.to(".mil-animation-2 .mil-h3", 0.6, {
        opacity: 0,
        y: '-30'
    }, "+=.5");
    timeline.to(".mil-preloader", 0.8, {
        opacity: 0,
        ease: 'sine',
    }, "+=.2");
    timeline.fromTo(".mil-up", 0.8, {
        opacity: 0,
        y: 40,
        scale: .98,
        ease: 'sine',
    }, {
        y: 0,
        opacity: 1,
        scale: 1,
        onComplete: function () {
            $('.mil-preloader').addClass("mil-hidden");
        },
    }, "-=1");
}

/**
 * Uruchamia smooth scroll do kotwic.
 */
function initAnchorScroll() {
    $(document).off('click', 'a[href^="#"]').on('click', 'a[href^="#"]', function (event) {
        event.preventDefault();

        $('.mil-progress').show();
        // Pobieramy target (np. "#seccja-o-nas" lub "#")
        var target = $(this).attr('href');

        // Definiujemy offset (jeśli masz np. stałe menu)
        var offset = $(window).width() < 1200 ? 90 : 0;

        gsap.to(window, {
            duration: 0.8, // Dłuższa animacja dla lepszego efektu
            scrollTo: {
                y: target,
                offset: offset
            },
            ease: 'power2.inOut' // Lepszy easing
        });
    });
}

/**
 * Klonuje i dodaje elementy DOM.
 */
function initAppendElements() {
    // Usuwamy istniejące (tylko w reinit)
    $(".mil-arrow-place .mil-arrow, .mil-animation .mil-dodecahedron, .mil-current-page a").remove();

    // Dodajemy nowe
    $(".mil-arrow").clone().appendTo(".mil-arrow-place");
    $(".mil-dodecahedron").clone().appendTo(".mil-animation");
    $(".mil-lines").clone().appendTo(".mil-lines-place");
    $(".mil-main-menu ul li.mil-active > a").clone().appendTo(".mil-current-page");
}

/**
 * Inicjalizuje akordeon GSAP.
 */
function initAccordion() {
    let groups = gsap.utils.toArray(".mil-accordion-group");
    if (groups.length === 0) return; // Zapobiega błędom, gdy elementów nie ma

    let menus = groups.map(g => g.querySelector(".mil-accordion-menu"));
    let menuToggles = groups.map(createAnimation);

    menus.forEach((menu) => {
        // Użycie .off().on() dla bezpieczeństwa w reinit
        $(menu).off('click').on('click', () => toggleMenu(menu));
    });

    function toggleMenu(clickedMenu) {
        menuToggles.forEach((toggleFn) => toggleFn(clickedMenu));
    }

    function createAnimation(element) {
        let menu = element.querySelector(".mil-accordion-menu");
        let box = element.querySelector(".mil-accordion-content");
        let symbol = element.querySelector(".mil-symbol");
        let minusElement = element.querySelector(".mil-minus");
        let plusElement = element.querySelector(".mil-plus");

        gsap.set(box, { height: "auto" });

        let animation = gsap
            .timeline({ paused: true }) // Używamy paused: true zamiast .reverse()
            .from(box, {
                height: 0,
                duration: 0.4,
                ease: "sine"
            })
            .from(minusElement, { duration: 0.4, autoAlpha: 0, ease: "none" }, 0)
            .to(plusElement, { duration: 0.4, autoAlpha: 0, ease: "none" }, 0)
            .to(symbol, { background: accent, ease: "none" }, 0)
            .reverse();

        return function (clickedMenu) {
            if (clickedMenu === menu) {
                animation.reversed(!animation.reversed());
            } else {
                animation.reverse();
            }
        };
    }
}

/**
 * Inicjalizuje przycisk powrotu na górę.
 */
function initBackToTop() {
    $('.mil-back-to-top a').on('click', function (e) {
        // 1. Zapobiegamy domyślnej akcji (natychmiastowe przejście)
        e.preventDefault();

        const target = $(this).attr('href'); // Powinno być '#top'

        // 2. Używamy GSAP ScrollToPlugin
        gsap.to(window, {
            duration: 1.0, // Czas trwania animacji (np. 1 sekunda)
            scrollTo: {
                y: target, // Przewiń do elementu docelowego (np. #top)
                offset: 0 // Bez offsetu
            },
            ease: 'power3.inOut' // Płynne przejście
        });

        // W przeciwnym razie, jeśli to tylko prosty skok:
        // $('html, body').animate({ scrollTop: 0 }, 500); // 500ms animacji jQuery
    });
}

/**
 * Inicjalizuje logikę niestandardowego kursora.
 * W Astro/Swup najlepiej jest użyć jednego globalnego event listenera pointermove.
 */
function initCursor() {
    if (!cursor) return;

    // Funkcja ruchu kursora - powinna być raz dodana, ale JQuery mouseover/mouseleave
    // musi być reinicjalizowany, bo selektory działają tylko na obecnym DOM.
    // Upewnij się, że ten listener jest dodany tylko raz.
    if (!document.cursorMoveListener) {
        document.cursorMoveListener = function (e) {
            gsap.to(cursor, {
                duration: 0.6,
                ease: 'sine',
                x: e.clientX,
                y: e.clientY,
            });
        };
        document.addEventListener('pointermove', document.cursorMoveListener);
    }


    // Zresetuj wszystkie powiązane zdarzenia
    $(document).off('.cursorEvents');

    // Zdarzenia najechania: powiększenie
    $(document).on('mouseover.cursorEvents', '.mil-drag, .mil-more, .mil-choose', function () {
        gsap.to(cursor, .2, { width: 90, height: 90, opacity: 1, ease: 'sine' });
    }).on('mouseleave.cursorEvents', '.mil-drag, .mil-more, .mil-choose', function () {
        gsap.to(cursor, .2, { width: 20, height: 20, opacity: .1, ease: 'sine' });
    });

    // Zdarzenia akcentowania kolorem
    $(document).on('mouseover.cursorEvents', '.mil-accent-cursor', function () {
        gsap.to(cursor, .2, { background: accent, ease: 'sine' });
        $(cursor).addClass('mil-accent');
    }).on('mouseleave.cursorEvents', '.mil-accent-cursor', function () {
        gsap.to(cursor, .2, { background: dark, ease: 'sine' });
        $(cursor).removeClass('mil-accent');
    });

    // Zdarzenia tekstu/ikony w kursorze
    $(document).on('mouseover.cursorEvents', '.mil-drag', function () {
        gsap.to($('.mil-ball .mil-icon-1'), .2, { scale: '1', ease: 'sine' });
    }).on('mouseleave.cursorEvents', '.mil-drag', function () {
        gsap.to($('.mil-ball .mil-icon-1'), .2, { scale: '0', ease: 'sine' });
    });

    $(document).on('mouseover.cursorEvents', '.mil-more', function () {
        gsap.to($('.mil-ball .mil-more-text'), .2, { scale: '1', ease: 'sine' });
    }).on('mouseleave.cursorEvents', '.mil-more', function () {
        gsap.to($('.mil-ball .mil-more-text'), .2, { scale: '0', ease: 'sine' });
    });

    $(document).on('mouseover.cursorEvents', '.mil-choose', function () {
        gsap.to($('.mil-ball .mil-choose-text'), .2, { scale: '1', ease: 'sine' });
    }).on('mouseleave.cursorEvents', '.mil-choose', function () {
        gsap.to($('.mil-ball .mil-choose-text'), .2, { scale: '0', ease: 'sine' });
    });

    // Zdarzenia ukrycia kursora
    const hideSelector = 'a:not(".mil-choose , .mil-more , .mil-drag , .mil-accent-cursor"), input , textarea, .mil-accordion-menu';
    $(document).on('mouseover.cursorEvents', hideSelector, function () {
        gsap.to(cursor, .2, { scale: 0, ease: 'sine' });
        gsap.to($('.mil-ball svg'), .2, { scale: 0 });
    }).on('mouseleave.cursorEvents', hideSelector, function () {
        gsap.to(cursor, .2, { scale: 1, ease: 'sine' });
        gsap.to($('.mil-ball svg'), .2, { scale: 1 });
    });

    // Zdarzenia kliknięcia
    $('body').off('mousedown.cursorEvents').on('mousedown.cursorEvents', function () {
        gsap.to(cursor, .2, { scale: .1, ease: 'sine' });
    }).off('mouseup.cursorEvents').on('mouseup.cursorEvents', function () {
        gsap.to(cursor, .2, { scale: 1, ease: 'sine' });
    });
}

/**
 * Przełącza menu i przycisk menu (menu-btn).
 */
function initMenuToggle() {
    $('.mil-menu-btn').off("click").on("click", function () {
        $('.mil-menu-btn').toggleClass('mil-active');
        $('.mil-menu').toggleClass('mil-active');
        $('.mil-menu-frame').toggleClass('mil-active');
        $('.mil-progress').hide();
    });
}

/**
 * Inicjalizuje podmenu (dropdown).
 */
function initMainMenuDropdown() {
    $('.mil-has-children a').off('click').on('click', function () {
        // Logika powinna resetować inne podmenu, a następnie przełączać kliknięte
        const $link = $(this);
        const $ul = $link.next();

        // Jeśli kliknięty element jest już aktywny, po prostu go zamknij
        if ($link.hasClass('mil-active')) {
            $link.removeClass('mil-active');
            $ul.removeClass('mil-active');
            return;
        }

        // Zamknij wszystkie inne aktywne
        $('.mil-has-children ul').removeClass('mil-active');
        $('.mil-has-children a').removeClass('mil-active');

        // Otwórz kliknięty
        $link.addClass('mil-active');
        $ul.addClass('mil-active');
    });
}

/**
 * Inicjalizuje animacje ScrollTrigger
 */
function initScrollAnimations() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    $('.mil-progress').show();

    // Progressbar
    gsap.to('.mil-progress', {
        height: '100%',
        ease: 'sine',
        scrollTrigger: {
            scrub: 0.3
        }
    });

    // Appearance (mil-up)
    const appearance = document.querySelectorAll(".mil-up");
    appearance.forEach((section) => {
        gsap.fromTo(section, {
            opacity: 0, y: 40, scale: .98, ease: 'sine',
        }, {
            y: 0, opacity: 1, scale: 1, duration: .4,
            scrollTrigger: {
                trigger: section,
                toggleActions: 'play none none reverse',
            }
        });
    });

    // Scale Image (mil-scale)
    const scaleImage = document.querySelectorAll(".mil-scale");
    scaleImage.forEach((section) => {
        var value1 = $(section).data("value-1");
        var value2 = $(section).data("value-2");
        gsap.fromTo(section, {
            ease: 'sine', scale: value1,
        }, {
            scale: value2,
            scrollTrigger: {
                trigger: section, scrub: true, toggleActions: 'play none none reverse',
            }
        });
    });

    // Parallax Image (mil-parallax)
    const parallaxImage = document.querySelectorAll(".mil-parallax");
    if ($(window).width() > 960) {
        parallaxImage.forEach((section) => {
            var value1 = $(section).data("value-1");
            var value2 = $(section).data("value-2");
            gsap.fromTo(section, {
                ease: 'sine', y: value1,
            }, {
                y: value2,
                scrollTrigger: {
                    trigger: section, scrub: true, toggleActions: 'play none none reverse',
                }
            });
        });
    }

    // Rotate (mil-rotate)
    const rotate = document.querySelectorAll(".mil-rotate");
    rotate.forEach((section) => {
        var value = $(section).data("value");
        gsap.fromTo(section, {
            ease: 'sine', rotate: 0,
        }, {
            rotate: value,
            scrollTrigger: {
                trigger: section, scrub: true, toggleActions: 'play none none reverse',
            }
        });
    });

    // Odświeżenie ScrollTrigger na końcu (ważne)
    ScrollTrigger.refresh();
}

/**
 * Inicjalizuje Fancybox.
 */
function initFancybox() {
    // Sprawdź, czy obiekt Fancybox został poprawnie załadowany
    if (typeof Fancybox === 'undefined') {
        console.warn('Fancybox library not loaded.');
        return;
    }

    // Inicjalizacja Fancybox z obiektu, który zaimportowaliśmy
    // Nowa wersja używa natywnych selektorów CSS (a nie jQuery)
    Fancybox.bind("[data-fancybox='gallery']", {
        // Parametry są przekazywane bezpośrednio do metody bind/show
        // Nazwy parametrów są lekko zmienione
        // 'slideShow' to teraz 'Slideshow'
        Toolbar: {
            display: {
                left: ["infobar"],
                middle: ["zoomIn", "zoomOut"],
                right: ["slideshow", "fullscreen", "close"], // 'slideshow' (mała litera)
            },
        },
        // Możesz użyć 'groupAll: true' lub po prostu upewnić się, że tagi mają ten sam atrybut 'data-fancybox'.
        // Upewnij się, że element hash jest również skonfigurowany, jeśli chcesz go wyłączyć:
        Hash: false
    });
}

/**
 * Inicjalizuje wszystkie Swiper slidery.
 */
function initSwipers() {

    // Sprawdzenie, czy istnieją slidery do zainicjowania, używając natywnego JS
    const reviewsSliderExists = document.querySelector('.mil-reviews-slider');
    const infiniteSliderExists = document.querySelector('.mil-infinite-show');
    const portfolioSliderExists = document.querySelector('.mil-portfolio-slider');

    if (!reviewsSliderExists && !infiniteSliderExists) {
        console.log('Brak elementów Swiper do inicjalizacji.');
    }
    else {
        const menu = ['<div class="mil-custom-dot mil-slide-1"></div>', '<div class="mil-custom-dot mil-slide-2"></div>', '<div class="mil-custom-dot mil-slide-3"></div>', '<div class="mil-custom-dot mil-slide-4"></div>', '<div class="mil-custom-dot mil-slide-5"></div>', '<div class="mil-custom-dot mil-slide-6"></div>', '<div class="mil-custom-dot mil-slide-7"></div>']

        var reviewsSwiper = new Swiper('.mil-reviews-slider', {
            modules: [Navigation, Pagination, Parallax, EffectFade],
            pagination: {
                el: '.mil-revi-pagination',
                clickable: true,
                renderBullet: function (index, className) {
                    return '<span class="' + className + '">' + (menu[index]) + '</span>';
                },
            },
            speed: 800,
            effect: 'fade',
            parallax: true,
            navigation: {
                nextEl: '.mil-revi-next',
                prevEl: '.mil-revi-prev',
            },
        });

        var infiniteSwiper = new Swiper('.mil-infinite-show', {
            modules: [Navigation, Pagination, FreeMode, Thumbs, Mousewheel, Autoplay],
            slidesPerView: 2,
            spaceBetween: 30,
            speed: 5000,
            autoplay: true,
            autoplay: {
                delay: 0,
            },
            loop: true,
            freeMode: true,
            breakpoints: {
                992: {
                    slidesPerView: 4,
                },
            },
        });
    }

    if (!portfolioSliderExists) {
        console.log('Brak elementów Swiper Portfolio do inicjalizacji.');
    }
    else {
        var swiper = new Swiper('.mil-portfolio-slider', {
            modules: [Navigation, Pagination, Parallax, Mousewheel, Autoplay],
            slidesPerView: 1,
            spaceBetween: 0,
            speed: 4800,
            parallax: true,
            autoplay: true,
            autoplay: {
                delay: 0,
            },
            mousewheel: {
                enable: true
            },
            navigation: {
                nextEl: '.mil-portfolio-next',
                prevEl: '.mil-portfolio-prev',
            },
            pagination: {
                el: '.swiper-portfolio-pagination',
                type: 'fraction',
            },
        });
    }
}

// ----------------------------------------------------
// ## GŁÓWNA INICJALIZACJA
// ----------------------------------------------------

/**
 * Główna funkcja inicjalizująca całą aplikację.
 */
function initApp() {

    initAnchorScroll();
    initAppendElements();
    initScrollAnimations();
    initAccordion();
    initCursor();
    initBackToTop();
    initSwipers();
    initMenuToggle();
    initMainMenuDropdown();
    initFancybox();

    document.querySelector('.mil-menu-btn')?.classList.remove('mil-active');
    document.querySelector('.mil-menu')?.classList.remove('mil-active');
    document.querySelector('.mil-menu-frame')?.classList.remove('mil-active');
}

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initApp();
    const form = document.getElementById('contactform');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Zablokuj domyślną wysyłkę

            const formData = new FormData(form);
            const statusMessage = document.createElement('p');
            statusMessage.classList.add('mil-up');

            // Przykład: Dodaj jakiś loader

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    statusMessage.style.color = 'green';
                    statusMessage.textContent = result.message || 'Wiadomość wysłana pomyślnie!';
                    form.reset(); // Wyczyść formularz
                } else {
                    statusMessage.style.color = 'red';
                    statusMessage.textContent = result.message || 'Błąd wysyłki!';
                }
            } catch (error) {
                console.error('Wystąpił błąd sieci:', error);
                statusMessage.style.color = 'red';
                statusMessage.textContent = 'Błąd serwera. Spróbuj ponownie.';
            }

            // Dodaj komunikat o statusie (możesz to zrobić ładniej w Twoim designie)
            form.after(statusMessage);
        });
    }
});
