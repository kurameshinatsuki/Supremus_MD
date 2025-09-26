"use strict";

// ==============================
// IMPORTS ET CONFIGURATIONS INITIALES
// ==============================

const {
    default: makeWASocket,
    Browsers,
    delay,
    fetchLatestBaileysVersion,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    jidDecode,
    getContentType,
    downloadContentFromMessage,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const { Boom } = require("@hapi/boom");
const pino = require("pino");
const fs = require("fs-extra");
const path = require("path");
const express = require("express");

// Configuration de l'application
const conf = require("./set");

// Modules métier
const evt = require("./framework/zokou");
const { reagir } = require("./framework/app");
const getJid = require("./framework/cacheJid");

// ==============================
// CONFIGURATION GLOBALE
// ==============================

const session = conf.session.replace(/Zokou-MD-WHATSAPP-BOT;;;=>/g, "");
const prefixe = conf.PREFIXE;
let pair = false;

// Configuration du navigateur personnalisée
const BROWSER_CONFIG = ['Ubuntu', 'Chrome', '128.0.6613.86'];

// ==============================
// CLASSES ET FONCTIONS UTILITAIRES
// ==============================

class WhatsAppBot {
    constructor() {
        this.zk = null;
        this.isConnected = false;
    }

    /**
     * Décode un JID WhatsApp
     */
    static decodeJid(jid) {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server ? 
                decode.user + '@' + decode.server : jid;
        }
        return jid;
    }

    /**
     * Extrait le texte d'un message selon son type
     */
    static extractText(message) {
        const mtype = getContentType(message);
        
        switch (mtype) {
            case "conversation":
                return message.conversation || "";
            case "imageMessage":
                return message.imageMessage?.caption || "";
            case "videoMessage":
                return message.videoMessage?.caption || "";
            case "extendedTextMessage":
                return message.extendedTextMessage?.text || "";
            case "buttonsResponseMessage":
                return message.buttonsResponseMessage?.selectedButtonId || "";
            case "listResponseMessage":
                return message.listResponseMessage?.singleSelectReply?.selectedRowId || "";
            default:
                return "";
        }
    }

    /**
     * Gestionnaire d'erreurs centralisé
     */
    static handleError(error, context = "Général") {
        console.error(`❌ Erreur [${context}]:`, error.message);
        if (conf.DEBUG_MODE) {
            console.error(error.stack);
        }
    }
}

class MessageProcessor extends WhatsAppBot {
    constructor(zk) {
        super();
        this.zk = zk;
    }

    /**
     * Traite un message entrant
     */
    async processMessage(m) {
        try {
            const { messages } = m;
            const ms = messages[0];
            
            if (!ms.message) return;

            const messageInfo = await this.extractMessageInfo(ms);
            await this.executeMessageActions(messageInfo);
            
        } catch (error) {
            WhatsAppBot.handleError(error, "Traitement message");
        }
    }

    /**
     * Extrait toutes les informations d'un message
     */
    async extractMessageInfo(ms) {
        const mtype = getContentType(ms.message);
        const texte = WhatsAppBot.extractText(ms.message);
        const origineMessage = WhatsAppBot.decodeJid(ms.key.remoteJid);
        const idBot = WhatsAppBot.decodeJid(this.zk.user.id);
        const servBot = idBot.split('@')[0];
        const verifGroupe = origineMessage?.endsWith("@g.us");

        // Métadonnées du groupe
        let infosGroupe = "";
        let nomGroupe = "";
        if (verifGroupe) {
            infosGroupe = await this.zk.groupMetadata(origineMessage);
            nomGroupe = infosGroupe.subject;
        }

        // Auteur du message
        const auteurMessage = await this.getAuthorInfo(ms, origineMessage, idBot, verifGroupe);
        const nomAuteurMessage = ms.pushName;

        // Message répondu
        const msgRepondu = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
        const auteurMsgRepondu = await getJid(
            WhatsAppBot.decodeJid(ms.message?.extendedTextMessage?.contextInfo?.participant),
            origineMessage,
            this.zk
        );

        return {
            ms,
            mtype,
            texte,
            origineMessage,
            idBot,
            servBot,
            verifGroupe,
            infosGroupe,
            nomGroupe,
            auteurMessage,
            nomAuteurMessage,
            msgRepondu,
            auteurMsgRepondu,
            mentions: ms.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
        };
    }

