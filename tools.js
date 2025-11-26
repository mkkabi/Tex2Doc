function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function unescapeRegex(escapedString) {
    return escapedString.replace(/\\([-\/\\^$*+?.()|[\]{}])/g, '$1');
}

function escapeSlashes(str) {
  // return str.replace('\\', '\\\\');
  return str.replace(/(?<!\\)\\(?!\\)/g, '\\\\');
}


var REGEX_FRAC = "\\frac\{([^{}]|\{[^{}]*\})*\}\{([^{}]|\{[^{}]*\})*\}";

function getLatexasImage(latex) {
  // Your LaTeX formula
  // const latex = '\\frac{1}{\\sqrt{2\\pi\\sigma^2}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}';
 
  // Generate URL (use encodeURIComponent to escape special characters)
  const url = 'https://latex.codecogs.com/png.latex?' + encodeURIComponent('\\dpi{300} {'+latex+'}');

  
  // Fetch image blob
  const response = UrlFetchApp.fetch(url);
  if (response.getResponseCode() === 200) {
    const blob = response.getBlob();
    // Insert the image into the document
    return blob;
  }else return null;
}


function insertLatexImage() {
  const doc = DocumentApp.getActiveDocument();
  const cursor = doc.getCursor();
  if (!cursor) throw new Error("Place your cursor first.");

  const latex = '\\tiny \\frac{1}{\\sqrt{\\pi\\sigma^2}}';
  const url = 'https://latex.codecogs.com/png.latex?' + encodeURIComponent('\\dpi{300} {'+latex+'}');

  const blob = UrlFetchApp.fetch(url).getBlob().setName('formula.png');
  // Insert image
  const image = cursor.insertInlineImage(blob);
  const originalWidth = image.getWidth();
  const originalHeight = image.getHeight();

  // desired width in pixels
  const targetWidth = 20*originalWidth/100;
  const scale = targetWidth / originalWidth;

  // set width and height proportionally
  image.setWidth(targetWidth);
  image.setHeight(originalHeight * scale);

}


function setImageDimentions(image){
const originalWidth = image.getWidth();
      const originalHeight = image.getHeight();
      if (originalWidth === 0 || originalHeight === 0) {
        console.log("Warning: image dimensions not available yet.");
        return;
      }
      const targetWidth = 45*originalWidth/100; //pixels
      const scale = targetWidth / originalWidth;
      image.setWidth(targetWidth);
      image.setHeight(originalHeight * scale); // maintain aspect ratio
}


function getParagraphEffectiveFontSizes(paragraph) {
  const textElements = [];
  const numChildren = paragraph.getNumChildren();

  for (let i = 0; i < numChildren; i++) {
    const child = paragraph.getChild(i);
    if (child.getType() === DocumentApp.ElementType.TEXT) {
      const text = child.asText();
      const length = text.getText().length;
      for (let j = 0; j < length; j++) {
        let size = text.getFontSize(j);
        if (size === null) {
          size = 11; // assume default Google Docs font size
        }
        textElements.push(size);
      }
    }
  }
  const baseFontSize = textElements.every(s => s === textElements[0]) ? textElements[0] : null;
  if (baseFontSize !== null) {
    Logger.log('Font size of the paragraph: ' + baseFontSize + ' points');
  } else {
    Logger.log('Font size is not consistently set for this paragraph, or it is not explicitly set.');
  }
  return baseFontSize==null?11:baseFontSize;
}