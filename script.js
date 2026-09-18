/* =========================================================
   GOODLUCK DIGITAL WEBSITE
   MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ================= ELEMENTS ================= */

    const header = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const navLinks = document.querySelectorAll(".nav-link");

    const contactForm = document.getElementById("contactForm");
    const submitButton = document.getElementById("submitButton");
    const buttonText = document.querySelector(".button-text");
    const buttonArrow = document.querySelector(".button-arrow");

    const formStatus = document.getElementById("formStatus");
    const replyTo = document.getElementById("replyTo");

    const currentYear = document.getElementById("currentYear");
    const backToTop = document.getElementById("backToTop");


    /* ================= CURRENT YEAR ================= */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* ================= MOBILE MENU ================= */

    function openMenu() {

        if (!mainNav || !menuToggle) {
            return;
        }

        mainNav.classList.add("open");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");

        document.body.classList.add("menu-open");
    }


    function closeMenu() {

        if (!mainNav || !menuToggle) {
            return;
        }

        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

        document.body.classList.remove("menu-open");
    }


    if (menuToggle) {

        menuToggle.addEventListener("click", () => {

            const isOpen = mainNav.classList.contains("open");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }

        });

    }


    /* Close mobile menu after clicking navigation link */

    navLinks.forEach((link) => {

        link.addEventListener("click", () => {

            closeMenu();

        });

    });


    /* Close menu when clicking outside */

    document.addEventListener("click", (event) => {

        if (!mainNav || !menuToggle) {
            return;
        }

        if (
            mainNav.classList.contains("open") &&
            !mainNav.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {

            closeMenu();

        }

    });


    /* Close menu when Escape is pressed */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            closeMenu();
        }

    });


    /* ================= HEADER SCROLL EFFECT ================= */

    function updateHeader() {

        if (!header) {
            return;
        }

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    }


    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();


    /* ================= ACTIVE NAVIGATION ================= */

    const sections = document.querySelectorAll("main section[id]");

    function updateActiveNavigation() {

        const scrollPosition = window.scrollY + 150;

        let currentSection = "";

        sections.forEach((section) => {

            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight
            ) {

                currentSection = section.getAttribute("id");

            }

        });


        navLinks.forEach((link) => {

            link.classList.remove("active");

            const target = link.getAttribute("href");

            if (target === `#${currentSection}`) {
                link.classList.add("active");
            }

        });

    }


    window.addEventListener("scroll", updateActiveNavigation, {
        passive: true
    });

    updateActiveNavigation();


    /* ================= SCROLL REVEAL ================= */

    const revealElements = document.querySelectorAll(".reveal");


    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );


        revealElements.forEach((element) => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach((element) => {

            element.classList.add("visible");

        });

    }


    /* ================= BACK TO TOP ================= */

    function updateBackToTop() {

        if (!backToTop) {
            return;
        }

        if (window.scrollY > 600) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }

    }


    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });

    updateBackToTop();


    if (backToTop) {

        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* ================= CONTACT FORM ================= */

    if (contactForm) {

        contactForm.addEventListener("submit", async (event) => {

            event.preventDefault();


            /* Prevent accidental double submission */

            if (submitButton.disabled) {
                return;
            }


            /* Reset status */

            formStatus.className = "form-status";
            formStatus.textContent = "";


            /* Get visitor email */

            const emailInput = document.getElementById("email");

            if (emailInput && replyTo) {
                replyTo.value = emailInput.value.trim();
            }


            /* Save original button text */

            const originalText = buttonText
                ? buttonText.textContent
                : "Send Project Inquiry";


            /* Loading state */

            submitButton.disabled = true;

            if (buttonText) {
                buttonText.textContent = "Sending...";
            }

            if (buttonArrow) {
                buttonArrow.textContent = "•";
            }


            try {

                const formData = new FormData(contactForm);

                const response = await fetch(
                    contactForm.action,
                    {
                        method: "POST",
                        headers: {
                            "Accept": "application/json"
                        },
                        body: formData
                    }
                );


                let result = {};

                try {
                    result = await response.json();
                } catch (jsonError) {
                    result = {};
                }


                if (response.ok && (result.success === true || !result.success)) {

                    formStatus.className = "form-status success";

                    formStatus.textContent =
                        "Thank you. Your message has been sent successfully. I will review your inquiry and get back to you.";

                    contactForm.reset();

                    if (replyTo) {
                        replyTo.value = "";
                    }


                    /* Bring success message into view */

                    setTimeout(() => {

                        formStatus.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    }, 100);

                } else {

                    throw new Error(
                        result.message ||
                        "The form could not be submitted."
                    );

                }

            } catch (error) {

                console.error("Contact form error:", error);

                formStatus.className = "form-status error";

                formStatus.textContent =
                    "Sorry, your message could not be sent right now. Please contact me directly by email or WhatsApp.";

            } finally {

                submitButton.disabled = false;

                if (buttonText) {
                    buttonText.textContent = originalText;
                }

                if (buttonArrow) {
                    buttonArrow.textContent = "→";
                }

            }

        });

    }


    /* ================= DYNAMIC CANONICAL URL ================= */

    /*
       This automatically updates the canonical URL to the domain
       currently being used. When you later connect your professional
       custom domain, the website will automatically use that domain.
    */

    const canonicalLink = document.querySelector(
        'link[rel="canonical"]'
    );

    if (canonicalLink && window.location.hostname) {

        const hostname = window.location.hostname;

        if (
            hostname !== "localhost" &&
            hostname !== "127.0.0.1" &&
            !hostname.endsWith(".local")
        ) {

            canonicalLink.href =
                `${window.location.origin}${window.location.pathname}`;

        }

    }


    /* ================= DYNAMIC SOCIAL URL ================= */

    /*
       Update Open Graph URL when the website is opened on the
       final professional domain.
    */

    const ogUrl = document.querySelector(
        'meta[property="og:url"]'
    );

    if (ogUrl && window.location.hostname) {

        const hostname = window.location.hostname;

        if (
            hostname !== "localhost" &&
            hostname !== "127.0.0.1" &&
            !hostname.endsWith(".local")
        ) {

            ogUrl.setAttribute(
                "content",
                window.location.origin + window.location.pathname
            );

        }

    }


    /* ================= IMAGE ERROR HANDLING ================= */

    const images = document.querySelectorAll("img");

    images.forEach((image) => {

        image.addEventListener("error", () => {

            image.style.background =
                "linear-gradient(135deg, #071a3d, #165dff)";

            image.style.minHeight = "200px";

            image.removeAttribute("src");

        });

    });


    /* ================= SMOOTH ANCHOR HANDLING ================= */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight +
                1;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

        });

    });


    /* ================= PAGE READY ================= */

    document.documentElement.classList.add("js-ready");

});