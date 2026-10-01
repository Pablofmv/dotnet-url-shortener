function HomePage() {
  return (
    <div className="page">
      <main className="container">
        <section className="section section--hero">
          <div className="hero">
            <h1 className="title-xl">
              Hello I’m Pablo!
            </h1>
          </div>
        </section>

        <section className="section section--compact">
          <div className="intro">
            <div className="intro__card">
              <p className="intro__text">
                <span className="intro__symbol">&gt;</span>
                🦀 Rust and 🐍 Python developer
              </p>
            </div>
          </div>
        </section>

        <section className="section summary-section">
          <div className="summary">
            <div className="summary__content">
              <h2 className="title-lg">
                Tech Professional interested
                <br />
                in System Design and
                <br />
                Coding
              </h2>

              <div className="summary__meta">
                <p>
                  <span className="meta-icon">🎓</span>

                  <span>
                    Msc @{' '}
                    <a
                      className="link"
                      href="https://www.columbia.edu/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Columbia
                    </a>
                  </span>
                </p>

                <p>
                  <span className="meta-icon">💻</span>

                  <span>
                    Current. @{' '}
                    <a
                      className="link"
                      href="https://www.spglobal.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      SP
                    </a>{' '}
                    // Prev. @{' '}
                    <a
                      className="link"
                      href="https://www.regeneron.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Regeneron
                    </a>
                  </span>
                </p>

                <p>
                  <span className="meta-icon">📍</span>
                  <span>Based in NYC</span>
                </p>

                <p>
                  <span className="meta-icon">⚡</span>
                  <span>Obsessed with performance and data</span>
                </p>
              </div>
            </div>

            <div className="summary__visual">
              <img
                className="summary__image"
                src="/illustration.png"
                alt="Developer illustration"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a
          href="https://www.linkedin.com/in/pablofmv/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>

        <a
          href="https://github.com/Pablofmv"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>

        <a
          href="https://leetcode.com/u/pm3179/"
          target="_blank"
          rel="noreferrer"
        >
          Leetcode
        </a>
      </footer>
    </div>
  )
}

export default HomePage