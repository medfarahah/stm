import React from 'react'

const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'pos', label: '🛒 POS Shop', primary: true },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'products', label: 'Products' },
    { id: 'sales', label: 'Sales History' },
    { id: 'purchases', label: 'Purchases' },
    { id: 'categories', label: 'Categories' },
    { id: 'suppliers', label: 'Suppliers' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'reports', label: 'Reports' }
  ]

  return (
    <div className="navbar">
      <div className="container">
        <h1>POS Shop System</h1>
        <div className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''} ${tab.primary ? 'primary-tab' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Navbar
