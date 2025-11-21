import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getRentals,
  getRentalById,
  createRental,
  updateRental,
  deleteRental,
} from '@/lib/actions/rentals';
import { toast } from 'sonner';

export function useRentals() {
  return useQuery({
    queryKey: ['rentals'],
    queryFn: getRentals,
  });
}

export function useRental(rentalId: string) {
  return useQuery({
    queryKey: ['rental', rentalId],
    queryFn: () => getRentalById(rentalId),
    enabled: !!rentalId,
  });
}
export function useCreateRental() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRental,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['rentals'] });
      await queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Alquiler creado correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateRental() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateRental(id, data),
    onSuccess: async (data, variables) => {
      try {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['rentals'] }),
          queryClient.invalidateQueries({
            queryKey: ['rental', variables.id],
          }),
        ]);
      } catch (error) {
        console.error('Error invalidating queries:', error);
      }
      toast.success('Alquiler actualizado correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, propertyId }: { id: string; propertyId: string }) =>
      deleteRental(id, propertyId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['rentals'] });
      await queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Alquiler eliminado correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
