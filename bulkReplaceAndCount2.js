// === GLOBAL VARIABLE ===
// This holds the replacements_count in memory during the script run.
var replacements_count = {} // will be filled before loop starts



function getAllDicts(){
    if(!user_defined_math) loadFromUserProperties();
    Logger.log("user dict = "+ user_defined_math);
    return Object.assign({}, text_corrections, replacements, user_defined_math);
    // return all_replacements = Object.assign({}, user_defined_math);
}

function getAppDicts(){
    return Object.assign({}, text_corrections, replacements);
}

function getUserDicts(){
    if(!user_defined_math) loadFromUserProperties();
    Logger.log("user dict = "+ user_defined_math);
    return Object.assign({}, user_defined_math);
}


function loadReplacementsCount() {
    const props = PropertiesService.getDocumentProperties();
    const json = props.getProperty('replacements_count');
    console.log("Raw JSON from Properties: " + json);

    let parsed = {};
    if (json) {
        try {
            parsed = JSON.parse(json);
            // If parsed is an array, convert to object
            if (Array.isArray(parsed)) {
                console.log("Parsed value is an array, converting to object");
                parsed = {};
            }
        } catch (e) {
            console.log("JSON parse error: " + e.toString());
            parsed = {};
        }
    } else {
        console.log("No replacements_count found in properties, initializing empty object");
    }

    replacements_count = parsed;
    console.log("Successfully loaded replacements_count: " + JSON.stringify(replacements_count));
    return replacements_count;
}


function saveReplacementsCount(repl = replacements_count) {
    if(repl){
        const props = PropertiesService.getDocumentProperties();
        props.setProperty('replacements_count', JSON.stringify(repl));
        console.log("saving "+JSON.stringify(repl));
    }
}


function resetReplacementsCount() {
    replacements_count = {};
    const props = PropertiesService.getDocumentProperties();
    props.setProperty('replacements_count', JSON.stringify({}));
    Logger.log("replacements_count has been reset.");
}


/**
 * Replace text and count replacements (only updates the global var).
 */
// function replaceTextAndCount(paragraph, oldText, newText) {
//   if (typeof replacements_count === 'undefined' || !replacements_count) {
//     console.log("replacements_count is undefined, initializing...");
//     replacements_count = {};
//   }
//   if (!paragraph) {
//     Logger.log("Paragraph is undefined!");
//     return;
//   }
//   try {
//     const textElement = paragraph.editAsText();
//     const originalText = textElement.getText();

//     // Count occurrences before replacing
//     const regex = new RegExp(oldText, "g");
//     console.log("const regex = "+regex);
//     const matchCount = (originalText.match(regex) || []).length;

//     // Replace text
//     textElement.replaceText(oldText, newText);

//     // Update global dictionary only (no saving to PropertiesService here)
//     if (matchCount > 0 && oldText in replacements) {
//       if (!replacements_count[oldText]) {
//         replacements_count[oldText] = 0;
//       }
//       console.log("adding frequent "+oldText);
//       replacements_count[oldText] += matchCount;
//       console.log("replacements_count in replaceTextAndCount " + JSON.stringify(replacements_count, null, 2));
//     }

//   } catch (e) {
//     Logger.log("Error editing paragraph: " + e.toString());
//   }
// }

function replaceTextAndCount(paragraph, oldText, newText) {
    if (typeof replacements_count === 'undefined' || !replacements_count) {
        console.log("replacements_count is undefined, initializing...");
        replacements_count = {};
    }
    try {
        const textElement = paragraph.editAsText();
        const originalText = textElement.getText();

        // Count occurrences before replacing
        const regex = new RegExp(oldText, "g");
        // console.log("const regex = "+regex);
        const matches = originalText.match(regex) || [];
        const matchCount = matches.length;

        // Update global dictionary only (no saving to PropertiesService here)
        if (matchCount > 0 && oldText in replacements) {
            if (!replacements_count[oldText]) {
                replacements_count[oldText] = 0;
            }
            console.log("adding frequent "+oldText);
            replacements_count[oldText] += matchCount;
            console.log("replacements_count in replaceTextAndCount " + JSON.stringify(replacements_count, null, 2));
        }

        // Actually perform the replacement with font size adjustment
        if (matchCount > 0) {
            // Define the special characters that need font size 15
            const specialCharacters = {
                '\\\\iiint': '∭',
                '\\\\iint': '∬',
                '\\\\int': '∫',
                '\\\\oint': '∮',
                '\\\\sum': '∑',
                '\\\\bigcap': '⋂',
                '\\\\bigcup': '⋃'
            };

            // Check if this is one of the special characters
            const isSpecialCharacter = oldText in specialCharacters;

            if (isSpecialCharacter) {
                // For special characters, we need to handle replacement with font size change
                let currentIndex = 0;
                let updatedText = originalText;

                // Replace all occurrences
                updatedText = updatedText.replace(regex, newText);
                textElement.setText(updatedText);

                // Now find each occurrence and set font size
                let searchIndex = 0;
                for (let i = 0; i < matchCount; i++) {
                    const foundIndex = updatedText.indexOf(newText, searchIndex);
                    if (foundIndex !== -1) {
                        const textSize = getParagraphEffectiveFontSizes(paragraph);
                        textElement.setFontSize(foundIndex, foundIndex + newText.length - 1, textSize+5);
                        searchIndex = foundIndex + newText.length;
                    }
                }
            } else {
                // For regular replacements, just do the text replacement
                textElement.replaceText(oldText, newText);
            }
        }

    } catch (e) {
        Logger.log("Error editing paragraph: " + e.toString());
    }
}


