import { useState, useEffect } from 'react'

const API_URL = 'https://api-voltrideandmotorrent-production.up.railway.app'

type AppItem = {
  id: string; name: string; description: string; url: string
  icon: string; comingSoon?: boolean
}

type BrandGroup = {
  id: string; name: string; tagline: string; logo: string
  color: string; gradient: string; apps: AppItem[]
}

const BRANDS: BrandGroup[] = [
  {
    id: 'voltride', name: 'VOLTRIDE', tagline: 'Alquiler de bicicletas eléctricas',
    logo: 'https://res.cloudinary.com/dis5pcnfr/image/upload/v1769278425/IMG-20260111-WA0001_1_-removebg-preview_zzajxa.png',
    color: '#abdee6', gradient: 'from-cyan-600 to-blue-700',
    apps: [
      { id: 'voltride-opp', name: 'Operator', description: 'Gestión de alquileres', url: 'https://operator-production-188c.up.railway.app', icon: '📱' },
      { id: 'backoffice-voltride', name: 'Back Office', description: 'Administración', url: 'https://backoffice-voltride-production.up.railway.app', icon: '🖥️' },
      { id: 'comptabilite-voltride', name: 'Comptabilité', description: 'Facturación & IVA', url: 'https://voltride-comptabilite-production.up.railway.app', icon: '💰' },
      { id: 'mecanique-voltride', name: 'Mécanique', description: 'Gestión de reparaciones', url: '#', icon: '🔧', comingSoon: true },
      { id: 'stock-voltride', name: 'Stock', description: 'Gestión de inventarios', url: '#', icon: '📦', comingSoon: true }
    ]
  },
  {
    id: 'motorrent', name: 'MOTOR RENT', tagline: 'Alquiler de scooters y motos',
    logo: 'https://res.cloudinary.com/dis5pcnfr/image/upload/v1769277533/Design_sans_titre_ca0tl1.png',
    color: '#ffaf10', gradient: 'from-amber-500 to-orange-600',
    apps: [
      { id: 'motorrent-opp', name: 'Operator', description: 'Gestión de alquileres', url: 'https://motor-rent-operator-production.up.railway.app', icon: '📱' },
      { id: 'backoffice-motorrent', name: 'Back Office', description: 'Administración', url: 'https://backoffice-vandm-production.up.railway.app', icon: '🖥️' },
      { id: 'comptabilite-motorrent', name: 'Comptabilité', description: 'Facturación & IVA', url: '#', icon: '💰', comingSoon: true },
      { id: 'mecanique-motorrent', name: 'Mécanique', description: 'Gestión de reparaciones', url: '#', icon: '🔧', comingSoon: true },
      { id: 'stock-motorrent', name: 'Stock', description: 'Gestión de inventarios', url: '#', icon: '📦', comingSoon: true }
    ]
  },
  {
    id: 'trivium', name: 'TRIVIUM', tagline: 'Tours en buggy & movilidad',
    logo: '',
    color: '#10b981', gradient: 'from-emerald-500 to-teal-600',
    apps: [
      { id: 'trivium-buggy', name: 'Buggy', description: 'Gestión de tours en buggy', url: 'https://trivium-buggy-production.up.railway.app', icon: '🏎️' },
      { id: 'trivium-mobility', name: 'Mobility', description: 'Gestion de mobilité', url: '#', icon: '🦽', comingSoon: true },
      { id: 'comptabilite-trivium', name: 'Comptabilité', description: 'Facturación & IVA', url: '#', icon: '💰', comingSoon: true },
      { id: 'mecanique-trivium', name: 'Mécanique', description: 'Gestión de reparaciones', url: '#', icon: '🔧', comingSoon: true },
      { id: 'stock-trivium', name: 'Stock', description: 'Gestión de inventarios', url: '#', icon: '📦', comingSoon: true }
    ]
  }
]

const ALL_APPS = BRANDS.flatMap(b => b.apps)

const ROLES = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'OPERATOR', label: 'Opérateur' },
  { value: 'ACCOUNTANT', label: 'Comptable' },
  { value: 'COLLABORATOR', label: 'Collaborateur' },
  { value: 'FRANCHISEE', label: 'Franchisé' }
]

interface User {
  id: string; email: string; firstName: string; lastName: string
  role: string; brands: string[]; agencyIds: string[]
  allowedApps: string[]; language: string; isActive?: boolean
}

interface Agency {
  id: string; name: string; brand: string; agencyType: string
}

