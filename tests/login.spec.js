import { test, expect } from '@playwright/test';

// Maktaba (Dawate Islami ERP) — Login Test Suite
// 4 Test Cases: 1 Positive, 3 Negative
//End To End Login Script

const URL            = 'https://training-maktaba.dibaadm.com/';
const VALID_USERNAME = 'farazahmed';
const VALID_PASSWORD = 'Welcome@1';
const WRONG_PASSWORD = 'WrongPass@999';
const WRONG_USERNAME = 'unknownuser';


// ══════════════════════════════════════════════
//  TC-01 | Valid login — Dashboard should open
// ══════════════════════════════════════════════
test('TC-01 | Valid credentials login and Dashboard', async ({ browser }) => {
  test.setTimeout(90000); // for this test wait

  // Open a fresh browser session
  const context = await browser.newContext();
  const page    = await context.newPage();

  // Go to login page
  await page.goto(URL);
  await page.waitForTimeout(2000);

  // Enter username and password
  await page.fill('input[name="username"]', VALID_USERNAME);
  await page.fill('input[name="password"]', VALID_PASSWORD);

  // Click Login button
  await page.click('button[type="submit"]');

  // App processes login before redirecting
  await page.waitForTimeout(5000);

  // Wait until browser lands on Dashboard **/ wildcard for till then in Dashboard page
  await page.waitForURL('**/Dashboard', { timeout: 20000 });

  // Confirm URL has Dashboard in it
  await expect(page).toHaveURL(/Dashboard/);

  // Keep Dashboard visible for 30 seconds
  await page.waitForTimeout(30000);

  // Close session
  await context.close();

});


// ══════════════════════════════════════════════
//  TC-02 | Wrong password — Login should fail
// ══════════════════════════════════════════════
test('TC-02 | Wrong password should fail and stay on login page', async ({ browser }) => {

  const context = await browser.newContext();
  const page    = await context.newPage();

  // Go to login page
  await page.goto(URL);
  await page.waitForTimeout(2000);

  // Enter correct username but wrong password
  await page.fill('input[name="username"]', VALID_USERNAME);
  await page.fill('input[name="password"]', WRONG_PASSWORD);

  // Click Login button
  await page.click('button[type="submit"]');

  // Wait for server to respond
  await page.waitForTimeout(3000);

  // User should still be on login page
  await expect(page).toHaveURL(/Authentication/);

  // User should NOT reach Dashboard — login clearly failed
  await expect(page).not.toHaveURL(/Dashboard/);

  await context.close();

});


// ══════════════════════════════════════════════
//  TC-03 | Wrong username — Login should fail
// ══════════════════════════════════════════════
test('TC-03 | Wrong username should fail and stay on login page', async ({ browser }) => {

  const context = await browser.newContext();
  const page    = await context.newPage();

  // Go to login page
  await page.goto(URL);
  await page.waitForTimeout(2000);

  // Enter wrong username but correct password
  await page.fill('input[name="username"]', WRONG_USERNAME);
  await page.fill('input[name="password"]', VALID_PASSWORD);

  // Click Login button
  await page.click('button[type="submit"]');

  // Wait for server to respond
  await page.waitForTimeout(3000);

  // User should still be on login page
  await expect(page).toHaveURL(/Authentication/);

  // User should NOT reach Dashboard — login clearly failed
  await expect(page).not.toHaveURL(/Dashboard/);

  await context.close();

});


// ══════════════════════════════════════════════
//  TC-04 | Empty form — Login should not proceed
// ══════════════════════════════════════════════
test('TC-04 | Empty form submit should stay on login page', async ({ browser }) => {

  const context = await browser.newContext();
  const page    = await context.newPage();

  // Go to login page
  await page.goto(URL);
  await page.waitForTimeout(2000);

  // Click Login without filling any fields
  await page.click('button[type="submit"]');

  // Wait briefly
  await page.waitForTimeout(2000);

  // User should NOT reach Dashboard — empty form cannot login
  await expect(page).not.toHaveURL(/Dashboard/);

  await context.close();

});
