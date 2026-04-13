const CONTENT_MAP = {
    domestic: {
        title: "Domestic Workers",
        desc: "Hire trustworthy and skilled domestic help for cleaning, cooking, and home management.",
        img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800"
    },
    office: {
        title: "Office Helpers",
        desc: "Professional support staff for your office needs including receptionists and administrative assistants.",
        img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
    },
    drivers: {
        title: "Permanent Drivers",
        desc: "Experienced personal and commercial drivers with exceptional safety records and local knowledge.",
        img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800"
    },
    healthcare: {
        title: "Healthcare Workers",
        desc: "Compassionate patient care and elderly assistance professionals for home and hospital support.",
        img: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800"
    },
    store: {
        title: "Store Helpers",
        desc: "Dedicated hospitality and retail staff to manage your inventory and customer service needs.",
        img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
    },
    factory: {
        title: "Factory Workers",
        desc: "Skilled and semi-skilled industrial labor for manufacturing and warehouse operations.",
        img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
    }
};

function initDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const catKey = urlParams.get('cat');
    const content = CONTENT_MAP[catKey];

    if (content) {
        document.title = `${content.title} | HelpersNearMe`;
        document.getElementById('cat-title').textContent = content.title;
        document.getElementById('cat-desc').textContent = content.desc;
        document.getElementById('cat-img').src = content.img;
        document.getElementById('cat-img').alt = content.title;
    } else {
        window.location.href = 'index.html';
    }

    // Booking Button Logic
    const bookBtn = document.getElementById('book-now-btn');
    if (bookBtn) {
        bookBtn.addEventListener('click', () => {
            const message = `Hello, I am interested in hiring a professional from the ${content?.title || 'Selected'} category through HelpersNearMe.`;
            const whatsappUrl = `https://wa.me/923000000000?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
}

document.addEventListener('DOMContentLoaded', initDetails);