function Login({ onLogin }: { onLogin: (user: User, token: string) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (!response.ok) { setError(data.error || 'Erreur de connexion'); setLoading(false); return }
      localStorage.setItem('trivium_token', data.token)
      localStorage.setItem('trivium_user', JSON.stringify(data.user))
      onLogin(data.user, data.token)
    } catch (err) { setError('Erreur de connexion au serveur') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🚀 Trivium Launcher</h1>
          <p className="text-gray-300">Connectez-vous pour accéder à vos applications</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="votre@email.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" required />
          </div>
          {error && <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}

function AdminPanel({ token, onClose }: { token: string; onClose: () => void }) {
  const [users, setUsers] = useState<User[]>([])
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({ 
    email: '', password: '', firstName: '', lastName: '', 
    role: 'OPERATOR', brands: ['VOLTRIDE', 'MOTOR-RENT'], 
    allowedApps: [] as string[], agencyIds: [] as string[], 
    language: 'es', isActive: true 
  })

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users`, { headers: { 'Authorization': `Bearer ${token}` } })
      const data = await response.json()
      setUsers(data)
    } catch (err) { setError('Erreur lors du chargement des utilisateurs') }
    setLoading(false)
  }

  const fetchAgencies = async () => {
    try {
      const response = await fetch(`${API_URL}/api/agencies`)
      const data = await response.json()
      setAgencies(data)
    } catch (err) { console.error('Error fetching agencies') }
  }

  useEffect(() => { fetchUsers(); fetchAgencies() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setSuccess('')
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      })
      if (!response.ok) { const data = await response.json(); setError(data.error || 'Erreur lors de la création'); return }
      setSuccess('Utilisateur créé avec succès !')
      setShowCreateForm(false); resetForm(); fetchUsers()
    } catch (err) { setError('Erreur de connexion au serveur') }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    setError(''); setSuccess('')
    try {
      const updateData = { ...formData }
      if (!updateData.password) delete (updateData as any).password
      const response = await fetch(`${API_URL}/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updateData)
      })
      if (!response.ok) { const data = await response.json(); setError(data.error || 'Erreur lors de la mise à jour'); return }
      setSuccess('Utilisateur modifié avec succès !')
      setEditingUser(null); resetForm(); fetchUsers()
    } catch (err) { setError('Erreur de connexion au serveur') }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
      if (!response.ok) { setError('Erreur lors de la suppression'); return }
      setSuccess('Utilisateur supprimé avec succès !')
      fetchUsers()
    } catch (err) { setError('Erreur de connexion au serveur') }
  }

  const resetForm = () => { 
    setFormData({ 
      email: '', password: '', firstName: '', lastName: '', 
      role: 'OPERATOR', brands: ['VOLTRIDE', 'MOTOR-RENT'], 
      allowedApps: [], agencyIds: [], language: 'es', isActive: true 
    }) 
  }

  const startEdit = (user: User) => {
    setEditingUser(user)
    setFormData({ 
      email: user.email, password: '', firstName: user.firstName, lastName: user.lastName, 
      role: user.role, brands: user.brands || [], allowedApps: user.allowedApps || [], 
      agencyIds: user.agencyIds || [], language: user.language || 'es', isActive: user.isActive ?? true 
    })
    setShowCreateForm(false)
  }

  const toggleApp = (appId: string) => { 
    setFormData(prev => ({ 
      ...prev, 
      allowedApps: prev.allowedApps.includes(appId) 
        ? prev.allowedApps.filter(id => id !== appId) 
        : [...prev.allowedApps, appId] 
    })) 
  }

  const toggleAgency = (agencyId: string) => { 
    setFormData(prev => ({ 
      ...prev, 
      agencyIds: prev.agencyIds.includes(agencyId) 
        ? prev.agencyIds.filter(id => id !== agencyId) 
        : [...prev.agencyIds, agencyId] 
    })) 
  }

  const getName = (name: any) => {
    if (typeof name === 'string') {
      try { const p = JSON.parse(name); return p.es || p.fr || p.en || name } 
      catch { return name }
    }
    return name?.es || name?.fr || name?.en || 'Agence'
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-white/20">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">👥 Gestión de Usuarios</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {error && <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200">{error}</div>}
          {success && <div className="mb-4 bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-200">{success}</div>}

          {(showCreateForm || editingUser) && (
            <form onSubmit={editingUser ? handleUpdate : handleCreate} className="mb-8 bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">{editingUser ? `Modifier: ${editingUser.firstName} ${editingUser.lastName}` : 'Nouvel Utilisateur'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div><label className="block text-sm text-gray-400 mb-1">Prénom</label><input type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white" required /></div>
                <div><label className="block text-sm text-gray-400 mb-1">Nom</label><input type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white" required /></div>
                <div><label className="block text-sm text-gray-400 mb-1">Email</label><input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white" required /></div>
                <div><label className="block text-sm text-gray-400 mb-1">Mot de passe {editingUser && '(vide = inchangé)'}</label><input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white" required={!editingUser} /></div>
                <div><label className="block text-sm text-gray-400 mb-1">Rôle</label><select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white">{ROLES.map(role => <option key={role.value} value={role.value} className="bg-gray-800">{role.label}</option>)}</select></div>
                <div><label className="block text-sm text-gray-400 mb-1">Langue</label><select value={formData.language} onChange={e => setFormData({ ...formData, language: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"><option value="fr" className="bg-gray-800">Français</option><option value="es" className="bg-gray-800">Español</option><option value="en" className="bg-gray-800">English</option></select></div>
              </div>

              {/* Sélection des agences - visible pour COLLABORATOR et FRANCHISEE */}
              {(formData.role === 'COLLABORATOR' || formData.role === 'FRANCHISEE') && (
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">Agences autorisées</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-white/5 rounded-lg">
                    {agencies.map(agency => (
                      <label key={agency.id} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${formData.agencyIds.includes(agency.id) ? 'bg-green-500/20 border border-green-500/50' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                        <input type="checkbox" checked={formData.agencyIds.includes(agency.id)} onChange={() => toggleAgency(agency.id)} className="rounded" />
                        <span className="text-sm text-white">{getName(agency.name)}</span>
                        <span className="text-xs text-gray-500">({agency.brand})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Applications autorisées</label>
                <div className="space-y-3">
                  {BRANDS.map(brand => (
                    <div key={brand.id}>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{brand.name}</div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {brand.apps.map(app => (
                          <label key={app.id} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${formData.allowedApps.includes(app.id) ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                            <input type="checkbox" checked={formData.allowedApps.includes(app.id)} onChange={() => toggleApp(app.id)} className="rounded" />
                            <span className="text-sm text-white">{app.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="rounded" /><span className="text-white">Utilisateur actif</span></label></div>
              <div className="flex gap-3">
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all">{editingUser ? 'Enregistrer' : 'Créer'}</button>
                <button type="button" onClick={() => { setEditingUser(null); setShowCreateForm(false); resetForm() }} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all">Annuler</button>
              </div>
            </form>
          )}

          {!showCreateForm && !editingUser && <button onClick={() => { setShowCreateForm(true); resetForm() }} className="mb-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all">➕ Nouvel Utilisateur</button>}

          {loading ? <div className="text-center text-gray-400 py-8">Chargement...</div> : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="text-left text-gray-400 border-b border-white/10"><th className="pb-3">Utilisateur</th><th className="pb-3">Email</th><th className="pb-3">Rôle</th><th className="pb-3">Apps</th><th className="pb-3">Agences</th><th className="pb-3">Statut</th><th className="pb-3">Actions</th></tr></thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 text-white">{user.firstName} {user.lastName}</td>
                      <td className="py-3 text-gray-300">{user.email}</td>
                      <td className="py-3"><span className={`px-2 py-1 rounded text-xs ${user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300' : user.role === 'FRANCHISEE' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>{user.role}</span></td>
                      <td className="py-3 text-gray-300">{user.allowedApps?.length || 0}</td>
                      <td className="py-3 text-gray-300">{user.agencyIds?.length || 'Toutes'}</td>
                      <td className="py-3"><span className={`px-2 py-1 rounded text-xs ${user.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{user.isActive ? 'Actif' : 'Inactif'}</span></td>
                      <td className="py-3 space-x-2">
                        <button onClick={() => startEdit(user)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-all">✏️</button>
                        <button onClick={() => handleDelete(user.id)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-all">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BrandCard({ brand, userApps, isAdmin, isOpen, onToggle, user }: { brand: BrandGroup; userApps: string[]; isAdmin: boolean; isOpen: boolean; onToggle: () => void; user: User }) {
  // ADMIN voit tout, les autres ne voient que leurs apps autorisées (jamais les comingSoon)
  const availableApps = isAdmin
    ? brand.apps
    : brand.apps.filter(app => userApps.includes(app.id) && !app.comingSoon)
  const activeCount = availableApps.filter(app => !app.comingSoon).length

  // Cacher la marque entière si aucune app disponible
  if (availableApps.length === 0) return null

  return (
    <div className="w-full">
      <button
        onClick={onToggle}
        className={`w-full text-left rounded-2xl p-6 border transition-all duration-300 ${
          isOpen
            ? 'bg-white/15 border-white/30 shadow-lg shadow-black/20'
            : 'bg-white/8 border-white/15 hover:bg-white/12 hover:border-white/25 hover:shadow-lg hover:shadow-black/10'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${brand.gradient} flex items-center justify-center shadow-lg`}>
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="w-10 h-10 object-contain" />
              ) : (
                <span className="text-3xl">🏎️</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">{brand.name}</h2>
              <p className="text-sm text-gray-400">{brand.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-gray-300">
              {activeCount} app{activeCount > 1 ? 's' : ''}
            </span>
            <span className={`text-gray-400 transition-transform duration-300 text-xl ${isOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </div>
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 pl-4">
          {availableApps.map(app => {
            const isAvailable = !app.comingSoon && (isAdmin || userApps.includes(app.id))
            // Pour les COLLABORATOR/FRANCHISEE, on ajoute les agencyIds dans l'URL
            let appUrl = app.url
            if (isAvailable && user.agencyIds && user.agencyIds.length > 0) {
              const separator = app.url.includes('?') ? '&' : '?'
              appUrl = `${app.url}${separator}agencyIds=${user.agencyIds.join(',')}`
            }
            return (
              <a
                key={app.id}
                href={isAvailable ? appUrl : '#'}
                target={isAvailable ? '_blank' : '_self'}
                rel="noopener noreferrer"
                onClick={e => !isAvailable && e.preventDefault()}
                className={`relative rounded-xl p-4 border transition-all duration-200 ${
                  isAvailable
                    ? 'bg-white/8 border-white/15 hover:bg-white/15 hover:border-white/25 hover:scale-105 cursor-pointer'
                    : 'bg-white/3 border-white/8 cursor-not-allowed opacity-50'
                }`}
              >
                {app.comingSoon && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    Próximamente
                  </div>
                )}
                <div className="text-2xl mb-2">{app.icon}</div>
                <h3 className="text-sm font-semibold text-white mb-0.5">{app.name}</h3>
                <p className="text-xs text-gray-400">{app.description}</p>
                {isAvailable && (
                  <div className="mt-2 text-xs font-medium" style={{ color: brand.color }}>
                    Abrir →
                  </div>
                )}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Dashboard({ user, token, onLogout }: { user: User; token: string; onLogout: () => void }) {
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [openBrands, setOpenBrands] = useState<Set<string>>(new Set(BRANDS.map(b => b.id)))

  const userAppIds = user.role === 'ADMIN' ? ALL_APPS.map(a => a.id) : (user.allowedApps || [])

  const toggleBrand = (brandId: string) => {
    setOpenBrands(prev => {
      const next = new Set(prev)
      next.has(brandId) ? next.delete(brandId) : next.add(brandId)
      return next
    })
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">🚀 Trivium Launcher</h1>
          <p className="text-gray-400">Bienvenido, {user.firstName} {user.lastName}</p>
        </div>
        <div className="flex gap-3">
          {user.role === 'ADMIN' && (
            <button onClick={() => setShowAdminPanel(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all">
              👥 Gérer Utilisateurs
            </button>
          )}
          <button onClick={onLogout} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all">
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="space-y-4 max-w-6xl mx-auto">
        {BRANDS.map(brand => (
          <BrandCard
            key={brand.id}
            brand={brand}
            userApps={userAppIds}
            isAdmin={user.role === 'ADMIN'}
            isOpen={openBrands.has(brand.id)}
            onToggle={() => toggleBrand(brand.id)}
            user={user}
          />
        ))}
      </div>

      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>Trivium Group © 2026</p>
      </div>

      {showAdminPanel && <AdminPanel token={token} onClose={() => setShowAdminPanel(false)} />}
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('trivium_token')
    const savedUser = localStorage.getItem('trivium_user')
    if (savedToken && savedUser) {
      fetch(`${API_URL}/api/auth/me`, { headers: { 'Authorization': `Bearer ${savedToken}` } })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(userData => { setUser(userData); setToken(savedToken) })
        .catch(() => { localStorage.removeItem('trivium_token'); localStorage.removeItem('trivium_user') })
        .finally(() => setLoading(false))
    } else { setLoading(false) }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('trivium_token')
    localStorage.removeItem('trivium_user')
    setUser(null)
    setToken(null)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"><div className="text-white text-xl">Chargement...</div></div>
  if (!user || !token) return <Login onLogin={(u, t) => { setUser(u); setToken(t) }} />
  return <Dashboard user={user} token={token} onLogout={handleLogout} />
}
