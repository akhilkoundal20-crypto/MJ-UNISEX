/* ==========================================================================
   MJ UNISEX SALON - INTERACTIVE JAVASCRIPT
   Clean, light-weight functionality:
   - Sticky header & scroll effects
   - Mobile navigation drawer
   - Service direct-booking auto-fill
   - Filterable portfolio gallery
   - Lightbox modal preview
   - Appointment form validation & WhatsApp dispatch
   - Back to top trigger
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('mainHeader');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTopBtn');

  // Form Elements
  const appointmentForm = document.getElementById('appointmentForm');
  const serviceSelect = document.getElementById('serviceType');
  const preferredDateInput = document.getElementById('preferredDate');
  const formStatus = document.getElementById('formStatus');
  const bookServiceBtns = document.querySelectorAll('.book-service-btn');
  const bridalBookBtn = document.getElementById('bridalBookBtn');

  // Gallery & Lightbox Elements
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxTag = document.getElementById('lightboxTag');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  // Set min date for appointment to today
  if (preferredDateInput) {
    const today = new Date().toISOString().split('T')[0];
    preferredDateInput.min = today;
  }

  // 1. Sticky Header & Back to Top Scroll Behavior
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header shadow
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // Scroll Spy for navigation
    let currentId = '';
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
      });
    }
  });

  // Back to Top Click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. Mobile Drawer Navigation
  function openMobileMenu() {
    mobileDrawer.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  const mobileBookBtn = document.getElementById('mobileBookBtn');
  if (mobileBookBtn) mobileBookBtn.addEventListener('click', closeMobileMenu);

  // 3. Quick Service Booking Auto-Fill
  bookServiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-service');
      if (serviceSelect && serviceName) {
        serviceSelect.value = serviceName;
      }
    });
  });

  if (bridalBookBtn) {
    bridalBookBtn.addEventListener('click', () => {
      if (serviceSelect) {
        serviceSelect.value = 'Bridal Makeup';
      }
    });
  }

  // 4. Gallery Category Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCat === filterValue) {
          item.style.display = 'block';
          item.style.animation = 'modalPop 0.3s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 5. Gallery Lightbox Preview
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.getAttribute('data-img');
      const title = item.getAttribute('data-title');
      const tag = item.getAttribute('data-tag');

      lightboxImg.src = imgSrc;
      lightboxImg.alt = title;
      lightboxTitle.textContent = title;
      lightboxTag.textContent = tag;

      lightboxModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightboxModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxModal.classList.contains('open')) closeLightbox();
      if (mobileDrawer.classList.contains('open')) closeMobileMenu();
    }
  });

  // 6. Appointment Form Submission & WhatsApp Sync
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const service = document.getElementById('serviceType').value;
      const date = document.getElementById('preferredDate').value;
      const time = document.getElementById('preferredTime').value;
      const notes = document.getElementById('clientMessage').value.trim();

      if (!name || !phone || !service || !date) {
        showStatus('Please fill in all required fields.', 'error');
        return;
      }

      // Format appointment text for WhatsApp
      let whatsappMessage = `*New Appointment Request - MJ Unisex Salon*%0A%0A`;
      whatsappMessage += `*Client Name:* ${encodeURIComponent(name)}%0A`;
      whatsappMessage += `*Phone:* ${encodeURIComponent(phone)}%0A`;
      whatsappMessage += `*Service:* ${encodeURIComponent(service)}%0A`;
      whatsappMessage += `*Preferred Date:* ${encodeURIComponent(date)}%0A`;
      whatsappMessage += `*Time Slot:* ${encodeURIComponent(time)}%0A`;
      if (notes) {
        whatsappMessage += `*Special Notes:* ${encodeURIComponent(notes)}%0A`;
      }

      const salonWhatsAppNumber = '919876543210';
      const whatsappUrl = `https://wa.me/${salonWhatsAppNumber}?text=${whatsappMessage}`;

      // Show success in UI
      showStatus(`Thank you, ${name}! Your appointment request for ${service} on ${date} has been recorded. Our team will contact you shortly. <br><br><a href="${whatsappUrl}" target="_blank" class="btn btn-primary btn-sm" style="margin-top:8px;">Send via WhatsApp to Confirm Instantly</a>`, 'success');

      // Reset form fields
      appointmentForm.reset();
    });
  }

  function showStatus(message, type) {
    if (!formStatus) return;
    formStatus.innerHTML = message;
    formStatus.className = `form-status ${type}`;
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});
