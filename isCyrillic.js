function isCyrillic(char) {
  // Get the Unicode code point of the character
  const code = char.charCodeAt(0);
  
  // Cyrillic characters Unicode ranges
  return (code >= 0x0400 && code <= 0x04FF) ||   // Basic Cyrillic
         (code >= 0x0500 && code <= 0x052F) ||   // Cyrillic Supplement
         (code >= 0x2DE0 && code <= 0x2DFF) ||   // Cyrillic Extended-A
         (code >= 0xA640 && code <= 0xA69F) ||   // Cyrillic Extended-B
         (code >= 0x1C80 && code <= 0x1C8F);     // Cyrillic Extended-C
}