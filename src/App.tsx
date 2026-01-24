import { useState, useEffect } from 'react'

// Configuration des applications
const APPS = [
  {
    id: 'voltride-opp',
    name: 'VOLTRIDE OPP',
    description: 'Gestion des locations de vélos électriques',
    url: 'https://operator-production-188c.up.railway.app',
    icon: 'https://res.cloudinary.com/dis5pcnfr/image/upload/v1769278425/IMG-20260111-WA0001_1_-removebg-preview_zzajxa.png',
    color: '#abdee6',
    brand: 'voltride'
  },
  {
    id: 'motorrent-opp',
    name: 'MOTOR RENT OPP',
    description: 'Gestion des locations de scooters et motos',
    url: 'https://motor-rent-operator-production.up.railway.app',
    icon: 'https://res.cloudinary.com/dis5pcnfr/image/upload/v1769277533/Design_sans_titre_ca0tl1.png',
    color: '#ffaf10',
    brand: 'motorrent'
  },
  {
    id: 'backoffice-voltride',
    name: 'BACK OFFICE VOLTRIDE',
    description: 'Administration Voltride',
    url: '#',
    icon: 'https://res.cloudinary.com/dis5pcnfr/image/upload/v1769278425/IMG-20260111-WA0001_1_-removebg-preview_zzajxa.png',
    color: '#abdee6',
    brand: 'voltride',
    comingSoon: true
  },
  {
    id: 'backoffice-motorrent',
    name: 'BACK OFFICE MOTOR RENT',
    description: 'Administration Motor Rent',
    url: '#',
    icon: 'https://res.cloudinary.com/dis5pcnfr/image/upload/v1769277533/Design_sans_titre_ca0tl1.png',
    color: '#ffaf10',
    brand: 'motorrent',
    comingSoon: true
  },
  {
    id: 'trivium-buggy',
    name: 'TRIVIUM BUGGY',
    description: 'Gestion des tours en buggy',
    url: '#',
    icon: '🏎️',
    color: '#10b981',
    brand: 'trivium',
    comingSoon: true
  },
  {
    id: 'comptabilite',
    name: 'COMPTABILITÉ',
    description: 'Gestion financière',
    url: '#',
    icon: '📊',
    color: '#8b5cf6',
    brand: 'all',
    comingSoon: true
  },
  {
    id: 'mecanique',
    name: 'MÉCANIQUE',
    description: 'Gestion des réparations',
    url: '#',
    icon: '🔧',
    color: '#ef4444',
    brand: 'all',
    comingSoon: true
  },
  {
    id: 'stock',
    name: 'STOCK',
    description: 'Gestion des inventaires',
    url: '#',
    icon: '📦',
    color: '#f59e0b',
    brand: 'all',
    comingSoon: true
  }
]

// Types
interface User {
  id: string
  email: string
  name: string
  role: string
  apps: string[] // Liste des IDs d'apps autorisées
}

// Composant Login
function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Utilisateurs de test (à remplacer par une vraie API)
  const testUsers: Record<string, { password: string; user: User }> = {
    'admin@trivium.com': {
      password: 'admin123',
      user: {
        id: '1',
        email: 'admin@trivium.com',
        name: 'Admin Trivium',
        role: 'admin',
        apps: ['voltride-opp', 'motorrent-opp', 'backoffice-voltride', 'backoffice-motorrent', 'trivium-buggy', 'comptabilite', 'mecanique', 'stock']
      }
    },
    'voltride@trivium.com': {
      password: 'voltride123',
      user: {
        id: '2',
        email: 'voltride@trivium.com',
        name: 'Opérateur Voltride',
        role: 'operator',
        apps: ['voltride-opp']
      }
    },
    'motorrent@trivium.com': {
      password: 'motorrent123',
      user: {
        id: '3',
        email: 'motorrent@trivium.com',
        name: 'Opérateur Motor Rent',
        role: 'operator',
        apps: ['motorrent-opp']
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      const userData = testUsers[email.toLowerCase()]
      if (userData && userData.password === password) {
        localStorage.setItem('trivium_user', JSON.stringify(userData.user))
        onLogin(userData.user)
      } else {
        setError('Email ou mot de passe incorrect')
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🚀 Trivium Launcher</h1>
          <p className="text-gray-300">Connectez-vous pour accéder à vos applications</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400 mb-2">Comptes de test :</p>
          <p className="text-xs text-gray-300">admin@trivium.com / admin123</p>
          <p className="text-xs text-gray-300">voltride@trivium.com / voltride123</p>
          <p className="text-xs text-gray-300">motorrent@trivium.com / motorrent123</p>
        </div>
      </div>
    </div>
  )
}

// Composant Dashboard
function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const userApps = APPS.filter(app => user.apps.includes(app.id))

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">🚀 Trivium Launcher</h1>
          <p className="text-gray-400">Bienvenue, {user.name}</p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
        >
          Déconnexion
        </button>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {userApps.map(app => (
          
            key={app.id}
            href={app.comingSoon ? '#' : app.url}
            target={app.comingSoon ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className={`group relative bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 transition-all hover:scale-105 hover:bg-white/15 ${app.comingSoon ? 'cursor-not-allowed opacity-60' : ''}`}
            onClick={e => app.comingSoon && e.preventDefault()}
          >
            {app.comingSoon && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                Bientôt
              </div>
            )}

            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 text-3xl"
              style={{ backgroundColor: app.color + '30' }}
            >
              {app.icon.startsWith('http') ? (
                <img src={app.icon} alt={app.name} className="w-10 h-10 object-contain" />
              ) : (
                app.icon
              )}
            </div>

            <h3 className="text-lg font-semibold text-white mb-1">{app.name}</h3>
            <p className="text-sm text-gray-400">{app.description}</p>

            {!app.comingSoon && (
              <div className="mt-4 flex items-center text-sm text-blue-400 group-hover:text-blue-300">
                Ouvrir l'application →
              </div>
            )}
          </a>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>Trivium Group © 2026 - Voltride | Motor Rent | Trivium Family</p>
      </div>
    </div>
  )
}

// App principale
export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('trivium_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('trivium_user')
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    )
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return <Dashboard user={user} onLogout={handleLogout} />
}
