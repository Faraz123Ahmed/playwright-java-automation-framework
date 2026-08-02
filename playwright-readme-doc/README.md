# Playwright Test Automation Suite

Automated end-to-end (E2E) test suite built with **Playwright** and **JavaScript**, covering UI interactions, authentication flows, and complete business workflows across multiple web applications. The suite includes **positive, negative, and edge-case scenarios** to validate both expected behavior and system resilience under invalid inputs.

---

## 🧰 Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev/) | Browser automation & E2E testing framework |
| JavaScript (ES Modules) | Test scripting language |
| `@playwright/test` | Test runner, assertions, fixtures |

---

## 📁 Project Structure

```
├── login_spec.js                          # Reserved for standalone login test cases
├── practice_spec.js                       # UI element handling & E2E shopping flow
├── login-to-purchase-requisition_spec.js  # Login + Purchase Requisition module (Manual & Automatic)
└── README.md
```

---

## ✅ Test Coverage Summary

### 1. `practice_spec.js`

| Test Case | Type | Description |
|---|---|---|
| `textContent vs inputValue Demo` | Functional | Validates difference between static label text and dynamic input field value |
| `Login Page Tests → login/logout` | Positive | Full login → dashboard redirect → logout flow with success message validation |
| `Handling UI Elements` | Functional | Covers dropdown selection, radio button, and checkbox (check/uncheck) interactions |
| `Child Window Handling` | Functional | Handles new tab/window events, extracts text from child page, feeds it back into parent page |
| `Dynamic Product Search & Add to Cart` (v1 & v2) | Positive / E2E | End-to-end flow: Login → Search product dynamically → Add to Cart → Checkout → Payment → Order confirmation |

**Highlights:**
- Dynamic product search implemented via **loop-based** and **locator-filter-based** strategies (two approaches compared).
- Full checkout flow automated including payment form and order confirmation assertion.

---

### 2. `login-to-purchase-requisition_spec.js`

End-to-end automation of the **Purchase Requisition module**, covering both **Manual** and **Automatic** creation flows.

| Test Case ID | Type | Scenario |
|---|---|---|
| `TC-01` | Positive | Login → Navigate to Purchase Requisition → Manual entry → Select item via search modal → Fill quantity & narration → Submit → Verify redirect |
| `TC-01-NEG` | Negative | Quantity = `0` and Quantity = *empty* → Validates required-field error (red-highlighted input) on submit |
| `TC-02` | Positive | Automatic PR generation → Select department → Fetch Material Requisition items via modal → Select item → Generate PR → Submit |
| `TC-02-NEG-1` | Negative / Edge Case | Submit form with Department & Material Requisition left empty → Validates required-field error message |
| `TC-02-NEG-2` | Negative | Generate PR without selecting Document Type → Validates "Document type is required" error and confirms form is not submitted |

**Highlights:**
- Toggle-based negative testing (`RUN_QTY_ZERO_CHECK` / `RUN_QTY_EMPTY_CHECK`) allows switching between scenarios without commenting out code.
- Validations confirm both **UI error indicators** (highlighted field) and **URL state** (form not submitted) — not just visible error text.
- Reusable login + navigation flow structured per test for full test isolation.

---

## 🎯 Testing Approach

- **Positive Test Cases** – Validate the happy path (successful login, successful PR creation, successful order placement).
- **Negative Test Cases** – Validate proper error handling for invalid/missing required fields (empty quantity, missing document type, missing department).
- **Edge Cases** – Boundary input handling (Quantity = `0` vs Quantity = empty), dual-strategy product search validation.
- **Assertions** – Combination of visibility checks, text validation, URL validation, and CSS-state validation (e.g., red-highlighted invalid fields) to ensure both **UI feedback** and **application state** are correct.

---

## ▶️ Running the Tests

```bash
# Install dependencies
npm install

# Run all tests
npx playwright test

# Run a specific file
npx playwright test practice_spec.js

# Run in headed mode (see browser)
npx playwright test --headed

# View HTML report
npx playwright show-report
```

---

## 📌 Notes

- Timeouts are explicitly set per test/action to handle real-world network latency and dynamic UI rendering.
- Browser contexts are created and closed explicitly per test to ensure clean, isolated test runs.
- Locator strategies used: `getByRole`, `getByPlaceholder`, `getByText`, CSS selectors, and `filter()` with `has` — chosen based on element stability and semantic accuracy.
