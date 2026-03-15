const router = require('express').Router();
const User = require('../models/UserSchema');

router.get('/all', async (req, res) => {
    try {
        const users = await User.find({}, 'name role createdAt');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { name, password, role } = req.body;

        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this name already exists' });
        }

        const user = new User({ name, password, role });
        await user.save();

        res.status(201).json({ message: 'User registered successfully', user: { id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;