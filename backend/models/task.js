const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    taskId:{
type:String,
required:true
    },
    title:{
        type:String, required:true
    },
    assigned:{
        type:String, required:true
    },
    due:{
        type:Date,
        required:true
    },
    description:{
        type:String,
        required:true
    },
     createdAt: { type: Date, default: Date.now }
})

module.exports= mongoose.model('Task',taskSchema);  