import { useEffect, useState } from "react";

/* ───────────────────────────────────────────────
   Google Sheets → portfolio data
─────────────────────────────────────────────── */

export const driveImage = (id, size = 800) =>
  `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;

export const drivePreview = (id) => `https://drive.google.com/file/d/${id}/preview`;

export const extractDriveId = (value) => {
  if (!value) return "";
  const trimmed = value.trim();
  return (
    trimmed.match(/\/d\/([a-zA-Z0-9_-]{10,})/)?.pop() ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]{10,})/)?.pop() ||
    trimmed
  );
};

/** RFC-4180-ish CSV parser: handles quoted fields, escaped quotes, CRLF. */
export const parseSheetCsv = (text) => {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') inQuotes = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && next === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((c) => c.trim())) rows.push(row);
      row = [];
    } else field += char;
  }

  if (field || row.length) {
    row.push(field);
    if (row.some((c) => c.trim())) rows.push(row);
  }
  return rows;
};

/** Turn rows into keyed objects using the header row. */
const toEntries = (csvText) => {
  const rows = parseSheetCsv(csvText);
  if (rows.length < 2) return [];
  const header = rows[0].map((c) => c.trim().toLowerCase());
  return rows.slice(1).map((cells) => {
    const entry = {};
    header.forEach((k, i) => (entry[k] = (cells[i] || "").trim()));
    return entry;
  });
};

/**
 * Category shown on the filter chips.
 * Prefers an explicit `category` column; otherwise derives it from the title,
 * which already encodes it ("Pet 1" → Pet, "Product 6" → Product).
 */
const deriveCategory = (explicit, title, type) => {
  if (explicit) return explicit;
  const stripped = (title || "").replace(/[\s_·-]*\d+\s*$/, "").trim();
  return stripped || type || "Reel";
};

/**
 * Video portfolio.
 * Required sheet columns: type, title, link
 * Optional (render automatically once you add them):
 *   category, client, metric, result, hook, platform
 */
export const buildVideoPortfolio = (csvText) =>
  toEntries(csvText)
    .filter((e) => e.link || e.driveid || e.id)
    .map((e, i) => {
      const title = e.title || `Video ${i + 1}`;
      return {
        id: extractDriveId(e.link || e.driveid || e.id),
        type: e.type || "Reel",
        category: deriveCategory(e.category, title, e.type),
        title,
        client: e.client || "",
        metric: e.metric || "",
        result: e.result || "",
        hook: e.hook || "",
        platform: e.platform || "",
      };
    })
    .filter((e) => e.id);

/**
 * Image portfolio.
 * Columns: stage, title, link, prompt, context
 */
export const buildImagePortfolio = (csvText) =>
  toEntries(csvText)
    .filter((e) => e.link || e.driveid || e.id)
    .map((e, i) => ({
      id: extractDriveId(e.link || e.driveid || e.id),
      stage: e.stage || "Concept",
      title: e.title || `Image ${i + 1}`,
      prompt: e.prompt || "",
      context: e.context || "",
    }))
    .filter((e) => e.id);

/**
 * Fetch + parse a published sheet.
 * Exposes status so the UI can show a skeleton and an honest error state
 * instead of silently rendering an empty portfolio.
 */
export const useGoogleSheet = (url, parser) => {
  /* Derived at render rather than via setState inside the effect, which would
     cause a cascading re-render on mount. */
  const usable = Boolean(url) && !url.includes("PASTE_");
  const [state, setState] = useState(() => ({ data: [], status: usable ? "loading" : "error" }));

  useEffect(() => {
    if (!usable) return undefined;
    let cancelled = false;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Sheet responded ${res.status}`);
        return res.text();
      })
      .then((csv) => {
        if (cancelled) return;
        const data = parser(csv);
        setState({ data, status: data.length ? "ready" : "empty" });
      })
      .catch((err) => {
        console.error("Sheet load failed:", err);
        if (!cancelled) setState({ data: [], status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [url, parser, usable]);

  return state;
};
