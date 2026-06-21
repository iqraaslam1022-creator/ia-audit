export default function AuditForm({ onAudit, loading }) {
  function handleSubmit(e) {
    e.preventDefault()
    const url = e.target.url.value.trim()
    if (!url) return
    const full = url.startsWith('http') ? url : 'https://' + url
    onAudit(full)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
      <input
        name="url"
        type="text"
        placeholder="https://yourwebsite.com"
        disabled={loading}
        style={{
          flex: 1, padding: '11px 16px',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius)',
          fontSize: 14,
          background: 'var(--card)',
          color: 'var(--text)',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '11px 22px',
          background: 'var(--purple)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius)',
          fontSize: 14,
          fontWeight: 600,
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Analyzing...' : '⚡ Run Audit'}
      </button>
    </form>
  )
}
