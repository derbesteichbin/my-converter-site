import SEO from '../components/SEO';

// German publisher information page (legally required under § 5 TMG for
// commercial websites operated from Germany). Content stays in German
// because the legal references are German law.
export default function Impressum() {
  return (
    <div className="page legal-page">
      <SEO
        title="Impressum"
        path="/impressum"
        description="Impressum von ConvertAnyFormat — Anbieterkennzeichnung gemäß § 5 TMG."
      />
      <h1>Impressum</h1>

      <section>
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>
          <strong>Name:</strong> Arwand Moobed Mehdiabadi<br />
          <strong>Adresse:</strong> Suitbertus Str. 3, 40223 Düsseldorf, Deutschland
        </p>
      </section>

      <section>
        <h2>Kontakt</h2>
        <p>
          E-Mail: <a href="mailto:Support@convertanyformat.com">Support@convertanyformat.com</a>
        </p>
      </section>

      <section>
        <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p>
          Arwand Moobed Mehdiabadi<br />
          Suitbertus Str. 3<br />
          40223 Düsseldorf
        </p>
      </section>

      <section>
        <h2>Steuernummer</h2>
        <p>Wird nach Gewerbeanmeldung ergänzt.</p>
      </section>

      <section>
        <h2>Haftungsausschluss</h2>
        <p>
          Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt.
          Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir
          jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG
          für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
        </p>
      </section>

      <section>
        <h2>Urheberrecht</h2>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
          unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
          Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes
          bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
        </p>
      </section>
    </div>
  );
}
