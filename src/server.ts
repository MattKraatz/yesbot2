import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import express from "express";
import mustacheExpress from "mustache-express";
import { messages } from "./db/schema.js";
import { sql } from "drizzle-orm";
import bodyParser from "body-parser";

// set up express web server
const app = express();

app.use(express.static("public")); // set up static content and mustache views
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");

// open database
const db = drizzle(new Database(process.env.DATABASE_URL!));

// Main page
app.get("/", async (_request, response) => {
  // Get current count (may return null)
  const dbCount = await db
    .select({ count: sql<number>`cast(count(${messages.id}) as int)` })
    .from(messages)
    .all();

  const count = dbCount?.[0]?.count ?? 0;

  // render HTML response
  response.render("index", { count });
});

app.post<{}, {}, ChatMessage>("/messages", async (request, response) => {
  if (request.body.sender_type === "user") {
    await db
      .insert(messages)
      .values({
        id: request.body.id,
        groupId: request.body.group_id,
        userId: request.body.user_id,
        content: request.body.text,
        hasAttachment: request.body.attachments.length > 0,
        createdAt: request.body.created_at,
      })
      .execute();
  }
  response.sendStatus(200);
});

// startup
(async () => {
  // Run migrations
  await migrate(db, { migrationsFolder: "./src/db/migrations" });

  // Start web server on port 3000
  app.listen(3000, () => {
    console.log("Server is listening on port 3000");
  });
})();
