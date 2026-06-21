const BADGE = {
  critical: { bg: '#FCEBEB', color: '#A32D2D' },
  warning:  { bg: '#FAEEDA', color: '#854F0B' },
  info:     { bg: '#EEEDFE', color: '#3C3489' },
  pass:     { bg: '#EAF3DE', color: '#3B6D11' },
}

export default function IssueList({ items = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item, i) => {
        const b = BADGE[item.type] || BADGE.info
        return (
          <div key={i} style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{
                fontSize: 11, padding: '2px 10px', borderRadius: 20,
                fontWeight: 600, background: b.bg, color: b.color,
              }}>{item.type.toUpperCase()}</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{item.title}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>{item.desc}</p>
            <p style={{ fontSize: 12, color: 'var(--purple)' }}>🔧 {item.fix}</p>
          </div>
        )
      })}
    </div>
  )
}
