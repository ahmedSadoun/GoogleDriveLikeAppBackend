import axios from "axios";
import fetch from "node-fetch";
import btoa from "btoa"; // If you don't have btoa, install it with `npm install btoa` or use Buffer directly.
import fs from "fs";

const url = "http://localhost:8080";

const username = "admin";
const password = "admin";

async function fetchRootEntries() {
  const res = await axios.get(
    url +
      "/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/children?skipCount=0&maxItems=100",
    {
      auth: {
        username,
        password,
      },
    }
  );

  return res.data;
}
// By entry id
async function fetchSubEntries(entry_id) {
  let subEntriesUrl = `${url}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${entry_id}/children?skipCount=0&maxItems=100`;
  const res = await axios.get(subEntriesUrl, {
    auth: {
      username,
      password,
    },
  });

  return res.data;
}

// async function fetchFileContent(entry_id) {
//   let combinedUrl = `${url}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${entry_id}/content?attachment=true`;
//   // The username and password you need to use for basic authentication
//   const username = "admin";
//   const password = "admin";

//   // Base64 encode the username and password
//   const base64Auth = btoa(`${username}:${password}`);

//   try {
//     const response = await fetch(combinedUrl, {
//       headers: {
//         // Include the Base64-encoded credentials with the 'Authorization' header
//         Authorization: `Basic ${base64Auth}`,
//       },
//     });

//     if (response.ok) {
//       const buffer = await response.arrayBuffer();
//       // console.log(buffer);
//       return {
//         arrayBuffer: buffer,
//         contentType: response.headers.get("content-type"),
//       };
//       // console.log("", response);
//     } else {
//       res.status(500).send("Error fetching the image.");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error fetching the image.");
//   }
// }
async function fetchFileContent(entry_id) {
  let combinedUrl = `${url}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${entry_id}/content?attachment=true`;
  const response = await axios.get(combinedUrl, {
    responseType: "arraybuffer", // Ensure binary response
    auth: {
      username,
      password,
    },
  });
  return {
    arrayBuffer: response.data,
    contentType: response.headers["content-type"],
  };
}
async function createNewNode(entry_id, entry_name) {
  let data = {
    name: entry_name,
    nodeType: "cm:folder",
  };
  let combinedUrl = `${url}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${entry_id}/children?autoRename=true`;
  const response = await axios.post(combinedUrl, data, {
    auth: {
      username,
      password,
    },
  });
  return response.data;
}
async function deleteNode(entry_id) {
  let combinedUrl = `${url}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${entry_id}`;
  const response = await axios.delete(combinedUrl, {
    auth: {
      username,
      password,
    },
  });
  return response;
}

// deleteNode("2b7bc791-90c8-4b72-bf78-60b3c981c9d6");
async function uploadFile(entry_id, body, headers) {
  // Read file content
  // Make API request to upload file to Alfresco
  // `${url}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${entry_id}/children`
  if (!body[0]) {
    return res.status(400).json({ message: "Please provide a file." });
  }
  // console.log(body);

  const formData = new FormData();
  body.forEach((file) => {
    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append(file.fieldname, blob, file.originalname);
  });
  const response = await axios.post(
    `${url}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${entry_id}/children?autoRename=true`,
    formData,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString(
          "base64"
        )}`,
        headers,
      },
    }
  );
  return response;
}

async function fetchEntryParent(entry_id) {
  let subEntriesUrl = `${url}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${entry_id}/parents`;
  const res = await axios.get(subEntriesUrl, {
    auth: {
      username,
      password,
    },
  });
  return res.data.list;
}
async function fetchEntryMetaData(entry_id) {
  let subEntriesUrl = `${url}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${entry_id}`;
  const res = await axios.get(subEntriesUrl, {
    auth: {
      username,
      password,
    },
  });
  return res.data;
}
// fetchEntryMetaData("49d74a77-6575-48a3-834f-a6bef54bcd36");
async function buildEntryPath(entry_id, path) {
  let entryPath = path || [];
  let res = await fetchEntryParent(entry_id);
  if (res.entries?.length > 0) {
    entryPath.unshift(res.entries[0].entry);
    if (res.entries[0].entry.parentId) {
      await buildEntryPath(res.entries[0].entry.parentId, entryPath);
    }
  }
  // console.log(JSON.stringify(entryPath));
  return entryPath;
}

async function fetchEntryNavigation(entry_id) {
  return await buildEntryPath(entry_id);
}

// fetchFileContent("ac14adba-4a92-4d27-bddc-574263e0abd9").then((res) => {
//   console.log(res);
// });
export {
  fetchRootEntries,
  fetchSubEntries,
  fetchEntryNavigation,
  fetchFileContent,
  fetchEntryMetaData,
  createNewNode,
  uploadFile,
  deleteNode,
};
