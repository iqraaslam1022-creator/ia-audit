import jsPDF from 'jspdf'

export default function ExportBar({ data }) {
  function exportPDF() {
    const doc = new jsPDF()
    let y = 20
    const line = (txt, size=11, bold=false, color=[0,0,0]) => {
      if (y > 275) { doc.addPage(); y = 20 }
      doc.setFontSize(size)
      doc.setFont('helvetica', bold ? 'bold' : 'normal')
      doc.setTextColor(...color)
      const lines = doc.splitTextToSize(txt, 170)
      doc.text(lines, 20, y)
      y += lines.length * (size * 0.45) + 2
    }
    line('IA Audit Pro — Report', 18, true)
    line(`URL: ${data.url}`)
    line(`Date: ${data.date}`)
    y += 4
    line('Scores', 13, true)
    line(`SEO: ${data.scores.seo}/100  |  Performance: ${data.scores.performance}/100  |  Security: ${data.scores.security}/100  |  Bugs: ${data.scores.bugs}/100`)
    y += 4
    line('Summary', 13, true)
    line(data.summary)
    y += 4
    ;['seo','performance','security','bugs'].forEach(cat => {
      line(cat.toUpperCase(), 13, true)
      ;(data[cat]||[]).forEach(item => {
        line(`[${item.type.toUpperCase()}] ${item.title}`, 11, true)
        line(item.desc)
        line(`Fix: ${item.fix}`, 10, false, [80,80,180])
        y += 2
      })
      y += 3
    })
    doc.save(`audit-${new URL(data.url).hostname}.pdf`)
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `audit-${new URL(data.url).hostname}.json`
    a.click()
  }

  function exportCSV() {
    let csv = 'Category,Type,Title,Description,Fix\n'
    ;['seo','performance','security','bugs'].forEach(cat => {
      ;(data[cat]||[]).forEach(i => {
        csv += `"${cat}","${i.type}","${i.title.replace(/"/g,'""')}","${i.desc.replace(/"/g,'""')}","${i.fix.replace(/"/g,'""')}"\n`
      })
    })
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `audit-${new URL(data.url).hostname}.csv`
    a.click()
  }

  function copyReport() {
    const s = data.scores
    let txt = `IA AUDIT REPORT\nURL: ${data.url}\nDate: ${data.date}\n\nSCORES:\nSEO: ${s.seo}/100 | Performance: ${s.performance}/100 | Security: ${s.security}/100 | Bugs: ${s.bugs}/100\n\nSUMMARY:\n${data.summary}\n`
    ;['seo','performance','security','bugs'].forEach(cat => {
      txt += `\n${cat.toUpperCase()}:\n`
      ;(data[cat]||[]).forEach(i => { txt += `[${i.type.toUpperCase()}] ${i.title}\n${i.desc}\nFix: ${i.fix}\n\n` })
    })
    navigator.clipboard.writeText(txt).then(() => alert('Copied!')).catch(() => alert('Copy failed'))
  }

  const btnStyle = {
    padding: '8px 16px',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    background: 'var(--card)',
    color: 'var(--text)',
    fontSize: 13,
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
      <button onClick={exportPDF} style={btnStyle}>📄 PDF</button>
      <button onClick={exportJSON} style={btnStyle}>⬇️ JSON</button>
      <button onClick={exportCSV} style={btnStyle}>📊 CSV</button>
      <button onClick={copyReport} style={btnStyle}>📋 Copy</button>
    </div>
  )
}

