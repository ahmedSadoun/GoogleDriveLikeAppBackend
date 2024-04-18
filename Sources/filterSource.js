import data from "./entities.json" assert { type: "json" };

// console.log(data);
function fetchRootFolders() {
  let rootEntities = data.filter((entity) => {
    return entity.parent_entity_id === "";
  });
  return rootEntities;
}

function getEntity(entity_id) {
  let rootEntities = data.filter((entity) => {
    return entity.entity_id == entity_id;
  });
  return rootEntities[0];
}
function getEntitySubEntitiesList(entity_id) {
  let rootEntities = data.filter((entity) => {
    return entity.parent_entity_id == entity_id;
  });
  return rootEntities;
}
function fetchEntitiesById(entity_id) {
  let entityObj = {};
  entityObj = getEntity(entity_id);
  entityObj.sub_entities = getEntitySubEntitiesList(entity_id);
  return entityObj;
}

// console.log(fetchEntitiesById(1));
export { fetchEntitiesById, fetchRootFolders };
