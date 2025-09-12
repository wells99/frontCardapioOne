// const fetchProducts = async () => {
//   const response = await axios.get(`${API_BASE_URL}/api/products`);
//   return response.data;
// };

const produtosSalvos = sessionStorage.getItem('produtos');

if (produtosSalvos) {
  const meusprodutos = JSON.parse(produtosSalvos);
  console.log("Session Storage:",meusprodutos);
}

const Cardapio = ({ children })=> {
  // const {
  //   data: products,
  //   isLoading,
  //   isError,
  //   error,
  //   isFetching
  // } = useQuery({
  //   queryKey: ['products'],
  //   queryFn: fetchProducts,
  // });



  return (
   <>
   {children}
   </>
  )
};

export default Cardapio;