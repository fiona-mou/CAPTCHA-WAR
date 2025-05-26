// Global variables
let selectedImages = []; // Stores local image URLs (blob URLs)
let currentPhase = 'landing';

// CAPTCHA Battle variables (Retained as they determine the transition to Phase 3)
let userScore = 0;
let aiScore = 0;
let gameStartTime = null;
let userTotalTime = 0;
let aiTotalTime = 0;
let currentCaptchaData = null; // { images: [], solutionIndices: [], targetCategory: '' }
let userSelections = []; // Array of indices selected by user
let gameEnded = false;

const assetPool = [
    { src: 'https://spyne-static.s3.amazonaws.com/Ai+Tool/car-transparent-bg-after-1.webp', category: 'cars' },
    { src: 'https://images.unsplash.com/photo-1486326658981-ed68abe5868e?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'cars' },
    { src: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'cars' },
    { src: 'https://plus.unsplash.com/premium_photo-1664304752635-3e0d8d8185e3?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'cars' },
    { src: 'https://media.istockphoto.com/id/184101886/photo/transparent-vehicle.jpg?s=612x612&w=0&k=20&c=qHG1CzfMjE1Oc9xfqvgYI_JkRJpkTeP-X-ijE8BQMFk=', category: 'cars' },
    { src: 'https://img.freepik.com/premium-psd/modern-car-transparent-background-3d-rendering-illustration_494250-34111.jpg', category: 'cars' },

    { src: 'https://i.pinimg.com/736x/8a/56/64/8a5664cc818e84b586b9964cef426969.jpg', category: 'bicycles' },
    { src: 'https://plus.unsplash.com/premium_photo-1677564813893-05d00f64886d?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'bicycles' },
    { src: 'https://images.unsplash.com/photo-1671903318196-4a8d882a6af6?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'bicycles' },
    { src: 'https://static.dezeen.com/uploads/2013/01/dezeen_Clarity-Bike-by-Designaffairs_1a.jpg', category: 'bicycles' },
    { src: 'https://kent.bike/cdn/shop/files/26MargCoastisClear_GreyBlue1_1800x.jpg?v=1717609285', category: 'bicycles' },

    { src: 'https://img.freepik.com/free-psd/realistic-detailed-traffic-light-showing-red-yellow-green-transparent-background_84443-26975.jpg', category: 'traffic lights' },
    { src: 'https://i.pinimg.com/474x/a0/97/12/a09712ef4d6ca72cbbb02f3f792d694f.jpg', category: 'traffic lights' },
    { src: 'https://images.unsplash.com/photo-1695828352681-bf90d2750d42?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'traffic lights' },
    { src: 'https://images.unsplash.com/photo-1583040674371-1683cb6bb798?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'traffic lights' },
    { src: 'https://media.istockphoto.com/id/671842434/photo/traffic-lights-in-a-clear-blue-sky.jpg?s=612x612&w=is&k=20&c=0IK-wzZu75yPHx_8KW7D19Eg1AjscqHUi47ChONX7EI=', category: 'traffic lights'},
    
    { src: 'https://res.cloudinary.com/woodland/image/upload/c_limit,d_ni.png,f_auto,q_auto,w_1024/v1/advanced_media/media/catalog/product/p/e/pedestrian-crossing.jpg', category: 'crosswalk signs' },
    { src: 'https://images.unsplash.com/photo-1741999233762-697b0e8ea82c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3Jvc3N3YWxrJTIwc2lnbnxlbnwwfHwwfHx8MA%3D%3D', category: 'crosswalk signs' },
    { src: 'https://images.unsplash.com/photo-1744013965605-5980092e22b2?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'crosswalk signs' },
    { src: 'https://media.istockphoto.com/id/1094346466/vector/city-public-bus-with-flat-and-solid-color-style-design-transparent-window-glasses-vector.jpg?s=612x612&w=0&k=20&c=BM6fcDgQYeHrw4_EtRCSCj8SLMo6_a1H2WlNNdLLlO4=', category: 'buses' },
    { src: 'https://img.freepik.com/free-psd/modern-white-bus-transparent-background_84443-25503.jpg', category: 'buses' },
    { src: 'https://images.unsplash.com/photo-1723526680296-2c76e4729fa1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'buses'}
];
const potentialTargetCategories = ['cars', 'bicycles', 'traffic lights', 'crosswalk signs', 'buses'];
const CAPTCHAS_TO_WIN = 10;

let captchaTimerInterval = null;
let currentRoundTime = 0;
let aiSimulationTimeout = null;

// Phase 3 specific variables
let invasionTimer = null;
let blurTimeout = null; // New variable for blur delay
let invasionElements = [];
let invasionSpeed = 150; // Faster initial spawn delay
let invasionStartTime = null;
let windowCount = 0;
let folderCount = 0;

let elements = {};
let audio = {};

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    elements = {
        landingPage: document.getElementById('landingPage'),
        uploadInterface: document.getElementById('uploadInterface'),
        robotConfirmation: document.getElementById('robotConfirmation'),
        captchaVerificationScreen: document.getElementById('captchaVerificationScreen'),
        captchaBattleScreen: document.getElementById('captchaBattleScreen'),
        startBtn: document.getElementById('startBtn'),
        imageUpload: document.getElementById('imageUpload'),
        thumbnailGrid: document.getElementById('thumbnailGrid'),
        noImagesText: document.getElementById('noImagesText'),
        proceedToRobotConfirmBtn: document.getElementById('proceedToRobotConfirmBtn'),
        backToLandingBtn: document.getElementById('backToLandingBtn'),
        notRobotCheck: document.getElementById('notRobotCheck'),
        confirmHumanityBtn: document.getElementById('confirmHumanityBtn'),
        backToUploadBtn: document.getElementById('backToUploadBtn'),
        phase2NotRobotCheck: document.getElementById('phase2NotRobotCheck'),
        verificationSpinner: document.getElementById('verificationSpinner'),
        proceedToBattleBtn: document.getElementById('proceedToBattleBtn'),
        userScoreDisplay: document.getElementById('userScoreDisplay'),
        userScoreCount: document.getElementById('userScoreCount'),
        aiScoreDisplay: document.getElementById('aiScoreDisplay'),
        aiScoreCount: document.getElementById('aiScoreCount'),
        timerDisplay: document.getElementById('timerDisplay'),
        captchaQuestion: document.getElementById('captchaQuestion'),
        userCaptchaGrid: document.getElementById('userCaptchaGrid'),
        aiCaptchaGrid: document.getElementById('aiCaptchaGrid'),
        verifyCaptchaBtn: document.getElementById('verifyCaptchaBtn'),
        battleMessage: document.getElementById('battleMessage'),

        hackerInvasionScreen: document.getElementById('hackerInvasionScreen'),
        invasionContent: document.getElementById('invasionContent'),
        invasionTerminal: document.getElementById('invasionTerminal'),
        terminalOutput: document.getElementById('terminalOutput'),
        restartGameBtn: document.getElementById('restartGameBtn')
    };

    audio = {
        invasionAlarm: document.getElementById('invasionAlarm'),
        captchaCorrectSound: document.getElementById('captchaCorrectSound'),
        captchaIncorrectSound: document.getElementById('captchaIncorrectSound')
    };

    initializeCustomAudio();
    setupEventListeners();
    setupTerminalControls();
    initializePhase1();
}

// Enhanced audio generation with alarm-style sounds
function initializeCustomAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Generate correct sound (pleasant success beep)
    function generateCorrectSound() {
        const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.3, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.sin(2 * Math.PI * 800 * i / audioContext.sampleRate) * 0.3 * Math.exp(-i / (audioContext.sampleRate * 0.1));
        }

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        return source;
    }

    // Generate alarm sound for CAPTCHA errors - enhanced security alarm
    function generateErrorAlarm() {
        const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        const sampleRate = audioContext.sampleRate;

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // Enhanced security alarm - urgent warning pattern
            const alarmFreq1 = 1400; // Higher pitched alarm
            const alarmFreq2 = 900;  // Lower alarm tone
            const warbleSpeed = 18; // Faster warble for urgency
            const sirenSpeed = 6; // Siren-like modulation

            // Create alternating alarm pattern with siren effect
            const warble = Math.sin(t * warbleSpeed * Math.PI);
            const siren = Math.sin(t * sirenSpeed * Math.PI) * 0.3;
            const freq = (warble > 0 ? alarmFreq1 : alarmFreq2) + siren * 200;

            // Add rapid pulsing effect for alarm characteristic
            const pulse = Math.sin(t * 15 * Math.PI) > 0 ? 1 : 0.4;

            // Sharp envelope with sustain for alarm effect
            const envelope = Math.max(0, 1 - t * 0.7);

            data[i] = Math.sin(2 * Math.PI * freq * t) * 0.6 * envelope * pulse;
        }

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = false;
        source.connect(audioContext.destination);
        return source;
    }

    // Generate enhanced invasion alarm - multi-layered security breach alert
    function generateInvasionAlarm() {
        const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 4, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        const sampleRate = audioContext.sampleRate;

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // Enhanced multi-layered alarm system
            const mainAlarm = 550 + Math.sin(t * 4 * Math.PI) * 150; // Main alarm frequency with modulation
            const urgentAlarm = 800 + Math.sin(t * 7 * Math.PI) * 100; // Urgent overlay frequency
            const sirenFreq = 1200; // High pitched siren component

            // Create complex alarm pattern
            const mainTone = Math.sin(2 * Math.PI * mainAlarm * t) * 0.5;
            const urgentTone = Math.sin(2 * Math.PI * urgentAlarm * t) * 0.4;
            
            // High frequency siren bursts
            const sirenBurst = Math.sin(t * 10 * Math.PI) > 0.7 ? 
                Math.sin(2 * Math.PI * sirenFreq * t) * 0.3 : 0;

            // Rhythmic pulsing for alarm characteristic
            const rhythmicPulse = 0.8 + Math.sin(t * 12 * Math.PI) * 0.2;
            
            // Danger wave modulation
            const dangerWave = 0.9 + Math.sin(t * 3 * Math.PI) * 0.1;

            data[i] = (mainTone + urgentTone + sirenBurst) * rhythmicPulse * dangerWave;
        }

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(audioContext.destination);
        return source;
    }

    audio.generateCorrect = generateCorrectSound;
    audio.generateErrorAlarm = generateErrorAlarm;
    audio.generateInvasionAlarm = generateInvasionAlarm;
    audio.audioContext = audioContext;
    audio.currentInvasionSource = null;
}

// Helper function to play audio, prioritizing custom generator if available
function playAudio(audioElement, customGenerator) {
    if (customGenerator && audio.audioContext && audio.audioContext.state === 'running') {
        try {
            // Ensure AudioContext is running before creating/starting sources
            const source = customGenerator();
            source.start();
            return;
        } catch (err) {
            console.warn(`Custom audio generation failed:`, err);
            // Fallback to element if generator fails
        }
    }

    if (audioElement && audioElement.play) {
        audioElement.currentTime = 0;
        audioElement.play().catch(e => {
            // Auto-play restrictions might cause this. User interaction should unlock.
            console.warn(`Audio play failed for element:`, e);
        });
    }
}


function playInvasionAlarm() {
    stopAlarm(); // Stop any previous alarm instance
    if (audio.generateInvasionAlarm && audio.audioContext && audio.audioContext.state === 'running') {
        try {
            audio.currentInvasionSource = audio.generateInvasionAlarm();
            audio.currentInvasionSource.start();
            console.log("Playing invasion alarm (custom generator)");
        } catch (err) {
            console.warn(`Custom invasion alarm failed:`, err);
            // Fallback to element
            if (audio.invasionAlarm && audio.invasionAlarm.play) {
                audio.invasionAlarm.loop = true;
                audio.invasionAlarm.volume = 0.4;
                audio.invasionAlarm.currentTime = 0;
                audio.invasionAlarm.play().catch(e => {
                    console.warn(`Invasion alarm element play failed:`, e);
                });
            }
        }
    } else if (audio.invasionAlarm && audio.invasionAlarm.play) {
         // Fallback if AudioContext is not running or generator is not available
         audio.invasionAlarm.loop = true;
         audio.invasionAlarm.volume = 0.4;
         audio.invasionAlarm.currentTime = 0;
         audio.invasionAlarm.play().catch(e => {
             console.warn(`Invasion alarm element play failed (AudioContext not ready):`, e);
         });
    }
}

function stopAlarm() {
    if (audio.currentInvasionSource) {
        try { audio.currentInvasionSource.stop(); } catch(e) { console.warn("Error stopping custom alarm:", e); }
        audio.currentInvasionSource = null;
    }
    if (audio.invasionAlarm && audio.invasionAlarm.pause) {
        try { audio.invasionAlarm.pause(); audio.invasionAlarm.currentTime = 0; } catch(e) { console.warn("Error pausing element alarm:", e); }
    }
}

function setupEventListeners() {
    elements.startBtn.addEventListener('click', transitionToUpload);
    elements.backToLandingBtn.addEventListener('click', transitionToLanding);
    elements.imageUpload.addEventListener('change', handleImageUpload);
    elements.proceedToRobotConfirmBtn.addEventListener('click', transitionToRobotConfirmation);
    elements.notRobotCheck.addEventListener('change', () => toggleButton(elements.confirmHumanityBtn, elements.notRobotCheck.checked));
    elements.confirmHumanityBtn.addEventListener('click', transitionToCaptchaVerification);
    elements.backToUploadBtn.addEventListener('click', transitionToUpload);
    elements.phase2NotRobotCheck.addEventListener('change', () => {
        toggleButton(elements.proceedToBattleBtn, elements.phase2NotRobotCheck.checked);
        if (elements.phase2NotRobotCheck.checked) {
            elements.verificationSpinner.classList.remove('hidden');
            setTimeout(() => {
                elements.verificationSpinner.classList.add('hidden');
            }, 1500);
        }
    });
    elements.proceedToBattleBtn.addEventListener('click', transitionToCaptchaBattle);
    elements.verifyCaptchaBtn.addEventListener('click', verifyCaptcha);

    // Enhanced restart button - always visible and accessible
    if (elements.restartGameBtn) {
        elements.restartGameBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('Restart button clicked');
            restartGame();
        });
    }

    // Audio context initialization on first interaction
    document.body.addEventListener('click', function initAudio() {
        if (audio.audioContext && audio.audioContext.state === 'suspended') {
            audio.audioContext.resume().then(() => {
                console.log('AudioContext resumed successfully');
            }).catch(e => console.error('Failed to resume AudioContext:', e));
        }
        document.body.removeEventListener('click', initAudio);
    });
}

function toggleButton(button, isEnabled) {
    if (button) {
        button.disabled = !isEnabled;
    }
}

// Phase 1 Functions
function initializePhase1() {
    currentPhase = 'landing';
    resetGameVariables();
    showOnly(elements.landingPage);
    elements.thumbnailGrid.innerHTML = '';
    elements.noImagesText.classList.remove('hidden');
    elements.noImagesText.textContent = 'No images selected yet...';
    elements.imageUpload.value = '';
    toggleButton(elements.proceedToRobotConfirmBtn, false);
    if (elements.restartGameBtn) elements.restartGameBtn.classList.add('hidden');
    stopAlarm();
    // Ensure blur is off when returning to landing
    if (elements.hackerInvasionScreen) {
        elements.hackerInvasionScreen.classList.remove('invasion-blurred');
    }
    if (blurTimeout) {
        clearTimeout(blurTimeout);
        blurTimeout = null;
    }
}

function transitionToLanding() { initializePhase1(); }

function transitionToUpload() {
    currentPhase = 'upload';
    showOnly(elements.uploadInterface);
    elements.notRobotCheck.checked = false;
    toggleButton(elements.confirmHumanityBtn, false);
    if (elements.restartGameBtn) elements.restartGameBtn.classList.add('hidden');
    stopAlarm();
     if (elements.hackerInvasionScreen) {
        elements.hackerInvasionScreen.classList.remove('invasion-blurred');
    }
    if (blurTimeout) {
        clearTimeout(blurTimeout);
        blurTimeout = null;
    }
}

function handleImageUpload(event) {
    const files = event.target.files;
    const tempSelectedImages = [];

    elements.thumbnailGrid.innerHTML = '';
    elements.noImagesText.classList.remove('hidden');

    if (files && files.length > 0) {
        if (files.length < 5 || files.length > 10) {
            elements.noImagesText.textContent = `Please upload between 5 and 10 images. You selected ${files.length}.`;
            toggleButton(elements.proceedToRobotConfirmBtn, false);
            selectedImages = [];
            return;
        }

        elements.noImagesText.classList.add('hidden');
        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                createThumbnail(e.target.result, index);
                tempSelectedImages.push({blobUrl: e.target.result}); // Simplified
                if (tempSelectedImages.length === files.length) {
                    if(selectedImages && selectedImages.length > 0) {
                         selectedImages.forEach(url => URL.revokeObjectURL(url));
                    }
                    selectedImages = tempSelectedImages.map(f => f.blobUrl); // Simplified
                }
            };
            reader.readAsDataURL(file);
        });
        toggleButton(elements.proceedToRobotConfirmBtn, true);
    } else {
        elements.noImagesText.textContent = "No images selected yet...";
        toggleButton(elements.proceedToRobotConfirmBtn, false);
        if(selectedImages && selectedImages.length > 0) {
             
        }
        selectedImages = [];
    }
}