    /**
     * Obtient les informations de l'auteur du message
     */
    async getAuthorInfo(ms, origineMessage, idBot, verifGroupe) {
        let auteur = WhatsAppBot.decodeJid(
            verifGroupe ? (ms.key.participant || ms.participant) : origineMessage
        );

        if (ms.key.fromMe) {
            auteur = idBot;
        }

        return await getJid(auteur, origineMessage, this.zk);
    }
}

// ==============================
// INITIALISATION DU BOT
// ==============================

async function initializeBot() {
    try {
        console.log("🚀 Initialisation du bot Supremus-MD...");

        const { isLatest } = await fetchLatestBaileysVersion();
        const { state, saveCreds } = await useMultiFileAuthState(__dirname + "/auth");

        const sockOptions = {
            logger: pino({ level: "silent" }),
            browser: BROWSER_CONFIG,
            syncFullHistory: false,
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: true,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
            },
        };

        const zk = makeWASocket(sockOptions);
        
        await handlePairing(zk);
        setupEventHandlers(zk, saveCreds);

        return zk;

    } catch (error) {
        WhatsAppBot.handleError(error, "Initialisation bot");
        process.exit(1);
    }
}

/**
 * Gère le processus de pairing
 */
async function handlePairing(zk) {
    if (!zk.authState.creds.registered && !pair) {
        try {
            await delay(3000);
            const code = await zk.requestPairingCode(conf.NUMERO_PAIR);
            console.log("🔗 CODE DE PAIRAGE : ", code);
            pair = true;
        } catch (err) {
            console.error("❌ Erreur lors du pairage :", err.message);
        }
    }
}

/**
 * Configure les gestionnaires d'événements
 */
function setupEventHandlers(zk, saveCreds) {
    // Événement de mise à jour des credentials
    zk.ev.on("creds.update", saveCreds);

    // Événement de connexion
    zk.ev.on("connection.update", (con) => handleConnectionUpdate(con, zk));

    // Événement de messages
    zk.ev.on("messages.upsert", async (m) => {
        const processor = new MessageProcessor(zk);
        await processor.processMessage(m);
    });

    // Événement de groupes
    zk.ev.on("group-participants.update", async (group) => {
        await handleGroupUpdate(group, zk);
    });
}

// ==============================
// GESTIONNAIRES D'ÉVÉNEMENTS (PARTIE 1)
// ==============================

/**
 * Gère les mises à jour de connexion
 */
async function handleConnectionUpdate(con, zk) {
    const { lastDisconnect, connection, receivedPendingNotifications } = con;
    
    switch (connection) {
        case "connecting":
            console.log("ℹ️ Connexion en cours...");
            break;
            
        case "open":
            await handleSuccessfulConnection(zk);
            break;
            
        case "close":
            await handleConnectionClose(lastDisconnect);
            break;
    }
}

/**
 * Gère une connexion réussie
 */
async function handleSuccessfulConnection(zk) {
    console.log("✅ Connexion réussie !");
    await displayConnectionAnimation();
    
    console.log("📦 Chargement des commandes...");
    await loadCommands();
    
    await activateCrons(zk);
    await sendStartupMessage(zk);
}

/**
 * Affiche une animation de connexion
 */
async function displayConnectionAnimation() {
    const steps = [
        "🚀 Démarrage...",
        "📡 Connexion...", 
        "✅ Connecté !"
    ];
    
    for (const step of steps) {
        console.log(step);
        await delay(500);
    }
}

// ==============================
// CHARGEMENT DES COMMANDES
// ==============================

async function loadCommands() {
    const commandesDir = __dirname + "/commandes";
    
    if (!fs.existsSync(commandesDir)) {
        console.log("❌ Dossier 'commandes' introuvable");
        return;
    }

    const fichiers = fs.readdirSync(commandesDir).filter(f => 
        path.extname(f).toLowerCase() === ".js"
    );

    let commandesChargees = 0;
    
    for (const fichier of fichiers) {
        try {
            require(path.join(commandesDir, fichier));
            console.log(`✅ ${fichier} chargé`);
            commandesChargees++;
            await delay(100);
        } catch (error) {
            console.log(`❌ ${fichier} - Erreur: ${error.message}`);
        }
    }
    
    console.log(`📊 ${commandesChargees}/${fichiers.length} commandes chargées`);
}

// ==============================
// GESTIONNAIRES D'ÉVÉNEMENTS (PARTIE 2)
// ==============================

/**
 * Gère la fermeture de connexion
 */
