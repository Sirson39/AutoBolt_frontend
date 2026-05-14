import React from 'react';
import '../styles/Skeleton.css';

export const Skeleton = ({ className = '', style = {} }) => (
  <div className={`skeleton ${className}`} style={style} />
);

export const SkeletonCircle = ({ size = 40, className = '' }) => (
  <Skeleton 
    className={`skeleton-circle ${className}`} 
    style={{ width: size, height: size }} 
  />
);

export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className="skeleton-text" style={{ width: i === lines - 1 && lines > 1 ? '80%' : '100%' }} />
    ))}
  </div>
);

export const DashboardSkeleton = () => (
  <div className="page-content" style={{ animation: 'fadeIn 0.5s ease' }}>
    <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="skeleton-stat-card" style={{ borderRadius: '16px' }} />
      ))}
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
      <Skeleton className="skeleton-chart" style={{ borderRadius: '16px' }} />
      <Skeleton className="skeleton-chart" style={{ borderRadius: '16px' }} />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
      <div className="table-card" style={{ padding: '1.5rem' }}>
        <Skeleton className="skeleton-title" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="skeleton-row" style={{ borderRadius: '8px' }} />
        ))}
      </div>
      <div className="table-card" style={{ padding: '1.5rem' }}>
        <Skeleton className="skeleton-title" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} style={{ height: '50px', borderRadius: '8px' }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, columns = 5 }) => (
  <div className="table-card" style={{ padding: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
      <Skeleton style={{ width: '200px', height: '32px' }} />
      <Skeleton style={{ width: '150px', height: '32px' }} />
    </div>
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} style={{ flex: 1, height: '20px' }} />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="skeleton-row" />
    ))}
  </div>
);
