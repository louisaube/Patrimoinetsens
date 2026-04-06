/**
 * Export seed data to JSON files for static consumption.
 * Run: npx tsx tools/export-seed-json.ts
 */
import { writeFileSync, mkdirSync } from "fs"
import { seedUsers, DENIS, BERNARD, MARIE, CLAIRE } from "../src/lib/db/seed-users"
import { seedHeritageItems } from "../src/lib/db/seed-items"
import { seedContributions } from "../src/lib/db/seed-contributions"

const OUT = "public/data"
mkdirSync(OUT, { recursive: true })

// Users map for quick lookup
const usersMap: Record<string, { id: string; name: string }> = {}
for (const u of seedUsers) {
  usersMap[u.id] = { id: u.id, name: u.name }
}

// Heritage items with contribution counts
const contribCountByItem: Record<string, number> = {}
for (const c of seedContributions) {
  contribCountByItem[c.heritageItemId] = (contribCountByItem[c.heritageItemId] || 0) + 1
}

const items = seedHeritageItems.map((item) => ({
  id: item.id,
  title: item.title,
  category: item.category,
  status: item.status,
  latitude: item.latitude,
  longitude: item.longitude,
  coverPhotoUrl: item.coverPhotoUrl,
  periodStart: item.periodStart,
  periodEnd: item.periodEnd,
  createdBy: usersMap[item.createdBy] || { id: item.createdBy, name: "Inconnu" },
  contributionCount: contribCountByItem[item.id] || 0,
}))

const contributions = seedContributions.map((c) => ({
  id: c.id,
  heritageItemId: c.heritageItemId,
  type: c.contributionType,
  title: c.title || null,
  body: c.body,
  sources: c.sources || null,
  furtherReading: (c as Record<string, unknown>).furtherReading as string || null,
  period: c.period || null,
  author: usersMap[c.authorId] || { id: c.authorId, name: "Inconnu" },
}))

writeFileSync(`${OUT}/heritage-items.json`, JSON.stringify(items, null, 2), "utf-8")
writeFileSync(`${OUT}/contributions.json`, JSON.stringify(contributions, null, 2), "utf-8")
writeFileSync(`${OUT}/users.json`, JSON.stringify(seedUsers, null, 2), "utf-8")

console.log(`✓ ${items.length} heritage items → ${OUT}/heritage-items.json`)
console.log(`✓ ${contributions.length} contributions → ${OUT}/contributions.json`)
console.log(`✓ ${seedUsers.length} users → ${OUT}/users.json`)
