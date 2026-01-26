import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Modal from './Modal'

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category_id: '',
    description: '',
    unit_price: '',
    stock_quantity: '',
    reorder_level: ''
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products')
      setProducts(res.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories')
      setCategories(res.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        category_id: formData.category_id || null,
        unit_price: parseFloat(formData.unit_price) || 0,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        reorder_level: parseInt(formData.reorder_level) || 0
      }
      
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct.id}`, data)
      } else {
        await axios.post('/api/products', data)
      }
      fetchProducts()
      setShowModal(false)
      setEditingProduct(null)
      setFormData({
        name: '',
        sku: '',
        category_id: '',
        description: '',
        unit_price: '',
        stock_quantity: '',
        reorder_level: ''
      })
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku || '',
      category_id: product.category_id || '',
      description: product.description || '',
      unit_price: product.unit_price || '',
      stock_quantity: product.stock_quantity || '',
      reorder_level: product.reorder_level || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`)
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Error deleting product')
      }
    }
  }

  const getStockStatus = (stock, reorder) => {
    if (stock <= reorder) return { class: 'badge-danger', text: 'Low Stock' }
    if (stock <= reorder * 1.5) return { class: 'badge-warning', text: 'Medium Stock' }
    return { class: 'badge-success', text: 'In Stock' }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Products</h2>
        <button className="btn btn-primary" onClick={() => {
          setEditingProduct(null)
          setFormData({
            name: '',
            sku: '',
            category_id: '',
            description: '',
            unit_price: '',
            stock_quantity: '',
            reorder_level: ''
          })
          setShowModal(true)
        }}>
          Add Product
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const status = getStockStatus(product.stock_quantity, product.reorder_level)
              return (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.sku || '-'}</td>
                  <td>{product.category_name || '-'}</td>
                  <td>${product.unit_price?.toFixed(2) || '0.00'}</td>
                  <td>{product.stock_quantity}</td>
                  <td><span className={`badge ${status.class}`}>{status.text}</span></td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => handleEdit(product)} style={{ marginRight: '10px' }}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal onClose={() => {
          setShowModal(false)
          setEditingProduct(null)
          setFormData({
            name: '',
            sku: '',
            category_id: '',
            description: '',
            unit_price: '',
            stock_quantity: '',
            reorder_level: ''
          })
        }}>
          <div className="modal-header">
            <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>SKU</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
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
              />
            </div>
            <div className="form-group">
              <label>Stock Quantity *</label>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Reorder Level *</label>
              <input
                type="number"
                value={formData.reorder_level}
                onChange={(e) => setFormData({ ...formData, reorder_level: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => {
                setShowModal(false)
                setEditingProduct(null)
                setFormData({
                  name: '',
                  sku: '',
                  category_id: '',
                  description: '',
                  unit_price: '',
                  stock_quantity: '',
                  reorder_level: ''
                })
              }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingProduct ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default Products
