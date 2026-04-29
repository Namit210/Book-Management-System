const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    small_books: {type : Number, default: 0},
    medium_books: {type : Number, default: 0},
    big_books: {type : Number, default: 0},
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        toJSON :{virtuals: true},
        toObject : {virtuals: true}
    });

StoreSchema.virtual('total_books').get(function() {
    return this.small_books + this.medium_books + this.big_books;
})

module.exports = mongoose.model('StoreBook', StoreSchema);
