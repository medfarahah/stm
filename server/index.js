const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const dbPath = path.join(__dirname, 'inventory.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Categories table
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Suppliers table
  db.run(`CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sku TEXT UNIQUE,
    category_id INTEGER,
    description TEXT,
    unit_price REAL DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  )`);

  // Purchases table
  db.run(`CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    unit_cost REAL NOT NULL,
    total_cost REAL NOT NULL,
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`);

  // Sales table
  db.run(`CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    total_price REAL NOT NULL,
    sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    customer_name TEXT,
    notes TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`);

  // Expenses table
  db.run(`CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    description TEXT,
    amount REAL NOT NULL,
    expense_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
  )`);
});

// ==================== CATEGORIES ====================
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  db.run('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, description });
  });
});

app.put('/api/categories/:id', (req, res) => {
  const { name, description } = req.body;
  db.run('UPDATE categories SET name = ?, description = ? WHERE id = ?', [name, description, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: req.params.id, name, description });
  });
});

app.delete('/api/categories/:id', (req, res) => {
  db.run('DELETE FROM categories WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Category deleted', id: req.params.id });
  });
});

// ==================== SUPPLIERS ====================
app.get('/api/suppliers', (req, res) => {
  db.all('SELECT * FROM suppliers ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/suppliers', (req, res) => {
  const { name, contact_person, email, phone, address } = req.body;
  db.run('INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES (?, ?, ?, ?, ?)',
    [name, contact_person, email, phone, address], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, contact_person, email, phone, address });
  });
});

app.put('/api/suppliers/:id', (req, res) => {
  const { name, contact_person, email, phone, address } = req.body;
  db.run('UPDATE suppliers SET name = ?, contact_person = ?, email = ?, phone = ?, address = ? WHERE id = ?',
    [name, contact_person, email, phone, address, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: req.params.id, name, contact_person, email, phone, address });
  });
});

app.delete('/api/suppliers/:id', (req, res) => {
  db.run('DELETE FROM suppliers WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Supplier deleted', id: req.params.id });
  });
});

// ==================== PRODUCTS ====================
app.get('/api/products', (req, res) => {
  db.all(`SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    ORDER BY p.name`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/products', (req, res) => {
  const { name, sku, category_id, description, unit_price, stock_quantity, reorder_level } = req.body;
  db.run('INSERT INTO products (name, sku, category_id, description, unit_price, stock_quantity, reorder_level) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, sku, category_id || null, description, unit_price || 0, stock_quantity || 0, reorder_level || 0], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, sku, category_id, description, unit_price, stock_quantity, reorder_level });
  });
});

app.put('/api/products/:id', (req, res) => {
  const { name, sku, category_id, description, unit_price, stock_quantity, reorder_level } = req.body;
  db.run('UPDATE products SET name = ?, sku = ?, category_id = ?, description = ?, unit_price = ?, stock_quantity = ?, reorder_level = ? WHERE id = ?',
    [name, sku, category_id || null, description, unit_price, stock_quantity, reorder_level, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: req.params.id, name, sku, category_id, description, unit_price, stock_quantity, reorder_level });
  });
});

app.delete('/api/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Product deleted', id: req.params.id });
  });
});

// ==================== PURCHASES ====================
app.get('/api/purchases', (req, res) => {
  db.all(`SELECT p.*, pr.name as product_name, s.name as supplier_name 
    FROM purchases p 
    LEFT JOIN products pr ON p.product_id = pr.id 
    LEFT JOIN suppliers s ON p.supplier_id = s.id 
    ORDER BY p.purchase_date DESC`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/purchases', (req, res) => {
  const { supplier_id, product_id, quantity, unit_cost, purchase_date, notes } = req.body;
  const total_cost = quantity * unit_cost;
  
  db.serialize(() => {
    db.run('INSERT INTO purchases (supplier_id, product_id, quantity, unit_cost, total_cost, purchase_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [supplier_id || null, product_id, quantity, unit_cost, total_cost, purchase_date || new Date().toISOString(), notes], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Update product stock
      db.run('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?', [quantity, product_id], (err) => {
        if (err) {
          console.error('Error updating stock:', err);
        }
      });
      
      res.json({ id: this.lastID, supplier_id, product_id, quantity, unit_cost, total_cost, purchase_date, notes });
    });
  });
});

