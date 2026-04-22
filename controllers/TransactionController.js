const express = require('express');
const router = express.Router();
const Transaction = require('../models/TransactionSchema'); 
const { verifyToken, authorize } = require('../middleware/authMiddleware');

router.get('/all',verifyToken, authorize(['admin','bace'])  ,async (req, res) => {
    try {
        if(req.user.role === 'admin'){
        const transactions = await Transaction.find({}).sort({ timestamp: -1 });
        res.status(200).json(transactions);
        }
        else{
            const transactions = await Transaction.find({ user: req.user._id }).sort({ timestamp: -1 });
            res.status(200).json(transactions);
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/delete', async (req, res) => {
    try {
        const { id } = req.body;
        const deletedTransaction = await Transaction.findOneAndDelete({ _id: id });
        if (!deletedTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/status', async (req, res)=>{
    const { id, paid, pending, transaction_id } = req.body;

    try{
        const transaction = await Transaction.findById(id);
        if(!transaction){
            return res.status(404).json({ message: 'Transaction not found' });
        }


        if(transaction.amount.paid + transaction.amount.pending != paid + pending && not (transaction.amount.paid == 0 && transaction.amount.pending == 0)){
            return res.status(400).json({ message: `Total amount should be ${transaction.amount.paid + transaction.amount.pending}, you have currently paid:${paid} and pending:${pending}` });
        }

        transaction.amount.paid = paid;
        transaction.amount.pending = pending;
        transaction.transaction_id = transaction_id;

        await transaction.save();
        res.status(200).json({ message: 'Transaction status updated successfully', transaction });
    }
    catch(error){
        console.error('Error updating transaction status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;