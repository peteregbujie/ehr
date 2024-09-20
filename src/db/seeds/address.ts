import type { DbType } from "@/db";
import addresses from "@/db/seeds/data/address.json";
import {  AddressTable } from "@/db/schema";



export default async function seed(db: DbType) {
 try {
   await Promise.all(
     addresses.map(async (address) => {
       await db.insert(AddressTable).values({ ...address, zip_code: address.zip.toString() }).returning();
     })
   );
 } catch (error) {
   console.error("Error seeding addresses:", error);
 }
}

