import { fetchWorkers } from './src/lib/data.controller.js';

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

// 📲 WHATSAPP
window.connectWorker = (name, role) => {
    const msg = `Hello, I want to hire ${name} for ${role}`;
    window.open(`https://wa.me/923000000000?text=${encodeURIComponent(msg)}`);
};

// START
initRegistry();