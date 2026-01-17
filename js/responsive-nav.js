/* Responsive Navigation JavaScript */
/* Mobile toggle at 900px max, slide-in menu from right covering 70% screen */

class ResponsiveNavigation {
  constructor() {
    this.navToggle = null;
    this.navMenu = null;
    this.navOverlay = null;
    this.isOpen = false;
    this.breakpoint = 900;
    
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Get navigation elements
    this.navToggle = document.getElementById('nav-toggle');
    this.navMenu = document.getElementById('nav-menu');
    
    if (!this.navToggle || !this.navMenu) {
      console.warn('Navigation elements not found');
      return;
    }

    // Create overlay element
    this.createOverlay();
    
    // Add close button to mobile menu
    this.addCloseButton();
    
    // Bind events
    this.bindEvents();
    
    // Handle initial state
    this.handleResize();
  }

  createOverlay() {
    // Remove existing overlay if it exists
    const existingOverlay = document.querySelector('.nav-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    // Create new overlay
    this.navOverlay = document.createElement('div');
    this.navOverlay.className = 'nav-overlay';
    document.body.appendChild(this.navOverlay);

    // Add click listener to overlay
    this.navOverlay.addEventListener('click', () => this.closeMenu());
  }

  addCloseButton() {
    // Check if close button already exists
    if (this.navMenu.querySelector('.nav-close')) {
      return;
    }

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'nav-close';
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.setAttribute('aria-label', 'Close menu');
    
    // Add to menu
    this.navMenu.appendChild(closeButton);
    
    // Add click listener
    closeButton.addEventListener('click', () => this.closeMenu());
  }

  bindEvents() {
    // Toggle button click
    this.navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleMenu();
    });

    // Close menu when clicking nav links
    const navLinks = this.navMenu.querySelectorAll('a:not(.nav-close)');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isMobile()) {
          this.closeMenu();
        }
      });
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());

    // Close menu when clicking outside (additional safety)
    document.addEventListener('click', (e) => {
      if (this.isOpen && 
          !this.navMenu.contains(e.target) && 
          !this.navToggle.contains(e.target)) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    if (!this.isMobile()) return;

    this.isOpen = true;
    
    // Add active classes
    this.navToggle.classList.add('active');
    this.navMenu.classList.add('active');
    this.navOverlay.classList.add('active');
    
    // Prevent body scroll
    document.body.classList.add('nav-open');
    document.body.style.overflow = 'hidden';
    
    // Update toggle text
    this.updateToggleText('Close');
    
    // Focus management for accessibility
    this.trapFocus();
    
    // Trigger custom event
    this.dispatchEvent('nav:opened');
  }

  closeMenu() {
    if (!this.isOpen) return;

    this.isOpen = false;
    
    // Remove active classes
    this.navToggle.classList.remove('active');
    this.navMenu.classList.remove('active');
    this.navOverlay.classList.remove('active');
    
    // Restore body scroll
    document.body.classList.remove('nav-open');
    document.body.style.overflow = '';
    
    // Update toggle text
    this.updateToggleText('Menu');
    
    // Return focus to toggle button
    this.navToggle.focus();
    
    // Trigger custom event
    this.dispatchEvent('nav:closed');
  }

  updateToggleText(text) {
    const toggleText = this.navToggle.querySelector('.nav-toggle-text');
    if (toggleText) {
      toggleText.textContent = text;
    }
  }

  isMobile() {
    return window.innerWidth <= this.breakpoint;
  }

  handleResize() {
    // Close menu if switching to desktop
    if (!this.isMobile() && this.isOpen) {
      this.closeMenu();
    }
    
    // Update overlay visibility
    if (this.navOverlay) {
      this.navOverlay.style.display = this.isMobile() ? 'block' : 'none';
    }
  }

  trapFocus() {
    if (!this.isOpen || !this.isMobile()) return;

    // Get all focusable elements in the menu
    const focusableElements = this.navMenu.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement.focus();

    // Handle tab navigation
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Add tab listener
    document.addEventListener('keydown', handleTabKey);

    // Remove listener when menu closes
    const removeTabListener = () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('nav:closed', removeTabListener);
    };
    
    document.addEventListener('nav:closed', removeTabListener);
  }

  dispatchEvent(eventName) {
    const event = new CustomEvent(eventName, {
      detail: { navigation: this }
    });
    document.dispatchEvent(event);
  }

  // Public methods
  open() {
    this.openMenu();
  }

  close() {
    this.closeMenu();
  }

  toggle() {
    this.toggleMenu();
  }

  isMenuOpen() {
    return this.isOpen;
  }
}

// Initialize navigation when script loads
let responsiveNav = null;

// Global function for backward compatibility
function toggleMobileNav() {
  if (responsiveNav) {
    responsiveNav.toggle();
  } else {
    console.warn('Responsive navigation not initialized');
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initResponsiveNav);
} else {
  initResponsiveNav();
}

function initResponsiveNav() {
  responsiveNav = new ResponsiveNavigation();
  
  // Make globally available
  window.responsiveNav = responsiveNav;
  window.toggleMobileNav = toggleMobileNav;
}

// Smooth scroll for anchor links
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const href = link.getAttribute('href');
  if (href === '#') return;

  const target = document.querySelector(href);
  if (!target) return;

  e.preventDefault();
  
  // Close mobile menu if open
  if (responsiveNav && responsiveNav.isMenuOpen()) {
    responsiveNav.close();
  }

  // Smooth scroll to target
  const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;
  const targetPosition = target.offsetTop - navHeight;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
});

// Add scroll effect to navbar
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const currentScrollY = window.scrollY;
  
  // Add scrolled class for styling
  if (currentScrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Hide/show navbar on scroll (optional)
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }

  lastScrollY = currentScrollY;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ResponsiveNavigation, toggleMobileNav };
}