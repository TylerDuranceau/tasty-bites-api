// =============================
// Import packages, initialize express app, define port
// =============================
const express = require('express');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = 3000;

app.use(express.json());

// =============================
// Logging Middleware
// =============================
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);

  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request Body:', req.body);
  }

  next();
};

app.use(logger);

// =============================
// Data for the server (keep yours exactly as-is)
// =============================
const menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and cheese on a sesame seed bun",
    price: 12.99,
    category: "entree",
    ingredients: ["beef", "lettuce", "tomato", "cheese", "bun"],
    available: true
  },
  {
    id: 2,
    name: "Chicken Caesar Salad",
    description: "Grilled chicken breast over romaine lettuce with parmesan and croutons",
    price: 11.50,
    category: "entree",
    ingredients: ["chicken", "romaine lettuce", "parmesan cheese", "croutons", "caesar dressing"],
    available: true
  },
  {
    id: 3,
    name: "Mozzarella Sticks",
    description: "Crispy breaded mozzarella served with marinara sauce",
    price: 8.99,
    category: "appetizer",
    ingredients: ["mozzarella cheese", "breadcrumbs", "marinara sauce"],
    available: true
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 7.99,
    category: "dessert",
    ingredients: ["chocolate", "flour", "eggs", "butter", "vanilla ice cream"],
    available: true
  },
  {
    id: 5,
    name: "Fresh Lemonade",
    description: "House-made lemonade with fresh lemons and mint",
    price: 3.99,
    category: "beverage",
    ingredients: ["lemons", "sugar", "water", "mint"],
    available: true
  },
  {
    id: 6,
    name: "Fish and Chips",
    description: "Beer-battered cod with seasoned fries and coleslaw",
    price: 14.99,
    category: "entree",
    ingredients: ["cod", "beer batter", "potatoes", "coleslaw", "tartar sauce"],
    available: false
  }
];

// =============================
// Validation Middleware
// =============================
const validateMenuItem = [
  body('name')
    .isString().isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),

  body('description')
    .isString().isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),

  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0'),

  body('category')
    .isIn(['appetizer', 'entree', 'dessert', 'beverage'])
    .withMessage('Invalid category'),

  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('Ingredients must include at least one item'),

  body('available')
    .optional()
    .isBoolean()
    .withMessage('Available must be true or false'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// =============================
// CRUD Routes
// =============================

// GET all menu items
app.get('/api/menu', (req, res) => {
  res.status(200).json(menuItems);
});

// GET a menu item by ID
app.get('/api/menu/:id', (req, res) => {
  const item = menuItems.find(m => m.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ message: 'Menu item not found' });
  }
  res.status(200).json(item);
});

// POST a new menu item
app.post('/api/menu', validateMenuItem, (req, res) => {
  const newId = menuItems.length ? menuItems[menuItems.length - 1].id + 1 : 1;
  const newItem = {
    id: newId,
    available: true,
    ...req.body
  };
  menuItems.push(newItem);
  res.status(201).json(newItem);
});

// PUT update an existing menu item
app.put('/api/menu/:id', validateMenuItem, (req, res) => {
  const index = menuItems.findIndex(m => m.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Menu item not found' });
  }
  menuItems[index] = { ...menuItems[index], ...req.body };
  res.status(200).json(menuItems[index]);
});

// DELETE a menu item
app.delete('/api/menu/:id', (req, res) => {
  const index = menuItems.findIndex(m => m.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Menu item not found' });
  }
  const deletedItem = menuItems.splice(index, 1);
  res.status(200).json({ message: 'Menu item deleted successfully', deletedItem });
});

// =============================
// Start Server
// =============================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});