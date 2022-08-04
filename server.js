const grpc = require('grpc')
const protoLoader = require("@grpc/proto-loader")
const packageDef = protoLoader.loadSync("notes.proto", {});
const notesProto = grpc.loadPackageDefinition(packageDef);
//const notesProto = grpc.load('notes.proto')
const server = new grpc.Server();
const crypto = require('crypto')

var clientsName = [] //Array que fará a relação de cada id de cliente com seu respectivo nome
var messageList = [] //Array que irá armazenar as mensagens que serão enviadas
var clientsCount = 0

function Envio(call) {
    let uniqueMessageId = crypto.randomUUID() //Cada mensagem possuirá um ID único
    let item = call.request
    messageList.push({
        from : clientsName[item.from].nome,
        texto : item.texto,
        id : item.id,
        mensagemId : uniqueMessageId
    })
}

server.addService(notesProto.EnviarMensagem.service, {
    Envio:Envio,
    Hello: (Hello , callback) => {
        callback(null,{texto:`Há ${clientsCount} Usuários no chat, informe seu nickname:`})
    },
    Cadastro: (cadastro , callback) => {
        let id = cadastro.request.id
        let nome = cadastro.request.nome
        clientsName[id] = {nome : nome}
        clientsCount ++
        console.log(`Cadastrando: ${nome}`)
        callback(null,"")
    },
    receberMensagens: receberMensagens
})

function receberMensagens(call) {
    for (let todo of messageList ) {
        call.write(todo)
    }
    call.end();
}

server.bind('127.0.0.1:3000', grpc.ServerCredentials.createInsecure())
console.log('Servidor rodando em: http://127.0.0.1:3000')
server.start()
