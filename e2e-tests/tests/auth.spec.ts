import test, { test as setup, expect } from '@playwright/test';

setup('user sign in', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('http://localhost:5173/sign-in');

  await page.locator('input[name="email"]').fill('admin@gmail.com');
  await page.locator('input[name="password"]').fill('123456');

  await page.getByRole('button', { name: 'Sign In' }).click();

  await page.waitForURL('http://localhost:5173/');
  await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
});

test('user register', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.

  const testEmail = `test_register_${Math.trunc(
    Math.random() * 10000,
  )}@gmail.com`;

  await page.goto('http://localhost:5173/register');

  await page.locator('[name=firstName]').fill('test_firstName');
  await page.locator('[name=lastName]').fill('test_lastName');
  await page.locator('[name=email]').fill(testEmail);
  await page.locator('[name=password]').fill('123456');
  await page.locator('[name=passwordConfirm]').fill('123456');

  await page.getByRole('button', { name: 'Create Account' }).click();

  await page.waitForURL('http://localhost:5173/');

  await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
});
