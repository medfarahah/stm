import React, { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'

const POS = () => {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [showReceipt, setShowReceipt] = useState(false)
  const [lastSale, setLastSale] = useState(null)
  const searchInputRef = useRef(null)

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products')
      setProducts(res.data.filter(p => p.stock_quantity > 0))
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const calculateTotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0)
  }, [cart])

  const handleCheckout = useCallback(async () => {
    if (cart.length === 0) {
      alert('Cart is empty!')
      return
    }

    const total = calculateTotal()
    const saleItems = []

    try {
      // Process each item in cart
      for (const item of cart) {
        const saleData = {
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          sale_date: new Date().toISOString(),
          customer_name: customerName || 'Walk-in Customer',
          notes: `POS Sale - Payment: ${paymentMethod}`
        }

        const res = await axios.post('/api/sales', saleData)
        saleItems.push(res.data)
      }

      const saleSummary = {
        items: saleItems,
        total: total,
        customer: customerName || 'Walk-in Customer',
        paymentMethod: paymentMethod,
        date: new Date().toISOString()
      }

      setLastSale(saleSummary)
      setShowReceipt(true)
      setCart([])
      setCustomerName('')
      setPaymentMethod('cash')
      fetchProducts() // Refresh product stock
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    } catch (error) {
      console.error('Error processing sale:', error)
      alert(error.response?.data?.error || 'Error processing sale')
    }
  }, [cart, customerName, paymentMethod, calculateTotal])

  useEffect(() => {
    fetchProducts()
    searchInputRef.current?.focus()

    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      // F1 - Checkout
      if (e.key === 'F1') {
        e.preventDefault()
        if (cart.length > 0) handleCheckout()
      }
      // Escape - Clear search
      if (e.key === 'Escape') {
        setSearchTerm('')
        searchInputRef.current?.focus()
      }
      // F2 - Clear cart
      if (e.key === 'F2') {
        e.preventDefault()
        if (window.confirm('Clear cart?')) {
          setCart([])
          searchInputRef.current?.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cart, handleCheckout])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock_quantity) {
        alert('Insufficient stock!')
        return
      }
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
    setSearchTerm('')
    searchInputRef.current?.focus()
  }

  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change
        if (newQuantity <= 0) return null
        if (newQuantity > item.stock_quantity) {
          alert('Insufficient stock!')
          return item
        }
        return { ...item, quantity: newQuantity }
      }
      return item
    }).filter(Boolean))
  }

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm) {
      const product = products.find(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      if (product) {
        addToCart(product)
      }
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  ).slice(0, 8)

  return (
    <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 200px)' }}>
      {/* Receipt Modal */}
      {showReceipt && lastSale && (
        <div className="modal" onClick={() => setShowReceipt(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '32px',
                fontWeight: '800',
                marginBottom: '10px'
              }}>✓ Sale Complete!</div>
              <h2 style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '20px'
              }}>Receipt</h2>
              <div style={{ 
                borderTop: '3px dashed',
                borderImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderImageSlice: 1,
                margin: '20px 0', 
                paddingTop: '20px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <p style={{ marginBottom: '8px' }}><strong style={{ color: '#6366f1' }}>Date:</strong> {new Date(lastSale.date).toLocaleString()}</p>
                <p style={{ marginBottom: '8px' }}><strong style={{ color: '#6366f1' }}>Customer:</strong> {lastSale.customer}</p>
                <p><strong style={{ color: '#6366f1' }}>Payment:</strong> <span style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 'bold'
                }}>{lastSale.paymentMethod.toUpperCase()}</span></p>
              </div>
              <table style={{ 
                width: '100%', 
                margin: '20px 0', 
                textAlign: 'left',
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}>
                <thead>
                  <tr style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
                    <th style={{ padding: '12px', fontWeight: '600' }}>Item</th>
                    <th style={{ padding: '12px', fontWeight: '600' }}>Qty</th>
                    <th style={{ padding: '12px', fontWeight: '600' }}>Price</th>
                    <th style={{ padding: '12px', fontWeight: '600' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lastSale.items.map((item, idx) => (
                    <tr key={idx} style={{
                      background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? '#ffffff' : '#f8fafc'}
                    >
                      <td style={{ padding: '12px', fontWeight: '500' }}>{products.find(p => p.id === item.product_id)?.name || 'Product'}</td>
                      <td style={{ padding: '12px' }}>{item.quantity}</td>
                      <td style={{ padding: '12px' }}>${item.unit_price?.toFixed(2)}</td>
                      <td style={{ 
                        padding: '12px',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>${item.total_price?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ 
                    borderTop: '3px solid',
                    borderImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderImageSlice: 1,
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                  }}>
                    <td colSpan="3" style={{ padding: '16px', fontSize: '18px' }}>TOTAL</td>
                    <td style={{ 
                      padding: '16px',
                      fontSize: '24px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: '800'
                    }}>${lastSale.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print Receipt</button>
                <button className="btn btn-secondary" onClick={() => setShowReceipt(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Left Panel - Product Search and Selection */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>Search Products</h3>
          <input
            ref={searchInputRef}
            type="text"
            className="form-group input"
            placeholder="🔍 Search by name or SKU (Enter to add | F1=Checkout | F2=Clear | Esc=Clear search)"
            value={searchTerm}
            onChange={handleSearch}
            onKeyPress={handleKeyPress}
            style={{ 
              width: '100%', 
              padding: '18px 24px', 
              fontSize: '18px', 
              marginBottom: '20px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '3px solid #e0e7ff',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.1)',
              transition: 'all 0.3s'
            }}
          />
          
          {searchTerm && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '10px',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {filteredProducts.map((product, idx) => {
                const gradients = [
                  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
                ]
                const gradient = gradients[idx % gradients.length]
                return (
                  <div
                    key={product.id}
                    onClick={() => addToCart(product)}
                    style={{
                      border: '2px solid transparent',
                      borderRadius: '16px',
                      padding: '18px',
                      cursor: 'pointer',
                      background: 'white',
                      transition: 'all 0.3s',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)'
                      e.currentTarget.style.borderColor = '#6366f1'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)'
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)'
                      e.currentTarget.style.borderColor = 'transparent'
                    }}
                  >
                    <div style={{ 
                      fontWeight: 'bold', 
                      marginBottom: '8px',
                      fontSize: '16px',
                      background: gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>{product.name}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>SKU: {product.sku || 'N/A'}</div>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: 'bold',
                      background: gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      ${product.unit_price?.toFixed(2)} | Stock: {product.stock_quantity}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Product Grid */}
        <div className="card" style={{ flex: '1', overflowY: 'auto' }}>
          <h3>Available Products</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
            gap: '10px'
          }}>
            {products.slice(0, 20).map((product, idx) => {
              const gradients = [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
              ]
              const gradient = gradients[idx % gradients.length]
              const isLowStock = product.stock_quantity <= product.reorder_level
              return (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  style={{
                    border: `3px solid ${isLowStock ? '#ef4444' : 'transparent'}`,
                    borderRadius: '16px',
                    padding: '16px',
                    cursor: 'pointer',
                    background: isLowStock 
                      ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' 
                      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    transition: 'all 0.3s',
                    boxShadow: isLowStock 
                      ? '0 4px 15px rgba(239, 68, 68, 0.2)' 
                      : '0 4px 15px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)'
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(99, 102, 241, 0.3)'
                    e.currentTarget.style.borderColor = '#6366f1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = isLowStock 
                      ? '0 4px 15px rgba(239, 68, 68, 0.2)' 
                      : '0 4px 15px rgba(0, 0, 0, 0.1)'
                    e.currentTarget.style.borderColor = isLowStock ? '#ef4444' : 'transparent'
                  }}
                >
                  <div style={{ 
                    fontWeight: 'bold', 
                    fontSize: '14px', 
                    marginBottom: '8px',
                    background: gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name}
                  </div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: '800',
                    background: gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '6px'
                  }}>
                    ${product.unit_price?.toFixed(2)}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: isLowStock ? '#dc2626' : '#6b7280',
                    fontWeight: '600'
                  }}>
                    Stock: {product.stock_quantity}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right Panel - Shopping Cart */}
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column' }}>
        <div className="card" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ marginBottom: '20px' }}>Shopping Cart</h2>
          
          {cart.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 40px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              borderRadius: '20px',
              border: '2px dashed #c7d2fe'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>🛒</div>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '8px'
              }}>Cart is empty</div>
              <small style={{ color: '#9ca3af' }}>Search and add products</small>
            </div>
          ) : (
            <>
              <div style={{ flex: '1', overflowY: 'auto', marginBottom: '20px' }}>
                {cart.map(item => (
                  <div
                    key={item.id}
                    style={{
                      border: '2px solid #e5e7eb',
                      borderRadius: '16px',
                      padding: '18px',
                      marginBottom: '12px',
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(5px)'
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.2)'
                      e.currentTarget.style.borderColor = '#6366f1'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)'
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)'
                      e.currentTarget.style.borderColor = '#e5e7eb'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                      <div style={{ flex: '1' }}>
                        <div style={{ 
                          fontWeight: 'bold', 
                          marginBottom: '8px',
                          fontSize: '16px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}>{item.name}</div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#6b7280',
                          fontWeight: '500'
                        }}>
                          ${item.unit_price?.toFixed(2)} each
                        </div>
                      </div>
                      <button
                        className="btn btn-danger"
                        onClick={() => removeFromCart(item.id)}
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        ×
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => updateQuantity(item.id, -1)}
                        style={{ padding: '5px 15px' }}
                      >
                        −
                      </button>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', minWidth: '40px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        className="btn btn-secondary"
                        onClick={() => updateQuantity(item.id, 1)}
                        style={{ padding: '5px 15px' }}
                      >
                        +
                      </button>
                      <div style={{ 
                        marginLeft: 'auto', 
                        fontSize: '18px', 
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ 
                borderTop: '3px solid transparent',
                borderImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderImageSlice: 1,
                paddingTop: '24px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                borderRadius: '16px',
                padding: '24px',
                marginTop: '20px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '20px', 
                  fontSize: '28px', 
                  fontWeight: '800',
                  alignItems: 'center'
                }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>Total:</span>
                  <span style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontSize: '32px'
                  }}>${calculateTotal().toFixed(2)}</span>
                </div>

                <div className="form-group">
                  <label>Customer Name (Optional)</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Walk-in Customer"
                  />
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="mobile">Mobile Payment</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <button
                  className="btn btn-success"
                  onClick={handleCheckout}
                  style={{ width: '100%', padding: '15px', fontSize: '18px', fontWeight: 'bold', marginTop: '10px' }}
                >
                  CHECKOUT (F1)
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    if (window.confirm('Clear cart?')) {
                      setCart([])
                      searchInputRef.current?.focus()
                    }
                  }}
                  style={{ width: '100%', padding: '10px', fontSize: '14px', marginTop: '10px' }}
                >
                  Clear Cart (F2)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default POS
