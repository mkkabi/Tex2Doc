function showSuggestionsSidebar2() {
  loadReplacementsCount();
  const html = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle('Math replace');
  DocumentApp.getUi().showSidebar(html);
}

/**
 * Return top N most frequent items from replacements_count
 */
function getTopFrequent(limit = 10) {
  const frequent = loadReplacementsCount();
  if(frequent){
    const sortedArray = Object.entries(frequent)
    .sort((a, b) => parseInt(b[1]) - parseInt(a[1])) // sort by frequency descending
    .slice(0, limit); // take only top limit

    for(i=0;i<sortedArray.length;i++){
      console.log(sortedArray[i][0]);
    }
    return sortedArray;
  }else return [];
    
}


/**
 * Insert text at current cursor
 */
function insertTextAtCursor(textToInsert) {
  const doc = DocumentApp.getActiveDocument();
  const cursor = doc.getCursor();
  if (!cursor) return false;
  cursor.insertText(textToInsert);
  return true;
}

/**
 * Return all replacements dictionary
 */
function getAllReplacements() {
  return replacements;
}

function getGlobalFrequentReplacements(){
  return replacements_count;
}

function saveFrequent(frequentDict){
  saveReplacementsCount(frequentDict);
}