import { readFileSync } from "node:fs";
import path from "node:path";

import { prisma } from "@/lib/prisma";

const DATA_DIR = path.join(process.cwd(), "prisma", "data");

// Posições das colunas em cities5000.txt
const CITY = { geonameId: 0, name: 1, countryCode: 8, admin1: 10, population: 14 };

function readRows(file: string): string[][] {
  return readFileSync(path.join(DATA_DIR, file), "utf-8")
    .split("\n")
    .map((line) => line.replace(/\r$/, ""))
    .filter((line) => line !== "" && !line.startsWith("#"))
    .map((line) => line.split("\t"));
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function main() {
  // 1. Países: [0] = código ISO, [4] = nome, [16] = geonameid
  const countryRows = readRows("countryInfo.txt");
  await prisma.country.createMany({
    data: countryRows.map((c) => ({ isoCode: c[0], name: c[4] })),
    skipDuplicates: true,
  });

  // 2. Regiões: ["US.CA", "California", "California", "5332921"]
  const admin1Rows = readRows("admin1CodesASCII.txt");
  const regions = admin1Rows.map((r) => ({
    countryCode: r[0].split(".")[0],
    name: r[1],
    geonameId: Number(r[3]),
  }));
  // Região de reserva (uma por país) para cidades sem divisão administrativa.
  // Usa o geonameid do país, que nunca colide com o de uma região.
  const fallbackRegions = countryRows
    .filter((c) => c[16] !== "")
    .map((c) => ({ countryCode: c[0], name: c[4], geonameId: Number(c[16]) }));

  for (const batch of chunk([...regions, ...fallbackRegions], 1000)) {
    await prisma.region.createMany({ data: batch, skipDuplicates: true });
  }

  // 3. Mapas para ligar cada cidade à sua região
  const dbRegions = await prisma.region.findMany({ select: { id: true, geonameId: true } });
  const regionIdByGeonameId = new Map(dbRegions.map((r) => [r.geonameId, r.id]));
  const geonameIdByAdmin1Code = new Map(admin1Rows.map((r) => [r[0], Number(r[3])]));
  const geonameIdByCountry = new Map(countryRows.map((c) => [c[0], Number(c[16])]));

  const cities = readRows("cities5000.txt").flatMap((c) => {
    const country = c[CITY.countryCode];
    const regionGeonameId =
      geonameIdByAdmin1Code.get(`${country}.${c[CITY.admin1]}`) ?? geonameIdByCountry.get(country);
    const regionId = regionGeonameId ? regionIdByGeonameId.get(regionGeonameId) : undefined;
    if (!regionId) return [];
    return [{
      geonameId: Number(c[CITY.geonameId]),
      name: c[CITY.name],
      population: Number(c[CITY.population]),
      regionId,
    }];
  });

  for (const batch of chunk(cities, 1000)) {
    await prisma.city.createMany({ data: batch, skipDuplicates: true });
  }

  console.log(`Seed concluído: ${countryRows.length} países, ${cities.length} cidades.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());