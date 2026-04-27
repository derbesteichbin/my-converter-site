import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function KeyboardShortcuts() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const shortcuts = [
    { keys: 'Ctrl + K', action: t('shortcuts.openPalette') },
    { keys: 'Enter', action: t('shortcuts.startConv') },
    { keys: 'Escape', action: t('shortcuts.closeDialog') },
    { keys: 'Shift + ?', action: t('shortcuts.showShortcuts') },
  ];

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
        <h3>{t('shortcuts.title')}</h3>
        <table className="shortcuts-table">
          <tbody>
            {shortcuts.map((s) => (
              <tr key={s.keys}>
                <td><kbd>{s.keys}</kbd></td>
                <td>{s.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn-ghost" onClick={() => setOpen(false)} type="button" style={{ marginTop: '1rem' }}>{t('common.close')}</button>
      </div>
    </div>
  );
}
