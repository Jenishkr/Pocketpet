/**
 * Pocketpet - Popup Script
 * Handles the extension popup UI and interactions
 */

// Pet configuration
const PET_CONFIG = {
  pets: ['Budgie', 'Cat', 'dog', 'Fish', 'Hamster', 'Panda', 'Rabbit', 'Turtle', 'Surprise'],
  petEmojis: {
    'Budgie': '🐦',
    'Cat': '🐱',
    'dog': '🐕',
    'Fish': '🐠',
    'Hamster': '🐹',
    'Panda': '🐼',
    'Rabbit': '🐰',
    'Turtle': '🐢',
    'Surprise': '🎲'
  }
};

let currentPet = null;
let selectorVisible = false;
let donateVisible = false;
let settingsVisible = false;

// Default settings
const DEFAULT_SETTINGS = {
  showAllTime: false,
  interval: 120
};
let currentSettings = { ...DEFAULT_SETTINGS };

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Pocketpet: Popup opened');
  
  await loadCurrentPet();
  await loadSettings();
  
  setupEventListeners();
  loadPetGrid();
  addDonateSection();
});

// Load current pet
async function loadCurrentPet() {
  try {
    const result = await chrome.storage.sync.get(['selectedPet']);
    currentPet = result.selectedPet || null;
    updateCurrentPetDisplay();
  } catch (err) {
    console.log('Pocketpet: Could not load pet:', err);
  }
}

// Update the display
function updateCurrentPetDisplay() {
  const display = document.getElementById('currentPetDisplay');
  const status = document.getElementById('status');
  
  if (!currentPet) {
    display.innerHTML = `
      <span style="font-size: 40px;">🐾</span>
      <div class="pet-main-name">No pet selected</div>
    `;
    status.textContent = 'Select a pet using "Change Pet" button!';
    return;
  }
  
  const emoji = PET_CONFIG.petEmojis[currentPet] || '🐾';
  
  display.innerHTML = `
    <span style="font-size: 60px;">${emoji}</span>
    <div class="pet-main-name">${currentPet}</div>
    <div class="pet-type-label">My ${currentPet.toLowerCase()}</div>
  `;
  
  status.innerHTML = `Your ${currentPet} is ready! Click "Show Pet"<br><span class="donate-link" id="donateLink">💖Fuel my work via up</span>`;



  
  setTimeout(() => {
    const link = document.getElementById('donateLink');
    if (link) link.addEventListener('click', showDonateImage);
  }, 100);
}

// Select a pet
async function selectPet(pet) {
  currentPet = pet;
  
  try {
    await chrome.storage.sync.set({ selectedPet: pet });
  } catch (err) {
    console.log('Pocketpet: Error saving pet:', err);
  }
  
  updateCurrentPetDisplay();
  loadPetGrid();
  
  selectorVisible = false;
  document.getElementById('petSelector').classList.add('hidden');
  document.getElementById('changePetBtn').innerHTML = '<span>🔄</span> Change Pet';
  
  if (pet === 'Surprise') {
    showStatus(`🎲 Surprise selected! Click "Show Pet"!`);
  } else {
    showStatus(`${pet} selected! Click "Show Pet"!`);
  }
  
  try {
    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
      if (!tab.url?.startsWith('chrome://')) {
        chrome.tabs.sendMessage(tab.id, { action: 'petChanged', pet: pet }).catch(() => {});
      }
    });
  } catch (err) {
    console.log('Pocketpet: Could not notify tabs:', err);
  }
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('settingsBtn')?.addEventListener('click', showSettingsOverlay);
  
  document.getElementById('showPetBtn')?.addEventListener('click', async () => {
    if (!currentPet) {
      showStatus('Please select a pet first!');
      return;
    }
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && !tab.url?.startsWith('chrome://')) {
        await chrome.tabs.sendMessage(tab.id, { action: 'showPet' });
        showStatus(`Your ${currentPet} is appearing! 🎉`);
        setTimeout(() => window.close(), 1500);
      } else {
        showStatus('Cannot show pet on chrome:// pages');
      }
    } catch (err) {
      console.log('Pocketpet: Error:', err);
      showStatus('Please refresh the page and try again!');
    }
  });
  
  document.getElementById('changePetBtn')?.addEventListener('click', () => {
    selectorVisible = !selectorVisible;
    const selector = document.getElementById('petSelector');
    if (selectorVisible) {
      selector.classList.remove('hidden');
      document.getElementById('changePetBtn').innerHTML = '<span>✕</span> Cancel';
    } else {
      selector.classList.add('hidden');
      document.getElementById('changePetBtn').innerHTML = '<span>🔄</span> Change Pet';
    }
  });
}

