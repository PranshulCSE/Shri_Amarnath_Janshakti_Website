const mongoose = require('mongoose');

const yatraDocumentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        documentUrl: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true, collection: 'yatraDocuments' }
);

module.exports = mongoose.model('YatraDocument', yatraDocumentSchema);
