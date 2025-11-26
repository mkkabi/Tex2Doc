function formatGothTextByParagraph(paragraph) {
  var text = paragraph.getText();
  // matches either \goth{...} (group 1) or \goth_A (group 2)
  var pattern = /\\goth(?:{([^}]+)}|_([A-Za-z]))/g;
  var match;
  var matches = [];

  // collect matches with absolute start/end indexes and the inner text
  while ((match = pattern.exec(text)) !== null) {
    var inner = (typeof match[1] !== 'undefined' && match[1] !== null) ? match[1] : match[2];
    if (!inner) continue; // safety: skip if empty or undefined
    matches.push({
      start: match.index,
      end: pattern.lastIndex - 1,
      inner: inner
    });
  }

  if (matches.length === 0) return; // nothing to do

  // get editable Text for the paragraph (offsets match the indices from above)
  var t = paragraph.editAsText();

  // replace from last match to first so earlier replacements don't shift later indices
  for (var i = matches.length - 1; i >= 0; i--) {
    var m = matches[i];
    // delete the original matched sequence (e.g. '\goth{Hello}' or '\goth_A')
    t.deleteText(m.start, m.end);
    // insert the inner text in its place
    t.insertText(m.start, m.inner);
    // set font on the inserted characters
    t.setFontFamily(m.start, m.start + m.inner.length - 1, "UnifrakturMaguntia");
  }
}

// formats \goth and \textgoth
function formatGothTextByParagraph2(paragraph) {
  var text = paragraph.getText();
  // matches either \goth{...} or \goth_A OR \textgoth{...} or \textgoth_A
  var pattern = /\\(?:goth|textgoth)(?:{([^}]+)}|_([A-Za-z]))/g;
  var match;
  var matches = [];

  // collect matches with absolute start/end indexes and the inner text
  while ((match = pattern.exec(text)) !== null) {
    var inner = (typeof match[1] !== 'undefined' && match[1] !== null) ? match[1] : match[2];
    if (!inner) continue; // safety: skip if empty or undefined
    matches.push({
      start: match.index,
      end: pattern.lastIndex - 1,
      inner: inner
    });
  }

  if (matches.length === 0) return; // nothing to do

  // get editable Text for the paragraph (offsets match the indices from above)
  var t = paragraph.editAsText();

  // replace from last match to first so earlier replacements don't shift later indices
  for (var i = matches.length - 1; i >= 0; i--) {
    var m = matches[i];
    // delete the original matched sequence (e.g. '\goth{Hello}' or '\goth_A' or '\textgoth{...}')
    t.deleteText(m.start, m.end);
    // insert the inner text in its place
    t.insertText(m.start, m.inner);
    // set font on the inserted characters
    t.setFontFamily(m.start, m.start + m.inner.length - 1, "UnifrakturMaguntia");
  }
}

// likely to be with bugs
function formatGothText(body) {
  // var body = DocumentApp.getActiveDocument().getBody();
  var text = body.getText();
  
  // Find all \goth{...} patterns
  var pattern = /\\goth{([^}]+)}/g;
  var match;
  
  while ((match = pattern.exec(text)) !== null) {
    var fullMatch = match[0];
    var innerText = match[1];
    
    // Find the position of this match in the document
    var foundElement = body.findText(escapeRegex(fullMatch));
    
    if (foundElement) {
      var foundText = foundElement.getElement().asText();
      var startOffset = foundElement.getStartOffset();
      var endOffsetInclusive = foundElement.getEndOffsetInclusive();
      
      // Replace with formatted text
      foundText.deleteText(startOffset, endOffsetInclusive);
      foundText.insertText(startOffset, innerText);
      foundText.setFontFamily(startOffset, startOffset + innerText.length - 1, "Unifraktur Maguntia");
    }
    
    // Reset lastIndex to avoid infinite loop with global regex
    pattern.lastIndex = 0;
  }
}

