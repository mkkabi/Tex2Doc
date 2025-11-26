// Additional utility functions
function testBeginEditingDetection() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const result = findBeginEditingPosition(body);
  
  if (result.found) {
    Logger.log(`Found 'begin_editing' at paragraph ${result.paragraphIndex}, character offset ${result.characterOffset}`);
  } else {
    Logger.log("'begin_editing' not found");
  }
  return result;
}