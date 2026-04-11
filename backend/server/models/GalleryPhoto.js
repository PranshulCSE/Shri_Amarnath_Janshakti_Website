const mongoose = require('mongoose');

const galleryPhotoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            default: 'general',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true, collection: 'galleryPhotos' }
);

module.exports = mongoose.model('GalleryPhoto', galleryPhotoSchema);
