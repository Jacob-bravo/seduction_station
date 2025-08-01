import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { FetchModels, getInfiniteModelResults,FetchConversations} from "./api";

export const useGetModels = () => {
    const queryClient = useQueryClient();

    return useInfiniteQuery({
        queryKey: ['GET_INFINITE_MODELS',],
        queryFn: ({ pageParam = 1 }) => FetchModels(),
        getNextPageParam: (lastPage) => {
            if (lastPage && lastPage.currentPage < lastPage.totalPages) {
                return lastPage.currentPage + 1;
            }
            return null;
        },
        select: (data) => {
            const allModels = data?.pages.flatMap((page) => page.Models) || [];
            const reversedModels = allModels.slice().reverse();
            return reversedModels;
        },
        queryClient,
    });
};
export const useGetExploreModelResults = (keyword) => {
    const queryClient = useQueryClient();

    return useInfiniteQuery({
        queryKey: ['GET_EXPLORE_RESULTS', keyword],
        queryFn: ({ pageParam = 1 }) => getInfiniteModelResults(pageParam, keyword),
        getNextPageParam: (lastPage) => {
            if (lastPage && lastPage.currentPage < lastPage.totalPages) {
                return lastPage.currentPage + 1;
            }
            return null;
        },
        enabled: !!keyword,
        select: (data) => {
            const allModels = data?.pages.flatMap((page) => page.Models
            ) || [];
            return allModels;
        },
        queryClient,
    });

};
export const useGetConversations = () => {
    const queryClient = useQueryClient();

    return useInfiniteQuery({
        queryKey: ['GET_INFINITE_CONVERSATIONS',],
        queryFn: ({ pageParam = 1 }) => FetchConversations(),
        getNextPageParam: (lastPage) => {
            if (lastPage && lastPage.currentPage < lastPage.totalPages) {
                return lastPage.currentPage + 1;
            }
            return null;
        },
        select: (data) => {
            const Conversations = data?.pages.flatMap((page) => page.Conversations) || [];
            const reversedConversations = Conversations.slice().reverse();
            return reversedConversations;
        },
        queryClient,
    });
};