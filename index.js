const mongoose = require("mongoose");

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require("./models/Recipe.model");
// Import of the data from './data.json'
const data = require("./data");

const MONGODB_URI = "mongodb://localhost:27017/recipe-app";

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((self) => {
    console.log(`Connected to the database: "${self.connection.name}"`);
    // Before adding any documents to the database, let's delete all previous entries
    return self.connection.dropDatabase();
  })
  .then(() => {
    //ITERATION 2
    // Recipe.create(data[0])
    //   .then((result) => {
    //   console.log(result.title)
    // })

    let insertPromise = Recipe.insertMany(data);
    insertPromise
      .then((result) => {
        for (let rec of result) {
          console.log(rec.title);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return Promise.all([insertPromise])

  })
  .then(() => {
    Recipe.findOneAndUpdate(
      { title: "Rigatoni alla Genovese" },
      { duration: 100 }
    )
      .then(() => {
        console.log("The Duration of the recipe has been Updated");
      })
      .catch((error) => {
        console.log(error);
      });
    Recipe.deleteOne({ title: "Carrot Cake" }).then(() => {
      console.log("Carrot Cake has been successfully deleted");
      mongoose.connection.close();
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });
