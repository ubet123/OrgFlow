const express = require('express')
const router = express.Router()
const Tasks = require('../models/task')

router.post('/create', async(req,res)=>{
    const {taskId,title,description,assignedTo,dueDate} = req.body

    try {
        
        await Tasks.create({taskId:taskId,title:title,assigned:assignedTo,due:dueDate,description:description})
        return res.json({message:'Task created successfully'})
    } catch (error) {
        return res.status(500).json({ msg: 'Error creating Task', error });
    }

})

router.get('/alltasks',async(req,res)=>{
    try {
        const tasks = await Tasks.find({})
        res.json({tasks})
    } catch (error) {
        console.error('Error fetching Tasks:', error);
        return res.status(500).json({ 
            msg: 'Error Fetching Tasks', 
            error: error.message 
        });
        
    }
})

module.exports=router