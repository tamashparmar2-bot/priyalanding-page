document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. CUSTOM CURSOR (LERPED SMOOTH MOTION)
     ========================================================================== */
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  
  let mouseX = 0, mouseY = 0; // Actual mouse position
  let cursorX = 0, cursorY = 0; // Lerped cursor circle position
  
  // Update mouse position coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot moves instantly
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });
  
  // Smooth animation loop for the outer cursor ring (linear interpolation / lerp)
  function animateCursor() {
    // 0.15 is the easing factor (smaller = smoother/slower cursor ring tracking)
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  // Hover states for interactive elements
  const hoverElements = document.querySelectorAll('a, button, .gallery-item, input, select, textarea, .nav-toggle');
  
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      cursorDot.classList.add('hovered');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      cursorDot.classList.remove('hovered');
    });
  });

  /* ==========================================================================
     2. NAVIGATION MENU TOGGLE
     ========================================================================== */
  const navToggle = document.getElementById('nav-toggle');
  const luxuryNav = document.getElementById('luxury-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  
  navToggle.addEventListener('click', () => {
    const isActive = navToggle.classList.toggle('active');
    luxuryNav.classList.toggle('active');
    
    if (isActive) {
      document.body.style.overflow = 'hidden'; // Lock scrolling when menu open
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      luxuryNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* ==========================================================================
     3. INTERSECTION OBSERVER FOR SCROLL REVEALS
     ========================================================================== */
  const revealItems = document.querySelectorAll('.reveal-item');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters view
  });
  
  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

  /* ==========================================================================
     4. GALLERY HOVER-PLAYBACK FOR VIDEOS
     ========================================================================== */
  const videoGalleryItems = document.querySelectorAll('.gallery-item.video');
  
  videoGalleryItems.forEach(item => {
    const video = item.querySelector('video');
    
    item.addEventListener('mouseenter', () => {
      if (video) {
        video.play().catch(err => {
          console.log("Autoplay blocked or interrupted:", err);
        });
      }
    });
    
    item.addEventListener('mouseleave', () => {
      if (video) {
        video.pause();
        video.currentTime = 0; // Reset video to start frame
      }
    });
  });

  /* ==========================================================================
     5. LIGHTBOX GALLERY
     ========================================================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightbox-content');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const item = galleryItems[currentIndex];
    const mediaType = item.getAttribute('data-media-type');
    const src = item.getAttribute('data-src');
    
    // Clear content
    lightboxContent.innerHTML = '';
    
    if (mediaType === 'image') {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Priya Solanki Portfolio';
      lightboxContent.appendChild(img);
    } else if (mediaType === 'video') {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.loop = true;
      lightboxContent.appendChild(video);
    }
    
    lightboxCaption.style.display = 'none'; // Hide caption as there are no titles
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Disable background scrolling
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxContent.innerHTML = ''; // Stop video playback by wiping content
    document.body.style.overflow = '';
  }

  function showNext() {
    let nextIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(nextIndex);
  }

  function showPrev() {
    let prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(prevIndex);
  }

  // Bind click handlers to gallery items
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  // Lightbox control buttons
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', showNext);
  lightboxPrev.addEventListener('click', showPrev);

  // Close when clicking background backdrop (not the media/buttons)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxContent) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNext();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    }
  });

  /* ==========================================================================
     6. BOOKING FORM SIMULATION
     ========================================================================== */
  const contactForm = document.getElementById('portfolio-contact-form');
  const formSuccess = document.getElementById('form-success');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulate premium fade-out and fade-in success state
      contactForm.style.transition = 'opacity 0.4s ease';
      contactForm.style.opacity = '0';
      
      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.style.display = 'flex';
        
        // Reset form
        contactForm.reset();
        
        // Float labels back down
        const inputs = contactForm.querySelectorAll('.form-input');
        inputs.forEach(input => {
          input.blur();
        });
      }, 400);
    });
  }
});
