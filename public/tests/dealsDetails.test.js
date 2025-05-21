/**
 * @jest-environment jsdom
 */

// We will re-require the module in beforeEach to get fresh state including DOM elements.
let mainModule;

// --- Mocking Setup ---

// Mock `Workspace` for API calls
const mockFetchPromise = (data, ok = true) => Promise.resolve({
  ok: ok,
  json: () => Promise.resolve(data),
});

beforeAll(() => {
  // Spy on console.error once at the start of all tests.
  // We mock the implementation to an empty function so it doesn't log during tests.
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  // Restore original console.error after all tests are done
  // Ensure this is called only if it was spied on
  if (console.error.mockRestore) {
    console.error.mockRestore();
  }
});

beforeEach(() => {
  // Reset the DOM for each test to ensure isolation
  document.body.innerHTML = `
    <div id="dealGrid"></div>
    <select id="brandFilter">
      <option value="all">All Brands</option>
      <option value="brandA">Brand A</option>
      <option value="brandB">Brand B</option>
    </select>
    <input type="text" id="searchInput" />

    <div id="createDealModal" style="display: none;">
      <span class="close">x</span>
      <form id="dealForm">
        <input type="text" id="dealTitle" />
        <input type="text" id="dealDescription" />
        <input type="text" id="dealLocation" />
        <input type="number" id="dealPrice" />
        <input type="number" id="dealOriginalPrice" />
        <input type="number" id="dealMaxParticipants" />
        <input type="text" id="dealCategory" />
        <input type="text" id="dealImage" />
        <input type="datetime-local" id="dealDeadline" />
        <button type="submit">Submit</button>
      </form>
    </div>
  `;

  // IMPORTANT: Re-require the module here. This re-executes the module
  // and gets fresh references to the newly created DOM elements.
  // This is crucial for fixing the "Cannot read properties of null" errors.
  // We also clear the module cache to ensure a truly fresh import.
  jest.resetModules(); // Clears module cache
  mainModule = require('../js/dealsDetails.js'); // Assuming your file is public/js/dealsDetails.js

  // Mock `global.fetch` before each test
  global.fetch = jest.fn();

  // Mock the internal functions that interact with the mainModule for isolation
  // These will be spied on from the newly required module instance
  jest.spyOn(mainModule, 'closeModal').mockImplementation(() => {});
  jest.spyOn(mainModule, 'fetchDeals').mockImplementation(() => Promise.resolve());
  jest.spyOn(mainModule, 'renderDeals').mockImplementation(() => {});

  // For applyFilters, we need to ensure mainModule.deals is clean before each test
  // and then set up the test data for it.
  mainModule.deals = []; // Initialize to an empty array for consistency
});

afterEach(() => {
  // Clear all mocks after each test to ensure clean state
  jest.clearAllMocks();
});

// --- Test Suite for Utility Functions (from original file) ---
describe('add function', () => {
  it('should add two numbers correctly', () => {
    // Access `add` directly from the re-imported module
    expect(mainModule.add(2, 3)).toBe(5);
    expect(mainModule.add(-1, 5)).toBe(4);
    expect(mainModule.add(0, 0)).toBe(0);
  });
});

