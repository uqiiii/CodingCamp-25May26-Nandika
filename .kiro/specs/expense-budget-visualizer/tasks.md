# Tasks

## Implementation Tasks

- [x] 1. Project scaffold
  - Create `index.html` with semantic HTML structure: header, balance card, form section, content grid (transaction list + chart)
  - Link `css/style.css` and `js/app.js`
  - Add Chart.js CDN script tag
  - _Requirements: 1, 2, 4, 6_

- [x] 2. CSS theming and layout
  - Define CSS custom properties on `:root` for light mode (colors, shadows, radii, transitions)
  - Add `body.dark` overrides for dark mode
  - Implement sticky header, card styles, form styles, and button styles
  - Implement two-column content grid and two-column form row
  - Add responsive breakpoint at 640px collapsing to single-column
  - _Requirements: 7, 9_

- [x] 3. State and localStorage
  - Declare `transactions` array and `spendingChart` variable as module-level state
  - Implement `saveData()` — serializes transactions, limit, and theme to localStorage
  - Implement `loadData()` — restores state from localStorage on init, applies saved theme
  - _Requirements: 8_

- [x] 4. Currency formatting and HTML escaping utilities
  - Implement `formatRp(amount)` using `toLocaleString('id-ID')`
  - Implement `escapeHtml(str)` using a temporary DOM text node
  - _Requirements: 2, 10_

- [x] 5. Form validation
  - Implement `validateForm()` checking name (non-empty), amount (positive number), and category (selected)
  - Implement `showError(msg)` to display/clear the `#errorMsg` element
  - _Requirements: 1_

- [x] 6. Add and delete transactions
  - Implement `addTransaction()`: validate, build tx object with `Date.now()` id, push to array, save, render, reset form
  - Implement `deleteTransaction(id)`: filter array, save, render
  - Attach `btnAdd` click listener and Enter key listeners on name/amount inputs
  - _Requirements: 1, 5, 11_

- [x] 7. Balance rendering
  - Implement `getTotal()` reducing the transactions array
  - Implement `renderBalance()` updating `#totalBalance` with `formatRp(getTotal())`
  - _Requirements: 2_

- [x] 8. Spending limit warning
  - Implement `renderLimitWarning()`: compare total to limit, show/hide `#limitWarning` with descriptive message
  - Attach `input` listener on `#spendLimit` to call `saveData`, `renderLimitWarning`, and `renderTransactions` on each keystroke
  - _Requirements: 3, 12_

- [x] 9. Transaction list rendering and sorting
  - Implement `getSortedTransactions()` with five sort modes: newest, oldest, amount-desc, amount-asc, category
  - Implement `renderTransactions()`: map sorted array to HTML rows with name, category dot, amount, delete button; apply `over-limit` class when total exceeds limit; show empty state when array is empty
  - Attach `change` listener on `#sortBy`
  - _Requirements: 4, 3, 5_

- [x] 10. Pie chart rendering
  - Implement `renderChart()`: aggregate category totals, map to Chart.js labels/values/colors
  - Create chart on first render; update in-place on subsequent renders; destroy when no data
  - Configure tooltip callback to show `formatRp` value and percentage
  - Show/hide canvas and empty-state message based on data presence
  - _Requirements: 6_

- [x] 11. Dark/light mode toggle
  - Implement `toggleTheme()`: toggle `dark` class on `<body>`, update button emoji, save, destroy and recreate chart with updated legend/border colors
  - Attach click listener on `#btnTheme`
  - _Requirements: 7_

- [x] 12. Main render orchestration and initialization
  - Implement `render()` calling `renderBalance`, `renderLimitWarning`, `renderTransactions`, `renderChart` in order
  - Call `loadData()` then `render()` on script load to restore persisted state
  - _Requirements: 1, 2, 3, 4, 6, 7, 8_
