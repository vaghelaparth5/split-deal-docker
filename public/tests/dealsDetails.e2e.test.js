const puppeteer = require('puppeteer-core');
const chromePath = require('chrome-location');

describe('Deals Page E2E Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ 
    executablePath: chromePath,
    headless: true 
  });
    page = await browser.newPage();
    await page.goto(`file://${__dirname}/dealsDetails.html`);
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Page loads with all deals', async () => {
    const dealCount = await page.$$eval('.deal-card', cards => cards.length);
    expect(dealCount).toBe(5); // Matches your mock data
  });

  test('Brand filter works (Nike)', async () => {
    await page.select('#brandFilter', 'Nike');
    const dealCount = await page.$$eval('.deal-card', cards => cards.length);
    expect(dealCount).toBe(1); // Only 1 Nike deal in your mock data
  });

  test('Search filter works ("Winter")', async () => {
    await page.type('#searchInput', 'Winter');
    const dealCount = await page.$$eval('.deal-card', cards => cards.length);
    expect(dealCount).toBe(1); // Only "Superdry Winter Sale" matches
  });

  test('Modal opens and closes', async () => {
    await page.click('.create-deal-btn');
    const modalVisible = await page.$eval('#createDealModal', el => 
      el.style.display === 'block'
    );
    expect(modalVisible).toBe(true);

    await page.click('.close');
    const modalHidden = await page.$eval('#createDealModal', el => 
      el.style.display === 'none'
    );
    expect(modalHidden).toBe(true);
  });
});