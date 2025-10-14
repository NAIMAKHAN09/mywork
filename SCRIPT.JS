document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Sabeeha site loaded");

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
    });

    // Close on link click
    navList.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        navList.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });

    // Close menu on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navList.classList.contains("active")) {
        navList.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
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
          ${article.image ? `<img src="${article.image}" alt="${article.title}" class="article-hero-image">` : ''}
          
          <header class="article-header">
            <span class="tag">${article.tag}</span>
            <span class="date">${article.date} • ${article.readTime}</span>
            <h2>${article.title}</h2>
          </header>
          
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
  // MOBILE NAVIGATION - COMPLETE FIX
  // ========================================
  const menuBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;
  
  if (menuBtn && navLinks) {
    console.log("✅ Mobile menu initialized");
    
    // Toggle menu on button click
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      body.classList.toggle('menu-open');
      
      // Animate menu icon
      const isOpen = navLinks.classList.contains('active');
      menuBtn.innerHTML = isOpen ? '✕' : '☰';
      menuBtn.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0)';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        body.classList.remove('menu-open');
        menuBtn.innerHTML = '☰';
        menuBtn.style.transform = 'rotate(0)';
      }
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        body.classList.remove('menu-open');
        menuBtn.innerHTML = '☰';
        menuBtn.style.transform = 'rotate(0)';
      });
    });
  } else {
    console.log("⚠️ Menu button or nav links not found");
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
  // TYPING EFFECT (IF EXISTS)
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
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // HERO BOOKING MODAL (IF EXISTS)
  // ========================================
  const heroBookBtn = document.getElementById('hero-book-btn');
  const bookingModal = document.getElementById('booking-modal');
  const closeModalBtn = document.getElementById('close-booking-modal');

  if (heroBookBtn && bookingModal) {
    // Open modal
    heroBookBtn.addEventListener('click', () => {
      bookingModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
    
    // Close modal function
    function closeBookingModal() {
      bookingModal.classList.remove('show');
      document.body.style.overflow = '';
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
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && bookingModal.classList.contains('show')) {
        closeBookingModal();
      }
    });
  }

  // ========================================
  // BLOG MODAL (IF ON BLOG PAGE)
  // ========================================
  const modalOverlay = document.getElementById("modal-overlay");
  if (modalOverlay) {
    // Your existing blog modal code here
    console.log("✅ Blog modal system initialized");
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

  console.log("✅ All systems initialized");
}); // <-- Only ONE closing bracket here


