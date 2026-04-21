import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        default: 'Available',
    },
    skills: {
        type: [String],
        default: [],
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/150',
    }
}, {
    timestamps: true
});

const Worker = mongoose.model('Worker', workerSchema);
export default Worker;
