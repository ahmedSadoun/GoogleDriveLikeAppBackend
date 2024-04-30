import AlfrescoApi from "alfresco-js-api-node";

// Set your Alfresco server details
const alfrescoConfig = {
  hostEcm: "http://localhost:8080", // Replace with your Alfresco server URL
  authType: "BASIC",
  username: "admin", // Admin username
  password: "admin", // Admin password
};

// Initialize the Alfresco API
const alfrescoApi = new AlfrescoApi(alfrescoConfig);

function impersonate(username) {
  // Authenticate as admin and obtain a ticket
  alfrescoApi
    .login("admin", "admin")
    .then(() => {
      // Impersonate a user (replace with the desired username)
      const userToImpersonate = username;

      // Fetch content from the user's folder
      alfrescoApi.nodes
        .getNodeChildren("-my-", {
          relativePath: `User Homes/${userToImpersonate}/`, // Adjust the path as needed
        })
        .then((data) => {
          console.log(
            `Content for user ${userToImpersonate}:`,
            data.list.entries
          );
        })
        .catch((error) => {
          console.error("Error fetching user content:", error);
        });
    })
    .catch((error) => {
      console.error("Error authenticating as admin:", error);
    });
}

// console.log("impersonate")
// impersonate("ahmed.saadoun");

export { impersonate };
