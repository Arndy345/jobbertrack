const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    jobs: [Job!]
  }
    enum Status{
    PENDING
    INTERVIEW
    DECLINED
  }
  type Job{
    id: ID!
    company: String!
    position: String!
    status:  Status
    user: String!
  }


  type Query {
    getUser(id:String!): User
    getUsers: [User!]
    getJobs: [Job!]
    getJob(jobId:String!): Job
  }
   type AuthPayload {
    token: String
    error: String
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): AuthPayload
    updateUser(name: String, email: String, password: String): User
    deleteUser(password:String!): User
    login(email: String!, password: String!): AuthPayload
    createJob(company:String!, position:String!, status:String): Job
    updateJob(jobId:String!, status:String!):Job
    deleteJob(jobId:String!, password:String!):Job
  }
`);

//DO CASCADE DELETING WHEN USER IS DELETED ALL JOBS GO
//SETUP DELETE JOBS TO WORK PROPERLY
module.exports = schema;
