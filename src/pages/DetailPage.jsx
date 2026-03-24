import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import styles from './DetailPage.module.css'

const TYPE_COLORS = {
  normal:'#A8A878', fire:'#F08030', water:'#6890F0', electric:'#F8D030',
  grass:'#78C850', ice:'#98D8D8', fighting:'#C03028', poison:'#A040A0',
  ground:'#E0C068', flying:'#A890F0', psychic:'#F85888', bug:'#A8B820',
  rock:'#B8A038', ghost:'#705898', dragon:'#7038F8', dark:'#705848',
  steel:'#B8B8D0', fairy:'#EE99AC',
}

const STAT_LABELS = {
  hp: 'HP', attack: 'ATK', defense: 'DEF',
  'special-attack': 'Sp.ATK', 'special-defense': 'Sp.DEF', speed: 'SPD',
}

function cap(str) {
  return str.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
}

export default function DetailPage() {
  const { name } = useParams()
  const [pokemon, setPokemon]   = useState(null)
  const [species, setSpecies]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    setPokemon(null)

    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => {
        setPokemon(data)
        return fetch(data.species.url).then(r => r.json()).catch(() => null)
      })
      .then(sp => { setSpecies(sp); setLoading(false) })
      .catch(() => { setError('Pokémon not found.'); setLoading(false) })
  }, [name])

  if (loading) return <div className={styles.center}><div className={styles.spinner} /> Loading…</div>
  if (error)   return <div className={styles.center}><p className={styles.error}>{error}</p><Link to="/" className={styles.back}>← Back</Link></div>
  if (!pokemon) return null

  const id      = pokemon.id
  const num     = String(id).padStart(4, '0')
  const artwork = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
  const flavor  = species?.flavor_text_entries?.find(e => e.language.name === 'en')?.flavor_text?.replace(/\f/g, ' ') || ''
  const genus   = species?.genera?.find(g => g.language.name === 'en')?.genus || ''
  const prevId  = id > 1 ? id - 1 : null
  const nextId  = id < 1025 ? id + 1 : null
  const total   = pokemon.stats.reduce((a, s) => a + s.base_stat, 0)

  return (
    <div className={styles.page}>
      {/* Top nav */}
      <div className={styles.topRow}>
        <Link to="/" className={styles.back}>← Pokédex</Link>
        <div className={styles.adjNav}>
          {prevId && <Link to={`/pokemon/${prevId}`} className={styles.adjBtn}>‹ #{String(prevId).padStart(4,'0')}</Link>}
          {nextId && <Link to={`/pokemon/${nextId}`} className={styles.adjBtn}>#{String(nextId).padStart(4,'0')} ›</Link>}
        </div>
      </div>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.imgBox}>
          <img
            src={artwork}
            alt={pokemon.name}
            className={styles.artwork}
            onError={e => { e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png` }}
          />
        </div>
        <div className={styles.heroInfo}>
          <div className={styles.heroId}>#{num}</div>
          <h1 className={styles.heroName}>{cap(pokemon.name)}</h1>
          {genus && <div className={styles.genus}>{genus}</div>}
          <div className={styles.types}>
            {pokemon.types.map(t => {
              const c = TYPE_COLORS[t.type.name] || '#888'
              return (
                <span key={t.type.name} className={styles.type}
                  style={{ background: c + '22', color: c, borderColor: c + '55' }}>
                  {t.type.name}
                </span>
              )
            })}
          </div>
          {flavor && <p className={styles.flavor}>{flavor}</p>}
          <div className={styles.measures}>
            <div className={styles.measure}><strong>{(pokemon.height / 10).toFixed(1)}m</strong><span>Height</span></div>
            <div className={styles.divider} />
            <div className={styles.measure}><strong>{(pokemon.weight / 10).toFixed(1)}kg</strong><span>Weight</span></div>
            <div className={styles.divider} />
            <div className={styles.measure}><strong>{pokemon.base_experience ?? '—'}</strong><span>Base XP</span></div>
          </div>
        </div>
      </div>

      {/* Stats + Abilities side by side */}
      <div className={styles.sections}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Base Stats</h2>
          {pokemon.stats.map(s => {
            const pct   = Math.round(s.base_stat / 255 * 100)
            const color = s.base_stat >= 100 ? '#4CAF50' : s.base_stat >= 60 ? '#2196F3' : '#FF9800'
            return (
              <div key={s.stat.name} className={styles.statRow}>
                <span className={styles.statName}>{STAT_LABELS[s.stat.name] || s.stat.name}</span>
                <span className={styles.statVal}>{s.base_stat}</span>
                <div className={styles.barBg}>
                  <div className={styles.barFill} style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            )
          })}
          <div className={styles.statRow} style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
            <span className={styles.statName}>Total</span>
            <span className={styles.statVal} style={{ color: 'var(--accent)' }}>{total}</span>
            <div />
          </div>
        </section>

        <div className={styles.rightCol}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Abilities</h2>
            {pokemon.abilities.map(a => (
              <div key={a.ability.name} className={styles.ability}>
                {cap(a.ability.name)}
                {a.is_hidden && <span className={styles.hiddenTag}>Hidden</span>}
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Sprites</h2>
            <div className={styles.sprites}>
              {[
                [pokemon.sprites.front_default, 'Front'],
                [pokemon.sprites.back_default, 'Back'],
                [pokemon.sprites.front_shiny, 'Shiny'],
                [pokemon.sprites.back_shiny, 'Shiny Back'],
              ].filter(([src]) => src).map(([src, label]) => (
                <div key={label} className={styles.sprite}>
                  <img src={src} alt={label} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
