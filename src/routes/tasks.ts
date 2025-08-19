import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { db } from "../db";
import { table } from "../db/schema";
import type { CreateTask } from "../models/tasks";
import { createTask } from "../models/tasks";

export const taskRoutes = new Elysia({ prefix: "/tasks", tags: ["Tasks"] })
	.get(
		"/",
		async () => {
			return await db.select().from(table.tasksTable);
		},
		{
			detail: {
				summary: "Get all tasks",
			},
		},
	)
	.get(
		"/:id",
		async ({ params, set }) => {
			const task = await db
				.select()
				.from(table.tasksTable)
				.where(eq(table.tasksTable.id, params.id))
				.get();

			if (!task) {
				set.status = 404;
				return { message: "Task not found" };
			}

			return task;
		},
		{
			params: t.Object({
				id: t.Numeric(),
			}),
			detail: {
				summary: "Get a single task",
			},
		},
	)
	.post(
		"/",
		async ({ body, set }) => {
			const newTask: CreateTask = {
				...body,
			};

			const result = await db
				.insert(table.tasksTable)
				.values(newTask)
				.returning();
			set.status = 201;
			return result;
		},
		{
			body: createTask,
			detail: {
				summary: "Create a new task",
			},
		},
	)
	.put(
		"/:id",
		async ({ params, body, set }) => {
			const updatedTask = {
				...body,
			};

			const result = await db
				.update(table.tasksTable)
				.set(updatedTask)
				.where(eq(table.tasksTable.id, params.id))
				.returning()
				.get();

			if (!result) {
				set.status = 404;
				return { message: "Task not found" };
			}

			return result;
		},
		{
			params: t.Object({
				id: t.Numeric(),
			}),
			body: createTask,
			detail: {
				summary: "Update a single task",
			},
		},
	)
	.delete(
		"/:id",
		async ({ params, set }) => {
			const result = await db
				.delete(table.tasksTable)
				.where(eq(table.tasksTable.id, params.id))
				.returning()
				.get();

			if (!result) {
				set.status = 404;
				return { message: "Task not found" };
			}

			set.status = 204;
			return;
		},
		{
			params: t.Object({
				id: t.Numeric(),
			}),
			detail: {
				summary: "Delete a single task",
			},
		},
	);
