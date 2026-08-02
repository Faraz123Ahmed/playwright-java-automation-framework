// @ts-check
import { test, expect } from '@playwright/test';

test('textContent vs inputValue Demo', async ({ page }) => {

  // Open Website
  await page.goto('https://testautomationpractice.blogspot.com/');
 

  // Get label text
  const labelText = await page.locator("label:has-text('Name:')").textContent();
  console.log("Label Text is: " + labelText);

  // Validation
  await expect(page.locator("label:has-text('Name:')")).toHaveText('Name:');


  // Enter value
  await page.locator('#name').fill('Ajay Dahiya');
 

  // Get input value
  const inputText = await page.locator('#name').inputValue();
  console.log("Input Text is: " + inputText);

  // Validation
  await expect(inputText).toBe('Ajay Dahiya');


 });

const BASE_URL = 'https://the-internet.herokuapp.com';

  test.describe('Login Page Tests', () => {

   test('should login and logout successfully', async ({ page }) => {

    // Global timeout increase only for test
     test.setTimeout(30000); // 30 seconds

    // Step 1: Go to Login Page
     await page.goto(`${BASE_URL}/login`, { timeout: 30000 });

    // Step 2: Title check karo
     await expect(page).toHaveTitle(/The Internet/, { timeout: 10000 });

    // Step 3: Username fill 
     await page.fill('#username', 'tomsmith');

    // Step 4: Password fill k
     await page.fill('#password', 'SuperSecretPassword!');

    // Step 5: Login button on click
     await page.click('button[type="submit"]');

    // Step 6: Success message check 
      await expect(page.locator('.flash.success')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('.flash.success')).toContainText('You logged into a secure area!');

    // Step 7: Secure page on redirect check 
     await expect(page).toHaveURL(`${BASE_URL}/secure`, { timeout: 100000 });

    console.log('Login successful!');

    // Step 8: Logout button click 
    await page.click('a[href="/logout"]');

    // Step 9: return back to login page
    await expect(page).toHaveURL(`${BASE_URL}/login`, { timeout: 10000 });

    // Step 10: Logout success message check
    await expect(page.locator('.flash.success')).toContainText('You logged out of the secure area!', { timeout: 10000 });

    //console.log('Logout successful!');

  });

});


test('Handling UI Elements', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes
  
  // await: waits until page is completely loaded
  await page.goto('https://testautomationpractice.blogspot.com/');

  //Drop down handling
  const countryDropdown =page.locator('#country')
  await countryDropdown.selectOption({index:1})
  

  //Radio Button handling
  const malelocator = page.locator("#male")
  await malelocator.check()// will be work both click() and check() preferable check() function 

  //Uncheck for deselection checkbox
  
  //checkbox Button
  await page.locator("#sunday").check()
  await page.locator("#monday").check()
  await page.pause()
  await page.locator("#monday").uncheck()
  await page.pause()
  //await: waits until context and all its pages are fully closed
  await page.close();
});

test('Child Window Handling', async ({ browser }) => {
 test.setTimeout(120000);
  // Browser Context
  const context = await browser.newContext();
  // Create page
  const page = await context.newPage();

  await page.goto('https://testautomationpractice.blogspot.com/');
  const newTabButton = page.locator("button:has-text('New Tab')");

  // Wait for new page + click on button
  const [newpage] = await Promise.all([
    context.waitForEvent('page'),
    newTabButton.click()
  ]);

  // Fetch child load success
  await newpage.waitForLoadState('domcontentloaded');

  // Get the Locator
  const articleLocator = newpage.locator("a:has-text('What Is AI and Machine Learning? Core Concepts, Types, and Real-World Uses')");

  // Sabse simple — null ki tension hi nahi
const articleText = await articleLocator.innerText();

const fetchedText = articleText.split("?")[0];
console.log("Text before '?': " + fetchedText);

await page.locator('#name').fill(fetchedText);
console.log("Enter value in Name field is:"+ await page.locator('#name').inputValue());
await page.pause();
});

test('Dynamic Product Search List and Add to Cart till Payment 01',async({page})=>
{
  //Test Data for login
   const email = 'faraz957.ahmed@gmail.com'
   const password='Qwerty@123'
   const productName = 'Men Tshirt'  

  //Open App
  await page.goto('https://automationexercise.com/', {
  waitUntil: 'domcontentloaded'
});
  console.log('Application Opened')

  //Login Steps
   //await page.locator("a[href='/login']").click();
     await page.getByRole('link',{name:'Signup / Login'}).click();
   //await page.locator("input[data-qa='login-email']").fill(email)
     await page.getByPlaceholder('Email Address').nth(0).fill(email)
   //await page.locator("input[data-qa='login-password']").fill(password)
     await page.getByPlaceholder('Password').fill(password)
  // await page.locator("button["data-qa='login-button'"]").click()
     await page.getByRole('button',{name:'Login'}).click()

  //Validation Login Sucess
  //await expect(page.locator("text=Logged in as")).toBeVisible();
    await expect(page.getByText("Logged in as")).toBeVisible();
    console.log("Login Successful")

  //Navigate to Products Page
  await page.locator("a[href='/products']").click();
  console.log('Product Page Opened')

  //Fetching all product count
   const allProducts =page.locator('.productinfo')
   const totalProducts =await allProducts.count()
   console.log('Total Products found:'+totalProducts);

   
   let productFound = false;
     
    for(let i=0;i<totalProducts;i++)     
    {
      //Fetch Product Name fetched using all products
       const currentProduct=await allProducts.nth(i).locator('p').textContent();
     console.log(`Product ${i+1}`,currentProduct)
      
     //Match Product
     if(currentProduct && currentProduct.trim()=== productName)
       {

        console.log('Matching Product Found')
        productFound = true;
        // Hover to Product
         await allProducts.nth(i).hover();
       //Click on Add to Cart
       await allProducts.nth(i).locator('.add-to-cart').first().click();
       console.log(productName,'Added to Cart')
       break; 
        
     }

    }
   //Validation Product Found
    expect(productFound).toBeTruthy();

});

