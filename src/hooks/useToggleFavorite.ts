import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      await new Promise((res) => setTimeout(res, 300)); // fake API
      return name;
    },

    onMutate: async (name) => {
      await queryClient.cancelQueries({ queryKey: ["countries"] });

      const previous = queryClient.getQueryData(["countries"]);

      return { previous };
    },

    onError: (_err, _name, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["countries"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
  });
}
