function addBeginEditingMarker() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  // Insert at the beginning of the document
  body.insertParagraph(0, "begin_editing");
  Logger.log("Added 'begin_editing' marker at the beginning of the document");
}

function testCyrillicDetection() {
  const testChars = ['А', 'Б', 'В', 'a', 'B', 'C', '1', '@', ' ', '\n'];
  
  testChars.forEach(char => {
    Logger.log(`"${char}" (char code: ${char.charCodeAt(0)}) is Cyrillic: ${isCyrillic(char)}`);
  });
}