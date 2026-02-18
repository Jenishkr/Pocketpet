// Pet configuration - will be dynamically populated
const PET_CONFIG = {
  pets: [], // Will be populated dynamically
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
  },

  welcomeMessages: {
    'Budgie': "Tweet! Your budgie friend is here! 🐦",
    'Cat': "Meow! Your cat companion is here! 🐱",
    'dog': "Woof! Your dog buddy arrived! 🐕",
    'Fish': "Blub blub! Your fish friend swam in! 🐠",
    'Hamster': "Squeak! Your hamster friend is ready! 🐹",
    'Panda': "Hey there! Your panda buddy arrived! 🐼",
    'Rabbit': "Hop hop! Your rabbit friend is here! 🐰",
    'Turtle': "Slow and steady! Your turtle friend is here! 🐢",
    'Surprise': "Surprise! Who will appear? 🎲"
  },

  messages: [
    "Time to drink some water! 💧",
    "Stretch your body! 🧘",
    "Keep going, you're doing great! 💪",
    "Take a deep breath... 😤",
    "Remember to rest your eyes! 👀",
    "You're amazing! 🌟",
    "Take a quick break! ☕",
    "Stay hydrated! 💦"
  ],
  sleepMessages: [
    "It's late! Time to sleep soon? 😴",
    "Hey night owl, get some rest! 🌙",
    "Sleep is important! See you tomorrow! 💤"
  ],
  breakMessages: [
    "You've been scrolling a while! Take a break? ☕",
    "Time to rest your eyes! 👁️",
    "Stretch break! 🧘‍♀️"
  ]
};

// State management
let petElement = null;
let selectedPet = null;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let lastScrollTime = Date.now();
let scrollCheckInterval = null;
let currentSettings = {
  showAllTime: false,
  interval: 120
};
let petHideTimeout = null;


// Available pets list (populated dynamically)
let availablePets = [];



// Get all available pets from the pets folder
async function getAvailablePets() {
  try {
    // Try to get list from storage first
    const result = await chrome.storage.sync.get(['availablePets']);
    if (result.availablePets && result.availablePets.length > 0) {
      availablePets = result.availablePets;
      PET_CONFIG.pets = availablePets;
      console.log('Pocketpet: Loaded pets from storage:', availablePets);

      return availablePets;
    }
  } catch (e) {
    console.log('Pocketpet: Could not load from storage');

  }
  
  // Default pets if storage fails
  availablePets = ['Budgie', 'Cat', 'dog', 'Fish', 'Hamster', 'Panda', 'Rabbit', 'Turtle', 'Surprise'];

  PET_CONFIG.pets = availablePets;
  return availablePets;
}


// Get pet image URL based on selection
function getPetImage(petName) {
  // If Surprise, pick a random pet
  if (petName === 'Surprise') {
    const randomPets = ['Budgie', 'Cat', 'dog', 'Fish', 'Hamster', 'Panda', 'Rabbit', 'Turtle'];
    const randomPet = randomPets[Math.floor(Math.random() * randomPets.length)];
    return chrome.runtime.getURL(`pets/${randomPet}.svg`);
  }
  return chrome.runtime.getURL(`pets/${petName}.svg`);
}

// Get actual pet name (for Surprise option)
function getActualPetName(petName) {
  if (petName === 'Surprise') {
    const randomPets = ['Budgie', 'Cat', 'dog', 'Fish', 'Hamster', 'Panda', 'Rabbit', 'Turtle'];
    return randomPets[Math.floor(Math.random() * randomPets.length)];
  }
  return petName;
}


// Get random message based on time
function getRandomMessage() {
  const hour = new Date().getHours();
  
  // Late night (after 11 PM) sleep reminder
  if (hour >= 23 || hour < 6) {
    const randomIndex = Math.floor(Math.random() * PET_CONFIG.sleepMessages.length);
    return PET_CONFIG.sleepMessages[randomIndex];
  }
  
  const randomIndex = Math.floor(Math.random() * PET_CONFIG.messages.length);
  return PET_CONFIG.messages[randomIndex];
}

// Play pop sound when pet is clicked
function playPopSound() {
  const audio = new Audio(chrome.runtime.getURL('sounds/pop.mp3'));
  audio.volume = 0.3;
  audio.play().catch(err => console.log('Audio play failed:', err));
}

