const jsonBase = require("./config/appsettings.json");

const env = process.env.NODE_ENV || "production";

const envText = env == "development" ? "Development" : "Production";
const jsonEnv = require("./config/appsettings." + envText + ".json");

module.exports = {
	...jsonBase,
	...jsonEnv,
};
