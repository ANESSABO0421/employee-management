const fs = require("fs");
const url = require("url");
const http = require("http");
const { MongoClient, ObjectId } = require("mongodb");
const { error } = require("console");
const port = 3000;

const client = new MongoClient("mongodb://127.0.0.1:27017/");

const server = http.createServer(async (req, res) => {
  const db = client.db("employeeDB");
  const collections = db.collection("employees");

  const path = url.parse(req.url).pathname;

  //routes
  if (path === "/register") {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(fs.readFileSync("./register.html"));
  } else if (path === "/") {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(fs.readFileSync("./enter.html"));
  } else if (path === "/home") {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(fs.readFileSync("./Home.html"));
  } else if (path === "/handlegetData.js") {
    res.writeHead(200, { "content-type": "text/js" });
    res.end(fs.readFileSync("./handlegetData.js"));
  } else if (path === "/edit") {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(fs.readFileSync("./edit.html"));
  }

  //api
  /////////////////////////POST/////////////////////////////
  if (path === "/post" && req.method === "POST") {
    try {
      let body = "";
      req.on("data", (chunks) => {
        body += chunks.toString();
      });
      req.on("end", async () => {
        let objectData = JSON.parse(body);
        let insertData = await collections.insertOne(objectData);
        if (insertData) {
          res.writeHead(200, { "content-type": "text/plain" });
          res.end("data inserted");
        }
      });
    } catch (error) {
      res.writeHead(500, { "content-type": "text/plain" });
      res.end(error);
    }
  }
  //////////////////////////GET////////////////////////////
  if (path === "/get" && req.method === "GET") {
    try {
      let getData = await collections.find().toArray();
      console.log(getData);
      let stringData = JSON.stringify(getData);
      // console.log(stringData);

      if (getData) {
        res.writeHead(200, { "content-type": "text/plain" });
        res.end(stringData);
      }
    } catch (error) {
      res.writeHead(500, { "content-type": "text/plain" });
      res.end(error);
    }
  }
  //////////////////////////DELETE////////////////////////////
  if (path === "/delete" && req.method === "DELETE") {
    try {
      let body = "";
      req.on("data", (chunks) => {
        body += chunks.toString();
      });

      req.on("end", async () => {
        let objectData = JSON.parse(body);
        let deleteData = await collections.deleteOne({
          _id: new ObjectId(objectData._id),
        });
        // console.log(deleteData)
        if (deleteData) {
          res.writeHead(200, { "content-type": "text/plain" });
          res.end("data is deleted");
        } else {
          console.log("data is not deleted");
        }
      });
    } catch (error) {
      res.writeHead(500, { "content-type": "text/plain" });
      res.end(error);
    }
  }
  //////////////////////////update////////////////////////////
  if (path === "/update" && req.method === "PUT") {
    try {
      let body = "";
      req.on("data", (chunks) => {
        body += chunks.toString();
      });
      req.on("end", async () => {
        let objectData = JSON.parse(body);
        let updateData = await collections.updateOne(
          { _id: new ObjectId(objectData._id) },
          {
            $set: {
              name: objectData.name,
              email: objectData.email,
              password: objectData.password,
            },
          }
        );
        if (updateData) {
          res.writeHead(200, { "content-type": "text/plain" });
          res.end("data is updated");
        } else {
          console.log("data is not updated");
        }
      });
    } catch (error) {
      res.end(500, { "content-type": "text/plain" });
      res.end(error);
    }
  }
  //////////////////LOGIN////////////////////////////
  if (path === "/forEnter" && req.method === "POST") {
    try {
      let body = "";
      req.on("data", (chunks) => {
        body += chunks.toString();
      });
      req.on("end", async () => {
        let objectData = JSON.parse(body);
        const { email, password } = objectData;
        let logIn = await collections.findOne({ email, password });

        if (logIn) {
          console.log("successfully loggedIn");
          res.writeHead(200, { "content-type": "text/plain" });
          res.end(JSON.stringify(logIn));
        } else {
          console.log("user not found");
        }
      });
    } catch (error) {
      res.writeHead(500, { "content-type": "text/plain" });
    }
  }
});

client
  .connect()
  .then(() => {
    console.log("MongoDB connected!!!");
    server.listen(port, () => {
      console.log(`server created at http://localhost:3000`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
