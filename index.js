import express from "express";
import cors from "cors";
import { fetchEntitiesById, fetchRootFolders } from "./Sources/filterSource.js";
import {
  fetchRootEntries,
  fetchSubEntries,
} from "./Sources/fetchAlfrescoEntries.js";
const app = express();
const port = 3000;
app.use(cors());

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

  const rootEntries = await fetchSubEntries(entry_id);
  // console.log("ffff", rootEntries);
  res.send(rootEntries);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
