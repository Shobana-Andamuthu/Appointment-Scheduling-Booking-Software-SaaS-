/**
 * SyncPoint SaaS - Booking Management Handler
 * Manages appointments database, search, filtering, sorting, pagination, and status updates.
 */

const INITIAL_BOOKINGS = [
  { id: 'APT-1001', customer: 'Sarah Davis', email: 'sarah.davis@example.com', service: 'Comprehensive Health Intake', staff: 'Dr. Evelyn Vance', date: '2026-10-14', time: '09:30 AM', status: 'Confirmed', price: '$150' },
  { id: 'APT-1002', customer: 'Michael Chen', email: 'm.chen@techcorp.io', service: 'Executive Strategy Advisory', staff: 'Marcus Sterling', date: '2026-10-14', time: '11:00 AM', status: 'Confirmed', price: '$275' },
  { id: 'APT-1003', customer: 'Amanda Miller', email: 'amanda.m@gmail.com', service: 'Luxury Styling & Treatment', staff: 'Chloe Bennett', date: '2026-10-14', time: '01:30 PM', status: 'Pending', price: '$120' },
  { id: 'APT-1004', customer: 'David Rodriguez', email: 'd.rodriguez@realty.com', service: 'Property Portfolio Consultation', staff: 'Elena Rostova', date: '2026-10-15', time: '10:00 AM', status: 'Confirmed', price: '$200' },
  { id: 'APT-1005', customer: 'Jessica Taylor', email: 'jess.taylor@fitness.co', service: 'Performance Athletic Assessment', staff: 'Alex Morgan', date: '2026-10-15', time: '02:00 PM', status: 'Completed', price: '$95' },
  { id: 'APT-1006', customer: 'Robert Wilson', email: 'rwilson@edu.org', service: 'Academic Masterclass Tutoring', staff: 'Prof. David Thorne', date: '2026-10-16', time: '11:30 AM', status: 'Cancelled', price: '$85' },
  { id: 'APT-1007', customer: 'Emily Watson', email: 'emily.w@design.net', service: 'Comprehensive Health Intake', staff: 'Dr. Evelyn Vance', date: '2026-10-16', time: '03:15 PM', status: 'Confirmed', price: '$150' },
  { id: 'APT-1008', customer: 'Jonathan Lee', email: 'jlee@ventures.co', service: 'Executive Strategy Advisory', staff: 'Marcus Sterling', date: '2026-10-17', time: '09:00 AM', status: 'Confirmed', price: '$275' },
  { id: 'APT-1009', customer: 'Victoria Vance', email: 'vvance@global.org', service: 'Luxury Styling & Treatment', staff: 'Chloe Bennett', date: '2026-10-18', time: '10:30 AM', status: 'Pending', price: '$120' },
  { id: 'APT-1010', customer: 'Benjamin Hayes', email: 'bhayes@capital.com', service: 'Property Portfolio Consultation', staff: 'Elena Rostova', date: '2026-10-18', time: '02:00 PM', status: 'Confirmed', price: '$200' },
  { id: 'APT-1011', customer: 'Sophia Morales', email: 'smorales@biotech.io', service: 'Comprehensive Health Intake', staff: 'Dr. Evelyn Vance', date: '2026-10-19', time: '11:00 AM', status: 'Confirmed', price: '$150' },
  { id: 'APT-1012', customer: 'Liam O’Connor', email: 'liam.oc@fitpro.com', service: 'Performance Athletic Assessment', staff: 'Alex Morgan', date: '2026-10-19', time: '04:00 PM', status: 'Confirmed', price: '$95' }
];

function getBookings() {
  const stored = localStorage.getItem('syncpoint_bookings');
  if (!stored) {
    localStorage.setItem('syncpoint_bookings', JSON.stringify(INITIAL_BOOKINGS));
    return INITIAL_BOOKINGS;
  }
  return JSON.parse(stored);
}

