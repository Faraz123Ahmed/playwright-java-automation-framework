import { test, expect } from '@playwright/test';

const URL    = 'https://training-maktaba.dibaadm.com/';
const PR_URL = URL + 'Purchase_RequisitionMaster/';

const VALID_USERNAME = 'farazahmed';
const VALID_PASSWORD = 'Welcome@1';

test('TC-01 | Purchase Requisition - Add New + Select Item', async ({ browser }) => {
  test.setTimeout(120000);

  const context = await browser.newContext();
  const page    = await context.newPage();

  // ── Step 1: Login ──────────────────────────────────────────────────────────
  await page.goto(URL);
  await page.fill('input[name="username"]', VALID_USERNAME);
  await page.fill('input[name="password"]', VALID_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/Dashboard', { timeout: 30000 });
  await expect(page).toHaveURL(/Dashboard/);

  // ── Step 2: Search then goto PR page ──────────────────────────────────────
  await page.fill('#usersearch', 'Purchase Requisition');
  await page.waitForTimeout(1500);
  await page.goto(PR_URL);
  await page.waitForURL('**/Purchase_RequisitionMaster/', { timeout: 20000 });
  await expect(page).toHaveURL(/Purchase_RequisitionMaster/);

  // ── Step 3: Open Add Form ─────────────────────────────────────────────────
  await page.goto(PR_URL + 'add');
  await page.waitForLoadState('networkidle', { timeout: 20000 });
  await expect(page).toHaveURL(/Purchase_RequisitionMaster\/add/);

  // ── Step 4: Fill Master Form Fields ───────────────────────────────────────
  await page.click('a[href="#manual"]');
  await page.waitForTimeout(2000);

  await page.selectOption('select[name="doctype"]', { label: 'Purchase Requistion - PAPER' });
  await page.selectOption('select[name="locators_code"]', { label: 'Ilmiyah Shop' });
  await page.fill('#narration', 'test');

  // ── Step 5: Click Item Description Popup Button ───────────────────────────
  await page.waitForSelector('button#itm_desc_popup_btn1', { timeout: 10000 });
  await page.click('button#itm_desc_popup_btn1');
  await page.waitForTimeout(2000);

  // ── Step 6: Wait for Modal ────────────────────────────────────────────────
  const modal = page.locator('#modalpop_getitems');
  await expect(modal).toBeVisible({ timeout: 15000 });

  // ── Step 7: Search for Item ───────────────────────────────────────────────
  await page.fill('#modalpop_getitems input[placeholder="Search Item Description"]', 'sunnah ki testing');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);

  // ── Step 8: Select correct item by matching text ──────────────────────────
  const itemRow = page.locator('#modalpop_getitems tr', { hasText: 'sunnah ki testing' });
  await expect(itemRow).toBeVisible({ timeout: 5000 });
  await itemRow.locator('input.model_item').click();
  await page.waitForTimeout(1500);

  // ── Step 9: Click Modal Process Button ────────────────────────────────────
  await page.click('#modalpop_getitems button:has-text("Process")');
  await page.waitForTimeout(3000);

  // ── Step 10: Confirm Modal Closed ─────────────────────────────────────────
  await expect(modal).not.toBeVisible({ timeout: 20000 });

  // ── Step 11: Fill QTY 1 (triple click to clear default value then type) ───
  const qtyField = page.locator('input[name="nameGroup_1[qty1]"]');
  
  // Select existing value (0.000)
  await qtyField.press('Control+A');

  // Replace with new value
  await qtyField.type('5');

  // Trigger blur / keyup event
  await qtyField.press('Tab');

  await page.waitForTimeout(1500);
  

  // ── Step 12: Fill Row Narration ───────────────────────────────────────────
  await page.fill('textarea[name="nameGroup_1[rqd_narration]"]', 'test');
  await page.waitForTimeout(1000);

  // ── Step 13: Click Final Process Button ───────────────────────────────────
  await page.locator('button.btn_submit').click();

  // ── Step 14: Wait for redirect to List page ───────────────────────────────
  await page.waitForURL('**/Purchase_RequisitionMaster/', { timeout: 30000 });
  await expect(page).toHaveURL(/Purchase_RequisitionMaster/);

  await context.close();
});

