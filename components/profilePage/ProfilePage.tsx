'use client';
import { useGetUsers } from '@/hooks/use-users';

const ProfilePage = () => {
  const { data: users } = useGetUsers();

  return <div>ProfilePage</div>;
};

export { ProfilePage };