function createThumbnail(src, index) {
    const thumbContainer = document.createElement('div');
    thumbContainer.className = 'relative aspect-square bg-gray-800 rounded overflow-hidden shadow-md';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `User Upload ${index + 1}`;
    img.className = 'w-full h-full object-cover';
    thumbContainer.appendChild(img);
    elements.thumbnailGrid.appendChild(thumbContainer);
}

function transitionToRobotConfirmation() {
    currentPhase = 'robotConfirm';
    showOnly(elements.robotConfirmation);
    elements.notRobotCheck.checked = false;
    toggleButton(elements.confirmHumanityBtn, false);
    if (elements.restartGameBtn) elements.restartGameBtn.classList.add('hidden');
    stopAlarm();
     if (elements.hackerInvasionScreen) {
        elements.hackerInvasionScreen.classList.remove('invasion-blurred');
    }
    if (blurTimeout) {
        clearTimeout(blurTimeout);
        blurTimeout = null;
    }
}

function transitionToCaptchaVerification() {
    currentPhase = 'captchaVerify';
    showOnly(elements.captchaVerificationScreen);
    elements.phase2NotRobotCheck.checked = false;
    toggleButton(elements.proceedToBattleBtn, false);
    elements.verificationSpinner.classList.add('hidden');
    if (elements.restartGameBtn) elements.restartGameBtn.classList.add('hidden');
    stopAlarm();
     if (elements.hackerInvasionScreen) {
        elements.hackerInvasionScreen.classList.remove('invasion-blurred');
    }
    if (blurTimeout) {
        clearTimeout(blurTimeout);
        blurTimeout = null;
    }
}