// Create pet selection popup
function createPetSelector() {
  const overlay = document.createElement('div');
  overlay.id = 'pet-selector-overlay';
  overlay.className = 'pet-selector-overlay';
  
  const container = document.createElement('div');
  container.className = 'pet-selector-container';
  
  const title = document.createElement('h2');
  title.textContent = 'Choose Your Pet Companion! 🐾';
  container.appendChild(title);
  
  const petGrid = document.createElement('div');
  petGrid.className = 'pet-grid';
  
  // Use available pets
  const petsToShow = availablePets.length > 0 ? availablePets : PET_CONFIG.pets;
  
  petsToShow.forEach(pet => {
    const petOption = document.createElement('div');
    petOption.className = 'pet-option';
    petOption.innerHTML = `
      <img src="${getPetImage(pet)}" alt="${pet}" class="pet-option-img" onerror="this.style.display='none'">
      <span class="pet-emoji">${PET_CONFIG.petEmojis[pet] || '🐾'}</span>
      <span class="pet-name">${pet}</span>
    `;
    petOption.onclick = () => selectPet(pet, overlay);
    petGrid.appendChild(petOption);
  });
  
  container.appendChild(petGrid);
  overlay.appendChild(container);
  document.body.appendChild(overlay);
  
  return overlay;
}

// Handle pet selection
function selectPet(petName, overlay) {
  selectedPet = petName;
  chrome.storage.sync.set({ selectedPet: petName }, () => {
  console.log('Pocketpet: Selected pet saved:', petName);

  });
  
  overlay.remove();
  showPet();
}

// Create pet element
function createPetElement() {
  const pet = document.createElement('div');
  pet.id = 'cute-pet-companion';
  pet.className = 'cute-pet';
  
  // Get actual pet name (handle Surprise option)
  const actualPetName = getActualPetName(selectedPet || availablePets[0] || 'Cat');
  
  // Create pet image
  const img = document.createElement('img');
  img.src = getPetImage(selectedPet || availablePets[0] || 'Cat');
  img.alt = 'Cute Pet';
  img.className = 'pet-image';
  
  pet.appendChild(img);
  
  // Add to page
  document.body.appendChild(pet);
  
  return pet;
}


// Position pet on screen
function positionPet(pet) {
  // Random position (avoiding edges)
  const x = Math.random() * (window.innerWidth - 150) + 50;
  const y = Math.random() * (window.innerHeight - 150) + 50;
  
  pet.style.left = `${x}px`;
  pet.style.top = `${y}px`;
}

// Show pet with animation and welcome message
function showPet() {
  console.log('Pocketpet: showPet() called');

  
  // Remove existing pet if any
  if (petElement) {
    console.log('Pocketpet: Removing existing pet');

    petElement.remove();
    petElement = null;
  }
  
  // Check if we're on a chrome:// page
  if (window.location.href.startsWith('chrome://')) {
    console.log('Pocketpet: Skipping chrome:// page');

    return;
  }
  
  // Always get the latest selected pet from storage first
  chrome.storage.sync.get(['selectedPet'], (result) => {
    if (result.selectedPet && availablePets.includes(result.selectedPet)) {
      selectedPet = result.selectedPet;
      console.log('Pocketpet: Loaded saved pet:', selectedPet);

      displayPet();
    } else if (availablePets.length > 0) {
      // If no pet selected but pets available, show selector
      console.log('Pocketpet: No pet selected, showing selector');

      createPetSelector();
    } else {
      // Fallback to first pet if nothing else works
      selectedPet = availablePets[0] || 'Cat';
      displayPet();
    }
  });
}


// Display the pet
function displayPet() {
  console.log('Pocketpet: Creating new pet element');

  // Clear any existing hide timeout
  if (petHideTimeout) {
    clearTimeout(petHideTimeout);
    petHideTimeout = null;
  }
  
  // Remove existing pet if any
  if (petElement) {
    petElement.remove();
    petElement = null;
  }

  petElement = createPetElement();
  positionPet(petElement);
  
  // Setup all interactions
  setupDrag(petElement);
  setupClick(petElement);
  setupDoubleClick(petElement);
  setupHover(petElement);

  
  // Trigger entrance animation after a small delay
  setTimeout(() => {
    console.log('Pocketpet: Adding visible class');

    if (petElement) {
      petElement.classList.add('visible');
      console.log('Pocketpet: Pet should be visible now!');

      // Show welcome message
      const welcomeMsg = PET_CONFIG.welcomeMessages[selectedPet] || "Hey there! 👋";
      showMessage(petElement, welcomeMsg);
    }
  }, 100);

  
  // Auto-hide after 8 seconds (only if showAllTime is disabled)
  if (!currentSettings.showAllTime) {
    petHideTimeout = setTimeout(() => {
      hidePet();
    }, 8000);
  }
}


