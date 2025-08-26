import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timestamps = {
	createdDate: int({ mode: "timestamp" }).$defaultFn(() => new Date()),
	updatedDate: int({ mode: "timestamp" })
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
};

export const tasksTable = sqliteTable("tasks_table", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	description: text(),
	priority: text({ enum: ["Low", "Medium", "High"] }).notNull(),
	isCompleted: int({ mode: "boolean" }).notNull().default(false),
	category: int().references(() => categoriesTable.id),
	finishDate: int({ mode: "timestamp" }),
	...timestamps,
});

export const categoriesTable = sqliteTable("categories_table", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	color: text(),
	...timestamps,
});

// Relations

export const taskRelations = relations(tasksTable, ({ one }) => ({
	category: one(categoriesTable, {
		fields: [tasksTable.category],
		references: [categoriesTable.id],
	}),
}));

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
	tasks: many(tasksTable),
}));

export const table = {
	tasksTable,
	categoriesTable,
} as const;

export type Table = typeof table;