// Defining the test case with a description.
test.only('Dynamic Product Search List and Add to Cart till Payment 02', async ({ page }) => {
  test.setTimeout(60000); // whole test case wait for 60 sec

  // Declaring test data variables for login credentials and the product to search
  const email = 'faraz957.ahmed@gmail.com';
  const password = 'Qwerty@123';
  const productName = 'Men Tshirt';  

  // Open the Automation Exercise website in the browser and wait until DOM is loaded
  await page.goto('https://automationexercise.com/', { waitUntil: 'domcontentloaded' });
  console.log('Application Opened'); // Logging success message to console

  // Click on the 'Signup / Login' link using its role and name
  await page.getByRole('link', { name: 'Signup / Login' }).click();
  
  // Fill the email field. Using .nth(0) because there are multiple 'Email Address' placeholders, 
  // we need the first one
  await page.getByPlaceholder('Email Address').nth(0).fill(email);
  
  // Fill the password field with the password variable
  await page.getByPlaceholder('Password').fill(password);
  
  // Click the 'Login' button to submit the login form
  await page.getByRole('button', { name: 'Login' }).click();

  // Step 3: Validate that login was successful by checking if "Logged in as" text is visible on the page
  await expect(page.getByText("Logged in as")).toBeVisible();
  console.log("Login Successful"); // Logging success message

  // Step 4: Navigate to the Products page by clicking the products link
  await page.locator("a[href='/products']").click();
  
  // Wait for the products page to load completely to avoid missing elements
  await page.waitForLoadState('domcontentloaded');
  console.log('Product Page Opened');

  // Step 5: Locate all products on the page using the '.productinfo' class
  const allProducts = page.locator('.productinfo');
  
  // Count the total number of products found and log it
  const totalProducts = await allProducts.count();
  console.log('Total Products found: ' + totalProducts);

  // Find the specific product card dynamically using a filter
  // It looks inside '.product-image-wrapper' for a paragraph containing the 'Men Tshirt' text, 
  // and selects the first match
  const productCard = page.locator('.product-image-wrapper').filter({ 
    has: page.locator('.productinfo p', { hasText: productName }) 
  }).first();
  
  // Scroll the specific product card into view so it can be interacted
  await productCard.scrollIntoViewIfNeeded();
  
  // Hover over the product card to reveal the hidden 'Add to Cart' overlay button
  await productCard.hover();

  // Click the 'Add to Cart' button located inside the overlay of the specific product card
  await productCard.locator('.product-overlay a.add-to-cart').first().click();
  
  // Verify that the 'Added to Cart' success modal appears
  await expect(page.locator('#cartModal')).toBeVisible();
  console.log('Product Added to Cart');
 
  // Click the 'View Cart' link inside the modal to go to the shopping cart page
  await page.getByRole('link', { name: 'View Cart' }).click({ timeout: 15000 });           
  
  // Wait for the cart page to load
  await page.waitForLoadState('domcontentloaded');
  console.log('Navigated to Cart View Page');

  // Verify that the added product exists in the cart table
  // Filter the table rows to find the one containing our product name
  const cartRow = page.locator('tr').filter({ has: page.getByText(productName) });
  
  // Assert that the product row is visible in the cart
  await expect(cartRow).toBeVisible();
  console.log('Cart Product Match Found');
    
  // Click the 'Checkout' button to proceed to the checkout page
  await page.getByText('Proceed To Checkout').click();
 await page.waitForURL(/checkout/, { timeout: 15000 });//wait for check out page navigation
  console.log('Checkout Page Opened');
  
  // Click the 'Place Order' link (which navigates to the payment page)
  await page.locator("a[href='/payment']").click();
  await page.waitForURL(/payment/, { timeout: 15000 });//wait for payment page navigation
  console.log("Payment Page Opened");
  
  // Step 10: Fill in the payment details on the payment form
  await page.locator("input[data-qa='name-on-card']").fill('Ajay Dahiya', { timeout: 15000 }); // Name on card

  await page.locator("input[data-qa='card-number']").fill('4111111111111111', { timeout: 15000 }); // Valid 16-digit test card number
  await page.locator("input[data-qa='cvc']").fill('123'); // Card CVC
  await page.locator("input[data-qa='expiry-month']").fill('12', { timeout: 15000 }); // Expiry month
  await page.locator("input[data-qa='expiry-year']").fill('2030', { timeout: 15000 }); // Expiry year
  
  // Click the 'Pay and confirm order' button
  await page.locator("button[data-qa='pay-button']").click();
  console.log("Payment Completed");
    
  // Step 11: Verify that the order was placed successfully
  // Check if the order placed heading is visible
  await expect(page.locator("h2[data-qa='order-placed']")).toBeVisible();
  
  // Verify that the exact text 'Order Placed!' is present on the page
  await expect(page.getByText('Order Placed!')).toHaveText('Order Placed!');
  
  // Log final success message
  console.log('E2E Test Passed Successfully');

});
