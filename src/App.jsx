import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react'
import Layout from './components/Layout'
import Overview from './pages/Overview'
import Categories from './pages/Categories'
import Products from './pages/Products'
import Suppliers from './pages/Suppliers'
import AIChat from './pages/AIChat'
import CreateProduct from './pages/CreateProduct'
import Orders from './pages/Orders'
import Urgent from './pages/Urgent'
import CreateOrder from './pages/CreateOrder'
import './App.css'

function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <Routes>
                    <Route
                        path="/sign-in/*"
                        element={
                            <div className="auth-container">
                                <SignIn
                                    routing="path"
                                    path="/sign-in"
                                    signUpUrl="/sign-up"
                                    afterSignInUrl="/"
                                    afterSignUpUrl="/"
                                />
                            </div>
                        }
                    />
                    <Route
                        path="/sign-up/*"
                        element={
                            <div className="auth-container">
                                <SignUp
                                    routing="path"
                                    path="/sign-up"
                                    signInUrl="/sign-in"
                                    afterSignUpUrl="/"
                                    afterSignInUrl="/"
                                />
                            </div>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <>
                                <SignedIn>
                                    <Layout />
                                </SignedIn>
                                <SignedOut>
                                    <Navigate to="/sign-in" replace />
                                </SignedOut>
                            </>
                        }
                    >
                        <Route index element={<Overview />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="products" element={<Products />} />
                        <Route path="products/new" element={<CreateProduct />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="urgent" element={<Urgent />} />
                        <Route path="suppliers" element={<Suppliers />} />
                        <Route path="create-order" element={<CreateOrder />} />
                        <Route path="ai-chat" element={<AIChat />} />
                    </Route>

                    <Route
                        path="*"
                        element={
                            <>
                                <SignedIn>
                                    <Navigate to="/" replace />
                                </SignedIn>
                                <SignedOut>
                                    <Navigate to="/sign-in" replace />
                                </SignedOut>
                            </>
                        }
                    />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
