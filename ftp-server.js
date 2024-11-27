const ftp = require("ftp-srv");
const axios = require("axios");

const userRoot = "/storage/";
const maxRetries = 5;
const retryDelay = 2000; // 2 seconds

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getIPAddress = async () => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.get("http://127.0.0.1/api/v1/info");
      console.log("Response from the API:", response.data);
      return response.data.data.result.ethernet[0].IPv4[0].address;
    } catch (error) {
      console.error(`Attempt ${attempt} - Error fetching IP address:`, error);
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay / 1000} seconds...`);
        await delay(retryDelay);
      } else {
        throw new Error("Max retries reached. Unable to fetch IP address.");
      }
    }
  }
};

const createFTPServer = async () => {
  try {
    const ipAddress = await getIPAddress();
    console.log("IP address:", ipAddress);

    const server = new ftp({
      url: `ftp://${ipAddress}:21`, // Use the obtained IP address and port 21
      pasv_url: ipAddress,
      pasv_min: 1024,
      pasv_max: 1048,
      anonymous: true,
      greeting: "Welcome to the FTP server!",
    });

    server.on("login", (data, resolve, reject) => {
      resolve({ root: userRoot });
    });

    await server.listen();

    console.log(`FTP server is running on ${server.options.url}`);
    return server;
  } catch (error) {
    console.error("Error setting up FTP server:", error);
  }
};

module.exports = createFTPServer();
