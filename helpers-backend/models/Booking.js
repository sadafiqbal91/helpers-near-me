import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    client_name: {
        type: String,
        required: true,
    },
    client_phone: {
        type: String,
        required: true,
    },
    client_location: {
        type: String,
        required: true,
    },
    client_message: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        default: 'pending',
    },
    requested_at: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
