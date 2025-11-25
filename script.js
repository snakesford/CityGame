let wood = 50; // Start with 50 wood
let wps = 1; // Base 1 wps, will be calculated from buildings

let population = 0;
let housingCapacity = 0;

// Tiered building counters
let tepees = 0;
let cabins = 0;
let singleFields = 0;
let smallFarms = 0;
let deforestStations = 0;
let lumberMills = 0;

// Progress tracking - save game state to localStorage
function saveGame() {
  const gameState = {
    wood: wood,
    wps: wps,
    population: population,
    housingCapacity: housingCapacity,
    tepees: tepees,
    cabins: cabins,
    singleFields: singleFields,
    smallFarms: smallFarms,
    deforestStations: deforestStations,
    lumberMills: lumberMills,
    timestamp: Date.now()
  };
  localStorage.setItem('cityGameSave', JSON.stringify(gameState));
  updateSaveStatus();
}

function updateSaveStatus() {
  const saved = localStorage.getItem('cityGameSave');
  if (saved) {
    try {
      const gameState = JSON.parse(saved);
      const saveDate = new Date(gameState.timestamp);
      document.getElementById('saveStatus').innerText = 
        `Last saved: ${saveDate.toLocaleString()}`;
    } catch (e) {
      document.getElementById('saveStatus').innerText = '';
    }
  } else {
    document.getElementById('saveStatus').innerText = '';
  }
}

function resetGame() {
  if (confirm('Are you sure you want to reset your game? This cannot be undone.')) {
    localStorage.removeItem('cityGameSave');
    wood = 50;
    wps = 1;
    population = 0;
    housingCapacity = 0;
    tepees = 0;
    cabins = 0;
    singleFields = 0;
    smallFarms = 0;
    deforestStations = 0;
    lumberMills = 0;
    calculateWPS();
    calculateHousingCapacity();
    updateUI();
    updateSaveStatus();
  }
}

function loadGame() {
  const saved = localStorage.getItem('cityGameSave');
  if (saved) {
    try {
      const gameState = JSON.parse(saved);
      wood = gameState.wood || 50;
      wps = gameState.wps || 1;
      population = gameState.population || 0;
      housingCapacity = gameState.housingCapacity || 0;
      // Load new tiered buildings, with fallback for old saves
      tepees = gameState.tepees || gameState.houses || 0;
      cabins = gameState.cabins || 0;
      singleFields = gameState.singleFields || gameState.farms || 0;
      smallFarms = gameState.smallFarms || 0;
      deforestStations = gameState.deforestStations || gameState.mills || 0;
      lumberMills = gameState.lumberMills || 0;
      calculateWPS();
      calculateHousingCapacity();
      return true;
    } catch (e) {
      console.error('Error loading game:', e);
    }
  }
  return false;
}

function updateUI() {
  document.getElementById("wood").innerText = Math.floor(wood);
  document.getElementById("wps").innerText = wps.toFixed(2);
  document.getElementById("population").innerText = Math.floor(population);
  document.getElementById("housingCapacity").innerText = housingCapacity;

  // Update building counts
  document.getElementById("tepees").innerText = tepees;
  document.getElementById("cabins").innerText = cabins;
  document.getElementById("singleFields").innerText = singleFields;
  document.getElementById("smallFarms").innerText = smallFarms;
  document.getElementById("deforestStations").innerText = deforestStations;
  document.getElementById("lumberMills").innerText = lumberMills;

  // Update button states (enable/disable based on unlocks)
  updateButtonStates();
}

function calculateWPS() {
  // Base 1 wps always, plus buildings
  // Tier 1 (Lumber Mill): +1 wps each
  // Tier 2 (Wood Processing Plant): +3 wps each
  wps = 1 + (deforestStations * .6) + (lumberMills * 1.8);
}

function calculateHousingCapacity() {
  // Housing capacity from tepees and cabins
  housingCapacity = (tepees * 3) + (cabins * 8);
}

function updateButtonStates() {
  // Enable/disable tier 2 buttons based on unlocks
  const cabinButton = document.getElementById("buyCabinBtn");
  const smallFarmButton = document.getElementById("buySmallFarmBtn");
  const lumberMillButton = document.getElementById("buyLumberMillBtn");

  if (cabinButton) {
    cabinButton.disabled = tepees === 0;
    if (tepees === 0) {
      cabinButton.title = "Build a Tepee first to unlock";
    } else {
      cabinButton.title = "";
    }
  }
  if (smallFarmButton) {
    smallFarmButton.disabled = singleFields === 0;
    if (singleFields === 0) {
      smallFarmButton.title = "Build a Single Field first to unlock";
    } else {
      smallFarmButton.title = "";
    }
  }
  if (lumberMillButton) {
    lumberMillButton.disabled = deforestStations === 0;
    if (deforestStations === 0) {
      lumberMillButton.title = "Build a Lumber Mill first to unlock";
    } else {
      lumberMillButton.title = "";
    }
  }
}

// Housing tier 1
function buyTepee() {
  if (wood >= 8) {
    wood -= 8;
    tepees++;
    calculateHousingCapacity();
    saveGame();
    updateUI();
  }
}

// Housing tier 2
function buyCabin() {
  if (tepees === 0) return; // Must have at least one tepee
  if (wood >= 20) {
    wood -= 20;
    cabins++;
    calculateHousingCapacity();
    saveGame();
    updateUI();
  }
}

// Farming tier 1
function buySingleField() {
  if (wood >= 20) {
    wood -= 20;
    singleFields++;
    saveGame();
    updateUI();
  }
}

// Farming tier 2
function buySmallFarm() {
  if (singleFields === 0) return; // Must have at least one single field
  if (wood >= 50) {
    wood -= 50;
    smallFarms++;
    saveGame();
    updateUI();
  }
}

// Wood production tier 1
function buyDeforestStation() {
  if (wood >= 35) {
    wood -= 35;
    deforestStations++;
    calculateWPS();
    saveGame();
    updateUI();
  }
}

// Wood production tier 2
function buyLumberMill() {
  if (deforestStations === 0) return; // Must have at least one Lumber Mill (tier 1)
  if (wood >= 80) {
    wood -= 80;
    lumberMills++;
    calculateWPS();
    saveGame();
    updateUI();
  }
}

setInterval(() => {
  // Produce wood (base 1 + buildings)
  wood += wps;
  
  // Produce people from farms (capped by housing capacity)
  if (population < housingCapacity) {
    let peoplePerSecond = (singleFields * 0.4) + (smallFarms * 1.0);
    population = Math.min(population + peoplePerSecond, housingCapacity);
  }

  // Auto-save every 5 seconds
  if (Math.floor(Date.now() / 1000) % 5 === 0) {
    saveGame();
  }

  updateUI();
}, 1000);

// Load saved game on page load
loadGame();
updateUI();
updateSaveStatus();