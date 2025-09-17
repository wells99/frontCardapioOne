import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import logo from "../assets/zelogo.png";
import { RestOutlined, SearchOutlined } from "@ant-design/icons"
import DropdownList from '../components/DropdownList';

const API_BASE_URL = 'https://endcardapio.onrender.com';

const fetchProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/products`);
  return response.data;
};

const Cardapio = () => {
  const produtosSalvos = sessionStorage.getItem('produtos');
  const produtosParse = produtosSalvos ? JSON.parse(produtosSalvos) : null;

  const {
    data: fetchedProducts,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // if (!products) {
  //   return (
  //     <div className="flex justify-center items-center h-screen bg-gray-900">
  //       <div className="text-xl font-semibold text-white">Carregando cardápio...</div>
  //     </div>
  //   );
  // }

  // Erro
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-xl font-semibold text-red-500">
          Erro ao carregar o cardápio: {error.message}
        </div>
      </div>
    );
  }

  if (!products) {
    return null;
  }

  const categories = [...new Set(products.map(product => product.category.name))];


  const handleCategoriaClick = (e) => {
    console.log("Categoria escolhida:", e.key);
  };

  const categoriasss = categories.map(categoriaRenderizada => ({label:categoriaRenderizada, key:categoriaRenderizada}));

  return (
    <div className="bg-black min-h-screen flex flex-col gap-4">
      {isFetching && (
        <div className="fixed top-4 right-4  text-white px-4 py-2 rounded-lg text-sm">
          Atualizando...
        </div>
      )}

      <div className="w-full bg-black flex items-center justify-center text-center sm:text-center  sm:pl-0">
        {/* <h1 className="text-4xl font-extrabold text-white">
          Cardápio
        </h1> */}
        <img src={logo} alt="logo" className='w-50' />

      </div>
      <div className='bg-white h-40 w-full rounded-xl mt-[-20px] flex flex-col items-center justify-start 
      md:items-start md:justify-center md:pl-20 lg:h-60'>
        <div id='circlePhoto' className='bg-blue-500 rounded-full w-20 h-20 mt-[-40px] hidden lg:block'></div>
        <h1 className='font-bold text-xl'>Zé mexicano</h1>
        <div className='flex flex-col items-center justify-center text-center md:items-start'>
          <h3>Fortaleza - CE</h3>
          <h2 className='font-bold text-green-700'>Aberto até às 00h00</h2>
        </div>
      </div>

      <div className='flex items-center justify-between gap-4 px-4'>
        <DropdownList lista={categoriasss} onClick={handleCategoriaClick} />

        <div className='w-10 h-10 bg-white rounded-xl flex items-center justify-center text-center '>
          <SearchOutlined className='py-2' />
        </div>
      </div>

      <div className='px-2 min-h-screen bg-neutral-300 '>
        {categories.map(category => (
          <div key={category} className="mb-10">
            <h2 className="text-3xl text-left font-bold text-black mb-6 mt-10 uppercase tracking-wide border-b-2 border-green-500 pb-2">
              {category}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products
                .filter(product => product.category.name === category)
                .map(product => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg flex  flex-row items-center p-3 gap-3 overflow-hidden border shadow-2xl border-neutral-100"
                  >
                    {/* Texto — ocupa o espaço restante */}
                    <div className="flex-1 pr-3">
                      <h2 className="font-bold">{product.name}</h2>
                      <h3 className="text-neutral-600 line-clamp-3">{product.description}</h3>
                      <h4 className="font-semibold text-neutral-600">
                        R$ {product.price.toFixed(2)}
                      </h4>
                    </div>

                    {/* Imagem — fica à direita em md+ (porque o card vira row) */}
                    <div className="w-36 h-28 flex-shrink-0">
                    {product.imageUrl.includes('http') ? (
                        <img
                          alt={product.name}
                          src={product.imageUrl}
                          className="w-full h-full object-cover rounded-lg"
                        />
                    ) :
                    (
                        <RestOutlined
                          className="rounded-lg bg-green-700 p-10 ml-4 sm:ml-8"
                        />
                    ) 
                    }
                      </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Cardapio;
