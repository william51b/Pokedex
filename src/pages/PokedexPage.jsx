import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './PokedexPage.module.css'

const PAGE_SIZE = 20

const TYPE_COLORS = {
  normal:'#A8A878', fire:'#F08030', water:'#6890F0', electric:'#F8D030',
  grass:'#78C850', ice:'#98D8D8', fighting:'#C03028', poison:'#A040A0',
  ground:'#E0C068', flying:'#A890F0', psychic:'#F85888', bug:'#A8B820',
  rock:'#B8A038', ghost:'#705898', dragon:'#7038F8', dark:'#705848',
  steel:'#B8B8D0', fairy:'#EE99AC',
}

function cap(str) {
  return str.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
}

function TypePill({ type }) {
  const c = TYPE_COLORS[type] || '#888'
  return (
    <span className={styles.type} style={{ background: c + '22', color: c, borderColor: c + '55' }}>
      {type}
    </span>
  )
}

function PokemonCard({ pokemon, index }) {
  const id  = pokemon.id
  const num = String(id).padStart(4, '0')
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

  return (
    <Link to={`/pokemon/${pokemon.name}`} className={styles.card} style={{ animationDelay: `${index * 0.03}s` }}>
      <div className={styles.cardNum}>#{num}</div>
      <img
        className={styles.cardImg}
        src={img}
        alt={pokemon.name}
        loading="lazy"
        onError={e => { e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png` }}
      />
      <div className={styles.cardName}>{cap(pokemon.name)}</div>
      <div className={styles.types}>
        {pokemon.types.map(t => <TypePill key={t.type.name} type={t.type.name} />)}
      </div>
    </Link>
  )
}

export default function PokedexPage() {
  const [list, setList]       = useState([])
  const [total, setTotal]     = useState(0)
  const [offset, setOffset]   = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`)
      .then(r => r.json())
      .then(data => {
        setTotal(data.count)
        return Promise.all(data.results.map(p => fetch(p.url).then(r => r.json())))
      })
      .then(details => { setList(details); setLoading(false) })
      .catch(() => { setError('Failed to load. Check your connection.'); setLoading(false) })
  }, [offset])

  const page      = Math.floor(offset / PAGE_SIZE) + 1
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Pokédex</h1>
        {total > 0 && <span className={styles.count}>{total} Pokémon</span>}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <div className={styles.loading}><div className={styles.spinner} /> Loading…</div>
      ) : (
        <div className={styles.grid}>
          {list.map((p, i) => <PokemonCard key={p.id} pokemon={p} index={i} />)}
        </div>
      )}

      <div className={styles.pagination}>
        <button className={styles.btn} onClick={() => setOffset(0)} disabled={offset === 0 || loading}>«</button>
        <button className={styles.btn} onClick={() => setOffset(o => o - PAGE_SIZE)} disabled={offset === 0 || loading}>‹ Prev</button>
        <span className={styles.pageInfo}><strong>{page}</strong> / {totalPages}</span>
        <button className={styles.btn} onClick={() => setOffset(o => o + PAGE_SIZE)} disabled={offset + PAGE_SIZE >= total || loading}>Next ›</button>
        <button className={styles.btn} onClick={() => setOffset((totalPages - 1) * PAGE_SIZE)} disabled={page === totalPages || loading}>»</button>
      </div>
    </div>
  )
}
