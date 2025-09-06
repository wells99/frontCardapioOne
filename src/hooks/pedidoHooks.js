import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, queryClient } from "../services"

export const useBuscarPedidos = () => {
    return useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const res = await AXIOS.get("/api/orders");
            return res.data;
        }
    })
}

export const useCriarPedido = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/api/orders", dados);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["orders"]
            });
        }
    })
}

export const useEditarPedido = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.put(`/api/orders/${dados.id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["orders"]
            });
        }
    })
}

export const useDeletarPedido = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/api/orders/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["orders"]
            });
        }
    })
}