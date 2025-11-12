import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET() {
  try {
    // Locate the JSON file inside the root-level "database" folder
    const filePath = path.join(process.cwd(), "database", "flashsale.json");

    // Read file content
    const data = await fs.readFile(filePath, "utf-8");

    // Parse JSON
    const products = JSON.parse(data);

    // Respond with JSON
    return NextResponse.json(products);
  } catch (error) {
    console.error("❌ Error reading products file:", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
