import { Book } from '../types/bible';

const LEGACY_MAP: Record<string, string> = {
  GEN: 'Kejadian', EXO: 'Keluaran', LEV: 'Imamat', NUM: 'Bilangan', DEU: 'Ulangan',
  JOS: 'Yosua', JOSH: 'Yosua', JDG: 'Hakim-hakim', JUDG: 'Hakim-hakim', RUT: 'Rut', RUTH: 'Rut',
  '1SAM': '1 Samuel', '2SAM': '2 Samuel', '1KGS': '1 Raja-raja', '2KGS': '2 Raja-raja',
  '1CHR': '1 Tawarikh', '2CHR': '2 Tawarikh', EZR: 'Ezra', EZRA: 'Ezra', NEH: 'Nehemia',
  EST: 'Ester', AYB: 'Ayub', JOB: 'Ayub', MZM: 'Mazmur', PSA: 'Mazmur', PS: 'Mazmur',
  AMS: 'Amsal', PROV: 'Amsal', PKH: 'Pengkhotbah', ECC: 'Pengkhotbah', KID: 'Kidung Agung',
  SNG: 'Kidung Agung', SONG: 'Kidung Agung', YES: 'Yesaya', ISA: 'Yesaya', YER: 'Yeremia',
  JER: 'Yeremia', RAT: 'Ratapan', LAM: 'Ratapan', YEH: 'Yehezkiel', EZEK: 'Yehezkiel',
  DAN: 'Daniel', HOS: 'Hosea', YL: 'Yoel', JOEL: 'Yoel', AM: 'Amos', AMOS: 'Amos',
  OB: 'Obaja', OBAD: 'Obaja', YUN: 'Yunus', JON: 'Yunus', MI: 'Mikha', MIC: 'Mikha',
  NAH: 'Nahum', HAB: 'Habakuk', ZEF: 'Zefanya', ZEPH: 'Zefanya', HAG: 'Hagai',
  ZA: 'Zakharia', ZECH: 'Zakharia', MAL: 'Maleakhi', MAT: 'Matius', MATT: 'Matius',
  MRK: 'Markus', MARK: 'Markus', LUK: 'Lukas', LUKE: 'Lukas', YOH: 'Yohanes',
  JOHN: 'Yohanes', KIS: 'Kisah Para Rasul', ACTS: 'Kisah Para Rasul', RM: 'Roma',
  ROM: 'Roma', '1KOR': '1 Korintus', '1COR': '1 Korintus', '2KOR': '2 Korintus',
  '2COR': '2 Korintus', GAL: 'Galatia', EF: 'Efesus', EPH: 'Efesus', FLP: 'Filipi',
  PHIL: 'Filipi', KOL: 'Kolose', COL: 'Kolose', '1TES': '1 Tesalonika', '1THESS': '1 Tesalonika',
  '2TES': '2 Tesalonika', '2THESS': '2 Tesalonika', '1TIM': '1 Timotius', '2TIM': '2 Timotius',
  TIT: 'Titus', TITUS: 'Titus', FLM: 'Filemon', PHILEM: 'Filemon', IBR: 'Ibrani',
  HEB: 'Ibrani', YAK: 'Yakobus', JAS: 'Yakobus', '1PTR': '1 Petrus', '1PET': '1 Petrus',
  '2PTR': '2 Petrus', '2PET': '2 Petrus', '1YOH': '1 Yohanes', '1JOHN': '1 Yohanes',
  '2YOH': '2 Yohanes', '2JOHN': '2 Yohanes', '3YOH': '3 Yohanes', '3JOHN': '3 Yohanes',
  YUD: 'Yudas', JUDE: 'Yudas', WHY: 'Wahyu', REV: 'Wahyu',
  GENESIS: 'Kejadian', EXODUS: 'Keluaran', LEVITICUS: 'Imamat', NUMBERS: 'Bilangan',
  DEUTERONOMY: 'Ulangan', JOSHUA: 'Yosua', JUDGES: 'Hakim-hakim', PSALMS: 'Mazmur',
  PROVERBS: 'Amsal', ECCLESIASTES: 'Pengkhotbah', ISAIAH: 'Yesaya', JEREMIAH: 'Yeremia',
  MATTHEW: 'Matius', REVELATION: 'Wahyu',
};

/**
 * Returns the proper display name (from books.json) for any book input
 * (slug, legacy code, ID, short_name, or previous name)
 */
export function formatBookName(input?: string, booksList: Book[] = []): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (!trimmed) return '';
  const upper = trimmed.toUpperCase();

  // 1. Direct match in LEGACY_MAP
  if (LEGACY_MAP[upper]) {
    return LEGACY_MAP[upper];
  }

  // 2. Search in provided booksList
  if (booksList && booksList.length > 0) {
    const found = booksList.find((b) => {
      if (b.id.toString() === trimmed) return true;
      if (b.slug && b.slug.toLowerCase() === trimmed.toLowerCase()) return true;
      if (b.abbreviation && b.abbreviation.toLowerCase() === trimmed.toLowerCase()) return true;
      if (b.name && b.name.toLowerCase() === trimmed.toLowerCase()) return true;
      return false;
    });
    if (found) {
      return found.name;
    }
  }

  // 3. Fallback for slugs like "1-samuel", "kisah-para-rasul"
  if (trimmed.includes('-')) {
    return trimmed
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  // 4. Fallback: if it's all uppercase and short like "GEN", "EXO", "JHN" not caught above
  if (trimmed.length <= 4 && trimmed === upper) {
    return trimmed.charAt(0) + trimmed.slice(1).toLowerCase();
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
