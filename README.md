# library

There are two folder `server` and `client`.

### clone

- `git clone https://github.com/Sawannrl123/library.git`
- `cd library`

### dependency

- node 12+
- npm 6+

1. # Server

   ### installation

   - `cd server`
   - `npm i`
   - `nodemon app or node app`

   Your server is running on `http://localhost:4000`

   ### Technology Used

   - `Node/Express:- Making the server and handling the graphql route.`
   - `Cors:- Handling the cross origin request.`
   - `Mongoose:- interaction with the mongo db.`
   - `express-graphql:- Handling the graphql query`

   ### Description

   1. Schema folder contain the differnt schema/endpoint for graphql.
   2. Models folder contain the different type of model.
   3. App file have all is middleware and the server config.

2. # Client

   ### installation

   - `cd client`
   - `npm i`
   - `npm run start`

   Your app is running on `http://localhost:3000`

   ### Technology Used

   - `React:- Making the UI interaction`
   - `Apollo:- Handling the graphql client query`
   - `graphql:- graphql client for constructing the query`

   ### Description

   1. Public folder consist the basic setup of client app.
   2. Src folder consist the different components and queries.
