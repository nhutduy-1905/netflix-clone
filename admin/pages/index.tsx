import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import axios from 'axios'

interface Movie {
  id: string
  title: string
  description: string
  genreId: string
}

const Dashboard: NextPage = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genreId: '',
    videoUrl: '',
    thumbnailUrl: '',
  })

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/movies`
      )
      setMovies(response.data)
    } catch (error) {
      console.error('Error fetching movies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`, formData)
      setFormData({
        title: '',
        description: '',
        genreId: '',
        videoUrl: '',
        thumbnailUrl: '',
      })
      setShowForm(false)
      fetchMovies()
    } catch (error) {
      console.error('Error creating movie:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/${id}`)
        fetchMovies()
      } catch (error) {
        console.error('Error deleting movie:', error)
      }
    }
  }

  return (
    <>
      <Head>
        <title>Netflix Clone - Admin Dashboard</title>
        <meta name="description" content="Admin Dashboard for Netflix Clone" />
      </Head>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Quản trị Phim</h1>

          <button
            onClick={() => setShowForm(!showForm)}
            className="mb-6 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
          >
            {showForm ? 'Đóng' : 'Thêm Phim Mới'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-8 bg-gray-800 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Tên phim"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="px-4 py-2 bg-gray-700 rounded text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Genre ID"
                  value={formData.genreId}
                  onChange={(e) =>
                    setFormData({ ...formData, genreId: e.target.value })
                  }
                  className="px-4 py-2 bg-gray-700 rounded text-white"
                  required
                />
              </div>
              <textarea
                placeholder="Mô tả"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 rounded text-white mb-4"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="url"
                  placeholder="Video URL"
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  className="px-4 py-2 bg-gray-700 rounded text-white"
                />
                <input
                  type="url"
                  placeholder="Thumbnail URL"
                  value={formData.thumbnailUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnailUrl: e.target.value })
                  }
                  className="px-4 py-2 bg-gray-700 rounded text-white"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
              >
                Thêm Phim
              </button>
            </form>
          )}

          {loading ? (
            <p className="text-center text-gray-400">Đang tải...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{movie.description}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Dashboard
