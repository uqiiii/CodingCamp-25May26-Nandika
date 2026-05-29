# Requirements

## Introduction

Expense & Budget Visualizer is a vanilla JavaScript single-page application that helps users track personal expenses, visualize spending by category, and enforce a monthly budget limit. The app runs entirely in the browser with no backend — all data is persisted to localStorage. It features a responsive layout, dark/light mode, a pie chart powered by Chart.js, and basic security measures against XSS.

## Requirements

### Requirement 1: Add Transactions

**User Story:** As a user, I want to add expense transactions with a name, amount, and category, so that I can record my spending in an organized way.

#### Acceptance Criteria

1. GIVEN the add-transaction form is visible WHEN the user enters a name, an amount in Rp, selects a category (Food, Transport, Fun, Shopping, or Health), and submits THEN the transaction is added to the transaction list and the balance updates immediately.
2. GIVEN the form is submitted WHEN any required field (name, amount, or category) is empty THEN the transaction is not added and the user is prompted to complete the missing fields.
3. GIVEN a transaction is successfully added WHEN the form submission completes THEN the form fields are cleared and ready for the next entry.
4. GIVEN the user is on the form WHEN they press the Enter key while focused on the name or amount field THEN the form is submitted without requiring a mouse click.

---

### Requirement 2: Display Total Balance

**User Story:** As a user, I want to see the total sum of all my expenses in a balance card, so that I can quickly understand how much I have spent overall.

#### Acceptance Criteria

1. GIVEN one or more transactions exist WHEN the page loads or a transaction is added or deleted THEN the balance card displays the correct sum of all transaction amounts in Rp.
2. GIVEN no transactions exist WHEN the page loads THEN the balance card displays Rp 0.
3. GIVEN a transaction is deleted WHEN the deletion is confirmed THEN the balance card updates immediately to reflect the new total.

---

### Requirement 3: Monthly Spending Limit with Over-Limit Warning

**User Story:** As a user, I want to set an optional monthly spending limit and receive a warning when I exceed it, so that I can stay within my budget.

#### Acceptance Criteria

1. GIVEN the user enters a value in the monthly limit field WHEN the total balance exceeds that limit THEN a warning banner is displayed indicating the budget has been exceeded.
2. GIVEN the warning banner is active WHEN the total balance exceeds the limit THEN each transaction that contributes to the over-limit total is visually highlighted in the transaction list.
3. GIVEN the user is typing in the limit field WHEN the typed value causes the current total to cross the limit threshold THEN the warning banner and transaction highlights update in real time without requiring a page reload.
4. GIVEN no spending limit is set WHEN the page is viewed THEN no warning banner or transaction highlights are shown.

---

### Requirement 4: Transaction List with Sort Options

**User Story:** As a user, I want to view all my transactions in a list and sort them by different criteria, so that I can find and review my expenses easily.

#### Acceptance Criteria

1. GIVEN transactions exist WHEN the transaction list is rendered THEN each entry displays the transaction name, category, and amount in Rp.
2. GIVEN the user selects a sort option WHEN the available options are newest, oldest, amount descending, amount ascending, or category THEN the transaction list re-renders in the selected order immediately.
3. GIVEN a sort option is selected WHEN new transactions are added THEN the list maintains the currently selected sort order.

---

### Requirement 5: Delete Individual Transactions

**User Story:** As a user, I want to delete individual transactions from the list, so that I can remove incorrect or unwanted entries.

#### Acceptance Criteria

1. GIVEN a transaction is displayed in the list WHEN the user clicks the delete button for that transaction THEN the transaction is removed from the list and from localStorage.
2. GIVEN a transaction is deleted WHEN the deletion completes THEN the total balance and the pie chart update immediately to reflect the removal.
3. GIVEN the last transaction is deleted WHEN the deletion completes THEN the transaction list shows an empty state and the balance resets to Rp 0.

---

### Requirement 6: Pie Chart Spending Breakdown

**User Story:** As a user, I want to see a pie chart that breaks down my spending by category, so that I can understand where my money is going at a glance.

#### Acceptance Criteria

