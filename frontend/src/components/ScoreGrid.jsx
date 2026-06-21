function color(v) {
  if (v >= 80) return '#3B6D11'
  if (v >= 50) return '#854F0B'
  return '#A32D2D'
}

export default function ScoreGrid({ scores }) {
  const items = [
    { label: 'SEO', val: scores.seo },
    { label: 'Performance', val: scores.performance },
    { label: 'Security', val: scores.security },
    { label: 'Bugs', val: scores.bugs },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: '1.5rem' }}>
      {items.map(({ label, val }) => (
        <div key={label} style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '1rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: color(val) }}>{val}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>/100</div>
        </div>
      ))}
    </div>
  )
}

