import { useState } from 'react'
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
        expiryDate: '',
        categoryId: 'Select a category',
        featured: false,
        archived: false
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            await api.createStockItem({
                name: formData.name,
                description: formData.description,
                currentStock: parseInt(formData.stockQuantity) || 0,
                minimumStock: parseInt(formData.minimumStock) || 5,
                expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
                unit: 'units',
                category: formData.categoryId === 'Select a category' ? 'General' : formData.categoryId
            })
            setLoading(false)
            navigate('/products')
        } catch (error) {
            console.error('Error creating product:', error)
            setLoading(false)
        }
    }

    return (
        <div className="create-product-page p-xl animate-fadeIn">
            <header className="page-header mb-xl">
                <h1 className="text-4xl font-black m-0 mb-xs">Create product</h1>
                <p className="text-tertiary">Add a new inventory product</p>
            </header>

            <form onSubmit={handleSubmit} className="product-form flex flex-col gap-2xl">
                <section>
                    <h3 className="text-sm font-bold mb-md uppercase tracking-wider">Images</h3>
                    <div className="image-upload-box w-32 h-32 bg-tertiary/20 rounded-md flex flex-col items-center justify-center gap-sm cursor-pointer hover:bg-tertiary/40 transition-all">
                        <ImagePlus size={20} className="text-secondary" />
                        <span className="text-xs font-semibold">Upload Image</span>
                    </div>
                </section>

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
                        <div className="select-wrapper">
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            >
                                <option disabled>Select a category</option>
                                <option>Raw Materials</option>
                                <option>Supplies</option>
                                <option>Chemicals</option>
                                <option>Finishing</option>
                            </select>
                            <ChevronDown size={14} className="select-icon" />
                        </div>
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

                <div className="checkbox-row flex gap-2xl">
                    <label className="checkbox-item flex items-start gap-md p-lg border border-transparent rounded-lg cursor-pointer hover:bg-tertiary/20 transition-all flex-1 shadow-sm">
                        <div className={`checkbox-box ${formData.featured ? 'checked' : ''}`}>
                            {formData.featured && <Check size={12} />}
                        </div>
                        <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            hidden
                        />
                        <div className="checkbox-text">
                            <span className="block font-bold text-sm">Featured Product</span>
                            <span className="block text-xs text-tertiary">Promote this on the dashboard overview</span>
                        </div>
                    </label>

                    <label className="checkbox-item flex items-start gap-md p-lg border border-transparent rounded-lg cursor-pointer hover:bg-tertiary/20 transition-all flex-1 shadow-sm">
                        <div className={`checkbox-box ${formData.archived ? 'checked' : ''}`}>
                            {formData.archived && <Check size={12} />}
                        </div>
                        <input
                            type="checkbox"
                            checked={formData.archived}
                            onChange={(e) => setFormData({ ...formData, archived: e.target.checked })}
                            hidden
                        />
                        <div className="checkbox-text">
                            <span className="block font-bold text-sm">Archive Item</span>
                            <span className="block text-xs text-tertiary">Hide this product from active inventories</span>
                        </div>
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
