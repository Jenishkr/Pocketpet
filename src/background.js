/**
 * Pocketpet - Background Service Worker
 * Handles timing, scheduling, and communication with content scripts
 */


// Configuration
const CONFIG = {
  defaultInterval: 120,  // 2 minutes in seconds
  checkInterval: 10000   // Check every 10 seconds
};

// Default settings
const DEFAULT_SETTINGS = {
  showAllTime: false,
  interval: 120 // seconds
};

let currentSettings = { ...DEFAULT_SETTINGS };
let showPetTimeout = null;
let isPetVisible = false;


/**
 * Load settings from storage
 */
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(['pocketpetSettings']);
    if (result.pocketpetSettings) {
      currentSettings = { ...DEFAULT_SETTINGS, ...result.pocketpetSettings };
    }
    console.log('Pocketpet: Background settings loaded:', currentSettings);
  } catch (err) {
    console.log('Pocketpet: Could not load settings, using defaults');
    currentSettings = { ...DEFAULT_SETTINGS };
  }
}

/**
 * Get interval in milliseconds
 */
function getIntervalMs() {
  return currentSettings.interval * 1000;
}


/**
 * Schedule the next pet appearance
 */
function schedulePetAppearance() {
  // If show all time is enabled, don't schedule - pet stays visible
  if (currentSettings.showAllTime) {
    console.log('Pocketpet: Show all time enabled, keeping pet visible');
    showPetToAllTabs();
    return;
  }
  
  // Clear any existing timeout
  if (showPetTimeout) {
    clearTimeout(showPetTimeout);
  }
  
  // Get interval from settings
  const interval = getIntervalMs();
  console.log(`Pocketpet: Next pet in ${Math.round(interval / 1000)} seconds`);

  
  // Schedule the pet appearance
  showPetTimeout = setTimeout(() => {
    showPetToAllTabs();
  }, interval);
}


/**
 * Send message to all tabs to show pet
 */
async function showPetToAllTabs() {
  try {
    // Get all active tabs
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });
    
    // Filter out chrome:// pages and send to valid tabs
    for (const tab of tabs) {
      // Skip chrome:// pages and other non-http pages
      if (tab.url && 
          !tab.url.startsWith('chrome://') && 
          !tab.url.startsWith('chrome-extension://') &&
          !tab.url.startsWith('about:')) {
        
        try {
          await chrome.tabs.sendMessage(tab.id, { 
            action: 'showPet',
            settings: currentSettings 
          });
          console.log('Pocketpet: Sent showPet message to tab:', tab.id);

        } catch (err) {
          // Tab might not have content script loaded yet
          console.log('Pocketpet: Could not send to tab:', tab.id, err.message);

        }
      }
    }
  } catch (err) {
    console.error('Pocketpet: Error showing pet:', err);

  }
  
  // Schedule next appearance (if not in show all time mode)
  if (!currentSettings.showAllTime) {
    schedulePetAppearance();
  }
}

/**
 * Handle settings update from popup
 */
function handleSettingsUpdate(settings) {
  console.log('Pocketpet: Settings updated:', settings);
  currentSettings = settings;
  
  // Clear existing timeout and reschedule
  if (showPetTimeout) {
    clearTimeout(showPetTimeout);
    showPetTimeout = null;
  }
  
  // If show all time is enabled, show pet immediately
  if (currentSettings.showAllTime) {
    showPetToAllTabs();
  } else {
    // Otherwise schedule with new interval
    schedulePetAppearance();
  }
}


/**
 * Initialize the service worker
 */
async function init() {
  console.log('Pocketpet: Background service worker started');

  
  // Load settings first
  await loadSettings();
  
  // Start scheduling pet appearances
  schedulePetAppearance();
  
  // Listen for tab updates to reschedule
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
      // Pet will appear on next scheduled interval
    }
  });
  
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'settingsUpdated') {
      handleSettingsUpdate(message.settings);
      sendResponse({ success: true });
    }
    return true;
  });
}


// Initialize when service worker starts
init();

// Keep service worker alive
self.addEventListener('activate', (event) => {
  console.log('Pocketpet: Service worker activated');

  init();
});