// ── Toggle Switches ───────────────────────────────────────────────────────
// Set both to true to run both scenarios together.
// Set one to false to run only the other — no need to comment out code.
const RUN_QTY_ZERO_CHECK  = true;   // QTY = 0 -> red mark validation
const RUN_QTY_EMPTY_CHECK = false;    // QTY = empty (default after item select) -> red mark validation

test('TC-01-NEG | Purchase Requisition - Negative Scenario (QTY=0 Red Mark + Empty QTY Required Field Check)', async ({ browser }) => {
  test.setTimeout(120000);

  const context = await browser.newContext();
  const page    = await context.newPage();

  // ── Step 1: Login ──────────────────────────────────────────────────────────
  await page.goto(URL);
  await page.fill('input[name="username"]', VALID_USERNAME);
  await page.fill('input[name="password"]', VALID_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/Dashboard', { timeout: 30000 });
  await expect(page).toHaveURL(/Dashboard/);

  // ── Step 2: Navigate to Purchase Requisition page ─────────────────────────
  await page.fill('#usersearch', 'Purchase Requisition');
  await page.waitForTimeout(1500);
  await page.goto(PR_URL);
  await page.waitForURL('**/Purchase_RequisitionMaster/', { timeout: 20000 });
  await expect(page).toHaveURL(/Purchase_RequisitionMaster/);

  // ── Step 3: Open Add Form ─────────────────────────────────────────────────
  await page.goto(PR_URL + 'add');
  await page.waitForLoadState('networkidle', { timeout: 20000 });
  await expect(page).toHaveURL(/Purchase_RequisitionMaster\/add/);

  // ── Step 4: Fill Master Form Fields ───────────────────────────────────────
  await page.click('a[href="#manual"]');
  await page.waitForTimeout(2000);

  await page.selectOption('select[name="doctype"]', { label: 'Purchase Requistion - PAPER' });
  await page.selectOption('select[name="locators_code"]', { label: 'Ilmiyah Shop' });
  await page.fill('#narration', 'test negative case');

  // ── Step 5: Open Item Description Popup ───────────────────────────────────
  await page.waitForSelector('button#itm_desc_popup_btn1', { timeout: 10000 });
  await page.click('button#itm_desc_popup_btn1');
  await page.waitForTimeout(2000);

  // ── Step 6: Wait for Modal ────────────────────────────────────────────────
  const modal = page.locator('#modalpop_getitems');
  await expect(modal).toBeVisible({ timeout: 15000 });

  // ── Step 7: Search for Item ───────────────────────────────────────────────
  await page.fill('#modalpop_getitems input[placeholder="Search Item Description"]', 'sunnah ki testing');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);

  // ── Step 8: Select Item ───────────────────────────────────────────────────
  const itemRow = page.locator('#modalpop_getitems tr', { hasText: 'sunnah ki testing' });
  await expect(itemRow).toBeVisible({ timeout: 5000 });
  await itemRow.locator('input.model_item').click();
  await page.waitForTimeout(1500);

  // ── Step 9: Confirm Item Selection ────────────────────────────────────────
  await page.click('#modalpop_getitems button:has-text("Process")');
  await page.waitForTimeout(3000);

  // ── Step 10: Confirm Modal Closed ─────────────────────────────────────────
  await expect(modal).not.toBeVisible({ timeout: 20000 });

  const qtyField = page.locator('input[name="nameGroup_1[qty1]"]');

  // ── Step 11: Run Negative Scenario ────────────────────────────────────────
  // ── Step 11: Run Negative Scenario ────────────────────────────────────────
  if (RUN_QTY_ZERO_CHECK) {
    // Scenario A: enter QTY = 0 and verify red mark appears on submit
    await qtyField.click();
    await qtyField.press('Control+A');
    await qtyField.type('0');
    await page.waitForTimeout(1000);
 
    await page.fill('textarea[name="nameGroup_1[rqd_narration]"]', 'negative test - qty zero');
    await page.waitForTimeout(500);
 
    await page.locator('button.btn_submit').click();
    await page.waitForTimeout(3000);
 
    const redQtyField = page.locator('input[name="nameGroup_1[qty1]"][style*="242, 222, 222"]');
    await expect(redQtyField).toBeVisible({ timeout: 15000 });
 
  } else if (RUN_QTY_EMPTY_CHECK) {
    // Scenario B: leave QTY empty and verify red mark appears on submit
    await qtyField.click();
    await qtyField.press('Control+A');
    await qtyField.press('Backspace');
    await page.waitForTimeout(1000);

    await page.fill('textarea[name="nameGroup_1[rqd_narration]"]', 'negative test - empty qty');
    await page.waitForTimeout(500);

    await page.locator('button.btn_submit').click();
    await page.waitForTimeout(3000);

    const redQtyField = page.locator('input[name="nameGroup_1[qty1]"][style*="242, 222, 222"]');
    await expect(redQtyField).toBeVisible({ timeout: 15000 });
  }

});

