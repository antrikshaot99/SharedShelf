import { test, expect } from '@playwright/test';

test('Login page functional test', async ({ page }) => {

  await page.goto('http://localhost:5173/login');

  // Verify heading
  await expect(
    page.getByRole('heading', { name: 'Sign in' })
  ).toBeVisible();

  // Fill email
  await page
    .getByPlaceholder('you@example.com')
    .fill('admin@gmail.com');

  // Fill password
  await page
    .getByPlaceholder('Enter your password')
    .fill('admin123');

  // Verify button
  await expect(
    page.getByRole('button', { name: 'Sign In' })
  ).toBeVisible();

  // Click login
  await page
    .getByRole('button', { name: 'Sign In' })
    .click();

});