function saveBookings(bookings) {
  localStorage.setItem('syncpoint_bookings', JSON.stringify(bookings));
}

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('bookingsTableBody');
  const searchInput = document.getElementById('bookingSearchInput');
  const statusFilter = document.getElementById('bookingStatusFilter');
  const serviceFilter = document.getElementById('bookingServiceFilter');
  const sortFilter = document.getElementById('bookingSortFilter');
  const totalCountEl = document.getElementById('bookingsTotalCount');
  const paginationInfoEl = document.getElementById('paginationInfo');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');

  // Reschedule Modal
  const rescheduleModal = document.getElementById('rescheduleModal');
  const rescheduleForm = document.getElementById('rescheduleForm');
  const reschedApptId = document.getElementById('reschedApptId');
  const reschedDate = document.getElementById('reschedDate');
  const reschedTime = document.getElementById('reschedTime');
  const closeReschedBtns = document.querySelectorAll('.close-resched-modal');

  let currentPage = 1;
  const itemsPerPage = 5;

  function renderTable() {
    if (!tableBody) return;
    const all = getBookings();
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const statusVal = statusFilter ? statusFilter.value : 'all';
    const serviceVal = serviceFilter ? serviceFilter.value : 'all';
    const sortVal = sortFilter ? sortFilter.value : 'date-asc';

    let filtered = all.filter(item => {
      const matchQuery = item.customer.toLowerCase().includes(query) ||
                         item.staff.toLowerCase().includes(query) ||
                         item.id.toLowerCase().includes(query);
      const matchStatus = statusVal === 'all' || item.status.toLowerCase() === statusVal.toLowerCase();
      const matchService = serviceVal === 'all' || item.service === serviceVal;
      return matchQuery && matchStatus && matchService;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sortVal === 'date-asc') return (a.date + a.time).localeCompare(b.date + b.time);
      if (sortVal === 'date-desc') return (b.date + b.time).localeCompare(a.date + a.time);
      if (sortVal === 'name-asc') return a.customer.localeCompare(b.customer);
      if (sortVal === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

    const totalCount = filtered.length;
    if (totalCountEl) totalCountEl.textContent = `${totalCount} Bookings`;

    const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    if (paginationInfoEl) {
      paginationInfoEl.textContent = `Page ${currentPage} of ${totalPages} (${totalCount} total)`;
    }

    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;

    if (paginated.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No appointments found matching your query or filter criteria.</td></tr>`;
      return;
    }

    tableBody.innerHTML = paginated.map(item => `
      <tr>
        <td><strong>${item.id}</strong></td>
        <td>
          <div style="font-weight:700; color:var(--text-main);">${item.customer}</div>
          <div style="font-size:0.78rem; color:var(--text-light);">${item.email}</div>
        </td>
        <td>${item.service}</td>
        <td>${item.staff}</td>
        <td>
          <div>${item.date}</div>
          <div style="font-size:0.8rem; color:var(--text-light);">${item.time}</div>
        </td>
        <td>
          <span class="status-badge ${item.status.toLowerCase()}">${item.status}</span>
        </td>
        <td>
          <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
            <button class="btn btn-sm btn-outline view-apt-btn" data-id="${item.id}" title="View Details">View</button>
            ${item.status !== 'Cancelled' ? `
              <button class="btn btn-sm btn-outline resched-apt-btn" data-id="${item.id}" title="Reschedule">Reschedule</button>
              <button class="btn btn-sm btn-outline cancel-apt-btn" data-id="${item.id}" style="color:var(--danger); border-color:rgba(239,68,68,0.3);" title="Cancel">Cancel</button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');

    // Attach row action listeners
    tableBody.querySelectorAll('.cancel-apt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm(`Are you sure you want to cancel appointment ${id}? Automated notification will be sent to the client.`)) {
          const list = getBookings();
          const target = list.find(b => b.id === id);
          if (target) {
            target.status = 'Cancelled';
            saveBookings(list);
            renderTable();
          }
        }
      });
    });

    tableBody.querySelectorAll('.view-apt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const list = getBookings();
        const target = list.find(b => b.id === id);
        if (target) {
          alert(`Appointment #${target.id}\nClient: ${target.customer} (${target.email})\nService: ${target.service}\nStaff: ${target.staff}\nTime: ${target.date} at ${target.time}\nStatus: ${target.status}\nFee: ${target.price}`);
        }
      });
    });

    tableBody.querySelectorAll('.resched-apt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const list = getBookings();
        const target = list.find(b => b.id === id);
        if (target && rescheduleModal) {
          if (reschedApptId) reschedApptId.value = target.id;
          if (reschedDate) reschedDate.value = target.date;
          if (reschedTime) reschedTime.value = target.time;
          rescheduleModal.classList.add('show');
        }
      });
    });
  }

  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      currentPage++;
      renderTable();
    });
  }

  if (rescheduleForm) {
    rescheduleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = reschedApptId.value;
      const newD = reschedDate.value;
      const newT = reschedTime.value;

      const list = getBookings();
      const target = list.find(b => b.id === id);
      if (target) {
        target.date = newD;
        target.time = newT;
        target.status = 'Confirmed';
        saveBookings(list);
        if (rescheduleModal) rescheduleModal.classList.remove('show');
        renderTable();
        alert(`Appointment ${id} successfully rescheduled to ${newD} at ${newT}! Automated email update dispatched to client.`);
      }
    });
  }

  closeReschedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (rescheduleModal) rescheduleModal.classList.remove('show');
    });
  });

  if (searchInput) searchInput.addEventListener('input', () => { currentPage = 1; renderTable(); });
  if (statusFilter) statusFilter.addEventListener('change', () => { currentPage = 1; renderTable(); });
  if (serviceFilter) serviceFilter.addEventListener('change', () => { currentPage = 1; renderTable(); });
  if (sortFilter) sortFilter.addEventListener('change', () => { renderTable(); });

  renderTable();
});
