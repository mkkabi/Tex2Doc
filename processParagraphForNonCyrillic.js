function processParagraphForNonCyrillic(paragraph) {
  const text = paragraph.getText();
  let currentIndex = 0;
  
  while (currentIndex < text.length) {
    const char = text.charAt(currentIndex);
    
    if (!isCyrillic(char) && char !== '\n' && char !== '\r' && char !== '\t') {
      // Found non-Cyrillic character, find the entire non-Cyrillic sequence
      const nonCyrillicStart = currentIndex;
      let nonCyrillicEnd = currentIndex;
      
      // Find the end of the non-Cyrillic sequence
      while (nonCyrillicEnd < text.length) {
        const currentChar = text.charAt(nonCyrillicEnd);
        if (isCyrillic(currentChar) || currentChar === '\n' || currentChar === '\r' || currentChar === '\t') {
          break;
        }
        nonCyrillicEnd++;
      }
      
      // Apply formatting to the non-Cyrillic text
      if (nonCyrillicEnd > nonCyrillicStart) {
        const range = paragraph.editAsText();
        range.setFontFamily(nonCyrillicStart, nonCyrillicEnd - 1, 'Cambria Math');
        currentIndex = nonCyrillicEnd;
      } else {
        currentIndex++;
      }
    } else {
      currentIndex++;
    }
  }
}
