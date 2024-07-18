// create insurance use case

import  { InsuranceTypes } from "@/db/schema/insurance";

import { CreateInsurance, DeleteInsurance, getInsuranceById, UpdateInsurance } from "@/data-access/insurance";

export const CreateInsuranceUseCase = async (patientId: string, insuranceData: InsuranceTypes) => {
  const insurance = await CreateInsurance(patientId,insuranceData );
  return insurance;

    }
       

    // update insurance use case

    export const UpdateInsuranceUseCase = async (insuranceId: string, insuranceData: InsuranceTypes) => {   
      const insurance = await UpdateInsurance(insuranceId,insuranceData );
      return insurance;
    }
    

    // delete insurance use case

    export const DeleteInsuranceUseCase = async (insuranceId: string) => {
      await DeleteInsurance(insuranceId);
    }

    // get insurance use case

    export const GetInsuranceUseCase = async (insuranceId: string) => {
      const insurance = await getInsuranceById(insuranceId);
      return insurance;
    }