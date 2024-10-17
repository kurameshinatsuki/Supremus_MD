"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { zokou } = require("../framework/zokou");
zokou({ nomCom: "test", reaction: "😌", nomFichier: __filename, categorie: 'MON-BOT' }, async (dest, zk, commandeOptions) => {
    console.log("Commande saisie !!!s");
    let z = 'Salut je suis *SP-ZK-MD* un bot WhatsApp dynamique et tout droit réserver au service de la *🪀 Supremus Prod 🪀*\n\n";
    let d = 'développer par *Jøhñ Sũpręmũs*';
    let varmess = z + d;
    var img = 'https://i.ibb.co/k81T2WX/image.jpg';
    await zk.sendMessage(dest, { image: { url: img }, caption: varmess });
    //console.log("montest")
});
console.log("mon test");