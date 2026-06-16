import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';

async function login(page: Page): Promise<void> {
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await page.waitForURL('**/inventory.html');
}

async function addItemToCart(page: Page, slug: string): Promise<void> {
  await page.click(`[data-test="add-to-cart-${slug}"]`);
}

test.describe('SCRUM-101: AC1 — Cart Review', () => {
  test('should display single item with name, description, price, qty, and both buttons', async ({ page }) => {
    await login(page);
    await addItemToCart(page, 'sauce-labs-backpack');
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL(/\/cart\.html/);

    await expect(page.locator('.inventory_item_name')).toContainText('Sauce Labs Backpack');

    const description = page.locator('.inventory_item_desc');
    await expect(description).toBeVisible();
    const descText = await description.textContent();
    expect(descText?.trim().length).toBeGreaterThan(0);

    await expect(page.locator('.inventory_item_price')).toContainText('$');
    await expect(page.locator('.cart_quantity')).toHaveText('1');
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });

  test('should display multiple items with correct count in cart badge', async ({ page }) => {
    await login(page);
    await addItemToCart(page, 'sauce-labs-backpack');
    await addItemToCart(page, 'sauce-labs-bike-light');
    await addItemToCart(page, 'sauce-labs-bolt-t-shirt');

    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');

    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL(/\/cart\.html/);
    await expect(page.locator('.cart_item')).toHaveCount(3);
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });

  test('should navigate back to inventory when Continue Shopping is clicked', async ({ page }) => {
    await login(page);
    await addItemToCart(page, 'sauce-labs-backpack');
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL(/\/cart\.html/);
    await page.click('[data-test="continue-shopping"]');
    await expect(page).toHaveURL(/\/inventory\.html/);
  });

  test('should navigate to checkout step one when Checkout is clicked', async ({ page }) => {
    await login(page);
    await addItemToCart(page, 'sauce-labs-backpack');
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL(/\/cart\.html/);
    await page.click('[data-test="checkout"]');
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
  });

  test('should show empty cart when no items were added', async ({ page }) => {
    await login(page);
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL(/\/cart\.html/);
    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('should remove an item from cart and update badge count', async ({ page }) => {
    await login(page);
    await addItemToCart(page, 'sauce-labs-backpack');
    await addItemToCart(page, 'sauce-labs-bike-light');
    await page.click('.shopping_cart_link');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    await page.click('[data-test="remove-sauce-labs-backpack"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).not.toContainText('Sauce Labs Backpack');
  });
});

test.describe('SCRUM-101: AC2 — Checkout Information Entry', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await addItemToCart(page, 'sauce-labs-backpack');
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
  });

  test('should proceed to order overview with valid form data', async ({ page }) => {
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');
    await expect(page).toHaveURL(/\/checkout-step-two\.html/);
  });

  test('should show error when First Name is empty', async ({ page }) => {
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');
    await expect(page.locator('h3[data-test="error"]')).toBeVisible();
    await expect(page.locator('h3[data-test="error"]')).toContainText('First Name is required');
  });

  test('should show error when Last Name is empty', async ({ page }) => {
    await page.fill('#first-name', 'John');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');
    await expect(page.locator('h3[data-test="error"]')).toBeVisible();
    await expect(page.locator('h3[data-test="error"]')).toContainText('Last Name is required');
  });

  test('should show error when Zip/Postal Code is empty', async ({ page }) => {
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.click('#continue');
    await expect(page.locator('h3[data-test="error"]')).toBeVisible();
    await expect(page.locator('h3[data-test="error"]')).toContainText('Postal Code is required');
  });

  test('should show error when all fields are empty', async ({ page }) => {
    await page.click('#continue');
    await expect(page.locator('h3[data-test="error"]')).toBeVisible();
    await expect(page.locator('h3[data-test="error"]')).toContainText('First Name is required');
  });

  test('should return to cart when Cancel is clicked', async ({ page }) => {
    await page.click('#cancel');
    await expect(page).toHaveURL(/\/cart\.html/);
  });

  test('should dismiss error message when close button is clicked', async ({ page }) => {
    await page.click('#continue');
    await expect(page.locator('h3[data-test="error"]')).toBeVisible();
    await page.click('.error-button');
    await expect(page.locator('h3[data-test="error"]')).not.toBeVisible();
  });
});

