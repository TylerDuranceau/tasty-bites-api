const express = require('express');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());

// Middleware: Request Logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('Body:', req.body);
    }
    next();
});

// Sample data
let menu = [
    { id: 1, name: 'Caesar Salad', description: 'Fresh romaine lettuce with Caesar dressing', price: 8.99, category: 'appetizer', ingredients: ['lettuce', 'dressing', 'croutons'], available: true }
];

// Validation middleware
const validateMenuItem = [
    body('name').isString().isLength({ min: 3 }),
    body('description').isString().isLength({ min: 10 }),
    body('price').isFloat({ gt: 0 }),
    body('category').isIn(['appetizer', 'entree', 'dessert', 'beverage']),
    body('ingredients').isArray({ min: 1 }),
    body('available').optional().isBoolean()
];

// GET all menu items
app.get('/api/menu', (req, res) => {
    res.status(200).json(menu);
});

// GET menu item by ID
app.get('/api/menu/:id', (req, res) => {
    const item = menu.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.status(200).json(item);
});

// POST new menu item
app.post('/api/menu', validateMenuItem, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const newItem = { id: menu.length + 1, ...req.body };
    menu.push(newItem);
    res.status(201).json(newItem);
});

// PUT update menu item
app.put('/api/menu/:id', validateMenuItem, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const index = menu.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Menu item not found' });

    menu[index] = { id: parseInt(req.params.id), ...req.body };
    res.status(200).json(menu[index]);
});

// DELETE menu item
app.delete('/api/menu/:id', (req, res) => {
    const index = menu.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Menu item not found' });

    const deleted = menu.splice(index, 1);
    res.status(200).json(deleted[0]);
});

// Start server
app.listen(3000, () => console.log('Server running on port 3000'));