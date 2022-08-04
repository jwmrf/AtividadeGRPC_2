const readline = require('readline')
const crypto = require('crypto')
const myId = crypto.randomUUID() //Id identificador único de cada cliente
let cadastrado = false
let historicoMensagens = []
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const client = require('./client-grpc')
client.Hello({flag: true}, (error, resultado) => {
    if (!error) {
        console.log(`Servidor: ${resultado.texto}`)
    } else {
        console.log("Servidor: Lamento Irmão, deu ruim no servidor...")
    }

})
setInterval ( () => {
    const call = client.receberMensagens();
    call.on("data", item => {
        if (cadastrado && item.id != myId && historicoMensagens.indexOf(item.mensagemId) == -1) {
            historicoMensagens.push(item.mensagemId)
            console.log(`${item.from}: ${item.texto}`)
        }
    })
},500)
rl.addListener('line', line => {
    if (cadastrado) {
        client.Envio({id: myId, from:myId ,texto:line, mensagemId: ""}, (error, resultado) => {})
    } else {
        client.Cadastro({id: myId, nome: line}, (error, resultado) => {
            if (!resultado.erro) {
                cadastrado = true
                console.log(`Servidor: Cadastro Concluído`)
            } else {
                console.log("Servidor: Lamento Irmão, deu ruim no servidor...")
            }
        })
    }
})
