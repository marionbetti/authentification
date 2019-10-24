const articlesRouter = require("./router/articles");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
app.use("/api/articles", articlesRouter);

mongoose
  .connect("mongodb://localhost/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  .then(function() {
    console.log("Connecté à la base blog MongoDB");
  })
  .catch(function(err) {
    console.log(new Error(err));
  });

const port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log(`Serveur start et ecoute le port ${port}`);
});
