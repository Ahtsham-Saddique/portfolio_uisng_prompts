// =====================
// Mobile Menu Toggle with Overlay
// =====================
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

// Create overlay element dynamically
const navOverlay = document.createElement('div');
navOverlay.className = 'nav-overlay';
document.body.appendChild(navOverlay);

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    menuToggle.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close menu when clicking on a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('active');
      menuToggle.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Close menu when clicking on overlay
  navOverlay.addEventListener('click', () => {
    navLinksContainer.classList.remove('active');
    menuToggle.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
}

// =====================
// Scroll to Top Button
// =====================
const scrollBtn = document.getElementById("scrollTop");

if (scrollBtn) {
  window.addEventListener("scroll", () => {
    scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// =====================
// Lazy Loading Images
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img[data-src]");
  images.forEach(img => {
    img.src = img.dataset.src;
  });
});

// =====================
// Form Submission (Contact Page) - Using Formspree
// =====================
const contactForm = document.querySelector('#whatsapp-contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show sending state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
      const response = await fetch(this.action, {
        method: 'POST',
        body: new FormData(this),
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        // Success
        submitBtn.textContent = 'Message Sent! ✓';
        submitBtn.classList.add('btn-success');
        submitBtn.classList.remove('btn-primary');
        this.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('btn-success');
          submitBtn.classList.add('btn-primary');
        }, 3000);
        
        alert('Thank you! Your message has been sent successfully.');
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      // Error
      submitBtn.textContent = 'Error! Try Again';
      submitBtn.disabled = false;
      
      alert('Sorry, there was an error sending your message. Please try again or email directly.');
      console.error('Form submission error:', error);
    }
  });
}

// =====================
// Smooth Scroll for Navigation
// =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// =====================
// Navbar Scroll Effects - Senior Developer Design
// =====================
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// =====================
// Reveal Animation on Scroll
// =====================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// =====================
// Project Card Hover Enhancement
// =====================
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-10px)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

// =====================
// Service Item Hover Enhancement
// =====================
document.querySelectorAll('.service-item').forEach(item => {
  item.addEventListener('mouseenter', function() {
    this.style.transform = 'translateX(10px)';
  });
  
  item.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

// =====================
// Method Card Hover Enhancement
// =====================
document.querySelectorAll('.method-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-10px)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

// =====================
// Skill Card Hover Enhancement
// =====================
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-5px)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

// =====================
// Console Welcome Message
// =====================
console.log('%c🚀 Welcome to Ahtsham\'s Portfolio!', 'font-size: 20px; font-weight: bold; color: #00f5ff;');
console.log('%cFeel free to explore the code and connect with me!', 'color: #7f5cff;');
console.log('%cGitHub: https://github.com/ahtsham-saddique', 'color: #00f5ff;');
console.log('%cLinkedIn: https://linkedin.com/in/ahtsham-saddique', 'color: #0077b5;');

// =====================
// Active Nav Link Highlighting on Scroll
// =====================
const sections = document.querySelectorAll('section[id]');
const navLinksList = document.querySelectorAll('.nav-links a');

function highlightNavOnScroll() {
  const scrollY = window.pageYOffset;
  
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinksList.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', highlightNavOnScroll);
