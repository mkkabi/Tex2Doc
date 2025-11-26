function extractFullFraction(text, startIndex) {
  if (startIndex >= text.length - 5) return null;
  
  // Check if we have \frac at the start position
  if (text.substring(startIndex, startIndex + 5) !== '\\frac') {
    return null;
  }
  
  let position = startIndex + 5; // Skip past \frac
  let braceCount = 0;
  let currentPart = '';
  let parts = [];
  let inPart = false;
  
  // We need to extract two parts: numerator and denominator
  while (position < text.length && parts.length < 2) {
    const char = text.charAt(position);
    
    if (char === '{') {
      if (braceCount === 0) {
        inPart = true;
        currentPart = '';
      } else {
        currentPart += char;
      }
      braceCount++;
    } else if (char === '}') {
      braceCount--;
      if (braceCount === 0) {
        inPart = false;
        parts.push(currentPart);
        currentPart = '';
      } else if (braceCount > 0) {
        currentPart += char;
      }
    } else if (inPart) {
      currentPart += char;
    }
    
    position++;
    
    // If we encounter invalid brace matching, break
    if (braceCount < 0) {
      return null;
    }
  }
  
  // If we didn't get exactly 2 parts, it's not a valid fraction
  if (parts.length !== 2 || braceCount !== 0) {
    return null;
  }
  
  const fullMatch = text.substring(startIndex, position);
  const latexCode = `\\frac{${parts[0]}}{${parts[1]}}`;
  
  return {
    fullMatch: fullMatch,
    latexCode: latexCode,
    numerator: parts[0],
    denominator: parts[1]
  };
}

// Alternative simpler function that works more reliably
function replaceLatexFractionsSimple(paragraph, body) {
  console.log("start replaceLatexFractionsSimple");
  // const doc = DocumentApp.getActiveDocument();
  // const body = doc.getBody();
  // const text = body.getText();
  const paragraphText = paragraph.editAsText();
  
  // Find all \frac occurrences
  
  let searchResult = paragraph.findText('\\\\frac');
  const matches = [];
  
  // Collect all matches first
  while (searchResult) {
    const element = searchResult.getElement();
    const startOffset = searchResult.getStartOffset();
    console.log("startOffset = "+startOffset);
    if (element.getType() === DocumentApp.ElementType.TEXT) {
      const textElement = element.asText();
      const elementText = textElement.getText();
      const paragraph2 = textElement.getParent();
      const index = paragraph2.getChildIndex(textElement);
      console.log("textElement index = "+index);
      const fractionData = extractFullFraction(elementText, startOffset);
      if (fractionData) {
        matches.push({
          element: textElement,
          startOffset: startOffset,
          fractionData: fractionData,
          index: index
        });
      }
    }
    
    searchResult = paragraph.findText('\\\\frac', searchResult);
  }
  
  // Process matches in reverse order (to maintain positions)
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const { element, startOffset, fractionData, index } = match;
    const { fullMatch, latexCode } = fractionData;
    console.log("element = "+element+" startOffset = "+startOffset+" fractionData = "+fractionData);
    console.log("fullMatch = "+fullMatch+" latexCode = "+latexCode);
    
    try {
      // Generate image
      latexWithSlashesEscaped = escapeSlashes(latexCode);
      console.log("latexWithSlashesEscaped = "+latexWithSlashesEscaped);
      // const encodedLatex = encodeURIComponent(latexWithSlashesEscaped);
      console.log("latexWithSlashesEscaped = "+ latexWithSlashesEscaped);
      // const imageUrl = `https://latex.codecogs.com/png.latex?\\dpi{150}\\bg_white ${encodedLatex}`;
      // const response = UrlFetchApp.fetch(imageUrl, { muteHttpExceptions: true });
      const blob = getLatexasImage(latexCode);
      if (blob) {
        const endOffset = startOffset + fullMatch.length;
        const parentParagraph = element.getParent();
        
        if (parentParagraph.getType() === DocumentApp.ElementType.PARAGRAPH) {
          // Delete the LaTeX text and Insert inline image at the correct position
          const image = parentParagraph.insertInlineImage(index, blob);
           // Append the image
          setImageDimentions(image);
          element.deleteText(startOffset, endOffset - 1);
        } else {
          // Fallback: append to body
          element.deleteText(startOffset, endOffset - 1);
          const image = body.appendImage(blob);
          setImageDimentions(image);
        }
        
      }
    } catch (error) {
      console.error('Error processing: ${latexWithSlashesEscaped}', error);
    }
  }
  console.log("END replaceLatexFractionsSimple");
}

