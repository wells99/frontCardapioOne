import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout"
import Cardapio from '../pages/Cardapio'
import Login from '../pages/LoginPage'
import SafePaths from '../routes/SafePath'
import Categorias from "../pages/Categorias"
import Produtos from "../pages/Produtos"
import Clientes from "../pages/Clientes"
import Empresa from "../pages/Empresa"
import Pedidos from "../pages/Pedidos"

const Paths = () => {
    return (
        <BrowserRouter>
            <Routes>
              
                <Route path="/" element={<Cardapio />} />
                
           
                <Route path="/login" element={<Login />} />

                {/* Rota pai para todas as páginas de administração */}
                <Route path="/admin" element={<SafePaths><DashboardLayout /></SafePaths>}>
                    <Route index element={<h1>Página inicial do Admin (Dashboard)</h1>} />
                    <Route path="categorias" element={<Categorias />} />
                    <Route path="cardapio" element={<Cardapio />} />
                    <Route path="produtos" element={<Produtos />} />
                    <Route path="clientes" element={<Clientes />} />
                    <Route path="empresa" element={<Empresa />} />
                    <Route path="pedidos" element={<Pedidos />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Paths;