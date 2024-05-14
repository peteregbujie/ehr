import { pgTable, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import UserTable from "./user";

const AdminTable = pgTable("admin", {
 id: uuid("id").primaryKey().defaultRandom(),
 user_id: uuid("user_id")
  .notNull()
  .references(() => UserTable.id, { onDelete: "cascade" }),
});

export const AdminsRelations = relations(AdminTable, ({ one }) => ({
 user: one(UserTable, {
  fields: [AdminTable.user_id],
  references: [UserTable.id],
 }),
}));

export default AdminTable;
