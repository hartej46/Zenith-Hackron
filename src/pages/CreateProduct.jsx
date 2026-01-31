import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImagePlus, ChevronDown, Check, Calendar } from 'lucide-react'
import { api } from '../services/api'
import './CreateProduct.css'

function CreateProduct() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        minimumStock: 5,
        lastMinuteStock: 2,
        expiryDate: '',
        categoryId: 'Select a category',
        featured: false,
        archived: false
    })
    const [errors, setErrors] = useState({})

    const [isCustomCategory, setIsCustomCategory] = useState(false)
    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const data = await api.getCategories()
            setCategories(data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const validateForm = () => {
        const newErrors = {}
        const current = parseInt(formData.stockQuantity) || 0
        const minimum = parseInt(formData.minimumStock) || 0
        const critical = parseInt(formData.lastMinuteStock) || 0

        if (minimum > current) {
            newErrors.minimumStock = 'Minimum threshold should be less than current stock'
        }
        if (critical >= minimum) {
            newErrors.lastMinuteStock = 'Critical threshold should be less than minimum stock'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            setLoading(true)

            // If it's a new custom category, create it first so it's saved for future
            if (isCustomCategory && formData.categoryId) {
                try {
                    await api.createCategory({
                        name: formData.categoryId,
                        description: 'Created during product creation'
                    })
                } catch (err) {
                    console.error('Failed to auto-save category:', err)
                    // Continue anyway, just won't be saved to master list
                }
            }

            await api.createStockItem({
                name: formData.name,
                description: formData.description,
                currentStock: parseInt(formData.stockQuantity) || 0,
                minimumStock: parseInt(formData.minimumStock) || 5,
                lastMinuteStock: parseInt(formData.lastMinuteStock) || 2,
                expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
                unit: 'units',
                category: isCustomCategory ? formData.categoryId : (formData.categoryId === 'Select a category' ? 'General' : formData.categoryId),
                isArchived: formData.archived
            })
            setLoading(false)
            navigate('/products')
        } catch (error) {
            console.error('Error creating product:', error)
            setLoading(false)
        }
    }

    const handleCategoryChange = (e) => {
        const val = e.target.value
        if (val === 'new_category_option') {
            setIsCustomCategory(true)
            setFormData({ ...formData, categoryId: '' })
        } else {
            setFormData({ ...formData, categoryId: val })
        }
    }

    return (
        <div className="create-product-page p-xl animate-fadeIn">
            <header className="page-header mb-xl">
                <h1 className="text-4xl font-black m-0 mb-xs">Create product</h1>
                <p className="text-tertiary">Add a new inventory product</p>
            </header>

            <form onSubmit={handleSubmit} className="product-form flex flex-col gap-2xl">
                {/* Images section REMOVED */}

                <div className="form-grid">
                    <div className="form-item">
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Product name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-item">
                        <label>Category</label>
                        {isCustomCategory ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type new category..."
                                    className="flex-1"
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsCustomCategory(false)}
                                    className="text-xs underline text-tertiary hover:text-primary"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="select-wrapper">
                                <select
                                    value={formData.categoryId}
                                    onChange={handleCategoryChange}
                                >
                                    <option disabled>Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                    <option value="new_category_option">+ Add New Category</option>
                                </select>
                                <ChevronDown size={14} className="select-icon" />
                            </div>
                        )}
                    </div>

                    <div className="form-item">
                        <label>Price</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>

                    <div className="form-item">
                        <label>Current Stock</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={formData.stockQuantity}
                            onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-item">
                        <label>Minimum Stock Alert</label>
                        <input
                            type="number"
                            placeholder="5"
                            value={formData.minimumStock}
                            onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                        />
                        {errors.minimumStock && <span className="text-red-500 text-xs mt-1 block">{errors.minimumStock}</span>}
                    </div>

                    <div className="form-item">
                        <label>Critical Stock Alert</label>
                        <input
                            type="number"
                            placeholder="2"
                            value={formData.lastMinuteStock}
                            onChange={(e) => setFormData({ ...formData, lastMinuteStock: e.target.value })}
                        />
                        {errors.lastMinuteStock && <span className="text-red-500 text-xs mt-1 block">{errors.lastMinuteStock}</span>}
                    </div>

                    <div className="form-item">
                        <label>Expiry Date</label>
                        <div className="relative flex items-center">
                            <input
                                type="date"
                                className="w-full"
                                value={formData.expiryDate}
                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-item">
                    <label>Description (Optional)</label>
                    <textarea
                        placeholder="Additional details about the product..."
                        className="bg-white border border-[#e5e7eb] rounded-md p-md min-h-[100px] focus:border-black outline-none transition-all"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="form-item checkbox-row flex items-center gap-md">
                    <label className="flex items-center gap-sm cursor-pointer select-none">
                        <div className={`checkbox-box ${formData.archived ? 'checked' : ''}`}>
                            {formData.archived && <Check size={12} />}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={formData.archived}
                            onChange={(e) => setFormData({ ...formData, archived: e.target.checked })}
                        />
                        <span>Archived Project (Hidden from Overview)</span>
                    </label>
                </div>

                <div className="form-actions mt-xl">
                    <button
                        type="submit"
                        className="btn btn-primary bg-black text-white hover:bg-gray-800 border-none px-2xl py-md font-bold text-sm rounded-md"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Product'}
                    </button>
                    <button
                        type="button"
                        className="btn bg-transparent border-none text-tertiary font-semibold ml-lg hover:text-primary"
                        onClick={() => navigate('/products')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateProduct
