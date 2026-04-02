const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            enum: ['info', 'warning', 'success', 'error'],
            default: 'info',
        },
    },
    { timestamps: true, collection: 'announcements' }
);

module.exports = mongoose.model('Announcement', announcementSchema);
