const { buildSchema } = require("graphql");

// const {
// 	login,
// 	signup,
// } = require("./controllers/auth");

const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
  }

  type Query {
    getUser(id: String!): User
    getUsers: [User]
    
  }
   type SignInResponse {
    token: String
    error: String
  }
 
   type SignUpResponse {
    token: String
    error: String
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): SignUpResponse
    updateUser(id: ID!, name: String, email: String, password: String): User
    deleteUser(id: ID!): User
    login(email: String!, password: String!): SignInResponse
  }
`);

module.exports = schema;
