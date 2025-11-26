let wood = 50; // Start with 50 wood
let wps = 1;   // Base 1 wps, will be calculated from buildings

let minerals = 0; // Stone/minerals resource
let mps = 0;      // Minerals per second

// New mineral resources
let clay = 0;
let limestone = 0;
let iron = 0;
let copper = 0;
let tin = 0;
let coal = 0;

let population = 0;
let housingCapacity = 0;

// Tiered building counters
let tepees = 0;
let cabins = 0;
let singleFields = 0;
let smallFarms = 0;
let deforestStations = 0;
let lumberMills = 0;

// Mining buildings
let stoneQuarries = 0;
let clayPools = 0;
let limestoneQuarries = 0;
let ironMines = 0;
let copperMines = 0;
let tinMines = 0;
let coalMines = 0;

// Building data structure
const buildingData = {
  tepee: {
    name: "Tepee",
    cost: 8,
    type: "housing",
    benefit: "+3 Housing Capacity",
    tier: 1
  },
  cabin: {
    name: "Wooden Cabin",
    cost: 20,
    type: "housing",
    benefit: "+8 Housing Capacity",
    tier: 2,
    requires: "tepee"
  },
  singleField: {
    name: "Single Field",
    cost: 20,
    type: "farming",
    benefit: "+0.4 People/sec",
    tier: 1
  },
  smallFarm: {
    name: "Small Farm",
    cost: 50,
    type: "farming",
    benefit: "+1.0 People/sec",
    tier: 2,
    requires: "singleField"
  },
  lumberMill: {
    name: "Lumber Mill",
    cost: 35,
    type: "wood",
    benefit: "+0.6 Wood/sec",
    tier: 1
  },
  woodProcessingPlant: {
    name: "Wood Processing Plant",
    cost: 80,
    type: "wood",
    benefit: "+1.8 Wood/sec",
    tier: 2,
    requires: "lumberMill"
  },
  stoneQuarry: {
    name: "Stone Quarry",
    cost: 40,
    type: "minerals",
    benefit: "+0.3 Minerals/sec",
    tier: 1
  },
  clayPool: {
    name: "Clay Pool",
    cost: 60,
    type: "minerals",
    benefit: "+0.4 Clay/sec",
    tier: 2,
    requiresResource: "minerals",
    requiresAmount: 20
  },
  limestoneQuarry: {
    name: "Limestone Quarry",
    cost: 80,
    type: "minerals",
    benefit: "+0.5 Limestone/sec",
    tier: 3,
    requiresResource: "clay",
    requiresAmount: 20
  },
  ironMine: {
    name: "Iron Mine",
    cost: 100,
    type: "minerals",
    benefit: "+0.6 Iron/sec",
    tier: 4,
    requiresResource: "limestone",
    requiresAmount: 20
  },
  copperMine: {
    name: "Copper Mine",
    cost: 120,
    type: "minerals",
    benefit: "+0.7 Copper/sec",
    tier: 5,
    requiresResource: "iron",
    requiresAmount: 20
  },
  tinMine: {
    name: "Tin Mine",
    cost: 140,
    type: "minerals",
    benefit: "+0.8 Tin/sec",
    tier: 6,
    requiresResource: "copper",
    requiresAmount: 20
  },
  coalMine: {
    name: "Coal Mine",
    cost: 160,
    type: "minerals",
    benefit: "+1.0 Coal/sec",
    tier: 7,
    requiresResource: "tin",
    requiresAmount: 20
  }
};

