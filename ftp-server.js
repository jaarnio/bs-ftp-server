const ftp = require("ftp-srv");
const axios = require("axios");

const userRoot = "/storage/";

const createFTPServer = async () => {
  try {
    const response = await axios.get("http://localhost/api/v1/info");
    // Get the IP address of the first Ethernet interface. Add logic for other interfaces.
    const ipAddress = response.data.data.result.ethernet[0].IPv4[0].address;

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
    console.error("Error fetching IP address:", error);
  }
};

module.exports = createFTPServer();
