function latexToImageMy(paragraph, body){
  try {
    const textElement = paragraph.editAsText();
    const originalText = textElement.getText();
    // const matches = matchLexSegments(originalText);
    const matches = collectMatches(paragraph);
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      const { element, startOffset, lexStr, index } = match;
      const tmpStr = lexStr;
      
      const latexExpr = lexStr.toString().slice(5, -1);
      Logger.log("lexStr = "+lexStr+" latexExpr = "+latexExpr);
      const escapedKey = escapeRegex(lexStr.toString());
      Logger.log("escapedKey = "+escapedKey);

      textElement.replaceText(escapedKey, "");   // replaces as regex
      const blob = getLatexasImage(latexExpr);
      if (blob) {
        const parentParagraph = element.getParent();
        if (parentParagraph.getType() === DocumentApp.ElementType.PARAGRAPH) {
          Logger.log("appending image normally");
          // Delete the LaTeX text and Insert inline image at the correct position
          const image = parentParagraph.insertInlineImage(index, blob);
          // Append the image
          setImageDimentions(image);
        } else {
          Logger.log("Falling back image append");
          // Fallback: append to body
          const image = body.appendImage(blob);
          setImageDimentions(image);
        }
      }
    }
  } catch (e) {
    Logger.log("Error editing paragraph: " + e.toString());
  }
}

function collectMatches(paragraph){
  let searchResult = paragraph.findText('\\\\lex');
  Logger.log("inside the collectMatches method searchResult = " +searchResult);
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
      Logger.log("in collectMatches found "+elementText);
      const lexStr = matchLexSegments(elementText);
      if(lexStr){
        matches.push({
        element: textElement,
        startOffset: startOffset,
        lexStr: lexStr,
        index: index
        });
      }
    }
    searchResult = paragraph.findText('\\\\lex', searchResult);
  }
  return matches;
}

function matchLexSegments(s) {
  const results = [];
  let i = 0;
  while (true) {
    const start = s.indexOf('\\lex{', i);
    if (start === -1) break;
    let j = start + 5; // position after '\lex{'
    let depth = 1;
    while (j < s.length && depth > 0) {
      if (s[j] === '{') depth++;
      else if (s[j] === '}') depth--;
      j++;
    }
    if (depth === 0) {
      results.push(s.slice(start, j)); // includes the closing brace
      i = j;
    } else {
      // unmatched brace — stop or break
      break;
    }
  }
  return results;
}




function matchLexSegments_Original(s) {
  const results = [];
  let i = 0;
  while (true) {
    const start = s.indexOf('\\lex{', i);
    if (start === -1) break;
    let j = start + 5; // position after '\lex{'
    let depth = 1;
    while (j < s.length && depth > 0) {
      if (s[j] === '{') depth++;
      else if (s[j] === '}') depth--;
      j++;
    }
    if (depth === 0) {
      results.push(s.slice(start, j)); // includes the closing brace
      i = j;
    } else {
      // unmatched brace — stop or break
      break;
    }
  }
  return results;
}

function processLexText(paragraph) {
    const originalText = paragraph.editAsText();
    const input = originalText.getText();
    console.log("processing paragraph in processLexText = "+input);
    const lexCodes = [];
    let output = '';
    let i = 0;
    
    while (i < input.length) {
        // Check for \lex{ pattern
        if (input.substr(i, 5) === '\\lex{') {
            i += 5; // Move past '\lex{'
            
            let content = '';
            let braceCount = 1;
            
            // Parse the content, handling nested braces
            while (i < input.length && braceCount > 0) {
                const char = input[i];
                
                if (char === '{') {
                    braceCount++;
                } else if (char === '}') {
                    braceCount--;
                    // Only add to content if it's not the closing brace of our pattern
                    if (braceCount > 0) {
                        content += char;
                    }
                } else {
                    content += char;
                }
                
                i++;
            }
            
            // Store the content and add replacement
            lexCodes.push(content);
            console.log("content = "+content);
            output += 'AAAA';
        } else {
            // Copy regular characters
            output += input[i];
            i++;
        }
    }
    
    // If you want to access the lexCodes outside the function, you could:
    // - Return them along with the processed text
    // - Store them in a global variable
    // - Use a callback function
    
    // For this example, let's return both the processed text and the codes
    return {
        processedText: output,
        lexCodes: lexCodes
    };
}

// Alternative version that stores in a global variable
function processLexTextGlobal(input) {
    // Clear previous lexCodes
    window.lexCode = window.lexCode || [];
    window.lexCode.length = 0;
    
    let output = '';
    let i = 0;
    
    while (i < input.length) {
        if (input.substr(i, 5) === '\\lex{') {
            i += 5;
            
            let content = '';
            let braceCount = 1;
            
            while (i < input.length && braceCount > 0) {
                const char = input[i];
                
                if (char === '{') {
                    braceCount++;
                } else if (char === '}') {
                    braceCount--;
                    if (braceCount > 0) {
                        content += char;
                    }
                } else {
                    content += char;
                }
                
                i++;
            }
            
            window.lexCode.push(content);
            output += 'AAAA';
        } else {
            output += input[i];
            i++;
        }
    }
    
    return output;
}
