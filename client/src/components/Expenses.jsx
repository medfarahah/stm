import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Modal from './Modal'

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('/api/expenses')
      setExpenses(res.data)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount)
      }
      
      if (editingExpense) {
        await axios.put(`/api/expenses/${editingExpense.id}`, data)
      } else {
        await axios.post('/api/expenses', data)
      }
      fetchExpenses()
      setShowModal(false)
      setEditingExpense(null)
      setFormData({
        category: '',
        description: '',
        amount: '',
        expense_date: new Date().toISOString().split('T')[0],
        notes: ''
      })
    } catch (error) {
      console.error('Error saving expense:', error)
      alert('Error saving expense')
    }
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setFormData({
      category: expense.category,
      description: expense.description || '',
      amount: expense.amount || '',
      expense_date: expense.expense_date ? expense.expense_date.split('T')[0] : new Date().toISOString().split('T')[0],
      notes: expense.notes || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`/api/expenses/${id}`)
        fetchExpenses()
      } catch (error) {
        console.error('Error deleting expense:', error)
        alert('Error deleting expense')
      }
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Expenses</h2>
        <button className="btn btn-primary" onClick={() => {
          setEditingExpense(null)
          setFormData({
            category: '',
            description: '',
            amount: '',
            expense_date: new Date().toISOString().split('T')[0],
            notes: ''
          })
          setShowModal(true)
        }}>
          Add Expense
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense.id}>
                <td>{expense.id}</td>
                <td>{new Date(expense.expense_date).toLocaleDateString()}</td>
                <td>{expense.category}</td>
                <td>{expense.description || '-'}</td>
                <td>${expense.amount?.toFixed(2) || '0.00'}</td>
                <td>{expense.notes || '-'}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleEdit(expense)} style={{ marginRight: '10px' }}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(expense.id)}>
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
          setEditingExpense(null)
          setFormData({
            category: '',
            description: '',
            amount: '',
            expense_date: new Date().toISOString().split('T')[0],
            notes: ''
          })
        }}>
          <div className="modal-header">
            <h2>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                placeholder="e.g., Rent, Utilities, Marketing"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Amount *</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Expense Date *</label>
              <input
                type="date"
                value={formData.expense_date}
                onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
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
                setEditingExpense(null)
                setFormData({
                  category: '',
                  description: '',
                  amount: '',
                  expense_date: new Date().toISOString().split('T')[0],
                  notes: ''
                })
              }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingExpense ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default Expenses
