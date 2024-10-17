"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { zokou } = require("../framework/zokou");
zokou({ nomCom: "test", reaction: "😌", nomFichier: __filename }, async (dest, zk, commandeOptions) => {
    console.log("Commande saisie !!!s");
    let z = 'Salut je suis *SP-ZK-MD* \n\n ' + "un bot WhatsApp dynamique et tout droit réserver au service de la *🪀 Supremus Prod 🪀*";
    let d = 'développer par Jøhñ Sũpręmũs*';
    let varmess = z + d;
    var img = 'https://telegra.ph/file/6b7908c144473822efdf9.jpg';
    await zk.sendMessage(dest, { image: { url: img }, caption: varmess });
    //console.log("montest")
});
console.log("mon test");