
import { useQuery } from '@tanstack/react-query';
import { getAllUsersUseCase } from '@/use-cases/user';

const useAllUsers = () => {
  return useQuery({ queryKey: ['users'], queryFn: getAllUsersUseCase });
 /*  return useQuery('allUsers', getAllUsersUseCase); */
};

export default useAllUsers;