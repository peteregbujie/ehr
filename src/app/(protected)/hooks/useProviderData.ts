import { useQuery } from '@tanstack/react-query';
import { getProviderAppointnmentsandEncounters, getProviderIdByUserId } from '@/data-access/provider';
import { getCurrentUser } from '@/lib/session';




export default function UseProviderData() {
  
  const { data: user } = useQuery({ queryKey: ['currentUser'], queryFn: getCurrentUser });
  if (!user) {
   throw new Error('Current user not found');
 }
 
    const providerId = useQuery({ queryKey: ['providerId'], queryFn: () => getProviderIdByUserId(user.id!) });
    
    if (!providerId.data) {
     throw new Error('Provider ID not found');
   }

   return useQuery({ queryKey: ['providerData'], queryFn: () => getProviderAppointnmentsandEncounters(providerId.data.id) });
  
    
}