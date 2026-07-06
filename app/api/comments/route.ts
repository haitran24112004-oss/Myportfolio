import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function GET() {
  const sql = getSql();
  const rows = await sql`
    SELECT id, name, text, created_at
    FROM comments
    ORDER BY created_at DESC
    LIMIT 200
  `;
  return NextResponse.json({ comments: rows });
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name ?? "").trim().slice(0, 60) || "Anonymous";
  const text = String(body.text ?? "").trim().slice(0, 500);

  if (!text) {
    return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
  }

  const sql = getSql();
  const rows = (await sql`
    INSERT INTO comments (name, text)
    VALUES (${name}, ${text})
    RETURNING id, name, text, created_at
  `) as Array<{ id: string; name: string; text: string; created_at: string }>;
  return NextResponse.json({ comment: rows[0] }, { status: 201 });
}
