import { LayoutGrid } from 'lucide-react'

function Categories() {
    return (
        <div className="page-container p-xl animate-fadeIn">
            <header className="page-header mb-xl">
                <h1 className="flex items-center gap-md">
                    <LayoutGrid className="text-primary" />
                    Categories
                </h1>
                <p className="text-tertiary">Manage and organize your stock items by category.</p>
            </header>

            <div className="card p-2xl text-center">
                <LayoutGrid size={48} className="text-primary opacity-20 mx-auto mb-md" />
                <h3 className="text-lg font-bold mb-xs">Category Management Coming Soon</h3>
                <p className="text-tertiary">This section will allow you to add, edit and delete stock categories.</p>
            </div>
        </div>
    )
}

export default Categories
