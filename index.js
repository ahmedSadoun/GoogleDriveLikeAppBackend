import express from "express";
import cors from "cors";

import { fetchEntitiesById, fetchRootFolders } from "./Sources/filterSource.js";
import {
  fetchRootEntries,
  fetchSubEntries,
  fetchEntryNavigation,
  fetchFileContent,
  fetchEntryMetaData,
  createNewNode,
} from "./Sources/fetchAlfrescoEntries.js";
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(fetchRootFolders());
});
app.get("/subEntities/:entity_id", (req, res) => {
  //   console.log(req.params.entity_id);
  const entity_id = req.params.entity_id;
  res.send(fetchEntitiesById(entity_id));
});

app.get("/alFresco/root", async (req, res) => {
  const rootEntries = await fetchRootEntries();
  // console.log("ffff", rootEntries);
  res.send(rootEntries);
});

app.get("/alFresco/subEntries/:entry_id", async (req, res) => {
  const entry_id = req.params.entry_id;

  const subEntries = await fetchSubEntries(entry_id);
  // console.log("ffff", subEntries);
  res.send(subEntries);
});

app.get("/alFresco/entryNavigation/:entry_id", async (req, res) => {
  const entry_id = req.params.entry_id;

  const navigationList = await fetchEntryNavigation(entry_id);
  // console.log("ffff", navigationList);
  res.send(navigationList);
});

app.get("/alFresco/nodeContent/:entry_id", async (req, res) => {
  const entry_id = req.params.entry_id;

  const response = await fetchFileContent(entry_id);
  res.set("Content-Type", response.contentType);
  // console.log(response.arrayBuffer);
  // const buffer = Buffer.from(response.arrayBuffer);
  res.send(response.arrayBuffer);
});

app.get("/alFresco/nodeMetaData/:entry_id", async (req, res) => {
  const entry_id = req.params.entry_id;

  const fileMetaData = await fetchEntryMetaData(entry_id);
  // console.log("ffff", fileMetaData);
  res.send(fileMetaData);
});
app.post("/alFresco/createFolder", async (req, res) => {
  try {
    // console.log(req.body);
    // Check if the request body contains the required fields
    if (!req.body?.entry_id || !req.body?.folderName) {
      // If any of the required fields are missing, send a 400 Bad Request response
      return res
        .status(400)
        .send("Missing entry_id or folderName in request body");
    }

    // Call the function to create a new folder with the provided entry_id and folderName
    const createFolderResponse = await createNewNode(
      req.body.entry_id,
      req.body.folderName
    );

    // Send the response from the createNewNode function
    res.send(createFolderResponse);
  } catch (error) {
    // If an error occurs during folder creation, send a 500 Internal Server Error response
    console.error("Error creating folder:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
