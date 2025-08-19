import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { table } from "../db/schema";

const _createTask = createInsertSchema(table.tasksTable);
const _selectTask = createSelectSchema(table.tasksTable);

// Modelos para elysia
export const createTask = t.Omit(_createTask, [
	"id",
	"createdDate",
	"updatedDate",
]);
export const selectTask = _selectTask;

// Modelos para lógica
export type Task = typeof table.tasksTable.$inferSelect;
export type CreateTask = typeof table.tasksTable.$inferInsert;
