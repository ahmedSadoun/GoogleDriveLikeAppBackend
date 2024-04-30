import axios from "axios";
import fs from "fs";

// Step 1: Authenticate and obtain token
const username = "admin";
const password = "admin";
const authUrl =
  "http://localhost:8080/alfresco/api/-default-/public/authentication/versions/1/tickets";

axios
  .post(authUrl, { userId: username, password })
  .then((authResponse) => {
    const ticket = authResponse.data.entry.id;

    // Step 2: Retrieve file metadata
    const fileId = "ac14adba-4a92-4d27-bddc-574263e0abd9";
    const fileUrl = `http://localhost:8080/alfresco/api/-default-/public/alfresco/versions/1/nodes/${fileId}`;

    axios
      .get(fileUrl, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${username}:${password}`
          ).toString("base64")}`,
        },
      })
      .then((fileResponse) => {
        console.log(JSON.stringify(fileResponse));
        const downloadUrl = fileResponse.data?.entry.content.s3ContentUrl;

        // Step 3: Download file
        axios
          .get(downloadUrl, {
            responseType: "stream",
            headers: {
              Authorization: `Basic ${Buffer.from(
                `${username}:${password}`
              ).toString("base64")}`,
            },
          })
          .then((downloadResponse) => {
            // Step 4: Save file locally
            const filePath = "downloaded_file.pdf"; // Change the filename and extension as needed
            const writer = fs.createWriteStream(filePath);
            downloadResponse.data.pipe(writer);
            writer.on("finish", () => {
              console.log("File downloaded successfully.");

              // Now you can do whatever you want with the downloaded file, such as displaying it in HTML.
            });
            writer.on("error", (err) => {
              console.error("Error downloading file:", err);
            });
          })
          .catch((error) => {
            console.error("Error downloading file:", error.response);
          });
      })
      .catch((error) => {
        console.error("Error retrieving file metadata:", error.response);
      });
  })
  .catch((error) => {
    console.error("Error authenticating:", error.response);
  });
