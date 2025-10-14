document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Sabeeha site loaded");

  // ========================================
  // HEADER HEIGHT OFFSET
  // ========================================
  const header = document.querySelector("header");
  const setHeaderOffset = () => {
    if (!header) return;
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  };
  setHeaderOffset();
  window.addEventListener("resize", setHeaderOffset);

  // ========================================
  // MOBILE NAVIGATION - FIXED
  // ========================================
  const menuBtn = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links") || document.getElementById("primary-navigation");
  
  if (menuBtn && navLinks) {
    console.log("✅ Mobile menu found and initialized");
    
    // Toggle menu on button click
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('active');
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.innerHTML = isOpen ? '✕' : '☰';
      menuBtn.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0)';
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.innerHTML = '☰';
        menuBtn.style.transform = 'rotate(0)';
        document.body.style.overflow = '';
      }
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.innerHTML = '☰';
        menuBtn.style.transform = 'rotate(0)';
        document.body.style.overflow = '';
      });
    });
  } else {
    console.log("⚠️ Menu elements not found:", {
      menuBtn: !!menuBtn,
      navLinks: !!navLinks
    });
  }

  // ========================================
  // VIEWPORT HEIGHT FIX FOR MOBILE
  // ========================================
  const setVH = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setVH();
  window.addEventListener('resize', setVH);

  // ========================================
  // TYPING EFFECT
  // ========================================
  const typingElement = document.querySelector(".typing-text");
  if (typingElement) {
    const texts = ["Soft Skills Trainer", "IELTS Coach", "Corporate Speaker"];
    let i = 0, j = 0, deleting = false;

    const type = () => {
      const current = texts[i];
      typingElement.textContent = current.slice(0, j);

      if (!deleting && j < current.length) {
        j++;
        setTimeout(type, 120);
      } else if (!deleting && j === current.length) {
        deleting = true;
        setTimeout(type, 1200);
      } else if (deleting && j > 0) {
        j--;
        setTimeout(type, 60);
      } else {
        deleting = false;
        i = (i + 1) % texts.length;
        setTimeout(type, 300);
      }
    };
    type();
  }

  // ========================================
  // COUNTER ANIMATION
  // ========================================
  const counters = document.querySelectorAll(".counter");
  if (counters.length) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animateCounter = (el) => {
      const target = Number(el.dataset.target || 0);
      if (prefersReduced) {
        el.textContent = target.toLocaleString() + "+";
        return;
      }
      const duration = 1200;
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(target * progress);
        el.textContent = value.toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString() + "+";
      };

      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach((c) => io.observe(c));
  }

  // ========================================
  // SWIPER INITIALIZATION
  // ========================================
  const swiperEl = document.querySelector(".mySwiper");
  if (swiperEl && typeof Swiper !== 'undefined') {
    new Swiper(".mySwiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      speed: 5000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      allowTouchMove: false,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
    console.log("✅ Swiper initialized");
  }

  // ========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.offsetTop - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // HERO BOOKING MODAL
  // ========================================
  const heroBookBtn = document.getElementById('hero-book-btn');
  const bookingModal = document.getElementById('booking-modal');
  const closeModalBtn = document.getElementById('close-booking-modal');
  const modalForm = document.getElementById('modal-booking-form');
  const bookingSuccess = document.querySelector('.booking-success');
  const anotherBookingBtn = document.querySelector('.another-booking-btn');

  if (heroBookBtn && bookingModal) {
    console.log("✅ Booking modal initialized");
    
    // Set minimum date to today
    const modalDateInput = document.getElementById('modal-date');
    if (modalDateInput) {
      const today = new Date().toISOString().split('T')[0];
      modalDateInput.setAttribute('min', today);
    }

    // Open modal
    heroBookBtn.addEventListener('click', () => {
      bookingModal.classList.add('show');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        document.getElementById('modal-name')?.focus();
      }, 300);
    });
    
    // Close modal function
    function closeBookingModal() {
      bookingModal.classList.remove('show');
      document.body.style.overflow = '';
      if (modalForm) {
        modalForm.reset();
        modalForm.style.display = 'flex';
      }
      if (bookingSuccess) {
        bookingSuccess.style.display = 'none';
      }
      modalForm?.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
      });
      modalForm?.querySelectorAll('.field-error').forEach(el => {
        el.classList.remove('show');
      });
    }
    
    // Close button click
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeBookingModal);
    }
    
    // Click outside to close
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeBookingModal();
      }
    });
    
    // Form validation and submission code here...
    // (Keep your existing validation code, but I'm shortening for space)
  }

  // ========================================
  // BLOG MODAL FUNCTIONALITY
  // ========================================
  const modalOverlay = document.getElementById("modal-overlay");
  const modalContent = document.getElementById("modal-content");
  const modalLoading = document.getElementById("modal-loading");
  const modalClose = document.getElementById("modal-close");
  const blogGrid = document.querySelector(".blog-grid");

  if (modalOverlay) {
    console.log("✅ Blog modal initialized");
    
    // Your article database (keep existing)
    const articleDatabase = {
      'article-1': { /* ... your article content ... */ },
      'article-2': { /* ... your article content ... */ },
      // etc.
    };

    // Open modal function
    function openModal(articleId) {
      const article = articleDatabase[articleId];
      if (!article) {
        console.error("Article not found:", articleId);
        return;
      }

      if (modalLoading) modalLoading.style.display = "block";
      if (modalContent) modalContent.style.display = "none";
      if (blogGrid) blogGrid.classList.add("blurred");
      
      modalOverlay.classList.add("active");
      document.body.classList.add("modal-open");

      setTimeout(() => {
        const articleHTML = `
          <article class="article-full-content">
            ${article.image ? `<img src="${article.image}" alt="${article.title}" class="article-hero-image">` : ''}
            <header class="article-header">
              <span class="tag">${article.tag}</span>
              <span class="date">${article.date} • ${article.readTime}</span>
              <h2>${article.title}</h2>
            </header>
            <div class="article-body">${article.content}</div>
          </article>
        `;
        
        if (modalContent) {
          modalContent.innerHTML = articleHTML;
          modalContent.style.display = "block";
          modalContent.scrollTop = 0;
        }
        if (modalLoading) modalLoading.style.display = "none";
      }, 400);
    }

    // Close modal function
    function closeModal() {
      modalOverlay.classList.remove("active");
      if (blogGrid) blogGrid.classList.remove("blurred");
      document.body.classList.remove("modal-open");
      
      setTimeout(() => {
        if (modalContent) modalContent.innerHTML = "";
      }, 300);
    }

    // Event listeners for blog modal
    if (modalClose) {
      modalClose.addEventListener("click", closeModal);
    }

    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    // Read More button clicks
    document.addEventListener("click", (e) => {
      const readMoreBtn = e.target.closest(".read-more");
      if (readMoreBtn) {
        e.preventDefault();
        const card = readMoreBtn.closest(".blog-card");
        const articleId = card?.dataset.article;
        if (articleId) openModal(articleId);
      }
    });
  }

  // ========================================
  // CATEGORY FILTER (BLOG PAGE)
  // ========================================
  const categoryButtons = document.querySelectorAll(".blog-categories button");
  const blogCards = document.querySelectorAll(".blog-card");

  if (categoryButtons.length && blogCards.length) {
    categoryButtons.forEach(button => {
      button.addEventListener("click", () => {
        categoryButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        
        const category = button.textContent.trim().toLowerCase();
        
        blogCards.forEach(card => {
          const cardTag = card.querySelector(".tag")?.textContent.toLowerCase();
          if (category === "all topics" || cardTag?.includes(category.split(" ")[0])) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // ========================================
  // ESCAPE KEY HANDLER (GLOBAL)
  // ========================================
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // Close any open modals
      if (modalOverlay?.classList.contains("active")) {
        closeModal();
      }
      if (bookingModal?.classList.contains("show")) {
        closeBookingModal();
      }
      // Close mobile menu
      if (navLinks?.classList.contains("active")) {
        navLinks.classList.remove("active");
        if (menuBtn) {
          menuBtn.setAttribute("aria-expanded", "false");
          menuBtn.innerHTML = '☰';
          menuBtn.style.transform = 'rotate(0)';
        }
        document.body.style.overflow = '';
      }
    }
  });

  console.log("✅ All systems initialized successfully");
});