1. GIVEN one or more transactions exist WHEN the page renders or data changes THEN a pie chart is displayed showing each spending category as a proportional slice.
2. GIVEN the pie chart is rendered WHEN the user hovers over a slice THEN a tooltip shows the category name and its percentage of total spending.
3. GIVEN a transaction is added or deleted WHEN the change affects category totals THEN the pie chart updates automatically to reflect the new distribution.
4. GIVEN all transactions are deleted WHEN the chart renders THEN the pie chart displays an empty or placeholder state.

---

### Requirement 7: Dark/Light Mode Toggle

**User Story:** As a user, I want to toggle between dark and light display modes, so that I can use the app comfortably in different lighting conditions.

#### Acceptance Criteria

1. GIVEN the app is loaded WHEN the user clicks the theme toggle THEN the UI switches between dark mode and light mode.
2. GIVEN the user has selected a theme WHEN the page is reloaded or revisited THEN the previously selected theme is restored from localStorage.
3. GIVEN dark mode is active WHEN the theme is applied THEN all UI elements — including the chart, cards, and form — reflect the dark color scheme defined by the CSS variables.

---

### Requirement 8: localStorage Persistence

**User Story:** As a user, I want my transactions, spending limit, and theme preference to be saved locally, so that my data is still available when I return to the app.

#### Acceptance Criteria

1. GIVEN the user adds a transaction WHEN the page is closed and reopened THEN all previously added transactions are restored from localStorage.
2. GIVEN the user sets a monthly spending limit WHEN the page is reloaded THEN the limit value is restored and the warning state is re-evaluated against the current total.
3. GIVEN the user selects a theme WHEN the page is reloaded THEN the same theme (dark or light) is applied on load without any flash of the wrong theme.

---

### Requirement 9: Responsive Layout

**User Story:** As a user, I want the app to be usable on both desktop and mobile screens, so that I can track expenses from any device.

#### Acceptance Criteria

1. GIVEN the viewport width is greater than 640px WHEN the page renders THEN the layout uses a multi-column grid to display the balance card, form, transaction list, and chart side by side.
2. GIVEN the viewport width is 640px or less WHEN the page renders THEN the layout collapses to a single-column stack so all sections remain readable without horizontal scrolling.
3. GIVEN the user resizes the browser window WHEN the width crosses the 640px breakpoint THEN the layout adjusts responsively without requiring a page reload.

---

### Requirement 10: XSS Prevention

**User Story:** As a user, I want the app to safely handle any text I enter, so that malicious input cannot inject scripts or break the UI.

#### Acceptance Criteria

1. GIVEN the user enters a transaction name containing HTML or JavaScript characters (e.g., `<`, `>`, `"`, `&`) WHEN the transaction is rendered in the list THEN the characters are escaped and displayed as plain text, not executed as markup or code.
2. GIVEN any user-supplied string is inserted into the DOM WHEN the insertion occurs THEN the `escapeHtml` function is applied before rendering to neutralize potentially harmful content.

---

### Requirement 11: Enter Key Form Submission

**User Story:** As a user, I want to submit the transaction form by pressing Enter while typing in the name or amount field, so that I can add transactions quickly without reaching for the mouse.

#### Acceptance Criteria

1. GIVEN the transaction form is visible WHEN the user presses Enter while the name field is focused THEN the form is submitted as if the submit button was clicked.
2. GIVEN the transaction form is visible WHEN the user presses Enter while the amount field is focused THEN the form is submitted as if the submit button was clicked.
3. GIVEN the form is submitted via Enter key WHEN validation passes THEN the transaction is added and the form fields are cleared, matching the behavior of a button click submission.

---

### Requirement 12: Live Limit Warning Update

**User Story:** As a user, I want the budget warning to update in real time as I type a new spending limit, so that I can immediately see whether my current expenses exceed the limit I am considering.

#### Acceptance Criteria

1. GIVEN the user is typing a value into the monthly limit field WHEN each keystroke changes the field value THEN the warning banner visibility is re-evaluated against the current total balance without requiring form submission.
2. GIVEN the current total exceeds the value being typed WHEN the threshold is crossed mid-input THEN the warning banner appears immediately and transaction highlights activate.
3. GIVEN the user clears the limit field WHEN the field becomes empty THEN the warning banner is hidden and all transaction highlights are removed.
