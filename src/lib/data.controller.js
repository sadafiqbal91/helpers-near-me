// 🔥 FETCH WORKERS (From new Express/MongoDB Backend)
export async function fetchWorkers(category = 'all') {
    try {
        const url = category === 'all' 
            ? 'https://helpers-near-me.vercel.app/api/workers' 
            : `https://helpers-near-me.vercel.app/api/workers?category=${encodeURIComponent(category)}`;
            
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch workers");
        
        const data = await response.json();
        return mapWorkerData(data);
    } catch (error) {
        console.error("Error fetching workers, using fallback:", error);
        return []; // In real app, maybe show error UI
    }
}

// 🔥 SAVE BOOKING (To new Express/MongoDB Backend)
export async function saveBooking(request) {
    try {
        const response = await fetch('https://helpers-near-me.vercel.app/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        const data = await response.json();
        
        if (!response.ok) {
            return { success: false, error: data.message || "Failed to save booking" };
        }

        return { success: true, data: data.data };
    } catch (err) {
        return { success: false, error: err.message || err };
    }
}

// 🔧 MAP DATA (Handle Mongoose _id)
function mapWorkerData(workers) {
    return workers.map(worker => ({
        id: worker._id || worker.id,
        name: worker.name,
        category: worker.category || 'Unknown',
        experience: worker.experience || 'N/A',
        rating: worker.rating || 0,
        status: worker.status || 'Available',
        skills: worker.skills || [],
        image: worker.image || `https://i.pravatar.cc/150?u=${worker._id}`
    }));
}