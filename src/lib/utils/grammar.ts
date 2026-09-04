/** Format names spoken with a vowel sound first (e.g. "MP4" -> "em-pee-four") need "an" instead of "a". */
const VOWEL_SOUND_NAMES = new Set(["MP3", "MP4"]);

export function articleFor(formatName: string): "a" | "an" {
  return VOWEL_SOUND_NAMES.has(formatName.toUpperCase()) ? "an" : "a";
}
