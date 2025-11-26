const API_URL = '/api';

// --- Clicker Logic ---
const clickDisplay = document.getElementById('click-display');
const clickBtn = document.getElementById('click-btn');

if (clickDisplay && clickBtn) {
    async function updateClickDisplay() {
        const res = await fetch(`${API_URL}/clicks`);
        const data = await res.json();
        clickDisplay.innerText = data.clicks;
    }

    clickBtn.addEventListener('click', async () => {
        const res = await fetch(`${API_URL}/clicks`, { method: 'POST' });
        const data = await res.json();
        clickDisplay.innerText = data.clicks;
        
        // Simple animation effect
        clickBtn.style.transform = 'scale(0.95)';
        setTimeout(() => clickBtn.style.transform = 'scale(1)', 100);
    });

    setInterval(updateClickDisplay, 2000); // Poll for updates every 2s
    updateClickDisplay();
}

// --- Guestbook Logic ---
const gbForm = document.getElementById('guestbook-form');
const gbEntries = document.getElementById('guestbook-entries');

async function loadGuestbook() {
    if (!gbEntries) return;
    
    const res = await fetch(`${API_URL}/guestbook`);
    const entries = await res.json();

    if (entries.length === 0) {
        gbEntries.innerHTML = '<p style="color: #888; font-style: italic;">No entries yet. Go add one :D</p>';
        return;
    }

    gbEntries.innerHTML = entries.map(entry => `
        <div class="gb-entry">
            <div class="gb-header">
                <div class="gb-name">${entry.name}</div>
                <div class="gb-date">${new Date(entry.date).toLocaleString()}</div>
            </div>
            <div class="gb-msg">${entry.message}</div>
        </div>
    `).join('');
}

if (gbForm) {
    gbForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('guestbook-name').value;
        const message = document.getElementById('guestbook-message').value;

        await fetch(`${API_URL}/guestbook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, message })
        });

        document.getElementById('guestbook-name').value = '';
        document.getElementById('guestbook-message').value = '';
        // Removed loadGuestbook() call here so it doesn't appear after sending
        alert('Message sent! Check the Guestbook page.');
    });
}

// Load entries only if we are on the guestbook page (no form present)
// This removes the preview from the main page
if (gbEntries && !gbForm) {
    loadGuestbook();
}

// --- Scroll Animation ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the element is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // observer.unobserve(entry.target); // ENTFERNT: Damit es immer wieder animiert
        } else {
            // HINZUGEFÜGT: Klasse entfernen, wenn Element nicht mehr sichtbar ist
            entry.target.classList.remove('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.content-box').forEach(box => {
    observer.observe(box);
});

// --- Loading Screen Logic ---
const loadingScreen = document.getElementById('loading-screen');
if (loadingScreen) {
    const loadingImg = document.getElementById('loading-img');
    const loadingText = document.getElementById('loading-text');
    
    const items = [
        { img: 'pictures/fritzbox-nobg.png', text: 'Praying the Wifi works' },
        { img: 'pictures/bambulab_nobg.png', text: 'My 3D-Printer makes weird moves' },
        { img: 'pictures/hetzner-nobg.png', text: 'sshing into some random server' }
    ];
    
    // Shuffle items randomly
    items.sort(() => Math.random() - 0.5);
    
    let currentIndex = 0;
    
    function updateLoadingContent() {
        if (currentIndex < items.length) {
            loadingImg.src = items[currentIndex].img;
            loadingText.innerText = items[currentIndex].text;
            currentIndex++;
        }
    }
    
    // Show first item immediately
    updateLoadingContent();
    
    // Switch every second
    const interval = setInterval(updateLoadingContent, 1000);
    
    // Hide after 3 seconds
    setTimeout(() => {
        clearInterval(interval);
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 3000);
}
