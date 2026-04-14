import { fetchWorkers } from './src/lib/data.controller.js';

const workerGrid = document.getElementById('worker-grid');
const searchInput = document.getElementById('worker-search');
const filterButtons = document.querySelectorAll('.filter-chip');

let allWorkers = [];

async function initRegistry() {
    allWorkers = await fetchWorkers();
    renderWorkers(allWorkers);
    setupEventListeners();
}

function setupEventListeners() {
    // Search Listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterAndRender(searchTerm, 'all');

            // Direct Jump logic
            if (searchTerm.length >= 2) {
                const registrySection = document.getElementById('registry');
                if (registrySection) {
                    registrySection.scrollIntoView({ behavior: 'auto', block: 'start' });
                }
            }
        });

        // Search on Enter key (Immediate jump)
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                const registrySection = document.getElementById('registry');
                if (registrySection) {
                    registrySection.scrollIntoView({ behavior: 'auto', block: 'start' });
                }
            }
        });
    }

    // Filter button listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category') || 'all';

            // Scroll to registry
            const registrySection = document.getElementById('registry');
            if (registrySection) {
                registrySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Filter and render
            filterAndRender('', category);
            updateActiveFilterButton(category);
        });
    });

    updateActiveFilterButton('all');
}

function updateActiveFilterButton(category) {
    filterButtons.forEach(btn => {
        btn.style.borderColor = 'var(--border)';
        btn.style.background = 'var(--bg-card)';
    });

    const activeButton = Array.from(filterButtons).find(btn => btn.getAttribute('data-category') === category);
    if (activeButton) {
        activeButton.style.borderColor = 'var(--accent)';
        activeButton.style.background = 'rgba(0, 220, 130, 0.08)';
    }
}

function filterAndRender(searchTerm = '', category = 'all') {
    let filtered = allWorkers;

    if (category !== 'all') {
        filtered = filtered.filter(w => w.category === category);
    }

    if (searchTerm) {
        filtered = filtered.filter(w => 
            w.name.toLowerCase().includes(searchTerm) || 
            w.skills.some(s => s.toLowerCase().includes(searchTerm)) ||
            w.category.toLowerCase().includes(searchTerm)
        );
    }

    renderWorkers(filtered);
}

function renderWorkers(workers) {
    if (!workerGrid) return;
    
    if (workers.length === 0) {
        workerGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 4rem;">
                <i class="ri-error-warning-line" style="font-size: 3rem;"></i>
                <p>No professionals found matching your search.</p>
            </div>
        `;
        return;
    }

    workerGrid.innerHTML = workers.map(worker => `
        <div class="worker-card" style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; transition: var(--transition); position: relative; overflow: hidden;">
            <div style="display: flex; gap: 1.25rem; align-items: center; margin-bottom: 1.5rem;">
                <img src="${worker.image}" alt="${worker.name}" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent);">
                <div>
                    <h4 style="font-size: 1.15rem; margin-bottom: 0.25rem;">${worker.name}</h4>
                    <span style="font-size: 0.85rem; color: var(--accent); background: rgba(0,220,130,0.1); padding: 0.2rem 0.6rem; border-radius: 50px;">${worker.category}</span>
                </div>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.5rem;">
                    <span style="color: var(--text-secondary);">Experience</span>
                    <span style="font-weight: 600;">${worker.experience}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.5rem;">
                    <span style="color: var(--text-secondary);">Community Rating</span>
                    <span style="color: #ffb700;"><i class="ri-star-fill"></i> ${worker.rating}</span>
                </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
                ${worker.skills.map(skill => `<span style="font-size: 0.75rem; background: var(--bg-deep); border: 1px solid var(--border); padding: 0.2rem 0.6rem; border-radius: 4px;">${skill}</span>`).join('')}
            </div>

            <button onclick="window.connectWorker('${worker.name}', '${worker.category}')" style="width: 100%; background: var(--accent); color: #111; padding: 0.8rem; border: none; border-radius: var(--radius-md); font-weight: 700; cursor: pointer; transition: var(--transition);">
                Book This Professional
            </button>
        </div>
    `).join('');
}

// Global connection handler
window.connectWorker = (name, role) => {
    const message = `Hello, I am interested in hiring ${name} for ${role} services through HelpersNearMe.`;
    const whatsappUrl = `https://wa.me/923000000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
};

// Start the app
initRegistry();
