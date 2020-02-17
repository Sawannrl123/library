const express = require('express');
const graphqlHTTP = require("express-graphql");
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const port = 4000;
const app = express();

//allow cross-origin request
app.use(cors());

//connect to mlab database
mongoose.connect('mongodb+srv://sawan:sawan@graphql-learning-bdbje.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
  console.log("Connected to database");
})

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})