async function handleConnectionClose(lastDisconnect) {
    const raisonDeconnexion = new Boom(lastDisconnect?.error)?.output.statusCode;
    
    const raisons = {
        [DisconnectReason.badSession]: "Session invalide - Rescanner le QR code",
        [DisconnectReason.connectionClosed]: "Connexion fermée - Reconnexion...",
        [DisconnectReason.connectionLost]: "Connexion perdue - Reconnexion...",
        [DisconnectReason.connectionReplaced]: "Connexion remplacée - Fermer l'autre session",
        [DisconnectReason.loggedOut]: "Déconnecté - Rescanner le QR code",
        [DisconnectReason.restartRequired]: "Redémarrage requis..."
    };

    if (raisons[raisonDeconnexion]) {
        console.log(`🔌 ${raisons[raisonDeconnexion]}`);
    } else {
        console.log(`🔌 Redémarrage (erreur ${raisonDeconnexion})`);
    }

    // Reconnexion automatique pour certaines erreurs
    if ([DisconnectReason.connectionClosed, DisconnectReason.connectionLost, DisconnectReason.restartRequired].includes(raisonDeconnexion)) {
        await delay(5000);
        main();
    }
}

/**
 * Gère les mises à jour des groupes
 */
async function handleGroupUpdate(group, zk) {
    try {
        console.log(`👥 Mise à jour groupe: ${group.action} dans ${group.id}`);
        
        let ppgroup;
        try {
            ppgroup = await zk.profilePictureUrl(group.id, 'image');
        } catch {
            ppgroup = 'https://telegra.ph/file/4cc2712eee93c105f6739.jpg';
        }

        const metadata = await zk.groupMetadata(group.id);
        await executeGroupAction(group, zk, metadata, ppgroup);

    } catch (error) {
        WhatsAppBot.handleError(error, "Mise à jour groupe");
    }
}

/**
 * Exécute les actions selon le type de mise à jour du groupe
 */
async function executeGroupAction(group, zk, metadata, ppgroup) {
    const { recupevents } = require('./bdd/welcome');
    const actionHandlers = {
        'add': async () => await handleNewMember(group, zk, metadata, ppgroup, recupevents),
        'remove': async () => await handleMemberLeave(group, zk, recupevents),
        'promote': async () => await handlePromoteDemote(group, zk, metadata, 'antipromote', 'promote'),
        'demote': async () => await handlePromoteDemote(group, zk, metadata, 'antidemote', 'demote')
    };

    const handler = actionHandlers[group.action];
    if (handler) await handler();
}

/**
 * Gère l'arrivée de nouveaux membres
 */
async function handleNewMember(group, zk, metadata, ppgroup, recupevents) {
    const eventType = await recupevents(group.id, "welcome");
    const neoEventType = await recupevents(group.id, "neowelcome");

    if (eventType === 'oui') {
        await sendWelcomeMessage(group, zk, metadata, ppgroup);
    } else if (neoEventType === 'oui') {
        await sendNeoWelcomeMessage(group, zk);
    }
}

/**
 * Envoie un message de bienvenue classique
 */
async function sendWelcomeMessage(group, zk, metadata, ppgroup) {
    let msg = `╔════◇◇◇═════╗
║ Souhaitons la bienvenue au(x) nouveau(x) membre(s)
║ *Nouveau(x) Membre(s) :*
`;

    for (let membre of group.participants) {
        msg += `║ @${membre.split("@")[0]}\n`;
    }

    msg += `║
╚════◇◇◇═════╝
◇ *Description* ◇
${metadata.desc || "Aucune description"}`;

    await zk.sendMessage(group.id, { 
        image: { url: ppgroup }, 
        caption: msg, 
        mentions: group.participants 
    });
}

/**
 * Envoie un message de bienvenue NEO
 */
async function sendNeoWelcomeMessage(group, zk) {
    for (let membre of group.participants) {
        const msg = `@${membre.split("@")[0]} Bienvenue🙂 💙 : *Remplis les 3️⃣ Étapes en conditions dans la description*, puis après passe prendre ta première card de combat

░░░░░░░░░░░░░░░░░░░
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
🔷𝗡Ξ𝗢24🏆🔝`;

        await zk.sendMessage(group.id, { 
            image: { url: "https://telegra.ph/file/7c2cb8ff44a0bc3338cdc.jpg" }, 
            caption: msg, 
            mentions: [membre] 
        });
    }
}

/**
 * Gère le départ des membres
 */
