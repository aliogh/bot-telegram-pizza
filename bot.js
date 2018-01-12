const Bot = require('node-telegram-bot-api');
const request = require('request');
const token = '516377188:AAFHk5epML-Ioa804F_XaoU6KzqkliS-89M';
const trigger = 'I want to travel!';

const bot = new Bot(token, {polling: true});
var pedido ={
    tipo_entrega:null,
    direccion:null,
    hora:null,
    numero_pizzas:null,
    tipo_pizza:[],
}

bot.onText(/\/start/, (msg) => {
    
    bot.sendMessage(msg.chat.id, "Bienvenido a telepi, Donde quieres tu pizza?",{
        "reply_markup": {
            "keyboard": [["A domicilio"],   ["Recoger en tienda"]]
            }
        });
        
    });


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    // Lugar Pedido
    var lugar_elegido = 'domicilio'
    if(msg.text.toString().includes(lugar_elegido)){
        pedido.tipo_entrega = msg.text.toString();
        // console.log(pedido); 
        bot.sendMessage(msg.chat.id, "¿Dónde quieres que enviamos tu pizza?", {
            "reply_markup": {
                "keyboard": [["Localizarme"],   ["Introducir direccion"]]
                }
            });
    }

    // Direccion
    var localizacion = 'Localizarme';
    if(msg.text.toString().includes(localizacion)){
        var actual_date = Date.now();
        console.log(actual_date);
        var date_plus_30 = new Date(date_plus_30m + 1800000 )
        var date_options = ['+30m','+1h'];

        bot.sendMessage(msg.chat.id, "¿A que hora quieres las pizzas?", {
            "reply_markup": {
                "keyboard": [date_options]
                }
            });
    }

    var tamaño_elegido = 'Mediana'
    if(msg.text.toString().indexOf(tamaño_elegido) === 0){
        bot.sendMessage(msg.chat.id, "Como quieres tu pizza", {
            "reply_markup": {
                "keyboard": [["A tu gusto"],   ["Nuestras opciones"]]
                }
            });
    }

    var opcion_pizza = 'opciones'
    if(msg.text.toString().includes(opcion_pizza)){
        bot.sendMessage(msg.chat.id, "Selecciona una de nuestras opciones", {
            "reply_markup": {
                "keyboard": [["Carbonara"],   ["Barbacoa"], ["4 quesos"]]
                }
            });
    }
    
  });

  


