import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, MoreHorizontal, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'
import { api } from '../services/api'
import './Products.css'

function Products() {
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({
        category: 'All Categories'
    })

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const data = await api.getStockItems()

            const formattedProducts = data.map(item => {
                // Determine urgency logic
                let urgency = 'Stable'
                if (item.currentStock <= item.lastMinuteStock) {
                    urgency = 'Critical'
                } else if (item.currentStock <= item.minimumStock) {
                    urgency = 'Low'
                }

                return {
                    id: item.id,
                    name: item.name,
                    price: `₹${(Math.random() * 1000 + 100).toFixed(2)}`,
                    category: item.category || 'General',
                    dateAdded: new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    }),
                    expiry: item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    }) : 'N/A',
                    urgency: urgency
                }
            })
            setProducts(formattedProducts)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching products:', error)
            setLoading(false)
        }
    }

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filters.category === 'All Categories' || product.category === filters.category
        return matchesSearch && matchesCategory
    })

    const categories = ['All Categories', ...new Set(products.map(p => p.category))]

    const getUrgencyIcon = (urgency) => {
        switch (urgency) {
            case 'Critical': return <AlertCircle size={16} className="text-danger" />
            case 'Low': return <AlertTriangle size={16} className="text-warning" />
            default: return <CheckCircle size={16} className="text-success" />
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div className="products-page p-xl animate-fadeIn">
            <header className="page-header flex justify-between items-start mb-xl">
                <div>
                    <h1 className="text-3xl font-black m-0 mb-xs">Products ({filteredProducts.length})</h1>
                    <p className="text-tertiary">Manage your inventory products</p>
                </div>
                <button
                    className="btn btn-primary bg-black text-white hover:bg-gray-800 border-none px-lg py-md rounded-md font-bold"
                    onClick={() => navigate('/products/new')}
                >
                    <Plus size={18} /> Add New
                </button>
            </header>

            <div className="filters-section flex items-center gap-xl mb-xl">
                <div className="filter-group">
                    <label className="text-[10px] font-bold text-tertiary uppercase mb-xs">Category</label>
                    <select
                        className="filter-select-minimal"
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                        {categories.map(cat => (
                            <option key={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="search-wrapper flex-1 bg-white rounded-md flex items-center px-md py-sm shadow-sm">
                    <Search size={18} className="text-tertiary mr-md" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="bg-transparent border-none focus:ring-0 flex-1"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button
                    className="text-sm font-semibold text-primary bg-transparent border-none p-0 cursor-pointer"
                    onClick={() => {
                        setFilters({ category: 'All Categories' })
                        setSearchTerm('')
                    }}
                >
                    Reset
                </button>
            </div>

            <div className="table-container bg-white rounded-lg shadow-sm overflow-hidden mb-xl">
                <table className="products-table w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border-subtle bg-tertiary/5">
                            <th className="p-lg text-[11px] font-bold text-tertiary uppercase">Name</th>
                            <th className="p-lg text-[11px] font-bold text-tertiary uppercase">Price</th>
                            <th className="p-lg text-[11px] font-bold text-tertiary uppercase">Date Added</th>
                            <th className="p-lg text-[11px] font-bold text-tertiary uppercase">Expiry</th>
                            <th className="p-lg text-[11px] font-bold text-tertiary uppercase">Category</th>
                            <th className="p-lg text-[11px] font-bold text-tertiary uppercase">Urgency</th>
                            <th className="p-lg w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="border-b border-border-subtle hover:bg-tertiary/10 transition-colors">
                                <td className="p-lg font-semibold">{product.name}</td>
                                <td className="p-lg text-sm">{product.price}</td>
                                <td className="p-lg text-sm text-secondary">{product.dateAdded}</td>
                                <td className="p-lg text-sm">{product.expiry}</td>
                                <td className="p-lg text-sm">
                                    <span className="bg-tertiary/20 px-sm py-xs rounded text-xs font-medium">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="p-lg">
                                    <div className="flex items-center gap-xs">
                                        {getUrgencyIcon(product.urgency)}
                                        <span className={`text-xs font-bold uppercase ${product.urgency === 'Critical' ? 'text-danger' : product.urgency === 'Low' ? 'text-warning' : 'text-success'}`}>
                                            {product.urgency}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-lg">
                                    <button className="text-tertiary hover:text-primary bg-transparent border-none p-xs cursor-pointer">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination flex justify-end gap-md">
                <button className="btn-pagination" disabled>Previous</button>
                <button className="btn-pagination" disabled>Next</button>
            </div>
        </div>
    )
}

export default Products
