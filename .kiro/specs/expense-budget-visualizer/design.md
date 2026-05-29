# Design

## Overview

Expense & Budget Visualizer is a client-side single-page application (SPA) built with vanilla HTML, CSS, and JavaScript. There is no server, no build step, and no framework — the app runs directly in the browser and persists all state to `localStorage`.

---

## Architecture

```
index.html          ← Shell: markup, layout, CDN script tags
css/style.css       ← Theming (CSS variables), layout, responsive rules
js/app.js           ← All application logic (state, CRUD, rendering, chart)
```

The app follows a simple **state → render** cycle:

1. User action (button click, key press, input change) triggers a handler.
2. Handler mutates the in-memory `transactions` array and/or reads form values.
3. `saveData()` writes the new state to `localStorage`.
4. `render()` (or a targeted sub-render) re-draws the affected DOM sections.

There is no virtual DOM or diffing — the transaction list and chart are fully re-rendered on each state change.

---

## Data Model

### Transaction object
```js
{
  id:       Number,   // Date.now() — used as unique key and sort-by-newest key
  name:     String,   // User-supplied item name (HTML-escaped before render)
  amount:   Number,   // Positive float, rounded to 2 decimal places
  category: String,   // One of: "Food" | "Transport" | "Fun" | "Shopping" | "Health"
  date:     String,   // ISO 8601 timestamp (new Date().toISOString())
}
```

### localStorage keys
| Key | Type | Description |
|---|---|---|
| `evb_transactions` | JSON string | Serialized `transactions` array |
| `evb_spendLimit` | String | Raw value of the limit input |
| `evb_theme` | `"dark"` \| `"light"` | Active theme |

---

## Component Breakdown

### Header
- Sticky top bar with app title and theme toggle button (`btnTheme`).
- Theme toggle adds/removes the `dark` class on `<body>` and updates the button emoji.

### Balance Card
- Displays the sum of all transaction amounts formatted as `Rp X.XXX`.
- Re-rendered on every `render()` call via `renderBalance()`.

### Add Transaction Form
- Fields: `itemName` (text), `amount` (number), `category` (select), `spendLimit` (number, optional).
- Client-side validation in `validateForm()` — shows inline error via `#errorMsg`.
- Submits on button click or Enter key in name/amount fields.

### Transaction List
- Rendered by `renderTransactions()` from the sorted copy of `transactions`.
- Sort order driven by `#sortBy` select (newest / oldest / amount-desc / amount-asc / category).
- Each row: name, category dot + label, amount (category color), delete button.
- Rows get the `over-limit` CSS class when total exceeds the spending limit.
- Scrollable container (`max-height: 400px`, custom scrollbar).

### Limit Warning Banner
- `#limitWarning` div, hidden by default via `.hidden` class.
- Shown when `total > limit` (both must be valid positive numbers).
- Displays exact limit and current total in the message.

### Pie Chart
- Rendered by `renderChart()` using Chart.js (`type: 'pie'`).
- Data: one slice per category present in `transactions`, colored by `CATEGORY_COLORS`.
- Tooltip callback formats values as `Rp X.XXX (Y%)`.
- Chart instance stored in `spendingChart`; updated in-place on data changes, destroyed and recreated on theme toggle.
- Canvas hidden and empty-state message shown when no transactions exist.

---

## Theming

CSS custom properties on `:root` define the light theme. The `body.dark` selector overrides them for dark mode. All components consume only CSS variables, so toggling the class on `<body>` is sufficient to re-theme the entire UI.

Chart.js does not use CSS variables natively, so legend/border colors are read from `document.body.classList` at chart creation time. The chart is destroyed and recreated on theme toggle to pick up the new colors.

---

## Security

User-supplied strings (transaction names) are passed through `escapeHtml()` before being inserted into `innerHTML`. The function creates a temporary text node, appends the string, and reads back `innerHTML` — this is the standard browser-native escaping approach and neutralizes `<`, `>`, `"`, `&`, and `'`.

---

## Responsive Layout

| Breakpoint | Layout |
|---|---|
| > 640px | Two-column grid for transaction list + chart; two-column form row for amount + category |
| ≤ 640px | Single-column stack for all sections; single-column form |

---

## Key Functions

| Function | Responsibility |
|---|---|
| `loadData()` | Reads localStorage on init, populates state and form |
| `saveData()` | Writes transactions, limit, and theme to localStorage |
| `addTransaction()` | Validates, creates tx object, pushes to array, saves, renders |
| `deleteTransaction(id)` | Filters array, saves, renders |
| `getSortedTransactions()` | Returns a sorted copy of `transactions` based on `sortBy` value |
| `getTotal()` | Reduces `transactions` to a sum |
| `renderBalance()` | Updates `#totalBalance` text |
| `renderLimitWarning()` | Shows/hides `#limitWarning` based on total vs limit |
| `renderTransactions()` | Rebuilds `#transactionList` innerHTML |
| `renderChart()` | Creates or updates the Chart.js pie chart |
| `render()` | Calls all four render functions |
| `toggleTheme()` | Toggles `dark` class, saves, recreates chart |
| `escapeHtml(str)` | Returns HTML-safe version of a string |
| `formatRp(amount)` | Formats a number as `Rp X.XXX` using `id-ID` locale |
| `validateForm()` | Checks name, amount, category; shows error message |
