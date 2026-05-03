export function Home() {
  return (
    <main>
      <section class="hero">
        <div class="container">
          <h1>Beautiful documentation, <span class="gradient-text">open source</span></h1>
          <p class="hero-subtitle">
            OpenDoc is an open source alternative to Mintlify and Fern. 
            Create stunning documentation sites with MDX, OpenAPI support, and a beautiful UI.
          </p>
          <div class="hero-actions">
            <a href="/admin/projects" class="button primary">Get Started</a>
            <a href="/docs/sample-docs" class="button secondary">View Demo Docs</a>
          </div>
        </div>
      </section>

      <section class="features">
        <div class="container">
          <h2>Features</h2>
          <div class="feature-grid">
            <div class="feature-card">
              <div class="feature-icon">📝</div>
              <h3>MDX Support</h3>
              <p>Write documentation in MDX with React components, callouts, and more.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔌</div>
              <h3>API Docs</h3>
              <p>Generate beautiful API documentation from OpenAPI specs automatically.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔍</div>
              <h3>Instant Search</h3>
              <p>Cmd+K search with Pagefind - fast, client-side, no external services.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🎨</div>
              <h3>Beautiful UI</h3>
              <p>Modern, clean design that looks professional out of the box.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🌙</div>
              <h3>Dark Mode</h3>
              <p>Automatic dark mode support that respects system preferences.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📦</div>
              <h3>Self-Hosted</h3>
              <p>Full control - deploy anywhere with Docker. MIT licensed.</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero {
          padding: 80px 0;
          text-align: center;
        }
        .hero h1 {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 16px;
          line-height: 1.2;
        }
        .gradient-text {
          background: linear-gradient(135deg, var(--color-primary), #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 20px;
          color: var(--color-text-secondary);
          max-width: 600px;
          margin: 0 auto 32px;
        }
        .hero-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .button {
          display: inline-flex;
          align-items: center;
          padding: 12px 24px;
          border-radius: var(--radius-md);
          font-weight: 500;
          text-decoration: none;
        }
        .features {
          padding: 80px 0;
          background: var(--color-bg-secondary);
        }
        .features h2 {
          text-align: center;
          font-size: 32px;
          margin-bottom: 48px;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        .feature-card {
          background: var(--color-bg);
          padding: 24px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
        }
        .feature-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }
        .feature-card h3 {
          font-size: 18px;
          margin-bottom: 8px;
        }
        .feature-card p {
          color: var(--color-text-secondary);
          font-size: 14px;
        }
      `}</style>
    </main>
  );
}