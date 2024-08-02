import { createProvider, deleteProvider, getAllProviders, updateProvider } from "@/data-access/provider";
import { ProviderTypes } from "@/db/schema/provider";


// getall provider use case
export const getAllProvidersUseCase = async () => {
    return await getAllProviders();
}



// create provider use case
export const createProviderUseCase = async (UserId: string, providerData: ProviderTypes) => {
    return await createProvider(UserId, providerData);
}   


// update provider use case
export const updateProviderUseCase = async (providerId: string, providerData: ProviderTypes) => {
    return await updateProvider(providerId, providerData);
}   

// delete provider use case
export const deleteProviderUseCase = async (providerId: string) => {
    return await deleteProvider(providerId);
}
