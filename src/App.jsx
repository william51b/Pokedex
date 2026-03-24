import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import PokedexPage from './pages/PokedexPage.jsx'
import DetailPage from './pages/DetailPage.jsx'
import styles from './App.module.css'

function Navbar() {
  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.logo}>
        <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10"/>
          <path d="M5 50H95" stroke="currentColor" strokeWidth="10"/>
          <circle cx="50" cy="50" r="13" fill="white" stroke="currentColor" strokeWidth="10"/>
          <path d="M5 50Q28 14 50 14Q72 14 95 50" fill="currentColor"/>
        </svg>
        Pokédex
      </NavLink>
      <div className={styles.links}>
        <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ''}>Pokédex</NavLink>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    // Change basename to match your GitHub repo name
    <BrowserRouter basename="/pokedex">
      <Navbar />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<PokedexPage />} />
          <Route path="/pokemon/:name" element={<DetailPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