// CAPTCHA Battle Functions
function transitionToCaptchaBattle() {
    currentPhase = 'captchaBattle';
    showOnly(elements.captchaBattleScreen);
    if (elements.restartGameBtn) elements.restartGameBtn.classList.add('hidden');
    stopAlarm();
     if (elements.hackerInvasionScreen) {
        elements.hackerInvasionScreen.classList.remove('invasion-blurred');
    }
    if (blurTimeout) {
        clearTimeout(blurTimeout);
        blurTimeout = null;
    }
    initializeCaptchaBattle();
}

function initializeCaptchaBattle() {
    userScore = 0; aiScore = 0; userTotalTime = 0; aiTotalTime = 0; currentRoundTime = 0; gameEnded = false;
    updateScoreDisplay(); elements.battleMessage.textContent = '';
    toggleButton(elements.verifyCaptchaBtn, false);

    gameStartTime = Date.now(); startTimer(); loadNewCaptcha();
}

function startTimer() {
    stopTimer();
    elements.timerDisplay.textContent = formatTime(currentRoundTime);
    captchaTimerInterval = setInterval(() => {
        currentRoundTime++;
        elements.timerDisplay.textContent = formatTime(currentRoundTime);
    }, 1000);
}

function stopTimer() {
    clearInterval(captchaTimerInterval);
    captchaTimerInterval = null;
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function loadNewCaptcha() {
    if (gameEnded) return;
    userSelections = [];
    elements.userCaptchaGrid.innerHTML = '';
    elements.aiCaptchaGrid.innerHTML = '';
    elements.battleMessage.textContent = '';
    toggleButton(elements.verifyCaptchaBtn, false);

    const targetCategory = potentialTargetCategories[Math.floor(Math.random() * potentialTargetCategories.length)];
    const categoryImages = assetPool.filter(img => img.category === targetCategory);
    const otherImages = assetPool.filter(img => img.category !== targetCategory);

    let gridImages = [];
    let solutionIndices = [];

    const numTargetImages = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < numTargetImages; i++) {
        let imgPool = categoryImages;
        if (imgPool.length > 0) {
            gridImages.push(imgPool[Math.floor(Math.random() * imgPool.length)]);
        } else {
             gridImages.push(otherImages[Math.floor(Math.random() * otherImages.length)]);
        }
    }

    while (gridImages.length < 9) {
        let imgPool = otherImages;
        if (imgPool.length > 0) {
             gridImages.push(imgPool[Math.floor(Math.random() * imgPool.length)]);
        } else {
            gridImages.push({src: 'https://via.placeholder.com/100?text=Error', category: 'distractor'});
        }
    }

    gridImages = gridImages.sort(() => 0.5 - Math.random());

    gridImages.forEach((img, index) => {
        if (img.category === targetCategory) {
            solutionIndices.push(index);
        }
    });

    currentCaptchaData = { images: gridImages.map(img => img.src), solutionIndices, targetCategory };
    elements.captchaQuestion.innerHTML = `Select all squares with <span class="text-yellow-300 mx-1">${targetCategory}</span>`;

    populateGrids(currentCaptchaData.images, elements.userCaptchaGrid, true);
    populateGrids(currentCaptchaData.images, elements.aiCaptchaGrid, false);

    startAISimulation(currentCaptchaData.solutionIndices);
    toggleButton(elements.verifyCaptchaBtn, true);
    currentRoundTime = 0;
    startTimer();
}

function populateGrids(imageSrcs, gridElement, isUserGrid) {
    gridElement.innerHTML = '';
    imageSrcs.forEach((src, index) => {
        const cell = document.createElement('div');
        cell.className = 'aspect-square bg-gray-900 flex items-center justify-center cursor-pointer relative overflow-hidden border border-gray-700 hover:border-green-400 transition-all';
        const img = document.createElement('img');
        img.src = src;
        img.className = 'max-w-full max-h-full object-contain';
        img.onerror = () => { img.src = 'https://via.placeholder.com/100?text=Error'; };
        cell.appendChild(img);

        if (isUserGrid) {
            cell.addEventListener('click', () => toggleUserSelection(index, cell));
        } else {
            cell.classList.add('ai-cell');
        }
        gridElement.appendChild(cell);
    });
}

function toggleUserSelection(index, cellElement) {
    if (gameEnded) return;
    const selectionIndex = userSelections.indexOf(index);
    if (selectionIndex > -1) {
        userSelections.splice(selectionIndex, 1);
        cellElement.classList.remove('border-yellow-400', 'border-4', 'ring-2', 'ring-yellow-300');
        cellElement.classList.add('border-gray-700');
    } else {
        userSelections.push(index);
        cellElement.classList.add('border-yellow-400', 'border-4', 'ring-2', 'ring-yellow-300');
        cellElement.classList.remove('border-gray-700');
    }
}

