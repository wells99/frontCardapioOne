import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, queryClient } from "../services"

export const useBuscarEmpresas = () => {
    return useQuery({
        queryKey: ["company"],
        queryFn: async () => {
            const res = await AXIOS.get("/api/company");
            return res.data;
        }
    })
}

export const useCriarEmpresa = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.post("/api/company", dados);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["company"]
            });
        }
    })
}

export const useEditarEmpresa = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const res = await AXIOS.put(`/api/company/${dados.id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["company"]
            });
        }
    })
}

export const useDeletarEmpresa = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/api/company/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["company"]
            });
        }
    })
}