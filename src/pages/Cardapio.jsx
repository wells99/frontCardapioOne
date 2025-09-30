import { useState, useEffect } from "react";
import { Button, Card, Tag, Modal, Image } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  ShoppingOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import logo from "../assets/zelogo.png";
import { NavLink } from "react-router-dom";

const FAVORITES_STORAGE_KEY = "favorites";

export default function MenuPage() {
  const [favorites, setFavorites] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const API_BASE_URL = "https://endcardapio.onrender.com";

  // Sincroniza o estado "favorites" com o localStorage
  useEffect(() => {
    try {
      const storedFavorites =
        JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || [];
      setFavorites(storedFavorites);
    } catch (e) {
      console.error("Falha ao carregar favoritos do localStorage:", e);
      setFavorites([]);
    }
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/products`);
    return response.data;
  };

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="w-40 h-40 flex items-center justify-center">
          <img src={logo} alt="logo" className="animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-xl font-semibold text-red-500">
          Erro ao carregar o cardápio: {error.message}
        </div>
      </div>
    );
  }

  if (!products) return null;

  // Pega categorias únicas
  const categories = [
    ...new Set(products.map((p) => p.category?.name || "Sem categoria")),
  ];

  // Adiciona ou remove item dos favoritos e salva no localStorage
  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const isFavorite = prev.some((fav) => fav.id === product.id);
      let newFavorites;
      if (isFavorite) {
        newFavorites = prev.filter((fav) => fav.id !== product.id);
      } else {
        newFavorites = [...prev, product];
      }
      localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(newFavorites)
      );
      return newFavorites;
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const favoriteProducts = products.filter((p) =>
    favorites.some((fav) => fav.id === p.id)
  );


  return (

    <>
      <div className="w-full min-w-md mx-auto bg-green-700 min-h-screen ">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 p-4 border-b lg:h-30 md:w-full md:px-20" id="header">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 lg:w-24 lg:h-24 rounded-full bg-black flex items-center justify-center text-white font-bold text-xl">

              <NavLink
                className={"flex gap-2 hover:bg-green-600 [&.active]:bg-green-500 [&.active]:font-medium cursor-pointer"}
                to={"/admin"}
                end >
                <img src={logo} alt="logo" />
              </NavLink>

            </div>
            <div className="lg:pl-4">
              <h1 className="font-bold text-lg lg:text-4xl lg:pb-4">Zé Mexicano</h1>
              <a href="https://search.google.com/local/writereview?placeid=ChIJocF0HgBHxwcRKLcdW7G91aI">
                <Tag color="gold">Avaliar ★</Tag>
              </a>
            </div>
          </div>
          <Button
            type="text"
            onClick={showModal}
            className="text-gray-600 hover:text-gray-900"
          >
            <div className="relative">
              <ShoppingOutlined className="text-2xl lg:text-4xl lg:px-2" />
              {favoriteProducts.length > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {favoriteProducts.length}
                </span>
              )}
            </div>
          </Button>
        </div>

        {/* Modal de Favoritos */}
        <Modal
          title="Meus Favoritos ❤️"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          closeIcon={<CloseOutlined />}
        >
          {favoriteProducts.length > 0 ? (
            <div className="space-y-4">
              {favoriteProducts.map((p) => (
                <Card
                  key={p.id}
                  className="shadow-sm rounded-xl"
                  bodyStyle={{ padding: "12px" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 pr-3">
                      <h4 className="font-semibold text-base">{p.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {p.description}
                      </p>
                      <span className="font-bold text-gray-900">
                        R$ {p.price}
                      </span>
                    </div>
                    {p.imageUrl && (

                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-md"
                        width={60}
                        // height={60}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                      />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Nenhum item adicionado aos favoritos.
            </p>
          )}
        </Modal>

        {/* Categorias */}
        <div className="flex gap-2 overflow-x-auto p-3 md:grid grid-cols-2 md:w-full md:px-20">
          {categories.map((cat, idx) => (
            <Button
              key={idx}
              size="middle"
              className="rounded-full border border-gray-400 whitespace-nowrap"
            >
              <a href={`#${cat}`}>{cat}</a>
            </Button>

          ))}
        </div>

        {/* Lista de produtos */}
        <div className="p-3 md:w-full md:px-20">
          {categories.map((cat) => (
            <div key={cat} id={cat} className="mb-6">
              <h2 className="font-bold text-lg mb-2">{cat.toUpperCase()}</h2>
              {products
                .filter((p) => (p.category?.name || "Sem categoria") === cat)
                .map((p) => (
                  <div className="mb-1 md:mb-4">
                    <Card
                      key={p.id}
                      className="mb-3 shadow-sm rounded-xl "
                      bodyStyle={{ padding: "12px" }}
                    >
                      <div className="flex justify-between items-start">
                        {/* Info */}
                        <div className="flex-1 pr-3">
                          <h3 className="font-semibold text-base">{p.name}</h3>
                          <p className="text-sm text-gray-600">
                            {p.description}
                          </p>
                          <div className="mt-2 flex items-center gap-3">
                            <span className="font-bold text-gray-900">
                              R$ {p.price}
                            </span>
                            <button
                              className="flex items-center text-red-500"
                              onClick={() => toggleFavorite(p)}
                            >
                              {favorites.some((fav) => fav.id === p.id) ? (
                                <HeartFilled />
                              ) : (
                                <HeartOutlined />
                              )}
                            </button>
                          </div>
                        </div>
                        {/* Imagem */}
                        {p.imageUrl && (
                          <Image
                            src={p.imageUrl}
                            alt={p.name}
                            preview={true} // habilita o preview padrão do antd
                            width={80} // equivalente ao w-20 do Tailwind
                            height={80} // equivalente ao h-20
                            style={{
                              objectFit: "cover",
                              borderRadius: "0.375rem", // rounded-md ≈ 6px
                            }}
                            className="object-cover" // mantém consistência com Tailwind
                          />
                        )}
                      </div>
                    </Card>
                  </div>
                ))}
            </div>
          ))}
        </div>


      </div>
      <a
        href="#header"
        className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </a>
    </>

  );
}