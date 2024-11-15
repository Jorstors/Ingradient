let apiKey = "";
let apiID = "";

const apiCredentialsPromise = fetch("/api/edamam")
  .then((response) => response.json())
  .then((data) => {
    apiKey = data.apiKey;
    apiID = data.apiID;
  })
  .catch((error) => {
    console.error("Failed to fetch API credentials:", error);
  });

export { apiKey, apiID, apiCredentialsPromise };
