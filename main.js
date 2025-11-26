function processAll() {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();

    // Get the starting position from the separate method
    const startInfo = findBeginEditingPosition(body);

    if (!startInfo.found) {
        Logger.log("'start edit' not found in the document");
        return;
    }
    const { paragraphIndex, characterOffset } = startInfo;



    loadReplacementsCount();
    // console.log("After loadReplacementsCount(): " + JSON.stringify(replacements_count));
    // Process from the starting paragraph onwards
    const paragraphs = body.getParagraphs();
    for (let i = paragraphIndex; i < paragraphs.length; i++) {
        if (!paragraphs[i]) continue;

        const paragraph = paragraphs[i];
        if (paragraph.getType() !== DocumentApp.ElementType.PARAGRAPH) {
            console.warn(`Skipping element ${i}: type = ${paragraph.getType()}`);
            continue;
        }

        try{
            // Logger.log("inside process all for loop")

            // console.log("Processing paragraph " + i + ": " + paragraph.getText().substring(0, 50));
            // console.log("replacements_count before bulkReplace: " + JSON.stringify(replacements_count));
            bulkReplaceUserDicts(paragraph);
            latexToImageMy(paragraph, body);
            replaceLatexFractionsSimple(paragraph, body);

            // bulkReplaceAndCount2(paragraph);
            bulkReplaceAppDicts(paragraph);
            // processParagraphForNonCyrillic(paragraph);
            formatGothTextByParagraph2(paragraph);
            convertSubscriptsAndSuperscripts(paragraph);


            // // console.log("replacements_count after bulkReplace: " + JSON.stringify(replacements_count));


        }catch(e){console.error(`Error in paragraph ${i}:`, e);}
    }
    // Save the updated counts once after processing everything
    // console.log("replacements_count before save " + JSON.stringify(replacements_count, null, 2));
    // console.log("=== FINAL replacements_count ===");
    // console.log(JSON.stringify(replacements_count, null, 2));

    // formatGothText(body); SLOW
    saveReplacementsCount();
}

// function processAll() {
//   const doc = DocumentApp.getActiveDocument();
//   const body = doc.getBody();
//   const textElement = body.editAsText();

//   // Load current counts from PropertiesService
//   loadReplacementsCount();

//   // Get all replacements
//   const all_dicts = getAllDicts();

//   // Escape all keys to be safe in regex
//   const pattern = Object.keys(all_dicts)
//     .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
//     .join('|');

//   if (!pattern) {
//     Logger.log("No replacements provided");
//     return;
//   }

//   const regex = new RegExp(pattern, 'g');

//   // Get full doc text once
//   let text = textElement.getText();

//   // Do replacements in one pass
//   text = text.replace(regex, match => {
//     // Count how many times each match occurred
//     if (!replacements_count[match]) {
//       replacements_count[match] = 0;
//     }
//     replacements_count[match] += 1;

//     return all_dicts[match];
//   });

//   // Write back to doc once
//   textElement.setText(text);

//   // Save updated counts once
//   saveReplacementsCount();

//   Logger.log("=== FINAL replacements_count ===");
//   Logger.log(JSON.stringify(replacements_count, null, 2));
// }

function onInstall(e){
    onOpen(e);
}


/**
 * Runs when the document is opened (or when the add-on is initialized).
 * Accepts the event object e for add-on install flows.
 */
function onOpen(e) {
    const ui = DocumentApp.getUi();

    // For add-ons, prefer createAddonMenu so it attaches to the Add-ons area.
    // Fallback to createMenu if createAddonMenu isn't available (defensive).
    const menuBuilder = (typeof ui.createAddonMenu === 'function')
        ? ui.createAddonMenu()
        : ui.createMenu('Math Regex Tools');

    menuBuilder
        .addItem('Process Document after "start edit"', 'processAll')
        // .addItem('Clear replacements', 'resetReplacementsCount')
        .addItem('Show Suggestions', 'showSuggestionsSidebar2')
        .addItem('Show Dictionary Manager', 'showDictionaryManager')
        // .addItem('insertLatexImage', 'insertLatexImage')
        .addToUi();
}

/**
 * Called once when user installs the add-on. Ensure they get the menu immediately.
 */
function onInstall(e) {
    // Always call onOpen so newly installed users see the menu right away.
    onOpen(e);
    // You could also add installation analytics or setup here
    // PropertiesService.getScriptProperties().setProperty('INSTALL_TIME', new Date().toString());
}