// Hide pet with animation
function hidePet() {
  if (petElement) {
    petElement.classList.remove('visible');
    petElement.classList.add('hidden');
    
    // Remove after animation completes
    setTimeout(() => {
      if (petElement) {
        petElement.remove();
        petElement = null;
      }
    }, 500);
  }
}

// Show message bubble
function showMessage(pet, message) {
  // Remove existing message if any
  const existingMessage = pet.querySelector('.pet-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create message bubble
  const messageEl = document.createElement('div');
  messageEl.className = 'pet-message';
  messageEl.textContent = message;
  
  pet.appendChild(messageEl);
  
  // Show message
  setTimeout(() => {
    messageEl.classList.add('visible');
  }, 50);
  
  // Hide message after 4 seconds
  setTimeout(() => {
    messageEl.classList.remove('visible');
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.remove();
      }
    }, 300);
  }, 4000);
}

// Handle scroll activity for break reminders
function handleScroll() {
  lastScrollTime = Date.now();
}

// Initialize scroll monitoring
function initScrollMonitoring() {
  window.addEventListener('scroll', handleScroll);
  
  // Check for break reminder every 30 seconds
  scrollCheckInterval = setInterval(() => {
    const timeSinceScroll = Date.now() - lastScrollTime;
    const hour = new Date().getHours();
    
    // Only show break reminder during active scrolling (within 10 seconds)
    if (timeSinceScroll < 10000 && (hour < 23 && hour >= 6)) {
      // 20% chance to show break reminder when user is actively scrolling
      if (Math.random() < 0.2 && petElement && petElement.classList.contains('visible')) {
        const randomIndex = Math.floor(Math.random() * PET_CONFIG.breakMessages.length);
        showMessage(petElement, PET_CONFIG.breakMessages[randomIndex]);
      }
    }
  }, 30000);
}

// Setup drag functionality with enhanced interactions
function setupDrag(pet) {
  let dragStartTime = 0;
  let dragStartX = 0;
  let dragStartY = 0;
  
  // Attach to pet container, not the image (which has pointer-events: none)
  pet.addEventListener('mousedown', (e) => {

    isDragging = true;
    dragStartTime = Date.now();
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    pet.style.cursor = 'grabbing';
    pet.classList.add('dragging');
    
    // Calculate offset from pet position
    const rect = pet.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    
    // Play pickup sound
    playPopSound();
    
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging || !pet) return;
    
    const x = e.clientX - dragOffsetX;
    const y = e.clientY - dragOffsetY;
    
    // Keep pet within viewport
    const maxX = window.innerWidth - pet.offsetWidth;
    const maxY = window.innerHeight - pet.offsetHeight;
    
    pet.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
    pet.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
    
    // Add wiggle effect while dragging
    const wiggle = Math.sin(Date.now() / 50) * 5;
    pet.style.transform = `rotate(${wiggle}deg) scale(1.1)`;
  });
  
  document.addEventListener('mouseup', (e) => {
    if (isDragging && pet) {
      pet.style.cursor = 'grab';
      pet.classList.remove('dragging');
      pet.style.transform = '';
      
      // Check if it was a click (short drag)
      const dragDuration = Date.now() - dragStartTime;
      const dragDistance = Math.sqrt(
        Math.pow(e.clientX - dragStartX, 2) + 
        Math.pow(e.clientY - dragStartY, 2)
      );
      
      // If short click (not drag), trigger bounce
      if (dragDuration < 200 && dragDistance < 5) {
        pet.classList.add('bouncing');
        setTimeout(() => {
          pet.classList.remove('bouncing');
        }, 500);
      }
    }
    isDragging = false;
  });
}

