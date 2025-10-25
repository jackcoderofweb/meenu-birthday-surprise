/*
 * Anonymous 18th Birthday Surprise Page - JavaScript
 * 
 * CUSTOMIZATION GUIDE:
 * - To change quotes: Update the quotes array below
 * - To modify animation timing: Adjust the setTimeout delays
 * - To change confetti colors: Update the confettiColors array
 * - To add more surprise content: Extend the surpriseContent object
 * - To change music: Update the audio source in HTML
 */

// Configuration Object - Easy to customize
const CONFIG = {
    // Birthday quotes - Add or modify these messages
    quotes: [
        "Eighteen candles, one wish — may your life glow brighter than all of them combined.",
        "Somewhere, someone is smiling right now, just because you exist.",
        "God bless the dinosaurs who became fuel, so the car could take your mom to the hospital the day you were born.",
        "You've officially entered adulthood — but may your heart stay as curious as when you were five.",
        "If happiness were a playlist, may your song never end.",
        "Anonymous wishes you a day too beautiful to forget."
    ],
    
    // Confetti colors for celebrations
    confettiColors: [
        '#ff6b9d', '#ff8fab', '#ffb3c6', '#a8dadc', '#457b9d', 
        '#fbbf24', '#c77dff', '#e0aaff', '#f1faee'
    ],
    
    // Animation delays (in milliseconds)
    delays: {
        loading: 2000,
        titleReveal: 1000,
        cakeAppear: 3000,
        candlesLight: 4000,
        messageFade: 5000,
        quotesFade: 6000,
        surpriseButton: 7000,
        quoteRotation: 8000
    }
};

// Global variables
let currentQuoteIndex = 0;
let quoteRotationInterval;
let isMusicPlaying = false;
let audioEnabled = false;

// DOM Elements
const elements = {
    loadingScreen: document.getElementById('loadingScreen'),
    birthdayTitle: document.getElementById('birthdayTitle'),
    cakeContainer: document.getElementById('cakeContainer'),
    birthdayMessage: document.getElementById('birthdayMessage'),
    quotesSection: document.getElementById('quotesSection'),
    surpriseSection: document.getElementById('surpriseSection'),
    surpriseButton: document.getElementById('surpriseButton'),
    surpriseContent: document.getElementById('surpriseContent'),
    currentQuote: document.getElementById('currentQuote'),
    musicToggle: document.getElementById('musicToggle'),
    backgroundMusic: document.getElementById('backgroundMusic'),
    confettiCanvas: document.getElementById('confettiCanvas')
};

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    testAudioFile();
    attemptAutoplay();
    testSurpriseElements();
});

/**
 * Test if the audio file can be loaded
 */
function testAudioFile() {
    const testAudio = document.getElementById('testAudio');
    if (testAudio) {
        testAudio.load();
    }
    
    if (elements.backgroundMusic) {
        elements.backgroundMusic.volume = 0.05;
    }
}

/**
 * Test surprise elements
 */
function testSurpriseElements() {
    // Simple test - no console logs
}

/**
 * Main initialization function
 * Sets up all animations and event listeners
 */
function initializePage() {
    // Hide loading screen after delay
    setTimeout(() => {
        hideLoadingScreen();
    }, CONFIG.delays.loading);
    
    // Start title letter animation
    setTimeout(() => {
        animateTitleLetters();
    }, CONFIG.delays.titleReveal);
    
    // Start quote rotation
    setTimeout(() => {
        startQuoteRotation();
    }, CONFIG.delays.quoteRotation);
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize GSAP animations
    initializeGSAPAnimations();
}

/**
 * Hide the loading screen with fade out effect
 */
function hideLoadingScreen() {
    if (elements.loadingScreen) {
        elements.loadingScreen.classList.add('hidden');
        setTimeout(() => {
            elements.loadingScreen.style.display = 'none';
        }, 500);
    }
}

/**
 * Animate title letters appearing one by one
 */
function animateTitleLetters() {
    const letters = elements.birthdayTitle.querySelectorAll('.letter');
    
    letters.forEach((letter, index) => {
        setTimeout(() => {
            letter.style.animationDelay = `${index * 0.1}s`;
            letter.classList.add('animate');
        }, index * 100);
    });
}

/**
 * Start automatic quote rotation
 */
function startQuoteRotation() {
    // Rotate quotes every 4 seconds
    quoteRotationInterval = setInterval(() => {
        rotateQuote();
    }, 4000);
    
    // Setup manual quote navigation
    setupQuoteNavigation();
}

/**
 * Rotate to the next quote with smooth transition
 */
