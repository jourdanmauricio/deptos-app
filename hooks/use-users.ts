import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserDetails, getUsers, createUser, deleteUser } from '@/lib/actions/user';
import { User } from '@/shared/types';
import { toast } from 'sonner';

export function useGetUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getUsers,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario creado correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateUserDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateUserDetails(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario modificado correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario eliminado correctamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
