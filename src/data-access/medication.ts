import db from "@/db";
import { MedicationTable } from "@/db/schema";
import { insertMedicationSchema } from "@/db/schema/medication";
import { InvalidDataError } from "@/use-cases/errors";


export const createMedication = async (data: unknown) => {
    // Parse the input data against the schema
    const parsedData = insertMedicationSchema.safeParse(data);

    if (!parsedData.success) {
        throw new InvalidDataError();
    }

    // Now parsedData.data should conform to InsertMedicationDataType
    await db.insert(MedicationTable).values(parsedData.data).returning();
}

export const getMedications = async () => {
    const medications = await db.query.MedicationTable.findMany();
    return medications;
}
