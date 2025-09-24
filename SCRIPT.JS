document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ script.js loaded and running!");

  // ======================
  // Toggle menu (mobile)
  // ======================
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // ======================
  // Typing Effect
  // ======================
  const texts = ["Soft Skills Trainer", "IELTS Coach", "Corporate Speaker"];
  let count = 0;
  let index = 0;
  let currentText = "";
  let letter = "";
  const typingElement = document.querySelector(".typing-text");

  (function type() {
    if (!typingElement) return;
    if (count === texts.length) count = 0;
    currentText = texts[count];
    letter = currentText.slice(0, ++index);

    typingElement.textContent = letter;

    if (letter.length === currentText.length) {
      count++;
      index = 0;
      setTimeout(type, 1500);
    } else {
      setTimeout(type, 120);
    }
  })();

  // ======================
  // Counter-up animation
  // ======================
  const counters = document.querySelectorAll('.counter');
  const speed = 200;

  const animateCounters = () => {
    counters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
          counter.innerText = Math.ceil(count + increment);
          setTimeout(updateCount, 20);
        } else {
          counter.innerText = target + "+";
        }
      };
      updateCount();
    });
  };

  const highlightSection = document.querySelector('.highlights');
  let started = false;
  if (highlightSection) {
    window.addEventListener('scroll', () => {
      const sectionTop = highlightSection.offsetTop - window.innerHeight + 100;
      if (!started && window.scrollY > sectionTop) {
        animateCounters();
        started = true;
      }
    });
  }

  // ======================
  // Navbar Hide/Show on Hover (Desktop only)
  // ======================
  const header = document.querySelector('header');

  if (header) {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      // 📱 On mobile: always visible
      header.style.top = "0";
    } else {
      // 💻 On desktop: hide/show based on cursor position
      header.style.top = "0"; // show at first load

      document.addEventListener('mousemove', (e) => {
        if (e.clientY < 80) {
          header.style.top = "0";
        } else {
          header.style.top = "-80px";
        }
      });
    }
  }
});

// ================== Counter Animation ==================
const counters = document.querySelectorAll('.counter');

const runCounter = (counter) => {
  const target = +counter.getAttribute('data-target');
  const duration = 2000; // total animation time (ms)
  const step = target / (duration / 20); // update every 20ms
  let count = 0;

  const update = () => {
    count += step;
    if (count < target) {
      counter.innerText = Math.floor(count);
      requestAnimationFrame(update);
    } else {
      counter.innerText = target + "+"; // add "+" at the end
    }
  };

  update();
};

// Observer to trigger when highlight section appears
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      runCounter(entry.target);
      observer.unobserve(entry.target); // run once per counter
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => {
  observer.observe(counter);
});
