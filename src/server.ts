// Use server.ts to control an express app and a custom lickety-split app that uses our Lickety Split framework
// apps can listen on different ports simultaneously as defined in config.json

import config from "./config.json";
import expressApp from "./expressApp";

// Express Application
expressApp.listen(config.EXPRESS_PORT, () => console.log(`Express Server started on port ${config.EXPRESS_PORT}`));