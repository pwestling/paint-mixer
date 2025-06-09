import { Link, Outlet, useLocation } from 'react-router-dom'

const tabs = [
  { path: '/library', label: 'Library' },
  { path: '/mix', label: 'Mix' },
  { path: '/match', label: 'Match' },
  { path: '/settings', label: 'Settings' },
]

export default function AppShell() {
  const location = useLocation()
  return (
    <div className="flex h-screen flex-col">
      <nav className="bg-gray-200 dark:bg-gray-800 p-2 flex space-x-4 justify-center">
        {tabs.map(tab => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-3 py-1 rounded ${location.pathname === tab.path ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-200'}`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <main className="flex-1 overflow-auto p-4 bg-gray-100 dark:bg-gray-900">
        <Outlet />
      </main>
    </div>
  )
}
