// // === GLOBAL VARIABLE ===
// // This holds the replacements_count in memory during the script run.
// var replacements_count = {} // will be filled before loop starts

// function getAllDicts(){
//   loadFromUserProperties();
//   Logger.log("user dict = "+ user_defined_math);
//   return all_replacements = Object.assign({},text_corrections, math_dict);
// }


// function loadReplacementsCount() {
//   const props = PropertiesService.getDocumentProperties();
//   const json = props.getProperty('replacements_count');
//   console.log("Raw JSON from Properties: " + json);
  
//   let parsed = {};
//   if (json) {
//     try {
//       parsed = JSON.parse(json);
//       // If parsed is an array, convert to object
//       if (Array.isArray(parsed)) {
//         console.log("Parsed value is an array, converting to object");
//         parsed = {};
//       }
//     } catch (e) {
//       console.log("JSON parse error: " + e.toString());
//       parsed = {};
//     }
//   } else {
//     console.log("No replacements_count found in properties, initializing empty object");
//   }
  
//   replacements_count = parsed;
//   console.log("Successfully loaded replacements_count: " + JSON.stringify(replacements_count));
//   return replacements_count;
// }


// function saveReplacementsCount(repl = replacements_count) {
//   if(repl){
//     const props = PropertiesService.getDocumentProperties();
//     props.setProperty('replacements_count', JSON.stringify(repl));
//     console.log("saving "+JSON.stringify(repl));
//   }
// }


// function resetReplacementsCount() {
//   replacements_count = {};
//   const props = PropertiesService.getDocumentProperties();
//   props.setProperty('replacements_count', JSON.stringify({}));
//   Logger.log("replacements_count has been reset.");
// }


// /**
//  * Replace text and count replacements (only updates the global var).
//  */
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
//     const matchCount = (originalText.match(regex) || []).length;

//     // Replace text
//     textElement.replaceText(oldText, newText);

//     // Update global dictionary only (no saving to PropertiesService here)
//     if (matchCount > 0 && oldText in math_dict) {
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

// // NEW START
// function replaceWithSingleRegex(paragraph, regex, all_dicts) {
//   if (typeof replacements_count === 'undefined') {
//     replacements_count = {};
//   }
//   if (!paragraph) return;

//   try {
//     const textElement = paragraph.editAsText();
//     const originalText = textElement.getText();
    
//     // Single replacement operation
//     const newText = originalText.replace(regex, (match) => {
//       // Count the replacement
//       if (match in math_dict) {
//         if (!replacements_count[match]) {
//           replacements_count[match] = 0;
//         }
//         replacements_count[match]++;
//       }
//       return all_dicts[match];
//     });
    
//     // Only set text if changes were made
//     if (newText !== originalText) {
//       textElement.setText(newText);
//     }

//   } catch (e) {
//     Logger.log("Error editing paragraph: " + e.toString());
//   }
// }

// let optimizedDicts = null;
// function bulkReplaceAndCount2(paragraph) {
//   // Cache the optimized dicts
//   // if (!optimizedDicts) {
//   //   optimizedDicts = getOptimizedDicts();
//   // }
//   optimizedDicts = getOptimizedDicts();
//   replaceWithSingleRegex(paragraph, optimizedDicts.regex, optimizedDicts.replacements);
// }

// function getOptimizedDicts() {
//   const all_dicts = getAllDicts();
//   const patterns = [];
//   const replacements = {};
//   // Pre-process for regex and create lookup
//   Object.entries(all_dicts).forEach(([key, value]) => {
//     const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//     patterns.push(escapedKey);
//     replacements[key] = value;
//   });
  
//   // Sort by length (longer first) to handle overlapping patterns
//   patterns.sort((a, b) => b.length - a.length);
  
//   return {
//     regex: new RegExp(`(${patterns.join('|')})`, 'g'),
//     replacements: replacements
//   };
// }

// // NEW END
// var user_defined_math = {}

// var text_corrections = {
//     "\\\\test": "test passed ddd",
//     "[Мм]арк[а-я]{1,12} [Лл]анц[а-я]{1,13}": "МЛ",
//     "\\s\\s\\s\\s": " ",
//     "\\s\\s\\s": " ",
//     "\\s\\s": " ",
//     " ,": ",",
//     " \\.": ".",
//     " ;": ";",
//     "\\[[ ]": "[",
//     " \\]": "]",
//     "\\{ ": "{",
//     " \\}": "}",
//     "\\s\\)": ")",
//     "\\(\\s": "("
// }
// var math_dict = {
    // "\\\\mathbb\\{C\\}": "ℂ",
    // "\\\\mathbb\\_H": "ℍ",
    // "\\\\mathbb_N": "ℕ",
    // "\\\\mathbb_P": "ℙ",
    // "\\\\mathbb_Q": "ℚ",
    // "\\\\mathbb_R": "ℝ",
    // "\\\\mathbb_Z": "ℤ",
