document.addEventListener('DOMContentLoaded', () => {
    // Common elements
    const dropdowns = document.querySelectorAll('.dropdown');
    const body = document.body;

    // Mobile-specific elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu'); // The side-out menu container
    const logoMobileToggle = document.getElementById('logoMobileToggle'); // Mobile logo for dark mode toggle

    // Desktop-specific elements
    const logoDesktopToggle = document.getElementById('logoToggle'); // Desktop logo for dark mode toggle

    // Profile Dropdown elements (now targeting both mobile and desktop icons)
    const profileIconDesktop = document.getElementById('profileIcon');
    const profileIconMobile = document.getElementById('profileIconMobile');
    const profileDropdownDesktop = document.getElementById('profileDropdown'); // This is the desktop profile dropdown
    const profileDropdownMobile = document.getElementById('profileDropdownMobile'); // This is the mobile profile dropdown

    // --- Helper to close all mobile dropdowns ---
    function closeAllMobileDropdowns() {
        dropdowns.forEach(drop => {
            drop.querySelector('.dropdown-content').classList.remove('show-effect');
        });
    }

    // --- Toggle Dropdown on click for Mobile ---
    function toggleDropdownMobile(event) {
        // Only apply if on mobile view
        if (window.innerWidth < 769) {
            const drop = this.closest('.dropdown');
            const content = drop.querySelector('.dropdown-content');

            if (content) { // Ensure content exists before toggling
                event.preventDefault(); // Stop link from navigating

                // Close other open mobile dropdowns
                dropdowns.forEach(otherDrop => {
                    if (otherDrop !== drop) {
                        otherDrop.querySelector('.dropdown-content').classList.remove('show-effect');
                    }
                });

                // Toggle current dropdown
                content.classList.toggle('show-effect');
            }
        }
    }

    // --- Setup for Desktop (Hover-based Dropdowns) ---
    function setupDesktopDropdowns() {
        dropdowns.forEach(drop => {
            const content = drop.querySelector('.dropdown-content');
            const anchor = drop.querySelector('a');

            // Ensure no mobile click listeners are active on desktop
            anchor.removeEventListener('click', toggleDropdownMobile);

            drop.addEventListener('mouseenter', () => {
                if (window.innerWidth >= 769) {
                    content.classList.add('show-effect');
                }
            });

            drop.addEventListener('mouseleave', () => {
                if (window.innerWidth >= 769) {
                    content.classList.remove('show-effect');
                }
            });
        });
    }


    // --- Setup for Mobile (Click-based Menu and Dropdowns) ---
    function setupMobileMenu() {
        // Mobile menu toggle (☰)
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                body.classList.toggle('menu-open'); // Add class to body for overlay/no-scroll
                closeAllMobileDropdowns(); // Close any open sub-menus when main menu opens/closes
            });
        }

        // Close menu when clicking outside (overlay)
        document.addEventListener('click', (event) => {
            if (body.classList.contains('menu-open') &&
                !navMenu.contains(event.target) &&
                !mobileMenuToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
                closeAllMobileDropdowns(); // Close all dropdowns
            }
        });

        // Add click listeners to main menu items for toggling dropdowns on mobile
        dropdowns.forEach(drop => {
            const anchor = drop.querySelector('a');
            // Remove desktop hover listeners if any were added by mistake
            drop.removeEventListener('mouseenter', setupDesktopDropdowns);
            drop.removeEventListener('mouseleave', setupDesktopDropdowns);

            anchor.addEventListener('click', toggleDropdownMobile);
        });
    }

    // --- Dark Mode Toggle Logic ---
    function setupDarkModeToggle() {
        if (window.innerWidth >= 769) { // Desktop
            if (logoDesktopToggle) {
                logoDesktopToggle.addEventListener('click', () => {
                    body.classList.toggle('dark');
                });
            }
            if (logoMobileToggle) { // Ensure mobile logo listener is off on desktop
                logoMobileToggle.removeEventListener('click', () => { body.classList.toggle('dark'); });
            }
        } else { // Mobile
            if (logoMobileToggle) {
                logoMobileToggle.addEventListener('click', () => {
                    body.classList.toggle('dark');
                });
            }
            if (logoDesktopToggle) { // Ensure desktop logo listener is off on mobile
                logoDesktopToggle.removeEventListener('click', () => { body.classList.toggle('dark'); });
            }
        }
    }

    // --- Profile Dropdown Logic ---
    function setupProfileDropdowns() {
        if (window.innerWidth < 769) { // Mobile view
            if (profileIconMobile && profileDropdownMobile) {
                // Attach click listener to the mobile profile icon
                profileIconMobile.addEventListener('click', () => {
                    profileDropdownMobile.classList.toggle('show');
                });
            }
            // Ensure desktop profile icon doesn't have a click listener for mobile behavior
            if (profileIconDesktop) {
                profileIconDesktop.removeEventListener('click', () => { profileDropdownDesktop.classList.toggle('show'); });
            }
        } else { // Desktop view
            // The CSS :hover handles desktop for profile-container
            // Ensure mobile profile icon doesn't have a click listener for desktop behavior
            if (profileIconMobile) {
                profileIconMobile.removeEventListener('click', () => { profileDropdownMobile.classList.toggle('show'); });
            }
            // Ensure desktop profile dropdown is hidden if it was accidentally shown by mobile logic
            if (profileDropdownDesktop) {
                profileDropdownDesktop.classList.remove('show');
            }
        }
    }

    // --- Close Profile Dropdown on Outside Click (Common for both) ---
    function setupCloseProfileDropdownOnOutsideClick() {
        document.addEventListener('click', (e) => {
            // Check if either desktop or mobile profile dropdown is active
            const isDesktopDropdownOpen = profileDropdownDesktop && profileDropdownDesktop.classList.contains('show');
            const isMobileDropdownOpen = profileDropdownMobile && profileDropdownMobile.classList.contains('show');

            if (
                // If the click is not on the desktop profile icon/dropdown AND
                (profileIconDesktop && !profileIconDesktop.contains(e.target) && !profileDropdownDesktop.contains(e.target) && isDesktopDropdownOpen) ||
                // If the click is not on the mobile profile icon/dropdown AND
                (profileIconMobile && !profileIconMobile.contains(e.target) && !profileDropdownMobile.contains(e.target) && isMobileDropdownOpen)
            ) {
                // Close both dropdowns just in case, or target the active one more specifically
                if (profileDropdownDesktop) profileDropdownDesktop.classList.remove('show');
                if (profileDropdownMobile) profileDropdownMobile.classList.remove('show');
            }
        });
    }

    // --- Apply Responsive Logic on Load and Resize ---
    function applyResponsiveLogic() {
        // Clean up previous event listeners to prevent duplicates/conflicts
        dropdowns.forEach(drop => {
            const anchor = drop.querySelector('a');
            anchor.removeEventListener('click', toggleDropdownMobile); // Remove mobile click
            drop.removeEventListener('mouseenter', setupDesktopDropdowns); // Remove desktop hover
            drop.removeEventListener('mouseleave', setupDesktopDropdowns); // Remove desktop hover
        });
        // Remove previous dark mode listeners
        if (logoDesktopToggle) logoDesktopToggle.removeEventListener('click', () => { body.classList.toggle('dark'); });
        if (logoMobileToggle) logoMobileToggle.removeEventListener('click', () => { body.classList.toggle('dark'); });

        // Remove previous profile icon listeners before re-adding
        if (profileIconDesktop) profileIconDesktop.removeEventListener('click', () => { profileDropdownDesktop.classList.toggle('show'); });
        if (profileIconMobile) profileIconMobile.removeEventListener('click', () => { profileDropdownMobile.classList.toggle('show'); });


        if (window.innerWidth >= 769) { // Desktop View
            setupDesktopDropdowns();
            // Ensure mobile menu is hidden and body class removed
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
            closeAllMobileDropdowns(); // Close any open mobile dropdowns
        } else { // Mobile View
            setupMobileMenu();
        }

        setupDarkModeToggle(); // Re-apply dark mode toggle listener based on current view
        setupProfileDropdowns(); // Re-apply profile dropdown logic based on current view
    }

    applyResponsiveLogic(); // Initial call when DOM is ready
    window.addEventListener('resize', applyResponsiveLogic); // Recalculate on window resize
    setupCloseProfileDropdownOnOutsideClick(); // Setup outside click listener once
});


