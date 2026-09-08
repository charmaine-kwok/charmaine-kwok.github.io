import fs from "node:fs";
import path from "node:path";

import { calculateDistance, type Coordinate } from "./gpx";

export type CaminoSection = "arrival" | "frances" | "rest" | "finisterre";

export type CaminoStage = {
  id: string;
  day: string;

  route: string;

  from?: string;
  to?: string;

  routeDistance?: number;
  routeCumulative?: number;

  gpxDistance?: number;
  gpxCumulative?: number;

  accommodation?: string;

  section: CaminoSection;

  gpx?: string;
};

type CaminoStageDefinition = {
  id: string;
  day: string;

  route: string;

  from?: string;
  to?: string;

  routeDistance?: number;
  routeCumulative?: number;

  accommodation?: string;

  section: CaminoSection;

  gpx?: string;
};

const stageDefinitions: CaminoStageDefinition[] = [
  {
    id: "day-0",
    day: "0",
    route: "SJPP (arrival)",
    accommodation: "Maison d'hôtes Larraldia",
    section: "arrival",
  },

  {
    id: "day-1",
    day: "1",
    route: "SJPP → Roncesvalles",
    from: "Saint-Jean-Pied-de-Port",
    to: "Roncesvalles",
    routeDistance: 24.2,
    routeCumulative: 24.2,
    accommodation: "Albergue de Peregrinos",
    section: "frances",
    gpx: "/gpx/camino/day-01.gpx",
  },

  {
    id: "day-2",
    day: "2",
    route: "Roncesvalles → Zubiri",
    from: "Roncesvalles",
    to: "Zubiri",
    routeDistance: 21.4,
    routeCumulative: 45.6,
    accommodation: "Albergue Río Arga Ibaia",
    section: "frances",
    gpx: "/gpx/camino/day-02.gpx",
  },

  {
    id: "day-3",
    day: "3",
    route: "Zubiri → Pamplona",
    from: "Zubiri",
    to: "Pamplona",
    routeDistance: 20.4,
    routeCumulative: 66.0,
    accommodation: "Hostel Casa Ibarrola",
    section: "frances",
    gpx: "/gpx/camino/day-03.gpx",
  },

  {
    id: "day-4",
    day: "4",
    route: "Pamplona → Puente la Reina",
    from: "Pamplona",
    to: "Puente la Reina",
    routeDistance: 23.9,
    routeCumulative: 89.9,
    accommodation: "Albergue Estrella Guía",
    section: "frances",
    gpx: "/gpx/camino/day-04.gpx",
  },

  {
    id: "day-5",
    day: "5",
    route: "Puente la Reina → Estella",
    from: "Puente la Reina",
    to: "Estella",
    routeDistance: 21.6,
    routeCumulative: 111.5,
    accommodation: "Ágora Hostel",
    section: "frances",
    gpx: "/gpx/camino/day-05.gpx",
  },

  {
    id: "day-6",
    day: "6",
    route: "Estella → Los Arcos",
    from: "Estella",
    to: "Los Arcos",
    routeDistance: 21.0,
    routeCumulative: 132.5,
    accommodation: "Casa Arqueña",
    section: "frances",
    gpx: "/gpx/camino/day-06.gpx",
  },

  {
    id: "day-7",
    day: "7",
    route: "Los Arcos → Logroño",
    from: "Los Arcos",
    to: "Logroño",
    routeDistance: 28.0,
    routeCumulative: 160.5,
    accommodation: "Albergue San Nicolás",
    section: "frances",
    gpx: "/gpx/camino/day-07.gpx",
  },

  {
    id: "day-8",
    day: "8",
    route: "Logroño → Nájera",
    from: "Logroño",
    to: "Nájera",
    routeDistance: 29.0,
    routeCumulative: 189.5,
    accommodation: "Albergue Puerta de Nájera",
    section: "frances",
    gpx: "/gpx/camino/day-08.gpx",
  },

  {
    id: "day-9",
    day: "9",
    route: "Nájera → Redecilla del Camino",
    from: "Nájera",
    to: "Redecilla del Camino",
    routeDistance: 31.1,
    routeCumulative: 220.6,
    accommodation: "Albergue Essentia",
    section: "frances",
    gpx: "/gpx/camino/day-09.gpx",
  },

  {
    id: "day-10",
    day: "10",
    route: "Redecilla del Camino → Villafranca M.O.",
    from: "Redecilla del Camino",
    to: "Villafranca M.O.",
    routeDistance: 23.5,
    routeCumulative: 244.1,
    accommodation: "Casa Rural La Alpargateria",
    section: "frances",
    gpx: "/gpx/camino/day-10.gpx",
  },

  {
    id: "day-11",
    day: "11",
    route: "Villafranca M.O. → Orbaneja Riopico",
    from: "Villafranca M.O.",
    to: "Orbaneja Riopico",
    routeDistance: 26.3,
    routeCumulative: 270.4,
    accommodation: "Casa Rural Fortaleza",
    section: "frances",
    gpx: "/gpx/camino/day-11.gpx",
  },

  {
    id: "day-12",
    day: "12",
    route: "Orbaneja Riopico → Rabé de las Calzadas",
    from: "Orbaneja Riopico",
    to: "Rabé de las Calzadas",
    routeDistance: 24.2,
    routeCumulative: 294.6,
    accommodation: "Hostal Fuente de Rabé",
    section: "frances",
    gpx: "/gpx/camino/day-12.gpx",
  },

  {
    id: "day-13",
    day: "13",
    route: "Rabé de las Calzadas → Castrojeriz",
    from: "Rabé de las Calzadas",
    to: "Castrojeriz",
    routeDistance: 27.5,
    routeCumulative: 322.1,
    accommodation: "Espacio Interior",
    section: "frances",
    gpx: "/gpx/camino/day-13.gpx",
  },

  {
    id: "day-14",
    day: "14",
    route: "Castrojeriz → Frómista",
    from: "Castrojeriz",
    to: "Frómista",
    routeDistance: 24.7,
    routeCumulative: 346.8,
    accommodation: "Albergue Luz de Frómista",
    section: "frances",
    gpx: "/gpx/camino/day-14.gpx",
  },

  {
    id: "day-15",
    day: "15",
    route: "Frómista → Carrión de los Condes",
    from: "Frómista",
    to: "Carrión de los Condes",
    routeDistance: 18.8,
    routeCumulative: 365.6,
    accommodation: "Hostal Albe",
    section: "frances",
    gpx: "/gpx/camino/day-15.gpx",
  },

  {
    id: "day-16",
    day: "16",
    route: "Carrión de los Condes → Ledigos",
    from: "Carrión de los Condes",
    to: "Ledigos",
    routeDistance: 23.4,
    routeCumulative: 389.0,
    accommodation: "Albergue La Morena",
    section: "frances",
    gpx: "/gpx/camino/day-16.gpx",
  },

  {
    id: "day-17",
    day: "17",
    route: "Ledigos → Calzada del Coto",
    from: "Ledigos",
    to: "Calzada del Coto",
    routeDistance: 21.0,
    routeCumulative: 410.0,
    accommodation: "Albergue San Roque",
    section: "frances",
    gpx: "/gpx/camino/day-17.gpx",
  },

  {
    id: "day-18",
    day: "18",
    route: "Calzada del Coto → Villamarco",
    from: "Calzada del Coto",
    to: "Villamarco",
    routeDistance: 23.4,
    routeCumulative: 433.4,
    accommodation: "Albergue La Vieja Escuela",
    section: "frances",
    gpx: "/gpx/camino/day-18.gpx",
  },

  {
    id: "day-19",
    day: "19",
    route: "Villamarco → Arcahueja",
    from: "Villamarco",
    to: "Arcahueja",
    routeDistance: 23.0,
    routeCumulative: 456.4,
    accommodation: "Hotel Camino Real",
    section: "frances",
    gpx: "/gpx/camino/day-19.gpx",
  },

  {
    id: "day-20",
    day: "20",
    route: "Arcahueja → Oncina",
    from: "Arcahueja",
    to: "Oncina",
    routeDistance: 19.1,
    routeCumulative: 475.5,
    accommodation: "Albergue El Pajar de Oncina",
    section: "frances",
    gpx: "/gpx/camino/day-20.gpx",
  },

  {
    id: "day-21",
    day: "21",
    route: "Oncina → Hospital de Órbigo",
    from: "Oncina",
    to: "Hospital de Órbigo",
    routeDistance: 25.0,
    routeCumulative: 500.5,
    accommodation: "Albergue Hidalgos",
    section: "frances",
    gpx: "/gpx/camino/day-21.gpx",
  },

  {
    id: "day-22",
    day: "22",
    route: "Hospital de Órbigo → Astorga",
    from: "Hospital de Órbigo",
    to: "Astorga",
    routeDistance: 16.5,
    routeCumulative: 517.0,
    accommodation: "Albergue Franciscano",
    section: "frances",
    gpx: "/gpx/camino/day-22.gpx",
  },

  {
    id: "day-23",
    day: "23",
    route: "Astorga → Rabanal del Camino",
    from: "Astorga",
    to: "Rabanal del Camino",
    routeDistance: 20.2,
    routeCumulative: 537.2,
    accommodation: "Refugio Gaucelmo",
    section: "frances",
    gpx: "/gpx/camino/day-23.gpx",
  },

  {
    id: "day-24",
    day: "24",
    route: "Rabanal del Camino → Molinaseca",
    from: "Rabanal del Camino",
    to: "Molinaseca",
    routeDistance: 24.7,
    routeCumulative: 561.9,
    accommodation: "Casa Rural Lua Bierzo",
    section: "frances",
    gpx: "/gpx/camino/day-24.gpx",
  },

  {
    id: "day-25",
    day: "25",
    route: "Molinaseca → Valtuille de Arriba",
    from: "Molinaseca",
    to: "Valtuille de Arriba",
    routeDistance: 26.1,
    routeCumulative: 588.0,
    accommodation: "Acogida La Biznaga",
    section: "frances",
    gpx: "/gpx/camino/day-25.gpx",
  },

  {
    id: "day-26",
    day: "26",
    route: "Valtuille de Arriba → Vega de Valcarce",
    from: "Valtuille de Arriba",
    to: "Vega de Valcarce",
    routeDistance: 21.1,
    routeCumulative: 609.1,
    accommodation: "Pensión Fernández",
    section: "frances",
    gpx: "/gpx/camino/day-26.gpx",
  },

  {
    id: "day-27",
    day: "27",
    route: "Vega de Valcarce → Fonfría",
    from: "Vega de Valcarce",
    to: "Fonfría",
    routeDistance: 23.1,
    routeCumulative: 632.2,
    accommodation: "Casa Rural Núñez",
    section: "frances",
    gpx: "/gpx/camino/day-27.gpx",
  },

  {
    id: "day-28",
    day: "28",
    route: "Fonfría → Samos",
    from: "Fonfría",
    to: "Samos",
    routeDistance: 19.2,
    routeCumulative: 651.4,
    accommodation: "Hospedería Externa del Monasterio",
    section: "frances",
    gpx: "/gpx/camino/day-28.gpx",
  },

  {
    id: "day-29",
    day: "29",
    route: "Samos → Vilei (Barbadelo)",
    from: "Samos",
    to: "Vilei (Barbadelo)",
    routeDistance: 19.0,
    routeCumulative: 670.4,
    accommodation: "Casa Barbadelo",
    section: "frances",
    gpx: "/gpx/camino/day-29.gpx",
  },

  {
    id: "day-30",
    day: "30",
    route: "Vilei → A Pena (Paradela)",
    from: "Vilei",
    to: "A Pena (Paradela)",
    routeDistance: 10.0,
    routeCumulative: 680.4,
    accommodation: "Albergue Km 100 Casa do Rego",
    section: "frances",
    gpx: "/gpx/camino/day-30.gpx",
  },

  {
    id: "day-31",
    day: "31",
    route: "A Pena (Paradela) → Airexe",
    from: "A Pena (Paradela)",
    to: "Airexe",
    routeDistance: 25.3,
    routeCumulative: 705.7,
    accommodation: "Pensión Eirexe",
    section: "frances",
    gpx: "/gpx/camino/day-31.gpx",
  },

  {
    id: "day-32",
    day: "32",
    route: "Airexe → Melide",
    from: "Airexe",
    to: "Melide",
    routeDistance: 22.1,
    routeCumulative: 727.8,
    accommodation: "Albergue O Candil",
    section: "frances",
    gpx: "/gpx/camino/day-32.gpx",
  },

  {
    id: "day-33",
    day: "33",
    route: "Melide → A Calle de Ferreiros",
    from: "Melide",
    to: "A Calle de Ferreiros",
    routeDistance: 22.0,
    routeCumulative: 749.8,
    accommodation: "Albergue A Ponte de Ferreiros",
    section: "frances",
    gpx: "/gpx/camino/day-33.gpx",
  },

  {
    id: "day-34",
    day: "34",
    route: "A Calle de Ferreiros → Lavacolla",
    from: "A Calle de Ferreiros",
    to: "Lavacolla",
    routeDistance: 20.0,
    routeCumulative: 769.8,
    accommodation: "Albergue A Fábrica",
    section: "frances",
    gpx: "/gpx/camino/day-34.gpx",
  },

  {
    id: "day-35",
    day: "35",
    route: "Lavacolla → Santiago de Compostela",
    from: "Lavacolla",
    to: "Santiago de Compostela",
    routeDistance: 9.9,
    routeCumulative: 779.7,
    accommodation: "Albergue Blanco",
    section: "frances",
    gpx: "/gpx/camino/day-35.gpx",
  },

  {
    id: "day-36",
    day: "36",
    route: "Santiago de Compostela (Rest Day)",
    accommodation: "Albergue Blanco",
    section: "rest",
  },

  {
    id: "day-f1",
    day: "F1",
    route: "Santiago de Compostela → Negreira",
    from: "Santiago de Compostela",
    to: "Negreira",
    routeDistance: 20.6,
    routeCumulative: 800.3,
    accommodation: "Albergue Cotón",
    section: "finisterre",
    gpx: "/gpx/camino/f01.gpx",
  },

  {
    id: "day-f2",
    day: "F2",
    route: "Negreira → Vilaserío",
    from: "Negreira",
    to: "Vilaserío",
    routeDistance: 13.0,
    routeCumulative: 813.3,
    accommodation: "Albergue-Pensión O Rueiro",
    section: "finisterre",
    gpx: "/gpx/camino/f02.gpx",
  },

  {
    id: "day-f3",
    day: "F3",
    route: "Vilaserío → Lago",
    from: "Vilaserío",
    to: "Lago",
    routeDistance: 16.0,
    routeCumulative: 829.3,
    accommodation: "Albergue Monte Aro",
    section: "finisterre",
    gpx: "/gpx/camino/f03.gpx",
  },

  {
    id: "day-f4",
    day: "F4",
    route: "Lago → Cee",
    from: "Lago",
    to: "Cee",
    routeDistance: 25.6,
    routeCumulative: 854.9,
    accommodation: "Albergue A Casa da Fonte",
    section: "finisterre",
    gpx: "/gpx/camino/f04.gpx",
  },

  {
    id: "day-f5",
    day: "F5",
    route: "Cee → Fisterra",
    from: "Cee",
    to: "Fisterra",
    routeDistance: 12.9,
    routeCumulative: 867.8,
    accommodation: "Albergue-Pensión Finistellae",
    section: "finisterre",
    gpx: "/gpx/camino/f05.gpx",
  },

  {
    id: "day-f6",
    day: "F6",
    route: "Fisterra → Muxía",
    from: "Fisterra",
    to: "Muxía",
    routeDistance: 27.8,
    routeCumulative: 895.6,
    accommodation: "Albergue Muxía Mare",
    section: "finisterre",
    gpx: "/gpx/camino/f06.gpx",
  },

  {
    id: "day-f7",
    day: "F7",
    route: "Muxía (Rest Day)",
    accommodation: "Albergue Muxía Mare",
    section: "rest",
  },
];

