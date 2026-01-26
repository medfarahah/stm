# POS Shop System

A comprehensive Point of Sale (POS) shop system built with React and Node.js/Express. This system provides a complete retail solution with POS interface, inventory management, sales tracking, purchase management, expense tracking, and detailed reporting capabilities.

## Features

### POS Shop Features
- **🛒 Point of Sale Interface**: Fast, intuitive checkout system
  - Quick product search by name or SKU
  - Shopping cart with quantity management
  - Multiple payment methods (Cash, Card, Mobile Payment)
  - Real-time stock validation
  - Receipt generation and printing
  - Keyboard shortcuts for fast operation (F1=Checkout, F2=Clear, Esc=Clear search)
  - Product grid for quick selection
  - Customer name tracking

### Inventory Management Features
- **Categories Management**: Organize products into categories
- **Products Management**: Track products with SKU, pricing, stock levels, and reorder points
- **Suppliers Management**: Maintain supplier information and contact details
- **Purchases Tracking**: Record purchases from suppliers with automatic stock updates
- **Sales History**: View all past sales transactions
- **Expenses Management**: Track business expenses by category
- **Profit Calculation**: Real-time profit and loss calculations (Gross Profit, Net Profit)
- **Reports Dashboard**: 
  - Summary statistics
  - Low stock alerts
  - Sales by product reports
  - Profit & Loss reports with date filtering

### Additional Features
- **Stock Management**: Automatic stock updates on purchases and sales
- **Low Stock Alerts**: Visual indicators for products below reorder level
- **Date Range Filtering**: Filter reports and profit calculations by date range
- **Modern UI**: Clean, responsive interface optimized for shop use
- **Real-time Updates**: Instant updates across all modules
- **Receipt Printing**: Print-friendly receipt format

## Tech Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database for data persistence
- RESTful API architecture

### Frontend
- **React** 18
- **Vite** for fast development and building
- **Axios** for API communication
- Modern CSS with responsive design

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd stm
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```
   
   Or install manually:
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Start the development servers**
   
   From the root directory:
   ```bash
   npm run dev
   ```
   
   This will start both the backend server (port 3001) and frontend development server (port 3000).
   
   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   cd server
   npm start
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - The backend API will be available at `http://localhost:3001`

## Database

The system uses SQLite database which is automatically created on first run. The database file (`inventory.db`) will be created in the `server` directory.

### Database Schema
- **categories**: Product categories
- **products**: Product information with stock tracking
- **suppliers**: Supplier details
- **purchases**: Purchase records with automatic stock updates
- **sales**: Sales records with automatic stock deduction
- **expenses**: Business expense tracking

## Usage Guide

### Getting Started
1. **Create Categories**: Start by creating product categories (e.g., Electronics, Clothing, Food)
2. **Add Suppliers**: Add your suppliers with contact information
3. **Add Products**: Create products and assign them to categories with pricing
4. **Record Purchases**: When you receive inventory, record purchases (stock is automatically updated)
5. **Start Selling**: Use the POS interface to process sales
6. **Track Expenses**: Record business expenses
7. **View Reports**: Check the Reports section for insights and low stock alerts

### POS Shop Workflow (Primary Use)
1. **Open POS**: The POS interface is the default view
2. **Search/Select Products**: 
   - Type product name or SKU in search box (press Enter to add)
   - Or click products from the grid
3. **Manage Cart**: 
   - Adjust quantities with +/- buttons
   - Remove items with × button
4. **Checkout**:
   - Enter customer name (optional, defaults to "Walk-in Customer")
   - Select payment method
   - Click "CHECKOUT" or press F1
5. **Receipt**: View and print receipt after successful sale
6. **Next Sale**: System automatically clears cart and focuses search for next customer

### Keyboard Shortcuts (POS)
- **Enter**: Add searched product to cart
- **F1**: Checkout current cart
- **F2**: Clear cart
- **Esc**: Clear search field

### Management Workflows

**Purchase Workflow:**
1. Go to Purchases → Add Purchase
2. Select supplier (optional)
3. Select product
4. Enter quantity and unit cost
5. Stock is automatically increased

**Manual Sales Entry:**
1. Go to Sales History → Add Sale
2. Select product (shows current stock)
3. Enter quantity and unit price
4. System validates stock availability
5. Stock is automatically decreased

**Profit Calculation:**
- Gross Profit = Total Revenue - Cost of Goods Sold
- Net Profit = Gross Profit - Total Expenses
- View profit reports in Dashboard or Reports section

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Purchases
- `GET /api/purchases` - Get all purchases
- `POST /api/purchases` - Create purchase (auto-updates stock)
- `DELETE /api/purchases/:id` - Delete purchase (auto-adjusts stock)

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create sale (validates and updates stock)
- `DELETE /api/sales/:id` - Delete sale (auto-adjusts stock)

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Reports
- `GET /api/reports/summary` - Get summary statistics
- `GET /api/reports/low-stock` - Get low stock products
- `GET /api/reports/sales-by-product` - Get sales by product
- `GET /api/profit` - Get profit calculation (supports date range)

## Project Structure

```
stm/
├── server/
│   ├── index.js          # Backend server and API routes
│   ├── package.json      # Backend dependencies
│   └── inventory.db      # SQLite database (created automatically)
├── client/
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Suppliers.jsx
│   │   │   ├── Purchases.jsx
│   │   │   ├── Sales.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Modal.jsx
│   │   ├── App.jsx       # Main app component
│   │   ├── main.jsx      # React entry point
│   │   └── index.css     # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json      # Frontend dependencies
├── package.json          # Root package.json with scripts
└── README.md
```

## Future Enhancements (Suggestions)

1. **Barcode Scanner Integration**: Hardware barcode scanner support
2. **Customer Database**: Maintain customer profiles and purchase history
3. **Loyalty Programs**: Points and rewards system
4. **Receipt Printer Integration**: Direct thermal printer support
5. **Cash Drawer Integration**: Automatic cash drawer opening
6. **Multi-user Support**: User authentication and role management
7. **Multi-warehouse Support**: Track inventory across multiple locations
8. **Export Functionality**: Export reports to PDF/Excel
9. **Email Notifications**: Low stock email alerts
10. **Advanced Analytics**: Charts and graphs for better visualization
11. **Inventory Valuation**: FIFO/LIFO costing methods
12. **Purchase Orders**: Track pending orders
13. **Payment Tracking**: Track payments and receivables
14. **Discounts & Promotions**: Apply discounts and promotional pricing
15. **Returns & Refunds**: Handle product returns and refunds

## Troubleshooting

**Port already in use:**
- Change ports in `server/index.js` (backend) and `client/vite.config.js` (frontend)

**Database errors:**
- Delete `server/inventory.db` to reset the database
- Ensure write permissions in the server directory

**CORS errors:**
- Ensure backend is running on port 3001
- Check proxy configuration in `client/vite.config.js`

## License

MIT License - feel free to use and modify as needed.

## Support

For issues or questions, please check the code comments or create an issue in your repository.
