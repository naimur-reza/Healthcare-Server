import { app } from "./app";

const port = 3000;

async function main() {
  app.listen(port, () => {
    console.log("Listening on port 3000");
  });
}

main();
