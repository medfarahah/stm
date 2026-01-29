import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import POS from './components/POS'
import Dashboard from './components/Dashboard'
import Categories from './components/Categories'
import Products from './components/Products'
import Suppliers from './components/Suppliers'
import Purchases from './components/Purchases'
import Sales from './components/Sales'
import Expenses from './components/Expenses'
import Reports from './components/Reports'

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<POS />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