// Setup double-click for special dance animation
function setupDoubleClick(pet) {
  pet.addEventListener('dblclick', () => {
    console.log('Pocketpet: Dance time!');

    pet.classList.add('dancing');
    playPopSound();
    
    // Show fun message
    const danceMessages = [
      "🎵 Dancing time! 🎵",
      "Whee! So fun! 🎉",
      "Party mode activated! 💃",
      "You're the best! 🌟"
    ];
    const randomMsg = danceMessages[Math.floor(Math.random() * danceMessages.length)];
    showMessage(pet, randomMsg);
    
    // Remove dance class after animation
    setTimeout(() => {
      pet.classList.remove('dancing');
    }, 2000);
  });
}

// Setup hover effects
function setupHover(pet) {
  pet.addEventListener('mouseenter', () => {
    if (!isDragging) {
      pet.classList.add('hovered');
      // Gentle scale up
      pet.style.transform = 'scale(1.1)';
    }
  });
  
  pet.addEventListener('mouseleave', () => {
    pet.classList.remove('hovered');
    if (!isDragging) {
      pet.style.transform = '';
    }
  });
}


// Setup click interaction
function setupClick(pet) {
  pet.addEventListener('click', (e) => {
    // Don't trigger if dragging
    if (isDragging) return;
    
    // Play sound
    playPopSound();
    
    // Show random message
    const message = getRandomMessage();
    showMessage(pet, message);
    
    // Bounce animation on click
    pet.classList.add('bouncing');
    setTimeout(() => {
      pet.classList.remove('bouncing');
    }, 500);
    
    // Create heart particles
    createHeartParticles(e.clientX, e.clientY);
  });
}

// Create floating heart particles on click
function createHeartParticles(x, y) {
  const hearts = ['❤️', '💖', '💕', '💗', '💝'];
  const colors = ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff'];
  
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.cssText = `
        position: fixed;
        left: ${x + (Math.random() - 0.5) * 50}px;
        top: ${y + (Math.random() - 0.5) * 50}px;
        font-size: ${20 + Math.random() * 20}px;
        pointer-events: none;
        z-index: 2147483647;
        animation: float-up 1s ease-out forwards;
        text-shadow: 0 2px 10px ${colors[Math.floor(Math.random() * colors.length)]};
      `;
      document.body.appendChild(heart);
      
      setTimeout(() => heart.remove(), 1000);
    }, i * 100);
  }
}


// Setup keyboard shortcut for manual testing (press 'P' to show pet)
function setupKeyboardShortcut() {
  document.addEventListener('keydown', (e) => {
    // Press 'P' key to manually show pet for testing
    if (e.key === 'p' || e.key === 'P') {
      console.log('Pocketpet: Manual test - showing pet now!');

      showPet();
    }
  });
}

// Initialize the extension
async function init() {
  console.log('Pocketpet: init() started');

  
  // Load available pets
  await getAvailablePets();

  
  // Listen for messages from background script and popup

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Pocketpet: Received message:', message);

    if (message.action === 'showPet') {
      // Update settings if provided
      if (message.settings) {
        currentSettings = { ...currentSettings, ...message.settings };
        console.log('Pocketpet: Updated settings:', currentSettings);
      }
      showPet();
    } else if (message.action === 'changePet') {
      selectedPet = null;
      createPetSelector();
    } else if (message.action === 'settingsUpdated') {
      // Handle settings update from popup
      currentSettings = { ...currentSettings, ...message.settings };
      console.log('Pocketpet: Settings updated:', currentSettings);
      
      // If showAllTime is enabled, show pet immediately and keep it visible
      if (currentSettings.showAllTime && !petElement) {
        showPet();
      } else if (!currentSettings.showAllTime && petElement) {
        // If disabled and pet is visible, schedule hide
        if (petHideTimeout) {
          clearTimeout(petHideTimeout);
        }
        petHideTimeout = setTimeout(() => {
          hidePet();
        }, 8000);
      }
    }


  });

  
  // Initialize scroll monitoring
  initScrollMonitoring();
  
  // Setup keyboard shortcut for testing
  setupKeyboardShortcut();
  
  // Show a pet immediately on load for testing
  setTimeout(() => {
    console.log('Pocketpet: Auto-showing pet after init');

    showPet();
  }, 2000);
  
  console.log('Pocketpet initialized!');

}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
