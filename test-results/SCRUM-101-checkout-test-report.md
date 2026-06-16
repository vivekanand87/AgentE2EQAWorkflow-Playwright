# Test Execution Report — SCRUM-101: E-commerce Checkout Process

**Report Date:** 2026-06-16  
**User Story:** SCRUM-101 — E-commerce Checkout Process  
**Application:** https://www.saucedemo.com  
**Tester:** Automated QA Workflow (GitHub Copilot + Playwright MCP)  
**Environment:** Windows, Node.js ≥18, Playwright 1.60.0

---

## 1. Executive Summary

| Metric | Value |
|---|---|
| Total test cases planned | 38 (test plan) + 1 E2E = **39** |
| Total automated test scripts | **23** (across 5 describe suites) |
| Total executions (3 browsers) | **69** |
| Overall result | ✅ **ALL PASSED** |
| Failures | 0 |
| Blocked | 0 |
| Healing required | None |
| Browsers tested | Chromium, Firefox, WebKit (Safari) |
| Total execution time | ~80 seconds (39s Chromium + 41s Firefox+WebKit) |

---

## 2. Manual Exploratory Testing Results (Step 3)

Exploratory testing was performed using the Playwright MCP browser tools against https://www.saucedemo.com.

### Sessions Executed

| Session | URL reached | Outcome |
|---|---|---|
| Login with `standard_user` / `secret_sauce` | `/inventory.html` | ✅ PASS |
| Add 2 items to cart (Backpack + Bike Light) | `/inventory.html` | ✅ PASS |
| Cart review (items, QTY, price, buttons) | `/cart.html` | ✅ PASS |
| Empty form submit → validation error | `/checkout-step-one.html` | ✅ PASS — Error: "First Name is required" |
| Error dismiss (✕ button) | `/checkout-step-one.html` | ✅ PASS — error disappears |
| Valid form fill + Continue | `/checkout-step-two.html` | ✅ PASS |
| Overview: payment/shipping/prices | `/checkout-step-two.html` | ✅ PASS |
| Click Finish | `/checkout-complete.html` | ✅ PASS — "Thank you for your order!" |
| Click Back Home | `/inventory.html` | ✅ PASS — cart badge gone |

### Key Observations from Exploratory Testing

1. **Error message selector:** `h3[data-test="error"]` — rendered as a heading element, not inline text
2. **Error dismiss button:** `.error-button` — visible within the error container with ✕ icon
3. **Cart badge:** `.shopping_cart_badge` — disappears when cart is empty (not visible, not 0)
4. **Payment info:** Fixed value "SauceCard #31337" — not user-entered
5. **Shipping info:** Fixed value "Free Pony Express Delivery!"
6. **Price calculation:** Backpack $29.99 + Bike Light $9.99 = Item total $39.98; Tax $3.20; Grand total $43.18
7. **Cart item locator:** `.cart_item` — each cart row; `.inventory_item_name` for name
8. **Cancel on overview** redirects to `/inventory.html`, not `/cart.html`
9. **No text content** was present in the Word document — all steps were embedded as screenshots

### Issues Found During Exploration

| ID | Severity | Description | Status |
|---|---|---|---|
| — | — | No defects found during exploratory testing | — |

---

## 3. Automated Test Results

### 3.1 Test Suite Summary

#### SCRUM-101: AC1 — Cart Review (6 tests)

| Test ID | Test Name | Chromium | Firefox | WebKit |
|---|---|---|---|---|
| TC-AC1-001 | should display single item with name, description, price, qty, and both buttons | ✅ | ✅ | ✅ |
| TC-AC1-002 | should display multiple items with correct count in cart badge | ✅ | ✅ | ✅ |
| TC-AC1-003 | should navigate back to inventory when Continue Shopping is clicked | ✅ | ✅ | ✅ |
| TC-AC1-004 | should navigate to checkout step one when Checkout is clicked | ✅ | ✅ | ✅ |
| TC-AC1-005 | should show empty cart when no items were added | ✅ | ✅ | ✅ |
| TC-AC1-006 | should remove an item from cart and update badge count | ✅ | ✅ | ✅ |

#### SCRUM-101: AC2 — Checkout Information Entry (7 tests)

| Test ID | Test Name | Chromium | Firefox | WebKit |
|---|---|---|---|---|
| TC-AC2-001 | should proceed to order overview with valid form data | ✅ | ✅ | ✅ |
| TC-AC2-002 | should show error when First Name is empty | ✅ | ✅ | ✅ |
| TC-AC2-003 | should show error when Last Name is empty | ✅ | ✅ | ✅ |
| TC-AC2-004 | should show error when Zip/Postal Code is empty | ✅ | ✅ | ✅ |
| TC-AC2-005 | should show error when all fields are empty | ✅ | ✅ | ✅ |
| TC-AC2-006 | should return to cart when Cancel is clicked | ✅ | ✅ | ✅ |
| TC-AC5-003 | should dismiss error message when close button is clicked | ✅ | ✅ | ✅ |

#### SCRUM-101: AC3 — Order Overview (5 tests)

