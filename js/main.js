/**
 * SyncPoint SaaS - Global Master JavaScript
 * Handles Theme (Light/Dark), Text Direction (LTR/RTL),
 * Public Navigation & Dropdowns, Mobile Drawer, Back to Top, and FAQ Accordions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ===================================================================
  // 1. Theme Management (Light / Dark)
  // ===================================================================
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn, .theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('syncpoint_theme');

  function applyTheme(theme) {
    document.documentElement.classList.add('disable-transitions');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('syncpoint_theme', theme);

    themeToggleBtns.forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun, .i-sun');
      const moonIcon = btn.querySelector('.icon-moon, .i-moon');
      if (theme === 'dark') {
        if (sunIcon) sunIcon.style.display = 'block';
        if (moonIcon) moonIcon.style.display = 'none';
        btn.setAttribute('aria-label', 'Switch to light mode');
        btn.setAttribute('title', 'Switch to light mode');
      } else {
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'block';
        btn.setAttribute('aria-label', 'Switch to dark mode');
        btn.setAttribute('title', 'Switch to dark mode');
      }
    });

    void document.documentElement.offsetHeight;
    setTimeout(() => {
      document.documentElement.classList.remove('disable-transitions');
    }, 60);
  }

  const initialTheme = savedTheme ? savedTheme : (prefersDark.matches ? 'dark' : 'light');
  applyTheme(initialTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });

  // ===================================================================
  // 2. Direction Management (LTR / RTL)
  // ===================================================================
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn, .rtl-toggle');
  const savedDir = localStorage.getItem('syncpoint_dir') || 'ltr';

  function applyDirection(dir) {
    document.documentElement.classList.add('disable-transitions');
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    localStorage.setItem('syncpoint_dir', dir);

    rtlToggleBtns.forEach(btn => {
      const label = btn.querySelector('.rtl-label, .t-txt');
      if (label) {
        label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left to Right layout' : 'Switch to Right to Left layout');
    });

    void document.documentElement.offsetHeight;
    setTimeout(() => {
      document.documentElement.classList.remove('disable-transitions');
    }, 60);
  }

  applyDirection(savedDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      applyDirection(current === 'rtl' ? 'ltr' : 'rtl');
    });
  });

  // ===================================================================
  // 3. Home Navigation Dropdown Menu
  // ===================================================================
  const homeDropdown = document.getElementById('homeDropdown');
  const homeDropdownBtn = document.getElementById('homeDropdownBtn');

  if (homeDropdown && homeDropdownBtn) {
    homeDropdownBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = homeDropdown.classList.contains('open');
      if (isOpen) {
        homeDropdown.classList.remove('open');
        homeDropdownBtn.setAttribute('aria-expanded', 'false');
      } else {
        homeDropdown.classList.add('open');
        homeDropdownBtn.setAttribute('aria-expanded', 'true');
      }
    });

    document.addEventListener('click', (e) => {
      if (!homeDropdown.contains(e.target)) {
        homeDropdown.classList.remove('open');
        homeDropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        homeDropdown.classList.remove('open');
        homeDropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===================================================================
  // 4. Mobile Drawer & Overlay
  // ===================================================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileHomeToggleBtn = document.getElementById('mobileHomeToggleBtn');
  const mobileHomeDropdown = document.getElementById('mobileHomeDropdown');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerOverlay) drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
    // Automatically close mobile Home dropdown when drawer is closed
    if (mobileHomeDropdown) {
      mobileHomeDropdown.classList.remove('open');
      if (mobileHomeToggleBtn) mobileHomeToggleBtn.setAttribute('aria-expanded', 'false');
    }
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  if (mobileHomeToggleBtn && mobileHomeDropdown) {
    mobileHomeToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = mobileHomeDropdown.classList.contains('open');
      if (isOpen) {
        mobileHomeDropdown.classList.remove('open');
        mobileHomeToggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileHomeDropdown.classList.add('open');
        mobileHomeToggleBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  document.querySelectorAll('.mobile-nav-link:not(.mobile-dropdown-toggle), .mobile-dropdown-item').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ===================================================================
  // 5. Sticky Header & Back to Top Controller
  // ===================================================================
  const siteHeader = document.getElementById('siteHeader');
  const backToTopBtn = document.getElementById('backToTopBtn');

  function handleWindowScroll() {
    const scrollPos = window.scrollY || window.pageYOffset;
    if (siteHeader) {
      if (scrollPos > 10) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
    if (backToTopBtn) {
      if (scrollPos > 350) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  }

  window.addEventListener('scroll', handleWindowScroll, { passive: true });
  handleWindowScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===================================================================
  // 6. FAQ Accordion Interaction
  // ===================================================================
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.faq-item');
      if (parent) {
        const isOpen = parent.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('open'));
        if (!isOpen) {
          parent.classList.add('open');
        }
      }
    });
  });

  // ===================================================================
  // 7. Interactive Demo Scheduler Widget & Preview Modal (Home 1)
  // ===================================================================
  const serviceOptions = document.querySelectorAll('.service-option-btn');
  const slotPills = document.querySelectorAll('.slot-pill');
  const demoConfirmText = document.getElementById('demoConfirmText');

  let selectedService = "30-Min Discovery Consultation";
  let selectedTime = "09:30 AM Tomorrow";

  function updateConfirmation() {
    if (demoConfirmText) {
      demoConfirmText.innerHTML = `<strong>Appointment Confirmed:</strong> ${selectedService} at <strong>${selectedTime}</strong>. Calendar invite & SMS reminder scheduled!`;
    }
  }

  function styleServiceOptions() {
    serviceOptions.forEach(opt => {
      if (opt.classList.contains('active')) {
        opt.style.background = 'var(--primary-light)';
        opt.style.borderColor = 'var(--primary)';
        opt.style.color = 'var(--primary)';
      } else {
        opt.style.background = 'var(--bg-subtle)';
        opt.style.borderColor = 'var(--border-card)';
        opt.style.color = 'var(--text-main)';
      }
    });
  }

  function styleSlotPills() {
    slotPills.forEach(pill => {
      if (pill.classList.contains('active')) {
        pill.style.background = 'var(--primary)';
        pill.style.borderColor = 'var(--primary)';
        pill.style.color = '#ffffff';
      } else {
        pill.style.background = 'var(--bg-card)';
        pill.style.borderColor = 'var(--border-card)';
        pill.style.color = 'var(--text-main)';
      }
    });
  }

  serviceOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      serviceOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      styleServiceOptions();
      const serviceName = opt.querySelector('strong');
      if (serviceName) selectedService = serviceName.textContent.trim();
      updateConfirmation();
    });
  });

  slotPills.forEach(pill => {
    pill.addEventListener('click', () => {
      slotPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      styleSlotPills();
      selectedTime = pill.textContent.trim();
      updateConfirmation();
    });
  });

  // ===================================================================
  // 7b. Interactive Industry Booking Preview Modal & Triggers
  // ===================================================================
  const INDUSTRY_PRESETS = {
    healthcare: {
      title: "Healthcare & Clinics Booking Preview",
      practitioner: "Dr. Evelyn Vance",
      role: "Lead Clinical Specialist",
      avatar: "EV",
      services: [
        { name: "Comprehensive Health Intake", desc: "In-Clinic / 45 Min", price: "$120" },
        { name: "Telehealth Video Follow-up", desc: "HD Video Link / 30 Min", price: "$65" },
        { name: "Preventative Screening Review", desc: "Full Diagnostics / 60 Min", price: "$180" }
      ],
      slots: ["09:30 AM Tomorrow", "11:00 AM Tomorrow", "02:15 PM Tomorrow", "04:30 PM Tomorrow", "10:00 AM Thursday", "03:00 PM Thursday"]
    },
    salon: {
      title: "Salons & Wellness Booking Preview",
      practitioner: "Chloe Bennett",
      role: "Master Colorist & Stylist",
      avatar: "CB",
      services: [
        { name: "Luxury Styling & Treatment", desc: "Shampoo & Cut / 60 Min", price: "$85" },
        { name: "Balayage Color & Gloss", desc: "Custom Toning / 120 Min", price: "$195" },
        { name: "Express Blowout & Scalp Care", desc: "Organic Botanicals / 45 Min", price: "$55" }
      ],
      slots: ["10:00 AM Tomorrow", "12:30 PM Tomorrow", "02:00 PM Tomorrow", "05:15 PM Tomorrow", "11:30 AM Friday", "04:00 PM Friday"]
    },
    consulting: {
      title: "Executive Consulting Booking Preview",
      practitioner: "Marcus Sterling",
      role: "Senior Partner & Strategy Lead",
      avatar: "MS",
      services: [
        { name: "60-Min In-Depth Strategy Session", desc: "Executive Roadmap / 60 Min", price: "$250" },
        { name: "Corporate Retainer Review", desc: "Quarterly Audit / 90 Min", price: "$400" },
        { name: "15-Min Quick Intake Discovery", desc: "Intro Call / 15 Min", price: "Complimentary" }
      ],
      slots: ["08:30 AM Tomorrow", "11:00 AM Tomorrow", "01:30 PM Tomorrow", "03:45 PM Tomorrow", "09:00 AM Thursday", "02:30 PM Thursday"]
    },
    education: {
      title: "Education & Tutors Booking Preview",
      practitioner: "Prof. David Thorne",
      role: "Academic Advisor & Senior Tutor",
      avatar: "DT",
      services: [
        { name: "1-on-1 STEM Examination Prep", desc: "Custom Curriculum / 60 Min", price: "$90" },
        { name: "Semester Progress Review", desc: "Parent & Student / 45 Min", price: "$70" },
        { name: "Diagnostic Aptitude Assessment", desc: "Skills Evaluation / 90 Min", price: "$120" }
      ],
      slots: ["03:30 PM Tomorrow", "04:45 PM Tomorrow", "06:00 PM Tomorrow", "10:00 AM Saturday", "11:30 AM Saturday", "02:00 PM Saturday"]
    },
    fitness: {
      title: "Fitness & Studios Booking Preview",
      practitioner: "Elena Rostova",
      role: "Head Performance Coach",
      avatar: "ER",
      services: [
        { name: "Performance Athletic Assessment", desc: "Body Composition / 60 Min", price: "$95" },
        { name: "Boutique Semi-Private Training", desc: "Max 4 Athletes / 50 Min", price: "$45" },
        { name: "Nutrition & Recovery Consultation", desc: "Dietary Protocol / 40 Min", price: "$60" }
      ],
      slots: ["07:00 AM Tomorrow", "08:30 AM Tomorrow", "12:00 PM Tomorrow", "05:30 PM Tomorrow", "07:00 AM Friday", "06:00 PM Friday"]
    },
    realestate: {
      title: "Real Estate & Tours Booking Preview",
      practitioner: "Julian Hayes",
      role: "Principal Real Estate Consultant",
      avatar: "JH",
      services: [
        { name: "Private Property Walkthrough", desc: "On-Site Tour / 45 Min", price: "Free" },
        { name: "Investment Portfolio Consultation", desc: "Market Analysis / 60 Min", price: "$150" },
        { name: "Virtual 3D Video Tour", desc: "Live Guided / 30 Min", price: "Free" }
      ],
      slots: ["10:30 AM Tomorrow", "01:00 PM Tomorrow", "03:30 PM Tomorrow", "05:00 PM Tomorrow", "11:00 AM Saturday", "03:00 PM Saturday"]
    }
  };

  const previewModalEl = document.getElementById('bookingPreviewModal');
  const bpmAvatar = document.getElementById('bpmAvatar');
  const bpmTitle = document.getElementById('bookingPreviewModalLabel');
  const bpmMeta = document.getElementById('bpmPractitionerMeta');
  const bpmServicesList = document.getElementById('bpmServicesList');
  const bpmSlotsList = document.getElementById('bpmSlotsList');
  const bpmFormState = document.getElementById('bpmFormState');
  const bpmSuccessState = document.getElementById('bpmSuccessState');
  const bpmConfirmBtn = document.getElementById('bpmConfirmBtn');
  const bpmResetBtn = document.getElementById('bpmResetBtn');
  const bpmSuccessService = document.getElementById('bpmSuccessService');
  const bpmSuccessTime = document.getElementById('bpmSuccessTime');
  const bpmSuccessClient = document.getElementById('bpmSuccessClient');
  const bpmSuccessMsg = document.getElementById('bpmSuccessMsg');

  let modalSelectedService = "";
  let modalSelectedSlot = "";

  function populateBookingModal(industryKey) {
    const data = INDUSTRY_PRESETS[industryKey] || INDUSTRY_PRESETS.healthcare;
    if (bpmTitle) bpmTitle.textContent = data.title;
    if (bpmAvatar) bpmAvatar.textContent = data.avatar;
    if (bpmMeta) bpmMeta.textContent = `${data.practitioner} · ${data.role}`;

    // Reset view to form
    if (bpmFormState) bpmFormState.style.display = 'block';
    if (bpmSuccessState) bpmSuccessState.style.display = 'none';

    // Populate Services
    if (bpmServicesList) {
      bpmServicesList.innerHTML = '';
      data.services.forEach((s, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `p-3 rounded-3 text-start w-100 bpm-service-item ${idx === 0 ? 'active' : ''}`;
        btn.style.cssText = idx === 0 
          ? 'background:var(--primary-light); border:1.5px solid var(--primary); color:var(--primary); transition:all 0.2s;'
          : 'background:var(--bg-subtle); border:1px solid var(--border-card); color:var(--text-main); transition:all 0.2s;';
        btn.innerHTML = `<div class="d-flex justify-content-between align-items-center"><strong>${s.name}</strong><span class="badge bg-primary-subtle text-primary fw-bold">${s.price}</span></div><div class="small text-muted mt-1">${s.desc}</div>`;

        btn.addEventListener('click', () => {
          bpmServicesList.querySelectorAll('.bpm-service-item').forEach(b => {
            b.classList.remove('active');
            b.style.background = 'var(--bg-subtle)';
            b.style.borderColor = 'var(--border-card)';
            b.style.color = 'var(--text-main)';
          });
          btn.classList.add('active');
          btn.style.background = 'var(--primary-light)';
          btn.style.borderColor = 'var(--primary)';
          btn.style.color = 'var(--primary)';
          modalSelectedService = s.name;
        });

        bpmServicesList.appendChild(btn);
        if (idx === 0) modalSelectedService = s.name;
      });
    }

    // Populate Slots
    if (bpmSlotsList) {
      bpmSlotsList.innerHTML = '';
      data.slots.forEach((slot, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `p-2 rounded-2 text-center bpm-slot-item ${idx === 0 ? 'active' : ''}`;
        btn.style.cssText = idx === 0
          ? 'background:var(--primary); color:#fff; border:1px solid var(--primary); font-weight:600; font-size:0.85rem; transition:all 0.2s;'
          : 'background:var(--bg-card); border:1px solid var(--border-card); font-weight:600; font-size:0.85rem; color:var(--text-main); transition:all 0.2s;';
        btn.textContent = slot;

        btn.addEventListener('click', () => {
          bpmSlotsList.querySelectorAll('.bpm-slot-item').forEach(b => {
            b.classList.remove('active');
            b.style.background = 'var(--bg-card)';
            b.style.borderColor = 'var(--border-card)';
            b.style.color = 'var(--text-main)';
          });
          btn.classList.add('active');
          btn.style.background = 'var(--primary)';
          btn.style.borderColor = 'var(--primary)';
          btn.style.color = '#ffffff';
          modalSelectedSlot = slot;
        });

        bpmSlotsList.appendChild(btn);
        if (idx === 0) modalSelectedSlot = slot;
      });
    }
  }

  // Handle Confirm Booking click in Modal
  if (bpmConfirmBtn) {
    bpmConfirmBtn.addEventListener('click', () => {
      const clientName = document.getElementById('bpmClientName')?.value || 'Client';
      if (bpmSuccessService) bpmSuccessService.textContent = modalSelectedService || 'Discovery Session';
      if (bpmSuccessTime) bpmSuccessTime.textContent = modalSelectedSlot || 'Tomorrow 09:30 AM';
      if (bpmSuccessClient) bpmSuccessClient.textContent = clientName;
      if (bpmSuccessMsg) bpmSuccessMsg.textContent = `Your appointment has been locked in with instant SMS reminder & Google Calendar sync.`;

      if (bpmFormState) bpmFormState.style.display = 'none';
      if (bpmSuccessState) bpmSuccessState.style.display = 'block';
    });
  }

  if (bpmResetBtn) {
    bpmResetBtn.addEventListener('click', () => {
      if (bpmFormState) bpmFormState.style.display = 'block';
      if (bpmSuccessState) bpmSuccessState.style.display = 'none';
    });
  }

  // Bind click on all Industry Cards (.ind2-card)
  const industryCards = document.querySelectorAll('.ind2-card');
  industryCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const industryKey = card.getAttribute('data-industry') || 'healthcare';

      // 1. If modal is available, open the modal with dynamic data
      if (previewModalEl && window.bootstrap?.Modal) {
        populateBookingModal(industryKey);
        const modal = bootstrap.Modal.getOrCreateInstance(previewModalEl);
        modal.show();
      }

      // 2. Also scroll smoothly to on-page #booking-preview widget
      const previewSection = document.getElementById('booking-preview');
      if (previewSection) {
        previewSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        previewSection.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
        previewSection.style.borderColor = 'var(--primary)';
        previewSection.style.boxShadow = '0 0 0 4px var(--primary-light), 0 20px 25px -5px rgba(0,0,0,0.1)';
        setTimeout(() => {
          previewSection.style.borderColor = 'var(--border-card)';
          previewSection.style.boxShadow = '';
        }, 1800);
      }
    });
  });

  // ===================================================================
  // 8. Hero Provider Appointment Board Day Filtering (crew-stage)
  // ===================================================================
  const heroDaysFilter = document.getElementById('heroDaysFilter');
  const heroCrewBoard = document.getElementById('heroCrewBoard');
  const dayTabs = heroDaysFilter ? heroDaysFilter.querySelectorAll('.day-tab') : [];

  const heroScheduleData = {
    mon: {
      card1: { name: "Dr. Evelyn Vance", meta: "09:00 AM · Health Intake", chip: "Confirmed", chipBg: "var(--success)" },
      card2: { name: "Marcus Sterling", meta: "01:30 PM · Strategy Advisory", chip: "Live Sync", chipBg: "#0284c7" },
      card3: { name: "Chloe Bennett", meta: "04:00 PM · VIP Balayage", chip: "Deposit Paid", chipBg: "#10b981" },
      bookings: "1,290", attendance: "97.1%", conflicts: "0"
    },
    tue: {
      card1: { name: "Dr. Evelyn Vance", meta: "10:30 AM · Telehealth Intake", chip: "Confirmed", chipBg: "var(--success)" },
      card2: { name: "Marcus Sterling", meta: "02:00 PM · Client Assessment", chip: "Live Sync", chipBg: "#0284c7" },
      card3: { name: "Chloe Bennett", meta: "03:30 PM · Bridal Consultation", chip: "Deposit Paid", chipBg: "#10b981" },
      bookings: "1,354", attendance: "98.2%", conflicts: "0"
    },
    wed: {
      card1: { name: "Dr. Evelyn Vance", meta: "09:30 AM · Health Intake", chip: "Confirmed", chipBg: "var(--success)" },
      card2: { name: "Marcus Sterling", meta: "11:00 AM · Strategy Session", chip: "Live Sync", chipBg: "#0284c7" },
      card3: { name: "Chloe Bennett", meta: "02:00 PM · Luxury Styling", chip: "Deposit Paid", chipBg: "#10b981" },
      bookings: "1,452", attendance: "96.2%", conflicts: "0"
    },
    thu: {
      card1: { name: "Dr. Evelyn Vance", meta: "08:30 AM · Wellness Checkup", chip: "Confirmed", chipBg: "var(--success)" },
      card2: { name: "Marcus Sterling", meta: "03:00 PM · Executive Briefing", chip: "Live Sync", chipBg: "#0284c7" },
      card3: { name: "Chloe Bennett", meta: "01:00 PM · Hair Spa & Color", chip: "Deposit Paid", chipBg: "#10b981" },
      bookings: "1,498", attendance: "97.5%", conflicts: "0"
    },
    fri: {
      card1: { name: "Dr. Evelyn Vance", meta: "11:00 AM · Pediatric Consult", chip: "Confirmed", chipBg: "var(--success)" },
      card2: { name: "Marcus Sterling", meta: "04:00 PM · Q4 Partner Review", chip: "Live Sync", chipBg: "#0284c7" },
      card3: { name: "Chloe Bennett", meta: "05:00 PM · Event Styling", chip: "Deposit Paid", chipBg: "#10b981" },
      bookings: "1,560", attendance: "98.5%", conflicts: "0"
    },
    sat: {
      card1: { name: "Dr. Evelyn Vance", meta: "10:00 AM · Weekend Clinic", chip: "Confirmed", chipBg: "var(--success)" },
      card2: { name: "Marcus Sterling", meta: "Buffer Guard Active", chip: "Protected", chipBg: "#64748b" },
      card3: { name: "Chloe Bennett", meta: "09:30 AM · Weekend Glam", chip: "Deposit Paid", chipBg: "#10b981" },
      bookings: "1,610", attendance: "99.0%", conflicts: "0"
    },
    sun: {
      card1: { name: "Dr. Evelyn Vance", meta: "Off-Duty · Auto Guard", chip: "Protected", chipBg: "#64748b" },
      card2: { name: "Marcus Sterling", meta: "Off-Duty · Auto Guard", chip: "Protected", chipBg: "#64748b" },
      card3: { name: "Chloe Bennett", meta: "12:00 PM · Express Makeover", chip: "Deposit Paid", chipBg: "#10b981" },
      bookings: "1,640", attendance: "99.2%", conflicts: "0"
    }
  };

  if (dayTabs.length > 0 && heroCrewBoard) {
    dayTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const dayKey = tab.getAttribute('data-day');
        if (!dayKey || !heroScheduleData[dayKey]) return;

        // Switch active tab
        dayTabs.forEach(t => {
          t.classList.remove('on');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('on');
        tab.setAttribute('aria-selected', 'true');

        // Smooth transition effect
        heroCrewBoard.classList.add('switching');

        setTimeout(() => {
          const data = heroScheduleData[dayKey];

          // Update Card 1
          const name1 = document.getElementById('crewName1');
          const meta1 = document.getElementById('crewMeta1');
          const chip1 = document.getElementById('crewChip1');
          if (name1) name1.textContent = data.card1.name;
          if (meta1) meta1.textContent = data.card1.meta;
          if (chip1) {
            chip1.textContent = data.card1.chip;
            chip1.style.background = data.card1.chipBg;
          }

          // Update Card 2
          const name2 = document.getElementById('crewName2');
          const meta2 = document.getElementById('crewMeta2');
          const chip2 = document.getElementById('crewChip2');
          if (name2) name2.textContent = data.card2.name;
          if (meta2) meta2.textContent = data.card2.meta;
          if (chip2) {
            chip2.textContent = data.card2.chip;
            chip2.style.background = data.card2.chipBg;
          }

          // Update Card 3
          const name3 = document.getElementById('crewName3');
          const meta3 = document.getElementById('crewMeta3');
          const chip3 = document.getElementById('crewChip3');
          if (name3) name3.textContent = data.card3.name;
          if (meta3) meta3.textContent = data.card3.meta;
          if (chip3) {
            chip3.textContent = data.card3.chip;
            chip3.style.background = data.card3.chipBg;
          }

          // Update Metrics
          const bCount = document.getElementById('statBookings');
          const aRate = document.getElementById('statAttendance');
          const cCount = document.getElementById('statConflicts');
          if (bCount) bCount.textContent = data.bookings;
          if (aRate) aRate.textContent = data.attendance;
          if (cCount) cCount.textContent = data.conflicts;

          heroCrewBoard.classList.remove('switching');
        }, 160);
      });
    });
  }

  // Card click interaction: Quick hover/touch feedback
  document.querySelectorAll('.crew-col').forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.97)';
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
    });
  });
});

// ===================================================================
// Global Page Preloader Controller
// ===================================================================
(function() {
  function dismissPagePreloader() {
    const preloader = document.getElementById('pagePreloader');
    if (!preloader) return;
    if (!preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
  }

  if (document.readyState === 'complete') {
    setTimeout(dismissPagePreloader, 350);
  } else {
    window.addEventListener('load', () => {
      setTimeout(dismissPagePreloader, 350);
    });
    // Safety fallback: dismiss after max 1500ms
    setTimeout(dismissPagePreloader, 1500);
  }
})();

