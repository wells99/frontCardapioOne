import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = 'https://endcardapio.onrender.com';

const fetchProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/products`);
  return response.data;
};

const Cardapio = () => {
  const {
    data: products,
    isLoading,
    isError,
    error,
    isFetching
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading && !products) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-xl font-semibold text-white">Carregando cardápio...</div>
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

  if (!products) {
    return null;
  }

  const categories = [...new Set(products.map(product => product.category.name))];

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      {isFetching && (
        <div className="fixed top-4 right-4 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">
          Atualizando...
        </div>
      )}

      <div className="w-full text-center sm:text-center pl-5 sm:pl-0">
        <h1 className="text-4xl font-extrabold text-white">
          Cardápio
        </h1>
      </div>

      {categories.map(category => (
        <div key={category} className="mb-10 ">
          <h2 className="text-3xl text-center font-bold text-white mb-6 mt-10 uppercase tracking-wide border-b-2 border-green-500 pb-2">
            {category}
          </h2>

          <div className='w-full overflow-x-scroll no-scrollbar'>
            <div className="flex overflow-x-hidden py-2 px-4 w-fit lg:grid  lg:grid-cols-4 xl:grid-cols-4 gap-8 ">
              {products
                .filter(product => product.category.name === category)
                .map(product => (
                  <div
                    key={product.id}
                    className="bg-white cursor-pointer max-h-[560px] min-w-[280px] max-w-[480px] rounded-xl shadow-xl overflow-hidden transition-transform transform hover:scale-102"
                  >
                    {product.imageUrl && (
                      <img
                        alt={product.name}
                        src={product.imageUrl}
                        className="w-full h-48 object-cover border-b-neutral-200 border-b-2 "
                      />
                    )}
                    <div className="p-5 flex flex-col justify-around gap-8">
                      <div className='h-20'>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 ">{product.name}</h2>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{product.description}</p>
                      </div>
                      <div className="flex justify-between items-center h-10">
                        <span className="text-3xl font-bold text-green-600">
                          R$ {product.price.toFixed(2)}
                        </span>
                        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                          {product.category.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
      <div>
      </div>
    </div>
  );
};

export default Cardapio;