function rotateQuote() {
    currentQuoteIndex = (currentQuoteIndex + 1) % CONFIG.quotes.length;
    updateQuoteDisplay();
    updateQuoteIndicators();
}

/**
 * Update the displayed quote with fade effect
 */
function updateQuoteDisplay() {
    if (elements.currentQuote) {
        // Fade out
        elements.currentQuote.style.opacity = '0';
        
        setTimeout(() => {
            // Change text
            elements.currentQuote.textContent = `"${CONFIG.quotes[currentQuoteIndex]}"`;
            
            // Fade in
            elements.currentQuote.style.opacity = '1';
        }, 300);
    }
}

/**
 * Update quote indicator dots
 */
function updateQuoteIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentQuoteIndex);
    });
}

/**
 * Setup manual quote navigation
 */
function setupQuoteNavigation() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentQuoteIndex = index;
            updateQuoteDisplay();
            updateQuoteIndicators();
            
            // Reset auto-rotation timer
            clearInterval(quoteRotationInterval);
            quoteRotationInterval = setInterval(() => {
                rotateQuote();
            }, 4000);
        });
    });
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Music toggle
    if (elements.musicToggle) {
        elements.musicToggle.addEventListener('click', toggleMusic);
    }
    
    // Surprise button - add both click and touch events for mobile
    if (elements.surpriseButton) {
        elements.surpriseButton.addEventListener('click', showSurprise);
        elements.surpriseButton.addEventListener('touchstart', handleSurpriseTouch, { passive: false });
    }
    
    // Close surprise content
    if (elements.surpriseContent) {
        elements.surpriseContent.addEventListener('click', (e) => {
            if (e.target === elements.surpriseContent) {
                hideSurprise();
            }
        });
        
        elements.surpriseContent.addEventListener('touchstart', (e) => {
            if (e.target === elements.surpriseContent) {
                hideSurprise();
            }
        });
    }
    
    // Enable audio on first user interaction
    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('touchstart', enableAudio, { once: true });
    document.addEventListener('keydown', enableAudio, { once: true });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Touch events for mobile
    setupTouchEvents();
}

/**
 * Enable audio after first user interaction
 */
function enableAudio() {
    audioEnabled = true;
    console.log('Audio enabled after user interaction');
}

/**
 * Handle surprise button touch events for mobile
 */
function handleSurpriseTouch(event) {
    event.preventDefault();
    event.stopPropagation();
    
    elements.surpriseButton.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        showSurprise();
        elements.surpriseButton.style.transform = 'scale(1)';
    }, 150);
}

/**
 * Attempt to autoplay music
 */
function attemptAutoplay() {
    // Try multiple autoplay attempts
    const tryAutoplay = (attempt = 1) => {
        if (elements.backgroundMusic && !isMusicPlaying) {
            console.log(`🎵 Attempting autoplay (attempt ${attempt})...`);
            
            // Set volume before playing
            elements.backgroundMusic.volume = 0.05;
            
            const playPromise = elements.backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('✅ Autoplay successful!');
                    isMusicPlaying = true;
                    elements.musicToggle.innerHTML = '<i class="fas fa-pause"></i><span class="music-text">Pause Music</span>';
                    // Hide any existing hints
                    hideAutoplayHints();
                }).catch(error => {
                    console.log(`❌ Autoplay blocked (attempt ${attempt}):`, error);
                    
                    if (attempt < 3) {
                        // Try again after a longer delay
                        setTimeout(() => tryAutoplay(attempt + 1), 3000);
                    } else {
                        // Show user-friendly hint after all attempts fail
                        showAutoplayHint();
                    }
                });
            }
        }
    };
    
    // First attempt after 1 second
    setTimeout(() => tryAutoplay(1), 1000);
    
    // Second attempt after 3 seconds
    setTimeout(() => tryAutoplay(2), 3000);
    
    // Third attempt after 5 seconds
    setTimeout(() => tryAutoplay(3), 5000);
}

/**
 * Hide any existing autoplay hints
 */
function hideAutoplayHints() {
    const existingHints = document.querySelectorAll('.autoplay-hint');
    existingHints.forEach(hint => hint.remove());
}

/**
 * Show subtle hint about music
 */