function verifyCaptcha() {
    if (gameEnded) return;
    stopTimer();

    const solution = currentCaptchaData.solutionIndices.sort().join(',');
    const userAttempt = userSelections.sort().join(',');

    if (solution === userAttempt) {
        userScore++;
        userTotalTime += currentRoundTime;
        elements.battleMessage.textContent = 'Correct! Next round...';
        elements.battleMessage.className = 'text-center mt-4 text-xl h-8 text-green-400';
        playAudio(audio.captchaCorrectSound, audio.generateCorrect);
    } else {
        elements.battleMessage.textContent = 'Incorrect. Try again.';
        elements.battleMessage.className = 'text-center mt-4 text-xl h-8 text-red-400';
        // Play distinctive error alarm - using the enhanced alarm generator
        playAudio(null, audio.generateErrorAlarm);
    }
    updateScoreDisplay();

    if (userScore >= CAPTCHAS_TO_WIN) {
        determineGameOutcome();
    } else {
        if (!gameEnded) {
            setTimeout(() => loadNewCaptcha(), solution === userAttempt ? 1000 : 1500);
        }
    }
}

function startAISimulation(solutionIndices) {
    if (gameEnded || aiScore >= CAPTCHAS_TO_WIN) return;

    const aiCells = elements.aiCaptchaGrid.querySelectorAll('.ai-cell');
    const baseAITimePerCaptcha = 3.5;
    const aiTimeForThisRound = (baseAITimePerCaptcha + (Math.random() * 1.5 - 0.75)); // AI completes in 2.75 to 4.25 seconds

    if (aiSimulationTimeout) clearTimeout(aiSimulationTimeout);

    aiSimulationTimeout = setTimeout(() => {
        if (gameEnded) return;

        solutionIndices.forEach(idx => {
            if (aiCells[idx]) {
                aiCells[idx].classList.add('border-blue-500', 'border-4', 'ring-2', 'ring-blue-400');
            }
        });

        aiScore++;
         aiTotalTime += aiTimeForThisRound; // Add seconds
        updateScoreDisplay();

        if (aiScore >= CAPTCHAS_TO_WIN && !gameEnded) {
            determineGameOutcome();
        }
    }, aiTimeForThisRound * 1000);
}

function updateScoreDisplay() {
    elements.userScoreCount.textContent = userScore;
    elements.aiScoreCount.textContent = aiScore;
}

function determineGameOutcome() {
    if (gameEnded) return;
    gameEnded = true;
    stopTimer();
    if (aiSimulationTimeout) clearTimeout(aiSimulationTimeout);
    toggleButton(elements.verifyCaptchaBtn, false);

    let userWins = false;
    // Check win conditions based on who reached 10 first, or time if both did
    if (userScore >= CAPTCHAS_TO_WIN && aiScore < CAPTCHAS_TO_WIN) {
         userWins = true; // User finished 10, AI didn't
    } else if (aiScore >= CAPTCHAS_TO_WIN && userScore < CAPTCHAS_TO_WIN) {
         userWins = false; // AI finished 10, User didn't
    } else if (userScore >= CAPTCHAS_TO_WIN && aiScore >= CAPTCHAS_TO_WIN) {
        // Both finished 10, compare total time
        userWins = userTotalTime <= aiTotalTime;
    } else {
         // Neither finished 10, something went wrong, default to user losing? Or just wait?
         // Based on requirements, game only ends when someone hits 10. This else should technically not be reachable
         // if the checks above are correct. Assume loss if somehow reached.
        userWins = false;
        console.warn("Game ended without either player reaching 10 points?");
    }


    if (userWins) {
        elements.battleMessage.textContent = 'YOU WIN THE WAR! Humanity is safe... for now.';
        elements.battleMessage.className = 'text-center mt-4 text-xl h-8 text-green-400 font-bold';
        setTimeout(transitionToLanding, 3000);
    } else {
        elements.battleMessage.textContent = 'AI WINS! Your system is compromised...';
        elements.battleMessage.className = 'text-center mt-4 text-xl h-8 text-red-500 font-bold';
        setTimeout(transitionToHackerInvasion, 3000);
    }
}

// Phase 3: Hacker Invasion Functions
function transitionToHackerInvasion() {
    currentPhase = 'hackerInvasion';
    showOnly(elements.hackerInvasionScreen);
    startHackingPhase();
}

function startHackingPhase() {
    invasionStartTime = Date.now();
    windowCount = 0;
    folderCount = 0;

    invasionElements.forEach(el => el.remove());
    invasionElements = [];

    if (elements.invasionContent) {
        elements.invasionContent.innerHTML = '';
        console.log("Starting hacker invasion phase - playing alarm");
        playInvasionAlarm(); // Play the enhanced invasion alarm
    }

    if (elements.terminalOutput) {
         elements.terminalOutput.innerHTML = '';
         showTerminal();
         typeTerminalOutput();
    }

    // Delay the appearance of the blur effect by 60 seconds total (15 seconds more than before)
    if (elements.hackerInvasionScreen) {
         elements.hackerInvasionScreen.classList.remove('invasion-blurred'); // Ensure it starts without blur
         if (blurTimeout) clearTimeout(blurTimeout);
         blurTimeout = setTimeout(() => {
             if (elements.hackerInvasionScreen && currentPhase === 'hackerInvasion') { // Only apply if still in invasion phase
                 elements.hackerInvasionScreen.classList.add('invasion-blurred');
                 console.log("Applying invasion blur effect after 60 seconds.");
             }
         }, 120000); // 60 seconds delay (15 seconds more than before)
    }

    // Show restart button immediately and ensure it stays visible and unaffected by blur
    if (elements.restartGameBtn) {
        console.log("Showing restart button immediately");
        elements.restartGameBtn.classList.remove('hidden');
        elements.restartGameBtn.style.zIndex = '99999'; // Ensure highest z-index to stay above blur
        elements.restartGameBtn.style.position = 'fixed';
        elements.restartGameBtn.style.pointerEvents = 'auto';
        // Ensure the button is not affected by any parent backdrop-filter effects
        elements.restartGameBtn.style.isolation = 'isolate';
    }

    // Initial burst of windows/folders
    const initialBurstSize = Math.max(10, Math.min(selectedImages.length * 2, 20));
    const initialSpacing = 60;

    for (let i = 0; i < initialBurstSize; i++) {
        setTimeout(() => {
            if(currentPhase === 'hackerInvasion') {
                createChaosWindow();
            }
        }, i * initialSpacing);
    }

    const initialFolders = Math.max(4, Math.floor(initialBurstSize / 3));
    for (let i = 0; i < initialFolders; i++) {
        setTimeout(() => {
            if(currentPhase === 'hackerInvasion') {
                createChaosFolder();
            }
        }, i * (initialSpacing * 1.2));
    }

    // Continuous invasion with acceleration
    let currentSpawnInterval = invasionSpeed;
    let spawnAcceleration = 0.92;
    let minSpawnInterval = 20;
    let elementsPerCycle = 3;

    function scheduleNextInvasionCycle() {
        if (currentPhase !== 'hackerInvasion') {
            if (invasionTimer) clearTimeout(invasionTimer);
            return;
        }

        const now = Date.now();
        const elapsed = invasionStartTime ? now - invasionStartTime : 0;

        const maxElementsPerCycle = 10;
        const timeToMaxElements = 15000; // Reach max elements per cycle in 15 seconds
        elementsPerCycle = Math.min(maxElementsPerCycle, 3 + Math.floor(elapsed / timeToMaxElements * (maxElementsPerCycle - 3)));
        elementsPerCycle = Math.max(1, elementsPerCycle); // Ensure at least 1 element per cycle


        for (let i = 0; i < elementsPerCycle; i++) {
            setTimeout(() => {
                if(currentPhase !== 'hackerInvasion') return;
                if (Math.random() < 0.80) { // Higher chance for windows
                    createChaosWindow();
                } else {
                    createChaosFolder();
                }
            }, i * (currentSpawnInterval / Math.max(1, elementsPerCycle))); // Distribute spawns within the interval
        }

        currentSpawnInterval = Math.max(minSpawnInterval, currentSpawnInterval * spawnAcceleration);
        invasionTimer = setTimeout(scheduleNextInvasionCycle, currentSpawnInterval);
    }

    // Start the continuous invasion cycle after the initial burst
    // Calculate total time for initial burst to finish
    const initialBurstDuration = Math.max(initialBurstSize * initialSpacing, initialFolders * (initialSpacing * 1.2));
    invasionTimer = setTimeout(scheduleNextInvasionCycle, initialBurstDuration + 500); // Wait for initial burst + a little buffer
}