app.delete('/api/purchases/:id', (req, res) => {
  // Get purchase details first to adjust stock
  db.get('SELECT product_id, quantity FROM purchases WHERE id = ?', [req.params.id], (err, purchase) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (purchase) {
      // Adjust stock back
      db.run('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?', [purchase.quantity, purchase.product_id], (err) => {
        if (err) {
          console.error('Error adjusting stock:', err);
        }
      });
      
      // Delete purchase
      db.run('DELETE FROM purchases WHERE id = ?', [req.params.id], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Purchase deleted', id: req.params.id });
      });
    } else {
      res.status(404).json({ error: 'Purchase not found' });
    }
  });
});

// ==================== SALES ====================
app.get('/api/sales', (req, res) => {
  db.all(`SELECT s.*, p.name as product_name 
    FROM sales s 
    LEFT JOIN products p ON s.product_id = p.id 
    ORDER BY s.sale_date DESC`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/sales', (req, res) => {
  const { product_id, quantity, unit_price, sale_date, customer_name, notes } = req.body;
  const total_price = quantity * unit_price;
  
  // Check stock availability
  db.get('SELECT stock_quantity FROM products WHERE id = ?', [product_id], (err, product) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!product || product.stock_quantity < quantity) {
      res.status(400).json({ error: 'Insufficient stock' });
      return;
    }
    
    db.serialize(() => {
      db.run('INSERT INTO sales (product_id, quantity, unit_price, total_price, sale_date, customer_name, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [product_id, quantity, unit_price, total_price, sale_date || new Date().toISOString(), customer_name, notes], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        // Update product stock
        db.run('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?', [quantity, product_id], (err) => {
          if (err) {
            console.error('Error updating stock:', err);
          }
        });
        
        res.json({ id: this.lastID, product_id, quantity, unit_price, total_price, sale_date, customer_name, notes });
      });
    });
  });
});

app.delete('/api/sales/:id', (req, res) => {
  // Get sale details first to adjust stock
  db.get('SELECT product_id, quantity FROM sales WHERE id = ?', [req.params.id], (err, sale) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (sale) {
      // Adjust stock back
      db.run('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?', [sale.quantity, sale.product_id], (err) => {
        if (err) {
          console.error('Error adjusting stock:', err);
        }
      });
      
      // Delete sale
      db.run('DELETE FROM sales WHERE id = ?', [req.params.id], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Sale deleted', id: req.params.id });
      });
    } else {
      res.status(404).json({ error: 'Sale not found' });
    }
  });
});

// ==================== EXPENSES ====================
app.get('/api/expenses', (req, res) => {
  db.all('SELECT * FROM expenses ORDER BY expense_date DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/expenses', (req, res) => {
  const { category, description, amount, expense_date, notes } = req.body;
  db.run('INSERT INTO expenses (category, description, amount, expense_date, notes) VALUES (?, ?, ?, ?, ?)',
    [category, description, amount, expense_date || new Date().toISOString(), notes], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, category, description, amount, expense_date, notes });
  });
});

app.put('/api/expenses/:id', (req, res) => {
  const { category, description, amount, expense_date, notes } = req.body;
  db.run('UPDATE expenses SET category = ?, description = ?, amount = ?, expense_date = ?, notes = ? WHERE id = ?',
    [category, description, amount, expense_date, notes, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: req.params.id, category, description, amount, expense_date, notes });
  });
});

app.delete('/api/expenses/:id', (req, res) => {
  db.run('DELETE FROM expenses WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Expense deleted', id: req.params.id });
  });
});

