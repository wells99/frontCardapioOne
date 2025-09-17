import { NavLink, useNavigate } from "react-router"
import logo from "../assets/react.svg"
import { AppstoreOutlined, LogoutOutlined, PieChartOutlined } from "@ant-design/icons"

const Header = () => {

    const navigate = useNavigate();

    return (
        <header className="w-[270px] h-screen overflow-auto bg-green-700 p-4 text-lg font-normal text-white">
            <img src={logo} alt="Tiamate" className="m-auto" />
            <nav className="grid gap-3 mt-8 *:leading-[40px] *:text-creme *:duration-150 *:rounded *:pl-4">
                <NavLink
                    className={"flex gap-2 hover:bg-green-600 [&.active]:bg-green-500 [&.active]:font-medium cursor-pointer"}
                    to={"/admin"}
                    end
                >
                    <PieChartOutlined />
                    Dashboard
                </NavLink>

                <NavLink
                    className={"flex gap-2 hover:bg-green-600 [&.active]:bg-green-500 [&.active]:font-medium cursor-pointer"}
                    to={"/admin/categorias"}
                    end
                >
                    <AppstoreOutlined />
                    Categorias
                </NavLink>


                <NavLink
                    className={"flex gap-2 hover:bg-green-600 [&.active]:bg-green-500 [&.active]:font-medium cursor-pointer"}
                    to={"/admin/produtos"}
                    end
                >
                    <AppstoreOutlined />
                    Produtos
                </NavLink>
                 <NavLink
                    className={"flex gap-2 hover:bg-green-600 [&.active]:bg-green-500 [&.active]:font-medium cursor-pointer"}
                    to={"/admin/clientes"}
                    end
                >
                    <AppstoreOutlined />
                    Clientes
                </NavLink>
                 <NavLink
                    className={"flex gap-2 hover:bg-green-600 [&.active]:bg-green-500 [&.active]:font-medium cursor-pointer"}
                    to={"/admin/empresa"}
                    end
                >
                    <AppstoreOutlined />
                    Empresa
                </NavLink>
                 <NavLink
                    className={"flex gap-2 hover:bg-green-600 [&.active]:bg-green-500 [&.active]:font-medium cursor-pointer"}
                    to={"/admin/pedidos"}
                    end
                >
                    <AppstoreOutlined />
                    Pedidos
                </NavLink>
                 <NavLink
                    className={"flex gap-2 hover:bg-green-600 [&.active]:bg-green-500 [&.active]:font-medium cursor-pointer"}
                    to={"/admin/ItemPedidos"}
                    end
                >
                    <AppstoreOutlined />
                    Detalhes de Pedido
                </NavLink>
                 <NavLink
                    className={"flex gap-2 hover:bg-green-600 [&.active]:bg-green-500 [&.active]:font-medium cursor-pointer"}
                    to={"/admin/pagamentos"}
                    end
                >
                    <AppstoreOutlined />
                    Pagamentos
                </NavLink>
                <div
                    className={"flex gap-2 hover:bg-green-600 [&.active]:bg-green-500 [&.active]:font-medium cursor-pointer"}
                    onClick={() => {
                        sessionStorage.clear();
                        navigate("/");
                    }}
                >
                    <LogoutOutlined />
                    Sair
                </div>
            </nav>
        </header>
    );
}

export default Header;