test.describe('SCRUM-101: AC3 — Order Overview', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await addItemToCart(page, 'sauce-labs-backpack');
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');
    await expect(page).toHaveURL(/\/checkout-step-two\.html/);
  });

  test('should display all ordered items in the overview', async ({ page }) => {
    await expect(page.locator('.inventory_item_name')).toContainText('Sauce Labs Backpack');
  });

  test('should display payment information', async ({ page }) => {
    await expect(page.locator('.summary_value_label').first()).toContainText('SauceCard #31337');
  });

  test('should display shipping information', async ({ page }) => {
    await expect(page.locator('.summary_value_label').nth(1)).toContainText('Free Pony Express Delivery!');
  });

  test('should display correct subtotal, tax, and total price', async ({ page }) => {
    await expect(page.locator('.summary_subtotal_label')).toContainText('$29.99');
    await expect(page.locator('.summary_tax_label')).toContainText('Tax: $');
    await expect(page.locator('.summary_total_label')).toContainText('Total: $');
  });

  test('should navigate to inventory when Cancel is clicked from overview', async ({ page }) => {
    await page.click('#cancel');
    await expect(page).toHaveURL(/\/inventory\.html/);
  });
});

test.describe('SCRUM-101: AC4 — Order Completion', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await addItemToCart(page, 'sauce-labs-backpack');
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');
    await expect(page).toHaveURL(/\/checkout-step-two\.html/);
  });

  test('should redirect to checkout-complete.html after clicking Finish', async ({ page }) => {
    await page.click('[data-test="finish"]');
    await expect(page).toHaveURL(/\/checkout-complete\.html/);
  });

  test('should display success message on completion page', async ({ page }) => {
    await page.click('[data-test="finish"]');
    await expect(page.locator('h2.complete-header')).toHaveText('Thank you for your order!');
  });

  test('should navigate to inventory when Back Home is clicked', async ({ page }) => {
    await page.click('[data-test="finish"]');
    await page.click('[data-test="back-to-products"]');
    await expect(page).toHaveURL(/\/inventory\.html/);
  });

  test('should clear the cart after order completion', async ({ page }) => {
    await page.click('[data-test="finish"]');
    await expect(page).toHaveURL(/\/checkout-complete\.html/);
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });
});

test.describe('SCRUM-101: Full End-to-End Happy Path', () => {
  test('should complete the full checkout flow from login to order confirmation', async ({ page }) => {
    // Step 1: Login
    await page.goto(BASE_URL);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/\/inventory\.html/);

    // Step 2: Add two products to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // Step 3: Verify cart contents
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL(/\/cart\.html/);
    await expect(page.locator('.cart_item')).toHaveCount(2);

    // Step 4: Proceed to checkout info
    await page.click('[data-test="checkout"]');
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);

    // Step 5: Fill checkout form
    await page.fill('#first-name', 'Jane');
    await page.fill('#last-name', 'Smith');
    await page.fill('#postal-code', '90210');
    await page.click('#continue');

    // Step 6: Verify order overview
    await expect(page).toHaveURL(/\/checkout-step-two\.html/);
    await expect(page.locator('.inventory_item_name').first()).toBeVisible();
    await expect(page.locator('.summary_value_label').first()).toContainText('SauceCard #31337');
    await expect(page.locator('.summary_value_label').nth(1)).toContainText('Free Pony Express Delivery!');
    await expect(page.locator('.summary_subtotal_label')).toContainText('$');
    await expect(page.locator('.summary_tax_label')).toContainText('Tax: $');
    await expect(page.locator('.summary_total_label')).toContainText('Total: $');

    // Step 7: Finish order
    await page.click('[data-test="finish"]');
    await expect(page).toHaveURL(/\/checkout-complete\.html/);

    // Step 8: Verify success and cleared cart
    await expect(page.locator('h2.complete-header')).toHaveText('Thank you for your order!');
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();

    // Step 9: Return to inventory
    await page.click('[data-test="back-to-products"]');
    await expect(page).toHaveURL(/\/inventory\.html/);
  });
});
