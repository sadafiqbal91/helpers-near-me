// Mock data for initial professional state
const MOCK_WORKERS = [
    {
        id: 1,
        name: "Arjun Sharma",
        category: "Domestic Workers",
        experience: "6 Years",
        rating: 4.9,
        status: "Available",
        skills: ["Housekeeping", "Cooking", "Deep Cleaning"],
        image: "https://images.unsplash.com/photo-1540560340027-46b469837563?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Saira Khan",
        category: "Healthcare Workers",
        experience: "4 Years",
        rating: 4.8,
        status: "Available",
        skills: ["Patient Care", "Elderly Support", "First Aid"],
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Vikram Singh",
        category: "Permanent Drivers",
        experience: "8 Years",
        rating: 5.0,
        status: "Available",
        skills: ["City Navigation", "Vehicle Maintenance", "Safety Expert"],
        image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200&h=200&auto=format&fit=crop"
    }
];

import { supabase } from './supabase.js';

export async function fetchWorkers(category = 'all') {
    try {
        const { data, error } = await supabase
            .from('workers')
            .select('*');

        if (error || !data || data.length === 0) {
            console.warn("Using local professional registry (Mock Data)", error);
            return filterWorkers(MOCK_WORKERS, category);
        }

        return filterWorkers(mapWorkerData(data), category);
    } catch (err) {
        console.warn("Backend connection pending. Using professional mock registry.", err);
        return filterWorkers(MOCK_WORKERS, category);
    }
}

export async function saveBooking(request) {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .insert([request])
            .select();

        if (error) {
            console.warn('Supabase booking save failed:', error);
            return { success: false, error: error.message || error };
        }

        return { success: true, data };
    } catch (err) {
        console.warn('Booking request fallback active.', err);
        return { success: false, error: err.message || err };
    }
}

function filterWorkers(list, category) {
    if (category === 'all') return list;
    return list.filter(w => w.category === category);
}

function mapWorkerData(workers) {
    return workers.map(worker => ({
        id: worker.id,
        name: worker.name,
        category: worker.category || worker.category_name || 'Unknown',
        experience: worker.experience || worker.years_experience || 'N/A',
        rating: worker.rating || worker.review_score || 0,
        status: worker.status || 'Available',
        skills: worker.skills || worker.skill_set || [],
        image: worker.image || worker.photo_url || 'https://images.unsplash.com/photo-1540560340027-46b469837563?q=80&w=200&h=200&auto=format&fit=crop'
    }));
}
