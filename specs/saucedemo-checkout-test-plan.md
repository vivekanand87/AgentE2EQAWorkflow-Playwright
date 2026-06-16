# SauceDemo Checkout Workflow — Playwright Test Plan
**User Story:** SCRUM-101 — E-commerce Checkout Process  
**App URL:** https://www.saucedemo.com  
**Credentials:** `standard_user` / `secret_sauce`  
**Date:** 2026-06-16  
**Coverage:** AC1 (Cart Review), AC2 (Checkout Info), AC3 (Order Overview), AC4 (Order Completion), AC5 (Error Handling)

---

## Table of Contents
1. [Test Environment](#test-environment)
2. [AC1 — Cart Review](#ac1--cart-review)
3. [AC2 — Checkout Information Entry](#ac2--checkout-information-entry)
4. [AC3 — Order Overview](#ac3--order-overview)
5. [AC4 — Order Completion](#ac4--order-completion)
6. [AC5 — Error Handling & Validation](#ac5--error-handling--validation)
7. [Cross-Browser Testing](#cross-browser-testing)
8. [Test Summary](#test-summary)

---

## Test Environment

| Property | Value |
|---|---|
| Base URL | https://www.saucedemo.com |
| Valid Username | `standard_user` |
| Valid Password | `secret_sauce` |
| Browsers | Chromium, Firefox, WebKit (Safari) |
| Framework | Playwright |
| Node Version | ≥18 |

**Global Precondition for all tests:** Browser is freshly launched. No cookies, local storage, or session data exists from prior runs.

---

## AC1 — Cart Review

### TC-AC1-001: Happy Path — Cart displays all item details for a single product

**Preconditions:**
- User is logged in as `standard_user`
- Exactly one item ("Sauce Labs Backpack") has been added to the cart

**Steps:**
1. Navigate to `https://www.saucedemo.com` and log in with valid credentials
2. On the inventory page, click **Add to cart** next to "Sauce Labs Backpack"
3. Click the cart icon in the top-right corner
4. Verify the URL is `/cart.html`

**Expected Result:**
- The cart page shows the item "Sauce Labs Backpack"
- Item name is visible and matches the product added
- Item description is visible and non-empty
- Item price is visible in `$XX.XX` format
- Item quantity shows `1`
- The **Continue Shopping** button is visible
- The **Checkout** button is visible

**Test Data:** Username: `standard_user`, Password: `secret_sauce`, Product: "Sauce Labs Backpack"

---

### TC-AC1-002: Happy Path — Cart displays correct details for multiple items

**Preconditions:**
- User is logged in as `standard_user`
- Zero items in cart

**Steps:**
1. Log in with valid credentials
2. Add "Sauce Labs Backpack" to cart
3. Add "Sauce Labs Bike Light" to cart
4. Add "Sauce Labs Bolt T-Shirt" to cart
5. Click the cart icon
6. Verify the URL is `/cart.html`

**Expected Result:**
- All 3 items appear in the cart
- Each item shows: name, description, price, and quantity of `1`
- Cart badge in the header shows `3`
- **Continue Shopping** and **Checkout** buttons are both visible

**Test Data:** Products: "Sauce Labs Backpack", "Sauce Labs Bike Light", "Sauce Labs Bolt T-Shirt"

---

### TC-AC1-003: Navigation — "Continue Shopping" returns to inventory

**Preconditions:**
- User is logged in
- At least one item is in the cart
- User is on the cart page `/cart.html`

**Steps:**
1. Log in and add "Sauce Labs Backpack" to cart
2. Navigate to the cart page
3. Click the **Continue Shopping** button

**Expected Result:**
- User is redirected to the inventory page `/inventory.html`
- All products are visible on the inventory page
- Cart badge still reflects the number of items previously added

**Test Data:** Product: "Sauce Labs Backpack"

---

### TC-AC1-004: Navigation — "Checkout" button navigates to checkout info page

**Preconditions:**
- User is logged in
- At least one item is in the cart
- User is on `/cart.html`

**Steps:**
1. Log in and add "Sauce Labs Fleece Jacket" to cart
2. Navigate to the cart page
3. Click the **Checkout** button

**Expected Result:**
- User is redirected to `/checkout-step-one.html`
- The checkout information form is displayed

**Test Data:** Product: "Sauce Labs Fleece Jacket"

---

### TC-AC1-005: Edge Case — Empty cart displays no items

**Preconditions:**
- User is logged in
- No items have been added to cart

**Steps:**
1. Log in with valid credentials
2. Click the cart icon without adding any items

**Expected Result:**
- The cart page loads at `/cart.html`
- No product rows are displayed in the cart list
- The **Continue Shopping** button is visible
- The **Checkout** button is visible (UI accessible even with empty cart)
- Cart badge is not visible or shows `0`

**Test Data:** No products added

---

### TC-AC1-006: Negative — Cart item removal updates cart correctly

**Preconditions:**
- User is logged in
- Two items are in the cart

**Steps:**
1. Log in and add "Sauce Labs Backpack" and "Sauce Labs Bike Light"
2. Navigate to `/cart.html`
3. Click the **Remove** button next to "Sauce Labs Backpack"

**Expected Result:**
- "Sauce Labs Backpack" is removed from the cart list
- "Sauce Labs Bike Light" remains in the cart
- Cart badge updates to `1`

**Test Data:** Products: "Sauce Labs Backpack", "Sauce Labs Bike Light"

---

## AC2 — Checkout Information Entry

### TC-AC2-001: Happy Path — Valid form submission proceeds to order overview

**Preconditions:**
- User is logged in
- One item is in the cart
- User is on `/checkout-step-one.html`

**Steps:**
1. Log in, add "Sauce Labs Backpack" to cart, click cart icon, click **Checkout**
2. Enter "John" in the **First Name** field
3. Enter "Doe" in the **Last Name** field
4. Enter "12345" in the **Zip/Postal Code** field
5. Click the **Continue** button

**Expected Result:**
- User is redirected to `/checkout-step-two.html`
- No error messages are displayed

**Test Data:** First Name: `John`, Last Name: `Doe`, Zip: `12345`

---

### TC-AC2-002: Negative — Empty First Name shows error message

**Preconditions:**
- User is on `/checkout-step-one.html` with an item in cart

**Steps:**
1. Log in, add one item, proceed to checkout step one
2. Leave **First Name** empty
3. Enter "Doe" in **Last Name**
4. Enter "12345" in **Zip/Postal Code**
5. Click **Continue**

**Expected Result:**
- An error message is displayed: `"Error: First Name is required"`
- User remains on `/checkout-step-one.html`
- User cannot proceed to step two

**Test Data:** First Name: `(empty)`, Last Name: `Doe`, Zip: `12345`

---

### TC-AC2-003: Negative — Empty Last Name shows error message

**Preconditions:**
- User is on `/checkout-step-one.html` with an item in cart

**Steps:**
1. Log in, add one item, proceed to checkout step one
2. Enter "John" in **First Name**
3. Leave **Last Name** empty
4. Enter "12345" in **Zip/Postal Code**
5. Click **Continue**

**Expected Result:**
- An error message is displayed: `"Error: Last Name is required"`
- User remains on `/checkout-step-one.html`

**Test Data:** First Name: `John`, Last Name: `(empty)`, Zip: `12345`

---

### TC-AC2-004: Negative — Empty Zip/Postal Code shows error message

**Preconditions:**
- User is on `/checkout-step-one.html` with an item in cart

**Steps:**
1. Log in, add one item, proceed to checkout step one
2. Enter "John" in **First Name**
3. Enter "Doe" in **Last Name**
4. Leave **Zip/Postal Code** empty
5. Click **Continue**

**Expected Result:**
- An error message is displayed: `"Error: Postal Code is required"`
- User remains on `/checkout-step-one.html`

**Test Data:** First Name: `John`, Last Name: `Doe`, Zip: `(empty)`

---

### TC-AC2-005: Negative — All fields empty shows error message

**Preconditions:**
- User is on `/checkout-step-one.html` with an item in cart

**Steps:**
1. Log in, add one item, proceed to checkout step one
2. Leave all fields (**First Name**, **Last Name**, **Zip**) empty
3. Click **Continue**

**Expected Result:**
- An error message is displayed (at minimum for the first missing field)
- User remains on `/checkout-step-one.html`
- No progression to step two

**Test Data:** All fields: `(empty)`

---

### TC-AC2-006: Navigation — Cancel button returns to cart

**Preconditions:**
- User is on `/checkout-step-one.html` with an item in cart

**Steps:**
1. Log in, add one item, navigate to checkout step one
2. Click the **Cancel** button without filling in any fields

**Expected Result:**
- User is redirected back to `/cart.html`
- The item remains in the cart
- Cart badge still reflects the item count

**Test Data:** Product: "Sauce Labs Backpack"

---

### TC-AC2-007: Edge Case — Form fields accept special characters

**Preconditions:**
- User is on `/checkout-step-one.html` with an item in cart

**Steps:**
1. Log in, add one item, proceed to checkout step one
2. Enter "Jean-Pierre" in **First Name**
3. Enter "O'Brien" in **Last Name**
4. Enter "SW1A 1AA" in **Zip/Postal Code**
5. Click **Continue**

**Expected Result:**
- No client-side validation error for special characters
- User proceeds to `/checkout-step-two.html`

**Test Data:** First Name: `Jean-Pierre`, Last Name: `O'Brien`, Zip: `SW1A 1AA`

---

### TC-AC2-008: Edge Case — Form fields accept numeric-only first/last name

**Preconditions:**
- User is on `/checkout-step-one.html` with an item in cart

**Steps:**
1. Log in, add one item, proceed to checkout step one
2. Enter "123" in **First Name**
3. Enter "456" in **Last Name**
4. Enter "00000" in **Zip/Postal Code**
5. Click **Continue**

**Expected Result:**
- User proceeds to `/checkout-step-two.html` (SauceDemo does not enforce alphabetic-only names)
- No validation error blocks progression

**Test Data:** First Name: `123`, Last Name: `456`, Zip: `00000`

---

## AC3 — Order Overview

### TC-AC3-001: Happy Path — Redirect to /checkout-step-two.html after valid form

**Preconditions:**
- User has completed checkout step one with valid data

**Steps:**
1. Log in, add "Sauce Labs Backpack" to cart
2. Proceed through checkout step one with valid data (John / Doe / 12345)
3. Observe the URL after clicking **Continue**

**Expected Result:**
- URL is `/checkout-step-two.html`
- Page title/header reflects "Checkout: Overview"

**Test Data:** First Name: `John`, Last Name: `Doe`, Zip: `12345`

---

### TC-AC3-002: Verification — All ordered items are displayed in the overview

**Preconditions:**
- User has added 2 items and completed checkout step one

**Steps:**
1. Log in, add "Sauce Labs Backpack" and "Sauce Labs Bike Light"
2. Proceed to checkout step one, fill valid data, click **Continue**
3. On the overview page, inspect the item list

**Expected Result:**
- Both "Sauce Labs Backpack" and "Sauce Labs Bike Light" appear in the order summary
- Each item shows name, description, quantity, and price

**Test Data:** Products: "Sauce Labs Backpack", "Sauce Labs Bike Light"

---

### TC-AC3-003: Verification — Payment information section is displayed

**Preconditions:**
- User is on `/checkout-step-two.html`

**Steps:**
1. Complete steps to reach `/checkout-step-two.html`
2. Locate the **Payment Information** section on the page

**Expected Result:**
- A "Payment Information" label or section is visible
- Payment method detail (e.g., "SauceCard #31337") is shown

**Test Data:** Standard checkout flow

---

### TC-AC3-004: Verification — Shipping information section is displayed

**Preconditions:**
- User is on `/checkout-step-two.html`

**Steps:**
1. Complete steps to reach `/checkout-step-two.html`
2. Locate the **Shipping Information** section on the page

**Expected Result:**
- A "Shipping Information" label or section is visible
- Shipping method detail (e.g., "Free Pony Express Delivery!") is shown

**Test Data:** Standard checkout flow

---

### TC-AC3-005: Verification — Price summary shows subtotal, tax, and total

**Preconditions:**
- User is on `/checkout-step-two.html` with at least one item

**Steps:**
1. Complete steps to reach `/checkout-step-two.html` with "Sauce Labs Backpack" ($29.99)
2. Locate the price summary section

**Expected Result:**
- "Item total" (subtotal) is displayed and equals $29.99
- "Tax" is displayed as a non-zero dollar amount
- "Total" is displayed as subtotal + tax
- All values are in `$XX.XX` format

**Test Data:** Product: "Sauce Labs Backpack" @ $29.99

---

### TC-AC3-006: Navigation — Cancel button from overview returns to inventory

**Preconditions:**
- User is on `/checkout-step-two.html`

**Steps:**
1. Complete steps to reach the overview page
2. Click the **Cancel** button

**Expected Result:**
- User is redirected to the inventory page `/inventory.html`
- Cart badge still reflects items that were in the cart

**Test Data:** Standard checkout flow

---

### TC-AC3-007: Navigation — Finish button proceeds to completion page

**Preconditions:**
- User is on `/checkout-step-two.html`

**Steps:**
1. Complete steps to reach the overview page
2. Click the **Finish** button

**Expected Result:**
- User is redirected to `/checkout-complete.html`
- No error is shown

**Test Data:** Standard checkout flow

---

### TC-AC3-008: Edge Case — Total price correct for multiple items

**Preconditions:**
- User is on `/checkout-step-two.html` with multiple items

**Steps:**
1. Add "Sauce Labs Backpack" ($29.99) and "Sauce Labs Bike Light" ($9.99) to cart
2. Complete checkout step one with valid data
3. On overview page, verify the item total

**Expected Result:**
- Item total displayed as `$39.98` ($29.99 + $9.99)
- Tax amount is > $0.00
- Grand total = item total + tax

**Test Data:** "Sauce Labs Backpack" $29.99, "Sauce Labs Bike Light" $9.99

---

## AC4 — Order Completion

### TC-AC4-001: Happy Path — Redirect to /checkout-complete.html after Finish

**Preconditions:**
- User has completed the full checkout flow

**Steps:**
1. Log in, add one item, complete checkout step one, arrive at step two
2. Click **Finish** on the overview page
3. Observe the URL

**Expected Result:**
- URL is `/checkout-complete.html`

**Test Data:** Standard checkout flow

---

### TC-AC4-002: Verification — Success message is displayed on completion page

**Preconditions:**
- User is on `/checkout-complete.html`

**Steps:**
1. Complete the full checkout flow and land on the completion page
2. Inspect the page content for a success/confirmation message

**Expected Result:**
- A success header is visible: "Thank you for your order!"
- A secondary message is visible: "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
- A confirmation graphic/icon is present

**Test Data:** Standard checkout flow

---

### TC-AC4-003: Navigation — "Back Home" button returns to inventory

**Preconditions:**
- User is on `/checkout-complete.html`

**Steps:**
1. Complete the full checkout flow
2. Click the **Back Home** button

**Expected Result:**
- User is redirected to `/inventory.html`
- All products are visible on the inventory page

**Test Data:** Standard checkout flow

---

### TC-AC4-004: Verification — Cart is cleared after order completion

**Preconditions:**
- User has just completed an order and is on `/checkout-complete.html`

**Steps:**
1. Complete the full checkout flow with 2 items
2. After landing on `/checkout-complete.html`, observe the cart icon in the header
3. Click **Back Home** and observe the cart badge on inventory page

**Expected Result:**
- Cart badge is no longer visible (or shows 0) on the completion page
- After clicking **Back Home**, the inventory page shows no cart badge
- Navigating to `/cart.html` shows an empty cart

**Test Data:** 2 products added before checkout

---

### TC-AC4-005: Edge Case — Navigating back from completion page does not re-submit order

**Preconditions:**
- User is on `/checkout-complete.html` after completing an order

**Steps:**
1. Complete the full checkout flow
2. Use the browser back button to navigate to `/checkout-step-two.html`
3. Observe page state

**Expected Result:**
- Either the user is redirected away (back to inventory or cart) OR the overview page is shown but the cart is empty
- No duplicate order is placed
- No application crash or blank page

**Test Data:** Standard checkout flow

---

## AC5 — Error Handling & Validation

### TC-AC5-001: Validation — Error clears when user corrects First Name

**Preconditions:**
- User is on `/checkout-step-one.html`

**Steps:**
1. Log in, add one item, proceed to checkout step one
2. Leave **First Name** empty; fill **Last Name** and **Zip** with valid data
3. Click **Continue** — observe error message
4. Enter "Jane" in **First Name**
5. Click **Continue** again

**Expected Result:**
- After step 3: error `"Error: First Name is required"` is displayed
- After step 5: error message disappears and user is redirected to `/checkout-step-two.html`

**Test Data:** First Name correction: `Jane`, Last Name: `Doe`, Zip: `12345`

---

### TC-AC5-002: Validation — Error icon/indicator shown on the form

**Preconditions:**
- User is on `/checkout-step-one.html`

**Steps:**
1. Log in, add one item, proceed to checkout step one
2. Leave all fields empty and click **Continue**
3. Observe the form for visual error indicators

**Expected Result:**
- An error container or alert is rendered on the page
- An error close/dismiss button (✕) is visible within the error container

**Test Data:** All fields empty

---

### TC-AC5-003: Validation — Error message can be dismissed

**Preconditions:**
- An error message is currently displayed on `/checkout-step-one.html`

**Steps:**
1. Log in, add one item, proceed to checkout step one
2. Leave **First Name** empty and click **Continue**
3. Click the close button (✕) inside the error message container

**Expected Result:**
- The error message disappears from the page
- The form fields remain editable
- User can still submit the form

**Test Data:** First Name: `(empty)`

---

### TC-AC5-004: Validation — Cannot proceed to step two without passing validation

**Preconditions:**
- User is on `/checkout-step-one.html`

**Steps:**
1. Log in, add one item, proceed to checkout step one
2. Attempt to navigate directly to `/checkout-step-two.html` without filling the form
3. Also attempt clicking **Continue** with each individual field empty

**Expected Result:**
- Direct URL navigation to `/checkout-step-two.html` without completing step one either redirects the user or shows an empty/broken state
- Clicking **Continue** with any required field empty keeps the user on step one with an error

**Test Data:** Empty form fields

---

### TC-AC5-005: Boundary — Very long strings in form fields

**Preconditions:**
- User is on `/checkout-step-one.html`

**Steps:**
1. Log in, add one item, proceed to checkout step one
2. Enter a 255-character string in **First Name**
3. Enter a 255-character string in **Last Name**
4. Enter a 255-character string in **Zip/Postal Code**
5. Click **Continue**

**Expected Result:**
- No application crash or JavaScript error
- Either the user proceeds to step two OR a validation message is shown about field length limits
- Page remains functional

**Test Data:** 255-character alphanumeric strings in all fields

---

### TC-AC5-006: Boundary — Whitespace-only values treated as empty

**Preconditions:**
- User is on `/checkout-step-one.html`

**Steps:**
1. Log in, add one item, proceed to checkout step one
2. Enter `"   "` (three spaces) in **First Name**
3. Enter `"   "` in **Last Name**
4. Enter `"   "` in **Zip/Postal Code**
5. Click **Continue**

**Expected Result:**
- Validation treats whitespace-only values as empty
- An error message is shown for the first required field
- User cannot proceed to step two with whitespace-only inputs

**Test Data:** All fields contain spaces only: `"   "`

---

## Cross-Browser Testing

| Browser | Playwright Project Name | Device Profile |
|---|---|---|
| Google Chrome | `chromium` | Desktop Chrome |
| Mozilla Firefox | `firefox` | Desktop Firefox |
| Apple Safari | `webkit` | Desktop Safari |

### TC-XBROWSER-001: Full checkout flow on Chromium
Execute TC-AC1-001 → TC-AC2-001 → TC-AC3-005 → TC-AC4-002 end-to-end on Chromium  
**Expected Result:** Full checkout completes successfully with correct success message

### TC-XBROWSER-002: Full checkout flow on Firefox
Execute TC-AC1-001 → TC-AC2-001 → TC-AC3-005 → TC-AC4-002 end-to-end on Firefox  
**Expected Result:** Full checkout completes successfully with correct success message

### TC-XBROWSER-003: Full checkout flow on WebKit (Safari)
Execute TC-AC1-001 → TC-AC2-001 → TC-AC3-005 → TC-AC4-002 end-to-end on WebKit  
**Expected Result:** Full checkout completes successfully with correct success message

### TC-XBROWSER-004: Form validation errors render correctly across all browsers
Execute TC-AC2-002 on Chromium, Firefox, and WebKit  
**Expected Result:** Error messages are visible and correctly styled on all three browsers

### TC-XBROWSER-005: Cart state persists within session across all browsers
Execute TC-AC1-002 on Chromium, Firefox, and WebKit  
**Expected Result:** Cart badge accurately reflects item count on all three browsers

---

## Test Summary

| Acceptance Criteria | Test Cases | Happy Path | Negative | Edge Case | Navigation |
|---|---|---|---|---|---|
| AC1 — Cart Review | 6 | TC-AC1-001, TC-AC1-002 | TC-AC1-006 | TC-AC1-005 | TC-AC1-003, TC-AC1-004 |
| AC2 — Checkout Info Entry | 8 | TC-AC2-001 | TC-AC2-002, TC-AC2-003, TC-AC2-004, TC-AC2-005 | TC-AC2-007, TC-AC2-008 | TC-AC2-006 |
| AC3 — Order Overview | 8 | TC-AC3-001 | — | TC-AC3-008 | TC-AC3-006, TC-AC3-007 |
| AC4 — Order Completion | 5 | TC-AC4-001, TC-AC4-002 | — | TC-AC4-005 | TC-AC4-003, TC-AC4-004 |
| AC5 — Error Handling | 6 | — | TC-AC5-001, TC-AC5-002, TC-AC5-003, TC-AC5-004 | TC-AC5-005, TC-AC5-006 | — |
| Cross-Browser | 5 | TC-XBROWSER-001 through 005 | — | — | — |
| **Total** | **38** | | | | |

---
*Test plan authored for SCRUM-101. All test IDs follow the format `TC-<AC>-<NNN>`. Each test assumes a fresh browser state unless stated otherwise.*
