// Define an interface for the structure of the data returned by searchPatient
interface PatientWithAppointments {
    appointments: Appointment[];
  }
  
  interface Appointment {
    encounters: Encounter[];
  }
  
  interface Encounter {
    // Define properties of an Encounter here
  }
  
  // Assuming MedicationTypes is already defined elsewhere
  interface MedicationTypes {
    // Define properties of MedicationTypes here
  }



  type SearchPatientResult = {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    primary_care_physician: string;
    preferred_language: string;
    note: string;
    created_at: string;
    updated_at: string;
    appointments: {
      scheduled_date: string;
      encounter: {
        date: string;
      };
    }[];
  };


