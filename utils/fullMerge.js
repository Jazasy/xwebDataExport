const fs = require("fs");
const path = require("path");

const CHUNK_SIZE = 10;
const folderPath = __dirname;

// Fájlok listázása és rendezése timestamp alapján
const allFiles = fs.readdirSync(folderPath)
  .filter(f => f.endsWith(".json") && !f.startsWith("merged"))
  .sort((a, b) => {
    const getTimestamp = name => parseInt(name.split("-")[0].replace("from", ""));
    return getTimestamp(a) - getTimestamp(b);
  });

// ⬇️ Egy fájl adatait betölti
function load(file) {
  const content = fs.readFileSync(path.join(folderPath, file), "utf-8");
  return JSON.parse(content);
}

// ⬇️ Merge két adatstruktúrát (mint eddig)
function mergeTwo(a, b) {
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a[i].points.length; j++) {
      const values = [...a[i].points[j].value, ...b[i].points[j].value];
      const unique = new Map(values.map(v => [v.timestamp, v]));
      a[i].points[j].value = Array.from(unique.values()).sort((x, y) => x.timestamp - y.timestamp);
    }
  }
  return a;
}

// ⬇️ Tetszőleges fájllistát összefűz (10-esével vagy végső merge-nél)
function mergeFileGroup(fileGroup) {
  let merged = load(fileGroup[0]);
  for (let i = 1; i < fileGroup.length; i++) {
    const next = load(fileGroup[i]);
    merged = mergeTwo(merged, next);
  }
  return merged;
}

// 1️⃣ Első lépés: 10-esével feldolgozás
const chunkCount = Math.ceil(allFiles.length / CHUNK_SIZE);
const partFiles = [];

for (let i = 0; i < chunkCount; i++) {
  const chunk = allFiles.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
  const merged = mergeFileGroup(chunk);
  const partName = `merged-part-${String(i + 1).padStart(2, "0")}.json`;
  fs.writeFileSync(path.join(folderPath, partName), JSON.stringify(merged, null, 2), "utf-8");
  partFiles.push(partName);
  console.log(`✅ Részfájl mentve: ${partName}`);
}

// 2️⃣ Második lépés: részeredmények végső összevonása
const finalMerged = mergeFileGroup(partFiles);
fs.writeFileSync(path.join(folderPath, "final-merged.json"), JSON.stringify(finalMerged, null, 2), "utf-8");

console.log(`🎉 Kész! Összes fájl merge-elve ide: final-merged.json`);
