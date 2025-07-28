document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.dropdown');
  const menuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const logoToggle = document.getElementById('logoToggle');
  const body = document.body;
  const navbar = document.getElementById('navbar');

  // Hover dropdown
  dropdowns.forEach(drop => {
    const content = drop.querySelector('.dropdown-content');

    drop.addEventListener('mouseenter', () => {
      content.classList.add('show-effect');
    });

    drop.addEventListener('mouseleave', () => {
      content.classList.remove('show-effect');
    });
  });

  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Logo click for dark mode toggle
  logoToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
  });
});
const dropdowns = document.querySelectorAll('.dropdown-menu');

dropdowns.forEach(menu => {
  menu.addEventListener('mouseenter', () => {
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      menu.style.left = 'auto';
      menu.style.right = '0';
    }
  });
});
document.getElementById("mobileMenuToggle").addEventListener("click", () => {
  document.getElementById("navMenu").classList.toggle("active");
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

