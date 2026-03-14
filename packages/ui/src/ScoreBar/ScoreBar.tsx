import React from 'react';

interface Props {
  score: number; // 0–100
  label?: string;
  style?: React.CSSProperties;
}

export function ScoreBar({ score, label = 'Match score', style }: Props) {
  const color = score >= 85 ? '#22c55e' : score >= 70 ? '#4f6ef7' : '#f59e0b';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, ...style }}>
      {label && <span style={{ fontSize: 12, color: '#5a607a', whiteSpace: 'nowrap' }}>{label}</span>}
      <div style={{ flex: 1, height: 5, background: '#2a2f4a', borderRadius: 3, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${score}%`,
            background: `linear-gradient(90deg, #4f6ef7, ${color})`,
            borderRadius: 3,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color, whiteSpace: 'nowrap' }}>{score}/100</span>
    </div>
  );
}