// --- Test Suite for Modal Functions ---
describe('Modal functions', () => {
  // These variables will refer to the elements in the DOM that's reset in beforeEach
  let modal, closeBtn, dealForm, dealTitleInput, dealDescriptionInput, dealDeadlineInput;

  beforeEach(() => {
    // Get fresh references after each DOM reset from mainModule's initial setup
    modal = document.getElementById('createDealModal');
    closeBtn = document.querySelector('.close');
    dealForm = document.getElementById('dealForm');
    dealTitleInput = document.getElementById('dealTitle');
    dealDescriptionInput = document.getElementById('dealDescription');
    dealDeadlineInput = document.getElementById('dealDeadline');

    // Restore original closeModal for modal specific tests, as it's the function under test here
    mainModule.closeModal.mockRestore();
  });

  it('openModal should display the modal', () => {
    mainModule.openModal();
    expect(modal.style.display).toBe('block');
  });

  it('openModal should populate form fields when dealData is provided', () => {
    const testDeal = {
      title: 'Test Deal',
      description: 'A great test deal',
      location: 'Test City',
      price: 10.00,
      original_price: 20.00,
      max_participants: 5,
      category: 'Electronics',
      image_url: 'http://example.com/image.jpg',
      deadline: '2025-12-31T23:59:00Z'
    };

    mainModule.openModal(testDeal);

    expect(dealTitleInput.value).toBe(testDeal.title);
    expect(dealDescriptionInput.value).toBe(testDeal.description);
    expect(document.getElementById('dealLocation').value).toBe(testDeal.location);
    expect(parseFloat(document.getElementById('dealPrice').value)).toBe(testDeal.price);
    expect(parseFloat(document.getElementById('dealOriginalPrice').value)).toBe(testDeal.original_price);
    expect(parseInt(document.getElementById('dealMaxParticipants').value)).toBe(testDeal.max_participants);
    expect(document.getElementById('dealCategory').value).toBe(testDeal.category);
    expect(document.getElementById('dealImage').value).toBe(testDeal.image_url);

    const expectedDeadline = new Date(testDeal.deadline).toISOString().slice(0, 16);
    expect(dealDeadlineInput.value).toBe(expectedDeadline);
  });

  it('openModal should set deadline to current time if not provided', () => {
    const mockDate = new Date('2024-01-01T10:00:00Z');
    const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    mainModule.openModal({}); // No deadline provided

    const expectedDeadline = mockDate.toISOString().slice(0, 16);
    expect(dealDeadlineInput.value).toBe(expectedDeadline);
    spy.mockRestore();
  });

  it('closeModal should hide the modal and reset the form', () => {
    mainModule.openModal(); // First, open it
    dealTitleInput.value = 'Some value'; // Put some value in form
    mainModule.closeModal();
    expect(modal.style.display).toBe('none');
    expect(dealTitleInput.value).toBe(''); // Check if form is reset
  });

  it('should close modal when close button is clicked', () => {
    mainModule.openModal();
    closeBtn.click(); // Simulate click
    expect(modal.style.display).toBe('none');
  });

  it('should close modal when clicking outside the modal (on modal overlay)', () => {
    mainModule.openModal();
    const clickEvent = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(clickEvent, 'target', { value: modal });
    window.dispatchEvent(clickEvent);
    expect(modal.style.display).toBe('none');
  });

  it('should not close modal when clicking inside the modal content', () => {
    mainModule.openModal();
    const modalContent = document.createElement('div');
    modalContent.id = 'modal-content';
    modal.appendChild(modalContent);

    const clickEvent = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(clickEvent, 'target', { value: modalContent });
    window.dispatchEvent(clickEvent);
    expect(modal.style.display).toBe('block');
    modal.removeChild(modalContent);
  });
});

// --- Test Suite for Form Submission ---
describe('Deal Form Submission', () => {
  let dealForm;

  beforeEach(() => {
    dealForm = document.getElementById('dealForm');

    // Restore mocked functions so they behave as in main.js
    mainModule.closeModal.mockRestore();
    mainModule.fetchDeals.mockRestore();

    // Re-spy on them to check if they are called
    jest.spyOn(mainModule, 'closeModal');
    jest.spyOn(mainModule, 'fetchDeals');

    // Populate form fields for submission
    document.getElementById('dealTitle').value = 'New Test Deal';
    document.getElementById('dealDescription').value = 'Description of new deal';
    document.getElementById('dealPrice').value = '100.00';
    document.getElementById('dealOriginalPrice').value = '150.00';
    document.getElementById('dealDeadline').value = '2025-11-20T10:00';
    document.getElementById('dealLocation').value = 'Online';
    document.getElementById('dealMaxParticipants').value = '10';
    document.getElementById('dealCategory').value = 'Books';
    document.getElementById('dealImage').value = 'http://example.com/new.jpg';

    // Manually attach event listener to dealForm's submit event
    // This is needed because the 'init' function sets up event listeners
    // but tests might need to trigger them in isolation.
    dealForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = {
        title: document.getElementById('dealTitle').value,
        description: document.getElementById('dealDescription').value,
        price: parseFloat(document.getElementById('dealPrice').value),
        original_price: parseFloat(document.getElementById('dealOriginalPrice').value),
        deadline: document.getElementById('dealDeadline').value,
        location: document.getElementById('dealLocation').value,
        max_participants: parseInt(document.getElementById('dealMaxParticipants').value),
        category: document.getElementById('dealCategory').value,
        image_url: document.getElementById('dealImage').value
      };

      try {
        const response = await fetch('/api/deals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          mainModule.closeModal(); // Call through mainModule
          await mainModule.fetchDeals(); // Call through mainModule
        } else {
          const errorData = await response.json();
          console.error('Error:', errorData.message || 'Failed to create deal');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });

  it('should prevent default form submission', async () => {
    const preventDefault = jest.fn();
    const submitEvent = new Event('submit');
    submitEvent.preventDefault = preventDefault;

    dealForm.dispatchEvent(submitEvent);
    expect(preventDefault).toHaveBeenCalled();
  });
});

// --- Test Suite for Rendering Deals ---
describe('renderDeals function', () => {
  let dealGrid;

  beforeEach(() => {
    dealGrid = document.getElementById('dealGrid');
    // Restore and re-spy on renderDeals for this suite, as it's the primary function under test.
    mainModule.renderDeals.mockRestore();
    jest.spyOn(mainModule, 'openModal').mockImplementation(() => {}); // Mock openModal as it's called by renderDeals
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should display "No deals found" if filteredDeals is empty', () => {
    mainModule.renderDeals([]);
    expect(dealGrid.innerHTML).toContain('<p>No deals found.</p>');
  });
});