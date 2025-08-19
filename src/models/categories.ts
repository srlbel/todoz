import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { table } from "../db/schema";

const _createCategories = createInsertSchema(table.categoriesTable);
const _selectCategories = createSelectSchema(table.categoriesTable);

export const createCategory = t.Omit(_createCategories, [
	"id",
	"createdDate",
	"updatedDate",
]);
export const selectCategories = _selectCategories;

// Modelos para lógica
export type Category = typeof table.categoriesTable.$inferSelect;
export type CreateCategory = typeof table.categoriesTable.$inferInsert;
