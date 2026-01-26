import React, { useState } from 'react'
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
  const [activeTab, setActiveTab] = useState('pos')

  const renderContent = () => {
    switch (activeTab) {
      case 'pos':
        return <POS />
      case 'dashboard':
        return <Dashboard />
      case 'categories':
        return <Categories />
      case 'products':
        return <Products />
      case 'suppliers':
        return <Suppliers />
      case 'purchases':
        return <Purchases />
      case 'sales':
        return <Sales />
      case 'expenses':
        return <Expenses />
      case 'reports':
        return <Reports />
      default:
        return <POS />
    }
  }

  return (
    <div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="container">
        {renderContent()}
      </div>
    </div>
  )
}

export default App
