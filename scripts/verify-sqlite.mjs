import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const dbDir = path.join(process.cwd(), "data");
const dbPath = path.join(dbDir, "semolis.sqlite");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new DatabaseSync(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    price_per_day INTEGER NOT NULL,
    min_days INTEGER DEFAULT 3,
    total_stock INTEGER NOT NULL,
    image_url TEXT,
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT UNIQUE NOT NULL,
    product_id INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    total_days INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    pickup_location TEXT,
    payment_method TEXT DEFAULT 'MANUAL_BCA',
    status TEXT DEFAULT 'PENDING_MANUAL_TRANSFER',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

const count = db.prepare("SELECT COUNT(*) as c FROM products").get().c;
if (count === 0) {
  const ins = db.prepare(`
    INSERT INTO products (name, slug, price_per_day, min_days, total_stock, image_url, is_active)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `);
  ins.run("Volta 401", "volta-401", 60000, 3, 6, "/images/volta-401.svg");
  ins.run("Volta Eagle", "volta-eagle", 65000, 3, 5, "/images/volta-eagle.svg");
  ins.run("Volta Mandala", "volta-mandala", 70000, 3, 4, "/images/volta-mandala.svg");
}

const products = db.prepare("SELECT * FROM products ORDER BY price_per_day ASC").all();
console.log("Verified SQLite Products:", JSON.stringify(products, null, 2));

