// Load navbar and footer components
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
    }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    await loadComponent('navbar-placeholder', 'navbar.html');
    await loadComponent('footer-placeholder', 'footer.html');
    
    // Initialize navbar functionality after loading
    initializeNavbar();
});

// Initialize navbar toggle functionality
function initializeNavbar() {
    const checkbox = document.querySelector("#checkbox");
    const menu = document.querySelector(".menu");
    const menuLinks = document.querySelectorAll(".navitems");

    if (checkbox && menu) {
        checkbox.addEventListener("change", () => {
            console.log("Checkbox changed:", checkbox.checked);
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
        console.error("Checkbox or menu not found");
    }
}
