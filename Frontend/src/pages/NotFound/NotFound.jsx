import { Link } from "react-router-dom";
import "./notFound.css";

const NotFound = () => {
  return (
    <main className="nf-page">
      <header className="nf-topbar">
        <span className="nf-brand">DEVSYNC®</span>
        <span className="nf-status">
          <i className="nf-dot" /> SIGNAL LOST — SECTOR 404
        </span>
        <span className="nf-coord">LAT 00.00 / LON 00.00</span>
      </header>

      <section className="nf-center">
        <p className="nf-kicker">[ TRANSMISSION ] — the route drifted off the grid</p>

        <h1 className="nf-code" aria-label="404">
          <span>4</span>
          <span className="nf-zero">0</span>
          <span>4</span>
        </h1>

        <p className="nf-headline">
          Lost in <em>orbit.</em>
        </p>

        <p className="nf-sub">
          The page you scanned isn&apos;t on any known map. It may have moved,
          been retired, or never existed in this universe.
        </p>

        <Link to="/" className="nf-btn">
          RETURN TO BASE <span className="nf-arrow">↗</span>
        </Link>
      </section>

      <footer className="nf-footer">
        <span>DEVSYNC® — EVERY TEAM. ONE PULSE. ZERO CHAOS.</span>
        <span className="nf-err">ERR_ROUTE_NOT_FOUND</span>
      </footer>

      <div className="nf-ghost" aria-hidden="true">404</div>
    </main>
  );
};

export default NotFound;
