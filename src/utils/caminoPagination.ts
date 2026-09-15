export interface CaminoPage {
  page: number;
  label: string;
  markdown: string;
}

function findDayNumber(section: string): number | null {
  const match = section.match(/<a id="day-(\d+)"><\/a>/);

  return match ? Number(match[1]) : null;
}

export function getCaminoPageForDay(day: string): number {
  if (/^F\d+$/i.test(day)) {
    return 5;
  }

  const dayNumber = Number(day);

  if (Number.isNaN(dayNumber)) {
    return 1;
  }

  if (dayNumber >= 31) {
    return 4;
  }

  if (dayNumber >= 21) {
    return 3;
  }

  if (dayNumber >= 11) {
    return 2;
  }

  return 1;
}

export function getCaminoPages(markdown: string): CaminoPage[] {
  /*
   * Separate the Camino Francés and
   * Finisterre/Muxía sections first.
   */
  const section3Index = markdown.search(/^## SECTION 3\b/m);

  const caminoFrancesMarkdown =
    section3Index >= 0 ? markdown.slice(0, section3Index) : markdown;

  const finisterreMarkdown =
    section3Index >= 0 ? markdown.slice(section3Index) : "";

  /*
   * Get the SECTION 2 heading/introduction.
   */
  const section2Match = caminoFrancesMarkdown.match(
    /## SECTION 2\b[\s\S]*?(?=<a id="day-0"><\/a>)/
  );

  const section2Intro = section2Match?.[0] ?? "";

  /*
   * Split Camino Francés into individual days.
   */
  const normalDays = caminoFrancesMarkdown
    .split(/(?=<a id="day-\d+"><\/a>)/)
    .filter(section => findDayNumber(section) !== null);

  const getNormalDays = (start: number, end: number) =>
    normalDays
      .filter(section => {
        const day = findDayNumber(section);

        return day !== null && day >= start && day <= end;
      })
      .join("\n\n");

  /*
   * Section 3 already contains its heading,
   * introduction and all F1–F7 content,
   * so keep it together as Page 5.
   */
  return [
    {
      page: 1,
      label: "Days 0–10",
      markdown: section2Intro + getNormalDays(0, 10),
    },
    {
      page: 2,
      label: "Days 11–20",
      markdown: getNormalDays(11, 20),
    },
    {
      page: 3,
      label: "Days 21–30",
      markdown: getNormalDays(21, 30),
    },
    {
      page: 4,
      label: "Days 31–36",
      markdown: getNormalDays(31, 36),
    },
    {
      page: 5,
      label: "Finisterre & Muxía",
      markdown: finisterreMarkdown.trim(),
    },
  ];
}
