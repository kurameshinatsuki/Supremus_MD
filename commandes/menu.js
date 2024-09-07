const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

zokou({ nomCom: "menu", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions;
    let { cm } = require(__dirname + "/../framework/zokou");
    var coms = {};
    var mode = "public";

    if ((s.MODE).toLocaleLowerCase() !== "yes") {
        mode = "private";
    }

    cm.map(async (com) => {
        if (!coms[com.categorie])
            coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('Etc/GMT');

    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    let infoMsg = `
╭─── *${s.BOT}* ───╮
• *Préfixe* : ${s.PREFIXE}
• *Propriétaire* : ${s.OWNER_NAME}
• *Mode* : ${mode}
• *Commandes* : ${cm.length}
• *Date* : ${date}
• *Heure* : ${temps}
• *Mémoire* : ${format(os.totalmem() - os.freemem())}/${format(os.totalmem())}
• *Plateforme* : ${os.platform()}
• *Développé par* : Supremus Prod
╰──────────────╯\n\n`;

    let menuMsg = `
╭─── 📋 *Commandes* 📋 ───╮`;

    for (const cat in coms) {
        menuMsg += `
├─── *${cat}* ───`;
        for (const cmd of coms[cat]) {
            menuMsg += `
• ${cmd}`;
        }
    }

    menuMsg += `
╰─── *Supremus Prod* ───╯`;

    var lien = mybotpic();
    var imageSpecific = 'lien/vers/image/specific.png'; // Remplacez par le lien de l'image spécifique

    if (!imageSpecific) {
        imageSpecific = lien;
    }

    try {
        if (imageSpecific.match(/\.(mp4|gif)$/i)) {
            zk.sendMessage(dest, { video: { url: imageSpecific }, caption: infoMsg + menuMsg, footer: "Je suis *Zokou-MD*, développé par Djalega++", gifPlayback: true }, { quoted: ms });
        } else if (imageSpecific.match(/\.(jpeg|png|jpg)$/i)) {
            zk.sendMessage(dest, { image: { url: imageSpecific }, caption: infoMsg + menuMsg, footer: "Je suis *Zokou-MD*, développé par Djalega++" }, { quoted: ms });
        } else {
            repondre(infoMsg + menuMsg);
        }
    } catch (e) {
        console.log("🥵🥵 Menu erreur " + e);
        repondre("🥵🥵 Menu erreur " + e);
    }
});