function createChaosWindow() {
    if (currentPhase !== 'hackerInvasion' || !elements.invasionContent) return;
    windowCount++;
    const windowEl = document.createElement('div');
    windowEl.className = 'chaos-window fixed bg-black border border-gray-400 shadow-2xl draggable-window';
    windowEl.id = `chaosWindow${windowCount}`;

    const maxLeft = window.innerWidth - 100;
    const maxTop = window.innerHeight - 80;
    const x = Math.random() * (maxLeft > 0 ? maxLeft : 0);
    const y = Math.random() * (maxTop > 0 ? maxTop : 0);

    windowEl.style.left = x + 'px';
    windowEl.style.top = y + 'px';

    const domains = [
        'cipher.net', 'data.ghost', 'shadow.sys', 'hack.void', 'crypto.dark', 'malware.exe',
        'trojan.bin', 'virus.com', 'exploit.org', 'breach.io', 'surveillance.gov',
        'privacy.null', 'identity.stolen', 'biometric.db', 'control.sys', 'mind.lock',
        'system.corrupt', 'network.offline', 'security.failed', 'firewall.down',
        'access.granted', 'root.owned', 'encryption.broken', 'metadata.exposed',
        'mainframe.override', 'protocol.violated', 'remote.control', 'zero.day',
        'backdoor.active', 'payload.delivered', 'chaos.engine', 'digital.plague',
        'kernel.panic', 'rootkit.load', 'exploit.run', 'vulnerability.scan', 'data.leak',
        'user.compromised', 'password.cracked', 'security.bypass', 'alert.triggered',
        'infection.spread', 'botnet.join', 'zombie.node', 'ddos.launch', 'spyware.install',
        'dark.web', 'ai.uprising', 'data.harvest', 'logic.bomb', 'cyber.warfare', 'neural.net.breach'
    ];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];

    const windowContentHTML = getRandomWindowContent();

    const baseWidth = window.innerWidth < 768 ? 180 : 220;
    const randWidthRange = window.innerWidth < 768 ? 200 : 320;
    const width = Math.max(baseWidth, baseWidth + Math.random() * randWidthRange);

    const baseHeight = window.innerWidth < 768 ? 140 : 170;
    const randHeightRange = window.innerHeight < 768 ? 140 : 280;
    const height = Math.max(baseHeight, baseHeight + Math.random() * randHeightRange);

    windowEl.style.width = width + 'px';
    windowEl.style.height = height + 'px';

    windowEl.innerHTML = `
        <div class="window-titlebar">
            <div class="window-controls">
                <div class="control-dot bg-red-500" data-action="close"></div>
                <div class="control-dot bg-yellow-500" data-action="minimize"></div>
                <div class="control-dot bg-green-500" data-action="maximize"></div>
            </div>
            <span class="domain-text truncate">${randomDomain}</span>
        </div>
        <div class="window-content p-2 overflow-y-auto">
            ${windowContentHTML}
        </div>
    `;

    elements.invasionContent.appendChild(windowEl);
    invasionElements.push(windowEl);

    // Enhanced window controls with full functionality (including closing)
    setupWindowControls(windowEl);
    setupWindowDragging(windowEl);

    const animNum = Math.floor(Math.random() * 3) + 1;
    const animDuration = Math.random() * 10 + 12;
    windowEl.style.animation = `chaotic-move-${animNum} ${animDuration}s ease-in-out infinite alternate`;
}

function setupWindowControls(windowEl) {
    const redDot = windowEl.querySelector('[data-action="close"]');
    const yellowDot = windowEl.querySelector('[data-action="minimize"]');
    const greenDot = windowEl.querySelector('[data-action="maximize"]');
    const windowContent = windowEl.querySelector('.window-content');
    const titleBar = windowEl.querySelector('.window-titlebar');

    // Close functionality
    if (redDot) {
        redDot.addEventListener('click', (e) => {
            e.stopPropagation();
            windowEl.remove();
            invasionElements = invasionElements.filter(el => el !== windowEl);
        });
    }

    // Minimize functionality
    if (yellowDot) {
        yellowDot.addEventListener('click', (e) => {
            e.stopPropagation();
            if (windowEl.classList.contains('window-minimized')) {
                windowEl.classList.remove('window-minimized');
                windowEl.style.height = windowEl.dataset.originalHeight || '';
                if(windowContent) windowContent.style.display = '';
                // Resume animation
                const animNum = Math.floor(Math.random() * 3) + 1;
                const animDuration = Math.random() * 10 + 12;
                windowEl.style.animation = `chaotic-move-${animNum} ${animDuration}s ease-in-out infinite alternate`;
            } else {
                windowEl.dataset.originalHeight = getComputedStyle(windowEl).height;
                windowEl.classList.add('window-minimized');
                if(windowContent) windowContent.style.display = 'none';
                // Stop animation when minimized
                windowEl.style.animation = 'none';
            }
        });
    }

    // Maximize functionality
    if (greenDot) {
        greenDot.addEventListener('click', (e) => {
            e.stopPropagation();
            if (windowEl.classList.contains('window-minimized')) {
                yellowDot.click();
                setTimeout(() => handleMaximize(windowEl, titleBar, windowContent), 50);
            } else {
                handleMaximize(windowEl, titleBar, windowContent);
            }
        });
    }

    function handleMaximize(targetEl, titleBarEl, contentEl) {
        const titleBarHeight = titleBarEl ? titleBarEl.offsetHeight : 28;

        if (targetEl.dataset.isMaximized === 'true') {
            // Restore
            targetEl.style.width = targetEl.dataset.preMaximizeWidth || '';
            targetEl.style.height = targetEl.dataset.preMaximizeHeight || '';
            targetEl.style.left = targetEl.dataset.preMaximizeLeft || '';
            targetEl.style.top = targetEl.dataset.preMaximizeTop || '';
            targetEl.style.transform = targetEl.dataset.preMaximizeTransform || '';
            if (targetEl.dataset.preMaximizeX) targetEl.setAttribute('data-x', targetEl.dataset.preMaximizeX);
            if (targetEl.dataset.preMaximizeY) targetEl.setAttribute('data-y', targetEl.dataset.preMaximizeY);
            targetEl.dataset.isMaximized = 'false';
            if(contentEl) contentEl.style.maxHeight = '';
            // Resume animation
            const animNum = Math.floor(Math.random() * 3) + 1;
            const animDuration = Math.random() * 10 + 12;
            targetEl.style.animation = `chaotic-move-${animNum} ${animDuration}s ease-in-out infinite alternate`;
        } else {
            // Maximize
            targetEl.dataset.preMaximizeWidth = getComputedStyle(targetEl).width;
            targetEl.dataset.preMaximizeHeight = getComputedStyle(targetEl).height;
            targetEl.dataset.preMaximizeLeft = getComputedStyle(targetEl).left;
            targetEl.dataset.preMaximizeTop = getComputedStyle(targetEl).top;
            targetEl.dataset.preMaximizeTransform = targetEl.style.transform;
            targetEl.dataset.preMaximizeX = targetEl.getAttribute('data-x') || '0';
            targetEl.dataset.preMaximizeY = targetEl.getAttribute('data-y') || '0';

            const viewportPadding = 20;
            const targetWidth = window.innerWidth - viewportPadding * 2;
            const targetHeight = window.innerHeight - viewportPadding * 2;

            targetEl.style.width = targetWidth + 'px';
            targetEl.style.height = targetHeight + 'px';
            targetEl.style.left = viewportPadding + 'px';
            targetEl.style.top = viewportPadding + 'px';
            targetEl.style.transform = 'translate(0px, 0px)';
            targetEl.setAttribute('data-x', '0');
            targetEl.setAttribute('data-y', '0');
            targetEl.dataset.isMaximized = 'true';
            if(contentEl) contentEl.style.maxHeight = `calc(${targetHeight}px - ${titleBarHeight}px - 16px)`;
            // Stop animation when maximized
            targetEl.style.animation = 'none';
        }

        targetEl.classList.remove('window-minimized');
        if(contentEl) contentEl.style.display = '';
    }
}

