/**
 * SyncPoint SaaS - Calendar & Availability Controller
 * Manages Day/Week/Month calendar matrix, conflict checks, and appointment creation modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  const calendarGrid = document.getElementById('calendarMatrix');
  const monthYearLabel = document.getElementById('calendarMonthLabel');
  const prevBtn = document.getElementById('calPrevBtn');
  const nextBtn = document.getElementById('calNextBtn');
  const todayBtn = document.getElementById('calTodayBtn');
  const viewToggles = document.querySelectorAll('.calendar-toggle-btn');
  const newApptModal = document.getElementById('newApptModal');
  const openModalBtn = document.getElementById('openNewApptModal');
  const closeModalBtns = document.querySelectorAll('.close-modal-btn');
  const apptForm = document.getElementById('newAppointmentForm');
  const conflictBanner = document.getElementById('conflictBanner');

  let currentView = 'week';
  let currentDate = new Date(2026, 9, 14); // Mid-October 2026

  function getStoredAppointments() {
    const raw = localStorage.getItem('syncpoint_bookings');
    return raw ? JSON.parse(raw) : [];
  }

  function renderCalendar() {
    if (!calendarGrid) return;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (monthYearLabel) {
      monthYearLabel.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }

    const appts = getStoredAppointments();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    calendarGrid.innerHTML = days.map((dayName, index) => {
      const dayNum = 12 + index; // Sample week
      const dateStr = `2026-10-${dayNum < 10 ? '0' + dayNum : dayNum}`;
      const dayAppts = appts.filter(a => a.date === dateStr);

      return `
        <div class="calendar-day-col">
          <div class="calendar-day-head">
            <span>${dayName}</span>
            <span style="color: ${dayNum === 14 ? 'var(--primary)' : 'var(--text-light)'}; font-weight:800;">${dayNum}</span>
          </div>
          <div class="calendar-day-slots" style="display:flex; flex-direction:column; gap:0.45rem; flex-grow:1;">
            ${dayAppts.length === 0 ? `<div style="font-size:0.75rem; color:var(--text-light); font-style:italic; padding-top:0.5rem;">No Bookings</div>` : ''}
            ${dayAppts.map(apt => `
              <div class="calendar-appt-chip" data-id="${apt.id}">
                <div><strong>${apt.time}</strong></div>
                <div>${apt.customer}</div>
                <div style="font-size:0.7rem; opacity:0.85;">${apt.staff.split(' ')[1] || apt.staff}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');

    // Attach click listeners to chips
    calendarGrid.querySelectorAll('.calendar-appt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const id = chip.getAttribute('data-id');
        const target = appts.find(a => a.id === id);
        if (target) {
          alert(`Appointment #${target.id}\nClient: ${target.customer}\nService: ${target.service}\nStaff: ${target.staff}\nTime: ${target.time} on ${target.date}\nStatus: ${target.status}`);
        }
      });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentDate.setDate(currentDate.getDate() - 7);
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentDate.setDate(currentDate.getDate() + 7);
      renderCalendar();
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      currentDate = new Date(2026, 9, 14);
      renderCalendar();
    });
  }

  viewToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      viewToggles.forEach(t => t.classList.remove('active'));
      toggle.classList.add('active');
      currentView = toggle.getAttribute('data-view') || 'week';
      renderCalendar();
    });
  });

  // Modal interactions
  if (openModalBtn && newApptModal) {
    openModalBtn.addEventListener('click', () => {
      newApptModal.classList.add('show');
    });
  }

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (newApptModal) newApptModal.classList.remove('show');
    });
  });

  if (apptForm) {
    apptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const customer = document.getElementById('modalCustName').value.trim();
      const email = document.getElementById('modalCustEmail').value.trim();
      const service = document.getElementById('modalService').value;
      const staff = document.getElementById('modalStaff').value;
      const date = document.getElementById('modalDate').value;
      const time = document.getElementById('modalTime').value;

      if (!customer || !email || !date || !time) {
        alert('Please fill out all required fields.');
        return;
      }

      const all = getStoredAppointments();

      // Check conflict
      const hasConflict = all.some(a => a.staff === staff && a.date === date && a.time === time && a.status !== 'Cancelled');
      if (hasConflict) {
        if (conflictBanner) {
          conflictBanner.style.display = 'flex';
          conflictBanner.textContent = `Scheduling Conflict: ${staff} already has an appointment booked at ${time} on ${date}.`;
        }
        return;
      }

      const newId = `APT-${1000 + all.length + 1}`;
      all.push({
        id: newId,
        customer,
        email,
        service,
        staff,
        date,
        time,
        status: 'Confirmed',
        price: '$150'
      });

      localStorage.setItem('syncpoint_bookings', JSON.stringify(all));
      if (newApptModal) newApptModal.classList.remove('show');
      apptForm.reset();
      if (conflictBanner) conflictBanner.style.display = 'none';
      renderCalendar();
      alert(`Appointment ${newId} created successfully and added to ${staff}'s calendar!`);
    });
  }

  renderCalendar();
});
