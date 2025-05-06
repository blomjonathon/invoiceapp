require('dotenv').config();

// Set database URL if not in environment
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgresql://invoice_user:47dLkMdbpVtq2CF2XUSrisT4TXddFIm7@dpg-d0d6843uibrs73bq7fl0-a/invoice_db_jjj5';
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const Invoice = require('./models/Invoice');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection and Sync
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to PostgreSQL database');
        
        await sequelize.sync();
        console.log('Database synchronized');

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
};

// Root route
app.get('/', (req, res) => {
    res.send('Invoice API is running. Use /api/invoices for invoice operations.');
});

// API Routes
app.post('/api/invoices', async (req, res) => {
    try {
        const invoice = await Invoice.create(req.body);
        res.status(201).json(invoice);
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ message: 'Error creating invoice', error: error.message });
    }
});

app.get('/api/invoices', async (req, res) => {
    try {
        const invoices = await Invoice.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ message: 'Error fetching invoices', error: error.message });
    }
});

app.delete('/api/invoices/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        await invoice.destroy();
        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({ message: 'Error deleting invoice', error: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        database: sequelize.authenticate() ? 'connected' : 'disconnected'
    });
});

startServer(); 