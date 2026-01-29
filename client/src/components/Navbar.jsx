import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()
  const currentPath = location.pathname

  const tabs = [
    { id: 'pos', path: '/pos', label: '🛒 POS Shop', primary: true },
    { id: 'dashboard', path: '/dashboard', label: 'Dashboard' },
    { id: 'products', path: '/products', label: 'Products' },
    { id: 'sales', path: '/sales', label: 'Sales History' },
    { id: 'purchases', path: '/purchases', label: 'Purchases' },
    { id: 'categories', path: '/categories', label: 'Categories' },
    { id: 'suppliers', path: '/suppliers', label: 'Suppliers' },
    { id: 'expenses', path: '/expenses', label: 'Expenses' },
    { id: 'reports', path: '/reports', label: 'Reports' }
  ]

  return (
    <div className="navbar">
      <div className="container">
        <h1>POS Shop System</h1>
        <div className="nav-tabs">
          {tabs.map(tab => {
            const isActive = currentPath === tab.path || (tab.path === '/pos' && currentPath === '/')
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={`nav-tab ${isActive ? 'active' : ''} ${tab.primary ? 'primary-tab' : ''}`}
                style={{ textDecoration: 'none', display: 'inline-block' }}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Navbar