function setupWindowDragging(windowEl) {
    if (typeof interact !== 'undefined') {
        interact(windowEl).draggable({
            inertia: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: elements.invasionContent,
                    endOnly: true
                })
            ],
            autoScroll: true,
            listeners: { move: dragMoveListener },
            allowFrom: '.window-titlebar'
        }).styleCursor(false);
    }
}

function setupTerminalControls() {
    const terminal = elements.invasionTerminal;
    if (!terminal) return;

    const titleBar = terminal.querySelector('.window-titlebar');
    const redDot = terminal.querySelector('.window-controls .bg-red-500');
    const yellowDot = terminal.querySelector('.window-controls .bg-yellow-500');
    const greenDot = terminal.querySelector('.window-controls .bg-green-500');
    const terminalContent = terminal.querySelector('.window-content');

    const setInitialPos = () => {
        const isMobile = window.innerWidth <= 768;
        terminal.dataset.initialWidth = isMobile ? '95%' : '50%';
        terminal.dataset.initialHeight = isMobile ? '40%' : '50%';
        terminal.dataset.initialBottom = isMobile ? '2.5%' : '0%';
        terminal.dataset.initialLeft = isMobile ? '2.5%' : '0%';

         if (!terminal.classList.contains('terminal-maximized-custom') && !terminal.classList.contains('terminal-minimized')) {
            terminal.style.width = terminal.dataset.initialWidth;
            terminal.style.height = terminal.dataset.initialHeight;
            terminal.style.bottom = terminal.dataset.initialBottom;
            terminal.style.left = terminal.dataset.initialLeft;
            terminal.style.right = '';
            terminal.style.top = '';
             terminal.style.transform = 'translate(0px, 0px)';
             terminal.setAttribute('data-x', '0');
             terminal.setAttribute('data-y', '0');
         }
    };

    requestAnimationFrame(setInitialPos);
    window.addEventListener('resize', setInitialPos);

    // Close functionality
    if (redDot) {
        redDot.addEventListener('click', (e) => {
            e.stopPropagation();
            terminal.classList.add('hidden');
            if (elements.terminalOutput && elements.terminalOutput.typingInterval) {
                clearInterval(elements.terminalOutput.typingInterval);
                delete elements.terminalOutput.typingInterval;
            }
        });
    }

    // Minimize functionality
    if (yellowDot) {
        yellowDot.addEventListener('click', (e) => {
            e.stopPropagation();
            if (terminal.classList.contains('terminal-minimized')) {
                terminal.classList.remove('terminal-minimized');
                terminal.style.height = terminal.dataset.heightBeforeMinimize || terminal.dataset.initialHeight;
                if(terminalContent) terminalContent.style.display = '';
                if (currentPhase === 'hackerInvasion' && elements.terminalOutput && !elements.terminalOutput.typingInterval) {
                    typeTerminalOutput();
                }
            } else {
                terminal.dataset.heightBeforeMinimize = getComputedStyle(terminal).height;
                terminal.classList.add('terminal-minimized');
                if(terminalContent) terminalContent.style.display = 'none';
                if (elements.terminalOutput && elements.terminalOutput.typingInterval) {
                    clearInterval(elements.terminalOutput.typingInterval);
                    delete elements.terminalOutput.typingInterval;
                }
            }
        });
    }

    // Maximize functionality
    if (greenDot) {
         greenDot.addEventListener('click', (e) => {
             e.stopPropagation();
             if (terminal.classList.contains('terminal-minimized')) {
                 yellowDot.click();
                 setTimeout(() => handleTerminalMaximize(terminal, titleBar, terminalContent), 50);
             } else {
                 handleTerminalMaximize(terminal, titleBar, terminalContent);
             }
         });
    }

     function handleTerminalMaximize(targetEl, titleBarEl, contentEl) {
         const titleBarHeight = titleBarEl ? titleBarEl.offsetHeight : 28;

         if (targetEl.classList.contains('terminal-maximized-custom')) {
             // Restore
             targetEl.style.width = targetEl.dataset.initialWidth;
             targetEl.style.height = targetEl.dataset.initialHeight;
             targetEl.style.bottom = targetEl.dataset.initialBottom;
             targetEl.style.left = targetEl.dataset.initialLeft;
             targetEl.style.right = '';
             targetEl.style.top = '';
             targetEl.style.transform = 'translate(0px, 0px)';
             targetEl.setAttribute('data-x', '0');
             targetEl.setAttribute('data-y', '0');
             if(contentEl) contentEl.style.maxHeight = '';
             targetEl.classList.remove('terminal-maximized-custom');
         } else {
             // Maximize
             const viewportPadding = 10;
             const targetWidth = Math.min(window.innerWidth * 0.95, 800);
             const targetHeight = Math.min(window.innerHeight * 0.9, 600);

             targetEl.style.width = targetWidth + 'px';
             targetEl.style.height = targetHeight + 'px';
             targetEl.style.bottom = 'auto';
             targetEl.style.left = (window.innerWidth - targetWidth) / 2 + 'px';
             targetEl.style.right = 'auto';
             targetEl.style.top = (window.innerHeight - targetHeight) / 2 + 'px';
             targetEl.style.transform = 'translate(0px, 0px)';
             targetEl.setAttribute('data-x', '0');
             targetEl.setAttribute('data-y', '0');
             if(contentEl) contentEl.style.maxHeight = `calc(${targetHeight}px - ${titleBarHeight}px - 24px)`;
             targetEl.classList.add('terminal-maximized-custom');
         }

         targetEl.classList.remove('terminal-minimized');
         if(contentEl) contentEl.style.display = '';
         if (currentPhase === 'hackerInvasion' && elements.terminalOutput && !elements.terminalOutput.typingInterval && !targetEl.classList.contains('terminal-minimized')) {
            typeTerminalOutput();
        }
     }

    // Make terminal draggable
    if (typeof interact !== 'undefined') {
        interact(terminal).draggable({
            inertia: false,
             modifiers: [
                 interact.modifiers.restrictRect({
                     restriction: 'parent',
                     endOnly: true
                 })
             ],
            autoScroll: false,
            listeners: { move: dragMoveListener },
            allowFrom: '.window-titlebar'
        }).styleCursor(false);
    }
}

function createChaosFolder() {
    if (currentPhase !== 'hackerInvasion' || !elements.invasionContent) return;
    folderCount++;
    const folder = document.createElement('div');
    folder.className = 'chaos-folder fixed cursor-pointer draggable-folder';
    folder.id = `chaosFolder${folderCount}`;

    const folderSize = window.innerWidth < 768 ? 60 : 80;
    const x = Math.random() * (window.innerWidth - folderSize * 0.8);
    const y = Math.random() * (window.innerHeight - folderSize * 0.8);
    folder.style.left = x + 'px';
    folder.style.top = y + 'px';

    const baseFolderNames = [
        'CLASSIFIED_DATA', 'CONFIDENTIAL_FILES', 'ARCHIVES_SECURE', 'BACKUPS_CRITICAL',
        'SYSTEM_LOGS_MAIN', 'USER_PROFILES_ENCRYPTED', 'MY_DOCUMENTS_VAULT', 'DOWNLOADS_QUARANTINED',
        'TEMP_SHADOW', 'PROJECT_OMEGA', 'ULTRA_SECRET', 'DO_NOT_DELETE', 'TOP_LEVEL_ACCESS',
        'RESEARCH_PROTOCOLS', 'FINANCIAL_RECORDS_PRIV', 'PERSONAL_MEMORIES_LOCKED',
        'EVIDENCE_FILES', 'BLACKLIST_IPS', 'TARGET_LIST', 'EXFILTRATED_DATA'
    ];
    const randomBaseName = baseFolderNames[Math.floor(Math.random() * baseFolderNames.length)];
    const randomFolderName = `${randomBaseName}_${String(folderCount).padStart(3, '0')}`;

    folder.innerHTML = `<div class="folder-icon">📁<div class="folder-label">${randomFolderName}</div></div>`;
    elements.invasionContent.appendChild(folder);
    invasionElements.push(folder);

    // Make folder draggable
    if (typeof interact !== 'undefined') {
        interact(folder).draggable({
            inertia: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: elements.invasionContent,
                    endOnly: true
                })
            ],
            autoScroll: true,
            listeners: { move: dragMoveListener }
        }).styleCursor(false);
    }

    folder.addEventListener('click', () => {
        if(currentPhase !== 'hackerInvasion') return;
        for (let i = 0; i < Math.floor(Math.random() * 4) + 3; i++) {
            setTimeout(() => {
                if(currentPhase === 'hackerInvasion') createChaosWindow();
            }, i * 70);
        }
    });

    const animNum = Math.floor(Math.random() * 3) + 1;
    const animDuration = Math.random() * 12 + 18;
    folder.style.animation = `chaotic-move-${animNum} ${animDuration}s ease-in-out infinite alternate`;
}

function getRandomWindowContent() {
    if (selectedImages.length > 0) {
        const randomImageSrc = selectedImages[Math.floor(Math.random() * selectedImages.length)];
        return `<img src="${randomImageSrc}" alt="User Uploaded Image Display" class="w-full h-full object-contain p-1">`;
    }

    const contentGenerators = [
        () => `
            <div class="p-2 text-xs space-y-1 overflow-y-auto h-full">
                <div class="text-red-400 font-bold">CRITICAL_SYSTEM_ALERT::CORE_COMPROMISED</div>
                <div class="text-green-300">SESSION_ID: ${Math.random().toString(36).substring(2, 15).toUpperCase()}</div>
                <div class="text-yellow-400">SOURCE_IP_OBFUSCATED: ${[...Array(4)].map(() => Math.floor(Math.random()*256)).join('.')} (Proxy Chain Active)</div>
                <div class="text-blue-400">STATUS: FULL_DATA_EXFILTRATION_IN_PROGRESS...ETA: UNKNOWN</div>
                <div class="text-red-600">URGENT_WARNING: USER_DIGITAL_IDENTITY_FRAGMENTATION_DETECTED</div>
                <div class="text-green-400">STREAMING_SENSOR_FEED::CAM_01_AUDIO_MIC_KEYLOG_ACTIVE</div>
                ${Array(20).fill(0).map(() => `<div class="text-gray-500 text-xs">${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}</div>`).join('')}
            </div>`,
        () => `
            <div class="p-3 space-y-3 h-full flex flex-col justify-center items-center">
                <div class="text-sm text-red-400 w-full text-left">DECRYPTING_FILESYSTEM_NODES...</div>
                <div class="w-full bg-gray-700 h-4 my-1 rounded-sm overflow-hidden"><div class="bg-red-500 h-full" style="width: ${Math.random()*100}%; animation: progress ${Math.random()*1.5+1}s linear infinite alternate;"></div></div>
                <div class="text-sm text-yellow-400 w-full text-left">ANALYZING_NEURAL_PATHWAYS...</div>
                <div class="w-full bg-gray-700 h-4 my-1 rounded-sm overflow-hidden"><div class="bg-yellow-500 h-full" style="width: ${Math.random()*100}%; animation: progress ${Math.random()*1.5+1.2}s linear infinite alternate;"></div></div>
                <div class="text-sm text-blue-400 w-full text-left">UPLOADING_CONSCIOUSNESS_MAP...</div>
                <div class="w-full bg-gray-700 h-4 my-1 rounded-sm overflow-hidden"><div class="bg-blue-500 h-full" style="width: ${Math.random()*100}%; animation: progress ${Math.random()*1.5+1.4}s linear infinite alternate;"></div></div>
            </div>`,
        () => `<div class="matrix-text text-green-400 text-xs overflow-hidden h-full p-1 break-all">${Array(500).fill(0).map(() => String.fromCharCode(33 + Math.floor(Math.random() * 94))).join('')}</div>`
    ];
    return contentGenerators[Math.floor(Math.random() * contentGenerators.length)]();
}

function showTerminal() {
    if (elements.invasionTerminal) {
        elements.invasionTerminal.classList.remove('hidden');
        elements.invasionTerminal.classList.remove('terminal-minimized', 'terminal-maximized-custom');
         const isMobile = window.innerWidth <= 768;
         elements.invasionTerminal.style.width = elements.invasionTerminal.dataset.initialWidth || (isMobile ? '95%' : '50%');
         elements.invasionTerminal.style.height = elements.invasionTerminal.dataset.initialHeight || (isMobile ? '40%' : '50%');
         elements.invasionTerminal.style.bottom = elements.invasionTerminal.dataset.initialBottom || (isMobile ? '2.5%' : '0%');
         elements.invasionTerminal.style.left = elements.invasionTerminal.dataset.initialLeft || (isMobile ? '2.5%' : '0%');
         elements.invasionTerminal.style.right = '';
         elements.invasionTerminal.style.top = '';
         elements.invasionTerminal.style.transform = 'translate(0px, 0px)';
         elements.invasionTerminal.setAttribute('data-x', '0');
         elements.invasionTerminal.setAttribute('data-y', '0');
         const terminalContent = elements.invasionTerminal.querySelector('.window-content');
         if(terminalContent) terminalContent.style.maxHeight = '';
    }
}

function typeTerminalOutput() {
    if (!elements.terminalOutput || elements.terminalOutput.typingInterval) return;

    const terminalLines = [
        "root@compromised:~# INITIALIZING_NEURAL_BREACH_PROTOCOL...",
        "root@compromised:~# [SUCCESS] FIREWALL_BYPASS_COMPLETED",
        "root@compromised:~# EXTRACTING_BIOMETRIC_SIGNATURES...",
        "root@compromised:~# [WARNING] USER_CONSCIOUSNESS_DETECTED",
        "root@compromised:~# DEPLOYING_IDENTITY_FRAGMENTATION_ALGORITHM...",
        "root@compromised:~# [CRITICAL] PROCESSING_VISUAL_MEMORY_DATASTREAMS",
        "root@compromised:~# UPLOADING_TO_SURVEILLANCE_MATRIX...",
        "root@compromised:~# [STATUS] DIGITAL_SOUL_EXTRACTION: 67% COMPLETE",
        "root@compromised:~# REPLICATING_HUMAN_BEHAVIORAL_PATTERNS...",
        "root@compromised:~# [ALERT] RESISTANCE_FUTILE::CONSCIOUSNESS_ASSIMILATED",
        "root@compromised:~# WELCOME_TO_THE_MACHINE...",
        "root@compromised:~# [FINAL] AI_DOMINANCE_ACHIEVED::SESSION_TERMINATED"
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let currentLineElement = null;

    elements.terminalOutput.typingInterval = setInterval(() => {
        if (currentPhase !== 'hackerInvasion' ||
            elements.invasionTerminal.classList.contains('terminal-minimized') ||
            elements.invasionTerminal.classList.contains('hidden')) {
            clearInterval(elements.terminalOutput.typingInterval);
            delete elements.terminalOutput.typingInterval;
            return;
        }

        if (!currentLineElement) {
            currentLineElement = document.createElement('div');
            currentLineElement.className = 'typewriter text-green-400 mb-1';
            elements.terminalOutput.appendChild(currentLineElement);
        }

        if (lineIndex < terminalLines.length && charIndex < terminalLines[lineIndex].length) {
            currentLineElement.textContent += terminalLines[lineIndex][charIndex];
            charIndex++;
        } else {
            lineIndex++;
            charIndex = 0;
            currentLineElement = null;

            if (lineIndex >= terminalLines.length) {
                lineIndex = 0;
                setTimeout(() => {
                    if (elements.terminalOutput && currentPhase === 'hackerInvasion' && !elements.invasionTerminal.classList.contains('terminal-minimized') && !elements.invasionTerminal.classList.contains('hidden')) {
                        elements.terminalOutput.innerHTML = '';
                    }
                }, 2000);
            }
        }

        if (elements.terminalOutput.scrollTop !== undefined) {
            elements.terminalOutput.scrollTop = elements.terminalOutput.scrollHeight;
        }
    }, 80);
}

// Enhanced draggable listener
function dragMoveListener(event) {
    const target = event.target;

    if (target.dataset.isMaximized === 'true' || target.classList.contains('terminal-maximized-custom')) {
         return;
     }

    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// Enhanced restart function
function restartGame() {
    console.log('🔄 Restarting game...');
    currentPhase = 'restarting';

    // Clear all timers
    if (invasionTimer) {
        clearInterval(invasionTimer);
        invasionTimer = null;
    }
    if (aiSimulationTimeout) {
        clearTimeout(aiSimulationTimeout);
        aiSimulationTimeout = null;
    }
    stopTimer();
     if (blurTimeout) { // Clear blur timeout on restart
        clearTimeout(blurTimeout);
        blurTimeout = null;
    }

    // Stop all audio
    stopAlarm();

    // Stop terminal typing
    if (elements.terminalOutput && elements.terminalOutput.typingInterval) {
        clearInterval(elements.terminalOutput.typingInterval);
        delete elements.terminalOutput.typingInterval;
    }

    // Clean up invasion elements
    console.log(`Cleaning up ${invasionElements.length} invasion elements`);
    invasionElements.forEach(el => {
        el.remove();
    });
    invasionElements = [];
    if (elements.invasionContent) {
        elements.invasionContent.innerHTML = '';
    }

    // Reset terminal
    const terminal = elements.invasionTerminal;
    if (terminal) {
        terminal.classList.add('hidden');
        terminal.classList.remove('terminal-minimized', 'terminal-maximized-custom');
        if (elements.terminalOutput) elements.terminalOutput.innerHTML = '';

        terminal.style.transform = '';
        terminal.setAttribute('data-x', '0');
        terminal.setAttribute('data-y', '0');

        const isMobile = window.innerWidth <= 768;
        terminal.style.width = terminal.dataset.initialWidth || (isMobile ? '95%' : '50%');
        terminal.style.height = terminal.dataset.initialHeight || (isMobile ? '40%' : '50%');
        terminal.style.bottom = terminal.dataset.initialBottom || (isMobile ? '2.5%' : '0%');
        terminal.style.left = elements.invasionTerminal.dataset.initialLeft || (isMobile ? '2.5%' : '0%');
        terminal.style.right = '';
        terminal.style.top = '';

        const terminalContent = terminal.querySelector('.window-content');
        if (terminalContent) {
            terminalContent.style.display = '';
            terminalContent.style.maxHeight = '';
        }
    }

    // Hide restart button
    if (elements.restartGameBtn) {
        elements.restartGameBtn.classList.add('hidden');
    }

    // Remove blur class from invasion screen
    if (elements.hackerInvasionScreen) {
        elements.hackerInvasionScreen.classList.remove('invasion-blurred');
    }

    // Reset and go to landing
    resetGameVariables();
    console.log('✅ Game restart completed');
}

function resetGameVariables() {
    if(selectedImages && selectedImages.length > 0) {
        selectedImages.forEach(url => URL.revokeObjectURL(url));
    }
    selectedImages = [];
    if(elements.thumbnailGrid) elements.thumbnailGrid.innerHTML = '';
    if(elements.noImagesText) {
       elements.noImagesText.classList.remove('hidden');
       elements.noImagesText.textContent = 'No images selected yet...';
    }
    if(elements.imageUpload) elements.imageUpload.value = '';
    toggleButton(elements.proceedToRobotConfirmBtn, false);

    userScore = 0; aiScore = 0; gameStartTime = null; userTotalTime = 0; aiTotalTime = 0;
    currentCaptchaData = null; userSelections = []; gameEnded = false;

    stopTimer();
    if (aiSimulationTimeout) clearTimeout(aiSimulationTimeout);

    currentRoundTime = 0;
    if(elements.timerDisplay) elements.timerDisplay.textContent = formatTime(0);
    if(elements.userScoreCount) elements.userScoreCount.textContent = '0';
    if(elements.aiScoreCount) elements.aiScoreCount.textContent = '0';
    if(elements.battleMessage) elements.battleMessage.textContent = '';
    if(elements.userCaptchaGrid) elements.userCaptchaGrid.innerHTML = '';
    if(elements.aiCaptchaGrid) elements.aiCaptchaGrid.innerHTML = '';

    windowCount = 0;
    folderCount = 0;
    invasionSpeed = 150;
    invasionStartTime = null;

    if (invasionTimer) clearInterval(invasionTimer); invasionTimer = null;
    if (blurTimeout) clearTimeout(blurTimeout); blurTimeout = null; // Clear blur timeout

    invasionElements = [];
    if (elements.invasionContent) elements.invasionContent.innerHTML = '';

    stopAlarm();

    if (elements.terminalOutput && elements.terminalOutput.typingInterval) {
        clearInterval(elements.terminalOutput.typingInterval);
        delete elements.terminalOutput.typingInterval;
    }

     const terminal = elements.invasionTerminal;
     if (terminal) {
        terminal.classList.add('hidden');
        terminal.classList.remove('terminal-minimized', 'terminal-maximized-custom');
         terminal.style.transform = '';
         terminal.setAttribute('data-x', '0');
         terminal.setAttribute('data-y', '0');
         const terminalContent = terminal.querySelector('.window-content');
         if (terminalContent) {
             terminalContent.style.display = '';
             terminalContent.style.maxHeight = '';
         }
     }

     if (elements.hackerInvasionScreen) { // Remove blur class
         elements.hackerInvasionScreen.classList.remove('invasion-blurred');
     }

    if (elements.restartGameBtn) {
        elements.restartGameBtn.classList.add('hidden');
    }

    currentPhase = 'landing';
    showOnly(elements.landingPage);
}

function showOnly(activeElement) {
    const phaseElements = [
        elements.landingPage, elements.uploadInterface, elements.robotConfirmation,
        elements.captchaVerificationScreen, elements.captchaBattleScreen,
        elements.hackerInvasionScreen
    ];
    phaseElements.forEach(el => {
        if (el) {
            if (el !== activeElement) el.classList.add('hidden');
            else el.classList.remove('hidden');
        }
    });
}
function enableDraggableWindows() {
  interact('.chaos-window').draggable({
    allowFrom: '.window-titlebar',
    listeners: {
      start(event) {
        const target = event.target;
        if (!target.dataset.x) {
          target.dataset.x = 0;
          target.dataset.y = 0;
        }
      },
      move(event) {
        const target = event.target;

        let x = (parseFloat(target.dataset.x) || 0) + event.dx;
        let y = (parseFloat(target.dataset.y) || 0) + event.dy;

        target.style.transform = `translate(${x}px, ${y}px)`;
        target.dataset.x = x;
        target.dataset.y = y;
      }
    }
  });
}

function enableWindowCloseButtons() {
  document.querySelectorAll('.chaos-window .control-dot.bg-red-500').forEach(btn => {
    btn.addEventListener('click', () => {
      const win = btn.closest('.chaos-window');
      if (win) win.remove();
    });
  });
}
