import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import logo from "../assets/zelogo.png";
import {SearchOutlined } from "@ant-design/icons"
import DropdownList from '../components/DropdownList';

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

  // if (!products) {
  //   return (
  //     <div className="flex justify-center items-center h-screen bg-gray-900">
  //       <div className="text-xl font-semibold text-white">Carregando cardápio...</div>
  //     </div>
  //   );
  // }

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
      <div className='bg-white h-40 w-full rounded-xl mt-[-20px] flex flex-col items-center justify-start'>
          <div id='circlePhoto' className='bg-blue-500 rounded-full w-20 h-20 mt-[-40px]'></div>
          <h1 className='font-bold text-xl'>Zé mexicano</h1>
          <div className='flex flex-col items-center justify-center text-center'>
            <h3>Fortaleza - CE * Mais informações</h3>
            <h2 className='font-bold text-green-700'>Aberto até às 00h00</h2>
          </div>
      </div>

      <div className='flex items-center justify-between gap-4 px-4'>
          <DropdownList />
     
        <div className='w-10 h-10 bg-white rounded-xl flex items-center justify-center text-center '>
          <SearchOutlined  className='py-2'/>
        </div>
      </div>
  
      <div className='px-6 min-h-screen bg-neutral-300'>
        {categories.map(category => (
          <div key={category} className="mb-10 ">
            <h2 className="text-3xl text-left font-bold text-white mb-6 mt-10 uppercase tracking-wide border-b-2 border-green-500 pb-2">
              {category}
            </h2>

            <div className='w-full overflow-x-scroll no-scrollbar'>
              <div className="flex flex-col overflow-x-hidden py-2 px-2 w-fit lg:grid  lg:grid-cols-4 xl:grid-cols-4 gap-2 ">
                {products
                  .filter(product => product.category.name === category)
                  .map(product => (
                    <div
                      key={product.id}
                      className="bg-white flex flex-row-reverse items-start rounded-xl p-4  cursor-pointer max-h-[560px] min-w-[280px] max-w-[480px] shadow-xl overflow-hidden transition-transform transform hover:scale-102"
                    >
                      {product.imageUrl && (
                        <img
                          alt={product.name}
                          src={product.imageUrl}
                          className="w-20 h-20  rounded-2xl"
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
      </div>

    </div>
  );
};

export default Cardapio;