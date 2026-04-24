const API_URL = 'https://helpers-near-me.vercel.app/api';

// Utility helper to get Auth Headers
function getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Tab Switching Logic
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (e.target.id === 'seed-btn') return; // Handled separately

        // Remove active class
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        // Add active class
        e.target.classList.add('active');
        const tabId = e.target.dataset.tab;
        document.getElementById(tabId).classList.add('active');
    });
});

// Toggle Add Worker Form
window.toggleWorkerForm = () => {
    const form = document.getElementById('add-worker-form');
    form.classList.toggle('hidden');
};

// Seed DB
document.getElementById('seed-btn').addEventListener('click', async () => {
    if (confirm("This will clear existing workers and add dummy data. Proceed?")) {
        try {
            const res = await fetch(`${API_URL}/workers/seed`, { 
                method: 'POST',
                headers: getAuthHeaders()
            });
            const data = await res.json();
            alert(data.message);
            loadData(); // reload
        } catch (err) {
            alert("Error seeding data.");
            console.error(err);
        }
    }
});

// Add New Worker
document.getElementById('new-worker-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    let baseSkills = document.getElementById('w-skills').value;
    let skillsArray = baseSkills.split(',').map(s => s.trim()).filter(s => s);

    const payload = {
        name: document.getElementById('w-name').value,
        category: document.getElementById('w-category').value,
        experience: document.getElementById('w-exp').value,
        skills: skillsArray,
        rating: 5.0, // Default for new
        status: 'Available'
    };

    try {
        const res = await fetch(`${API_URL}/workers`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert('Worker added successfully!');
            document.getElementById('new-worker-form').reset();
            toggleWorkerForm();
            loadData();
        } else {
            alert('Error adding worker.');
        }
    } catch (err) {
        console.error(err);
    }
});

// Load All Data
async function loadData() {
    try {
        // Fetch Workers
        const workersRes = await fetch(`${API_URL}/workers`);
        const workers = await workersRes.json();

        // Fetch Bookings (Protected Endpoint)
        const bookingsRes = await fetch(`${API_URL}/bookings`, {
            headers: getAuthHeaders()
        });
        const bookings = await bookingsRes.json();

        // Update Dashboard Stats
        document.getElementById('total-workers').textContent = workers.length;
        document.getElementById('total-bookings').textContent = bookings.length;

        // Render Workers Table
        const wTbody = document.querySelector('#workers-table tbody');
        wTbody.innerHTML = workers.map(w => `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${w.image || 'https://via.placeholder.com/40'}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">
                        ${w.name}
                    </div>
                </td>
                <td>${w.category}</td>
                <td>${w.experience}</td>
                <td style="color:#ffb700;">⭐ ${w.rating}</td>
                <td><span style="color:var(--accent);">${w.status}</span></td>
            </tr>
        `).join('');


        // Render Bookings Table
        const bTbody = document.querySelector('#bookings-table tbody');
        bTbody.innerHTML = bookings.map(b => {
            const dateStr = new Date(b.requested_at).toLocaleString();

            // Status ke hisaab se button ya text dikhana
            let statusHTML = '';
            if (b.status === 'pending') {
                statusHTML = `
                    <span style="background:rgba(255,165,0,0.2); color:orange; padding:4px 8px; border-radius:4px; font-size:12px; margin-right: 5px;">Pending</span>
                    <button onclick="completeBooking('${b._id}')" style="background:var(--accent); color:#111; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:12px; font-weight:bold;">✔ Mark Done</button>
                 `;
            } else {
                statusHTML = `
                    <span style="background:rgba(0, 220, 130, 0.2); color:var(--accent); padding:4px 8px; border-radius:4px; font-size:12px;">Completed</span>
                 `;
            }

            return `
            <tr>
                <td>${dateStr}</td>
                <td>${b.client_name}</td>
                <td>${b.client_phone}</td>
                <td>${b.category}</td>
                <td>${b.client_location}</td>
                <td>${statusHTML}</td>
            </tr>
            `;
        }).join('');

    } catch (error) {
        console.error("Failed to load admin data:", error);
    }
}

// App Load / Check Token
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('dashboard-wrapper').classList.remove('hidden');
        loadData();
    }
});

// Login Form Logic
const loginForm = document.getElementById('admin-login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            
            if (data.success) {
                // Token ko save karein
                localStorage.setItem('adminToken', data.token);
                // UI Switch karein
                document.getElementById('login-section').classList.add('hidden');
                document.getElementById('dashboard-wrapper').classList.remove('hidden');
                loadData();
            } else {
                alert(data.message || "Invalid credentials");
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to server. Is backend running?");
        }
    });
}

// Logout Logic
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminToken'); // Token clear
        window.location.reload(); // Refresh page to go to login
    });
}

// Function jo Frontend se Backend ko update ka message bhejega
window.completeBooking = async (bookingId) => {
    // 1. User se confirm karein (taake ghalti se click na ho)
    const isConfirm = confirm("Are you sure you want to mark this booking as Completed?");
    if (!isConfirm) return;

    try {
        // 2. Apni nayi API par request bhejein jo abhi thori dair phly aapne banai hai!
        const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: 'Completed' })
        });

        // 3. Check karein kya backend ne success diya?
        if (response.ok) {
            alert("Booking marked as Completed!");
            loadData(); // Is se table khud bakhud refresh ho jayega
        } else {
            alert("Error updating booking.");
        }
    } catch (error) {
        console.error("Fetch Error:", error);
    }
};

