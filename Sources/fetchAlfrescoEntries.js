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
async function fetchFileContentThumbNail(entry_id, fileContentType) {
  //http://127.0.0.1:8080/alfresco/s/api/node/workspace/SpacesStore/2fa8a7b9-9336-46e2-bac6-2a0ed5a07e2c/content/thumbnails/imgpreview?c=queue&amp;ph=true&amp;
  try {
    let combinedUrl = `${url}/alfresco/s/api/node/workspace/SpacesStore/${entry_id}/content/thumbnails/${fileContentType}?c=queue&amp;ph=true&amp;lastModified=1`;
    const response = await axios.get(combinedUrl, {
      responseType: "arraybuffer", // Ensure binary response
      auth: {
        username,
        password,
      },
    });
    if (response.status == 404) {
      createFileContentThumbNail(entry_id, fileContentType);
    }
    return {
      status: response.status,
      arrayBuffer: response.data,
      contentType: response.headers["content-type"],
    };
  } catch (error) {
    console.error("Error fetching thumbnail:");
    throw error; // re-throw the error to propagate it
  }
}
// if the thumbnail wasn't found, then create it.
async function createFileContentThumbNail(entry_id, fileContentType) {
  //http://127.0.0.1:8080/alfresco/s/api/node/workspace/SpacesStore/2fa8a7b9-9336-46e2-bac6-2a0ed5a07e2c/content/thumbnails/imgpreview?c=queue&amp;ph=true&amp;
  try {
    let combinedUrl = `${url}/alfresco/s/api/node/workspace/SpacesStore/${entry_id}/content/thumbnails/${fileContentType}?c=force`;
    await axios.get(combinedUrl, {
      responseType: "arraybuffer", // Ensure binary response
      auth: {
        username,
        password,
      },
    });
  } catch (error) {
    console.error("Error fetching thumbnail:");
    throw error; // re-throw the error to propagate it
  }
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
async function updateNodeMetaData(entry_id, metaData) {
  let data = {
    ...metaData,
  };
  // console.log("Sssssssssss", data);
  // return;
  let combinedUrl = `${url}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${entry_id}`;
  const response = await axios.put(combinedUrl, data, {
    auth: {
      username,
      password,
    },
  });
  return response.data;
}
async function fetchNodeMetaData(entry_id) {
  try {
    // Construct the URL
    let combinedUrl = `${url}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${entry_id}?include=properties`;

    // Make the API request

    const res = await axios.get(combinedUrl, {
      auth: {
        username,
        password,
      },
    });

    // Return the data if successful
    return { resBody: res.data, statusCode: 200 };
  } catch (error) {
    return {
      resBody: error.response.data,
      statusCode: error.response.data.error.statusCode,
    };
  }
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
// console.log("Aaaaaaa");
// fetchNodeMetaData("2b7bc791-90c8-4b72-bf78-60b3c981c9d6");

async function uploadFile(entry_id, body, headers) {
  if (!body[0]) {
    return res.status(400).json({ message: "Please provide a file." });
  }
  const formData = new FormData();
  body.forEach((file) => {
    const blob = new Blob([file.buffer], { type: file.mimetype });
    // for arabic letters, this solves the encoding problem
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    formData.append(file.fieldname, blob, file.originalname);
  });
  const response = await axios.post(
    `${url}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${entry_id}/children?autoRename=true`,
    formData,
    {
      auth: {
        username,
        password,
      },
      headers: {
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
  fetchFileContentThumbNail,
  fetchNodeMetaData,
  updateNodeMetaData,
};