// Progress tracking - save game state to localStorage
function saveGame() {
  const gameState = {
    wood: wood,
    wps: wps,
    minerals: minerals,
    mps: mps,
    clay: clay,
    limestone: limestone,
    iron: iron,
    copper: copper,
    tin: tin,
    coal: coal,
    population: population,
    housingCapacity: housingCapacity,
    tepees: tepees,
    cabins: cabins,
    singleFields: singleFields,
    smallFarms: smallFarms,
    deforestStations: deforestStations,
    lumberMills: lumberMills,
    stoneQuarries: stoneQuarries,
    clayPools: clayPools,
    limestoneQuarries: limestoneQuarries,
    ironMines: ironMines,
    copperMines: copperMines,
    tinMines: tinMines,
    coalMines: coalMines,
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
    minerals = 0;
    mps = 0;
    clay = 0;
    limestone = 0;
    iron = 0;
    copper = 0;
    tin = 0;
    coal = 0;
    population = 0;
    housingCapacity = 0;
    tepees = 0;
    cabins = 0;
    singleFields = 0;
    smallFarms = 0;
    deforestStations = 0;
    lumberMills = 0;
    stoneQuarries = 0;
    clayPools = 0;
    limestoneQuarries = 0;
    ironMines = 0;
    copperMines = 0;
    tinMines = 0;
    coalMines = 0;
    calculateWPS();
    calculateHousingCapacity();
    calculateMPS();
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
      minerals = gameState.minerals || 0;
      mps = gameState.mps || 0;
      clay = gameState.clay || 0;
      limestone = gameState.limestone || 0;
      iron = gameState.iron || 0;
      copper = gameState.copper || 0;
      tin = gameState.tin || 0;
      coal = gameState.coal || 0;
      population = gameState.population || 0;
      housingCapacity = gameState.housingCapacity || 0;
      // Load new tiered buildings, with fallback for old saves
      tepees = gameState.tepees || gameState.houses || 0;
      cabins = gameState.cabins || 0;
      singleFields = gameState.singleFields || gameState.farms || 0;
      smallFarms = gameState.smallFarms || 0;
      deforestStations = gameState.deforestStations || gameState.mills || 0;
      lumberMills = gameState.lumberMills || 0;
      stoneQuarries = gameState.stoneQuarries || 0;
      clayPools = gameState.clayPools || 0;
      limestoneQuarries = gameState.limestoneQuarries || 0;
      ironMines = gameState.ironMines || 0;
      copperMines = gameState.copperMines || 0;
      tinMines = gameState.tinMines || 0;
      coalMines = gameState.coalMines || 0;
      calculateWPS();
      calculateHousingCapacity();
      calculateMPS();
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
  document.getElementById("minerals").innerText = Math.floor(minerals);
  document.getElementById("mps").innerText = mps.toFixed(2);
  document.getElementById("clay").innerText = Math.floor(clay);
  document.getElementById("limestone").innerText = Math.floor(limestone);
  document.getElementById("iron").innerText = Math.floor(iron);
  document.getElementById("copper").innerText = Math.floor(copper);
  document.getElementById("tin").innerText = Math.floor(tin);
  document.getElementById("coal").innerText = Math.floor(coal);
  document.getElementById("population").innerText = Math.floor(population);
  document.getElementById("housingCapacity").innerText = housingCapacity;

  // Update building counts
  document.getElementById("tepees").innerText = tepees;
  document.getElementById("cabins").innerText = cabins;
  document.getElementById("singleFields").innerText = singleFields;
  document.getElementById("smallFarms").innerText = smallFarms;
  document.getElementById("deforestStations").innerText = deforestStations;
  document.getElementById("lumberMills").innerText = lumberMills;
  document.getElementById("stoneQuarries").innerText = stoneQuarries;
  document.getElementById("clayPools").innerText = clayPools;
  document.getElementById("limestoneQuarries").innerText = limestoneQuarries;
  document.getElementById("ironMines").innerText = ironMines;
  document.getElementById("copperMines").innerText = copperMines;
  document.getElementById("tinMines").innerText = tinMines;
  document.getElementById("coalMines").innerText = coalMines;

  // Update button states (enable/disable based on unlocks)
  updateButtonStates();
}

function calculateWPS() {
  // Base 1 wps always, plus buildings
  // Tier 1 (Lumber Mill): +0.6 wps each
  // Tier 2 (Wood Processing Plant): +1.8 wps each
  wps = 1 + (deforestStations * 0.6) + (lumberMills * 1.8);
}

function calculateMPS() {
  // Minerals from Stone Quarries only
  mps = stoneQuarries * 0.3;
}

function calculateHousingCapacity() {
  // Housing capacity from tepees and cabins
  housingCapacity = (tepees * 3) + (cabins * 8);
}

function updateButtonStates() {
  // Show/hide tier 2 buttons based on unlocks
  const cabinButton = document.getElementById("buyCabinBtn");
  const cabinDiv = cabinButton ? cabinButton.parentElement : null;
  const smallFarmButton = document.getElementById("buySmallFarmBtn");
  const smallFarmDiv = smallFarmButton ? smallFarmButton.parentElement : null;
  const woodProcessingPlantButton = document.getElementById("buyWoodProcessingPlantBtn");
  const woodProcessingPlantDiv = woodProcessingPlantButton ? woodProcessingPlantButton.parentElement : null;
  
  // Mineral building buttons
  const clayPoolButton = document.getElementById("buyClayPoolBtn");
  const clayPoolDiv = clayPoolButton ? clayPoolButton.parentElement : null;
  const limestoneQuarryButton = document.getElementById("buyLimestoneQuarryBtn");
  const limestoneQuarryDiv = limestoneQuarryButton ? limestoneQuarryButton.parentElement : null;
  const ironMineButton = document.getElementById("buyIronMineBtn");
  const ironMineDiv = ironMineButton ? ironMineButton.parentElement : null;
  const copperMineButton = document.getElementById("buyCopperMineBtn");
  const copperMineDiv = copperMineButton ? copperMineButton.parentElement : null;
  const tinMineButton = document.getElementById("buyTinMineBtn");
  const tinMineDiv = tinMineButton ? tinMineButton.parentElement : null;
  const coalMineButton = document.getElementById("buyCoalMineBtn");
  const coalMineDiv = coalMineButton ? coalMineButton.parentElement : null;

  // Housing tier 2
  if (cabinDiv) {
    if (tepees === 0) {
      cabinDiv.style.display = 'none';
    } else {
      cabinDiv.style.display = 'block';
      if (cabinButton) {
        cabinButton.disabled = false;
        cabinButton.title = "";
      }
    }
  }
  
  // Farming tier 2
  if (smallFarmDiv) {
    if (singleFields === 0) {
      smallFarmDiv.style.display = 'none';
    } else {
      smallFarmDiv.style.display = 'block';
      if (smallFarmButton) {
        smallFarmButton.disabled = false;
        smallFarmButton.title = "";
      }
    }
  }
  
  // Wood Production tier 2
  if (woodProcessingPlantDiv) {
    if (deforestStations === 0) {
      woodProcessingPlantDiv.style.display = 'none';
    } else {
      woodProcessingPlantDiv.style.display = 'block';
      if (woodProcessingPlantButton) {
        woodProcessingPlantButton.disabled = false;
        woodProcessingPlantButton.title = "";
      }
    }
  }
  
  // Clay Pool
  if (clayPoolDiv) {
    if (minerals < 20) {
      clayPoolDiv.style.display = 'none';
    } else {
      clayPoolDiv.style.display = 'block';
      if (clayPoolButton) {
        clayPoolButton.disabled = false;
        clayPoolButton.title = "";
      }
    }
  }
  
  // Limestone Quarry
  if (limestoneQuarryDiv) {
    if (clay < 20) {
      limestoneQuarryDiv.style.display = 'none';
    } else {
      limestoneQuarryDiv.style.display = 'block';
      if (limestoneQuarryButton) {
        limestoneQuarryButton.disabled = false;
        limestoneQuarryButton.title = "";
      }
    }
  }
  
  // Iron Mine
  if (ironMineDiv) {
    if (limestone < 20) {
      ironMineDiv.style.display = 'none';
    } else {
      ironMineDiv.style.display = 'block';
      if (ironMineButton) {
        ironMineButton.disabled = false;
        ironMineButton.title = "";
      }
    }
  }
  
  // Copper Mine
  if (copperMineDiv) {
    if (iron < 20) {
      copperMineDiv.style.display = 'none';
    } else {
      copperMineDiv.style.display = 'block';
      if (copperMineButton) {
        copperMineButton.disabled = false;
        copperMineButton.title = "";
      }
    }
  }
  
  // Tin Mine
  if (tinMineDiv) {
    if (copper < 20) {
      tinMineDiv.style.display = 'none';
    } else {
      tinMineDiv.style.display = 'block';
      if (tinMineButton) {
        tinMineButton.disabled = false;
        tinMineButton.title = "";
      }
    }
  }
  
  // Coal Mine
  if (coalMineDiv) {
    if (tin < 20) {
      coalMineDiv.style.display = 'none';
    } else {
      coalMineDiv.style.display = 'block';
      if (coalMineButton) {
        coalMineButton.disabled = false;
        coalMineButton.title = "";
      }
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

// Mining tier 1
function buyStoneQuarry() {
  if (wood >= 40) {
    wood -= 40;
    stoneQuarries++;
    calculateMPS();
    saveGame();
    updateUI();
  }
}

// Mining tier 2 - Clay Pool
function buyClayPool() {
  if (minerals < 20) return; // Must have 20 minerals
  if (wood >= 60) {
    wood -= 60;
    clayPools++;
    saveGame();
    updateUI();
  }
}

// Mining tier 3 - Limestone Quarry
function buyLimestoneQuarry() {
  if (clay < 20) return; // Must have 20 clay
  if (wood >= 80) {
    wood -= 80;
    limestoneQuarries++;
    saveGame();
    updateUI();
  }
}

// Mining tier 4 - Iron Mine
function buyIronMine() {
  if (limestone < 20) return; // Must have 20 limestone
  if (wood >= 100) {
    wood -= 100;
    ironMines++;
    saveGame();
    updateUI();
  }
}

// Mining tier 5 - Copper Mine
function buyCopperMine() {
  if (iron < 20) return; // Must have 20 iron
  if (wood >= 120) {
    wood -= 120;
    copperMines++;
    saveGame();
    updateUI();
  }
}

// Mining tier 6 - Tin Mine
function buyTinMine() {
  if (copper < 20) return; // Must have 20 copper
  if (wood >= 140) {
    wood -= 140;
    tinMines++;
    saveGame();
    updateUI();
  }
}

// Mining tier 7 - Coal Mine
function buyCoalMine() {
  if (tin < 20) return; // Must have 20 tin
  if (wood >= 160) {
    wood -= 160;
    coalMines++;
    saveGame();
    updateUI();
  }
}

setInterval(() => {
  // Produce wood (base 1 + buildings)
  wood += wps;

  // Produce minerals
  minerals += mps;
  
  // Produce other mineral resources
  clay += clayPools * 0.4;
  limestone += limestoneQuarries * 0.5;
  iron += ironMines * 0.6;
  copper += copperMines * 0.7;
  tin += tinMines * 0.8;
  coal += coalMines * 1.0;

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

// Tooltip functions
function showTooltip(event, buildingKey) {
  const tooltip = document.getElementById('tooltip');
  const building = buildingData[buildingKey];
  if (!building || !tooltip) return;

  const canAfford = wood >= building.cost;
  const requirement = building.requires ? buildingData[building.requires] : null;
  
  // Check resource requirements
  let hasResourceRequirement = true;
  let resourceAmount = 0;
  if (building.requiresResource) {
    const resourceMap = {
      'minerals': minerals,
      'clay': clay,
      'limestone': limestone,
      'iron': iron,
      'copper': copper,
      'tin': tin
    };
    resourceAmount = resourceMap[building.requiresResource] || 0;
    hasResourceRequirement = resourceAmount >= building.requiresAmount;
  }
  
  // Check building requirements
  const hasRequirement = requirement ? 
    (buildingKey === 'cabin' ? tepees > 0 :
     buildingKey === 'smallFarm' ? singleFields > 0 :
     buildingKey === 'woodProcessingPlant' ? deforestStations > 0 : true) : true;

  let tooltipHTML = `<strong>${building.name}</strong><br>`;
  tooltipHTML += `<span style="color: ${canAfford ? '#4CAF50' : '#f44336'}">Cost: ${building.cost} <img src="wood-log.png" alt="Wood" style="width: 16px; height: 16px; vertical-align: middle;"></span><br>`;
  tooltipHTML += `<span style="color: #FFD700">${building.benefit}</span>`;
  
  if (requirement && !hasRequirement) {
    tooltipHTML += `<br><span style="color: #ff9800">Requires: ${requirement.name}</span>`;
  }
  
  if (building.requiresResource && !hasResourceRequirement) {
    const resourceName = building.requiresResource.charAt(0).toUpperCase() + building.requiresResource.slice(1);
    tooltipHTML += `<br><span style="color: #ff9800">Requires: ${building.requiresAmount} ${resourceName} (You have: ${Math.floor(resourceAmount)})</span>`;
  }

  tooltip.innerHTML = tooltipHTML;
  tooltip.style.display = 'block';
  
  // Position tooltip
  const rect = event.target.getBoundingClientRect();
  tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
  tooltip.style.top = (rect.bottom + 10) + 'px';
}

function hideTooltip() {
  const tooltip = document.getElementById('tooltip');
  if (tooltip) {
    tooltip.style.display = 'none';
  }
}

// Initialize tooltip event listeners
function initTooltips() {
  const buttons = {
    'buyTepeeBtn': 'tepee',
    'buyCabinBtn': 'cabin',
    'buySingleFieldBtn': 'singleField',
    'buySmallFarmBtn': 'smallFarm',
    'buyLumberMillTier1Btn': 'lumberMill',
    'buyWoodProcessingPlantBtn': 'woodProcessingPlant',
    'buyStoneQuarryBtn': 'stoneQuarry',
    'buyClayPoolBtn': 'clayPool',
    'buyLimestoneQuarryBtn': 'limestoneQuarry',
    'buyIronMineBtn': 'ironMine',
    'buyCopperMineBtn': 'copperMine',
    'buyTinMineBtn': 'tinMine',
    'buyCoalMineBtn': 'coalMine'
  };

  for (const [buttonId, buildingKey] of Object.entries(buttons)) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('mouseenter', (e) => showTooltip(e, buildingKey));
      button.addEventListener('mouseleave', hideTooltip);
    }
  }
}

// Load saved game on page load
loadGame();
updateUI();
updateSaveStatus();
// Initialize tooltips after DOM is ready
setTimeout(initTooltips, 100);