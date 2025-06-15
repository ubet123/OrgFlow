const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/employees', async (req, res) => {
    try {
        const users = await User.find({}, 'id name role'); 
        res.json({ users }); 
    } catch (error) {
        console.error('Error fetching employees:', error);
        return res.status(500).json({ 
            msg: 'Error Fetching Employees', 
            error: error.message 
        });
    }
});


router.get('/allemployees', async (req, res) => {
    try {
        const users = await User.find({}); 
        res.json({ users }); 
    } catch (error) {
        console.error('Error fetching employees:', error);
        return res.status(500).json({ 
            msg: 'Error Fetching Employees', 
            error: error.message 
        });
    }
});

router.post('/create',async (req,res)=>{
    const {name,email,employeeId,password,role}=req.body

    try {
        await User.create({name:name,email:email,employeeId:employeeId,password:password,role:role})
        res.json({message:'User Created successfully'})
    } catch (error) {
         console.error('Error fetching employees:', error);
        return res.status(500).json({ 
            msg: 'Error Fetching Employees', 
            error: error.message 
        });
        
    }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error: error.message });
  }
});

module.exports = router;