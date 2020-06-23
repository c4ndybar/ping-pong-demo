# ping-pong-demo

A simple ping pong API demo app that uses Serverless, Node, GraphQL, Express, and DynamoDB.

#### To Run Locally
```
npm install
npm start
```

##### Run tests
```
npm test
```

#### Querying API
There is a graphqil interface currently deployed to https://k31helcvh5.execute-api.us-east-1.amazonaws.com/dev/api/graphql

The graphql schema is below.
```graphql
    type Query { 
        players: [Player] 
        player(id: String): Player
        games: [Game]
        game(id: String): Game
        rankings: [Ranking]
    }

    type Mutation {
        createPlayer(
            name: String!
        ): Player
        createGame( 
            homePlayerId: String!
            awayPlayerId: String!
            homePlayerScore: Int!
            awayPlayerScore: Int!
        ): Game
    }
```

#### To deploy using Serverless
```
serverless config credentials --provider aws --key <the key> --secret <the secret>
serverless deploy
```