function getGpxFilePath(gpx: string) {
  return path.join(process.cwd(), "public", gpx.replace(/^\//, ""));
}

function loadGpxPointsFromFile(gpxFile: string): Coordinate[] {
  const gpxText = fs.readFileSync(gpxFile, "utf8");

  const points: Coordinate[] = [];

  const trackPointRegex = /<trkpt\b([^>]*)>/g;

  for (const match of gpxText.matchAll(trackPointRegex)) {
    const attributes = match[1];

    const latMatch = attributes.match(/\blat="([^"]+)"/);

    const lonMatch = attributes.match(/\blon="([^"]+)"/);

    if (!latMatch || !lonMatch) {
      continue;
    }

    const lat = Number(latMatch[1]);

    const lon = Number(lonMatch[1]);

    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      points.push([lat, lon]);
    }
  }

  return points;
}

function buildCaminoStages() {
  let rawGpxCumulative = 0;

  const stages: CaminoStage[] = stageDefinitions.map((stage): CaminoStage => {
    if (!stage.gpx) {
      return {
        ...stage,
      };
    }

    const gpxFile = getGpxFilePath(stage.gpx);

    if (!fs.existsSync(gpxFile)) {
      return {
        ...stage,
      };
    }

    const points = loadGpxPointsFromFile(gpxFile);

    const rawGpxDistance = calculateDistance(points);

    rawGpxCumulative += rawGpxDistance;

    return {
      ...stage,

      gpxDistance: Number(rawGpxDistance.toFixed(1)),

      gpxCumulative: Number(rawGpxCumulative.toFixed(1)),
    };
  });

  return {
    stages,
    rawGpxTotal: rawGpxCumulative,
  };
}

export function getCaminoStages(): CaminoStage[] {
  return buildCaminoStages().stages;
}

export function getWalkingStages() {
  return getCaminoStages().filter(
    stage =>
      stage.gpx &&
      stage.from &&
      stage.to &&
      stage.gpxDistance !== undefined &&
      stage.gpxCumulative !== undefined
  );
}

export function getCaminoSummary() {
  const { stages, rawGpxTotal } = buildCaminoStages();

  const walkingStages = stages.filter(stage => stage.gpxDistance !== undefined);

  const totalRouteDistance = walkingStages.reduce(
    (total, stage) => total + (stage.routeDistance ?? 0),
    0
  );

  return {
    totalRouteDistance: Number(totalRouteDistance.toFixed(1)),

    totalGpxDistance: Number(rawGpxTotal.toFixed(1)),

    walkingDays: walkingStages.length,
  };
}
