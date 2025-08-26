import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { categoriesRoute } from "./routes/categories";
import { taskRoutes } from "./routes/tasks";

const app = new Elysia()
	.use(cors())
	.use(swagger())
	.use(taskRoutes)
	.use(categoriesRoute)
	.get("/", ({ set }) => {
		set.headers["content-type"] = "text/html";
		return "<a href='/swagger'>api docs</a>";
	})
	.listen(3000);

console.log(
	`🦊 Elysia is running at https://${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
