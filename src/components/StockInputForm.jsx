import { useState } from 'react'
import { api } from '../services/api'
import { Package, BarChart3, Clock, CheckCircle, AlertTriangle, AlertCircle, Plus, Info } from 'lucide-react'
import './StockInputForm.css'

function StockInputForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        minimumStock: '',
        currentStock: '',
        lastMinuteStock: '',
        unit: 'units',
        expiryDate: ''
    })

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const categories = [
        'Raw Materials',
        'Supplies',
        'Chemicals',
        'Finishing',
        'Packaging',
        'Tools',
        'Other'
    ]

    const units = [
        'units',
        'kg',
        'liters',
        'meters',
        'boxes',
        'pieces',
        'tons',
        'gallons'
    ]

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.name.trim()) newErrors.name = 'Item name is required'
        if (!formData.category) newErrors.category = 'Category is required'

        if (formData.currentStock === '' || Number(formData.currentStock) < 0) {
            newErrors.currentStock = 'Current stock is required (min 0)'
        }

        if (formData.minimumStock === '' || Number(formData.minimumStock) < 0) {
            newErrors.minimumStock = 'Minimum stock is required (min 0)'
        }

        if (formData.lastMinuteStock === '' || Number(formData.lastMinuteStock) < 0) {
            newErrors.lastMinuteStock = 'Critical threshold is required (min 0)'
        }

        const minimum = Number(formData.minimumStock)
        const critical = Number(formData.lastMinuteStock)

        if (critical > minimum) {
            newErrors.lastMinuteStock = 'Critical threshold should be less than minimum'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        setSuccessMessage('')

        try {
            const stockData = {
                ...formData,
                minimumStock: Number(formData.minimumStock),
                currentStock: Number(formData.currentStock),
                lastMinuteStock: Number(formData.lastMinuteStock),
                expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null
            }

            await api.createStockItem(stockData)
            setSuccessMessage('Stock item added successfully!')

            setTimeout(() => {
                if (onSuccess) onSuccess()
            }, 1000)

        } catch (error) {
            console.error('Error creating stock item:', error)
            setErrors({ submit: 'Failed to add item. Check connection or authentication.' })
        } finally {
            setLoading(false)
        }
    }

    const getStockStatus = () => {
        if (formData.currentStock === '' || formData.minimumStock === '' || formData.lastMinuteStock === '') return null

        const current = Number(formData.currentStock)
        const minimum = Number(formData.minimumStock)
        const critical = Number(formData.lastMinuteStock)

        if (current <= critical) {
            return { status: 'critical', message: 'Critical Level!', color: 'danger', icon: <AlertCircle size={16} /> }
        } else if (current <= minimum) {
            return { status: 'low', message: 'Low Level', color: 'warning', icon: <AlertTriangle size={16} /> }
        } else {
            return { status: 'normal', message: 'Healthy Level', color: 'success', icon: <CheckCircle size={16} /> }
        }
    }

    const stockStatus = getStockStatus()

    return (
        <form className="stock-input-form animate-fadeIn" onSubmit={handleSubmit}>
            {errors.submit && (
                <div className="alert alert-danger mb-lg flex items-center gap-md">
                    <AlertCircle size={20} />
                    <span>{errors.submit}</span>
                </div>
            )}

            {successMessage && (
                <div className="alert alert-success mb-lg flex items-center gap-md">
                    <CheckCircle size={20} />
                    <span>{successMessage}</span>
                </div>
            )}

            <div className="form-group mb-lg">
                <label className="flex items-center gap-sm">
                    <Package size={14} className="text-primary" /> Item Name *
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Industrial Steel Rods"
                    required
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-row mb-lg">
                <div className="form-group">
                    <label>Category *</label>
                    <select name="category" value={formData.category} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>Unit *</label>
                    <select name="unit" value={formData.unit} onChange={handleChange} required>
                        {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                </div>
            </div>

            <div className="stock-levels-section mb-xl bg-bg-tertiary/30 p-lg rounded-xl border border-border">
                <h3 className="section-heading flex items-center gap-sm text-sm font-bold uppercase mb-lg">
                    <BarChart3 size={18} className="text-primary" /> Stock Configuration
                </h3>

                <div className="form-row mb-md">
                    <div className="form-group">
                        <label className="text-[10px]">Current Quantity</label>
                        <input
                            type="number"
                            name="currentStock"
                            value={formData.currentStock}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="text-[10px]">Minimum Required</label>
                        <input
                            type="number"
                            name="minimumStock"
                            value={formData.minimumStock}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="text-[10px]">Critical Alert At</label>
                        <input
                            type="number"
                            name="lastMinuteStock"
                            value={formData.lastMinuteStock}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                            required
                        />
                    </div>
                </div>

                {stockStatus && (
                    <div className={`status-indicator flex items-center gap-md p-md rounded-lg mb-sm bg-${stockStatus.color}/10 border border-${stockStatus.color}/20 text-${stockStatus.color}`}>
                        {stockStatus.icon}
                        <span className="text-sm font-bold uppercase tracking-wider">{stockStatus.message}</span>
                    </div>
                )}

                <div className="flex items-center gap-sm text-[10px] text-tertiary mt-sm italic">
                    <Info size={12} />
                    <span>Critical threshold should always be lower than the minimum stock level.</span>
                </div>
            </div>

            <div className="form-group mb-xl">
                <label className="flex items-center gap-sm">
                    <Clock size={14} /> Expiry Date (Optional)
                </label>
                <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>

            <div className="form-actions mt-xl">
                <button
                    type="submit"
                    className="btn btn-primary w-full py-lg h-14 text-lg shadow-lg hover-glow"
                    disabled={loading}
                >
                    {loading ? (
                        <><div className="spinner-small mr-md"></div> Processing...</>
                    ) : (
                        <><Plus size={20} className="mr-sm" /> Add New Stock Item</>
                    )}
                </button>
            </div>
        </form>
    )
}

export default StockInputForm
