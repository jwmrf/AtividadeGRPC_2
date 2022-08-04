const grpc = require('grpc')
const protoLoader = require("@grpc/proto-loader")
const packageDef = protoLoader.loadSync("../notes.proto", {});
const EnviarMensagem = grpc.loadPackageDefinition(packageDef).EnviarMensagem

const client = new EnviarMensagem('localhost:3000',
    grpc.credentials.createInsecure())
    
module.exports = client