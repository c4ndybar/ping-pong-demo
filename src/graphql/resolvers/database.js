const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuid } = require('uuid');

async function scanTable (tableName) {
    const params = {
        TableName: tableName,
    };

    let scanResults = [];
    let items;
    do {
        items = await dynamoDb.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey != "undefined");

    return scanResults;
};

const getAllPlayers = () => scanTable('players');
const getAllGames = () => scanTable('games');

const getPlayer = async (id) => {
    let data = await dynamoDb.get({
        TableName: 'players',
        Key: { id },
    }).promise();

    return data.Item;
}

const getGame = async (id) => {
    let data = await dynamoDb.get({
        TableName: 'games',
        Key: { id },
    }).promise();

    return data.Item;
}

const createPlayer = async (name) => {
    let player = { id: uuid(), name };
    let params = {
        TableName: 'players',
        Item: player,
    }

    await dynamoDb.put(params).promise()

    return player;
}

const createGame = async (homePlayerId, awayPlayerId, homePlayerScore, awayPlayerScore) => {
    let game = { id: uuid(), homePlayerId, awayPlayerId, homePlayerScore, awayPlayerScore };
    let params = {
        TableName: 'games',
        Item: game,
    }

    await dynamoDb.put(params).promise()

    return game;
}

module.exports = {
    createPlayer,
    getPlayer,
    getAllPlayers,
    createGame,
    getGame,
    getAllGames,
};