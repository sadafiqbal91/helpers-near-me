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
        // Try fetching from Supabase if keys exist
        const { data, error } = await supabase
            .from('workers')
            .select('*');

        if (error || !data || data.length === 0) {
            console.log("Using local professional registry (Mock Data)");
            return filterWorkers(MOCK_WORKERS, category);
        }

        return filterWorkers(data, category);
    } catch (err) {
        console.log("Backend connection pending. Using professional mock registry.");
        return filterWorkers(MOCK_WORKERS, category);
    }
}

function filterWorkers(list, category) {
    if (category === 'all') return list;
    return list.filter(w => w.category === category);
}
