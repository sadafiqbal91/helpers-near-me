import { fetchWorkers } from './src/lib/data.controller.js';

const workerGrid = document.getElementById('worker-grid');
const searchInput = document.getElementById('worker-search');
const filterButtons = document.querySelectorAll('.filter-chip');

let allWorkers = [];

async function initRegistry() {
    try {
        allWorkers = await fetchWorkers();
        renderWorkers(allWorkers);
        setupEventListeners();
        console.log("MAIN JS WORKING");
    } catch (err) {
        console.error("Error loading workers:", err);
    }
}

function setupEventListeners() {
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterAndRender(searchTerm, 'all');

            if (searchTerm.length >= 2) {
                document.getElementById('registry')?.scrollIntoView({ behavior: 'auto' });
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category || 'all';
            filterAndRender('', category);
        });
    });
}

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

function renderWorkers(workers) {
    if (!workerGrid) return;

    if (!workers.length) {
        workerGrid.innerHTML = "<p>No workers found</p>";
        return;
    }

    workerGrid.innerHTML = workers.map(worker => `
        <div class="worker-card">
            <h3>${worker.name}</h3>
            <p>${worker.category}</p>
            <p>${worker.experience}</p>

            <button onclick="connectWorker('${worker.name}', '${worker.category}')">
                Book This Professional
            </button>
        </div>
    `).join('');
}

window.connectWorker = (name, role) => {
    const msg = `Hi, I want to hire ${name} for ${role}`;
    window.open(`https://wa.me/923000000000?text=${encodeURIComponent(msg)}`);
};

initRegistry();