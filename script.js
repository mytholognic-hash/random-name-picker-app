// BEGIN JAVASCRIPT CODE

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

// ADDED: Audio Objects
const pickingSound = new Audio('picking_sound.mp3'); 
pickingSound.loop = true; 
pickingSound.volume = 0.5; 

const winSound = new Audio('win_jingle.mp3'); 
winSound.volume = 0.7; 
// END ADDED

// --- Core Functions ---

// 1. Load Names from Textarea
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
    
    totalNameCountDisplay.innerText = initialNames.length;
    
    updateRemainingList();
    resultDisplay.innerHTML = "Ready to pick a winner!";
    drawButton.disabled = false;
    resetButton.disabled = false;
    loadNamesButton.disabled = true;
    nameInput.disabled = true;
}

// 2. Pick a Winner (MODIFIED to start picking sound)
async function selectRandomWinner() {
    if (employeeNames.length === 0) {
        resultDisplay.innerHTML = "🎉 All names have been picked!";
        drawButton.disabled = true;
        return;
    }

    drawButton.disabled = true;
    resultDisplay.innerHTML = `<span class="draw-animation">Picking...</span>`;
    
    // START picking sound
    pickingSound.currentTime = 0; 
    pickingSound.play().catch(e => console.log("Audio play failed:", e)); 

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

// Function to reveal the actual winner after animation (MODIFIED to stop picking and play win sound)
function revealWinner() {
    // STOP picking sound
    pickingSound.pause();
    pickingSound.currentTime = 0; 

    const randomIndex = Math.floor(Math.random() * employeeNames.length);

    if (employeeNames.length === 0) {
        return;
    }

    const winner = employeeNames[randomIndex];
    employeeNames.splice(randomIndex, 1); 

    resultDisplay.innerHTML = `Congratulations! The winner is:<br><strong class="winner-name">${winner}</strong>`;
    
    // PLAY winner sound
    winSound.currentTime = 0;
    winSound.play().catch(e => console.log("Win audio play failed:", e));

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
    pickingSound.pause();
    pickingSound.currentTime = 0; 
    
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
    // Basic confetti from the center
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
