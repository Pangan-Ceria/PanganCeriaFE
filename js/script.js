function getCssVariable(variable) {
  const style = getComputedStyle(document.body);
  return style.getPropertyValue(variable).trim();
}
// UTAMA: Document Ready State
document.addEventListener('DOMContentLoaded', function () {
  const primaryColor = getCssVariable('--primary');
  const blueAccent = getCssVariable('--blue-accent');
  const accentColor = getCssVariable('--accent');
  const greenSecondary = getCssVariable('--green-secondary');
  const redDanger = getCssVariable('--red-danger');
  const darkColor = getCssVariable('--dark-grey');
  const whiteColor = getCssVariable('--bg-light');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
          navMenu.classList.remove('active');
          const icon = menuToggle.querySelector('i');
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
    });
  }
  // Logika Rotasi Teks Hero (Mobile)
  const rotatingText1 = document.getElementById('rotating-text-1');
  const rotatingText2 = document.getElementById('rotating-text-2');

  function rotateTextMobile() {
    if (!rotatingText1 || !rotatingText2 || window.innerWidth >= 640) return;

    let activeText = 1;
    setInterval(() => {
      if (activeText === 1) {
        rotatingText1.classList.replace('opacity-100', 'opacity-0');
        rotatingText2.classList.replace('opacity-0', 'opacity-100');
        activeText = 2;
      } else {
        rotatingText2.classList.replace('opacity-100', 'opacity-0');
        rotatingText1.classList.replace('opacity-0', 'opacity-100');
        activeText = 1;
      }
    }, 2000);
  }

  rotateTextMobile();

  // Logika Dashboard Chart (Chart.js)
  const trendMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov'];
  const trendCases = [2, 3, 1, 10, 3, 2, 6, 9, 15, 10, 3];
  const trendVictims = [11, 176, 42, 954, 429, 26, 455, 1157, 2502, 722, 48];

  const provinces = [
    'Jawa Barat',
    'DIY',
    'Jawa Tengah',
    'NTT',
    'Jawa Timur',
    'Sumatera Utara',
    'Bengkulu',
    'Sulteng',
    'Sumsel',
    'Lainnya',
  ];
  const provinceVictims = [3018, 2625, 1776, 926, 835, 594, 539, 516, 344, 1782];

  const schoolLevels = ['SD/MI', 'SMP/MTs', 'SLTA', 'TK/PAUD', 'Pesantren/Lainnya'];
  const schoolVictims = [4945, 2571, 2386, 590, 428];

  const trendCtx = document.getElementById('trendChart')?.getContext('2d');
  const provinceCtx = document.getElementById('provinceChart')?.getContext('2d');
  const schoolCtx = document.getElementById('schoolChart')?.getContext('2d');

  // Trend Chart (Bar and Line)
  if (trendCtx) {
    new Chart(trendCtx, {
      type: 'bar',
      data: {
        labels: trendMonths,
        datasets: [
          {
            label: 'Jumlah Kasus',
            data: trendCases,
            backgroundColor: `${primaryColor}B3`,
            borderColor: primaryColor,
            borderWidth: 1,
            order: 2,
          },
          {
            label: 'Total Korban',
            data: trendVictims,
            backgroundColor: `${blueAccent}B3`,
            borderColor: blueAccent,
            borderWidth: 2,
            type: 'line',
            yAxisID: 'y1',
            tension: 0.3,
            pointRadius: 5,
            pointHoverRadius: 7,
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: (context) => context[0].label,
              label: (context) => {
                return `${context.dataset.label}: ${context.raw}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Jumlah Kasus' },
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            title: { display: true, text: 'Total Korban' },
            grid: { drawOnChartArea: false, color: 'rgba(0, 0, 0, 0.05)' },
            suggestedMax: Math.max(...trendVictims) * 1.1,
          },
          x: { grid: { display: false } },
        },
      },
    });
  }

  // Province Chart (Doughnut)
  if (provinceCtx) {
    new Chart(provinceCtx, {
      type: 'doughnut',
      data: {
        labels: provinces,
        datasets: [
          {
            data: provinceVictims,
            backgroundColor: [
              primaryColor,
              blueAccent,
              accentColor,
              greenSecondary,
              redDanger,
              darkColor,
              '#a0aec0',
              '#5a67d8',
              '#38a169',
              '#805ad5',
            ].map((color) => `${color}B3`),
            borderColor: `${whiteColor}CC`,
            borderWidth: 2,
            hoverOffset: 15,
            borderRadius: 5,
            spacing: 2,
          },
        ],
      },
      plugins: [
        {
          beforeDraw: function (chart) {
            if (chart.config._config.data.labels.length === 0) {
              var ctx = chart.ctx;
              var width = chart.width;
              var height = chart.height;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.font = '16px Inter';
              ctx.fillText('No data available', width / 2, height / 2);
              ctx.restore();
            }
          },
        },
      ],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onHover: (event, chartElement) => {
          event.native.target.style.cursor = chartElement.length ? 'pointer' : 'default';
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.raw || '';
                return `${label}: ${value} korban`;
              },
              afterLabel: function (context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const value = context.raw || 0;
                const percentage = Math.round((value / total) * 100);
                return `Persentase: ${percentage}%`;
              },
            },
          },
          legend: {
            position: 'right',
            labels: { boxWidth: 12, padding: 20, usePointStyle: true, pointStyle: 'circle' },
          },
        },
      },
    });
  }
  if (schoolCtx) {
    new Chart(schoolCtx, {
      type: 'doughnut',
      data: {
        labels: schoolLevels,
        datasets: [
          {
            data: schoolVictims,
            backgroundColor: [primaryColor, blueAccent, accentColor, greenSecondary, redDanger].map(
              (color) => `${color}B3`,
            ),
            borderColor: `${whiteColor}CC`,
            borderWidth: 2,
            hoverOffset: 15,
            borderRadius: 5,
            spacing: 2,
          },
        ],
      },
      plugins: [
        {
          beforeDraw: function (chart) {
            if (chart.config._config.data.labels.length === 0) {
              var ctx = chart.ctx;
              var width = chart.width;
              var height = chart.height;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.font = '16px Inter';
              ctx.fillText('No data available', width / 2, height / 2);
              ctx.restore();
            }
          },
        },
      ],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onHover: (event, chartElement) => {
          event.native.target.style.cursor = chartElement.length ? 'pointer' : 'default';
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label} (${context.raw} korban)`;
              },
            },
          },
          legend: {
            position: 'right',
            labels: { boxWidth: 12, padding: 20, usePointStyle: true, pointStyle: 'circle' },
          },
        },
      },
    });
  }

  // Button Event Listeners for Chart Toggle
  function resetAllButtons() {
    const buttons = document.querySelectorAll('.chart-toggle-btn');
    buttons.forEach((btn) => {
      btn.classList.remove('active');
    });
  }

  const trendBtn = document.getElementById('trendBtn');
  const provinceBtn = document.getElementById('provinceBtn');
  const schoolBtn = document.getElementById('schoolBtn');
  const trendView = document.getElementById('trendView');
  const provinceView = document.getElementById('provinceView');
  const schoolView = document.getElementById('schoolView');

  if (trendBtn && trendView && provinceView && schoolView) {
    trendBtn.addEventListener('click', function () {
      resetAllButtons();
      this.classList.add('active');
      trendView.classList.remove('hidden');
      provinceView.classList.add('hidden');
      schoolView.classList.add('hidden');
    });

    provinceBtn.addEventListener('click', function () {
      resetAllButtons();
      this.classList.add('active');
      trendView.classList.add('hidden');
      provinceView.classList.remove('hidden');
      schoolView.classList.add('hidden');
    });

    schoolBtn.addEventListener('click', function () {
      resetAllButtons();
      this.classList.add('active');
      trendView.classList.add('hidden');
      provinceView.classList.add('hidden');
      schoolView.classList.remove('hidden');
    });
    trendBtn.classList.add('active');
    provinceView.classList.add('hidden');
    schoolView.classList.add('hidden');
  }

  //Logika Audit Bahan Makanan (Pencarian & Filter)

  const searchInput = document.getElementById('search-bahan');
  const statusFilter = document.getElementById('filter-status');
  const tableBody = document.getElementById('audit-table-body');
  const tableRows = tableBody ? document.querySelectorAll('#audit-table-body .data-row') : [];
  function applyStatusStyling() {
    tableRows.forEach((row) => {
      const statusSpan = row.querySelector('.status');
      if (statusSpan) {
        statusSpan.className = 'status font-bold px-2 py-1 rounded';
        if (row.classList.contains('status-aman')) {
          statusSpan.classList.add('text-green-600', 'bg-green-100');
        } else if (row.classList.contains('status-perlu-perhatian')) {
          statusSpan.classList.add('text-yellow-600', 'bg-yellow-100');
        } else if (row.classList.contains('status-berisiko')) {
          statusSpan.classList.add('text-red-600', 'bg-red-100');
        }
      }
    });
  }
  function filterAuditTable() {
    if (tableRows.length === 0) return;

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const statusTerm = statusFilter ? statusFilter.value : 'semua';

    tableRows.forEach((row) => {
      const rowData = row.children[0].textContent.toLowerCase();
      const matchesSearch = rowData.includes(searchTerm);
      const matchesStatus =
        statusTerm === 'semua' || row.classList.contains(`status-${statusTerm}`);

      if (matchesSearch && matchesStatus) {
        row.classList.remove('hidden');
      } else {
        row.classList.add('hidden');
      }
    });
  }

  if (searchInput && statusFilter) {
    applyStatusStyling();
    searchInput.addEventListener('input', filterAuditTable);
    statusFilter.addEventListener('change', filterAuditTable);
  }

  // LOGIKA DAFTAR LAPORAN & FORM SUBMISSION
  const reportForm = document.getElementById('reportForm');
  const locationInput = document.getElementById('locationInput');
  const reportListContainer = document.getElementById('reportListContainer');
  const successNotification = document.getElementById('successNotification');
  const errorNotification = document.getElementById('errorNotification');
  const errorMessageText = document.getElementById('errorMessageText');
  const initialReports = [
    { id: 1, title: 'Laporan A', status: 'DIPROSES' },
    { id: 2, title: 'Laporan B', status: 'SELESAI' },
    { id: 3, title: 'Laporan C', status: 'MENUNGGU VERIFIKASI' },
  ];
  function createReportItem(report) {
    const item = document.createElement('div');
    const statusClass = report.status.toLowerCase().replace(/ /g, '-');
    let statusColorClass = 'text-gray-700 bg-gray-100';
    if (statusClass === 'diproses') {
      statusColorClass = 'text-blue-600 bg-blue-100';
    } else if (statusClass === 'selesai') {
      statusColorClass = 'text-green-600 bg-green-100';
    } else if (statusClass === 'menunggu-verifikasi') {
      statusColorClass = 'text-yellow-600 bg-yellow-100';
    }

    item.className =
      'report-item p-4 border border-gray-200 rounded-lg shadow-sm mb-3 bg-white transition-shadow hover:shadow-md';
    item.innerHTML = `
      <h4 class="text-lg font-bold text-gray-800">${report.title}</h4>
      <p class="text-sm text-gray-500 mb-1">ID Laporan: ${report.id}</p>
      <p class="text-sm">Status: 
        <span class="font-bold px-2 py-0.5 rounded ${statusColorClass}">${report.status}</span>
      </p>
    `;
    return item;
  }

  //UPDATE REPORT LIST
  function updateReportList() {
    if (reportListContainer) {
      reportListContainer.innerHTML = '';
      initialReports
        .slice()
        .reverse()
        .forEach((report) => {
          reportListContainer.appendChild(createReportItem(report));
        });
    }
  }
  updateReportList();
  if (locationInput) {
    locationInput.setAttribute('placeholder', 'SMA NEGERI 2 AMBON');
  }
  if (reportForm) {
    const requiredInputs = reportForm.querySelectorAll('[required]');
    const errorClasses = ['border-red-500', 'ring-red-500', 'ring-1'];

    function clearErrorStyling(input) {
      input.classList.remove(...errorClasses);
    }
    requiredInputs.forEach((input) => {
      input.addEventListener('input', () => clearErrorStyling(input));
      input.addEventListener('change', () => clearErrorStyling(input));
    });

    reportForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;
      const invalidFields = [];
      successNotification.classList.add('hidden');
      errorNotification.classList.add('hidden');
      requiredInputs.forEach((input) => {
        const value = input.value.trim();
        let isInputEmpty = false;

        if (input.tagName === 'SELECT' && value === '') {
          isInputEmpty = true;
        } else if (input.type === 'file' && input.files.length === 0) {
          isInputEmpty = true;
        } else if (value === '') {
          isInputEmpty = true;
        }

        if (isInputEmpty) {
          isFormValid = false;
          input.classList.add(...errorClasses);
          invalidFields.push(
            input.previousElementSibling?.textContent || input.placeholder || 'Field',
          );
        } else {
          input.classList.remove(...errorClasses);
        }
      });
      if (isFormValid) {
        const newId =
          initialReports.length > 0 ? Math.max(...initialReports.map((r) => r.id)) + 1 : 1;
        const reportTitleInput =
          document.getElementById('reportTitleInput')?.value || `Laporan Baru ID: ${newId}`;

        const newReport = {
          id: newId,
          title: reportTitleInput,
          status: 'MENUNGGU VERIFIKASI',
        };

        initialReports.push(newReport);

        reportForm.reset();
        updateReportList();
        successNotification.classList.remove('hidden');
        successNotification.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          successNotification.classList.add('hidden');
        }, 5000);
      } else {
        errorNotification.classList.remove('hidden');

        if (invalidFields.length > 0) {
          errorMessageText.textContent = `Mohon lengkapi field: ${invalidFields[0]
            .replace(/:$/, '')
            .trim()} dan field wajib lainnya.`;
        } else {
          errorMessageText.textContent = 'Mohon lengkapi semua kolom yang wajib diisi.';
        }
        errorNotification.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const firstInvalid = reportForm.querySelector('.border-red-500');
        if (firstInvalid) {
          firstInvalid.focus();
        }
      }
    });
  }
});
