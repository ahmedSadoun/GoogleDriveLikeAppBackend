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

// fetchRootEntries();
export { fetchRootEntries, fetchSubEntries };