const slides = document.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".dots");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
let index = 0;

// Create dots
slides.forEach((_, i) => {
  const dot = document.createElement("button");
  if (i === 0) dot.classList.add("active");
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".dots button");

function showSlide(i) {
  document.querySelector(".slides").style.transform = `translateX(-${i * 100}%)`;

  dots.forEach(dot => dot.classList.remove("active"));
  dots[i].classList.add("active");
}

prev.addEventListener("click", () => {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
});

next.addEventListener("click", () => {
  index = (index + 1) % slides.length;
  showSlide(index);
});

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    index = i;
    showSlide(i);
  });
});

// Start autoplay after all content is loaded
window.addEventListener("load", () => {
  setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
  }, 5000);
});
const select = document.getElementById('currency');
let rate = 0.01164; // latest from Wise :contentReference[oaicite:7]{index=7}

select.addEventListener('change', () => {
  document.querySelectorAll('.price').forEach(el => {
    const inr = +el.dataset.inr;
    if (select.value === 'USD') {
      const usd = (inr * rate).toFixed(2);
      el.textContent = `$ ${usd}`;
    } else {
      el.textContent = `₹ ${inr}`;
    }
  });
});

// Optionally fetch live rate
async function updateRate(){
  const res = await fetch('https://api.exchangerate.host/latest?base=INR&symbols=USD');
  const data = await res.json();
  rate = data.rates.USD;
  if(select.value === 'USD') select.dispatchEvent(new Event('change'));
}
updateRate();

