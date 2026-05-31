// src/pages/BookmarksPage.jsx
import { useState, useEffect, useCallback } from 'react'
import { Bookmark, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import NoteGrid from '../components/notes/NoteGrid'
import SearchBar from '../components/ui/SearchBar'
import Button from '../components/ui/Button'
import { userService } from '../services/userService'
import toast from 'react-hot-toast'

export default function BookmarksPage() {
  const [search, setSearch] = useState('')
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookmarks = useCallback(async () => {
    setLoading(true)
    try {
      const data = await userService.getBookmarks()
      setBookmarks(data)
    } catch (err) {
      console.error('Failed to load bookmarks:', err)
      toast.error('Could not load bookmarks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBookmarks() }, [fetchBookmarks])

  const filtered = bookmarks.filter(n =>
    n.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <Bookmark className="text-blue-500" size={22} /> My Bookmarks
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {loading ? 'Loading...' : `${bookmarks.length} saved resources`}
            </p>
          </div>
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Search bookmarks..."
            className="w-full sm:w-72"
          />
        </div>

        <NoteGrid
          notes={filtered}
          loading={loading}
          emptyTitle="No bookmarks yet"
          emptyDesc="Save notes you want to revisit later by clicking the bookmark icon on any note card."
        />

        {!loading && filtered.length === 0 && search && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <Search size={32} className="mx-auto mb-2 opacity-40" />
            <p>No bookmarks match <strong>"{search}"</strong></p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
