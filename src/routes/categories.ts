import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { db } from "../db";
import { table } from "../db/schema";
import type { CreateCategory } from "../models/categories";
import { createCategory } from "../models/categories";

export const categoriesRoute = new Elysia({
	prefix: "/categories",
	tags: ["Categories"],
})
	.get(
		"/",
		async () => {
			return await db.select().from(table.categoriesTable);
		},
		{
			detail: {
				summary: "Get all categories",
			},
		},
	)
	.get(
		"/:id",
		async ({ params, set }) => {
			const task = await db
				.select()
				.from(table.categoriesTable)
				.where(eq(table.categoriesTable.id, params.id))
				.get();

			if (!task) {
				set.status = 404;
				return { message: "Category not found" };
			}

			return task;
		},
		{
			params: t.Object({
				id: t.Numeric(),
			}),
			detail: {
				summary: "Get a single category",
			},
		},
	)
	.get(
		"/:id/tasks",
		async ({ params, set }) => {
			const categoryExists = await db
				.select()
				.from(table.categoriesTable)
				.where(eq(table.categoriesTable.id, params.id))
				.get();

			if (!categoryExists) {
				set.status = 404;
				return { message: "Category not found." };
			}

			const tasks = await db
				.select()
				.from(table.tasksTable)
				.where(eq(table.categoriesTable, params.id));

			return tasks;
		},
		{
			params: t.Object({
				id: t.Numeric(),
			}),
			detail: {
				summary: "Get all tasks within a category",
			},
		},
	)
	.post(
		"/",
		async ({ body, set }) => {
			const newCategory: CreateCategory = {
				...body,
			};

			const result = await db
				.insert(table.categoriesTable)
				.values(newCategory)
				.returning();
			set.status = 201;
			return result;
		},
		{
			body: createCategory,
			detail: {
				summary: "Create a single category",
			},
		},
	)
	.put(
		"/:id",
		async ({ params, body, set }) => {
			const updatedCategory = {
				...body,
			};

			const result = await db
				.update(table.categoriesTable)
				.set(updatedCategory)
				.where(eq(table.categoriesTable.id, params.id))
				.returning()
				.get();

			if (!result) {
				set.status = 404;
				return { message: "Category not found" };
			}

			return result;
		},
		{
			params: t.Object({
				id: t.Numeric(),
			}),
			body: createCategory,
			detail: {
				summary: "Update a single category",
			},
		},
	)
	.delete(
		"/:id",
		async ({ params, set }) => {
			const result = await db
				.delete(table.categoriesTable)
				.where(eq(table.categoriesTable.id, params.id))
				.returning()
				.get();

			if (!result) {
				set.status = 404;
				return { message: "Categories not found" };
			}

			set.status = 204;
			return;
		},
		{
			params: t.Object({
				id: t.Numeric(),
			}),
			detail: {
				summary: "Delete a single category",
			},
		},
	);
