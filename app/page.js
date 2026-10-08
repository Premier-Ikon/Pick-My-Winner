const TICKS = 32

export default function HomePage() {
  const year = new Date().getFullYear()

  return (
    <>
      <div className="atmosphere" aria-hidden="true">
        <div className="glow glow-a" />
        <div className="glow glow-b" />
        <div className="grid" />
      </div>

      <main className="hero">
        <p className="brand">PickMyWinner</p>
        <h1 className="headline">Welcome.</h1>
        <p className="lede">
          Independent live draw tools for brands running public giveaways.
        </p>
        <div className="actions">
          <a className="cta" href="mailto:hello@pickmywinner.com">
            Get in touch
          </a>
        </div>

        <div className="dial" aria-hidden="true">
          <div className="dial-ring">
            {Array.from({ length: TICKS }, (_, index) => {
              const accent = index % 4 === 0
              const hot = index % 8 === 0
              return (
                <span
                  key={index}
                  className="dial-spoke"
                  style={{ transform: `rotate(${(index / TICKS) * 360}deg)` }}
                >
                  <span className={`dial-tick${hot ? ' hot' : accent ? ' accent' : ''}`} />
                </span>
              )
            })}
          </div>
          <div className="dial-core" />
        </div>
      </main>

      <footer className="site-footer">
        <span>© {year} PickMyWinner</span>
      </footer>
    </>
  )
}
