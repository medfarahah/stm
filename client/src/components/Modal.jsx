import React from 'react'

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  )
}

export default Modal
