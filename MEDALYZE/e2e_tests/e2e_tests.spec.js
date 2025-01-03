const { test, expect } = require('@playwright/test');

// ...existing code...

test('Professional creates an appointment', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.fill('input[placeholder="Username"]', 'prouser');
    await page.fill('input[placeholder="Password"]', 'propassword');
    await page.click('button:text("Login")');

    await expect(page).toHaveURL(/professional-dashboard/);
    await page.click('text=Manage Appointments');
    await page.click('text=New Appointment');
    await page.fill('input[name="specialist_id"]', '1');
    await page.fill('input[name="date"]', '2023-10-10');
    await page.fill('input[name="time"]', '10:00');
    await page.click('button:text("Create")');

    await expect(page.locator('text=Appointment created successfully')).toBeVisible();
});

test('Patient creates an appointment', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.fill('input[placeholder="Username"]', 'patientuser');
    await page.fill('input[placeholder="Password"]', 'patientpassword');
    await page.click('button:text("Login")');

    await expect(page).toHaveURL(/patient-dashboard/);
    await page.click('text=Book Appointment');
    await page.fill('input[name="specialist_id"]', '1');
    await page.fill('input[name="date"]', '2023-10-11');
    await page.fill('input[name="time"]', '11:00');
    await page.click('button:text("Book")');

    await expect(page.locator('text=Appointment booked successfully')).toBeVisible();
});

test('Patient changes language to Spanish', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.fill('input[placeholder="Username"]', 'patientuser');
    await page.fill('input[placeholder="Password"]', 'patientpassword');
    await page.click('button:text("Login")');

    await expect(page).toHaveURL(/patient-dashboard/);
    await page.click('text=Settings');
    await page.selectOption('select[name="language"]', 'es');
    await expect(page.locator('text=Idioma cambiado a español')).toBeVisible();
});

test('Patient checks reward points', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.fill('input[placeholder="Username"]', 'patientuser');
    await page.fill('input[placeholder="Password"]', 'patientpassword');
    await page.click('button:text("Login")');

    await expect(page).toHaveURL(/patient-dashboard/);
    await page.click('text=Rewards');
    await expect(page.locator('text=You have 100 reward points')).toBeVisible();
});

test('Professional processes a payment', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.fill('input[placeholder="Username"]', 'prouser');
    await page.fill('input[placeholder="Password"]', 'propassword');
    await page.click('button:text("Login")');

    await expect(page).toHaveURL(/professional-dashboard/);
    await page.click('text=Payments');
    await page.click('text=New Payment');
    await page.fill('input[name="amount"]', '100');
    await page.selectOption('select[name="payment_method"]', 'Stripe');
    await page.click('button:text("Process Payment")');

    await expect(page.locator('text=Payment processed successfully')).toBeVisible();
});

test('Professional customizes profile', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.fill('input[placeholder="Username"]', 'prouser');
    await page.fill('input[placeholder="Password"]', 'propassword');
    await page.click('button:text("Login")');

    await expect(page).toHaveURL(/professional-dashboard/);
    await page.click('text=Profile');
    await page.fill('input[name="credentials"]', 'Verified Doctor');
    await page.fill('input[name="keywords"]', 'Cardiology, Heart Specialist');
    await page.click('button:text("Save")');

    await expect(page.locator('text=Profile updated successfully')).toBeVisible();
});

test('Patient views medical history', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.fill('input[placeholder="Username"]', 'patientuser');
    await page.fill('input[placeholder="Password"]', 'patientpassword');
    await page.click('button:text("Login")');

    await expect(page).toHaveURL(/patient-dashboard/);
    await page.click('text=Medical History');
    await expect(page.locator('text=Visit on 2023-10-01')).toBeVisible();
    await expect(page.locator('text=Diagnosis: Flu')).toBeVisible();
    await expect(page.locator('text=Payment: $50')).toBeVisible();
});