// ====================== TEST CASE ======================
test('TC-02 | Purchase Requisition - Automatic', async ({ browser }) => {
  
  // Set total timeout for the entire test
  test.setTimeout(120000);

  // Create a new browser context
  const context = await browser.newContext();
  
  // Create a new page in the context
  const page = await context.newPage();

  // ── Step 1: Login ──────────────────────────────────────────────
  // Navigate to the login page using constant
  await page.goto(URL);
  
  // Fill the username field
  await page.fill('input[name="username"]', VALID_USERNAME);
  
  // Fill the password field
  await page.fill('input[name="password"]', VALID_PASSWORD);
  
  // Click on the submit button to login
  await page.click('button[type="submit"]');
  
  // Wait for navigation to the Dashboard page
  await page.waitForURL('**/Dashboard', { timeout: 30000 });

  // ── Step 2: Go to PR Add page ──────────────────────────────────
  // Navigate to Purchase Requisition Add page using PR_URL constant
  await page.goto(PR_URL + 'add');
  
  // Wait for the page to reach network idle state
  await page.waitForLoadState('networkidle', { timeout: 25000 });

  // ── Step 3: Click Automatic tab ────────────────────────────────
  // Click on the Automatic tab
  await page.click('a[href="#automatic"]');
  
  // Short wait after tab click
  await page.waitForTimeout(1500);

  // ── Step 4: Select Department = PRODUCTION ─────────────────────
  // Select PRODUCTION department from dropdown
  await page.selectOption('select[name="department"]', { label: 'ALL' });
  
  // Short wait after department selection
  await page.waitForTimeout(1500);

  // ── Step 5: Modal open ─────────────────────────────────────────
  // Click button to open the items modal
  await page.locator('#get_mr_items').click();
  
  // Wait for modal and table to fully load
  await page.waitForTimeout(8000);

  // ── Step 6: Search item ────────────────────────────────────────
  // Fill search input with item name
  await page.locator('input.searchtbl[placeholder="Search Product"]').fill('Sunnah ki Ahmiyat');


  // Press Enter key to trigger search
  await page.keyboard.press('Enter');

  
  // Wait for search results to appear
  await page.waitForTimeout(3000);

  // ── Step 7: Checkbox click ─────────────────────────────────────
  // Click on the checkbox using dispatchEvent
  await page.locator('#checkbox_po0').dispatchEvent('click');
  
  // Short wait after checkbox selection
  await page.waitForTimeout(1500);

  // ── Step 8: Process button click ───────────────────────────────
  // Click the Process button using dispatchEvent
  await page.locator('#slctBtn').dispatchEvent('click');
  
  // Wait for modal to close and items to load
  await page.waitForTimeout(5000);

  // ── Step 9: Generate PR button ─────────────────────────────────
  // Click the Generate PR button
  await page.locator('button.btn-validate:has-text("Generate PR")').click();
  
  // Wait for processing spinner and backend operation to complete
  await page.waitForTimeout(10000);

  // Select doctype after generation
  await page.selectOption('select[name="doctype"]', { label: 'Purchase Requistion - PAPER' });

  
  // Click the final submit button
  await page.locator('#automatic button.btn_submit').click();
  
  // ── Step 14: Wait for redirect to List page ────────────────────
  // Wait for navigation back to the Purchase Requisition list page
  await page.waitForURL('**/Purchase_RequisitionMaster/', { timeout: 30000 });
  
  // Verify the URL is correct
  await expect(page).toHaveURL(/Purchase_RequisitionMaster/);

  // Close the browser context
  await context.close();
});

