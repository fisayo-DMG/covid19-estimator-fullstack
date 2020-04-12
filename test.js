const xml = require('xml');
const builder = require('xmlbuilder');

const obj = {
  name: "John"
};

const JSONObject = JSON.stringify(obj);
const parsedJSON = JSON.parse(JSONObject);
const xmlFile = xml(obj);
const xmlFileFromParsedJSON = xml(parsedJSON);
const xmlBuild = builder.create(obj).end({pretty: true});

console.log('Real object', obj);
console.log('Converted from JS Object to JSON', JSONObject);
console.log('Converted back from JSON to JS Object', parsedJSON);
console.log('Converted from JS Object to xml', xmlFile);
console.log('Converted from JS Object to JSON to JS Object to xml', xmlFileFromParsedJSON);
console.log('Convert to xml using xmlbuilder', xmlBuild);