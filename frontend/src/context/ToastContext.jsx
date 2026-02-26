import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CToast, CToastBody, CToastClose, CToaster } from '@coreui/react';
import './ToastContext.css';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const toasterRef = useRef(null);

  const addToast = useCallback((message, color = 'danger') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, color }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <CToaster ref={toasterRef} className="jt-toaster" placement="top-end">
        {toasts.map((t) => (
          <CToast key={t.id} visible color={t.color} className="jt-toast">
            <div className="d-flex">
              <CToastBody>{t.message}</CToastBody>
              <CToastClose className="me-2 m-auto" white />
            </div>
          </CToast>
        ))}
      </CToaster>
    </ToastContext.Provider>
  );
}