// ==================== PROFIT CALCULATION ====================
app.get('/api/profit', (req, res) => {
  const { startDate, endDate } = req.query;
  
  let salesQuery = 'SELECT COALESCE(SUM(total_price), 0) as total_revenue FROM sales';
  let purchasesQuery = 'SELECT COALESCE(SUM(total_cost), 0) as total_cost FROM purchases';
  let expensesQuery = 'SELECT COALESCE(SUM(amount), 0) as total_expenses FROM expenses';
  
  const dateFilter = startDate && endDate ? ' WHERE date(expense_date) BETWEEN ? AND ?' : '';
  const dateParams = startDate && endDate ? [startDate, endDate] : [];
  
  if (dateFilter) {
    salesQuery += ' WHERE date(sale_date) BETWEEN ? AND ?';
    purchasesQuery += ' WHERE date(purchase_date) BETWEEN ? AND ?';
    expensesQuery += dateFilter;
  }
  
  db.serialize(() => {
    db.get(salesQuery, dateParams, (err, sales) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      db.get(purchasesQuery, dateParams, (err, purchases) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        db.get(expensesQuery, dateParams, (err, expenses) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          
          const revenue = sales.total_revenue || 0;
          const cost = purchases.total_cost || 0;
          const totalExpenses = expenses.total_expenses || 0;
          const grossProfit = revenue - cost;
          const netProfit = grossProfit - totalExpenses;
          
          res.json({
            revenue,
            cost,
            expenses: totalExpenses,
            grossProfit,
            netProfit,
            period: startDate && endDate ? { startDate, endDate } : 'all'
          });
        });
      });
    });
  });
});

// ==================== REPORTS ====================
app.get('/api/reports/summary', (req, res) => {
  db.serialize(() => {
    db.get('SELECT COUNT(*) as total_products, SUM(stock_quantity) as total_stock FROM products', (err, products) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      db.get('SELECT COUNT(*) as total_categories FROM categories', (err, categories) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        db.get('SELECT COUNT(*) as total_suppliers FROM suppliers', (err, suppliers) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          
          db.get('SELECT COUNT(*) as total_sales, COALESCE(SUM(total_price), 0) as sales_revenue FROM sales', (err, sales) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            
            db.get('SELECT COUNT(*) as total_purchases, COALESCE(SUM(total_cost), 0) as purchase_cost FROM purchases', (err, purchases) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }
              
              db.get('SELECT COUNT(*) as total_expenses, COALESCE(SUM(amount), 0) as total_expenses_amount FROM expenses', (err, expenses) => {
                if (err) {
                  res.status(500).json({ error: err.message });
                  return;
                }
                
                res.json({
                  products: products.total_products || 0,
                  totalStock: products.total_stock || 0,
                  categories: categories.total_categories || 0,
                  suppliers: suppliers.total_suppliers || 0,
                  sales: {
                    count: sales.total_sales || 0,
                    revenue: sales.sales_revenue || 0
                  },
                  purchases: {
                    count: purchases.total_purchases || 0,
                    cost: purchases.purchase_cost || 0
                  },
                  expenses: {
                    count: expenses.total_expenses || 0,
                    amount: expenses.total_expenses_amount || 0
                  }
                });
              });
            });
          });
        });
      });
    });
  });
});

app.get('/api/reports/low-stock', (req, res) => {
  db.all(`SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE p.stock_quantity <= p.reorder_level 
    ORDER BY (p.stock_quantity - p.reorder_level) ASC`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/reports/sales-by-product', (req, res) => {
  const { startDate, endDate } = req.query;
  let query = `SELECT p.name as product_name, 
    SUM(s.quantity) as total_quantity, 
    SUM(s.total_price) as total_revenue 
    FROM sales s 
    JOIN products p ON s.product_id = p.id`;
  
  const params = [];
  if (startDate && endDate) {
    query += ' WHERE date(s.sale_date) BETWEEN ? AND ?';
    params.push(startDate, endDate);
  }
  
  query += ' GROUP BY p.id, p.name ORDER BY total_revenue DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
