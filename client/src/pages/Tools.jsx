import { Link } from 'react-router-dom';
import { TOOLS, getCategories } from '../toolsConfig';

export default function Tools() {
  const categories = getCategories();

  return (
    <div className="page">
      <h1>All conversion tools</h1>

      {categories.map((cat) => (
        <section key={cat} style={{ marginBottom: '2rem' }}>
          <h2>{cat}</h2>
          <div className="tools-grid">
            {TOOLS.filter((t) => t.category === cat).map((t) => (
              <Link to={`/tools/${t.slug}`} className="tool-card" key={t.slug}>
                <span className="tool-card-label">{t.label}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
