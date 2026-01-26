import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [profit, setProfit] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [summaryRes, profitRes] = await Promise.all([
        axios.get('/api/reports/summary'),
        axios.get('/api/profit')
      ])
      setSummary(summaryRes.data)
      setProfit(profitRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2>Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <div className="value">{summary?.products || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Stock</h3>
          <div className="value">{summary?.totalStock || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Categories</h3>
          <div className="value">{summary?.categories || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Suppliers</h3>
          <div className="value">{summary?.suppliers || 0}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Sales</h3>
          <div className="value">${summary?.sales?.revenue?.toFixed(2) || '0.00'}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Purchases</h3>
          <div className="value">${summary?.purchases?.cost?.toFixed(2) || '0.00'}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Expenses</h3>
          <div className="value">${summary?.expenses?.amount?.toFixed(2) || '0.00'}</div>
        </div>
        
        <div className="stat-card">
          <h3>Net Profit</h3>
          <div className={`value ${profit?.netProfit >= 0 ? 'positive' : 'negative'}`}>
            ${profit?.netProfit?.toFixed(2) || '0.00'}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Profit & Loss Summary</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Revenue</td>
              <td>${profit?.revenue?.toFixed(2) || '0.00'}</td>
            </tr>
            <tr>
              <td>Total Cost of Goods</td>
              <td>${profit?.cost?.toFixed(2) || '0.00'}</td>
            </tr>
            <tr>
              <td>Gross Profit</td>
              <td className={profit?.grossProfit >= 0 ? 'positive' : 'negative'}>
                ${profit?.grossProfit?.toFixed(2) || '0.00'}
              </td>
            </tr>
            <tr>
              <td>Total Expenses</td>
              <td>${profit?.expenses?.toFixed(2) || '0.00'}</td>
            </tr>
            <tr>
              <td><strong>Net Profit</strong></td>
              <td className={profit?.netProfit >= 0 ? 'positive' : 'negative'}>
                <strong>${profit?.netProfit?.toFixed(2) || '0.00'}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard
