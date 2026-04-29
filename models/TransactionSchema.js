const mongoose = require('mongoose');

//Store_Name, Small books, Mahabig Books, Big Books, total_books, Amount Paid/Pending, transaction_id object
const TransactionSchema = new mongoose.Schema(
    {
        store : {
            type: String,
            required: true,
        },
        small_books: {
            type: Number,
        },
        big_books: {
            type: Number,
        },
        medium_books: {
            type: Number,
        },
        total_books: {
            type: Number,
        },
        amount: {
            paid:{
                type: Number,
            },
            pending:{
                type: Number,
            }
        },

        desc:{
            type: String,
        },

        transaction_id: {
            type: String,
            unique: true,
            default: function() {
                return 'admin-' + new mongoose.Types.ObjectId().toString();
            }
        },
        timestamp:{
            type: Date,
            default: Date.now
        }
    }
)

module.exports = mongoose.model('TransactionRecord', TransactionSchema)