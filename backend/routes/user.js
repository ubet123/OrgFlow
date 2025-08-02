const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {verifyToken} = require('../utils/auth')

//get all employees
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

//get all employees
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


//create employee
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


//delete employee by id
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

//update employee details
router.patch('/update/:id',verifyToken,async(req,res)=>{

    try {
    
    const { name, email, employeeId, role, password } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (employeeId) updates.employeeId = employeeId;
    if (role) updates.role = role;
    if(password) updates.password=password;

    const userId=req.params.id;
    if(!userId) return res.json('UserId not found')

     await User.findByIdAndUpdate(userId,{$set:updates})   
     res.json({message:`${name}'s details have been updated succesfully`})

    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
 })

module.exports = router;