function replaceTextWithoutCount(paragraph, oldText, newText) {
    try {
        const textElement = paragraph.editAsText();
        const originalText = textElement.getText();

        // Count occurrences before replacing
        const regex = new RegExp(oldText, "g");
        // console.log("const regex = "+regex);
        const matches = originalText.match(regex) || [];
        const matchCount = matches.length;

        // Actually perform the replacement with font size adjustment
        if (matchCount > 0) {
            // Define the special characters that need font size 15
            const specialCharacters = {
                '\\\\iiint': '∭',
                '\\\\iint': '∬',
                '\\\\int': '∫',
                '\\\\oint': '∮',
                '\\\\sum': '∑',
                '\\\\bigcap': '⋂',
                '\\\\bigcup': '⋃'
            };

            // Check if this is one of the special characters
            const isSpecialCharacter = oldText in specialCharacters;

            if (isSpecialCharacter) {
                // For special characters, we need to handle replacement with font size change
                let currentIndex = 0;
                let updatedText = originalText;

                // Replace all occurrences
                updatedText = updatedText.replace(regex, newText);
                textElement.setText(updatedText);

                // Now find each occurrence and set font size
                let searchIndex = 0;
                for (let i = 0; i < matchCount; i++) {
                    const foundIndex = updatedText.indexOf(newText, searchIndex);
                    if (foundIndex !== -1) {
                        const textSize = getParagraphEffectiveFontSizes(paragraph);
                        textElement.setFontSize(foundIndex, foundIndex + newText.length - 1, textSize+5);
                        searchIndex = foundIndex + newText.length;
                    }
                }
            } else {
                // For regular replacements, just do the text replacement
                textElement.replaceText(oldText, newText);
            }
        }
    } catch (e) {
        Logger.log("Error editing paragraph: " + e.toString());
    }
}


/**
 * Bulk replacement that uses the counting function (no saving here).
 */
function bulkReplaceAppDicts(paragraph) {
    const app_dicts = getAppDicts();
    for (let [oldText, newText] of Object.entries(app_dicts)) {
        replaceTextWithoutCount(paragraph, oldText, newText);
    }
}

function bulkReplaceUserDicts(paragraph) {
    const user_dicts = getUserDicts();
    for (let [oldText, newText] of Object.entries(user_dicts)) {
        replaceTextWithoutCount(paragraph, oldText, newText);
    }
}

// cache user defined dictionary
var user_defined_math = null;

