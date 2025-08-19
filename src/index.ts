import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { categoriesRoute } from "./routes/categories";
import { taskRoutes } from "./routes/tasks";

const app = new Elysia()
	.use(swagger())
	.use(taskRoutes)
	.use(categoriesRoute)
	.get("/", () => "Hello Elysia")
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
