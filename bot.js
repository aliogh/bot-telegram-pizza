const Bot = require('node-telegram-bot-api');
const request = require('request');
const moment = require('moment');
const token = '516377188:AAFHk5epML-Ioa804F_XaoU6KzqkliS-89M';
const trigger = 'I want to travel!';

const bot = new Bot(token, {polling: true});
let pedido ={
    tipo_entrega:null,
    direccion:null,
    hora:null,
    numero_pizzas:null,
    tipo_pizza:[],
}
let arrayAnswers = [];

bot.onText(/\/start/, (msg) => {
    let helloToUser = "Bienvenido a telepi " + msg.from.first_name + "! ¿Donde te gustaría tomar su pizza?";
    bot.sendMessage(msg.chat.id, helloToUser ,{
        "reply_markup": {
            "keyboard": [["A domicilio"],   ["Recoger en tienda"]]
        }
    });
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    let callback = msg.reply_to_message ? arrayAnswers[msg.reply_to_message.message_id] : null;
    if (callback) {
        delete arrayAnswers[msg.reply_to_message.message_id];
        callback(msg);
    }
    printMsgText(msg);

    // Domicilio
    let lugar_elegido = 'domicilio';
    if (msgContains(msg.text, lugar_elegido)){
        pedido.tipo_entrega = msg.text.toString();
        bot.sendMessage(msg.chat.id, "¿Dónde quieres que enviamos tu pizza?", {
            "parse_mode": "Markdown",
            one_time_keyboard: true,
            "reply_markup": JSON.stringify({
                "keyboard": [[{ text: "Localizarme", request_location: true }], ["Introducir direccion"]],
                hide_keyboard: true,
                one_time_keyboard: true
            })
        });
    }

    // Tienda
    let lugar = 'tienda';
    if (msgContains(msg.text, lugar)){
        pedido.tipo_entrega = msg.text.toString();
        sendHours(msg);
    }

    //Localizarme
    let localizarme = 'localizarme';
    if (msg && msg.location) {
        pedido.direccion = msg.location;
        sendHours(msg);
    }

    //Escribir dirección
    let escribir_direccion = 'introducir direccion';
    if (msgContains(msg.text, escribir_direccion)) {
        bot.sendMessage(msg.chat.id, "Escribanos su dirección", {
            "reply_markup": {
                "force_reply": true
            }
        }).then(data => {
            arrayAnswers[data.message_id] = (data) => {
                pedido.direccion = data.text;
                sendHours(data);
            }
        });
    }

    //Hora
    if (msgContains(msg.text, ':')) {
        pedido.hora = msg.text.toString();
        console.log('pedido', pedido);
    }


    // let tamaño_elegido = 'Mediana'
    // if (msgContains(msg.text, tamaño_elegido)){
    //     bot.sendMessage(msg.chat.id, "Como quieres tu pizza", {
    //         "reply_markup": {
    //             "keyboard": [["A tu gusto"],   ["Nuestras opciones"]]
    //             }
    //         });
    // }

    // let opcion_pizza = 'opciones'
    // if (msgContains(msg.text, opcion_pizza)){
    //     bot.sendMessage(msg.chat.id, "Selecciona una de nuestras opciones", {
    //         "reply_markup": {
    //             "keyboard": [["Carbonara"],   ["Barbacoa"], ["4 quesos"]]
    //             }
    //         });
    // }

});

function convertHour(minutes) {
    let hourWithMinutes = moment(new Date()).add(minutes, "m").toDate();
    return moment(hourWithMinutes).format("HH:mm");
}

function sendHours(msg) {
    bot.sendMessage(msg.chat.id,"Perfecto! ¿A que hora te gustaría recoger la pizza?",
      {
        one_time_keyboard: true,
        reply_markup: {
          keyboard: [[convertHour(30)],[convertHour(60)],[convertHour(90)]]
        }
      }
    );
}

function printMsgText(msg) {
    //console.log(msg);
    if(msg.text){
        //console.log(msg.text.toString());
    }
}

function msgContains(msgText, word) {
    //console.log('word: ', word, 'existe en', msgText, msgText.toString().toLowerCase().includes(word));
    return msgText ? msgText.toString().toLowerCase().includes(word) : false;
}