var text_corrections = {
    // "\\\\test": "test passed",
    // "[Мм]арк[а-я]{1,12} [Лл]анц[а-я]{1,13}": "МЛ",
    "\\s\\s\\s\\s": " ",
    "\\s\\s\\s": " ",
    "\\s\\s": " ",
    " ,": ",",
    " \\.": ".",
    " ;": ";",
    "\\[[ ]": "[",
    " \\]": "]",
    "\\{ ": "{",
    " \\}": "}",
    "\\s\\)": ")",
    "\\(\\s": "("
}
var replacements = {
    "\\\\mathbb\\{C\\}": "ℂ",
    "\\\\mathbb\\{H\\}": "ℍ",
    "\\\\mathbb\\{N\\}": "ℕ",
    "\\\\mathbb\\{P\\}": "ℙ",
    "\\\\mathbb\\{Q\\}": "ℚ",
    "\\\\mathbb\\{R\\}": "ℝ",
    "\\\\mathbb\\{Z\\}": "ℤ",
    "\\\\notin": "∉",
    "\\\\beta1-k": "β1,β2,...,β_k",
    "\\\\alpha1-k": "α1,α2,...,α_k",
    "\\\\alpha": "α",
    "\\\\beta": "β",
    "\\\\zeta": "ζ",
    "\\\\eta": "η",
    "\\\\kappa": "κ",
    "\\\\lambda": "λ",
    "\\\\mu": "µ",
    "\\\\xi": "ξ",
    "\\\\rho": "ρ",
    "\\\\tau": "τ",
    "\\\\phi": "φ",
    "\\\\psi": "ψ",
    "\\\\pi": "π",
    "\\\\theta": "θ",
    "\\\\gamma": "γ",
    "\\\\delta": "δ",
    "\\\\omega": "ω",
    "\\\\sigma": "σ",
    "\\\\Gamma": "Γ",
    "\\\\Delta": "Δ",
    "\\\\Theta": "Θ",
    "\\\\Lambda": "Λ",
    "\\\\Xi": "Ξ",
    "\\\\Pi": "Π",
    "\\\\Sigma": "Σ",
    "\\\\Upsilon": "Υ",
    "\\\\Phi": "Φ",
    "\\\\Psi": "Ψ",
    "\\\\Omega": "Ω",
    "\\\\varepsilon": "ε",
    "\epsilon": "ε",
    "\\\\vartheta": "ϑ",
    "\\\\varpi": "ϖ",
    "\\\\varrho": "ϱ",
    "\\\\varsigma": "ς",
    "\\\\varphi": "ϕ",
    "\\\\infty": "∞",
    "\\\\int": "∫",
    "\\\\in": "∈",
    "\\\\cap": "∩",
    "\\\\bigcap": "⋂",
    "\\\\bigcup": "⋃",
    "\\\\union": "⋃",
    "\\\\subset": "⊂",
    "\\\\superset": "⊃",
    "\\\\varnothing": "Ø",
    "\\\\geq": "≥",
    "\\\\leq": "≤",
    "\\\\notequal": "≠",
    "\\\\neq": "≠",
    "\\\\sim": "∼",
    "\\\\div": "÷",
    "\\\\cdots": "· · ·",
    "\\\\cdot": "·",
    "\\\\times": "×",
    "\\\\pm": "±",
    "\\\\mp": "∓",
    "\\\\partial": "∂",
    "\\\\prime": "′",
    "\\\\circ": "∘",
    "\\\\ast": "∗",
    "\\\\bullet": "•",
    "\\\\oplus": "⊕",
    "\\\\otimes": "⊗",
    "\\\\setminus": "∖",
    "\\\\forall": "∀",
    "\\\\nabla": "∇",
    "\\\\rightarrow": "→",
    "\\\\Rightarrow": "⇒",
    "\\\\exists": "∃",
    "\\\\cup": "∪",
    "\\\\vee": "∨",
    "\\\\wedge": "∧",
    "\\\\neg": "¬",
    "\\\\emptyset": "∅",
    "\\\\propto": "∝",
    "\\\\approx": "≈",
    "\\\\equiv": "≡",
    "\\\\perp": "⊥",
    "\\\\parallel": "∥",
    "\\\\mid": "∣",
    "\\\\therefore": "∴",
    "\\\\because": "∵",
    "\\\\square": "□",
    "\\\\blacksquare": "■",
    "\\\\diamond": "◇",
    "\\\\bullet": "•",
    "\\\\sum": "∑",
    "\\\\prod": "∏",
    "\\\\oint": "∮",
    "\\\\iint": "∬",
    "\\\\iiint": "∭",
    "\\\\ll": "≪",
    "\\\\gg": "≫",
    "\\\\prec": "≺",
    "\\\\succ": "≻",
    "\\\\supset": "⊃",
    "\\\\subseteq": "⊆",
    "\\\\supseteq": "⊇",
    "\\\\sqsubset": "⊏",
    "\\\\sqsupset": "⊐",
    "\\\\sqsubseteq": "⊑",
    "\\\\sqsupseteq": "⊒",
    "\\\\angle": "∠",
    "\\\\measuredangle": "∡",
    "\\\\sphericalangle": "∢",
    "\\\\triangle": "△",
    "\\\\cong": "≅",
    "\\\\simeq": "≃"
};