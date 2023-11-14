// src/app.ts
import express, { Request, Response, Application } from "express";
import { Pool } from "pg";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// PostgreSQL configuration
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT || "5432", 10),
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with Axios!");
});

app.get("/foods", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM foods");
    const foods = result.rows;
    res.json(foods);
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to add a new food to the "foods" table
app.post("/foods", async (req: Request, res: Response) => {
  console.log(req.body);
  // Check for required fields
  const requiredFields = process.env.FOOD_REQUIRED_FIELDS?.split(" ") || [];
  console.log(requiredFields);

  const missingFields = requiredFields.filter(
    (field: string) => !req.body[field]
  );

  if (missingFields.length > 0) {
    const error = missingFields.join(", ") + " fields are required";
    return res.status(400).json({ error: error });
  }

  console.log(req.body);

  const {
    food_name,
    category_id,
    price,
    calories,
    serving_size,
    serving_units,
  } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO foods (food_name, category_id, price, calories, serving_size, serving_units) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [food_name, category_id, price, calories, serving_size, serving_units]
    );

    const newFood = result.rows[0];
    res.status(201).json(newFood);
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