function showAutoplayHint() {
    // Hide any existing hints first
    hideAutoplayHints();
    
    const hint = document.createElement('div');
    hint.className = 'autoplay-hint';
    
    // Check if mobile
    const isMobile = window.innerWidth <= 768;
    
    hint.style.cssText = `
        position: fixed;
        top: ${isMobile ? '70px' : '20px'};
        right: ${isMobile ? '15px' : '20px'};
        background: linear-gradient(135deg, rgba(255, 107, 157, 0.95), rgba(255, 139, 171, 0.95));
        color: white;
        padding: ${isMobile ? '10px 14px' : '12px 18px'};
        border-radius: 25px;
        font-size: ${isMobile ? '12px' : '14px'};
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.5s ease-out;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
        max-width: ${isMobile ? '200px' : 'none'};
        text-align: center;
    `;
    hint.innerHTML = '🎵 Click to play birthday music';
    
    // Add hover effect
    hint.addEventListener('mouseenter', () => {
        hint.style.transform = 'scale(1.05)';
        hint.style.boxShadow = '0 6px 20px rgba(255, 107, 157, 0.4)';
    });
    
    hint.addEventListener('mouseleave', () => {
        hint.style.transform = 'scale(1)';
        hint.style.boxShadow = '0 4px 15px rgba(255, 107, 157, 0.3)';
    });
    
    // Add click handler to play music
    hint.addEventListener('click', () => {
        toggleMusic();
        hint.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => hint.remove(), 300);
    });
    
    document.body.appendChild(hint);
    
    // Auto remove after 8 seconds
    setTimeout(() => {
        if (hint.parentNode) {
            hint.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => hint.remove(), 300);
        }
    }, 8000);
}

/**
 * Toggle background music
 */
function toggleMusic() {
    if (!elements.backgroundMusic) {
        console.error('Audio element not found');
        return;
    }
    
    if (isMusicPlaying) {
        // Pause the music
        elements.backgroundMusic.pause();
        elements.musicToggle.innerHTML = '<i class="fas fa-music"></i><span class="music-text">Play Music</span>';
        isMusicPlaying = false;
        console.log('Music paused');
    } else {
        // Play the music
        console.log('Attempting to play music...');
        
        // Add event listeners for debugging (only once)
        if (!elements.backgroundMusic.hasAttribute('data-listeners-added')) {
            elements.backgroundMusic.addEventListener('loadstart', () => console.log('Audio: Load started'));
            elements.backgroundMusic.addEventListener('loadeddata', () => console.log('Audio: Data loaded'));
            elements.backgroundMusic.addEventListener('canplay', () => console.log('Audio: Can play'));
            elements.backgroundMusic.addEventListener('error', (e) => {
                console.error('Audio error:', e);
                console.error('Audio error details:', elements.backgroundMusic.error);
                showMusicErrorMessage();
            });
            elements.backgroundMusic.setAttribute('data-listeners-added', 'true');
        }
        
        // Try to play the audio
        const playPromise = elements.backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Audio started playing successfully');
                elements.musicToggle.innerHTML = '<i class="fas fa-pause"></i><span class="music-text">Pause Music</span>';
                isMusicPlaying = true;
            }).catch(error => {
                console.log('Music autoplay prevented:', error);
                // This is normal - browsers block autoplay
                // The user needs to interact with the page first
                if (!audioEnabled) {
                    showMusicMessage();
                } else {
                    // If audio is enabled but still fails, show error
                    showMusicErrorMessage();
                }
            });
        }
    }
}

/**
 * Show message about music autoplay
 */
