const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
  }

  type Query {
    getUser: User
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
    updateUser(name: String, email: String, password: String): User
    deleteUser(password:String): User
    login(email: String!, password: String!): SignInResponse
  }
`);

module.exports = schema;
