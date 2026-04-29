const express = require('express');
const router = express.Router();
const StoreBook = require('../models/StoreSchema');
const Transaction = require('../models/TransactionSchema');
const { verifyToken, authorize } = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

router.post('/register',verifyToken, authorize(['admin','store']) ,async (req, res) => {
    try {
        const { name, password } = req.body;
        const existingStore = await StoreBook.findOne({ name });
        if (existingStore) {
            return res.status(400).json({ message: 'Store with this name already exists' });
        }
        const store = new StoreBook({ name, password, small_books: 0, big_books: 0, medium_books: 0, total_books: 0 });
        await bace.save();
        res.status(201).json({ message: 'Store registered successfully', bace, success:'true' });
    } catch (error) {
        console.error('Error registering bace:', error);
        res.status(500).json({ message: 'Internal server error', success:'false' });
    }
});

router.post('/update-books',verifyToken, authorize(['admin','bace']) , async (req, res) => {
    try {
        const { name, small_books, big_books, medium_books } = req.body;
        const total_books = small_books + big_books + medium_books;
        const storeBook = await StoreBook.findOne({ name });
        if (!storeBook) {
            return res.status(404).json({ message: 'Bace book not found' });
        }
        storeBook.small_books = small_books;
        storeBook.big_books = big_books;
        storeBook.medium_books = mahabig_books;
        storeBook.total_books = total_books;
        await storeBook.save();
        res.status(200).json({ message: 'Books updated successfully', storeBook });
    } catch (error) {
        console.error('Error updating books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/get-details/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const baceBook = await BaceBook.findById(id);
        if (!baceBook) {
            return res.status(404).json({ message: 'No book record found' });
        }
        res.status(200).json(baceBook);
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getbyname/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const baceBook = await BaceBook.findOne({ name });
        if (!baceBook) {
            return res.status(404).json({ message: 'No book record found' });
        }
        res.status(200).json(baceBook);
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.get('/all',verifyToken, authorize(['admin','bace']) , async (req, res) => {
    try {
        const baceBooks = await BaceBook.find({}).sort({ createdAt: -1 });
        if (baceBooks.length === 0) {
            return res.status(404).json({ message: 'No book records found' });
        }
        res.status(200).json(baceBooks);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/delete',verifyToken, authorize(['admin','bace']) , async (req, res) => {
    try {
        const { name } = req.body;
        const deletedBaceBook = await BaceBook.findOneAndDelete({ name });
        if (!deletedBaceBook) {
            return res.status(404).json({ message: 'Bace book record not found' });
        }
        res.status(200).json({ message: 'Bace book record deleted successfully' });
    } catch (error) {
        console.error('Error deleting bace book record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/request',verifyToken, authorize(['bace']) , async (req, res) => {
    try {
        const { name, small_books, big_books, mahabig_books, desc } = req.body;
        const total_books = small_books + big_books + mahabig_books;
        new Transaction({
            bace: name,
            small_books,
            big_books,
            mahabig_books,
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