// ====================== NEGATIVE TEST CASE ======================
test.only('TC-02-NEG-1 | Purchase Requisition - Automatic (Validation Checks)', async ({ browser }) => {

  // Set total timeout for the entire test
  test.setTimeout(120000);

  // Create a new browser context and page
  const context = await browser.newContext();
  const page = await context.newPage();

  // ── Step 1: Login ──────────────────────────────────────────────
  await page.goto(URL);
  await page.fill('input[name="username"]', VALID_USERNAME);
  await page.fill('input[name="password"]', VALID_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/Dashboard', { timeout: 30000 });

  // ── Step 2: Go to PR Add page ────────────────────────────────────
  await page.goto(PR_URL + 'add');
  await page.waitForLoadState('networkidle', { timeout: 25000 });

  // ── Step 3: Click Automatic tab ──────────────────────────────────
  await page.click('a[href="#automatic"]');
  await page.waitForTimeout(1500);

  // ── Step 4: Select Department, leave Material Requisition empty ──
  await page.selectOption('select[name="department"]', { label: 'ALL' });
  await page.waitForTimeout(1500);

  // ── Step 5: Click Generate PR ──────────────────────────────────────
  await page.locator('button.btn-validate:has-text("Generate PR")').click();
  await page.waitForTimeout(2000);

  // ── Step 6: Verify required-field validation message ──────────────
  // Same message shows for both "one field missing" and "both fields
  // missing" cases, so both possible texts are checked together.
  const requiredMsg = page
    .getByText('Please fill out this field.')
    .or(page.getByText('Department and Material Requisition are Required'));

  await expect(requiredMsg.first()).toBeVisible({ timeout: 8000 });

  // ── Final Check: Confirm PR was not generated ─────────────────────
  await expect(page).toHaveURL(/add/);

  // Close the browser context
  await context.close();
});

// ====================== NEGATIVE TEST CASE ======================
test('TC-02-NEG-2 | Purchase Requisition - Automatic (Document Type Required)', async ({ browser }) => {

  // Set total timeout for the entire test
  test.setTimeout(120000);

  // Create a new browser context
  const context = await browser.newContext();

  // Create a new page in the context
  const page = await context.newPage();

  // ── Step 1: Login ──────────────────────────────────────────────
  await page.goto(URL);
  await page.fill('input[name="username"]', VALID_USERNAME);
  await page.fill('input[name="password"]', VALID_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/Dashboard', { timeout: 30000 });

  // ── Step 2: Go to PR Add page ────────────────────────────────────
  await page.goto(PR_URL + 'add');
  await page.waitForLoadState('networkidle', { timeout: 25000 });

  // ── Step 3: Click Automatic tab ──────────────────────────────────
  await page.click('a[href="#automatic"]');
  await page.waitForTimeout(1500);

  // ── Step 4: Select Department = ALL ──────────────────────────────
  await page.selectOption('select[name="department"]', { label: 'ALL' });
  await page.waitForTimeout(1500);

  // ── Step 5: Open Material Requisition modal ──────────────────────
  await page.locator('#get_mr_items').click();
  await page.waitForTimeout(8000);

  // ── Step 6: Search item ────────────────────────────────────────
  await page.locator('input.searchtbl[placeholder="Search Product"]').fill('Sunnah ki testing');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  // ── Step 7: Select item checkbox ──────────────────────────────────
  await page.locator('#checkbox_po0').dispatchEvent('click');
  await page.waitForTimeout(1500);

  // ── Step 8: Click Process ─────────────────────────────────────────
  await page.locator('#slctBtn').dispatchEvent('click');
  await page.waitForTimeout(5000);

  // ── Step 9: Click Generate PR ─────────────────────────────────────
  await page.locator('button.btn-validate:has-text("Generate PR")').click();
  await page.waitForTimeout(10000);

  // ── Step 10: Click final submit WITHOUT selecting Document Type ──
  await page.locator('#automatic button.btn_submit').click();
  await page.waitForTimeout(2000);

  // Verify "Document type is required" error message is shown
  const docTypeError = page.locator('text=Document type is required');
  await expect(docTypeError).toBeVisible({ timeout: 8000 });

  // Confirm PR was NOT submitted - page should stay on the Add screen
  await expect(page).toHaveURL(/add/);

  // Close the browser context
  await context.close();
});

