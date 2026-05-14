import React from 'react';
import { Plus } from 'lucide-react';

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  message, 
  actionLabel, 
  onAction,
  className = '' 
}) => (
  <div className={`empty-state ${className}`} style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    textAlign: 'center',
    background: 'var(--surface)',
    borderRadius: 'var(--radius, 16px)',
    border: '2px dashed var(--border)',
    margin: '1rem 0'
  }}>
    {Icon && <Icon size={64} style={{ opacity: 0.15, marginBottom: '1.5rem', color: 'var(--brand)' }} />}
    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--ink)' }}>{title}</h3>
    <p style={{ color: 'var(--ink-soft)', maxWidth: '400px', marginBottom: '2rem', lineHeight: '1.6' }}>{message}</p>
    {actionLabel && onAction && (
      <button 
        className="btn btn-primary" 
        onClick={onAction}
        style={{ padding: '0.8rem 2rem', borderRadius: 'var(--radius-sm)', fontWeight: '700' }}
      >
        <Plus size={18} style={{ marginRight: '8px' }} /> {actionLabel}
      </button>
    )}
  </div>
);
