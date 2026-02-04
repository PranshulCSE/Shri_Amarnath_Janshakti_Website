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

  // Attach submit handler to all forms (sends email, shows popup, resets form)
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', handleAnyFormSubmit);
  });

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

// ===== Handle Any Form Submission (send email, reset, show popup) =====
function handleAnyFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formName = form.getAttribute('name') || form.id || 'Website Form';

  // Build an object from the submitted form (handles inputs with same names correctly)
  const fd = new FormData(form);
  const data = {};
  fd.forEach((value, key) => {
    // If multiple fields share the same name, collect them into an array
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (Array.isArray(data[key])) data[key].push(value);
      else data[key] = [data[key], value];
    } else {
      data[key] = value;
    }
  });

  // Optional: show a temporary notification
  showNotification('Sending message...', 'info');

  sendEmail(formName, data)
    .then(() => {
      showPopup('Thank you! Your message has been sent successfully.');
      form.reset();
    })
    .catch(err => {
      console.error('Form send failed:', err);
      showNotification('Failed to send message. Please try again later.', 'warning');
    });
}

// ===== Send email (EmailJS preferred, fallback to mailto) =====
function sendEmail(formName, dataObj) {
  // Configuration - replace these with your actual values
  const RECIPIENT_EMAIL = 'youremail@example.com'; // <-- change this
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // <-- change this
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // <-- change this
  const EMAILJS_USER_ID = 'YOUR_USER_ID'; // <-- change this

  const templateParams = {
    form_name: formName,
    ...dataObj
  };

  if (window.emailjs && emailjs.send) {
    // If a user id is available, init (safe to call multiple times)
    if (emailjs.init && EMAILJS_USER_ID) emailjs.init(EMAILJS_USER_ID);
    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
  }

  // Fallback: open user's email client (mailto:) — user must send manually
  const subject = encodeURIComponent(`${formName} Submission`);
  const body = encodeURIComponent(Object.entries(dataObj).map(([k, v]) => `${k}: ${v}`).join('\n'));
  const mailto = `mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;
  window.open(mailto, '_blank');
  return Promise.resolve();
}

// ===== Popup Thank You =====
function showPopup(message, timeout = 4000) {
  const overlay = document.createElement('div');
  overlay.className = 'form-popup-overlay';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.5);
    z-index: 10001;
  `;

  const box = document.createElement('div');
  box.className = 'form-popup-box';
  box.style.cssText = `
    background: #fff;
    color: #111;
    padding: 28px;
    border-radius: 10px;
    max-width: 480px;
    width: 90%;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    text-align: center;
    font-weight: 600;
  `;

  box.innerHTML = `<div style="font-size:18px;margin-bottom:8px">${message}</div>
                   <button type="button" class="form-popup-close" style="margin-top:12px;padding:8px 14px;border-radius:6px;background:#06a77d;color:#fff;border:none;cursor:pointer">Close</button>`;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  box.querySelector('.form-popup-close').addEventListener('click', close);

  setTimeout(close, timeout);
}

// ===== Show Notification =====
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add styles dynamically (different colors per type)
  const bgColor = type === 'success' ? '#06a77d' : type === 'warning' ? '#f6a11b' : type === 'danger' ? '#d62828' : '#004e89';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${bgColor};
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
