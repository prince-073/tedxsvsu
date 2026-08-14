const componentFallbacks = {
    "navbar-placeholder": `
      <section class="navbar-section">
        <nav class="navbar" aria-label="Primary navigation">
          <div class="logo">
            <a href="index.html#main" aria-label="TEDxSVSU home">
              <h1><span class="red">TEDxSVSU</span></h1>
            </a>
            <details class="season-switcher">
              <summary>Season 2</summary>
              <div class="season-menu">
                <a href="index.html#main" class="season-option active-season">
                  <span>Season 2</span>
                  <small>Current chapter</small>
                </a>
                <a href="season1-talks.html" class="season-option">
                  <span>Season 1 Talks</span>
                  <small>Watch the archive</small>
                </a>
              </div>
            </details>
          </div>
          <ul class="menu">
            <a href="index.html#who-we-are" class="navitems"><li>About</li></a>
            <a href="index.html#speakers" class="navitems"><li>Speakers</li></a>
            <a href="index.html#timeline" class="navitems"><li>Schedule</li></a>
            <a href="index.html#event-gallery" class="navitems"><li>Gallery</li></a>
            <a href="index.html#team" class="navitems"><li>Team</li></a>
          </ul>
          <button class="nav-cta register-soon-trigger" type="button">Register Now</button>
          <input type="checkbox" id="checkbox" aria-label="Toggle navigation">
          <label for="checkbox" class="toggle" aria-hidden="true">
            <div class="bars" id="bar1"></div>
            <div class="bars" id="bar2"></div>
            <div class="bars" id="bar3"></div>
          </label>
        </nav>
      </section>
    `,
    "footer-placeholder": `
      <section class="footer-section">
        <footer>
          <div class="footer-copy">
            <p>Copyright 2026 TEDx Shri Vishwakarma Skill University. All Rights Reserved.</p>
            <p class="footer-contact">
              Contact:
              <a href="tel:+918920985602">+91 8920985602</a>
              <span>|</span>
              <a class="footer-email" href="mailto:iaayusharya@gmail.com">iaayusharya@gmail.com</a>
            </p>
            <p class="visitor-count" aria-live="polite">
              <span class="visitor-count__label">Live Footfall</span>
              <span id="visitor-count-value" class="visitor-count__value">Counting soon</span>
            </p>
          </div>
          <div class="social-icons" aria-label="Social links">
            <a href="https://www.instagram.com/tedx_svsu/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.linkedin.com/company/tedxsvsu/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="contact.html">Contact</a>
          </div>
        </footer>
      </section>
    `
};

// Load navbar and footer components
async function loadComponent(elementId, filePath) {
    const target = document.getElementById(elementId);
    if (!target) return;

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Unable to load ${filePath}`);
        }
        const html = await response.text();
        target.innerHTML = html;
    } catch (error) {
        if (!target.innerHTML.trim() && componentFallbacks[elementId]) {
            target.innerHTML = componentFallbacks[elementId];
        }
    }
}

function initializeVisitorCounter() {
    const counter = document.getElementById("visitor-count-value");
    if (!counter) return;

    if (window.__tedxVisitorCounterStarted) {
        return;
    }

    window.__tedxVisitorCounterStarted = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4500);

    fetch("https://counterapi.com/api/tedxsvsu.in/view/season-2", {
        signal: controller.signal,
        cache: "no-store"
    })
        .then((response) => {
            if (!response.ok) throw new Error("Visitor counter unavailable");
            return response.json();
        })
        .then((data) => {
            const value = Number(data.value);
            counter.textContent = Number.isFinite(value) ? value.toLocaleString("en-IN") : "Counting soon";
        })
        .catch(() => {
            counter.textContent = "Counting soon";
        })
        .finally(() => {
            window.clearTimeout(timeout);
        });
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    await loadComponent('navbar-placeholder', 'navbar.html');
    await loadComponent('footer-placeholder', 'footer.html');
    initializeVisitorCounter();
    
    // Initialize navbar functionality after loading
    initializeNavbar();
});

// Initialize navbar toggle functionality
function initializeNavbar() {
    const checkbox = document.querySelector("#checkbox");
    const menu = document.querySelector(".menu");
    const menuLinks = document.querySelectorAll(".navitems");
    const navbarSection = document.querySelector(".navbar-section");

    function updateNavState() {
        if (!navbarSection) return;
        navbarSection.classList.toggle("nav-scrolled", window.scrollY > 12);
    }

    updateNavState();
    window.addEventListener("scroll", updateNavState, { passive: true });

    if (checkbox && menu) {
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                menu.classList.add("activeMenu");
            } else {
                menu.classList.remove("activeMenu");
            }
        });

        // Close menu when clicking on a link
        menuLinks.forEach(link => {
            link.addEventListener("click", () => {
                checkbox.checked = false;
                menu.classList.remove("activeMenu");
            });
        });
    } else {
        return;
    }
}
