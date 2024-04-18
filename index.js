import express from "express";
import cors from "cors";
import { fetchEntitiesById, fetchRootFolders } from "./Sources/filterSource.js";
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
