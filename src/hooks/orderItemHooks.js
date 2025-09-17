import { useMutation, useQuery } from "@tanstack/react-query";
import { AXIOS, queryClient } from "../services";

// Buscar todos os itens de pedidos
export const useBuscarOrderItems = () => {
  return useQuery({
    queryKey: ["orderItems"],
    queryFn: async () => {
      const res = await AXIOS.get("/api/orderitems");
      return res.data;
    },
  });
};

// Criar um novo item de pedido
export const useCriarOrderItem = () => {
  return useMutation({
    mutationFn: async (dados) => {
      const res = await AXIOS.post("/api/orderitems", dados);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orderItems"],
      });
    },
  });
};

// Editar um item de pedido existente
export const useEditarOrderItem = () => {
  return useMutation({
    mutationFn: async (dados) => {
      const res = await AXIOS.put(`/api/orderitems/${dados.id}`, dados);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orderItems"],
      });
    },
  });
};

// Deletar um item de pedido
export const useDeletarOrderItem = () => {
  return useMutation({
    mutationFn: async (id) => {
      const res = await AXIOS.delete(`/api/orderitems/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orderItems"],
      });
    },
  });
};
