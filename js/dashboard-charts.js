/**
 * SyncPoint SaaS - Dashboard Real Analytics Chart Engine
 * Live interactive Chart.js implementation for appointment volume & telemetry across Dashboard & Analytics portal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Theme color resolver for Chart.js styling
  function getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      isDark,
      textColor: isDark ? '#94a3b8' : '#64748b',
      gridColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
      tooltipBg: isDark ? '#1e293b' : '#0f172a',
      tooltipText: '#ffffff'
    };
  }

  const activeCharts = [];

  // ==========================================
  // 1. Overview Page Chart: Appointment Volume & Attendance Trends
  // ==========================================
  const overviewCanvas = document.getElementById('appointmentTrendsChart');
  if (overviewCanvas) {
    const kpiBookings = document.getElementById('kpiBookingsVal');
    const kpiAttendance = document.getElementById('kpiAttendanceVal');
    const kpiRevenue = document.getElementById('kpiRevenueVal');
    const timeframeBtns = document.querySelectorAll('#chartTimeframeGroup .timeframe-btn');

    const OVERVIEW_CONFIG = {
      '7d': {
        labels: ['Mon (Oct 6)', 'Tue (Oct 7)', 'Wed (Oct 8)', 'Thu (Oct 9)', 'Fri (Oct 10)', 'Sat (Oct 11)', 'Sun (Oct 12)'],
        bookings: [48, 62, 70, 56, 84, 96, 68],
        attendance: [44, 58, 65, 52, 79, 90, 63],
        total: '484',
        attendanceRate: '93.1%',
        revenue: '$21,850'
      },
      '14d': {
        labels: ['Sep 29', 'Sep 30', 'Oct 1', 'Oct 2', 'Oct 3', 'Oct 4', 'Oct 5', 'Oct 6', 'Oct 7', 'Oct 8', 'Oct 9', 'Oct 10', 'Oct 11', 'Oct 12'],
        bookings: [40, 46, 52, 60, 68, 75, 50, 48, 62, 70, 56, 84, 96, 68],
        attendance: [36, 42, 47, 55, 62, 69, 45, 44, 58, 65, 52, 79, 90, 63],
        total: '875',
        attendanceRate: '91.4%',
        revenue: '$39,600'
      },
      '30d': {
        labels: ['Week 1 (Oct 1-7)', 'Week 2 (Oct 8-14)', 'Week 3 (Oct 15-21)', 'Week 4 (Oct 22-28)', 'Week 5 (Oct 29-31)'],
        bookings: [340, 412, 385, 460, 255],
        attendance: [308, 375, 346, 415, 230],
        total: '1,452',
        attendanceRate: '89.5%',
        revenue: '$68,410'
      },
      '90d': {
        labels: ['Aug W1', 'Aug W2', 'Aug W3', 'Aug W4', 'Sep W1', 'Sep W2', 'Sep W3', 'Sep W4', 'Oct W1', 'Oct W2', 'Oct W3', 'Oct W4'],
        bookings: [280, 310, 335, 360, 375, 395, 410, 430, 425, 450, 475, 515],
        attendance: [250, 278, 301, 324, 337, 355, 369, 387, 382, 405, 427, 463],
        total: '4,760',
        attendanceRate: '88.7%',
        revenue: '$218,500'
      }
    };

    const ctx = overviewCanvas.getContext('2d');
    function createGradient(color1, color2) {
      const gradient = ctx.createLinearGradient(0, 0, 0, 280);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      return gradient;
    }

    const themeColors = getThemeColors();
    const initialData = OVERVIEW_CONFIG['30d'];

    const overviewChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: initialData.labels,
        datasets: [
          {
            label: 'Total Bookings',
            data: initialData.bookings,
            borderColor: '#2563EB',
            backgroundColor: createGradient('rgba(37, 99, 235, 0.25)', 'rgba(37, 99, 235, 0.0)'),
            borderWidth: 2.75,
            tension: 0.38,
            fill: true,
            pointBackgroundColor: '#2563EB',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4.5,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: '#2563EB',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 2.5
          },
          {
            label: 'Attended Appointments',
            data: initialData.attendance,
            borderColor: '#8B5CF6',
            backgroundColor: createGradient('rgba(139, 92, 246, 0.18)', 'rgba(139, 92, 246, 0.0)'),
            borderWidth: 2.5,
            tension: 0.38,
            fill: true,
            borderDash: [5, 5],
            pointBackgroundColor: '#8B5CF6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6.5,
            pointHoverBackgroundColor: '#8B5CF6',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 2.5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true,
              pointStyle: 'circle',
              color: themeColors.textColor,
              font: {
                family: "'Plus Jakarta Sans', sans-serif",
                size: 12,
                weight: '600'
              },
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: themeColors.tooltipBg,
            titleColor: themeColors.tooltipText,
            bodyColor: '#cbd5e1',
            titleFont: { family: "'Outfit', sans-serif", size: 13, weight: '700' },
            bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
            padding: 12,
            cornerRadius: 8,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return ` ${label}: ${value} sessions`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: themeColors.gridColor,
              drawBorder: false
            },
            ticks: {
              color: themeColors.textColor,
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: '500' },
              padding: 8
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: themeColors.gridColor,
              drawBorder: false
            },
            ticks: {
              color: themeColors.textColor,
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: '500' },
              padding: 8
            }
          }
        }
      }
    });

    activeCharts.push({
      chart: overviewChart,
      type: 'line'
    });

    timeframeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        timeframeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const range = btn.getAttribute('data-range') || '30d';
        const config = OVERVIEW_CONFIG[range];
        if (!config) return;

        overviewChart.data.labels = config.labels;
        overviewChart.data.datasets[0].data = config.bookings;
        overviewChart.data.datasets[1].data = config.attendance;
        overviewChart.update();

        if (kpiBookings) kpiBookings.textContent = config.total;
        if (kpiAttendance) kpiAttendance.textContent = config.attendanceRate;
        if (kpiRevenue) kpiRevenue.textContent = config.revenue;
      });
    });
  }

  // ==========================================
  // 2. Analytics Page Chart: Booking Volume & Attendance Trajectory
  // ==========================================
  const analyticsCanvas = document.getElementById('analyticsTrajectoryChart');
  if (analyticsCanvas) {
    const kpiBookings = document.getElementById('analyticsKpiBookings');
    const kpiAttended = document.getElementById('analyticsKpiAttended');
    const kpiRate = document.getElementById('analyticsKpiRate');
    const kpiYield = document.getElementById('analyticsKpiYield');
    const trajectoryFilterBtns = document.querySelectorAll('#analyticsTrajectoryFilter .timeframe-btn');
    const dateRangeSelect = document.getElementById('analyticsDateRange');

    // Outcome stats elements
    const completedPctEl = document.getElementById('outcomeCompletedPct');
    const rescheduledPctEl = document.getElementById('outcomeRescheduledPct');
    const cancelledPctEl = document.getElementById('outcomeCancelledPct');
    const completedBarEl = document.getElementById('outcomeCompletedBar');
    const rescheduledBarEl = document.getElementById('outcomeRescheduledBar');
    const cancelledBarEl = document.getElementById('outcomeCancelledBar');

    const ANALYTICS_CONFIG = {
      '7': {
        labels: ['Mon (Oct 6)', 'Tue (Oct 7)', 'Wed (Oct 8)', 'Thu (Oct 9)', 'Fri (Oct 10)', 'Sat (Oct 11)', 'Sun (Oct 12)'],
        confirmed: [48, 62, 70, 56, 84, 96, 68],
        completed: [46, 59, 67, 54, 81, 93, 65],
        total: '484',
        attended: '465',
        rate: '96.1%',
        yield: '$72,600',
        avgYield: 'Avg $150.00',
        outcomes: [96.1, 2.7, 1.2]
      },
      '14': {
        labels: ['Sep 29', 'Sep 30', 'Oct 1', 'Oct 2', 'Oct 3', 'Oct 4', 'Oct 5', 'Oct 6', 'Oct 7', 'Oct 8', 'Oct 9', 'Oct 10', 'Oct 11', 'Oct 12'],
        confirmed: [42, 48, 55, 63, 71, 78, 52, 48, 62, 70, 56, 84, 96, 68],
        completed: [40, 46, 53, 61, 68, 75, 50, 46, 60, 67, 54, 81, 92, 65],
        total: '893',
        attended: '858',
        rate: '96.1%',
        yield: '$134,250',
        avgYield: 'Avg $150.33',
        outcomes: [96.1, 2.6, 1.3]
      },
      '30': {
        labels: ['Oct 1-6', 'Oct 7-12', 'Oct 13-18', 'Oct 19-24', 'Oct 25-31'],
        confirmed: [285, 312, 298, 325, 232],
        completed: [274, 301, 287, 312, 223],
        total: '1,452',
        attended: '1,397',
        rate: '96.2%',
        yield: '$218,400',
        avgYield: 'Avg $150.40',
        outcomes: [96.2, 2.6, 1.2]
      },
      '90': {
        labels: ['Aug W1-2', 'Aug W3-4', 'Sep W1-2', 'Sep W3-4', 'Oct W1-2', 'Oct W3-4'],
        confirmed: [620, 670, 715, 760, 810, 860],
        completed: [596, 644, 688, 731, 779, 827],
        total: '4,435',
        attended: '4,265',
        rate: '96.2%',
        yield: '$665,250',
        avgYield: 'Avg $150.00',
        outcomes: [96.2, 2.5, 1.3]
      },
      '365': {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        confirmed: [980, 1050, 1140, 1220, 1310, 1380, 1420, 1510, 1600, 1720],
        completed: [942, 1009, 1096, 1174, 1260, 1328, 1366, 1453, 1539, 1655],
        total: '13,330',
        attended: '12,822',
        rate: '96.2%',
        yield: '$1,999,500',
        avgYield: 'Avg $150.00',
        outcomes: [96.2, 2.5, 1.3]
      }
    };

    const ctxAna = analyticsCanvas.getContext('2d');
    function createAnaGradient(color1, color2) {
      const gradient = ctxAna.createLinearGradient(0, 0, 0, 270);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      return gradient;
    }

    const themeColors = getThemeColors();
    const initialAnaData = ANALYTICS_CONFIG['30'];

    const trajectoryChart = new Chart(ctxAna, {
      type: 'line',
      data: {
        labels: initialAnaData.labels,
        datasets: [
          {
            label: 'Confirmed Bookings',
            data: initialAnaData.confirmed,
            borderColor: '#2563EB',
            backgroundColor: createAnaGradient('rgba(37, 99, 235, 0.22)', 'rgba(37, 99, 235, 0.0)'),
            borderWidth: 2.75,
            tension: 0.36,
            fill: true,
            pointBackgroundColor: '#2563EB',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4.5,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: '#2563EB',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 2.5
          },
          {
            label: 'Completed Sessions',
            data: initialAnaData.completed,
            borderColor: '#10B981',
            backgroundColor: createAnaGradient('rgba(16, 185, 129, 0.16)', 'rgba(16, 185, 129, 0.0)'),
            borderWidth: 2.5,
            tension: 0.36,
            fill: true,
            pointBackgroundColor: '#10B981',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6.5,
            pointHoverBackgroundColor: '#10B981',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 2.5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true,
              pointStyle: 'circle',
              color: themeColors.textColor,
              font: {
                family: "'Plus Jakarta Sans', sans-serif",
                size: 12,
                weight: '600'
              },
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: themeColors.tooltipBg,
            titleColor: themeColors.tooltipText,
            bodyColor: '#cbd5e1',
            titleFont: { family: "'Outfit', sans-serif", size: 13, weight: '700' },
            bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
            padding: 12,
            cornerRadius: 8,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return ` ${label}: ${value} sessions`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: themeColors.gridColor,
              drawBorder: false
            },
            ticks: {
              color: themeColors.textColor,
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: '500' },
              padding: 8
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: themeColors.gridColor,
              drawBorder: false
            },
            ticks: {
              color: themeColors.textColor,
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: '500' },
              padding: 8
            }
          }
        }
      }
    });

    activeCharts.push({
      chart: trajectoryChart,
      type: 'line'
    });

    // ==========================================
    // 3. Outcome Split Doughnut Chart
    // ==========================================
    let outcomeChart = null;
    const outcomeCanvas = document.getElementById('outcomeDoughnutChart');
    if (outcomeCanvas) {
      const ctxOut = outcomeCanvas.getContext('2d');
      outcomeChart = new Chart(ctxOut, {
        type: 'doughnut',
        data: {
          labels: ['Completed & Fulfilled', 'Rescheduled', 'Cancelled / No-Show'],
          datasets: [
            {
              data: initialAnaData.outcomes,
              backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
              borderWidth: 2,
              borderColor: themeColors.isDark ? '#1e293b' : '#ffffff',
              hoverOffset: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: themeColors.tooltipBg,
              titleColor: themeColors.tooltipText,
              bodyColor: '#cbd5e1',
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: function(context) {
                  return ` ${context.label}: ${context.parsed}%`;
                }
              }
            }
          }
        }
      });

      activeCharts.push({
        chart: outcomeChart,
        type: 'doughnut'
      });
    }

    // Function to apply timeframe range update
    function applyAnalyticsRange(range) {
      const config = ANALYTICS_CONFIG[range];
      if (!config) return;

      // Update button active state
      trajectoryFilterBtns.forEach(btn => {
        if (btn.getAttribute('data-range') === range) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update dropdown selection if matching
      if (dateRangeSelect && dateRangeSelect.value !== range) {
        if (Array.from(dateRangeSelect.options).some(opt => opt.value === range)) {
          dateRangeSelect.value = range;
        }
      }

      // Update Line Chart data
      trajectoryChart.data.labels = config.labels;
      trajectoryChart.data.datasets[0].data = config.confirmed;
      trajectoryChart.data.datasets[1].data = config.completed;
      trajectoryChart.update();

      // Update Doughnut Chart data
      if (outcomeChart) {
        outcomeChart.data.datasets[0].data = config.outcomes;
        outcomeChart.update();
      }

      // Update KPI Counter Cards
      if (kpiBookings) kpiBookings.textContent = config.total;
      if (kpiAttended) kpiAttended.textContent = config.attended;
      if (kpiRate) kpiRate.textContent = `${config.rate} Rate`;
      if (kpiYield) kpiYield.textContent = config.yield;

      // Update outcome breakdown percentages and bars
      if (completedPctEl) completedPctEl.textContent = `${config.outcomes[0]}%`;
      if (rescheduledPctEl) rescheduledPctEl.textContent = `${config.outcomes[1]}%`;
      if (cancelledPctEl) cancelledPctEl.textContent = `${config.outcomes[2]}%`;
      if (completedBarEl) completedBarEl.style.width = `${config.outcomes[0]}%`;
      if (rescheduledBarEl) rescheduledBarEl.style.width = `${config.outcomes[1]}%`;
      if (cancelledBarEl) cancelledBarEl.style.width = `${config.outcomes[2]}%`;
    }

    // Listen to button group clicks
    trajectoryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const range = btn.getAttribute('data-range') || '30';
        applyAnalyticsRange(range);
      });
    });

    // Listen to top dropdown change
    if (dateRangeSelect) {
      dateRangeSelect.addEventListener('change', (e) => {
        applyAnalyticsRange(e.target.value);
      });
    }
  }

  // ==========================================
  // 4. Live Theme Switch Observer (Dark/Light Mode)
  // ==========================================
  const themeObserver = new MutationObserver(() => {
    const updated = getThemeColors();
    activeCharts.forEach(({ chart, type }) => {
      if (type === 'line') {
        if (chart.options.plugins?.legend?.labels) {
          chart.options.plugins.legend.labels.color = updated.textColor;
        }
        if (chart.options.plugins?.tooltip) {
          chart.options.plugins.tooltip.backgroundColor = updated.tooltipBg;
        }
        if (chart.options.scales?.x) {
          chart.options.scales.x.grid.color = updated.gridColor;
          chart.options.scales.x.ticks.color = updated.textColor;
        }
        if (chart.options.scales?.y) {
          chart.options.scales.y.grid.color = updated.gridColor;
          chart.options.scales.y.ticks.color = updated.textColor;
        }
      } else if (type === 'doughnut') {
        if (chart.options.plugins?.tooltip) {
          chart.options.plugins.tooltip.backgroundColor = updated.tooltipBg;
        }
        if (chart.data.datasets?.[0]) {
          chart.data.datasets[0].borderColor = updated.isDark ? '#1e293b' : '#ffffff';
        }
      }
      chart.update('none');
    });
  });

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
});
