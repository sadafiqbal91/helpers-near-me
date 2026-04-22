import { fetchWorkers, saveBooking } from './src/lib/data.controller.js';

const workerGrid = document.getElementById('worker-grid');
const searchInput = document.getElementById('worker-search');
const filterButtons = document.querySelectorAll('.filter-chip');

let allWorkers = [];

// 🚀 INIT
async function initRegistry() {
    try {
        allWorkers = await fetchWorkers();

        setupEventListeners();
        renderWorkers(allWorkers);

        console.log("MAIN JS WORKING");
    } catch (err) {
        console.error("Error loading workers:", err);
    }
}

// 🎯 EVENTS
function setupEventListeners() {

    // 🔍 SEARCH
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterAndRender(searchTerm, 'all');

            if (searchTerm.length >= 2) {
                const section = document.getElementById('registry');
                if (section) {
                    setTimeout(() => {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            }
        });
    }

    // 🧩 FILTER BUTTONS
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category || 'all';

            const section = document.getElementById('registry');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            filterAndRender('', category);
        });
    });
}

// 🔍 FILTER LOGIC
function filterAndRender(searchTerm = '', category = 'all') {
    let filtered = [...allWorkers];

    if (category !== 'all') {
        filtered = filtered.filter(w => w.category === category);
    }

    if (searchTerm) {
        filtered = filtered.filter(w =>
            w.name.toLowerCase().includes(searchTerm) ||
            (w.skills || []).some(s => s.toLowerCase().includes(searchTerm)) ||
            w.category.toLowerCase().includes(searchTerm)
        );
    }

    renderWorkers(filtered);
}

// 🎨 PREMIUM CARD DESIGN (FIXED)
function renderWorkers(workers) {
    if (!workerGrid) return;

    if (!workers.length) {
        workerGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p>No professionals found</p>
            </div>
        `;
        return;
    }

    workerGrid.innerHTML = workers.map(worker => `
        <div class="worker-card" style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; transition: var(--transition);">

            <div style="display:flex; gap:1rem; align-items:center; margin-bottom:1.2rem;">
                <img src="${worker.image || 'https://via.placeholder.com/150'}"
                     style="width:70px; height:70px; border-radius:50%; object-fit:cover; border:2px solid var(--accent);" />

                <div>
                    <h4 style="margin:0;">${worker.name}</h4>
                    <span style="font-size:0.8rem; color:var(--accent);">
                        ${worker.category}
                    </span>
                </div>
            </div>

            <div style="font-size:0.9rem; margin-bottom:1rem;">
                <div style="display:flex; justify-content:space-between;">
                    <span>Experience</span>
                    <strong>${worker.experience}</strong>
                </div>

                <div style="display:flex; justify-content:space-between;">
                    <span>Rating</span>
                    <span style="color:#ffb700;">⭐ ${worker.rating || "4.5"}</span>
                </div>
            </div>

            <div style="margin-bottom:1.5rem; display:flex; flex-wrap:wrap; gap:5px;">
                ${(worker.skills || []).map(skill => `
                    <span style="font-size:11px; padding:3px 6px; border:1px solid var(--border); border-radius:4px;">
                        ${skill}
                    </span>
                `).join('')}
            </div>

            <button onclick="connectWorker('${worker.name}', '${worker.category}')"
                style="width:100%; padding:10px; background:var(--accent); border:none; border-radius:6px; font-weight:bold; cursor:pointer;">
                Book This Professional
            </button>

        </div>
    `).join('');
}

// 📲 MODAL & WHATSAPP INTEGRATION
window.connectWorker = (name, role) => {
    // Open Modal
    const modal = document.getElementById('booking-modal');
    if (modal) {
        document.getElementById('b-worker-name').value = name;
        document.getElementById('b-category').value = role;
        document.getElementById('b-message').value = `Hello, I want to hire ${name} for ${role}.`;
        
        modal.classList.add('active');
    }
};

// Modal Close
document.getElementById('close-modal-btn')?.addEventListener('click', () => {
    document.getElementById('booking-modal').classList.remove('active');
});

// Form Submit
document.getElementById('booking-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('b-submit-btn');
    const statusDiv = document.getElementById('b-status');
    const originalText = btn.innerText;

    btn.innerText = 'Processing...';
    btn.disabled = true;

    const request = {
        client_name: document.getElementById('b-name').value,
        client_phone: document.getElementById('b-phone').value,
        client_location: document.getElementById('b-location').value,
        category: document.getElementById('b-category').value,
        client_message: document.getElementById('b-message').value
    };
    
    try {
        const response = await saveBooking(request);
        
        if (response.success) {
            statusDiv.style.color = '#00dc82';
            statusDiv.innerText = 'Booking Sent Successfully! Redirecting to WhatsApp...';
            
            setTimeout(() => {
                // Close modal
                document.getElementById('booking-modal').classList.remove('active');
                
                // Reset form
                e.target.reset();
                btn.innerText = originalText;
                btn.disabled = false;
                statusDiv.innerText = '';
                
                // Open WhatsApp
                const workerName = request.category; // fallback
                const msg = `Hello, this is ${request.client_name}. ${request.client_message} My location: ${request.client_location}.`;
                window.open(`https://wa.me/923000000000?text=${encodeURIComponent(msg)}`);
            }, 1500);
        } else {
            statusDiv.style.color = 'red';
            statusDiv.innerText = 'Failed: ' + response.error;
            btn.innerText = originalText;
            btn.disabled = false;
        }
    } catch (err) {
        statusDiv.style.color = 'red';
        statusDiv.innerText = 'An error occurred. Please try again.';
        btn.innerText = originalText;
        btn.disabled = false;
    }
});

// 📩 CONTACT FORM HANDLER
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        
        btn.innerText = 'Sending...';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        // Simulate network delay for premium feel
        setTimeout(() => {
            alert('Thank you! Your message has been sent successfully. Our team will contact you soon.');
            btn.innerText = originalText;
            btn.disabled = false;
            btn.style.opacity = '1';
            e.target.reset();
        }, 1500);
    });
}

// START
initRegistry();


