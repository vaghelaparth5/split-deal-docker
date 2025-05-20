const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

let dom;
let container;

beforeEach(() => {
  const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <select id="brandFilter">
          <option value="All">All</option>
          <option value="Nike">Nike</option>
        </select>
        <input type="text" id="searchInput" />
        <div id="dealGrid"></div>

        <div id="createDealModal" style="display:none;">
          <input id="dealTitle" />
          <span class="close"></span>
        </div>

        <button class="create-deal-btn" data-title="Superdry Winter Sale">Open Deal</button>
      </body>
    </html>
  `;

  dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'http://localhost/',
  });

  container = dom.window.document.body;
  global.window = dom.window;
  global.document = dom.window.document;

  global.deals = [
    { title: 'Superdry Winter Sale', brand: 'Superdry' },
    { title: 'Nike Flash Deal', brand: 'Nike' },
    { title: 'Adidas Discount', brand: 'Adidas' }
  ];
  dom.window.deals = global.deals;

  const scriptContent = fs.readFileSync(path.join(__dirname, '../js/dealsDetails.js'), 'utf8');
  const scriptEl = dom.window.document.createElement('script');
  scriptEl.textContent = scriptContent;
  dom.window.document.body.appendChild(scriptEl);

  // Simulate DOMContentLoaded
  const event = new dom.window.Event('DOMContentLoaded', {
    bubbles: true,
    cancelable: true,
  });
  dom.window.document.dispatchEvent(event);
});

describe('Deals Page Tests', () => {
  test('Renders all deals by default', () => {
    const dealCards = document.querySelectorAll('.deal-card');
    expect(dealCards.length).toBe(global.deals.length);
  });

  test('Filters deals by brand (e.g., Nike)', () => {
    const brandFilter = document.getElementById('brandFilter');
    brandFilter.value = 'Nike';
    brandFilter.dispatchEvent(new dom.window.Event('change'));

    const filtered = global.deals.filter((d) => d.brand === 'Nike');
    const rendered = document.querySelectorAll('.deal-card');
    expect(rendered.length).toBe(filtered.length);
  });

  test('Filters deals by search term (e.g., "Winter")', () => {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = 'Winter';
    searchInput.dispatchEvent(new dom.window.Event('input'));

    const filtered = global.deals.filter((d) =>
      d.title.includes('Winter') || d.brand.includes('Winter')
    );
    const rendered = document.querySelectorAll('.deal-card');
    expect(rendered.length).toBe(filtered.length);
  });

  test('Modal opens with correct prefilled data', () => {
    document.querySelector('.create-deal-btn').click();

    const modal = document.getElementById('createDealModal');
    expect(modal.style.display).toBe('block');
    expect(document.getElementById('dealTitle').value).toContain('Superdry');
  });

  test('Modal closes when clicking X', () => {
    document.querySelector('.create-deal-btn').click();
    document.querySelector('.close').click();

    const modal = document.getElementById('createDealModal');
    expect(modal.style.display).toBe('none');
  });
});
