import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from '@/lib/actions/properties';
import { toast } from 'sonner';

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProperty,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Propiedad creada correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateProperty(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Propiedad actualizada correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Propiedad eliminada correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
