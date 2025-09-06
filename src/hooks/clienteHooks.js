import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, queryClient } from "../services"

export const useBuscarClientes = () => {
    return useQuery({
        queryKey: ["clients"],
        queryFn: async () => {
            const res = await AXIOS.get("/api/clients");
            return res.data;
        }
    })
}

export const useCriarCliente = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/api/clients", dados);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["clients"]
            });
        }
    })
}

export const useEditarCliente = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.put(`/api/clients/${dados.id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["clients"]
            });
        }
    })
}

export const useDeletarCliente = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/api/clients/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["clients"]
            });
        }
    })
}