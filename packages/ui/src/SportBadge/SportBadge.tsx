import React from 'react';

const SPORT_EMOJI: Record<string, string> = {
  football: '⚽',
  tennis: '🎾',
  formula1: '🏎️',
  basketball: '🏀',
  baseball: '⚾',
  rugby: '🏉',
  golf: '⛳',
  cycling: '🚴',
  athletics: '🏃',
  cricket: '🏏',
  other: '🏆',
};

const SPORT_COLOR: Record<string, string> = {
  football: '#22c55e',
  tennis: '#f59e0b',
  formula1: '#ef4444',
  basketball: '#f97316',
  baseball: '#3b82f6',
  rugby: '#8b5cf6',
  golf: '#10b981',
  cycling: '#06b6d4',
  athletics: '#ec4899',
  cricket: '#84cc16',
  other: '#6b7280',
};

interface Props {
  sport: string;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export function SportBadge({ sport, size = 'md', style }: Props) {
  const color = SPORT_COLOR[sport] ?? '#6b7280';
  const emoji = SPORT_EMOJI[sport] ?? '🏆';
  const label = sport.charAt(0).toUpperCase() + sport.slice(1);

  const padding = size === 'sm' ? '2px 8px' : size === 'lg' ? '6px 16px' : '4px 12px';
  const fontSize = size === 'sm' ? '11px' : size === 'lg' ? '15px' : '13px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding,
        borderRadius: 20,
        border: `1px solid ${color}44`,
        backgroundColor: `${color}18`,
        fontSize,
        fontWeight: 600,
        color,
        ...style,
      }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </span>
  );
}
