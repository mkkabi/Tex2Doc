/**
 * Saves a key-value pair to User Properties
 * @param {string} key - The key to save
 * @param {number} value - The numeric value to save
 */
function saveToUserProperties(key, value, regexCheck) {
  try {
    const userProperties = PropertiesService.getUserProperties();
    const currentDict = loadFromUserProperties();
    if(!regexCheck) key = escapeRegex(key);
    // Update the dictionary with new entry
    currentDict[key] = value;
    Logger.log("saving key = "+key+" regexCheck = "+regexCheck);
    // Save the updated dictionary
    userProperties.setProperty('user_defined_math', JSON.stringify(currentDict));
    
    return { success: true, message: 'Entry saved successfully' };
  } catch (error) {
    throw new Error('Failed to save entry: ' + error.toString());
  }
}

/**
 * Loads the entire dictionary from User Properties
 * @return {Object} The user defined math dictionary
 */
function loadFromUserProperties() {
  try {
    const userProperties = PropertiesService.getUserProperties();
    const storedDict = userProperties.getProperty('user_defined_math');
    
    if (storedDict) {
      user_defined_math = JSON.parse(storedDict);
      return user_defined_math;
    } else {
      return {};
    }
  } catch (error) {
    console.error('Error loading dictionary:', error);
    return {};
  }
}

/**
 * Clears all entries from the dictionary
 */
function clearUserProperties() {
  try {
    const userProperties = PropertiesService.getUserProperties();
    userProperties.deleteProperty('user_defined_math');
    return { success: true, message: 'Dictionary cleared successfully' };
  } catch (error) {
    throw new Error('Failed to clear dictionary: ' + error.toString());
  }
}

/**
 * Function to use the dictionary in your script
 * @param {string} key - The key to look up
 * @return {number|null} The value if found, null otherwise
 */
function getUserDefinedMath(key) {
  const dictionary = loadFromUserProperties();
  return dictionary.hasOwnProperty(key) ? dictionary[key] : null;
}

/**
 * Gets all user defined math entries as an object
 * @return {Object} The complete dictionary
 */
function getAllUserDefinedMath() {
  return loadFromUserProperties();
}

/**
 * Shows the HTML page for dictionary management
 */
function showDictionaryManager() {
  const html = HtmlService.createHtmlOutputFromFile('save_dictionary')
    // .setWidth(600)
    // .setHeight(500)
    .setTitle('User Defined Math Dictionary');
  // SpreadsheetApp.getUi().showModalDialog(html, 'Math Dictionary Manager');
  DocumentApp.getUi().showSidebar(html);
}


/**
 * Example function showing how to use the dictionary in calculations
 */
function exampleUsage() {
  const userConstants = getAllUserDefinedMath();
  
  // Example: Use gravity constant if defined by user
  const gravity = getUserDefinedMath('gravity') || 9.81; // fallback to default
  
  // Example calculation using user-defined values
  const mass = 10;
  const weight = mass * gravity;
  
  console.log(`Using gravity: ${gravity}`);
  console.log(`Weight of ${mass}kg object: ${weight}N`);
  
  return weight;
}

function deleteKeyFromUserDict(key){
  // the dictionary is already loaded to the global var user_defined_math at this point
    try {
      if (user_defined_math == null) loadFromUserProperties();
      const escapedKey = escapeRegex(key);
      const keyExisted = key in user_defined_math;
      const escapedKeyExisted = escapedKey in user_defined_math;
      if(keyExisted) {const wasDeleted = delete user_defined_math[key];}
      if(escapedKeyExisted) {const wasDeleted = delete user_defined_math[escapedKey];}
      const keyNowMissing = !(key in user_defined_math);
      Logger.log("will be deleting key = "+key);
      Logger.log("user dictionary is:");
      for (const [key, value] of Object.entries(user_defined_math)) {
        Logger.log(key, value);
      }
      Logger.log("keyExisted = "+keyExisted+ " keyNowMissing = "+keyNowMissing+" escapedKeyExisted = "+escapedKeyExisted);
      if (!keyExisted && !escapedKeyExisted) throw new Error('Failed to remove '+key);
      // Save the updated dictionary
      const userProperties = PropertiesService.getUserProperties();
      userProperties.setProperty('user_defined_math', JSON.stringify(user_defined_math));
  } catch (error) {
    throw new Error(error.toString());
  }
}

