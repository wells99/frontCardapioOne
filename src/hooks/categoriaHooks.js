import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, queryClient } from "../services"

export const useBuscarCategorias = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await AXIOS.get("/api/categories");
            return res.data;
        }
    })
}

export const useCriarCategoria = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/api/categories", dados);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            });
        }
    })
}

export const useEditarCategoria = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.put(`/api/categories/${dados.id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            });
        }
    })
}

export const useDeletarCategoria = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/api/categories/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            });
        }
    })
}