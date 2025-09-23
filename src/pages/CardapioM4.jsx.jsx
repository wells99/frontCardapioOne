import { useState } from "react";
import { Button, Card, Tag } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import logo from "../assets/zelogo.png";

export default function MenuPage() {
  const [favorites, setFavorites] = useState([]);

  const API_BASE_URL = "https://endcardapio.onrender.com";

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
    ...new Set(products.map((p) => p.category?.name || "Sem categoria"))];

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white font-bold text-xl">
          <a href={`${window.location.origin}/admin`} target="_blank" rel="noopener noreferrer">
            <img src={logo} alt="logo" />
          </a>

        </div>
        <div>
          <h1 className="font-bold text-lg">Zé Mexicano</h1>

          <a href="https://search.google.com/local/writereview?placeid=ChIJocF0HgBHxwcRKLcdW7G91aI"><Tag color="gold">Avaliar ★</Tag></a>

        </div>
      </div>

      {/* Categorias */}
      <div className="flex gap-2 overflow-x-auto p-3">
        {categories.map((cat, idx) => (
          <Button
            key={idx}
            size="small"
            className="rounded-full border border-gray-400 whitespace-nowrap"
          >
                <a href={`#${cat}`}>{cat}</a>
          </Button>
        ))}
      </div>

      {/* Lista de produtos */}
      <div className="p-3">
        {categories.map((cat) => (
          <div key={cat} id={cat} className="mb-6">
            <h2 className="font-bold text-lg mb-2">{cat.toUpperCase()}</h2>

            {products
              .filter((p) => (p.category?.name || "Sem categoria") === cat)
              .map((p) => (
                <Card
                  key={p.id}
                  className="mb-3 shadow-sm rounded-xl"
                  bodyStyle={{ padding: "12px" }}
                >
                  <div className="flex justify-between items-start">
                    {/* Info */}
                    <div className="flex-1 pr-3">
                      <h3 className="font-semibold text-base">
                        {p.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {p.produto_descricao}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="font-bold text-gray-900">
                          R$ {p.price}
                        </span>
                        <button
                          className="flex items-center text-red-500"
                          onClick={() => toggleFavorite(p.id)}
                        >
                          {favorites.includes(p.id) ? (
                            <HeartFilled />
                          ) : (
                            <HeartOutlined />
                          )}
                          <span className="ml-1 text-sm">{p.likes || 0}</span>
                        </button>
                      </div>
                    </div>

                    {/* Imagem */}
                    {p.imageUrl && (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    )}
                  </div>
                </Card>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
