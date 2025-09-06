import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, queryClient } from "../services"

export const useBuscarProdutos = () => {
    return useQuery({
        queryKey: ["products"], // Corrigido de "categories" para "products"
        queryFn: async () => {
            const res = await AXIOS.get("/api/products");
            return res.data;
        }
    })
}

export const useCriarProduto = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/api/products", dados);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["products"]
            });
        }
    })
}

export const useEditarProduto = () => {
    return useMutation({
        mutationFn: async (formData) => {
            // Extrai o ID do formData usando o método get()
            const id = formData.get("id"); 
            if (!id) {
                throw new Error("ID do produto é necessário para editar.");
            }
            const res = await AXIOS.put(`/api/products/${id}`, formData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["products"]
            });
        }
    })
}

export const useDeletarProduto = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/api/products/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["products"]
            });
        }
    })
}