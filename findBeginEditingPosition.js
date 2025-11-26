function findBeginEditingPosition(body) {
  const text = body.getText();
  const startText = "start edit";
  const startIndex = text.indexOf(startText);
  
  if (startIndex === -1) {
    return { found: false };
  }
  
  // Find which paragraph contains the start position
  let currentPosition = 0;
  let paragraphIndex = null;
  let characterOffset = 0;
  
  const paragraphs = body.getParagraphs();
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const paragraphText = paragraph.getText();
    const paragraphLength = paragraphText.length;
    
    if (currentPosition <= startIndex && startIndex < currentPosition + paragraphLength) {
      paragraphIndex = i;
      characterOffset = startIndex - currentPosition + startText.length;
      break;
    }
    currentPosition += paragraphLength + 1; // +1 for newline character
  }
  
  if (paragraphIndex === null) {
    return { found: false };
  }
  
  return {
    found: true,
    paragraphIndex: paragraphIndex,
    characterOffset: characterOffset,
    globalPosition: startIndex + startText.length
  };
}
