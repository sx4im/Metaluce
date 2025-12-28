/**
 * Utility to clean raw transcript text by removing extra whitespace
 * and preparing it for AI processing.
 */
export function cleanTranscript(text: string): string {
  if (!text) return "";
  
  return text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join("\n")
    .trim();
}
