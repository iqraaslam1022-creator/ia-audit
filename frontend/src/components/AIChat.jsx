import { useState } from 'react'

export default function AIChat({ data }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function send() {
    const q = input.trim()
    if (!q || loading) return
    setInput('')
    const newHistory = [...messages, { role: 'user', content: q }]
    setMessages(newHistory)
    setLoading(true)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: `You are a website audit expert. The user audited: ${data.url}. Audit: ${JSON.stringify(data)}. Be helpful and concise.`,
          messages: newHistory
        })
      })
      const d = await res.json()
      const reply = d.content.map(b => b.text || '').join('')
      setMessages([...newHistory, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages([...newHistory, { role: 'assistant', content: 'Error: ' + e.message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{
        background: 'var(--purple-light)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        marginBottom: '1rem',
      }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--purple)', marginBottom: 6 }}>🤖 AI Summary</p>
        <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>{data.summary}</p>
      </div>

      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', fontSize: 13, fontWeight: 600 }}>
          💬 Ask AI about your site
        </div>
        <div style={{ padding: '1rem 1.25rem', minHeight: 120, maxHeight: 300, overflowY: 'auto' }}>
          {messages.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>Ask anything about the audit results above...</p>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{
              marginBottom: 12,
              textAlign: m.role === 'user' ? 'right' : 'left',
            }}>
              <span style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: 10,
                fontSize: 13,
                lineHeight: 1.6,
                background: m.role === 'user' ? 'var(--purple)' : 'var(--bg)',
                color: m.role === 'user' ? '#fff' : 'var(--text)',
                maxWidth: '80%',
                textAlign: 'left',
              }}>{m.content}</span>
            </div>
          ))}
          {loading && <p style={{ fontSize: 13, color: 'var(--muted)' }}>Thinking...</p>}
        </div>
        <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="e.g. How do I fix the missing meta description?"
            style={{
              flex: 1, padding: '9px 12px',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: 13,
              background: 'var(--bg)',
              color: 'var(--text)',
              outline: 'none',
            }}
          />
          <button onClick={send} disabled={loading} style={{
            padding: '9px 16px',
            background: 'var(--purple)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontSize: 13,
            fontWeight: 600,
          }}>Send</button>
        </div>
      </div>
    </div>
  )
}
