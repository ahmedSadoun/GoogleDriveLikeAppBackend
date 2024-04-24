import axios from "axios";

const url =
  "http://localhost:8080/alfresco/api/-default-/public/alfresco/versions/1/nodes";
const username = "admin";
const password = "admin";

async function fetchRootEntries() {
  const res = await axios.get(
    url + "/-root-/children?skipCount=0&maxItems=100",
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
  let subEntriesUrl = `${url}/${entry_id}/children?skipCount=0&maxItems=100`;
  const res = await axios.get(subEntriesUrl, {
    auth: {
      username,
      password,
    },
  });

  return res.data;
}
async function fetchEntryParent(entry_id) {
  let subEntriesUrl = `${url}/${entry_id}/parents`;
  const res = await axios.get(subEntriesUrl, {
    auth: {
      username,
      password,
    },
  });
  // console.log(res.data);
  return res.data.list;
}
// fetchEntryParent("49d74a77-6575-48a3-834f-a6bef54bcd36");
async function buildEntryPath(entry_id, path) {
  let entryPath = path || [];
  let res = await fetchEntryParent(entry_id);
  // console.log(JSON.stringify(res.entries));
  if (res.entries?.length > 0) {
    entryPath.push(res.entries[0].entry);
    if (res.entries[0].entry.parentId) {
      await buildEntryPath(res.entries[0].entry.parentId, entryPath);
    }
  }
  // console.log(JSON.stringify(entryPath));
  return entryPath;
}

buildEntryPath("7a91cb8d-3298-4a0f-b86b-9d463738c95a").then((res) => {
  console.log("Sssssssss", res);
});
export { fetchRootEntries, fetchSubEntries };