// Load pet grid
function loadPetGrid() {
  const grid = document.getElementById('petGrid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  PET_CONFIG.pets.forEach(pet => {
    const option = document.createElement('div');
    option.className = 'pet-option';
    if (pet === currentPet) {
      option.classList.add('selected');
    }
    
    if (pet === 'Surprise') {
      option.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      option.style.border = '2px solid #ffd700';
    }
    
    option.innerHTML = `
      <span class="emoji">${PET_CONFIG.petEmojis[pet]}</span>
      <span class="name">${pet}</span>
    `;
    
    option.addEventListener('click', () => selectPet(pet));
    grid.appendChild(option);
  });
}

// Show donate image
function showDonateImage() {
  if (donateVisible) return;
  donateVisible = true;
  
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    z-index: 10000; cursor: pointer;
  `;
  
  const img = document.createElement('img');
  img.src = chrome.runtime.getURL('fund/donate.svg');
  img.style.cssText = 'max-width: 90%; max-height: 80%; border-radius: 10px;';
  img.onerror = () => {
    img.style.display = 'none';
    const text = document.createElement('div');
    text.textContent = 'Thank you for your support! 💝';
    text.style.cssText = 'color: white; font-size: 18px;';
    overlay.appendChild(text);
  };
  
  const closeText = document.createElement('div');
  closeText.textContent = 'Click anywhere to close';
  closeText.style.cssText = 'color: white; margin-top: 15px; font-size: 12px;';
  
  overlay.appendChild(img);
  overlay.appendChild(closeText);
  document.body.appendChild(overlay);
  
  overlay.addEventListener('click', () => {
    overlay.remove();
    donateVisible = false;
  });
}

// Load settings
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(['pocketpetSettings']);
    if (result.pocketpetSettings) {
      currentSettings = { ...DEFAULT_SETTINGS, ...result.pocketpetSettings };
    }
  } catch (err) {
    console.log('Pocketpet: Could not load settings:', err);
  }
}

// Show settings overlay
function showSettingsOverlay() {
  if (settingsVisible) return;
  settingsVisible = true;
  
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.85); display: flex;
    align-items: center; justify-content: center; z-index: 10000;
  `;
  
  const panel = document.createElement('div');
  panel.style.cssText = `
    background: white; border-radius: 20px; padding: 30px;
    width: 90%; max-width: 400px; color: #333;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  `;
  
  panel.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 3px solid #667eea; padding-bottom: 15px;">
      <h2 style="color: #667eea; margin: 0;">⚙️ Settings</h2>
      <button id="closeSettings" style="background: none; border: none; font-size: 24px; cursor: pointer;">✕</button>
    </div>
    
    <div style="margin-bottom: 20px;">
      <label style="display: flex; justify-content: space-between; align-items: center;">
        <span>Show Pet All Time</span>
        <input type="checkbox" id="showAllTime" ${currentSettings.showAllTime ? 'checked' : ''}>
      </label>
    </div>
    
    <div style="margin-bottom: 20px;">
      <label>Appearance Interval: <span id="intervalVal">${currentSettings.interval}s</span></label>
      <input type="range" id="intervalSlider" min="30" max="300" value="${currentSettings.interval}" style="width: 100%;">
    </div>
    
    <button id="saveSettings" style="width: 100%; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 30px; font-size: 16px; cursor: pointer;">💾 Save Settings</button>
  `;
  
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
  
  document.getElementById('closeSettings').addEventListener('click', () => {
    overlay.remove();
    settingsVisible = false;
  });
  
  document.getElementById('showAllTime').addEventListener('change', (e) => {
    currentSettings.showAllTime = e.target.checked;
  });
  
  document.getElementById('intervalSlider').addEventListener('input', (e) => {
    currentSettings.interval = parseInt(e.target.value);
    document.getElementById('intervalVal').textContent = currentSettings.interval + 's';
  });
  
  document.getElementById('saveSettings').addEventListener('click', async () => {
    try {
      await chrome.storage.sync.set({ pocketpetSettings: currentSettings });
      chrome.runtime.sendMessage({ action: 'settingsUpdated', settings: currentSettings });
      overlay.remove();
      settingsVisible = false;
      showStatus('✅ Settings saved!');
    } catch (err) {
      showStatus('❌ Failed to save settings');
    }
  });
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      settingsVisible = false;
    }
  });
}

// Show status
function showStatus(message) {
  const status = document.getElementById('status');
  if (status) {
    status.innerHTML = message;
    status.style.background = 'rgba(255, 255, 255, 0.3)';
    setTimeout(() => {
      status.style.background = 'rgba(255, 255, 255, 0.2)';
    }, 1000);
  }
}

// Add donate section
function addDonateSection() {
  // Donate is inline in status
}
