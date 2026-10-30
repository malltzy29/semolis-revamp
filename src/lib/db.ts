import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import {
  FLEET_SPECS_BY_SLUG,
  ProductRow,
  ProductWithAvailability,
} from "./fleet-data";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "semolis.sqlite");

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");

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
  `);

  const countRow = db
    .prepare("SELECT COUNT(*) as count FROM products")
    .get() as { count: number };

  if (countRow.count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (name, slug, price_per_day, min_days, total_stock, image_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `);

    insertProduct.run(
      "Volta 401",
      "volta-401",
      60000,
      3,
      6,
      "/images/volta-401.svg"
    );
    insertProduct.run(
      "Volta Eagle",
      "volta-eagle",
      65000,
      3,
      5,
      "/images/volta-eagle.svg"
    );
    insertProduct.run(
      "Volta Mandala",
      "volta-mandala",
      70000,
      3,
      4,
      "/images/volta-mandala.svg"
    );
  }

  dbInstance = db;
  return db;
}

export function getProductsWithAvailability(
  _startDate?: string,
  _endDate?: string
): ProductWithAvailability[] {
  const db = getDb();
  const products = db
    .prepare(
      "SELECT id, name, slug, price_per_day, min_days, total_stock, image_url, is_active FROM products WHERE is_active = 1 ORDER BY price_per_day ASC"
    )
    .all() as unknown as ProductRow[];

  return products.map((product) => {
    const availableStock = Math.max(0, product.total_stock);
    return {
      ...product,
      available_stock: availableStock,
      booked_count: 0,
      is_available: availableStock > 0,
      specs:
        FLEET_SPECS_BY_SLUG[product.slug] ?? FLEET_SPECS_BY_SLUG["volta-401"],
    };
  });
}

export function getProductBySlugWithAvailability(
  slug: string,
  startDate?: string,
  endDate?: string
): ProductWithAvailability | null {
  const all = getProductsWithAvailability(startDate, endDate);
  return all.find((p) => p.slug === slug) ?? null;
}

export function updateProductStock(
  id: number,
  totalStock: number,
  pricePerDay?: number
): ProductRow | null {
  const db = getDb();
  if (typeof pricePerDay === "number" && pricePerDay > 0) {
    db.prepare(
      "UPDATE products SET total_stock = ?, price_per_day = ? WHERE id = ?"
    ).run(totalStock, pricePerDay, id);
  } else {
    db.prepare("UPDATE products SET total_stock = ? WHERE id = ?").run(
      totalStock,
      id
    );
  }

  const row = db
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(id) as ProductRow | undefined;

  return row ? { ...row } : null;
}

export function verifyAdminPin(pin: string): boolean {
  const validPin = process.env.ADMIN_PIN || "semolis2026";
  return pin.trim() === validPin.trim();
}
