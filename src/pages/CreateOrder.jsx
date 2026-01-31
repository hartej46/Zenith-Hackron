import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Plus, Trash2, Search, ChevronDown, Check, AlertCircle } from 'lucide-react'
import { api } from '../services/api'
import './CreateOrder.css'

function CreateOrder() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [stockItems, setStockItems] = useState([])
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        customerName: '',
        contactInfo: '',
        deadline: '',
        notes: '',
        items: [] // { stockItemId, quantity, name, availableStock }
    })

    const [searchTerm, setSearchTerm] = useState('')
    const [showResults, setShowResults] = useState(false)

    useEffect(() => {
        fetchStock()
    }, [])

    const fetchStock = async () => {
        try {
            const data = await api.getStockItems()
            setStockItems(data)
        } catch (error) {
            console.error('Error fetching stock:', error)
        }
    }

    const handleAddItem = (item) => {
        if (formData.items.some(i => i.stockItemId === item.id)) return

        setFormData({
            ...formData,
            items: [...formData.items, {
                stockItemId: item.id,
                quantity: 1,
                name: item.name,
                availableStock: item.currentStock
            }]
        })
        setSearchTerm('')
        setShowResults(false)
    }

    const handleRemoveItem = (id) => {
        setFormData({
            ...formData,
            items: formData.items.filter(i => i.stockItemId !== id)
        })
    }

    const handleQuantityChange = (id, val) => {
        const quantity = parseInt(val) || 0
        setFormData({
            ...formData,
            items: formData.items.map(i =>
                i.stockItemId === id ? { ...i, quantity } : i
            )
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (formData.items.length === 0) {
            setError('Please add at least one item to the order')
            return
        }

        // Check if any quantity exceeds available stock
        const overStockItem = formData.items.find(i => i.quantity > i.availableStock)
        if (overStockItem) {
            setError(`Insufficient stock for ${overStockItem.name}. Available: ${overStockItem.availableStock}`)
            return
        }

        try {
            setLoading(true)
            await api.createOrder({
                customerName: formData.customerName,
                contactInfo: formData.contactInfo,
                priority: 'MEDIUM', // Default priority if needed by backend
                deadline: formData.deadline || null,
                notes: formData.notes,
                items: formData.items.map(i => ({
                    stockItemId: i.stockItemId,
                    quantity: i.quantity
                }))
            })
            setLoading(false)
            navigate('/orders')
        } catch (error) {
            console.error('Error creating order:', error)
            setLoading(false)
            const detailMsg = error.response?.data?.details || error.response?.data?.error || ''
            setError(`Failed to place order. ${detailMsg ? `Details: ${detailMsg}` : 'Please check stock levels and try again.'}`)
        }
    }

    const filteredStock = stockItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !formData.items.some(i => i.stockItemId === item.id)
    )

    return (
        <div className="create-order-page p-xl animate-fadeIn">
            <header className="page-header mb-xl">
                <h1 className="text-3xl font-black m-0 mb-xs">Create Order Request</h1>
                <p className="text-tertiary">Place a new order and update inventory automatically</p>
            </header>

            <form onSubmit={handleSubmit} className="order-form grid grid-cols-1 lg:grid-cols-3 gap-2xl">
                {/* Left Column: Customer & Details */}
                <div className="lg:col-span-1 flex flex-col gap-xl">
                    <section className="bg-white p-xl rounded-lg shadow-sm border border-border-subtle">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-secondary mb-xl">Customer Details</h2>

                        <div className="form-item mb-lg">
                            <label>Customer Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Acme Corp"
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-item mb-lg">
                            <label>Contact Info</label>
                            <input
                                type="text"
                                placeholder="Email or Phone"
                                value={formData.contactInfo}
                                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                            />
                        </div>

                        <div className="form-item">
                            <label>Deadline (Optional)</label>
                            <input
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>
                    </section>

                    <section className="bg-white p-xl rounded-lg shadow-sm border border-border-subtle">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-secondary mb-xl">Notes</h2>
                        <textarea
                            placeholder="Special instructions or details..."
                            className="bg-transparent border border-border-subtle rounded-md p-md w-full min-h-[100px] text-sm focus:border-black transition-all outline-none"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </section>
                </div>

                {/* Right Column: Item Selection & Order Summary */}
                <div className="lg:col-span-2 flex flex-col gap-xl">
                    <section className="bg-white p-xl rounded-lg shadow-sm border border-border-subtle">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-secondary mb-xl">Select Products</h2>

                        <div className="relative mb-xl">
                            <div className="search-wrapper flex items-center bg-tertiary/10 rounded-md px-md py-sm border border-transparent focus-within:border-black transition-all">
                                <Search size={18} className="text-tertiary mr-md" />
                                <input
                                    type="text"
                                    placeholder="Search products in inventory..."
                                    className="bg-transparent border-none focus:ring-0 flex-1 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                        setShowResults(true)
                                    }}
                                    onFocus={() => setShowResults(true)}
                                />
                            </div>

                            {showResults && searchTerm && (
                                <div className="absolute top-full left-0 right-0 mt-xs bg-white border border-border-subtle rounded-lg shadow-xl z-50 max-h-[200px] overflow-y-auto">
                                    {filteredStock.length > 0 ? filteredStock.map(item => (
                                        <div
                                            key={item.id}
                                            className="p-md hover:bg-tertiary/20 cursor-pointer flex justify-between items-center"
                                            onClick={() => handleAddItem(item)}
                                        >
                                            <div>
                                                <div className="text-sm font-bold">{item.name}</div>
                                                <div className="text-[10px] text-tertiary">{item.category}</div>
                                            </div>
                                            <div className="text-xs font-bold text-primary">
                                                {item.currentStock} {item.unit} available
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-md text-sm text-tertiary text-center">No products found or already added</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="items-list">
                            <h3 className="text-[10px] font-black uppercase text-tertiary tracking-widest mb-md">Selected Items</h3>
                            {formData.items.length > 0 ? (
                                <div className="flex flex-col gap-md">
                                    {formData.items.map(item => (
                                        <div key={item.stockItemId} className="flex items-center gap-xl p-md bg-tertiary/5 rounded-md border border-border-subtle">
                                            <div className="flex-1">
                                                <div className="text-sm font-bold">{item.name}</div>
                                                <div className="text-[10px] text-tertiary font-bold uppercase">Available: {item.availableStock}</div>
                                            </div>
                                            <div className="w-24">
                                                <label className="text-[10px] font-bold text-tertiary block mb-xs">Quantity</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="w-full p-xs text-sm border-b border-border-subtle focus:border-black bg-transparent outline-none"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.stockItemId, e.target.value)}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className="text-tertiary hover:text-danger p-sm bg-transparent border-none cursor-pointer"
                                                onClick={() => handleRemoveItem(item.stockItemId)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-xl text-tertiary text-sm italic">
                                    No products selected yet. Use the search bar above to add items.
                                </div>
                            )}
                        </div>
                    </section>

                    {error && (
                        <div className="error-banner flex items-center gap-md p-md bg-danger/10 text-danger rounded-md border border-danger/20 mb-md animate-fadeIn">
                            <AlertCircle size={18} />
                            <span className="text-sm font-bold">{error}</span>
                        </div>
                    )}

                    <div className="flex justify-end gap-md">
                        <button
                            type="button"
                            className="px-xl py-md text-sm font-bold text-tertiary bg-transparent border-none cursor-pointer hover:text-primary transition-all"
                            onClick={() => navigate('/orders')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-black text-white px-2xl py-md rounded-md text-sm font-bold flex items-center gap-md hover:bg-gray-800 transition-all border-none disabled:opacity-50"
                            disabled={loading || formData.items.length === 0}
                        >
                            <ShoppingCart size={18} />
                            {loading ? 'Placing Order...' : 'Place Order Request'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreateOrder
