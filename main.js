import { fetchWorkers } from './src/lib/data.controller.js';

const workerGrid = document.getElementById('worker-grid');
const searchInput = document.getElementById('worker-search');
const filterButtons = document.querySelectorAll('.filter-chip');

let allWorkers = [];

async function initRegistry() {
    try {
        allWorkers = await fetchWorkers();

        setupEventListeners(); // 👈 FIRST
        renderWorkers(allWorkers);

        console.log("MAIN JS WORKING");
    } catch (err) {
        console.error("Error loading workers:", err);
    }
}

function setupEventListeners() {

    // 🔍 SEARCH
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterAndRender(searchTerm, 'all');

            // ✅ Smooth scroll FIX
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

    // 🎯 FILTER BUTTONS
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

function filterAndRender(searchTerm = '', category = 'all') {
    let filtered = [...allWorkers];

    // category filter
    if (category !== 'all') {
        filtered = filtered.filter(w => w.category === category);
    }

    // search filter
    if (searchTerm) {
        filtered = filtered.filter(w =>
            w.name.toLowerCase().includes(searchTerm) ||
            (w.skills || []).some(s => s.toLowerCase().includes(searchTerm)) ||
            w.category.toLowerCase().includes(searchTerm)
        );
    }

    renderWorkers(filtered);
}

function renderWorkers(workers) {
    if (!workerGrid) return;

    if (!workers.length) {
        workerGrid.innerHTML = `
            <div style="text-align:center; padding:2rem;">
                <p>No workers found</p>
            </div>
        `;
        return;
    }

    workerGrid.innerHTML = workers.map(worker => `
        <div class="worker-card" style="padding:15px; border:1px solid #ccc; border-radius:10px;">
            
            <!-- ✅ IMAGE FIX -->
            <img src="${worker.image || 'https://via.placeholder.com/150'}" 
                 alt="${worker.name}" 
                 style="width:80px; height:80px; border-radius:50%; object-fit:cover; margin-bottom:10px;" />

            <h3>${worker.name}</h3>
            <p>${worker.category}</p>
            <p>${worker.experience}</p>

            <button onclick="connectWorker('${worker.name}', '${worker.category}')"
                style="margin-top:10px; padding:8px 12px; cursor:pointer;">
                Book This Professional
            </button>
        </div>
    `).join('');
}

// 📲 WhatsApp Connect
window.connectWorker = (name, role) => {
    const msg = `Hi, I want to hire ${name} for ${role}`;
    window.open(`https://wa.me/923000000000?text=${encodeURIComponent(msg)}`);
};

// 🚀 Start app
initRegistry();