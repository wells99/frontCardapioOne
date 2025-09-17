import { useMutation, useQuery } from "@tanstack/react-query";
import { AXIOS, queryClient } from "../services";

// Buscar todos os pagamentos
export const useBuscarPagamentos = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await AXIOS.get("/api/payments");
      return res.data;
    }
  });
};

// Criar pagamento
export const useCriarPagamento = () => {
  return useMutation({
    mutationFn: async (dados) => {
      const res = await AXIOS.post("/api/payments", dados);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    }
  });
};

// Editar pagamento
export const useEditarPagamento = () => {
  return useMutation({
    mutationFn: async (dados) => {
      const res = await AXIOS.put(`/api/payments/${dados.id}`, dados);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    }
  });
};

// Deletar pagamento
export const useDeletarPagamento = () => {
  return useMutation({
    mutationFn: async (id) => {
      const res = await AXIOS.delete(`/api/payments/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    }
  });
};
