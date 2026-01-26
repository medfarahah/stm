import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Modal from './Modal'

const Sales = () => {
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: '',
    unit_price: '',
    sale_date: new Date().toISOString().split('T')[0],
    customer_name: '',
    notes: ''
  })

  useEffect(() => {
    fetchSales()
    fetchProducts()
  }, [])

  const fetchSales = async () => {
    try {
      const res = await axios.get('/api/sales')
      setSales(res.data)
    } catch (error) {
      console.error('Error fetching sales:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products')
      setProducts(res.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        product_id: parseInt(formData.product_id),
        quantity: parseInt(formData.quantity),
        unit_price: parseFloat(formData.unit_price)
      }
      
      await axios.post('/api/sales', data)
      fetchSales()
      fetchProducts() // Refresh products to see updated stock
      setShowModal(false)
      setFormData({
        product_id: '',
        quantity: '',
        unit_price: '',
        sale_date: new Date().toISOString().split('T')[0],
        customer_name: '',
        notes: ''
      })
    } catch (error) {
      console.error('Error saving sale:', error)
      alert(error.response?.data?.error || 'Error saving sale')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale? Stock will be adjusted.')) {
      try {
        await axios.delete(`/api/sales/${id}`)
        fetchSales()
        fetchProducts() // Refresh products to see updated stock
      } catch (error) {
        console.error('Error deleting sale:', error)
        alert('Error deleting sale')
      }
    }
  }

  const handleProductChange = (productId) => {
    const product = products.find(p => p.id === parseInt(productId))
    if (product) {
      setFormData({
        ...formData,
        product_id: productId,
        unit_price: product.unit_price || ''
      })
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Sales</h2>
        <button className="btn btn-primary" onClick={() => {
          setFormData({
            product_id: '',
            quantity: '',
            unit_price: '',
            sale_date: new Date().toISOString().split('T')[0],
            customer_name: '',
            notes: ''
          })
          setShowModal(true)
        }}>
          Add Sale
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Product</th>
              <th>Customer</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id}>
                <td>{sale.id}</td>
                <td>{new Date(sale.sale_date).toLocaleDateString()}</td>
                <td>{sale.product_name || '-'}</td>
                <td>{sale.customer_name || '-'}</td>
                <td>{sale.quantity}</td>
                <td>${sale.unit_price?.toFixed(2) || '0.00'}</td>
                <td>${sale.total_price?.toFixed(2) || '0.00'}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(sale.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal onClose={() => {
          setShowModal(false)
          setFormData({
            product_id: '',
            quantity: '',
            unit_price: '',
            sale_date: new Date().toISOString().split('T')[0],
            customer_name: '',
            notes: ''
          })
        }}>
          <div className="modal-header">
            <h2>Add Sale</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product *</label>
              <select
                value={formData.product_id}
                onChange={(e) => handleProductChange(e.target.value)}
                required
              >
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Stock: {product.stock_quantity})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Unit Price *</label>
              <input
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                required
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Sale Date *</label>
              <input
                type="date"
                value={formData.sale_date}
                onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => {
                setShowModal(false)
                setFormData({
                  product_id: '',
                  quantity: '',
                  unit_price: '',
                  sale_date: new Date().toISOString().split('T')[0],
                  customer_name: '',
                  notes: ''
                })
              }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default Sales
