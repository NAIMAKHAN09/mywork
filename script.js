// ========================================
  // GENERAL SITE FUNCTIONALITY
  // ========================================

  // --- Measure header height and offset body ---
  const header = document.querySelector("header");
  const setHeaderOffset = () => {
    if (!header) return;
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  };
  setHeaderOffset();
  window.addEventListener("resize", setHeaderOffset);

  // --- Mobile menu toggle (accessible) ---
  const menuBtn = document.querySelector(".menu-toggle");
  const navList = document.getElementById("primary-navigation");
  if (menuBtn && navList) {
    menuBtn.addEventListener("click", () => {
      const open = navList.classList.toggle("active");
      menuBtn.setAttribute("aria-expanded", String(open));
      // prevent background scroll when menu is open
      if (open) {
        document.body.classList.add('menu-open');
      } else {
        document.body.classList.remove('menu-open');
      }
    });

    // Close on link click
    navList.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        navList.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
        document.body.classList.remove('menu-open');
      }
    });

    // Close menu on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navList.classList.contains("active")) {
        navList.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
        document.body.classList.remove('menu-open');
      }
    });
  }

  // --- Typing effect (if .typing-text exists on the page) ---
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
// HERO BOOKING MODAL FUNCTIONALITY
// ========================================

const heroBookBtn = document.getElementById('hero-book-btn');
const bookingModal = document.getElementById('booking-modal');
const closeModalBtn = document.getElementById('close-booking-modal');
const modalForm = document.getElementById('modal-booking-form');
const bookingSuccess = document.querySelector('.booking-success');
const anotherBookingBtn = document.querySelector('.another-booking-btn');

if (heroBookBtn && bookingModal) {
  
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
    // Focus first input
    setTimeout(() => {
      document.getElementById('modal-name')?.focus();
    }, 300);
  });
  
  // Close modal function
  function closeBookingModal() {
    bookingModal.classList.remove('show');
    document.body.style.overflow = '';
    // Reset form
    modalForm.reset();
    modalForm.style.display = 'flex';
    bookingSuccess.style.display = 'none';
    // Clear all error states
    modalForm.querySelectorAll('.error').forEach(el => {
      el.classList.remove('error');
    });
    modalForm.querySelectorAll('.field-error').forEach(el => {
      el.classList.remove('show');
    });
  }
  
  // Close button click
  closeModalBtn.addEventListener('click', closeBookingModal);
  
  // Click outside to close
  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
      closeBookingModal();
    }
  });
  
  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.classList.contains('show')) {
      closeBookingModal();
    }
  });

  // ========================================
  // ENHANCED FORM VALIDATION
  // ========================================

  // Phone input - only allow numbers
  const phoneInput = document.getElementById('modal-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      // Remove any non-digit characters
      e.target.value = e.target.value.replace(/\D/g, '');
      
      // Limit to 10 digits
      if (e.target.value.length > 10) {
        e.target.value = e.target.value.slice(0, 10);
      }
      
      // Clear error on input
      clearError(e.target);
    });

    // Prevent non-numeric keys
    phoneInput.addEventListener('keypress', (e) => {
      const char = String.fromCharCode(e.which);
      if (!/[0-9]/.test(char)) {
        e.preventDefault();
      }
    });
  }

  // Email validation
  const emailInput = document.getElementById('modal-email');
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      validateEmail(emailInput);
    });
    
    emailInput.addEventListener('input', () => {
      clearError(emailInput);
    });
  }

  // Name validation - only letters and spaces
  const nameInput = document.getElementById('modal-name');
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      // Remove numbers and special characters except spaces
      e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
      clearError(e.target);
    });
  }

  // Character counter for message
  const messageInput = document.getElementById('modal-message');
  const charCount = document.querySelector('.char-count');
  if (messageInput && charCount) {
    messageInput.addEventListener('input', () => {
      const length = messageInput.value.length;
      charCount.textContent = `${length} / 500`;
      
      if (length > 450) {
        charCount.style.color = '#e53e3e';
      } else {
        charCount.style.color = '#a0aec0';
      }
    });
  }

  // Validation functions
  function validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!email) {
      showError(input, 'Email is required');
      return false;
    }
    
    if (!emailRegex.test(email)) {
      showError(input, 'Please enter a valid email address (e.g., name@example.com)');
      return false;
    }
    
    // Check for common typos
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1];
    
    if (domain) {
      const similarDomain = commonDomains.find(d => {
        const similarity = calculateSimilarity(domain, d);
        return similarity > 0.8 && similarity < 1;
      });
      
      if (similarDomain) {
        showError(input, `Did you mean ${email.split('@')[0]}@${similarDomain}?`);
        return false;
      }
    }
    
    showValid(input);
    return true;
  }

  function validatePhone(input) {
    const phone = input.value.trim();
    
    if (!phone) {
      showError(input, 'Phone number is required');
      return false;
    }
    
    if (phone.length !== 10) {
      showError(input, 'Please enter a valid 10-digit phone number');
      return false;
    }
    
    // Check if it starts with valid Indian mobile prefixes
    const validPrefixes = ['6', '7', '8', '9'];
    if (!validPrefixes.includes(phone[0])) {
      showError(input, 'Please enter a valid mobile number');
      return false;
    }
    
    showValid(input);
    return true;
  }

  function validateName(input) {
    const name = input.value.trim();
    
    if (!name) {
      showError(input, 'Name is required');
      return false;
    }
    
    if (name.length < 3) {
      showError(input, 'Name must be at least 3 characters long');
      return false;
    }
    
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      showError(input, 'Name should only contain letters and spaces');
      return false;
    }
    
    showValid(input);
    return true;
  }

  function showError(input, message) {
    const wrapper = input.closest('.phone-input-wrapper');
    const fieldElement = wrapper || input;
    const errorElement = input.closest('.form-field').querySelector('.field-error');
    
    fieldElement.classList.add('error');
    fieldElement.classList.remove('valid');
    
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  }

  function showValid(input) {
    const wrapper = input.closest('.phone-input-wrapper');
    const fieldElement = wrapper || input;
    
    fieldElement.classList.add('valid');
    fieldElement.classList.remove('error');
    clearError(input);
  }

  function clearError(input) {
    const wrapper = input.closest('.phone-input-wrapper');
    const fieldElement = wrapper || input;
    const errorElement = input.closest('.form-field').querySelector('.field-error');
    
    fieldElement.classList.remove('error');
    if (errorElement) {
      errorElement.classList.remove('show');
    }
  }

  // String similarity function for email typo detection
  function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  function getEditDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Form submission
  if (modalForm) {
  modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateName(document.getElementById('modal-name'));
    const isEmailValid = validateEmail(document.getElementById('modal-email'));
    const isPhoneValid = validatePhone(document.getElementById('modal-phone'));
    
    const service = document.getElementById('modal-service');
    if (!service.value) {
      showError(service, 'Please select a service');
    } else {
      showValid(service);
    }
    
    const date = document.getElementById('modal-date');
    if (!date.value) {
      showError(date, 'Please select a date');
    } else {
      const selectedDate = new Date(date.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        showError(date, 'Please select a future date');
      } else {
        showValid(date);
      }
    }
    
    // Check if all validations passed
    if (!isNameValid || !isEmailValid || !isPhoneValid || !service.value || !date.value) {
      // Scroll to first error
      const firstError = modalForm.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('modal-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    
    // Collect form data
    const formData = new FormData(modalForm);
    const data = Object.fromEntries(formData.entries());
    // Add full phone number with country code
    data.phone = '+91' + data.phone;
    
    console.log('Booking data:', data);
    
    try {
      // Simulate API call (replace with your actual API endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production:
      // const response = await fetch('/api/bookings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      // Show success message
      modalForm.style.display = 'none';
      bookingSuccess.style.display = 'block';
      
    } catch (error) {
      console.error('Booking error:', error);
      alert('There was an error processing your booking. Please try again.');
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      btnText.style.display = 'block';
      btnLoading.style.display = 'none';
    }
  });
  }

  // Book another session
  if (anotherBookingBtn) {
    anotherBookingBtn.addEventListener('click', () => {
      modalForm.reset();
      modalForm.style.display = 'flex';
      bookingSuccess.style.display = 'none';
      // Clear all validations
      modalForm.querySelectorAll('.valid, .error').forEach(el => {
        el.classList.remove('valid', 'error');
      });
    });
  }
}

  // --- Counter animation via IntersectionObserver ---
  const counters = document.querySelectorAll(".counter");
  if (counters.length) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animateCounter = (el) => {
      const target = Number(el.dataset.target || 0);
      if (prefersReduced) {
        el.textContent = target.toLocaleString() + "+";
        return;
      }
      const duration = 1200; // ms
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

 // --- Swiper initialization ---
const swiperEl = document.querySelector(".mySwiper");
if (swiperEl && typeof Swiper !== 'undefined') {
  new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,

    // fixed frame => no autoHeight
    autoHeight: false,

    speed: 5000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    allowTouchMove: false,

    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }
  });
  console.log("✅ Swiper initialized with fixed frame");
}
  
  // ========================================
  // BLOG MODAL FUNCTIONALITY
  // ========================================

  // Article database - Replace with API calls in production
  const articleDatabase = {
    'article-1': {
      title: "Why Soft Skills Matter in 2025",
      tag: "Communication",
      date: "Sep 20, 2025",
      readTime: "5 min read",
      content: `
        <p>In today's rapidly evolving workplace, technical expertise alone isn't enough. The ability to communicate effectively, collaborate with diverse teams, and adapt to change has become the defining factor between good professionals and great leaders.</p>
        
        <h3>The New Professional Landscape</h3>
        <p>As automation and AI take over routine tasks, uniquely human skills become more valuable. Employers are desperately seeking professionals who can:</p>
        
        <p>• <strong>Bridge communication gaps</strong> between technical and non-technical teams<br>
        • <strong>Lead with empathy</strong> in increasingly remote work environments<br>
        • <strong>Navigate cultural diversity</strong> in global organizations<br>
        • <strong>Manage conflict</strong> and build consensus<br>
        • <strong>Inspire and motivate</strong> teams through uncertainty</p>
        
        <h3>The Data Speaks Volumes</h3>
        <p>Recent LinkedIn data shows that <strong>92% of talent professionals</strong> say soft skills are equally or more important than hard skills. Furthermore, employees with strong soft skills are <strong>12% more productive</strong> and companies that invest in soft skills training see a <strong>256% ROI</strong>.</p>
        
        <h3>Core Soft Skills for 2025</h3>
        <p><strong>1. Emotional Intelligence:</strong> Understanding and managing your emotions while empathizing with others creates stronger professional relationships and better decision-making.</p>
        
        <p><strong>2. Adaptability:</strong> The only constant is change. Professionals who embrace change and pivot quickly will thrive in dynamic environments.</p>
        
        <p><strong>3. Critical Thinking:</strong> With information overload, the ability to analyze, evaluate, and synthesize information is crucial for strategic decision-making.</p>
        
        <p><strong>4. Cross-cultural Communication:</strong> Global teams require professionals who can navigate cultural nuances and communicate effectively across boundaries.</p>
        
        <p><strong>5. Creative Problem-Solving:</strong> Innovation comes from thinking differently. Soft skills enable collaborative creativity that drives breakthrough solutions.</p>
        
        <h3>Investing in Your Soft Skills</h3>
        <p>The good news? Soft skills can be developed. Through intentional practice, feedback, and continuous learning, you can enhance these capabilities. Consider:</p>
        
        <p>• Taking communication workshops<br>
        • Practicing active listening daily<br>
        • Seeking feedback on your interpersonal skills<br>
        • Reading books on emotional intelligence<br>
        • Joining public speaking groups like Toastmasters</p>
        
        <h3>The Bottom Line</h3>
        <p>In 2025 and beyond, soft skills aren't "soft" anymore—they're essential. They're the skills that will differentiate you in a competitive job market, accelerate your career growth, and make you an invaluable asset to any organization. The time to invest in these skills is now.</p>
      `
    },
    'article-2': {
      title: "Top 5 Tips for IELTS Speaking",
      tag: "English Learning",
      date: "Sep 19, 2025",
      readTime: "8 min read",
      content: `
        <p>Getting a high score in IELTS speaking requires more than just good English. It demands strategy, practice, and understanding what examiners are really looking for. Here are five proven tips that have helped hundreds of my students achieve their target scores.</p>
        
        <h3>1. Master the Art of Extension</h3>
        <p>One of the biggest mistakes candidates make is giving short, one-sentence answers. The examiner needs to hear enough language to assess your level accurately.</p>
        
        <p><strong>Instead of:</strong> "I like reading books."<br>
        <strong>Say:</strong> "I'm quite passionate about reading, actually. I find it's a great way to unwind after a busy day, and I particularly enjoy historical fiction because it combines entertainment with learning about different periods and cultures."</p>
        
        <h3>2. Use a Range of Tenses Naturally</h3>
        <p>Examiners are specifically listening for your ability to use different tenses accurately. Make sure you demonstrate:</p>
        
        <p>• <strong>Present tenses</strong> for habits and current situations<br>
        • <strong>Past tenses</strong> for experiences and anecdotes<br>
        • <strong>Future forms</strong> for plans and predictions<br>
        • <strong>Perfect tenses</strong> to show duration and completion<br>
        • <strong>Conditionals</strong> for hypothetical situations</p>
        
        <h3>3. Develop Topic-Specific Vocabulary</h3>
        <p>Having rich vocabulary for common IELTS topics gives you a significant advantage. Focus on these key areas:</p>
        
        <p><strong>Education:</strong> curriculum, pedagogy, academic achievement, lifelong learning<br>
        <strong>Environment:</strong> sustainability, carbon footprint, renewable energy, conservation<br>
        <strong>Technology:</strong> innovation, digital literacy, artificial intelligence, automation<br>
        <strong>Health:</strong> wellbeing, preventive medicine, mental health, lifestyle diseases<br>
        <strong>Culture:</strong> heritage, traditions, globalization, cultural diversity</p>
        
        <h3>4. Practice the Two-Minute Talk Strategy</h3>
        <p>Part 2 requires you to speak for 1-2 minutes on a topic. Here's a winning structure:</p>
        
        <p><strong>Introduction (10-15 seconds):</strong> Paraphrase the topic and state your main point<br>
        <strong>Main Body (60-80 seconds):</strong> Cover all bullet points with examples and details<br>
        <strong>Personal Reflection (20-25 seconds):</strong> Share feelings or broader implications<br>
        <strong>Conclusion (5-10 seconds):</strong> Summarize or look to the future</p>
        
        <h3>5. Handle Difficult Questions with Confidence</h3>
        <p>When you encounter a challenging question, use these strategies:</p>
        
        <p><strong>Buy thinking time:</strong> "That's an interesting question. Let me think about that for a moment..."<br>
        <strong>Acknowledge difficulty:</strong> "I haven't really considered this before, but I suppose..."<br>
        <strong>Redirect skillfully:</strong> "I'm not entirely sure about X, but what I do know is..."<br>
        <strong>Use examples:</strong> "I can't speak for everyone, but in my experience..."</p>
        
        <h3>Bonus Tip: Record and Analyze Yourself</h3>
        <p>Recording yourself is the fastest way to improve. Listen for:</p>
        
        <p>• Hesitation and filler words (um, uh, you know)<br>
        • Pronunciation issues<br>
        • Grammar mistakes you repeat<br>
        • Opportunities to use better vocabulary<br>
        • Natural intonation and stress patterns</p>
        
        <h3>Final Thoughts</h3>
        <p>Remember, the IELTS speaking test is designed to be a natural conversation. The examiner wants you to succeed. Stay calm, be yourself, and show them the full range of your English ability. With these strategies and consistent practice, you're well on your way to achieving your target score!</p>
      `
    },
    'article-3': {
      title: "Building Confidence in Public Speaking",
      tag: "Soft Skills",
      date: "Sep 18, 2025",
      readTime: "6 min read",
      content: `
        <p>Public speaking consistently ranks as one of humanity's greatest fears, often surpassing the fear of death itself. Yet, it's also one of the most powerful skills you can develop for personal and professional growth. Let me share proven strategies that have transformed nervous speakers into confident communicators.</p>
        
        <h3>Understanding the Fear</h3>
        <p>Fear of public speaking, or glossophobia, affects <strong>75% of the population</strong>. This fear stems from our evolutionary past—being rejected by the group meant survival was at risk. Today, that same mechanism triggers when we face an audience.</p>
        
        <p>Common symptoms include:</p>
        <p>• Racing heartbeat and sweaty palms<br>
        • Trembling voice or hands<br>
        • Mind going blank<br>
        • Nausea or dizziness<br>
        • Avoiding speaking opportunities</p>
        
        <h3>The Confidence-Building Framework</h3>
        
        <p><strong>1. Start with Self-Awareness</strong><br>
        Identify your specific triggers. Is it large audiences? Being judged? Forgetting your words? Understanding your fear helps you address it directly.</p>
        
        <p><strong>2. Preparation is Your Superpower</strong><br>
        Confidence comes from competence. When you know your material inside out, anxiety decreases dramatically. Prepare 10x more than you think you need.</p>
        
        <p><strong>3. Progressive Exposure</strong><br>
        Start small and gradually increase the challenge:<br>
        Week 1-2: Speak to yourself in the mirror<br>
        Week 3-4: Record yourself and watch it back<br>
        Week 5-6: Present to family or close friends<br>
        Week 7-8: Join a speaking group or volunteer to present at work<br>
        Week 9+: Seek larger speaking opportunities</p>
        
        <h3>Physical Techniques for Instant Confidence</h3>
        
        <p><strong>Power Posing:</strong> Stand in a confident position for 2 minutes before speaking. Research shows this actually changes your hormone levels, increasing confidence and reducing stress.</p>
        
        <p><strong>Box Breathing:</strong> Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. This activates your parasympathetic nervous system, calming your nerves.</p>
        
        <p><strong>Progressive Muscle Relaxation:</strong> Tense and release muscle groups from toes to head. This releases physical tension that amplifies anxiety.</p>
        
        <h3>Mental Strategies for Success</h3>
        
        <p><strong>Reframe Your Nervousness:</strong> That energy you feel? It's not fear—it's excitement. Both emotions have the same physiological response. Tell yourself "I'm excited" instead of "I'm nervous."</p>
        
        <p><strong>Visualize Success:</strong> Spend 5 minutes daily visualizing yourself speaking confidently. See the engaged faces, hear the applause, feel the satisfaction.</p>
        
        <p><strong>Focus on Service:</strong> Shift from "What will they think of me?" to "How can I help them?" When you focus on providing value, self-consciousness diminishes.</p>
        
        <h3>During Your Presentation</h3>
        
        <p><strong>Connect Before You Speak:</strong> Arrive early and chat with audience members. They become friendly faces rather than scary strangers.</p>
        
        <p><strong>Start Strong:</strong> Memorize your opening 30 seconds perfectly. A strong start builds momentum.</p>
        
        <p><strong>Use Strategic Pauses:</strong> Silence is powerful. Pause to breathe, think, and let your points land.</p>
        
        <p><strong>Make Eye Contact:</strong> Find friendly faces and speak to them. It feels like a conversation rather than a performance.</p>
        
        <h3>Learning from Mistakes</h3>
        
        <p>Every speaker has disasters. I once forgot my entire presentation and had to improvise for 20 minutes. Another time, my slides didn't work, and I presented without them. These "failures" taught me more than any success.</p>
        
        <p>Remember: The audience wants you to succeed. They're on your side. Most won't even notice the mistakes you're worried about.</p>
        
        <h3>Join a Speaking Community</h3>
        
        <p>Organizations like Toastmasters provide safe, supportive environments to practice. You'll receive constructive feedback and see others at all levels improving alongside you.</p>
        
        <h3>The Transformation</h3>
        
        <p>With consistent practice, something magical happens. The fear doesn't disappear—it transforms into energy that enhances your performance. You'll find yourself seeking speaking opportunities rather than avoiding them.</p>
        
        <p>Public speaking confidence isn't about being perfect. It's about being authentic, prepared, and focused on serving your audience. Start where you are, use what you have, do what you can. Your voice matters, and the world needs to hear what you have to say.</p>
      `
    },
    'article-4': {
      title: "Your Most Underrated Career Asset Isn't on Your Resume",
      tag: "Communication",
      date: "Sep 20, 2025",
      readTime: "7 min read",
      image: "client images/communication-skill.jpeg",
      content: `
        <p>In a world obsessed with technical certifications, coding bootcamps, and data science degrees, we're overlooking the skill that amplifies everything else: <strong>effective communication</strong>. It's the invisible force that transforms good ideas into funded projects, individual contributors into leaders, and companies into industry giants.</p>
        
        <h3>The Hidden Crisis in Modern Workplaces</h3>
        
        <p>Despite having more communication tools than ever—Slack, Teams, Zoom, email—we're experiencing a communication crisis. A recent study by The Economist Intelligence Unit found that <strong>poor communication costs companies with 100,000+ employees an average of $62.4 million per year</strong>.</p>
        
        <p>The symptoms are everywhere:<br>
        • Projects derail due to misaligned expectations<br>
        • Brilliant ideas die in poorly written proposals<br>
        • Teams fracture from misunderstandings<br>
        • Customers leave due to poor service interactions<br>
        • Careers stagnate despite technical excellence</p>
        
        <h3>Why Communication is Your Career Multiplier</h3>
        
        <p><strong>1. Ideas Are Only as Good as Your Ability to Express Them</strong><br>
        You could have the next billion-dollar idea, but if you can't articulate it clearly, it's worthless. Steve Jobs wasn't just a tech visionary—he was a master communicator who could distill complex technology into simple, compelling narratives.</p>
        
        <p><strong>2. Leadership IS Communication</strong><br>
        Research from Harvard Business Review shows that <strong>91% of employees</strong> believe their bosses lack good communication skills. The ability to inspire, align, and mobilize people through words is what separates managers from leaders.</p>
        
        <p><strong>3. Your Network Depends on It</strong><br>
        Your ability to build relationships, maintain connections, and create opportunities directly correlates with your communication skills. Every email, every meeting, every casual conversation is a chance to strengthen or weaken your professional network.</p>
        
        <h3>The Four Pillars of Career-Changing Communication</h3>
        
        <p><strong>Pillar 1: Clarity</strong><br>
        Before you communicate, ask yourself: What's the ONE thing I want the other person to understand? Strip away jargon, eliminate ambiguity, and focus on crystal-clear messaging.</p>
        
        <p>Example transformation:<br>
        ❌ "We need to leverage our synergies to optimize stakeholder value."<br>
        ✅ "We need to work together more effectively to increase profits."</p>
        
        <p><strong>Pillar 2: Empathy</strong><br>
        Great communicators understand their audience's perspective, concerns, and motivations. They adapt their message not to manipulate, but to genuinely connect and serve.</p>
        
        <p>Ask yourself:<br>
        • What does my audience care about?<br>
        • What are their pain points?<br>
        • How can I frame this to benefit them?<br>
        • What questions might they have?</p>
        
        <p><strong>Pillar 3: Structure</strong><br>
        Random thoughts create confusion. Organized ideas create understanding. Use frameworks like:</p>
        
        <p>• <strong>PREP:</strong> Point, Reason, Example, Point<br>
        • <strong>Problem-Solution-Benefit:</strong> What's wrong, how to fix it, why it matters<br>
        • <strong>Situation-Complication-Resolution:</strong> Where we are, what's challenging, how we'll overcome it</p>
        
        <p><strong>Pillar 4: Engagement</strong><br>
        Communication isn't broadcasting—it's a dialogue. Create interaction through:<br>
        • Asking questions<br>
        • Sharing stories and examples<br>
        • Using analogies and metaphors<br>
        • Inviting feedback and discussion</p>
        
        <h3>The ROI of Communication Skills</h3>
        
        <p>Investing in communication skills delivers measurable returns:</p>
        
        <p><strong>Salary Impact:</strong> Professionals with strong communication skills earn <strong>10% more</strong> on average than their peers.<br>
        <strong>Promotion Speed:</strong> Effective communicators are promoted <strong>5x faster</strong> than those with only technical skills.<br>
        <strong>Project Success:</strong> Teams with strong communicators have a <strong>50% higher</strong> project success rate.<br>
        <strong>Customer Retention:</strong> Companies with effective communication retain <strong>89% of customers</strong> vs. 33% for poor communicators.</p>
        
        <h3>How to Level Up Your Communication Skills</h3>
        
        <p><strong>1. Write Every Day</strong><br>
        Writing clarifies thinking. Start a blog, journal, or simply write detailed emails. The act of organizing thoughts into words strengthens your communication muscle.</p>
        
        <p><strong>2. Seek Feedback Relentlessly</strong><br>
        After presentations or important conversations, ask: "How could I have communicated that more effectively?" Most people won't volunteer criticism—you have to ask for it.</p>
        
        <p><strong>3. Study Great Communicators</strong><br>
        Watch TED talks, read exceptional writing, analyze what makes certain messages resonate. Deconstruct their techniques and adapt them to your style.</p>
        
        <p><strong>4. Practice Active Listening</strong><br>
        Communication is 50% listening. Practice summarizing what others say before responding. This ensures understanding and shows respect.</p>
        
        <p><strong>5. Join Speaking Organizations</strong><br>
        Groups like Toastmasters provide safe spaces to practice and receive structured feedback on your communication skills.</p>
        
        <h3>The Future Belongs to Communicators</h3>
        
        <p>As AI automates technical tasks, uniquely human skills become more valuable. The ability to persuade, inspire, negotiate, and connect will be the differentiator in tomorrow's job market.</p>
        
        <p>Your technical skills might get you in the door, but your communication skills will determine how far you go. In a world drowning in information, those who can cut through the noise with clear, compelling communication will lead the way.</p>
        
        <p><strong>The bottom line?</strong> Every investment in your communication skills pays compound interest throughout your career. Start today. Your future self will thank you.</p>
      `
    },
    'article-5': {
      title: "The Art of Active Listening",
      tag: "Soft Skills",
      date: "Sep 17, 2025",
      readTime: "6 min read",
      content: `
        <p>In our rush to be heard, we've forgotten how to listen. Yet active listening is perhaps the most powerful communication skill you can develop. It transforms relationships, prevents conflicts, and opens doors you didn't know existed.</p>
        
        <h3>What Active Listening Really Means</h3>
        <p>Active listening isn't just waiting for your turn to speak. It's a conscious effort to understand not just the words, but the complete message being conveyed—including emotions, intentions, and unspoken concerns.</p>
        
        <h3>The Five Levels of Listening</h3>
        <p><strong>Level 1: Ignoring</strong> - Not listening at all<br>
        <strong>Level 2: Pretending</strong> - Acting like you're listening<br>
        <strong>Level 3: Selective</strong> - Hearing only what interests you<br>
        <strong>Level 4: Attentive</strong> - Focusing on words and meaning<br>
        <strong>Level 5: Empathetic</strong> - Understanding emotions and perspective</p>
        
        <h3>Techniques for Mastery</h3>
        <p>• Maintain eye contact without staring<br>
        • Use minimal encouragers ("I see," "Go on")<br>
        • Paraphrase to confirm understanding<br>
        • Ask open-ended questions<br>
        • Notice non-verbal cues<br>
        • Avoid interrupting or finishing sentences</p>
        
        <h3>The Business Impact</h3>
        <p>Studies show that companies with employees trained in active listening experience:<br>
        • 25% fewer errors and misunderstandings<br>
        • 40% improvement in customer satisfaction<br>
        • 30% increase in employee engagement<br>
        • 50% reduction in conflict resolution time</p>
        
        <h3>Practice Exercises</h3>
        <p><strong>The 70/30 Rule:</strong> Aim to listen 70% of the time and speak 30%.<br>
        <strong>The Pause Challenge:</strong> Wait 3 seconds after someone finishes before responding.<br>
        <strong>The Summary Test:</strong> After conversations, write down three key points the other person made.</p>
        
        <h3>Transform Your Relationships</h3>
        <p>Active listening creates a ripple effect. When people feel truly heard, they become more open, collaborative, and trusting. It's not just a skill—it's a gift you give to others and yourself.</p>
      `
    },
    
    'article-6': {
      title: "Business English Essentials",
      tag: "English Learning",
      date: "Sep 16, 2025",
      readTime: "7 min read",
      content: `
        <p>Mastering Business English opens doors to global opportunities. Whether you're writing emails, leading meetings, or networking at conferences, these essential phrases and strategies will elevate your professional communication.</p>
        
        <h3>Email Excellence</h3>
        <p><strong>Professional Openings:</strong><br>
        • "I hope this email finds you well"<br>
        • "Thank you for your prompt response"<br>
        • "I'm writing to follow up on..."<br>
        • "Further to our discussion..."</p>
        
        <p><strong>Making Requests:</strong><br>
        • "I would appreciate it if you could..."<br>
        • "Would it be possible to..."<br>
        • "I was wondering if you might..."<br>
        • "Could you please provide..."</p>
        
        <h3>Meeting Mastery</h3>
        <p><strong>Contributing Ideas:</strong><br>
        • "I'd like to add that..."<br>
        • "Building on that point..."<br>
        • "From my perspective..."<br>
        • "What if we considered..."</p>
        
        <p><strong>Disagreeing Diplomatically:</strong><br>
        • "I see your point, however..."<br>
        • "That's interesting, but have we considered..."<br>
        • "I understand where you're coming from, though..."<br>
        • "Perhaps we could look at it differently..."</p>
        
        <h3>Presentation Power Phrases</h3>
        <p><strong>Structuring Your Talk:</strong><br>
        • "Let me begin by..."<br>
        • "Moving on to our next point..."<br>
        • "To illustrate this..."<br>
        • "In conclusion..."</p>
        
        <h3>Networking Naturally</h3>
        <p><strong>Starting Conversations:</strong><br>
        • "What brings you to this event?"<br>
        • "How do you know [host/organizer]?"<br>
        • "What's your take on [relevant topic]?"<br>
        • "I don't believe we've met. I'm..."</p>
        
        <h3>Cultural Considerations</h3>
        <p>Business English varies across cultures. Americans appreciate directness, while British professionals often use more indirect language. Asian business contexts may require more formal expressions of respect.</p>
        
        <h3>Common Mistakes to Avoid</h3>
        <p>• Using slang or colloquialisms in formal settings<br>
        • Being too direct without softening language<br>
        • Overusing jargon or acronyms<br>
        • Forgetting to proofread important documents<br>
        • Ignoring cultural communication preferences</p>
        
        <h3>Your Action Plan</h3>
        <p>1. Practice one new phrase daily<br>
        2. Record yourself in mock business scenarios<br>
        3. Read business publications in English<br>
        4. Join international professional groups<br>
        5. Seek feedback from native speakers</p>
        
        <p><strong>Remember:</strong> Confidence comes with practice. Start using these phrases today, and watch your professional communication transform.</p>
        `
    },
    
    'article-7': {
  title: "The Power of Atomic Habits",
  tag: "Soft Skills",
  date: "Mar 12, 2026",
  readTime: "5 min read",
  content: `
    <h1>The Power of Atomic Habits</h1>
    <p>Success is not the result of one big action. Instead, it is built through small, consistent habits practiced daily. The book <strong>Atomic Habits</strong> by James Clear explains how tiny improvements can lead to remarkable results.</p>
    <p>Atomic habits are small behaviors that compound over time. Even improving by 1% every day can create massive transformation in the long run.</p>

    <h3>Why Habits Matter</h3>
    <p>Most people focus on goals, but habits are the systems that help achieve them.</p>
    <p><strong>Goal</strong> – Become a confident speaker<br>
    <strong>Habit</strong> – Practice speaking every day</p>
    <p>Over time, these small actions create lasting change.</p>

    <h3>The Four Laws of Habit Formation</h3>
    <ul>
      <li><strong>Make it obvious</strong> – Keep reminders around you.</li>
      <li><strong>Make it attractive</strong> – Make habits enjoyable.</li>
      <li><strong>Make it easy</strong> – Start very small.</li>
      <li><strong>Make it satisfying</strong> – Track progress and celebrate wins.</li>
    </ul>

    <h3>Identity-Based Habits</h3>
    <p>Real change happens when habits shape your identity. Instead of saying, "I want to write," say, "I am a writer." Each small habit strengthens the identity you want to build.</p>

    <h3>The Key Message</h3>
    <p>Success is not about dramatic changes. It is about consistent small improvements.</p>
    <p><strong>Small habits → consistent actions → extraordinary results.</strong></p>
  `
},

    'article-8': {
      title: "10 Powerful Presentation Skills Tips to Boost Confidence Instantly",
      tag: "Communication",
      date: "Apr 9, 2026",
      readTime: "8 min read",
      image: "client images/presentation-skills.jpg",
      content: `
        <p>Strong presentation skills can <strong>transform the way you communicate,
        influence, and lead.</strong> Whether you're a student stepping into your first
        seminar or a seasoned professional presenting to a boardroom — the ability to
        present with confidence can open doors to opportunities you never imagined.</p>

        <p>If you feel nervous before speaking, don't worry. You're not alone. The great
        news is that <strong>confidence is not a talent — it's a skill.</strong> And like
        every skill, it can be built with the right techniques.</p>

        <h3>🎯 Tip 1: Start with a Strong Opening</h3>
        <p>First impressions are formed within seconds — make yours count. Instead of
        starting with <em>"Hi, my name is…"</em>, try something that immediately
        captures attention:</p>
        <ul>
          <li>Ask a thought-provoking question</li>
          <li>Open with a powerful statement or statistic</li>
          <li>Share a short, relatable story</li>
        </ul>
        <p><em>A strong opening signals to your audience: "This is worth listening to."</em></p>

        <h3>💡 Tip 2: Know Your Core Message Clearly</h3>
        <p>Before you speak a single word, ask yourself:</p>
        <p><em>"What is the ONE key takeaway I want my audience to leave with?"</em></p>
        <p>When your message is clear in your mind, it becomes clear in your delivery.
        <strong>Clarity builds confidence.</strong> Confusion disappears when you know
        exactly what you're trying to say.</p>

        <h3>🎤 Tip 3: Practice Out Loud — Always</h3>
        <p>Silent practice in your head is <strong>not enough.</strong> Real confidence
        comes from real practice:</p>
        <ul>
          <li>Speak in front of a mirror and observe yourself</li>
          <li>Record yourself and review your delivery</li>
          <li>Refine your tone, pace, and expressions</li>
        </ul>
        <p>The more you practice out loud, the more <strong>natural and effortless</strong>
        your delivery becomes.</p>

        <h3>🧍 Tip 4: Master Your Body Language</h3>
        <p>Your body speaks before your words do. Focus on:</p>
        <ul>
          <li><strong>Eye contact</strong> — connects you with your audience</li>
          <li><strong>Open posture</strong> — signals confidence and openness</li>
          <li><strong>Natural gestures</strong> — adds energy to your words</li>
        </ul>
        <p><em>Stand tall, breathe, and own the room.</em></p>

        <h3>⏸️ Tip 5: Control Your Pace — Slow Down</h3>
        <p>When nerves kick in, most people <strong>speak too fast.</strong>
        Consciously slow down and use <strong>strategic pauses</strong> to:</p>
        <ul>
          <li>Let important points sink in</li>
          <li>Give your audience time to process</li>
          <li>Add weight and authority to your words</li>
        </ul>
        <p><em>Silence is powerful. A well-placed pause says more than rushing ever will.</em></p>

        <h3>📊 Tip 6: Simplify Your Content</h3>
        <p>Your slides are a <strong>support tool — not a script.</strong></p>
        <ul>
          <li>Use keywords and phrases, not long paragraphs</li>
          <li>Focus on clarity, not complexity</li>
          <li>Let your spoken words do the heavy lifting</li>
        </ul>
        <p>When your content is simple, your delivery becomes powerful.</p>

        <h3>🤝 Tip 7: Engage Your Audience Actively</h3>
        <p>The best presentations feel like <strong>conversations, not lectures.</strong></p>
        <ul>
          <li>Ask questions throughout</li>
          <li>Share real-life examples they can relate to</li>
          <li>Encourage participation and responses</li>
        </ul>
        <p><em>When your audience is engaged, your confidence naturally increases.</em></p>

        <h3>🧘 Tip 8: Manage Nervousness Smartly</h3>
        <p>Feeling nervous before a presentation?
        <strong>That's completely normal.</strong></p>
        <ul>
          <li>Take slow, deep breaths before you begin</li>
          <li>Shift your focus to your message, not reactions</li>
          <li>Start strong — confidence builds as you speak</li>
        </ul>
        <p><em>The first 30 seconds are the hardest. After that, it gets easier.</em></p>

        <h3>📖 Tip 9: Use Real-Life Examples and Stories</h3>
        <p>Facts inform. <strong>Stories inspire.</strong> People remember
        <strong>how you made them feel</strong>, not the exact words you said.
        Weave in:</p>
        <ul>
          <li>Personal experiences</li>
          <li>Client success stories</li>
          <li>Relatable scenarios</li>
        </ul>
        <p>Stories make your presentation
        <strong>memorable, human, and impactful.</strong></p>

        <h3>🔚 Tip 10: End with a Powerful Closing</h3>
        <p>Your closing is the
        <strong>last thing your audience remembers — make it count.</strong></p>
        <ul>
          <li>Summarize your key points clearly</li>
          <li>Leave behind one strong message</li>
          <li>Inspire your audience to take action</li>
        </ul>
        <p><em>Don't just stop speaking — land your message with purpose.</em></p>

        <h3>Conclusion</h3>
        <p>Improving your presentation skills is not about being
        <strong>perfect</strong> — it's about being
        <strong>prepared, clear, and connected.</strong></p>
        <p>Every great speaker was once a nervous beginner. The only difference
        between where you are and where you want to be is
        <strong>consistent practice and the right guidance.</strong></p>
        <p><strong><em>"Confidence is built one presentation at a time.
        Start today."</em></strong></p>

        <br>
        <p>📩 <strong>Ready to Transform Your Presentation Skills?</strong><br>
        Join <strong>Sabeeha Mirza's Presentation Skills Training Program</strong>
        and learn how to speak with confidence, clarity, and impact.</p>
        <a href="index.html#contact" style="
          display: inline-block;
          background: #6a1b9a;
          color: #fff;
          padding: 10px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 700;
          margin-top: 10px;
        ">👉 Book Your Spot Now</a>

        `
    },
    
    'article-9': {
      title: "Communication Skills Training for Professionals: A Complete Guide",
      tag: "Soft Skills",
      date: "Apr 9, 2026",
      readTime: "8 min read",
      image: "client images/communication-training.jpg",
      content: `
        <p>You can have the best ideas in the room. But if you cannot
        <strong>communicate them clearly and confidently</strong>, those ideas may
        never get the attention they deserve.</p>

        <p>In today's competitive corporate world,
        <strong>strong communication skills are no longer optional — they are
        essential.</strong> They determine how you are perceived, how far you grow,
        and how effectively you lead.</p>

        <h3>Why Communication Skills Matter More Than Ever</h3>
        <p>Strong communication skills help professionals:</p>
        <ul>
          <li><strong>Build meaningful relationships</strong> at work</li>
          <li><strong>Avoid misunderstandings</strong> that cost time and trust</li>
          <li><strong>Improve teamwork</strong> and collaboration</li>
          <li><strong>Enhance leadership presence</strong> and executive credibility</li>
        </ul>
        <p><em>The way you communicate is the way the world perceives you.</em></p>

        <h3>Key Components of Effective Communication</h3>

        <h3>🗣️ 1. Verbal Communication</h3>
        <p>The foundation of professional communication lies in
        <strong>what you say and how you say it.</strong></p>
        <ul>
          <li>Speak with <strong>clarity and conciseness</strong> — say more with fewer words</li>
          <li>Structure your thoughts <strong>before</strong> you speak</li>
          <li>Maintain a <strong>professional yet approachable tone</strong></li>
        </ul>

        <h3>🧍 2. Non-Verbal Communication</h3>
        <p>Research shows that
        <strong>over 55% of communication is non-verbal.</strong>
        Your body communicates constantly — even when you are not speaking.</p>
        <ul>
          <li><strong>Body language</strong> — posture, gestures, and movement</li>
          <li><strong>Facial expressions</strong> — warmth, confidence, engagement</li>
          <li><strong>Eye contact</strong> — builds trust and credibility</li>
        </ul>

        <h3>👂 3. Active Listening Skills</h3>
        <p><em>Communication is a two-way street — and listening is half the journey.</em></p>
        <p>Active listening helps you:</p>
        <ul>
          <li>Build <strong>genuine trust</strong> with colleagues and clients</li>
          <li>Respond with <strong>more clarity and relevance</strong></li>
          <li>Avoid <strong>assumptions and miscommunication</strong></li>
        </ul>

        <h3>✍️ 4. Written Communication</h3>
        <p>In a world of emails, reports, and proposals — how you write reflects
        your professionalism.</p>
        <ul>
          <li>Clear and structured <strong>emails</strong></li>
          <li>Well-organized <strong>reports and documentation</strong></li>
          <li>Professional yet <strong>human messaging</strong></li>
        </ul>
        <p><em>Every email you send is a reflection of your personal brand.</em></p>

        <h3>Common Challenges Professionals Face</h3>
        <ul>
          <li>Lack of confidence in meetings and presentations</li>
          <li>Fear of public speaking</li>
          <li>Poor clarity in expression</li>
          <li>Ineffective presentations</li>
          <li>Difficulty with difficult conversations</li>
        </ul>

        <h3>How Training Helps</h3>
        <p>With the right communication skills training, you will:</p>
        <ul>
          <li>Speak with <strong>genuine confidence</strong> in meetings and presentations</li>
          <li><strong>Structure your thoughts</strong> clearly before conversations</li>
          <li>Handle <strong>difficult conversations</strong> with professionalism and empathy</li>
          <li>Improve <strong>workplace relationships</strong> and team dynamics</li>
          <li>Build a <strong>commanding professional presence</strong></li>
        </ul>

        <h3>Practical Tips to Improve Right Now</h3>
        <ul>
          <li><strong>Practice daily</strong> — look for every opportunity to speak and write</li>
          <li><strong>Seek honest feedback</strong> from colleagues or mentors</li>
          <li><strong>Observe effective communicators</strong> — study what they do differently</li>
          <li><strong>Participate actively</strong> in meetings and group discussions</li>
          <li><strong>Record yourself speaking</strong> — awareness is the first step to improvement</li>
        </ul>

        <h3>Conclusion</h3>
        <p>Communication is not just a <strong>soft skill</strong> — it is a
        <strong>career accelerator.</strong></p>
        <p>The professionals who rise to leadership earn trust and create impact
        by communicating with
        <strong>clarity, confidence, and authenticity.</strong></p>
        <p><strong><em>"The way you communicate determines the way you grow."</em></strong></p>

        <br>
        <p>📩 <strong>Ready to Level Up Your Communication?</strong><br>
        Enroll in <strong>Sabeeha Mirza's Communication Skills Workshop</strong> —
        designed for professionals who want to speak with confidence and lead
        with clarity.</p>
        <a href="index.html#contact" style="
          display: inline-block;
          background: #6a1b9a;
          color: #fff;
          padding: 10px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 700;
          margin-top: 10px;
        ">👉 Reserve Your Seat Today</a>

        `
    },

    // ✅ NEW — Blog 3: Stage Fear
    'article-10': {
      title: "How to Overcome Stage Fear: Practical Techniques That Actually Work",
      tag: "Soft Skills",
      date: "Apr 9, 2026",
      readTime: "7 min read",
      image: "client images/stage-fear.jpg",
      content: `

        <p>Your name is called. You walk up to the front of the room. Suddenly your
        <strong>heart is racing, your hands are trembling, your mind goes completely
        blank.</strong></p>

        <p>If this sounds familiar, know this —
        <strong>you are not alone. And you are not stuck.</strong></p>

        <p>Fear of public speaking affects up to
        <strong>75% of people</strong> worldwide. But here is what nobody tells you:
        <strong>stage fear is not a life sentence.</strong> It can be overcome with
        the right mindset, techniques, and consistent practice.</p>

        <h3>Why Do We Fear Public Speaking?</h3>
        <p>Stage fear often stems from:</p>
        <ul>
          <li><strong>Fear of judgment</strong> — "What will people think of me?"</li>
          <li><strong>Lack of preparation</strong> — feeling underprepared creates anxiety</li>
          <li><strong>Low self-confidence</strong> — doubting your own ability and worth</li>
          <li><strong>Overthinking</strong> — imagining worst-case scenarios</li>
          <li><strong>Past negative experiences</strong> — a bad moment that left a mark</li>
        </ul>
        <p><em>Most stage fear is not about the stage. It is about the story we tell
        ourselves before we even get there.</em></p>

        <h3>7 Proven Techniques to Overcome Stage Fear</h3>

        <h3>📚 Technique 1: Prepare Thoroughly</h3>
        <p>The number one cause of stage fear is
        <strong>feeling unprepared.</strong></p>
        <p>Preparation does not mean memorizing every word — it means knowing your
        message so well that you can speak about it comfortably from any angle.</p>
        <p><em>Preparation is the antidote to panic.</em></p>

        <h3>🔁 Technique 2: Practice Repeatedly — In Real Conditions</h3>
        <p>Reading your notes silently is <strong>not practice.</strong>
        Real practice means:</p>
        <ul>
          <li>Speaking your content <strong>out loud</strong>, multiple times</li>
          <li>Practicing <strong>in front of others</strong> — friends, family, colleagues</li>
          <li><strong>Recording yourself</strong> to observe tone, pace, and body language</li>
          <li><strong>Timing yourself</strong> to build comfort with pacing</li>
        </ul>
        <p><em>Every time you practice, fear loses a little more of its power.</em></p>

        <h3>🐣 Technique 3: Start Small — Build Confidence Gradually</h3>
        <p>You do not need to start with a TEDx Talk. Begin in
        <strong>low-pressure situations:</strong></p>
        <ul>
          <li>Share your opinion in a team meeting</li>
          <li>Introduce yourself at a networking event</li>
          <li>Speak up in a group discussion or class</li>
        </ul>
        <p><em>Small wins build massive confidence over time.</em></p>

        <h3>🔄 Technique 4: Shift Your Focus — From Self to Service</h3>
        <p>Make this powerful mindset shift:</p>
        <ul>
          <li>From: <em>"What will people think of me?"</em></li>
          <li>To: <strong>"What value am I giving them?"</strong></li>
        </ul>
        <p><em>When you focus on serving your audience instead of impressing them,
        self-consciousness dissolves.</em></p>

        <h3>🌬️ Technique 5: Use Breathing Techniques</h3>
        <p>Try this simple technique <strong>before</strong> you speak:</p>
        <ul>
          <li>Inhale slowly for <strong>4 counts</strong></li>
          <li>Hold for <strong>4 counts</strong></li>
          <li>Exhale slowly for <strong>6 counts</strong></li>
          <li>Repeat <strong>3 to 5 times</strong></li>
        </ul>
        <p><em>One deep breath can change everything.</em></p>

        <h3>🎯 Technique 6: Visualize Success</h3>
        <p>Before your presentation, close your eyes and imagine:</p>
        <ul>
          <li>Walking to the stage with confidence</li>
          <li>Speaking clearly and calmly</li>
          <li>Your audience nodding, smiling, and engaged</li>
          <li>Finishing strong and feeling proud</li>
        </ul>
        <p><em>Your brain cannot tell the difference between a vividly imagined
        experience and a real one. Use that to your advantage.</em></p>

        <h3>💛 Technique 7: Accept Imperfection</h3>
        <p>Nobody is expecting you to be perfect. They are hoping you will be
        <strong>real.</strong></p>
        <p>Your audience connects with
        <strong>human beings — not perfect robots.</strong>
        When you stumble and recover with grace, that
        <strong>builds trust and relatability.</strong></p>
        <p><em>Perfectionism fuels fear. Authenticity sets you free.</em></p>

        <h3>Conclusion</h3>
        <p>Stage fear is <strong>real — but it is not permanent.</strong></p>
        <p>Every confident speaker you admire today was once exactly where you are.
        They did not become fearless — they became <strong>courageous.</strong>
        They showed up despite the fear. They practiced. And they kept going.</p>
        <p><strong><em>"Courage is not the absence of fear. It is choosing to speak
        even when you are afraid."</em></strong></p>

        <br>
        <p>📩 <strong>Ready to Conquer Your Fear of Public Speaking?</strong><br>
        Join <strong>Sabeeha Mirza's Public Speaking and Confidence Building
        Workshop</strong> — a transformative program to help you speak with power,
        presence, and authenticity.</p>
        <a href="index.html#contact" style="
          display: inline-block;
          background: #6a1b9a;
          color: #fff;
          padding: 10px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 700;
          margin-top: 10px;
        ">👉 Claim Your Spot Today</a>

      `
    },
    
       'article-11': {
title: "Top 7 Communication Skills Every Employee Must Have in 2026",
tag: "Communication",
date: "Apr 28, 2026",
readTime: "6 min read",
image: "client images/Top 7 Communication Skills.jpg",

content: `

<p>
  In today’s evolving workplace, communication is no longer a
  <strong>“soft skill” — it is a core business skill.</strong>
</p>

<p>
  Organizations across Ahmedabad and India are increasingly investing in
  communication skills training to help employees perform effectively in
  fast-changing professional environments.
</p>

<h3>Why Communication Skills Matter More Than Ever</h3>

<p>
  Strong communication improves teamwork, productivity, leadership, and
  workplace confidence.
</p>

<ul>
  <li>Collaborating with teams</li>
  <li>Handling clients professionally</li>
  <li>Leading discussions and meetings</li>
  <li>Solving workplace conflicts</li>
  <li>Building trust and credibility</li>
</ul>

<h3>Top 7 Communication Skills Every Employee Needs</h3>

<h3>1. Clear Business Writing</h3>
<p>
  Employees must be able to write concise and professional emails,
  reports, and workplace messages.
</p>

<h3>2. Active Listening</h3>
<p>
  Understanding instructions, feedback, and concerns accurately improves
  productivity and reduces misunderstandings.
</p>

<h3>3. Presentation Skills</h3>
<p>
  Confident speaking is essential for meetings, pitches, and leadership
  opportunities.
</p>

<h3>4. Interpersonal Communication</h3>
<p>
  Building strong workplace relationships is critical for collaboration
  and team success.
</p>

<h3>5. Feedback & Conflict Management</h3>
<p>
  Employees should know how to handle difficult conversations
  professionally and respectfully.
</p>

<h3>6. Digital Communication Etiquette</h3>
<p>
  In hybrid workplaces, clarity in chats, emails, and virtual meetings
  has become extremely important.
</p>

<h3>7. Confidence in Expression</h3>
<p>
  Employees must feel confident sharing ideas, opinions, and suggestions.
</p>

<h3>Conclusion</h3>

<p>
  Organizations that invest in communication and soft skills training see
  significant improvement in employee engagement, leadership, and overall
  performance.
</p>

<p>
  <strong>
    Communication is no longer optional — it is a career advantage.
  </strong>
</p>

`
},

'article-12': {
title: "How Corporate Training Improves Employee Performance and Business ROI",
tag: "Communication",
date: "Apr 30, 2026",
readTime: "5 min read",
image: "client images/ROI.jpg",

content: `

<p>
  Many organizations still view training as an expense.
  In reality, it is a
  <strong>strategic investment with measurable returns.</strong>
</p>

<p>
  Companies investing in employee development programs are seeing clear
  improvements in productivity, leadership, and business growth.
</p>

<h3>Why Corporate Training Matters</h3>

<p>
  Employees perform better when they are equipped with the right
  communication, leadership, and interpersonal skills.
</p>

<h3>1. Increased Productivity</h3>

<p>
  Trained employees complete tasks faster, communicate more effectively,
  and make fewer mistakes.
</p>

<h3>2. Better Leadership Outcomes</h3>

<p>
  Managers with strong communication and people skills build stronger,
  more motivated teams.
</p>

<h3>3. Improved Employee Retention</h3>

<p>
  Employees are more likely to stay in organizations that invest in their
  growth and development.
</p>

<h3>4. Stronger Client Relationships</h3>

<p>
  Professionally trained employees represent the company with greater
  confidence and professionalism.
</p>

<h3>5. Measurable ROI</h3>

<p>
  Organizations see long-term returns through improved efficiency,
  teamwork, and performance.
</p>

<h3>The Real Impact of Training</h3>

<ul>
  <li>Communication skills</li>
  <li>Leadership confidence</li>
  <li>Team collaboration</li>
  <li>Problem-solving ability</li>
  <li>Professional workplace behavior</li>
</ul>

<h3>Conclusion</h3>

<p>
  Investing in corporate workshops and employee development directly
  contributes to long-term business success.
</p>

<p>
  <strong>
    Well-trained employees create stronger organizations.
  </strong>
</p>

`
},

'article-13': {
title: "How to Choose the Best Corporate Trainer in Ahmedabad",
tag: "Communication",
date: "May 2, 2026",
readTime: "6 min read",
image: "client images/Trainer.jpg",

content: `

<p>
  Selecting the right trainer can determine the success or failure of your
  corporate training program.
</p>

<p>
  If you are searching for a communication or soft skills trainer in
  Ahmedabad, there are several important factors to consider.
</p>

<h3>1. Customization</h3>

<p>
  Avoid generic workshops.
  Effective training should be tailored to your organization’s goals,
  challenges, and employees.
</p>

<h3>2. Industry Understanding</h3>

<p>
  A good trainer understands real workplace challenges and practical
  business communication needs.
</p>

<h3>3. Practical Approach</h3>

<p>
  The best workshops focus on application-based learning rather than
  theory-heavy sessions.
</p>

<h3>4. Engagement & Interaction</h3>

<p>
  Interactive sessions improve participation, retention, and confidence.
</p>

<h3>5. Measurable Results</h3>

<p>
  Training should lead to visible improvements in communication,
  confidence, teamwork, and leadership.
</p>

<h3>6. Experience & Credibility</h3>

<p>
  Always review testimonials, past workshops, industries served, and
  training experience before making a decision.
</p>

<h3>Why the Right Trainer Matters</h3>

<ul>
  <li>Communicate confidently</li>
  <li>Handle workplace challenges professionally</li>
  <li>Improve collaboration and leadership</li>
  <li>Develop practical business communication skills</li>
</ul>

<h3>Conclusion</h3>

<p>
  Choosing the right corporate communication trainer ensures your
  investment delivers long-term impact and meaningful employee growth.
</p>

<p>
  <strong>
    Great training creates confident professionals and stronger teams.
  </strong>
</p>

`
},

'article-14': {
  title: "Can Communication Skills Be Taught Through Gamification?",
  tag: "Communication",
  date: "May 5, 2026",
  readTime: "7 min read",
  image: "client images/Gamification.jpg",

  content: `

    <p>
      Communication is often referred to as the most important workplace skill,
      yet it remains one of the most challenging to master.
      Organisations invest heavily in training programmes, but many employees
      continue to struggle with presenting ideas, collaborating effectively,
      handling conflicts, or influencing others.
    </p>

    <p>
      Rather than relying solely on lectures and presentations,
      forward-thinking organisations are embracing
      <strong>gamification</strong>—an approach that transforms learning into
      an engaging, interactive, and memorable experience.
    </p>

    <h3>What Is Gamification in Communication Skills Training?</h3>

    <p>
      Gamification is the strategic use of game elements such as challenges,
      role plays, simulations, storytelling, problem-solving and collaboration
      to achieve meaningful learning outcomes.
    </p>

    <p>
      The objective isn't entertainment—it's behavioural transformation.
    </p>

    <h3>Why Traditional Communication Training Often Falls Short</h3>

    <p>
      Communication is a behavioural skill. Real learning happens when
      participants experience, practise, receive feedback and reflect.
      This is precisely where gamification excels.
    </p>

    <h3>Why Gamification Works</h3>

    <p>
      One of the strongest foundations of gamified learning is
      <strong>David Kolb's Experiential Learning Cycle</strong>,
      which explains that meaningful learning occurs through experience,
      reflection and application.
    </p>

    <div class="kolb-image">

      <img src="client images/david-kolb-learning-cycle.png"
           alt="David Kolb's Experiential Learning Cycle">

      <p class="image-caption">
        David Kolb's Experiential Learning Cycle demonstrates how experience,
        reflection, conceptual understanding and application work together to
        create lasting behavioural change.
      </p>

    </div>

    <h3>The Four Stages of Experiential Learning</h3>

    <h4>1. Concrete Experience – Do It</h4>

    <p>
      Participants engage in games or simulations that mirror workplace
      challenges.
    </p>

    <h4>2. Reflective Observation – Think About It</h4>

    <p>
      Participants reflect on what happened, what worked and what could be
      improved.
    </p>

    <h4>3. Abstract Conceptualisation – Understand the Why</h4>

    <p>
      The facilitator connects the experience with communication theories,
      behavioural science and workplace principles.
    </p>

    <h4>4. Active Experimentation – Apply It</h4>

    <p>
      Participants identify practical actions they will implement in their
      everyday work.
    </p>

    <h3>The Importance of the Debrief</h3>

    <p>
      Without reflection, a game remains an enjoyable activity.
      Through thoughtful questioning and guided discussion,
      participants convert experiences into insights,
      insights into behavioural awareness,
      and awareness into lasting change.
    </p>

    <blockquote>
      The game captures attention.
      The debrief creates understanding.
      Reflection builds self-awareness.
      Application drives behavioural change.
    </blockquote>

    <h3>Five Ways Gamification Enhances Communication Skills</h3>

    <ul>
      <li>Creates realistic workplace learning experiences.</li>
      <li>Builds confidence through safe practice.</li>
      <li>Improves team collaboration.</li>
      <li>Strengthens critical thinking and problem-solving.</li>
      <li>Makes learning engaging and memorable.</li>
    </ul>

    <h3>Communication Skills Developed</h3>

    <ul>
      <li>Active Listening</li>
      <li>Public Speaking</li>
      <li>Business Communication</li>
      <li>Presentation Skills</li>
      <li>Emotional Intelligence</li>
      <li>Leadership Communication</li>
      <li>Team Collaboration</li>
      <li>Conflict Resolution</li>
      <li>Negotiation Skills</li>
      <li>Critical Thinking</li>
      <li>Problem Solving</li>
      <li>Decision Making</li>
      <li>Customer Service Communication</li>
    </ul>

    <h3>Final Thoughts</h3>

    <p>
      Communication develops through experience, reflection, understanding and
      application. Gamification, combined with David Kolb's Experiential
      Learning Cycle, provides exactly this learning journey.
    </p>

    <p>
      <strong>
        People may forget what they were taught,
        but they rarely forget what they experienced.
      </strong>
    </p>

  `
}

};
     
  

  // Get modal DOM elements
  const modalOverlay = document.getElementById("modal-overlay");
  const modalContent = document.getElementById("modal-content");
  const modalLoading = document.getElementById("modal-loading");
  const modalClose = document.getElementById("modal-close");
  const blogGrid = document.querySelector(".blog-grid");

  // Function to open modal
  function openModal(articleId) {
    const article = articleDatabase[articleId];
    
    if (!article) {
      console.error("Article not found:", articleId);
      return;
    }

    // Show loading state
    if (modalLoading) {
      modalLoading.style.display = "block";
    }
    if (modalContent) {
      modalContent.style.display = "none";
    }
    
    // Add blur to background
    if (blogGrid) {
      blogGrid.classList.add("blurred");
    }
    
    // Show modal
    if (modalOverlay) {
      modalOverlay.classList.add("active");
      document.body.classList.add("modal-open");
    }

    // Simulate loading (replace with actual API call in production)
    setTimeout(() => {
      // Build article HTML
      const articleHTML = `
        <article class="article-full-content">
          <header class="article-header">
            <span class="tag">${article.tag}</span>
            <span class="date">${article.date} • ${article.readTime}</span>
            <h2>${article.title}</h2>
          </header>

          ${article.image ? `<img src="${article.image}" alt="${article.title}" class="article-hero-image">` : ''}

          <div class="article-body">
            ${article.content}
          </div>
        </article>
      `;
      
      if (modalContent) {
        modalContent.innerHTML = articleHTML;
        modalContent.style.display = "block";
        modalContent.scrollTop = 0;
      }
      
      // Hide loading
      if (modalLoading) {
        modalLoading.style.display = "none";
      }
    }, 400);
  }

  // Function to close modal
  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove("active");
    }
    if (blogGrid) {
      blogGrid.classList.remove("blurred");
    }
    document.body.classList.remove("modal-open");
    
    // Clear content after animation
    setTimeout(() => {
      if (modalContent) {
        modalContent.innerHTML = "";
      }
    }, 300);
  }

  // Event delegation for Read More buttons (Blog page)
  document.addEventListener("click", (e) => {
    const readMoreBtn = e.target.closest(".read-more");
    
    if (readMoreBtn) {
      e.preventDefault();
      const card = readMoreBtn.closest(".blog-card");
      const articleId = card?.dataset.article;
      
      if (articleId && modalOverlay) {
        openModal(articleId);
      }
    }
  });

  // Close modal events
  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  // Click overlay to close
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Escape key to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // Close modal if open
      if (modalOverlay && modalOverlay.classList.contains("active")) {
        closeModal();
      }
      // Also close mobile menu if open
      if (navList && navList.classList.contains("active")) {
        navList.classList.remove("active");
        if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
      }
    }
  });

  // Prevent modal content click from closing
  const modalContainer = document.querySelector(".article-modal");
  if (modalContainer) {
    modalContainer.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  // Category filter functionality (Blog page)
  const categoryButtons = document.querySelectorAll(".blog-categories button");
  const blogCards = document.querySelectorAll(".blog-card");

  if (categoryButtons.length && blogCards.length) {
    categoryButtons.forEach(button => {
      button.addEventListener("click", () => {
        // Update active button
        categoryButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        
        const category = button.textContent.trim().toLowerCase();
        
        // Filter cards
        blogCards.forEach(card => {
          const cardTag = card.querySelector(".tag")?.textContent.trim().toLowerCase();
          
          if (category === "all topics" || cardTag?.includes(category.split(" ")[0])) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }
  // Text Reveal Animation
const reveals = document.querySelectorAll('.reveal');

function revealOnScroll() {
  reveals.forEach((el) => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const elementVisible = 100;

    if (elementTop < windowHeight - elementVisible) {
      el.classList.add('active');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);


  console.log("✅ All systems initialized");

// ========================================
