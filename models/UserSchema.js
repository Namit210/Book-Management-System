const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'store'],
        default: 'store'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

UserSchema.methods.generateToken = async function(){
    try{
        return jwt.sign(
            { 
                id: this._id.toString(), 
                name: this.name,
                role: this.role
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
    }
    catch(error){
        console.error('Error generating token:', error);
        throw new Error('Token generation failed');
    }
};

module.exports = mongoose.model('User', UserSchema)
