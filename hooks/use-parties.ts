import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getParties, createParty, updateParty, deleteParty } from '@/lib/actions/parties';
import { toast } from 'sonner';

export function useParties() {
  return useQuery({
    queryKey: ['parties'],
    queryFn: getParties,
  });
}

export function useCreateParty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createParty,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['parties'] });
      toast.success('Tercero creado correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateParty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateParty(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['parties'] });
      toast.success('Tercero actualizado correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteParty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteParty,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['parties'] });
      toast.success('Tercero eliminado correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
