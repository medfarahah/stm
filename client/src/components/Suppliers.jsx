import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Modal from './Modal'

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('/api/suppliers')
      setSuppliers(res.data)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSupplier) {
        await axios.put(`/api/suppliers/${editingSupplier.id}`, formData)
      } else {
        await axios.post('/api/suppliers', formData)
      }
      fetchSuppliers()
      setShowModal(false)
      setEditingSupplier(null)
      setFormData({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: ''
      })
    } catch (error) {
      console.error('Error saving supplier:', error)
      alert('Error saving supplier')
    }
  }

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      contact_person: supplier.contact_person || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await axios.delete(`/api/suppliers/${id}`)
        fetchSuppliers()
      } catch (error) {
        console.error('Error deleting supplier:', error)
        alert('Error deleting supplier')
      }
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Suppliers</h2>
        <button className="btn btn-primary" onClick={() => {
          setEditingSupplier(null)
          setFormData({
            name: '',
            contact_person: '',
            email: '',
            phone: '',
            address: ''
          })
          setShowModal(true)
        }}>
          Add Supplier
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr key={supplier.id}>
                <td>{supplier.id}</td>
                <td>{supplier.name}</td>
                <td>{supplier.contact_person || '-'}</td>
                <td>{supplier.email || '-'}</td>
                <td>{supplier.phone || '-'}</td>
                <td>{supplier.address || '-'}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleEdit(supplier)} style={{ marginRight: '10px' }}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(supplier.id)}>
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
          setEditingSupplier(null)
          setFormData({
            name: '',
            contact_person: '',
            email: '',
            phone: '',
            address: ''
          })
        }}>
          <div className="modal-header">
            <h2>{editingSupplier ? 'Edit Supplier' : 'Add Supplier'}</h2>
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
              <label>Contact Person</label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows="3"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => {
                setShowModal(false)
                setEditingSupplier(null)
                setFormData({
                  name: '',
                  contact_person: '',
                  email: '',
                  phone: '',
                  address: ''
                })
              }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingSupplier ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default Suppliers