| Test ID | Test Name | Chromium | Firefox | WebKit |
|---|---|---|---|---|
| TC-AC3-002 | should display all ordered items in the overview | ✅ | ✅ | ✅ |
| TC-AC3-003 | should display payment information | ✅ | ✅ | ✅ |
| TC-AC3-004 | should display shipping information | ✅ | ✅ | ✅ |
| TC-AC3-005 | should display correct subtotal, tax, and total price | ✅ | ✅ | ✅ |
| TC-AC3-006 | should navigate to inventory when Cancel is clicked from overview | ✅ | ✅ | ✅ |

#### SCRUM-101: AC4 — Order Completion (4 tests)

| Test ID | Test Name | Chromium | Firefox | WebKit |
|---|---|---|---|---|
| TC-AC4-001 | should redirect to checkout-complete.html after clicking Finish | ✅ | ✅ | ✅ |
| TC-AC4-002 | should display success message on completion page | ✅ | ✅ | ✅ |
| TC-AC4-003 | should navigate to inventory when Back Home is clicked | ✅ | ✅ | ✅ |
| TC-AC4-004 | should clear the cart after order completion | ✅ | ✅ | ✅ |

#### SCRUM-101: Full End-to-End Happy Path (1 test)

| Test Name | Chromium | Firefox | WebKit |
|---|---|---|---|
| should complete the full checkout flow from login to order confirmation | ✅ | ✅ | ✅ |

### 3.2 Execution Summary by Browser

| Browser | Tests Run | Passed | Failed | Duration |
|---|---|---|---|---|
| Chromium | 23 | **23** | 0 | ~39s |
| Firefox | 23 | **23** | 0 | ~21s |
| WebKit | 23 | **23** | 0 | ~20s |
| **Total** | **69** | **69** | **0** | **~80s** |

### 3.3 Healing Activities

No test healing was required. All scripts passed on first execution across all three browsers.

---

## 4. Defects Log

| Bug ID | Severity | Title | Steps to Reproduce | Expected | Actual | Status |
|---|---|---|---|---|---|---|
| — | — | No defects found | — | — | — | — |

All acceptance criteria passed without defects.

---

## 5. Test Coverage Analysis

### Acceptance Criteria Coverage

| Acceptance Criterion | Covered | Manual | Automated | Notes |
|---|---|---|---|---|
| AC1: Cart Review | ✅ 100% | ✅ Yes | ✅ 6 tests | All 6 TCs automated and passing |
| AC2: Checkout Information Entry | ✅ 100% | ✅ Yes | ✅ 7 tests | All validation scenarios covered |
| AC3: Order Overview | ✅ 100% | ✅ Yes | ✅ 5 tests | Payment, shipping, prices verified |
| AC4: Order Completion | ✅ 100% | ✅ Yes | ✅ 4 tests | Success msg, cart clear, Back Home |
| AC5: Error Handling | ✅ 80% | ✅ Yes | ✅ 5 tests | Dismiss test included; boundary tests (255-char, whitespace) not automated |
| Cross-Browser | ✅ 100% | — | ✅ 69 runs | Chromium, Firefox, WebKit all green |

### Coverage Gaps & Recommendations

| Gap | Recommendation | Priority |
|---|---|---|
| TC-AC5-005: Very long strings (255 chars) | Add boundary test for field length limits | Low |
| TC-AC5-006: Whitespace-only inputs | Add test for spaces-only form submission | Medium |
| TC-AC4-005: Back button after completion | Add test verifying no duplicate order | Low |
| TC-AC2-007/008: Special chars / numeric names | Add edge case tests for these input types | Low |
| Mobile viewport testing | Add mobile viewport tests using `devices['Pixel 5']` | Medium |

---

## 6. Summary and Recommendations

### Overall Quality Assessment: ✅ EXCELLENT

The SauceDemo checkout workflow fully satisfies all 5 acceptance criteria defined in SCRUM-101. The application is stable, performs consistently across all three browser engines, and all validation, navigation, and completion flows work as expected.

### Risk Areas

| Risk | Level | Notes |
|---|---|---|
| External service dependency | Low | App hosted externally; tests rely on network availability |
| Price calculation | Low | Tax is a fixed percentage — confirmed stable |
| Selector stability | Low | `data-test` attributes are used — highly stable |

### Next Steps

1. Add boundary and whitespace-only validation tests (AC5 gaps)
2. Enable mobile viewport projects in `playwright.config.ts`
3. Add `storageState` auth caching to speed up test runs
4. Integrate into CI/CD pipeline with `process.env.CI` guards already in config
5. Schedule nightly regression runs against the live application

---

## 7. Artifacts

| Artifact | Location |
|---|---|
| User Story | `.vscode/user-stories/SCRUM-101-ecommerce-checkout.md` |
| QA Prompt File | `.vscode/user-stories/QAE2EPromptFile.md` |
| Test Plan (38 TCs) | `specs/saucedemo-checkout-test-plan.md` |
| Automation Script (22 tests) | `tests/saucedemo-checkout.spec.ts` |
| Test Report | `test-results/SCRUM-101-checkout-test-report.md` |

---
*Report generated by the End-to-End QA Workflow defined in QAE2EPromptFile.md — SCRUM-101*
