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
let advancedSawmills = 0;
let industrialMills = 0;
let megaProcessingFacilities = 0;

// Mining buildings
let stoneQuarries = 0;
let clayPools = 0;
let limestoneQuarries = 0;
let ironMines = 0;
let copperMines = 0;
let tinMines = 0;
let coalMines = 0;

// Building data structure - loaded from JSON
let buildingData = {};

// Load building data from embedded JSON in HTML
function loadBuildingData() {
  try {
    const buildingsScript = document.getElementById('buildings-data');
    if (buildingsScript) {
      buildingData = JSON.parse(buildingsScript.textContent);
      console.log('Building data loaded successfully');
    } else {
      console.error('Buildings data script tag not found');
      buildingData = {};
    }
  } catch (error) {
    console.error('Error loading building data:', error);
    // Fallback to empty object if JSON fails to load
    buildingData = {};
  }
}

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
    advancedSawmills: advancedSawmills,
    industrialMills: industrialMills,
    megaProcessingFacilities: megaProcessingFacilities,
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
    advancedSawmills = 0;
    industrialMills = 0;
    megaProcessingFacilities = 0;
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
      advancedSawmills = gameState.advancedSawmills || 0;
      industrialMills = gameState.industrialMills || 0;
      megaProcessingFacilities = gameState.megaProcessingFacilities || 0;
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
  document.getElementById("advancedSawmills").innerText = advancedSawmills;
  document.getElementById("industrialMills").innerText = industrialMills;
  document.getElementById("megaProcessingFacilities").innerText = megaProcessingFacilities;
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
  // Tier 3 (Advanced Sawmill): +3.0 wps each
  // Tier 4 (Industrial Mill): +5.0 wps each
  // Tier 5 (Mega Processing Facility): +8.0 wps each
  wps = 1 + (deforestStations * 0.6) + (lumberMills * 1.8) + 
        (advancedSawmills * 3.0) + (industrialMills * 5.0) + 
        (megaProcessingFacilities * 8.0);
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
  const advancedSawmillButton = document.getElementById("buyAdvancedSawmillBtn");
  const advancedSawmillDiv = advancedSawmillButton ? advancedSawmillButton.parentElement : null;
  const industrialMillButton = document.getElementById("buyIndustrialMillBtn");
  const industrialMillDiv = industrialMillButton ? industrialMillButton.parentElement : null;
  const megaProcessingFacilityButton = document.getElementById("buyMegaProcessingFacilityBtn");
  const megaProcessingFacilityDiv = megaProcessingFacilityButton ? megaProcessingFacilityButton.parentElement : null;
  
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
  
  // Wood Production tier 3 - Advanced Sawmill
  if (advancedSawmillDiv) {
    if (lumberMills === 0 || minerals < 1 || iron < 1 || copper < 1) {
      advancedSawmillDiv.style.display = 'none';
    } else {
      advancedSawmillDiv.style.display = 'block';
      if (advancedSawmillButton) {
        advancedSawmillButton.disabled = false;
        advancedSawmillButton.title = "";
      }
    }
  }
  
  // Wood Production tier 4 - Industrial Mill
  if (industrialMillDiv) {
    if (advancedSawmills === 0 || minerals < 1 || iron < 1 || copper < 1) {
      industrialMillDiv.style.display = 'none';
    } else {
      industrialMillDiv.style.display = 'block';
      if (industrialMillButton) {
        industrialMillButton.disabled = false;
        industrialMillButton.title = "";
      }
    }
  }
  
  // Wood Production tier 5 - Mega Processing Facility
  if (megaProcessingFacilityDiv) {
    if (industrialMills === 0 || minerals < 1 || iron < 1 || copper < 1) {
      megaProcessingFacilityDiv.style.display = 'none';
    } else {
      megaProcessingFacilityDiv.style.display = 'block';
      if (megaProcessingFacilityButton) {
        megaProcessingFacilityButton.disabled = false;
        megaProcessingFacilityButton.title = "";
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

// Generic purchase function helper
function canPurchaseBuilding(buildingKey) {
  const building = buildingData[buildingKey];
  if (!building) return false;
  
  // Check wood cost
  if (wood < building.cost) return false;
  
  // Check resource requirements
  if (building.requiresMineral && minerals < building.requiresMineral) return false;
  if (building.requiresIron && iron < building.requiresIron) return false;
  if (building.requiresCopper && copper < building.requiresCopper) return false;
  if (building.requiresResource) {
    const resourceMap = {
      'minerals': minerals,
      'clay': clay,
      'limestone': limestone,
      'iron': iron,
      'copper': copper,
      'tin': tin
    };
    const resourceAmount = resourceMap[building.requiresResource] || 0;
    if (resourceAmount < building.requiresAmount) return false;
  }
  
  return true;
}

function purchaseBuilding(buildingKey) {
  const building = buildingData[buildingKey];
  if (!building) return false;
  
  // Deduct costs
  wood -= building.cost;
  if (building.requiresMineral) minerals -= building.requiresMineral;
  if (building.requiresIron) iron -= building.requiresIron;
  if (building.requiresCopper) copper -= building.requiresCopper;
  
  return true;
}

// Housing tier 1
function buyTepee() {
  if (!canPurchaseBuilding('tepee')) return;
  if (purchaseBuilding('tepee')) {
    tepees++;
    calculateHousingCapacity();
    saveGame();
    updateUI();
  }
}

// Housing tier 2
function buyCabin() {
  if (tepees === 0) return;
  if (!canPurchaseBuilding('cabin')) return;
  if (purchaseBuilding('cabin')) {
    cabins++;
    calculateHousingCapacity();
    saveGame();
    updateUI();
  }
}

// Farming tier 1
function buySingleField() {
  if (!canPurchaseBuilding('singleField')) return;
  if (purchaseBuilding('singleField')) {
    singleFields++;
    saveGame();
    updateUI();
  }
}

// Farming tier 2
function buySmallFarm() {
  if (singleFields === 0) return;
  if (!canPurchaseBuilding('smallFarm')) return;
  if (purchaseBuilding('smallFarm')) {
    smallFarms++;
    saveGame();
    updateUI();
  }
}

// Wood production tier 1
function buyDeforestStation() {
  if (!canPurchaseBuilding('lumberMill')) return;
  if (purchaseBuilding('lumberMill')) {
    deforestStations++;
    calculateWPS();
    saveGame();
    updateUI();
  }
}

// Wood production tier 2
function buyLumberMill() {
  if (deforestStations === 0) return;
  if (!canPurchaseBuilding('woodProcessingPlant')) return;
  if (purchaseBuilding('woodProcessingPlant')) {
    lumberMills++;
    calculateWPS();
    saveGame();
    updateUI();
  }
}

// Wood production tier 3
function buyAdvancedSawmill() {
  if (lumberMills === 0) return;
  if (!canPurchaseBuilding('advancedSawmill')) return;
  if (purchaseBuilding('advancedSawmill')) {
    advancedSawmills++;
    calculateWPS();
    saveGame();
    updateUI();
  }
}

// Wood production tier 4
function buyIndustrialMill() {
  if (advancedSawmills === 0) return;
  if (!canPurchaseBuilding('industrialMill')) return;
  if (purchaseBuilding('industrialMill')) {
    industrialMills++;
    calculateWPS();
    saveGame();
    updateUI();
  }
}

// Wood production tier 5
function buyMegaProcessingFacility() {
  if (industrialMills === 0) return;
  if (!canPurchaseBuilding('megaProcessingFacility')) return;
  if (purchaseBuilding('megaProcessingFacility')) {
    megaProcessingFacilities++;
    calculateWPS();
    saveGame();
    updateUI();
  }
}

// Mining tier 1
function buyStoneQuarry() {
  if (!canPurchaseBuilding('stoneQuarry')) return;
  if (purchaseBuilding('stoneQuarry')) {
    stoneQuarries++;
    calculateMPS();
    saveGame();
    updateUI();
  }
}

// Mining tier 2 - Clay Pool
function buyClayPool() {
  if (!canPurchaseBuilding('clayPool')) return;
  if (purchaseBuilding('clayPool')) {
    clayPools++;
    saveGame();
    updateUI();
  }
}

// Mining tier 3 - Limestone Quarry
function buyLimestoneQuarry() {
  if (!canPurchaseBuilding('limestoneQuarry')) return;
  if (purchaseBuilding('limestoneQuarry')) {
    limestoneQuarries++;
    saveGame();
    updateUI();
  }
}

// Mining tier 4 - Iron Mine
function buyIronMine() {
  if (!canPurchaseBuilding('ironMine')) return;
  if (purchaseBuilding('ironMine')) {
    ironMines++;
    saveGame();
    updateUI();
  }
}

// Mining tier 5 - Copper Mine
function buyCopperMine() {
  if (!canPurchaseBuilding('copperMine')) return;
  if (purchaseBuilding('copperMine')) {
    copperMines++;
    saveGame();
    updateUI();
  }
}

// Mining tier 6 - Tin Mine
function buyTinMine() {
  if (!canPurchaseBuilding('tinMine')) return;
  if (purchaseBuilding('tinMine')) {
    tinMines++;
    saveGame();
    updateUI();
  }
}

// Mining tier 7 - Coal Mine
function buyCoalMine() {
  if (!canPurchaseBuilding('coalMine')) return;
  if (purchaseBuilding('coalMine')) {
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
     buildingKey === 'woodProcessingPlant' ? deforestStations > 0 :
     buildingKey === 'advancedSawmill' ? lumberMills > 0 :
     buildingKey === 'industrialMill' ? advancedSawmills > 0 :
     buildingKey === 'megaProcessingFacility' ? industrialMills > 0 : true) : true;

  // Check for mineral/iron/copper requirements
  const hasMineral = building.requiresMineral ? minerals >= building.requiresMineral : true;
  const hasIron = building.requiresIron ? iron >= building.requiresIron : true;
  const hasCopper = building.requiresCopper ? copper >= building.requiresCopper : true;

  let tooltipHTML = `<strong>${building.name}</strong><br>`;
  tooltipHTML += `<span style="color: ${canAfford ? '#4CAF50' : '#f44336'}">Cost: ${building.cost} <img src="wood-log.png" alt="Wood" style="width: 16px; height: 16px; vertical-align: middle;"></span>`;
  
  // Add resource costs
  if (building.requiresMineral || building.requiresIron || building.requiresCopper) {
    tooltipHTML += `<br>`;
    if (building.requiresMineral) {
      tooltipHTML += `<span style="color: ${hasMineral ? '#4CAF50' : '#f44336'}">${building.requiresMineral} Mineral${building.requiresMineral > 1 ? 's' : ''}</span> `;
    }
    if (building.requiresIron) {
      tooltipHTML += `<span style="color: ${hasIron ? '#4CAF50' : '#f44336'}">${building.requiresIron} Iron</span> `;
    }
    if (building.requiresCopper) {
      tooltipHTML += `<span style="color: ${hasCopper ? '#4CAF50' : '#f44336'}">${building.requiresCopper} Copper</span>`;
    }
  }
  
  tooltipHTML += `<br><span style="color: #FFD700">${building.benefit}</span>`;
  
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
    'buyAdvancedSawmillBtn': 'advancedSawmill',
    'buyIndustrialMillBtn': 'industrialMill',
    'buyMegaProcessingFacilityBtn': 'megaProcessingFacility',
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

// Initialize game - load building data first, then everything else
function initializeGame() {
  loadBuildingData();
  loadGame();
updateUI();
  updateSaveStatus();
  // Initialize tooltips after DOM is ready
  setTimeout(initTooltips, 100);
}

// Start initialization when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGame);
} else {
  initializeGame();
}