//     "\\\\beta1-k": "β1,β2,...,β_k",
//     "\\\\alpha1-k": "α1,α2,...,α_k",
//     "\\\\alpha": "α",
//     "\\\\beta": "β",
//     "\\\\zeta": "ζ",
//     "\\\\eta": "η",
//     "\\\\kappa": "κ",
//     "\\\\lambda": "λ",
//     "\\\\mu": "µ",
//     "\\\\xi": "ξ",
//     "\\\\rho": "ρ",
//     "\\\\tau": "τ",
//     "\\\\phi": "φ",
//     "\\\\psi": "ψ",
//     "\\\\pi": "π",
//     "\\\\theta": "θ",
//     "\\\\gamma": "γ",
//     "\\\\delta": "δ",
//     "\\\\omega": "ω",
//     "\\\\sigma": "σ",
//     "\\\\Gamma": "Γ",
//     "\\\\Delta": "Δ",
//     "\\\\Theta": "Θ",
//     "\\\\Lambda": "Λ",
//     "\\\\Xi": "Ξ",
//     "\\\\Pi": "Π",
//     "\\\\Sigma": "Σ",
//     "\\\\Upsilon": "Υ",
//     "\\\\Phi": "Φ",
//     "\\\\Psi": "Ψ",
//     "\\\\Omega": "Ω",
//     "\\\\varepsilon": "ε",
//     "\epsilon": "ε",
//     "\\\\vartheta": "ϑ",
//     "\\\\varpi": "ϖ",
//     "\\\\varrho": "ϱ",
//     "\\\\varsigma": "ς",
//     "\\\\varphi": "ϕ",
//     "\\\\infty": "∞", 
//     "\\\\in": "∈",
//     "\\\\cap": "∩",
//     "\\\\bigcap": "⋂",
//     "\\\\bigcup": "⋃",
//     "\\\\union": "⋃",
//     "\\\\subset": "⊂",
//     "\\\\superset": "⊃",
//     "\\\\varnothing": "Ø",
//     "\\\\geq": "≥",
//     "\\\\leq": "≤",
//     "\\\\notequal": "≠",
//     "\\\\neq": "≠",
//     "\\\\sim": "∼",
//     "\\\\div": "÷",
//     "\\\\cdots": "· · ·",
//     "\\\\cdot": "·",
//     "\\\\times": "×",
//     "\\\\pm": "±",
//     "\\\\mp": "∓",
//     "\\\\partial": "∂",
//     "\\\\prime": "′",
//     "\\\\circ": "∘",
//     "\\\\ast": "∗",
//     "\\\\bullet": "•",
//     "\\\\oplus": "⊕",
//     "\\\\otimes": "⊗",
//     "\\\\setminus": "∖",
//     "\\\\forall": "∀",
//     "\\\\nabla": "∇",
//     "\\\\rightarrow": "→",
//     "\\\\Rightarrow": "⇒",
//     "\\\\exists": "∃",
//     "\\\\cup": "∪",
//     "\\\\vee": "∨",
//     "\\\\wedge": "∧",
//     "\\\\neg": "¬",
//     "\\\\emptyset": "∅",
//     "\\\\propto": "∝",
//     "\\\\approx": "≈",
//     "\\\\equiv": "≡",
//     "\\\\perp": "⊥",
//     "\\\\parallel": "∥",
//     "\\\\mid": "∣",
//     "\\\\therefore": "∴",
//     "\\\\because": "∵",
//     "\\\\square": "□",
//     "\\\\blacksquare": "■",
//     "\\\\diamond": "◇",
//     "\\\\bullet": "•",
//     "\\\\sum": "∑",
//     "\\\\prod": "∏",
//     "\\\\int": "∫",
//     "\\\\oint": "∮",
//     "\\\\iint": "∬",
//     "\\\\iiint": "∭",
//     "\\\\ll": "≪",
//     "\\\\gg": "≫",
//     "\\\\prec": "≺",
//     "\\\\succ": "≻",
//     "\\\\supset": "⊃",
//     "\\\\subseteq": "⊆",
//     "\\\\supseteq": "⊇",
//     "\\\\sqsubset": "⊏",
//     "\\\\sqsupset": "⊐",
//     "\\\\sqsubseteq": "⊑",
//     "\\\\sqsupseteq": "⊒",
//     "\\\\angle": "∠",
//     "\\\\measuredangle": "∡",
//     "\\\\sphericalangle": "∢",
//     "\\\\triangle": "△",
//     "\\\\cong": "≅",
//     "\\\\simeq": "≃"
//   };