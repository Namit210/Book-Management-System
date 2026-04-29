const express = require('express');
const router = express.Router();
const StoreBook = require('../models/StoreSchema');
const Transaction = require('../models/TransactionSchema');
const mongoose = require('mongoose');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

router.post('/register', verifyToken, authorize(['admin','store']), async (req, res) => {
    const { name, password } = req.body;
    try {
        const existingStore = await StoreBook.findOne({ name });
        if (existingStore) {
            return res.status(400).json({ message: 'Store already exists' });
        }
        const store = new StoreBook({name, password, small_books: 0, big_books: 0, medium_books: 0, total_books: 0});
        await store.save();
        res.status(201).json(store);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/getbyname/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const storeBook = await StoreBook.findOne({ name });
        if (!storeBook) {
            return res.status(404).json({ message: 'No book record found' });
        }
        res.status(200).json(storeBook);
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/get-details/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const storeBook = await StoreBook.findById(id);
        if (!storeBook) {
            return res.status(404).json({ message: 'No book record found' });
        }
        res.status(200).json(storeBook);
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/all',verifyToken, authorize(['admin','store']) , async (req, res) => {
    try {
        const storeBooks = await StoreBook.find({}).sort({ createdAt: -1 });
        if (storeBooks.length === 0) {
            return res.status(404).json({ message: 'No book records found' });
        }
        res.status(200).json(storeBooks);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/delete',verifyToken, authorize(['admin','store']) , async (req, res) => {
    try {
        const { name } = req.body;
        const deletedStoreBook = await StoreBook.findOneAndDelete({ name });
        if (!deletedStoreBook) {
            return res.status(404).json({ message: 'Store book record not found' });
        }
        res.status(200).json({ message: 'Store book record deleted successfully' });
    } catch (error) {
        console.error('Error deleting store book record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/request',verifyToken, authorize(['store']) , async (req, res) => {
    try {
        const { name, small_books, big_books, medium_books, desc } = req.body;
        const total_books = small_books + big_books + medium_books;
        new Transaction({
            store: name,
            small_books,
            big_books,
            medium_books,
            total_books,
            desc,
            amount: {
                paid: 0,
                pending: 0
            },
            transaction_id: 'request-' + new mongoose.Types.ObjectId().toString(),
        }).save();
        res.status(200).json({ message: 'Book request submitted successfully', success: 'true' });
    } catch (error) {
        console.error('Error requesting books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
