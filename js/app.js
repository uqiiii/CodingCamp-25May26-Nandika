// ===== EXPENSE & BUDGET VISUALIZER =====
// Vanilla JS | LocalStorage | Chart.js

// ---- CATEGORY COLORS ----
const CATEGORY_COLORS = {
  Food:      '#22c55e',
  Transport: '#3b82f6',
  Fun:       '#f59e0b',
  Shopping:  '#a855f7',
  Health:    '#ef4444',
  Other:     '#94a3b8',
};

// ---- STATE ----
let transactions = [];
let spendingChart = null;

// ---- DOM REFS ----
const itemNameEl    = document.getElementById('itemName');
const amountEl      = document.getElementById('amount');
const categoryEl    = document.getElementById('category');
const spendLimitEl  = document.getElementById('spendLimit');
const btnAdd        = document.getElementById('btnAdd');
const errorMsgEl    = document.getElementById('errorMsg');
const totalBalEl    = document.getElementById('totalBalance');
const txListEl      = document.getElementById('transactionList');
const sortByEl      = document.getElementById('sortBy');
const limitWarnEl   = document.getElementById('limitWarning');
const btnTheme      = document.getElementById('btnTheme');
const chartCanvas   = document.getElementById('spendingChart');
const chartEmptyEl  = document.querySelector('.chart-empty');

// ---- LOCALSTORAGE ----
function saveData() {
  localStorage.setItem('evb_transactions', JSON.stringify(transactions));
  localStorage.setItem('evb_spendLimit', spendLimitEl.value);
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('evb_theme', isDark ? 'dark' : 'light');
}

function loadData() {
  const saved = localStorage.getItem('evb_transactions');
  transactions = saved ? JSON.parse(saved) : [];

  const savedLimit = localStorage.getItem('evb_spendLimit');
  if (savedLimit) spendLimitEl.value = savedLimit;

  const savedTheme = localStorage.getItem('evb_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    btnTheme.textContent = '☀️';
  }
}

// ---- FORMAT CURRENCY ----
function formatRp(amount) {
  return 'Rp ' + Number(amount).toLocaleString('id-ID');
}

// ---- VALIDATE FORM ----
function validateForm() {
  const name = itemNameEl.value.trim();
  const amt  = parseFloat(amountEl.value);
  const cat  = categoryEl.value;

  if (!name) {
    showError('Please enter an item name.');
    return false;
  }
  if (!amountEl.value || isNaN(amt) || amt <= 0) {
    showError('Please enter a valid amount greater than 0.');
    return false;
  }
  if (!cat) {
    showError('Please select a category.');
    return false;
  }
  showError('');
  return true;
}

function showError(msg) {
  errorMsgEl.textContent = msg;
}

// ---- ADD TRANSACTION ----
function addTransaction() {
  if (!validateForm()) return;

  const tx = {
    id:       Date.now(),
    name:     itemNameEl.value.trim(),
    amount:   parseFloat(parseFloat(amountEl.value).toFixed(2)),
    category: categoryEl.value,
    date:     new Date().toISOString(),
  };

  transactions.push(tx);
  saveData();
  render();

  // Reset form
  itemNameEl.value = '';
  amountEl.value   = '';
  categoryEl.value = '';
  itemNameEl.focus();
}

// ---- DELETE TRANSACTION ----
function deleteTransaction(id) {
  transactions = transactions.filter(tx => tx.id !== id);
  saveData();
  render();
}

// ---- GET SORTED TRANSACTIONS ----
function getSortedTransactions() {
  const sorted = [...transactions];
  const mode = sortByEl.value;

  switch (mode) {
    case 'newest':      return sorted.sort((a, b) => b.id - a.id);
    case 'oldest':      return sorted.sort((a, b) => a.id - b.id);
    case 'amount-desc': return sorted.sort((a, b) => b.amount - a.amount);
    case 'amount-asc':  return sorted.sort((a, b) => a.amount - b.amount);
    case 'category':    return sorted.sort((a, b) => a.category.localeCompare(b.category));
    default:            return sorted;
  }
}

// ---- CALCULATE TOTAL ----
function getTotal() {
  return transactions.reduce((sum, tx) => sum + tx.amount, 0);
}

// ---- RENDER TOTAL BALANCE ----
function renderBalance() {
  const total = getTotal();
  totalBalEl.textContent = formatRp(total);
}

// ---- RENDER LIMIT WARNING ----
function renderLimitWarning() {
  const limit = parseFloat(spendLimitEl.value);
  const total = getTotal();

  if (!isNaN(limit) && limit > 0 && total > limit) {
    limitWarnEl.classList.remove('hidden');
    limitWarnEl.textContent = `⚠️ You've exceeded your spending limit of ${formatRp(limit)}! (Current: ${formatRp(total)})`;
  } else {
    limitWarnEl.classList.add('hidden');
  }
}

// ---- RENDER TRANSACTION LIST ----
function renderTransactions() {
  const sorted = getSortedTransactions();
  const limit  = parseFloat(spendLimitEl.value);

  if (sorted.length === 0) {
    txListEl.innerHTML = '<p class="empty-state">No transactions yet. Add one above! 👆</p>';
    return;
  }

  // Check per-category running totals for "over limit" highlight
  const categoryTotals = {};
  transactions.forEach(tx => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
  });

  txListEl.innerHTML = sorted.map(tx => {
    const catColor  = CATEGORY_COLORS[tx.category] || CATEGORY_COLORS['Other'];
    const overLimit = !isNaN(limit) && limit > 0 && getTotal() > limit;
    const itemClass = overLimit ? 'tx-item over-limit' : 'tx-item';

    return `
      <div class="${itemClass}" data-id="${tx.id}">
        <div class="tx-info">
          <div class="tx-name">${escapeHtml(tx.name)}</div>
          <div class="tx-category">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${catColor};margin-right:4px;"></span>
            ${tx.category}
          </div>
        </div>
        <div class="tx-amount" style="color:${catColor}">${formatRp(tx.amount)}</div>
        <button class="btn-delete" onclick="deleteTransaction(${tx.id})">Delete</button>
      </div>
    `;
  }).join('');
}

// ---- RENDER PIE CHART ----
function renderChart() {
  const categoryTotals = {};
  transactions.forEach(tx => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
  });

  const labels  = Object.keys(categoryTotals);
  const values  = Object.values(categoryTotals);
  const colors  = labels.map(l => CATEGORY_COLORS[l] || CATEGORY_COLORS['Other']);

  if (labels.length === 0) {
    chartCanvas.style.display = 'none';
    chartEmptyEl.classList.remove('hidden');
    if (spendingChart) {
      spendingChart.destroy();
      spendingChart = null;
    }
    return;
  }

  chartCanvas.style.display = 'block';
  chartEmptyEl.classList.add('hidden');

  if (spendingChart) {
    spendingChart.data.labels           = labels;
    spendingChart.data.datasets[0].data = values;
    spendingChart.data.datasets[0].backgroundColor = colors;
    spendingChart.update();
    return;
  }

  const isDark = document.body.classList.contains('dark');
  const legendColor = isDark ? '#94a3b8' : '#64748b';

  spendingChart = new Chart(chartCanvas, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data:            values,
        backgroundColor: colors,
        borderWidth:     2,
        borderColor:     isDark ? '#1e293b' : '#ffffff',
      }]
    },
    options: {
      responsive:          true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color:     legendColor,
            font:      { size: 11 },
            padding:   12,
            boxWidth:  12,
          }
        },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              const val   = ctx.raw;
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct   = ((val / total) * 100).toFixed(1);
              return ` ${formatRp(val)} (${pct}%)`;
            }
          }
        }
      }
    }
  });
}

// ---- MAIN RENDER ----
function render() {
  renderBalance();
  renderLimitWarning();
  renderTransactions();
  renderChart();
}

// ---- THEME TOGGLE (Dark/Light Mode) ----
function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  btnTheme.textContent = isDark ? '☀️' : '🌙';
  saveData();

  // Re-render chart for updated colors
  if (spendingChart) {
    spendingChart.destroy();
    spendingChart = null;
  }
  renderChart();
}

// ---- ESCAPE HTML (XSS prevention) ----
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ---- EVENT LISTENERS ----
btnAdd.addEventListener('click', addTransaction);
sortByEl.addEventListener('change', renderTransactions);
btnTheme.addEventListener('click', toggleTheme);

// Add transaction on Enter key
[itemNameEl, amountEl].forEach(el => {
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTransaction();
  });
});

// Update limit warning live when limit changes
spendLimitEl.addEventListener('input', () => {
  saveData();
  renderLimitWarning();
  renderTransactions();
});

// ---- INIT ----
loadData();
render();
