import { Server } from "http";
import { app } from "./app";
import configs from "./app/configs";

async function main() {
  const server: Server = app.listen(configs.port, () => {
    console.log("Sever is running on port ", configs.port);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server closed!");
      });
    }
    process.exit(1);
  };
  process.on("uncaughtException", error => {
    console.log(error);
    exitHandler();
  });

  process.on("unhandledRejection", error => {
    console.log(error);
    exitHandler();
  });
}

main();
