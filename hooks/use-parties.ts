import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getParties,
  createParty,
  updateParty,
  deleteParty,
  getPartyById,
} from '@/lib/actions/parties';
import { toast } from 'sonner';
import { PartyStatus, PartyType } from '@/lib/generated/prisma/client';

export function useParties(status?: PartyStatus | undefined, type?: PartyType | undefined) {
  return useQuery({
    queryKey: ['parties', status, type],
    queryFn: () => getParties(status, type),
  });
}

export function usePartyById(id: string) {
  return useQuery({
    queryKey: ['parties', id],
    queryFn: () => getPartyById(id),
    enabled: !!id,
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
