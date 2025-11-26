// function convertSubscriptsAndSuperscripts3_evenbetter2(paragraph) {
//   if (!paragraph) return;
  
//   try {
//     var text = paragraph.getText();
//     var textElement = paragraph.editAsText();
//     var matches = [];
//     // Find all subscript/superscript patterns
//     var regex = /([^_^]*)([_^])(\{([^}]+)\}|([^_\s\^{]))/g;
//     var match;
    
//     while ((match = regex.exec(text)) !== null) {
//       var content = match[4] || match[5] || '';
//       matches.push({
//         index: match.index,
//         baseLength: (match[1] || '').length,
//         fullLength: match[0].length,
//         content: content,
//         isSuperscript: match[2] === '^'
//       });
      
//     }
    
//     // Process from last to first
//     for (var i = matches.length - 1; i >= 0; i--) {
//       var m = matches[i];
//       var contentStart = m.index + m.baseLength;
//       var contentEnd = contentStart + (m.fullLength - m.baseLength) - 1;
//       textElement.deleteText(contentStart, contentEnd);
//       textElement.insertText(contentStart, m.content);
      
//       var newEnd = contentStart + m.content.length - 1;
//       textElement.setTextAlignment(contentStart, newEnd, 
//         m.isSuperscript ? DocumentApp.TextAlignment.SUPERSCRIPT 
//                         : DocumentApp.TextAlignment.SUBSCRIPT);
                              
//     }
//   } catch (e) {
//     Logger.log("Error in convertSubscriptsAndSuperscripts3: " + e.toString());
//   }
// }

function convertSubscriptsAndSuperscripts(paragraph) {
  
  try {
    var text = paragraph.getText();
    var textElement = paragraph.editAsText();
    var matches = [];
    // Find all subscript/superscript patterns
    var regex = /([^_^]*)([_^])(\{([^}]+)\}|([^_\s\^{]))/g;
    var match;
    
    while ((match = regex.exec(text)) !== null) {
      var content = match[4] || match[5] || '';
      matches.push({
        index: match.index,
        baseLength: (match[1] || '').length,
        fullLength: match[0].length,
        content: content,
        isSuperscript: match[2] === '^'
      });
    }
    
    // const sizes = getParagraphEffectiveFontSizes(paragraph);
    // const uniformSize = sizes.every(s => s === sizes[0]) ? sizes[0] : null;
    // Logger.log(uniformSize);
    // const baseFontSize = uniformSize;
    // if (baseFontSize !== null) {
    //   Logger.log('Font size of the paragraph: ' + baseFontSize + ' points');
    // } else {
    //   Logger.log('Font size is not consistently set for this paragraph, or it is not explicitly set.');
    // }
  
    // Process from last to first
    for (var i = matches.length - 1; i >= 0; i--) {
      var m = matches[i];
      var contentStart = m.index + m.baseLength;
      var contentEnd = contentStart + (m.fullLength - m.baseLength) - 1;
      
      // Calculate new font size (base + 4)
      var newFontSize = getParagraphEffectiveFontSizes(paragraph)+4;
      
      textElement.deleteText(contentStart, contentEnd);
      textElement.insertText(contentStart, m.content);

           
      var newEnd = contentStart + m.content.length - 1;
      
      // Set the new font size
      textElement.setFontSize(contentStart, newEnd, newFontSize);
      
      // Then set text alignment (subscript/superscript)
      textElement.setTextAlignment(contentStart, newEnd, 
        m.isSuperscript ? DocumentApp.TextAlignment.SUPERSCRIPT 
                        : DocumentApp.TextAlignment.SUBSCRIPT);
    }
  } catch (e) {
    Logger.log("Error in convertSubscriptsAndSuperscripts3: " + e.toString());
  }
}



