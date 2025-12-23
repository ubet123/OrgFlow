const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    taskId:{
        type:String,
        required:true,
        unique: true
    },
    title:{
        type:String, 
        required:true
    },
    assigned:{
        type:String, 
        required:true
    },
    due:{
        type:Date,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'Pending',
        enum: ['Pending', 'In Progress', 'Completed']
    },
    attachments: [{
        public_id: { type: String },
        url: { type: String },
        filename: { type: String },
        mimetype: { type: String },
        size: { type: Number },
        uploadedBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        },
        uploadedAt: { type: Date, default: Date.now }
    }],
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
        // Removed required: true to make it optional
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update updatedAt on save
taskSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Task', taskSchema);