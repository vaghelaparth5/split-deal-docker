const { JSDOM } = require('jsdom');
const fs = require('fs');
const { TextEncoder, TextDecoder } = require('util');

// Add polyfills
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Then proceed with your existing setup...

// Set up the DOM environment
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '../views/dealsDetails.html'), 'utf8');

const dom = new JSDOM(html, { runScripts: 'dangerously' });
global.document = dom.window.document;
global.window = dom.window;

// Load your JS file (this will execute your scripts)
require('../js/dealsDetails.js');

describe('Deals Page Tests', () => {
  beforeEach(() => {
    // Reset the DOM state before each test
    document.getElementById('dealGrid').innerHTML = '';
    document.getElementById('brandFilter').value = 'All';
    document.getElementById('searchInput').value = '';
  });

  // --- Deal Rendering Tests ---
  test('Renders all deals by default', () => {
    const dealCards = document.querySelectorAll('.deal-card');
    expect(dealCards.length).toBe(deals.length);
  });

  test('Filters deals by brand (e.g., Nike)', () => {
    document.getElementById('brandFilter').value = 'Nike';
    document.getElementById('brandFilter').dispatchEvent(new Event('change'));
    
    const dealCards = document.querySelectorAll('.deal-card');
    expect(dealCards.length).toBe(deals.filter(d => d.brand === 'Nike').length);
  });

  test('Filters deals by search term (e.g., "Winter")', () => {
    document.getElementById('searchInput').value = 'Winter';
    document.getElementById('searchInput').dispatchEvent(new Event('input'));
    
    const dealCards = document.querySelectorAll('.deal-card');
    expect(dealCards.length).toBe(deals.filter(d => 
      d.title.includes('Winter') || d.brand.includes('Winter')
    ).length);
  });

  // --- Modal Tests ---
  test('Modal opens with correct prefilled data', () => {
    const firstDealButton = document.querySelector('.create-deal-btn');
    firstDealButton.click();
    
    const modalTitle = document.getElementById('dealTitle').value;
    expect(modalTitle).toContain('Superdry'); // From your mock data
    expect(document.getElementById('createDealModal').style.display).toBe('block');
  });

  test('Modal closes when clicking X', () => {
    document.querySelector('.create-deal-btn').click(); // Open first
    document.querySelector('.close').click();
    expect(document.getElementById('createDealModal').style.display).toBe('none');
  });
});