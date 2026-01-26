import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Reports = () => {
  const [lowStock, setLowStock] = useState([])
  const [salesByProduct, setSalesByProduct] = useState([])
  const [profit, setProfit] = useState(null)
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    fetchLowStock()
    fetchSalesByProduct()
    fetchProfit()
  }, [])

  const fetchLowStock = async () => {
    try {
      const res = await axios.get('/api/reports/low-stock')
      setLowStock(res.data)
    } catch (error) {
      console.error('Error fetching low stock:', error)
    }
  }

  const fetchSalesByProduct = async () => {
    try {
      const params = dateRange.startDate && dateRange.endDate
        ? { startDate: dateRange.startDate, endDate: dateRange.endDate }
        : {}
      const res = await axios.get('/api/reports/sales-by-product', { params })
      setSalesByProduct(res.data)
    } catch (error) {
      console.error('Error fetching sales by product:', error)
    }
  }

  const fetchProfit = async () => {
    try {
      const params = dateRange.startDate && dateRange.endDate
        ? { startDate: dateRange.startDate, endDate: dateRange.endDate }
        : {}
      const res = await axios.get('/api/profit', { params })
      setProfit(res.data)
    } catch (error) {
      console.error('Error fetching profit:', error)
    }
  }

  const handleDateRangeChange = () => {
    fetchSalesByProduct()
    fetchProfit()
  }

  return (
    <div>
      <h2>Reports</h2>

      {/* Date Range Filter */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Date Range Filter</h3>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
          <button className="btn btn-primary" onClick={handleDateRangeChange}>
            Apply Filter
          </button>
          <button className="btn btn-secondary" onClick={() => {
            setDateRange({ startDate: '', endDate: '' })
            setTimeout(() => {
              fetchSalesByProduct()
              fetchProfit()
            }, 100)
          }}>
            Clear
          </button>
        </div>
      </div>

      {/* Profit Report */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Profit & Loss Report</h3>
        {profit && (
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
                <td>${profit.revenue?.toFixed(2) || '0.00'}</td>
              </tr>
              <tr>
                <td>Total Cost of Goods</td>
                <td>${profit.cost?.toFixed(2) || '0.00'}</td>
              </tr>
              <tr>
                <td>Gross Profit</td>
                <td className={profit.grossProfit >= 0 ? 'positive' : 'negative'}>
                  ${profit.grossProfit?.toFixed(2) || '0.00'}
                </td>
              </tr>
              <tr>
                <td>Total Expenses</td>
                <td>${profit.expenses?.toFixed(2) || '0.00'}</td>
              </tr>
              <tr>
                <td><strong>Net Profit</strong></td>
                <td className={profit.netProfit >= 0 ? 'positive' : 'negative'}>
                  <strong>${profit.netProfit?.toFixed(2) || '0.00'}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Low Stock Report */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Low Stock Alert</h3>
        {lowStock.length === 0 ? (
          <p>No products with low stock.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category_name || '-'}</td>
                  <td>{product.stock_quantity}</td>
                  <td>{product.reorder_level}</td>
                  <td>
                    <span className="badge badge-danger">Low Stock</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Sales by Product Report */}
      <div className="card">
        <h3>Sales by Product</h3>
        {salesByProduct.length === 0 ? (
          <p>No sales data available.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Total Quantity Sold</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {salesByProduct.map(item => (
                <tr key={item.product_name}>
                  <td>{item.product_name}</td>
                  <td>{item.total_quantity}</td>
                  <td>${item.total_revenue?.toFixed(2) || '0.00'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Reports
