const express = require('express');
const router = express.Router();
const AdminBook = require('../models/AdminSchema');
const Transaction = require('../models/TransactionSchema');
const StoreBook = require('../models/StoreSchema');
const { verifyToken,authorize } = require('../middleware/authMiddleware');


router.post('/update-books',verifyToken, authorize(['admin']) ,async (req, res) => {
    try {
        const { small_books, big_books, medium_books } = req.body;


        // Create a new AdminBook document
        const adminBook = (await AdminBook.find().sort({ createdAt: -1 }))[0];


        if(adminBook){
            adminBook.small_books += small_books;
            adminBook.big_books += big_books;
            adminBook.medium_books += medium_books;
        }else{
            adminBook = new AdminBook({ small_books, big_books, medium_books });
        }

        await adminBook.save();

        res.status(200).json({ message: 'Books updated successfully', adminBook, success: true });
    } catch (error) {
        console.error('Error updating books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}); 

router.get('/get-details',async (req, res) => {
    try {
        const adminBooks = await AdminBook.find().sort({ createdAt: -1 });
        if (adminBooks.length === 0) {
            return res.status(404).json({ message: 'No book records found' });
        }
        res.status(200).json(adminBooks[0]);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
});


router.post('/transfer',verifyToken, authorize(['admin']) ,async (req, res) => {
    try {
        const {name, small_books, big_books, medium_books, amount, desc } = req.body;


        const small = Number(small_books);
        const big = Number(big_books);
        const medium = Number(medium_books);

        // Calculate total books
        const total_books = small + big + medium;

        const store = await StoreBook.findOne({name});

        if(!store){
            return res.status(404).json({ message: 'Store record not found' });
        }

        store.small_books += small;
        store.big_books += big;
        store.medium_books += medium;
        store.total_books += total_books;

        await store.save();

        await AdminBook.findOneAndUpdate(
  {},
  {
    $inc: {
      small_books: -small,
      big_books: -big,
      medium_books: -medium,
      total_books : -total_books
    }
  },
  { returnDocument:'after', upsert: true }
);

        // Create a new AdminBook document
       const transaction = new Transaction({
            store: name,
            small_books,
            big_books,
            medium_books,
            total_books,
            desc,
            amount: {
                paid: 0,
                pending: amount
            }
       })

        
        await transaction.save();

        res.status(200).json({ message: 'Books transferred successfully', transaction, success: true });
    } catch (error) {
        console.error('Error transferring books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;