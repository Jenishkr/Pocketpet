// Default settings
const DEFAULT_SETTINGS = {
  showAllTime: false,
  interval: 120 // seconds
};

let currentSettings = { ...DEFAULT_SETTINGS };

// Initialize settings page
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Pocketpet: Settings page loaded');
  
  // Load settings from storage
  await loadSettings();
  
  // Initialize UI
  initializeUI();
  
  // Setup event listeners
  setupEventListeners();
});

// Load settings from storage
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(['pocketpetSettings']);
    if (result.pocketpetSettings) {
      currentSettings = { ...DEFAULT_SETTINGS, ...result.pocketpetSettings };
    }
    console.log('Pocketpet: Settings loaded:', currentSettings);
  } catch (err) {
    console.log('Pocketpet: Could not load settings, using defaults');
    currentSettings = { ...DEFAULT_SETTINGS };
  }
}

// Initialize UI with current settings
function initializeUI() {
  const showAllTimeToggle = document.getElementById('showAllTimeToggle');
  const intervalSlider = document.getElementById('intervalSlider');
  const intervalValue = document.getElementById('intervalValue');
  const intervalSetting = document.getElementById('intervalSetting');
  
  // Set initial values
  showAllTimeToggle.checked = currentSettings.showAllTime;
  intervalSlider.value = currentSettings.interval;
  updateIntervalDisplay(currentSettings.interval);
  
  // Disable/enable interval setting based on showAllTime
  if (currentSettings.showAllTime) {
    intervalSetting.classList.add('disabled');
  } else {
    intervalSetting.classList.remove('disabled');
  }
}

// Update interval display
function updateIntervalDisplay(seconds) {
  const intervalValue = document.getElementById('intervalValue');
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0 && remainingSeconds > 0) {
    intervalValue.textContent = `${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    intervalValue.textContent = `${minutes} min`;
  } else {
    intervalValue.textContent = `${seconds}s`;
  }
}

// Setup event listeners
function setupEventListeners() {
  // Show All Time toggle
  document.getElementById('showAllTimeToggle').addEventListener('change', (e) => {
    currentSettings.showAllTime = e.target.checked;
    const intervalSetting = document.getElementById('intervalSetting');
    
    if (currentSettings.showAllTime) {
      intervalSetting.classList.add('disabled');
    } else {
      intervalSetting.classList.remove('disabled');
    }
  });
  
  // Interval slider
  document.getElementById('intervalSlider').addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    currentSettings.interval = value;
    updateIntervalDisplay(value);
  });
  
  // Save settings button
  document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
}

// Save settings to storage
async function saveSettings() {
  const saveStatus = document.getElementById('saveStatus');
  const saveBtn = document.getElementById('saveSettingsBtn');
  
  try {
    await chrome.storage.sync.set({ pocketpetSettings: currentSettings });
    console.log('Pocketpet: Settings saved:', currentSettings);
    
    // Notify background script about settings change
    chrome.runtime.sendMessage({ 
      action: 'settingsUpdated', 
      settings: currentSettings 
    });
    
    // Show success message
    saveStatus.textContent = '✓ Settings saved successfully!';
    saveStatus.className = 'save-status success';
    
    // Visual feedback on button
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span>✓</span> Saved!';
    saveBtn.style.background = '#4caf50';
    
    setTimeout(() => {
      saveBtn.innerHTML = originalText;
      saveBtn.style.background = '';
      saveStatus.textContent = '';
      saveStatus.className = 'save-status';
    }, 2000);
    
  } catch (err) {
    console.log('Pocketpet: Could not save settings:', err);
    
    saveStatus.textContent = '✗ Failed to save settings';
    saveStatus.className = 'save-status error';
    
    setTimeout(() => {
      saveStatus.textContent = '';
      saveStatus.className = 'save-status';
    }, 3000);
  }
}
