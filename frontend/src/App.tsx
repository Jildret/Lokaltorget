import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateProperty from './pages/CreateProperty'
import Search from './pages/Search'
import PropertyDetail from './pages/PropertyDetail'
import CreateSpaceRequest from './pages/CreateSpaceRequest'
import Admin from './pages/Admin'
import MyPages from './pages/MyPages'
import EditProperty from './pages/EditProperty'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/logga-in" element={<Login />} />
          <Route path="/registrera" element={<Register />} />
          <Route path="/skapa-lokal" element={<CreateProperty />} />
          <Route path="/sok" element={<Search />} />
          <Route path="/lokaler/:id" element={<PropertyDetail />} />
          <Route path="/jag-soker-lokal" element={<CreateSpaceRequest />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/mina-sidor" element={<MyPages />} />
          <Route path="/redigera-lokal/:id" element={<EditProperty />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App