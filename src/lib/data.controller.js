import { supabase } from './supabase.js';

// 🔥 Fake Data Generator
function generateFakeWorkers(count = 20) {
    const names = ["Ali", "Ahmed", "Sana", "Ayesha", "Usman", "Zara", "Bilal", "Hina"];
    const categories = ["Domestic Workers", "Office Helpers", "Permanent Drivers", "Healthcare Workers"];
    const skillsList = ["Cleaning", "Driving", "Cooking", "Office Work", "Patient Care"];

    let workers = [];

    for (let i = 0; i < count; i++) {
        workers.push({
            id: i + 1,
            name: names[Math.floor(Math.random() * names.length)] + " Khan",
            category: categories[Math.floor(Math.random() * categories.length)],
            experience: Math.floor(Math.random() * 10) + " Years",
            rating: (Math.random() * 5).toFixed(1),
            status: "Available",
            skills: [skillsList[Math.floor(Math.random() * skillsList.length)]],
            image: `https://i.pravatar.cc/150?img=${i + 1}`
        });
    }

    return workers;
}

// 🔥 FETCH WORKERS
export async function fetchWorkers(category = 'all') {
    try {
        const { data, error } = await supabase
            .from('workers')
            .select('*');

        if (error || !data || data.length === 0) {
            console.warn("Using FAKE workers");
            return filterWorkers(generateFakeWorkers(20), category);
        }

        return filterWorkers(mapWorkerData(data), category);
    } catch (err) {
        console.warn("Using FAKE workers (offline mode)");
        return filterWorkers(generateFakeWorkers(20), category);
    }
}

// 🔥 SAVE BOOKING (same as before)
export async function saveBooking(request) {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .insert([request])
            .select();

        if (error) {
            return { success: false, error: error.message || error };
        }

        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message || err };
    }
}

// 🔧 FILTER
function filterWorkers(list, category) {
    if (category === 'all') return list;
    return list.filter(w => w.category === category);
}

// 🔧 MAP DATA
function mapWorkerData(workers) {
    return workers.map(worker => ({
        id: worker.id,
        name: worker.name,
        category: worker.category || worker.category_name || 'Unknown',
        experience: worker.experience || worker.years_experience || 'N/A',
        rating: worker.rating || worker.review_score || 0,
        status: worker.status || 'Available',
        skills: worker.skills || worker.skill_set || [],
        image: worker.image || worker.photo_url || `https://i.pravatar.cc/150?u=${worker.id}`
    }));
}