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

router.get('/emptasks', async(req,res)=>{
    const user = req.body
try {
        
        const { employee } = req.query;
        
        if (!employee) {
            return res.status(400).json({ msg: 'Employee name is required' });
        }

        const usertasks = await Tasks.find({ assigned: employee });
        res.json({ usertasks });
        
    } catch (error) {
        console.error('Error fetching Tasks:', error);
        res.status(500).json({ 
            msg: 'Error Fetching Tasks', 
            error: error.message 
        });
    }
})


router.patch("/complete",async (req,res)=>{
    try {
        const {taskId} = req.body
        await Tasks.updateOne({taskId:taskId},{$set:{status:'Completed'}})
        res.json({message:`task ${taskId} marked as completed`})

    } catch (error) {
        console.error('Error marking task as complete:', error);
        res.status(500).json({ 
            msg: 'Error marking task as complete', 
            error: error.message 
        });
    }
})

module.exports=router