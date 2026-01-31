import { useState, useEffect } from 'react'
import { LayoutGrid, Plus, Trash2, X, Search } from 'lucide-react'
import { categoriesAPI } from '../services/api'
import './Categories.css'

function Categories() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [newCategory, setNewCategory] = useState({ name: '', description: '' })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const data = await categoriesAPI.getAll()
            setCategories(data)
            setLoading(false)
        } catch (error) {
            console.error('Failed to fetch categories:', error)
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return
        try {
            await categoriesAPI.delete(id)
            setCategories(categories.filter(c => c.id !== id))
        } catch (error) {
            console.error('Failed to delete category:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newCategory.name.trim()) return

        setSubmitting(true)
        try {
            const created = await categoriesAPI.create(newCategory)
            setCategories([...categories, created])
            setShowModal(false)
            setNewCategory({ name: '', description: '' })
        } catch (error) {
            console.error('Failed to create category:', error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="page-container p-xl animate-fadeIn">
            <header className="page-header mb-xl flex justify-between items-center">
                <div>
                    <h1 className="flex items-center gap-md">
                        <LayoutGrid className="text-primary" />
                        Categories
                    </h1>
                    <p className="text-tertiary">Manage and organize your stock items by category.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary bg-black text-white px-lg py-sm rounded-md flex items-center gap-sm hover:bg-gray-800 transition-colors"
                >
                    <Plus size={18} />
                    Add Category
                </button>
            </header>

            {loading ? (
                <div className="p-xl text-center text-tertiary">Loading categories...</div>
            ) : categories.length === 0 ? (
                <div className="card p-2xl text-center text-tertiary">
                    <LayoutGrid size={48} className="opacity-20 mx-auto mb-md" />
                    <p>No categories found. Create one to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                    {categories.map(cat => (
                        <div key={cat.id} className="card p-lg relative group hover:shadow-md transition-shadow bg-white rounded-lg border border-[#e5e7eb]">
                            <div className="flex justify-between items-start mb-sm">
                                <h3 className="font-bold text-lg">{cat.name}</h3>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="text-tertiary hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete Category"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <p className="text-tertiary text-sm">{cat.description || 'No description provided.'}</p>
                            <div className="mt-md text-xs text-tertiary">
                                Created: {new Date(cat.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-lg p-xl w-full max-w-md shadow-xl m-md">
                        <div className="flex justify-between items-center mb-lg">
                            <h2 className="text-xl font-bold">Add New Category</h2>
                            <button onClick={() => setShowModal(false)} className="text-tertiary hover:text-black">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
                            <div>
                                <label className="block text-sm font-semibold mb-xs">Category Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-[#e5e7eb] rounded-md p-sm focus:border-black outline-none"
                                    placeholder="e.g., Electronics"
                                    value={newCategory.name}
                                    onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-xs">Description</label>
                                <textarea
                                    className="w-full border border-[#e5e7eb] rounded-md p-sm focus:border-black outline-none min-h-[80px]"
                                    placeholder="Optional description..."
                                    value={newCategory.description}
                                    onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-sm mt-md">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-lg py-sm text-tertiary hover:text-black"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-black text-white px-lg py-sm rounded-md font-semibold hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {submitting ? 'Creating...' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Categories
