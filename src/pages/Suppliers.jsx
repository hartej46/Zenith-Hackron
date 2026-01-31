import { Truck } from 'lucide-react'

function Suppliers() {
    return (
        <div className="page-container p-xl animate-fadeIn">
            <header className="page-header mb-xl">
                <h1 className="flex items-center gap-md">
                    <Truck className="text-primary" />
                    Suppliers
                </h1>
                <p className="text-tertiary">Access and manage your directory of trusted suppliers.</p>
            </header>

            <div className="card p-2xl text-center">
                <Truck size={48} className="text-primary opacity-20 mx-auto mb-md" />
                <h3 className="text-lg font-bold mb-xs">Supplier Directory Coming Soon</h3>
                <p className="text-tertiary">This section will list your suppliers with contact info and order history.</p>
            </div>
        </div>
    )
}

export default Suppliers