function showMusicMessage() {
    // Create a temporary message
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 107, 157, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 10000;
        text-align: center;
        backdrop-filter: blur(10px);
    `;
    message.innerHTML = '<p>Click the music button to play background music! 🎵</p>';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

/**
 * Show error message for audio issues
 */
function showMusicErrorMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(220, 53, 69, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 10000;
        text-align: center;
        backdrop-filter: blur(10px);
        max-width: 300px;
    `;
    message.innerHTML = `
        <p>🎵 Audio Issue Detected</p>
        <p style="font-size: 0.9em; margin-top: 10px;">
            Check browser console for details.<br>
            Try refreshing the page or using a different browser.
        </p>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

/**
 * Show surprise content with confetti
 */
function showSurprise() {
    // Trigger confetti
    triggerConfetti();
    
    // Show surprise content
    if (elements.surpriseContent) {
        elements.surpriseContent.style.display = 'flex';
        elements.surpriseContent.style.opacity = '1';
        elements.surpriseContent.style.visibility = 'visible';
        elements.surpriseContent.style.zIndex = '10000';
    }
    
    // Hide surprise button
    if (elements.surpriseButton) {
        elements.surpriseButton.style.display = 'none';
    }
}

/**
 * Hide surprise content
 */
function hideSurprise() {
    if (elements.surpriseContent) {
        elements.surpriseContent.style.display = 'none';
        elements.surpriseContent.style.opacity = '0';
        elements.surpriseContent.style.visibility = 'hidden';
    }
    
    if (elements.surpriseButton) {
        elements.surpriseButton.style.display = 'block';
    }
}

/**
 * Trigger confetti animation
 */
function triggerConfetti() {
    if (typeof confetti !== 'undefined') {
        // Multiple confetti bursts
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        
        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }
        
        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            
            const particleCount = 50 * (timeLeft / duration);
            
            // Left side confetti
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: CONFIG.confettiColors
            });
            
            // Right side confetti
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: CONFIG.confettiColors
            });
        }, 250);
    }
}

/**
 * Handle keyboard navigation
 */
function handleKeyboardNavigation(event) {
    switch(event.key) {
        case 'Escape':
            hideSurprise();
            break;
        case ' ':
        case 'Enter':
            if (event.target === elements.surpriseButton) {
                showSurprise();
            }
            break;
        case 'm':
        case 'M':
            toggleMusic();
            break;
    }
}

/**
 * Setup touch events for mobile devices
 */
function setupTouchEvents() {
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - could trigger surprise
                console.log('Swipe up detected');
            } else {
                // Swipe down - could hide surprise
                hideSurprise();
            }
        }
    }
}

/**
 * Initialize GSAP animations for enhanced effects
 */
function initializeGSAPAnimations() {
    if (typeof gsap !== 'undefined') {
        // Enhanced title animation
        gsap.fromTo('.birthday-title .letter', 
            { 
                opacity: 0, 
                y: 50, 
                rotationX: 90 
            },
            { 
                opacity: 1, 
                y: 0, 
                rotationX: 0, 
                duration: 0.6, 
                stagger: 0.1,
                ease: "back.out(1.7)"
            }
        );
        
        // Cake bounce animation
        gsap.fromTo('.cake', 
            { 
                scale: 0, 
                rotation: 180 
            },
            { 
                scale: 1, 
                rotation: 0, 
                duration: 1, 
                delay: 3,
                ease: "elastic.out(1, 0.3)"
            }
        );
        
        // Floating balloons animation
        gsap.to('.floating-balloons::before', {
            y: -20,
            rotation: 5,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        gsap.to('.floating-balloons::after', {
            y: -15,
            rotation: -3,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1
        });
    }
}

/**
 * Add sparkle effects on mouse movement
 */
document.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.1) { // 10% chance
        createSparkle(e.clientX, e.clientY);
    }
});

/**
 * Create a sparkle effect at given coordinates
 */
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 1000;
        font-size: 1rem;
        animation: sparkle 1s ease-out forwards;
    `;
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

/**
 * Add birthday countdown (if needed)
 */
function addBirthdayCountdown() {
    // This function can be used to add a countdown timer
    // to the next birthday or special event
    const now = new Date();
    const birthday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // Example: tomorrow
    
    const timeDiff = birthday.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysLeft > 0) {
        console.log(`Days until next special day: ${daysLeft}`);
    }
}

/**
 * Utility function to add random floating elements
 */
function addFloatingElements() {
    const elements = ['🎈', '🎉', '✨', '💫', '🌟'];
    
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every interval
            const element = document.createElement('div');
            element.innerHTML = elements[Math.floor(Math.random() * elements.length)];
            element.style.cssText = `
                position: fixed;
                left: ${Math.random() * window.innerWidth}px;
                top: ${window.innerHeight + 50}px;
                font-size: 2rem;
                pointer-events: none;
                z-index: 1;
                animation: floatUp 8s linear forwards;
            `;
            
            document.body.appendChild(element);
            
            setTimeout(() => {
                element.remove();
            }, 8000);
        }
    }, 2000);
}

// Add CSS for floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Start floating elements after page load
window.addEventListener('load', () => {
    setTimeout(addFloatingElements, 5000);
});

// Emergency restore function - call this if screen gets stuck
window.restoreScreen = function() {
    console.log('🚨 Emergency restore called');
    document.body.style.overflow = '';
    if (elements.surpriseButton) {
        elements.surpriseButton.style.display = 'block';
    }
    if (elements.surpriseContent) {
        elements.surpriseContent.style.display = 'none';
        elements.surpriseContent.style.opacity = '0';
        elements.surpriseContent.style.visibility = 'hidden';
    }
    console.log('✅ Screen restored');
};

// Export functions for potential external use
window.BirthdaySurprise = {
    showSurprise,
    hideSurprise,
    triggerConfetti,
    toggleMusic,
    rotateQuote,
    CONFIG,
    restoreScreen: window.restoreScreen
};