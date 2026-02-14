const User = require('../models/user');
const Tasks = require('../models/task');

//get all employees 
const getEmployees = async (req, res) => {
  try {
    const users = await User.find({}, 'id name role email'); 
    res.json({ users }); 
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({ 
      msg: 'Error Fetching Employees', 
      error: error.message 
    });
  }
};

//get all employees with full details 
const getAllEmployees = async (req, res) => {
  try {
    const users = await User.find({role:{ $ne: 'manager' }});
    res.json({ users }); 
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({ 
      msg: 'Error Fetching Employees', 
      error: error.message 
    });
  }
};

//get manager for employee
const getManager = async (req, res) => {
  try {
    const manager = await User.findOne({ role: 'manager' });
    if (!manager) {
      return res.status(404).json({ message: 'No manager found' });
    }
    res.json({ manager });
  } catch (error) {
    console.error('Error fetching manager:', error);
    return res.status(500).json({
      msg: 'Error Fetching Manager',
      error: error.message
    });
  }
};

//create employee 
const createEmployee = async (req, res) => {
  const { name, email, employeeId, password, role } = req.body;

  try {
    await User.create({ name: name, email: email, employeeId: employeeId, password: password, role: role });
    res.json({ message: 'User Created successfully' });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({ 
      msg: 'Error Fetching Employees', 
      error: error.message 
    });
  }
};

//delete employee and their tasks 
const deleteEmployee = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const username = user.name;

    await User.findByIdAndDelete(req.params.id);

    await Tasks.deleteMany({ assigned: username });

    res.json({ message: 'Employee and their tasks deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting employee', 
      error: error.message 
    });
  }
};

//update employee details 
const updateEmployee = async (req, res) => {
  try {
    const { name, email, employeeId, role, password } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (employeeId) updates.employeeId = employeeId;
    if (role) updates.role = role;
    if (password) updates.password = password;

    const userId = req.params.id;
    if (!userId) return res.json('UserId not found');

    await User.findByIdAndUpdate(userId, { $set: updates });   
    res.json({ message: `${name}'s details have been updated succesfully` });

  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error: error.message });
  }
};

module.exports = {
  getEmployees,
  getAllEmployees,
  getManager,
  createEmployee,
  deleteEmployee,
  updateEmployee
};