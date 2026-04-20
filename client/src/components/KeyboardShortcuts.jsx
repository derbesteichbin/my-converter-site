import { useState, useEffect } from 'react';

const SHORTCUTS = [
  { keys: 'Ctrl + K', action: 'Open command palette' },
  { keys: 'Enter', action: 'Start conversion (when file selected)' },
  { keys: 'Escape', action: 'Close dialogs and clear errors' },
  { keys: 'Shift + ?', action: 'Show this shortcuts panel' },
];

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKey(e) {
      if (e.shiftKey && e.key === '?') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (!open) return null;

  return (
    <div className="shortcuts-overlay" onClick={() => setOpen(false)}>
      <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Keyboard Shortcuts</h3>
        <table className="shortcuts-table">
          <tbody>
            {SHORTCUTS.map((s) => (
              <tr key={s.keys}>
                <td><kbd>{s.keys}</kbd></td>
                <td>{s.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn-ghost" onClick={() => setOpen(false)} type="button" style={{ marginTop: '1rem' }}>Close</button>
      </div>
    </div>
  );
}
