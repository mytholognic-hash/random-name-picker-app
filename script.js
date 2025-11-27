// BEGIN JAVASCRIPT CODE

// NEW: Define Audio Objects Globally but initialize later
let pickingSound;
let winSound;

let employeeNames = []; 
let initialNames = [];  

// References to HTML elements
const nameInput = document.getElementById("nameInput");
const loadNamesButton = document.getElementById("loadNamesButton");
const drawButton = document.getElementById("drawButton");
const resetButton = document.getElementById("resetButton");
const resultDisplay = document.getElementById("resultDisplay");
const remainingNamesList = document.getElementById("remainingNamesList");
const mainContainer = document.querySelector(".main-container"); 

// References for name counts
const totalNameCountDisplay = document.getElementById("totalNameCount");
const remainingCountDisplay = document.getElementById("remainingCount");

// NEW FUNCTION: Initialize audio after first user click (Load Names button)
function initializeAudio() {
    if (!pickingSound) { 
        pickingSound = new Audio('picking_sound.wav'); 
        pickingSound.loop = true; 
        pickingSound.volume = 1; 

        winSound = new Audio('win_jingle.wav'); 
        winSound.volume = 1; 
    }
}

// --- Core Functions ---

// 1. Load Names from Textarea (MODIFIED to call initializeAudio)
function loadNames() {
    const namesText = nameInput.value.trim();
    if (namesText === "") {
        alert("Please enter employee names before loading.");
        return;
    }

    employeeNames = namesText.split('\n')
                             .map(name => name.trim())
                             .filter(name => name !== '');

    if (employeeNames.length === 0) {
        alert("No valid names found. Please ensure names are separated by new lines.");
        return;
    }

    initialNames = [...employeeNames]; 
    
    // Call audio initializer function
    initializeAudio(); 
    
    totalNameCountDisplay.innerText = initialNames.length;
    
    updateRemainingList();
    resultDisplay.innerHTML = "Ready to pick a winner!";
    drawButton.disabled = false;
    resetButton.disabled = false;
    loadNamesButton.disabled = true;
    nameInput.disabled = true;
}

// 2. Pick a Winner
async function selectRandomWinner() {
    if (employeeNames.length === 0) {
        resultDisplay.innerHTML = "🎉 All names have been picked!";
        drawButton.disabled = true;
        return;
    }

    drawButton.disabled = true;
    resultDisplay.innerHTML = `<span class="draw-animation">Picking...</span>`;
    
    // START picking sound
    if (pickingSound) { // Check if audio is initialized
        pickingSound.currentTime = 0; 
        pickingSound.play().catch(e => console.error("Picking audio play failed:", e)); 
    }

    // Exciting Animation Part 
    const animationDuration = 2000; 
    const intervalTime = 100; 
    let animationEndTime = Date.now() + animationDuration;

    const animationInterval = setInterval(() => {
        
        if (employeeNames.length > 0) { 
            const tempName = employeeNames[Math.floor(Math.random() * employeeNames.length)];
            resultDisplay.innerHTML = `<span class="draw-animation">${tempName}</span>`;
        } else {
             resultDisplay.innerHTML = `<span class="draw-animation">Almost!</span>`;
        }
        
        createSparkle();

        if (Date.now() > animationEndTime) {
            clearInterval(animationInterval); 
            revealWinner(); 
        }
    }, intervalTime);
}

// Function to reveal the actual winner after animation
function revealWinner() {
    // STOP picking sound
    if (pickingSound) {
        pickingSound.pause();
        pickingSound.currentTime = 0; 
    }

    const randomIndex = Math.floor(Math.random() * employeeNames.length);

    if (employeeNames.length === 0) {
        return;
    }

    const winner = employeeNames[randomIndex];
    employeeNames.splice(randomIndex, 1); 

    // Display winner with huge text and pop-in animation
    resultDisplay.innerHTML = `Congratulations! The winner is:<br><strong class="winner-name">${winner}</strong>`;
    
    // PLAY winner sound
    if (winSound) {
        winSound.currentTime = 0;
        winSound.play().catch(e => console.error("Win audio play failed:", e));
    }

    fireConfetti();

    updateRemainingList(); 

    if (employeeNames.length === 0) {
        drawButton.disabled = true;
        resultDisplay.innerHTML += " (All names picked!)";
    } else {
        drawButton.disabled = false;
    }
}


// 3. Update Remaining Names List on screen
function updateRemainingList() {
    remainingNamesList.innerHTML = ''; 
    
    remainingCountDisplay.innerText = employeeNames.length; 

    if (employeeNames.length === 0) {
        remainingNamesList.innerHTML = '<li>No names remaining</li>';
    } else {
        employeeNames.forEach(name => {
            const listItem = document.createElement('li');
            listItem.innerText = name;
            remainingNamesList.appendChild(listItem);
        });
    }
}

// 4. Reset Application
function resetApp() {
    // Ensure sound is stopped on reset
    if (pickingSound) {
        pickingSound.pause();
        pickingSound.currentTime = 0; 
    }
    
    employeeNames = [...initialNames]; 
    
    if (initialNames.length > 0) {
        totalNameCountDisplay.innerText = initialNames.length;
    } else {
        totalNameCountDisplay.innerText = 0;
    }

    if (employeeNames.length > 0) {
        resultDisplay.innerHTML = "Ready to pick again!";
        drawButton.disabled = false;
        resetButton.disabled = false;
        loadNamesButton.disabled = true;
        nameInput.disabled = true;
    } else {
        resultDisplay.innerHTML = "...Load names to start...";
        drawButton.disabled = true;
        resetButton.disabled = true;
        loadNamesButton.disabled = false;
        nameInput.disabled = false;
        nameInput.value = ""; 
    }
    updateRemainingList();
}

// --- Animation Helper: Create Sparkles ---
function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    const x = Math.random() * mainContainer.offsetWidth;
    const y = Math.random() * mainContainer.offsetHeight;
    const size = Math.random() * 10 + 5; 
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    mainContainer.appendChild(sparkle);

    sparkle.addEventListener('animationend', () => {
        sparkle.remove();
    });
}

// --- Confetti & Fireworks Function ---
function fireConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    var duration = 4 * 1000; 
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}


// --- Event Listeners ---
loadNamesButton.addEventListener("click", loadNames);
drawButton.addEventListener("click", selectRandomWinner);
resetButton.addEventListener("click", resetApp);

// --- Initial Setup on page load ---
totalNameCountDisplay.innerText = 0;
remainingCountDisplay.innerText = 0;
updateRemainingList(); 
// END JAVASCRIPT CODE


