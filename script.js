// ===== Year Update =====
document.addEventListener('DOMContentLoaded', function() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navbar = document.getElementById('navbar');

  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navbar.classList.toggle('active');
    });
  }

  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navbar.classList.remove('active');
      // Update active state
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Set active link based on current page
  setActiveLink();

  // Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }

  // Donation Form Submission
  const donationForm = document.getElementById('donationForm');
  if (donationForm) {
    donationForm.addEventListener('submit', handleDonationForm);
  }

  // Newsletter Form Submission
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterForm);
  }

  // Add scroll animation
  addScrollAnimations();
});

// ===== Set Active Navigation Link =====
function setActiveLink() {
  const currentLocation = location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentLocation.includes(href) || 
        (currentLocation.endsWith('/') && href === 'index.html') ||
        (currentLocation.split('/').pop() === href.split('/').pop())) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ===== Handle Contact Form =====
function handleContactForm(event) {
  event.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };

  // Simulate form submission
  console.log('Contact Form Data:', formData);
  
  // Show success message
  showNotification('Message sent successfully! We will contact you soon.', 'success');
  
  // Reset form
  event.target.reset();
}

// ===== Handle Donation Form =====
function handleDonationForm(event) {
  event.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    amount: document.getElementById('amount').value,
    message: document.getElementById('message').value,
    anonymous: document.getElementById('anonymous').checked
  };

  console.log('Donation Form Data:', formData);
  
  // Show success message
  showNotification(`Thank you for donating ₹${formData.amount}! Your contribution helps us serve more pilgrims.`, 'success');
  
  // Reset form
  event.target.reset();
}

// ===== Handle Newsletter Form =====
function handleNewsletterForm(event) {
  event.preventDefault();
  
  const email = event.target.querySelector('input[type="email"]').value;
  
  console.log('Newsletter Email:', email);
  
  // Show success message
  showNotification('Successfully subscribed to our newsletter!', 'success');
  
  // Reset form
  event.target.reset();
}

// ===== Show Notification =====
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add styles dynamically
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'success' ? '#06a77d' : '#004e89'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    animation: slideInRight 0.4s ease;
    font-weight: 600;
    max-width: 400px;
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.4s ease';
    setTimeout(() => notification.remove(), 400);
  }, 4000);
}

// ===== Scroll Animations =====
function addScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with animation classes
  const animatableElements = document.querySelectorAll(
    '.feature-card, .detail-card, .route-card, .tip-card, .milestone, .gallery-item, .news-card, .event-item, .role-card, .achievement-card'
  );

  animatableElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// ===== Add CSS Animations =====
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Prevent layout shift */
  .navbar {
    transition: max-height 0.3s ease;
  }

  /* Smooth transitions for all interactive elements */
  * {
    transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  }
`;
document.head.appendChild(style);

// ===== Lazy Load Images =====
function lazyLoadImages() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Call lazy load on document ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', lazyLoadImages);
} else {
  lazyLoadImages();
}

// ===== Mobile Menu Auto Close on Scroll =====
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  if (navbar && navbar.classList.contains('active')) {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop) {
      // Scrolling down
      navbar.classList.remove('active');
    }
    lastScrollTop = st <= 0 ? 0 : st;
  }
});

// ===== Add Ripple Effect to Buttons =====
function addRippleEffect() {
  document.querySelectorAll('.btn, .action-btn, .social-icon').forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: translate(${x}px, ${y}px);
        pointer-events: none;
        animation: rippleAnimation 0.6s ease-out;
      `;

      if (this.style.position === 'static') {
        this.style.position = 'relative';
      }

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// Add ripple effect CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleAnimation {
    to {
      transform: translate(0, 0) scale(2);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

// Call ripple effect function
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addRippleEffect);
} else {
  addRippleEffect();
}

// ===== Filter Functionality (for Gallery/News if needed) =====
window.filterItems = function(category) {
  const items = document.querySelectorAll('[data-category]');
  items.forEach(item => {
    if (category === 'all' || item.dataset.category === category) {
      item.style.display = 'block';
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 10);
    } else {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      setTimeout(() => {
        item.style.display = 'none';
      }, 300);
    }
  });
};

// ===== Accessibility - Keyboard Navigation =====
document.addEventListener('keydown', function(event) {
  // Close menu on Escape key
  if (event.key === 'Escape') {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.classList.remove('active');
    }
  }
});

console.log('SAJSSM Website Script Loaded Successfully!');
