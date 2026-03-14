import React from 'react';

interface Props {
  amount: number;
  currency?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export function PriceTag({ amount, currency = 'USD', label = 'from', size = 'md', style }: Props) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

  const fontSize = size === 'sm' ? '14px' : size === 'lg' ? '28px' : '20px';
  const labelSize = size === 'sm' ? '10px' : '12px';

  return (
    <div style={{ textAlign: 'right', ...style }}>
      {label && (
        <div style={{ fontSize: labelSize, color: '#8b91b0', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 2 }}>
          {label}
        </div>
      )}
      <div style={{ fontSize, fontWeight: 700, color: '#f0f2ff', lineHeight: 1 }}>{formatted}</div>
    </div>
  );
}
