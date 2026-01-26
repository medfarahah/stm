import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Modal from './Modal'

const Purchases = () => {
  const [purchases, setPurchases] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    supplier_id: '',
    product_id: '',
    quantity: '',
    unit_cost: '',
    purchase_date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  useEffect(() => {
    fetchPurchases()
    fetchSuppliers()
    fetchProducts()
  }, [])

  const fetchPurchases = async () => {
    try {
      const res = await axios.get('/api/purchases')
      setPurchases(res.data)
    } catch (error) {
      console.error('Error fetching purchases:', error)
    }
  }

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('/api/suppliers')
      setSuppliers(res.data)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
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
        supplier_id: formData.supplier_id || null,
        product_id: parseInt(formData.product_id),
        quantity: parseInt(formData.quantity),
        unit_cost: parseFloat(formData.unit_cost)
      }
      
      await axios.post('/api/purchases', data)
      fetchPurchases()
      setShowModal(false)
      setFormData({
        supplier_id: '',
        product_id: '',
        quantity: '',
        unit_cost: '',
        purchase_date: new Date().toISOString().split('T')[0],
        notes: ''
      })
    } catch (error) {
      console.error('Error saving purchase:', error)
      alert('Error saving purchase')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this purchase? Stock will be adjusted.')) {
      try {
        await axios.delete(`/api/purchases/${id}`)
        fetchPurchases()
        fetchProducts() // Refresh products to see updated stock
      } catch (error) {
        console.error('Error deleting purchase:', error)
        alert('Error deleting purchase')
      }
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Purchases</h2>
        <button className="btn btn-primary" onClick={() => {
          setFormData({
            supplier_id: '',
            product_id: '',
            quantity: '',
            unit_cost: '',
            purchase_date: new Date().toISOString().split('T')[0],
            notes: ''
          })
          setShowModal(true)
        }}>
          Add Purchase
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Product</th>
              <th>Supplier</th>
              <th>Quantity</th>
              <th>Unit Cost</th>
              <th>Total Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map(purchase => (
              <tr key={purchase.id}>
                <td>{purchase.id}</td>
                <td>{new Date(purchase.purchase_date).toLocaleDateString()}</td>
                <td>{purchase.product_name || '-'}</td>
                <td>{purchase.supplier_name || '-'}</td>
                <td>{purchase.quantity}</td>
                <td>${purchase.unit_cost?.toFixed(2) || '0.00'}</td>
                <td>${purchase.total_cost?.toFixed(2) || '0.00'}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(purchase.id)}>
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
            supplier_id: '',
            product_id: '',
            quantity: '',
            unit_cost: '',
            purchase_date: new Date().toISOString().split('T')[0],
            notes: ''
          })
        }}>
          <div className="modal-header">
            <h2>Add Purchase</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Supplier</label>
              <select
                value={formData.supplier_id}
                onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
              >
                <option value="">Select Supplier</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Product *</label>
              <select
                value={formData.product_id}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                required
              >
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
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
              <label>Unit Cost *</label>
              <input
                type="number"
                step="0.01"
                value={formData.unit_cost}
                onChange={(e) => setFormData({ ...formData, unit_cost: e.target.value })}
                required
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Purchase Date *</label>
              <input
                type="date"
                value={formData.purchase_date}
                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                required
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
                  supplier_id: '',
                  product_id: '',
                  quantity: '',
                  unit_cost: '',
                  purchase_date: new Date().toISOString().split('T')[0],
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

export default Purchases