async function handleMemberLeave(group, zk, recupevents) {
    if (await recupevents(group.id, "goodbye") === 'oui') {
        let msg = `Un ou des membres vient(nent) de quitter le groupe;\n`;
        for (let membre of group.participants) {
            msg += `@${membre.split("@")[0]}\n`;
        }
        await zk.sendMessage(group.id, { text: msg, mentions: group.participants });
    }
}

/**
 * Gère les promotions/démotions avec système anti-abuse
 */
async function handlePromoteDemote(group, zk, metadata, eventType, action) {
    const { recupevents } = require('./bdd/welcome');
    
    if (await recupevents(group.id, eventType) !== 'oui') return;

    const authorJid = WhatsAppBot.decodeJid(group.author);
    const targetJid = WhatsAppBot.decodeJid(group.participants[0]);
    const botJid = WhatsAppBot.decodeJid(zk.user.id);
    const ownerJid = conf.NUMERO_OWNER.replace(/[^0-9]/g) + '@s.whatsapp.net';

    // Vérifier les permissions
    if ([metadata.owner, ownerJid, botJid, targetJid].includes(authorJid)) {
        console.log('✅ Action autorisée (superUser)');
        return;
    }

    // Appliquer les sanctions
    if (action === 'promote') {
        await zk.groupParticipantsUpdate(group.id, [authorJid, targetJid], "demote");
        await zk.sendMessage(group.id, {
            text: `@${authorJid.split("@")[0]} a enfreint la règle de l'antipromote. Lui et @${targetJid.split("@")[0]} ont été démotes.`,
            mentions: [authorJid, targetJid]
        });
    } else {
        await zk.groupParticipantsUpdate(group.id, [authorJid], "demote");
        await zk.groupParticipantsUpdate(group.id, [targetJid], "promote");
        await zk.sendMessage(group.id, {
            text: `@${authorJid.split("@")[0]} a enfreint l'antidemote. Il a été demote et @${targetJid.split("@")[0]} repromu.`,
            mentions: [authorJid, targetJid]
        });
    }
}

// ==============================
// GESTION DES CRON JOBS
// ==============================

async function activateCrons(zk) {
    const cron = require('node-cron');
    const { getCron } = require('./bdd/cron');

    try {
        const crons = await getCron();
        console.log(`⏰ Activation de ${crons.length} crons...`);

        for (const cronJob of crons) {
            await setupCronForGroup(cronJob, zk, cron);
        }
    } catch (error) {
        console.log('❌ Aucun cron à activer ou erreur:', error.message);
    }
}

async function setupCronForGroup(cronJob, zk, cron) {
    if (cronJob.mute_at) {
        const [heures, minutes] = cronJob.mute_at.split(':');
        console.log(`🔇 Auto-mute pour ${cronJob.group_id} à ${heures}h${minutes}`);

        cron.schedule(`${minutes} ${heures} * * *`, async () => {
            await zk.groupSettingUpdate(cronJob.group_id, 'announcement');
            await zk.sendMessage(cronJob.group_id, { 
                image: { url: './media/chrono.webp' }, 
                caption: "⏰ Fermeture automatique du groupe" 
            });
        }, { timezone: "Africa/Abidjan" });
    }

    if (cronJob.unmute_at) {
        const [heures, minutes] = cronJob.unmute_at.split(':');
        console.log(`🔊 Auto-unmute pour ${cronJob.group_id} à ${heures}h${minutes}`);

        cron.schedule(`${minutes} ${heures} * * *`, async () => {
            await zk.groupSettingUpdate(cronJob.group_id, 'not_announcement');
            await zk.sendMessage(cronJob.group_id, { 
                image: { url: './media/chrono.webp' }, 
                caption: "🌅 Ouverture automatique du groupe" 
            });
        }, { timezone: "Africa/Abidjan" });
    }
}

// ==============================
// FONCTIONS UTILITAIRES ÉTENDUES
// ==============================

/**
 * Télécharge et sauvegarde un média
 */
async function downloadAndSaveMediaMessage(message, filename = '', attachExtension = true) {
    let quoted = message.msg || message;
    let mime = quoted.mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    const FileType = require('file-type');
    let type = await FileType.fromBuffer(buffer);
    let trueFileName = `./${filename}.${type.ext}`;
    
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
}

/**
 * Attend un message spécifique
 */
function awaitForMessage(zk, options = {}) {
    return new Promise((resolve, reject) => {
        const { timeout = 30000, sender, chatJid, filter = () => true } = options;

        const messageListener = (data) => {
            if (data.type === "notify") {
                for (let message of data.messages) {
                    const fromMe = message.key.fromMe;
                    const chatId = message.key.remoteJid;
                    const isGroup = chatId.endsWith('@g.us');
                    const isStatus = chatId == 'status@broadcast';

                    const messageSender = fromMe ? 
                        zk.user.id.replace(/:.*@/g, '@') : 
                        (isGroup || isStatus) ? 
                            message.key.participant.replace(/:.*@/g, '@') : chatId;

                    if (messageSender === sender && chatId === chatJid && filter(message)) {
                        zk.ev.off('messages.upsert', messageListener);
                        clearTimeout(timeoutId);
                        resolve(message);
                    }
                }
            }
        };

        zk.ev.on('messages.upsert', messageListener);

        const timeoutId = setTimeout(() => {
            zk.ev.off('messages.upsert', messageListener);
            reject(new Error('Timeout attente message'));
        }, timeout);
    });
}

// ==============================
// MESSAGE DE DÉMARRAGE
// ==============================

async function sendStartupMessage(zk) {
    if (conf.DP.toLowerCase() !== 'yes') return;

    const mode = conf.MODE.toLowerCase() === "oui" ? "public" : 
                conf.MODE.toLowerCase() === "non" ? "privé" : "indéfini";

    const startupMsg = `📡《 *SUPREMUS BOT CONSOLE* 》📡
━━━━━━━━━━━━━━━━━━━━━━
🕹️ *PRÉFIXE :* [ ${prefixe} ]
👾 *MODE :* ${mode}
🪀 *MODULES :* ${evt.cm.length} commandes
━━━━━━━━━━━━━━━━━━━━━━
👑 *DEV :* John Supremus | SRPN Core Dev
━━━━━━━━━━━━━━━━━━━━━━`;

    const monitorMsg = "(-monitor https://supremus-7oq9.onrender.com 1)";

    try {
        await zk.sendMessage(zk.user.id, { text: startupMsg });
        await zk.sendMessage(zk.user.id, { text: monitorMsg });
    } catch (error) {
        console.log('❌ Impossible d\'envoyer le message de démarrage');
    }
}

// ==============================
// SERVEUR EXPRESS (KEEP-ALIVE)
// ==============================

function startExpressServer() {
    const app = express();
    const port = process.env.PORT || 10000;

    app.get('/', (req, res) => {
        res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Supremus-MD by John Supremus</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .content {
            text-align: center;
            padding: 40px;
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        h1 {
            margin-bottom: 20px;
            font-size: 2.5em;
        }
        .status {
            padding: 10px 20px;
            background: #00c853;
            border-radius: 20px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="content">
        <h1>🤖 Supremus MD</h1>
        <div class="status">🟢 EN LIGNE</div>
        <p>Bot WhatsApp développé par John Supremus</p>
    </div>
</body>
</html>
        `);
    });

    app.listen(port, () => {
        console.log(`🌐 Serveur Express démarré sur le port ${port}`);
    });
}

// ==============================
// FONCTION PRINCIPALE
// ==============================

async function main() {
    try {
        const zk = await initializeBot();
        
        // Ajout des fonctions utilitaires à l'instance
        zk.downloadAndSaveMediaMessage = downloadAndSaveMediaMessage;
        zk.awaitForMessage = (options) => awaitForMessage(zk, options);

        // Démarrage du serveur web
        startExpressServer();

        // Surveillance des changements de fichier (hot reload)
        setupFileWatcher();

        return zk;

    } catch (error) {
        WhatsAppBot.handleError(error, "Fonction principale");
        process.exit(1);
    }
}

function setupFileWatcher() {
    const fichier = require.resolve(__filename);
    fs.watchFile(fichier, () => {
        console.log(`🔄 Mise à jour détectée: ${__filename}`);
        fs.unwatchFile(fichier);
        delete require.cache[fichier];
        require(fichier);
    });
}

// ==============================
// DÉMARRAGE DE L'APPLICATION
// ==============================

// Délai initial avant démarrage
setTimeout(() => {
    main().catch(error => {
        console.error('💥 Erreur critique:', error);
        process.exit(1);
    });
}, 3000);

// Gestion propre de la fermeture
process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt propre du bot...');
    process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('❌ Rejet non géré:', reason);
});

console.log("🚀 Démarrage de Supremus-MD...");
