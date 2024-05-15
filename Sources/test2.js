import fs from "fs";
import request from "request";

const url = "http://localhost:8080";

const username = "admin";
const password = "admin";
function deployContentModel(filePath, callback) {
  // Read the XML file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return callback(err);
    }

    // Construct the request options
    const options = {
      method: "POST",
      url: url + "/alfresco/api/-default-/public/alfresco/versions/1/content",
      headers: {
        Authorization:
          "Basic " + Buffer.from(username + ":" + password).toString("base64"),
        "Content-Type": "multipart/form-data",
      },
      formData: {
        filedata: {
          value: data,
          options: {
            filename: "custom-model.xml",
            contentType: "application/xml",
          },
        },
      },
    };

    // Send the request
    request(options, (error, response, body) => {
      if (error) {
        return callback(error);
      }

      if (response.statusCode !== 201) {
        return callback(
          new Error(
            `Failed to deploy content model. Status code: ${response.statusCode}`
          )
        );
      }

      callback(null, "Content model deployed successfully.");
    });
  });
}

function jsonToXml(json) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml +=
    '<model name="' +
    json.name +
    '" xmlns="http://www.alfresco.org/model/dictionary/1.0">\n';
  xml += "\t<description>" + json.description + "</description>\n";
  xml += "\t<author>" + json.author + "</author>\n";
  xml += "\t<imports>\n";
  json.imports.forEach((importItem) => {
    xml +=
      '\t\t<import uri="' +
      importItem.uri +
      '" prefix="' +
      importItem.prefix +
      '"/>\n';
  });
  xml += "\t</imports>\n";
  xml += "\t<namespaces>\n";
  json.namespaces.forEach((namespace) => {
    xml +=
      '\t\t<namespace uri="' +
      namespace.uri +
      '" prefix="' +
      namespace.prefix +
      '"/>\n';
  });
  xml += "\t</namespaces>\n";
  xml += "\t<types>\n";
  json.types.forEach((type) => {
    xml +=
      '\t\t<type name="' +
      type.name +
      '" parentName="' +
      type.parentName +
      '">\n';
    type.properties.forEach((property) => {
      xml +=
        '\t\t\t<property name="' +
        property.name +
        '" dataType="' +
        property.dataType +
        '"/>\n';
    });
    xml += "\t\t</type>\n";
  });
  xml += "\t</types>\n";
  xml += "\t<aspects>\n";
  json.aspects.forEach((aspect) => {
    xml += '\t\t<aspect name="' + aspect.name + '"/>\n';
  });
  xml += "\t</aspects>\n";
  xml += "\t<constraints>\n";
  json.constraints.forEach((constraint) => {
    xml +=
      '\t\t<constraint name="' +
      constraint.name +
      '" type="' +
      constraint.type +
      '"/>\n';
  });
  xml += "\t</constraints>\n";
  xml += "</model>";

  return xml;
}

// Example JSON payload representing custom content model
const customModelJson = {
  name: "my:contentModel",
  description: "My Custom Content Model",
  author: "Your Name",
  imports: [
    { uri: "http://www.alfresco.org/model/dictionary/1.0", prefix: "d" },
    { uri: "http://www.alfresco.org/model/content/1.0", prefix: "cm" },
  ],
  namespaces: [
    { uri: "http://www.example.com/model/content/1.0", prefix: "my" },
  ],
  types: [
    {
      name: "my:CustomType",
      parentName: "cm:content",
      properties: [
        { name: "my:title", dataType: "d:text" },
        { name: "my:description", dataType: "d:text" },
      ],
    },
  ],
  aspects: [],
  constraints: [],
};

// Convert JSON to XML
const customModelXml = jsonToXml(customModelJson);

// Write XML to file
fs.writeFileSync("../custome-model-files/custom-model.xml", customModelXml);

// Example usage:
const filePath = "../custome-model-files/custom-model.xml";

deployContentModel(filePath, (err, result) => {
  if (err) {
    console.error("Error:", err);
  } else {
    console.log("Result:", result);
  }
});
