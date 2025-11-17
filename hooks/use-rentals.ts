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
export function useCreateRental(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRental,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['rentals'] });
      toast.success('Alquiler creado correctamente');
      // Ejecutar callback si existe (por ejemplo, para navegación)
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateRental(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateRental(id, data),
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['rentals'] });
      await queryClient.invalidateQueries({
        queryKey: ['rental', variables.id],
      });
      toast.success('Alquiler actualizado correctamente');
      // Ejecutar callback si existe (por ejemplo, para navegación)
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRental,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['rentals'] });
      toast.success('Alquiler eliminado correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
