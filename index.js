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
// SYSTÈME ANTI-DOUBLON
// ==============================

const processedEvents = new Map();
const EVENT_TIMEOUT = 30000; // 30 secondes
const MAX_CACHE_SIZE = 2000;

/**
 * Vérifie si un événement est un doublon avec journalisation
 */
function isDuplicateEvent(msg) {
    if (!msg.key || !msg.key.id) return false;

    const eventId = msg.key.id;
    const now = Date.now();

    // Vérifier si l'événement existe déjà
    if (processedEvents.has(eventId)) {
        const originalTime = processedEvents.get(eventId);
        const age = now - originalTime;
        console.log(`🚫 Événement dupliqué détecté: ${eventId} (âge: ${age}ms)`);
        return true;
    }

    // Ajouter le nouvel événement
    processedEvents.set(eventId, now);

    // Nettoyage automatique si le cache devient trop grand
    if (processedEvents.size > MAX_CACHE_SIZE) {
        console.log(`🧹 Nettoyage cache événements (${processedEvents.size} entrées)`);
        // Garder seulement les 1000 entrées les plus récentes
        const entries = Array.from(processedEvents.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 1000);
        processedEvents.clear();
        entries.forEach(([id, timestamp]) => processedEvents.set(id, timestamp));
    }

    return false;
}

/**
 * Nettoyage périodique des anciens événements
 */
setInterval(() => {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [eventId, timestamp] of processedEvents.entries()) {
        if (now - timestamp > EVENT_TIMEOUT) {
            processedEvents.delete(eventId);
            cleanedCount++;
        }
    }

    if (cleanedCount > 0) {
        console.log(`🧹 Nettoyage auto: ${cleanedCount} anciens événements supprimés`);
    }
}, 30000); // Nettoyer toutes les 30 secondes

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

            // VÉRIFICATION ANTI-DOUBLON
            if (isDuplicateEvent(ms)) {
                console.log('🚫 Événement dupliqué ignoré:', ms.key.id);
                return;
            }

            const messageInfo = await this.extractMessageInfo(ms);
            await this.executeMessageActions(messageInfo);

        } catch (error) {
            WhatsAppBot.handleError(error, "Traitement message");
        }
    }

    /**
     * Exécute les actions pour un message
     */
    async executeMessageActions(messageInfo) {
        const {
            ms,
            mtype,
            texte,
            origineMessage,
            idBot,
            verifGroupe,
            infosGroupe,
            nomGroupe,
            auteurMessage,
            nomAuteurMessage,
            msgRepondu,
            auteurMsgRepondu,
            mentions
        } = messageInfo;

        // Log du message
        await this.logMessage(messageInfo);

        // Gestion de l'état de présence
        await this.handlePresenceStatus(messageInfo);

        // Vérification des commandes
        await this.checkAndExecuteCommand(messageInfo);

        // Systèmes de sécurité
        await this.runSecurityChecks(messageInfo);
    }

    /**
     * Log les informations du message
     */
    async logMessage(messageInfo) {
        const { verifGroupe, nomGroupe, nomAuteurMessage, auteurMessage, mtype, texte } = messageInfo;

        console.log("\t [][]...{Supremus-Md}...[][]");
        console.log("=========== Nouveau message ===========");

        if (verifGroupe) {
            console.log("Groupe: " + nomGroupe);
        }

        console.log("De: [" + nomAuteurMessage + " : " + auteurMessage.split("@s.whatsapp.net")[0] + "]");
        console.log("Type: " + mtype);

        if (texte) {
            console.log("Contenu: " + texte);
        }
    }

    /**
     * Gère l'état de présence du bot
     */
    async handlePresenceStatus(messageInfo) {
        const { origineMessage } = messageInfo;

        if (!conf.ETAT) return;

        switch(conf.ETAT) {
            case 1:
                await this.zk.sendPresenceUpdate("available", origineMessage);
                break;
            case 2:
                await this.zk.sendPresenceUpdate("composing", origineMessage);
                break;
            case 3:
                await this.zk.sendPresenceUpdate("recording", origineMessage);
                break;
        }
    }

    /**
     * Vérifie et exécute les commandes
     */
    async checkAndExecuteCommand(messageInfo) {
        const { texte, origineMessage, ms, auteurMessage, verifGroupe } = messageInfo;

        if (!texte || !texte.startsWith(prefixe)) return;

        const com = texte.slice(1).trim().split(/ +/).shift().toLowerCase();
        const arg = texte.trim().split(/ +/).slice(1);

        const cd = evt.cm.find((zokou) => zokou.nomCom === com);
        if (!cd) return;

        // Vérifications de sécurité
        if (!await this.checkCommandPermissions(messageInfo, com)) return;

        try {
            // Réaction avant exécution
            if (cd.reaction) {
                await reagir(origineMessage, this.zk, ms, cd.reaction);
            }

            // Préparation des options de commande
            const commandeOptions = await this.prepareCommandOptions(messageInfo, arg);

            // Exécution de la commande
            cd.fonction(origineMessage, this.zk, commandeOptions);

        } catch (error) {
            console.log("❌ Erreur commande:", error);
            await this.zk.sendMessage(origineMessage, { 
                text: "❌ Erreur: " + error.message 
            }, { quoted: ms });
        }
    }

    /**
     * Vérifie les permissions pour l'exécution de commande
     */
    async checkCommandPermissions(messageInfo, command) {
        const { auteurMessage, origineMessage, verifGroupe } = messageInfo;

        // Récupération des super utilisateurs
        const { getAllSudoNumbers } = require("./bdd/sudo");
        const sudo = await getAllSudoNumbers();
        const superUserNumbers = [this.zk.user.id.split('@')[0], 
                                '22540718560', '2250140718560', '22545697604', 
                                '22554191184', '2250545697604', conf.NUMERO_OWNER]
            .map(s => s.replace(/[^0-9]/g) + "@s.whatsapp.net")
            .concat(sudo);

        const superUser = superUserNumbers.includes(auteurMessage);

        // Vérification mode maintenance
        if (conf.MODE != 'yes' && !superUser) {
            return false;
        }

        // Vérification bannissement utilisateur
        if (!superUser) {
            const { isUserBanned } = require("./bdd/banUser");
            if (await isUserBanned(auteurMessage)) {
                await this.zk.sendMessage(origineMessage, { 
                    text: "🚫 Vous êtes banni de ce bot" 
                }, { quoted: messageInfo.ms });
                return false;
            }
        }

        // Vérification bannissement groupe
        if (verifGroupe && !superUser) {
            const { isGroupBanned } = require("./bdd/banGroup");
            if (await isGroupBanned(origineMessage)) {
                return false;
            }
        }

        // Vérification mode admin seulement
        if (verifGroupe && !superUser) {
            const { isGroupOnlyAdmin } = require("./bdd/onlyAdmin");
            if (await isGroupOnlyAdmin(origineMessage)) {
                const verifAdmin = await this.checkIfUserIsAdmin(messageInfo);
                if (!verifAdmin) return false;
            }
        }

        return true;
    }

    /**
     * Vérifie si l'utilisateur est admin
     */
    async checkIfUserIsAdmin(messageInfo) {
        const { infosGroupe, auteurMessage } = messageInfo;
        if (!infosGroupe || !infosGroupe.participants) return false;

        const participant = infosGroupe.participants.find(p => p.id === auteurMessage);
        return participant && participant.admin !== null;
    }

    /**
     * Prépare les options pour les commandes
     */
    async prepareCommandOptions(messageInfo, arg) {
        const {
            verifGroupe,
            infosGroupe,
            nomGroupe,
            auteurMessage,
            nomAuteurMessage,
            idBot,
            msgRepondu,
            auteurMsgRepondu,
            ms,
            mtype,
            texte,
            origineMessage
        } = messageInfo;

        const extendedInfo = await this.getExtendedMessageInfo(messageInfo);

        // Fonction de réponse
        const repondre = (mes) => this.zk.sendMessage(origineMessage, 
            { text: mes }, 
            { quoted: ms }
        );

        // Image aléatoire du bot
        const mybotpic = () => {
            const liens = conf.URL ? conf.URL.split(',') : [];
            return liens.length > 0 ? liens[Math.floor(Math.random() * liens.length)] : '';
        };

        return {
            superUser: extendedInfo.superUser,
            dev: extendedInfo.dev,
            verifGroupe,
            mbre: verifGroupe && infosGroupe ? infosGroupe.participants : '',
            membreGroupe: auteurMessage,
            verifAdmin: extendedInfo.verifAdmin,
            infosGroupe,
            nomGroupe,
            auteurMessage,
            nomAuteurMessage,
            idBot,
            verifZokouAdmin: extendedInfo.verifZokouAdmin,
            prefixe,
            arg,
            repondre,
            mtype,
            groupeAdmin: verifGroupe && infosGroupe ? this.getGroupAdmins(infosGroupe.participants) : [],
            msgRepondu,
            auteurMsgRepondu,
            ms,
            texte,
            origineMessage,
            mybotpic
        };
    }

    /**
     * Obtient les informations étendues du message
     */
    async getExtendedMessageInfo(messageInfo) {
        const { verifGroupe, infosGroupe, auteurMessage, idBot } = messageInfo;

        // Vérification admin
        let verifAdmin = false;
        let verifZokouAdmin = false;

        if (verifGroupe && infosGroupe && infosGroupe.participants) {
            const admins = this.getGroupAdmins(infosGroupe.participants);
            verifAdmin = admins.includes(auteurMessage);
            verifZokouAdmin = admins.includes(idBot);
        }

        // Vérification superUser/dev
        const devNumbers = ['22540718560', '2250140718560', '22545697604', '22554191184', '2250545697604']
            .map(t => t.replace(/[^0-9]/g) + "@s.whatsapp.net");

        const dev = devNumbers.includes(auteurMessage);
        const ownerJid = conf.NUMERO_OWNER ? conf.NUMERO_OWNER.replace(/[^0-9]/g) + "@s.whatsapp.net" : '';
        const superUser = dev || auteurMessage === ownerJid;

        return {
            verifAdmin,
            verifZokouAdmin,
            dev,
            superUser
        };
    }

    /**
     * Récupère la liste des admins d'un groupe
     */
    getGroupAdmins(participants) {
        if (!participants) return [];
        return participants
            .filter(p => p.admin !== null)
            .map(p => p.id);
    }

    /**
     * Exécute les vérifications de sécurité
     */
    async runSecurityChecks(messageInfo) {
        // Anti-lien
        await this.checkAntiLink(messageInfo);

        // Anti-bot
        await this.checkAntiBot(messageInfo);

        // Mentions du bot
        await this.checkBotMentions(messageInfo);

        // Status auto
        await this.checkAutoStatus(messageInfo);
    }

    /**
     * Vérification anti-lien
     */
    async checkAntiLink(messageInfo) {
        try {
            const { texte, origineMessage, verifGroupe, auteurMessage, ms } = messageInfo;

            if (!texte || !verifGroupe) return;

            const { verifierEtatJid, recupererActionJid } = require("./bdd/antilien");
            const yes = await verifierEtatJid(origineMessage);

            if ((texte.includes('https://') || texte.includes('http://')) && yes) {
                console.log("🔗 Lien détecté");

                const { getGroupAdmins } = this;
                const admins = messageInfo.infosGroupe ? getGroupAdmins(messageInfo.infosGroupe.participants) : [];
                const verifZokAdmin = admins.includes(messageInfo.idBot);
                const extendedInfo = await this.getExtendedMessageInfo(messageInfo);

                if (extendedInfo.superUser || extendedInfo.verifAdmin || !verifZokAdmin) {
                    console.log('✅ Lien autorisé (admin/superUser)');
                    return;
                }

                await this.handleAntiLinkAction(messageInfo);
            }
        } catch (error) {
            WhatsAppBot.handleError(error, "Anti-lien");
        }
    }

    /**
     * Gère l'action anti-lien
     */
    async handleAntiLinkAction(messageInfo) {
        const { origineMessage, auteurMessage, ms } = messageInfo;
        const { recupererActionJid } = require("./bdd/antilien");
        const action = await recupererActionJid(origineMessage);

        const key = {
            remoteJid: origineMessage,
            fromMe: false,
            id: ms.key.id,
            participant: auteurMessage
        };

        let txt = "🔗 Lien détecté, \n";

        switch (action) {
            case 'retirer':
                txt += `Message supprimé \n @${auteurMessage.split("@")[0]} retiré du groupe.`;
                await this.zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                await this.zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                await this.zk.sendMessage(origineMessage, { delete: key });
                break;

            case 'supp':
                txt += `Message supprimé \n @${auteurMessage.split("@")[0]} évitez les liens.`;
                await this.zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                await this.zk.sendMessage(origineMessage, { delete: key });
                break;

            case 'warn':
                await this.handleWarnAction(messageInfo, "lien");
                break;
        }
    }

    /**
     * Vérification anti-bot
     */
    async checkAntiBot(messageInfo) {
        try {
            const { ms, origineMessage, auteurMessage, verifGroupe, idBot } = messageInfo;

            if (!verifGroupe) return;

            const botMsg = ms.key?.id?.startsWith('BAES') && ms.key?.id?.length === 16;
            const baileysMsg = ms.key?.id?.startsWith('BAE5') && ms.key?.id?.length === 16;

            if (!botMsg && !baileysMsg) return;
            if (messageInfo.mtype === 'reactionMessage') return;

            const { atbverifierEtatJid, atbrecupererActionJid } = require("./bdd/antibot");
            const antibotactiver = await atbverifierEtatJid(origineMessage);
            if (!antibotactiver) return;

            const extendedInfo = await this.getExtendedMessageInfo(messageInfo);
            if (extendedInfo.verifAdmin || auteurMessage === idBot) return;

            await this.handleAntiBotAction(messageInfo);
        } catch (error) {
            WhatsAppBot.handleError(error, "Anti-bot");
        }
    }

    /**
     * Gère l'action anti-bot
     */
    async handleAntiBotAction(messageInfo) {
        const { origineMessage, auteurMessage, ms } = messageInfo;
        const { atbrecupererActionJid } = require("./bdd/antibot");
        const action = await atbrecupererActionJid(origineMessage);

        const key = {
            remoteJid: origineMessage,
            fromMe: false,
            id: ms.key.id,
            participant: auteurMessage
        };

        let txt = "🤖 Bot détecté, \n";

        switch (action) {
            case 'retirer':
                txt += `Message supprimé \n @${auteurMessage.split("@")[0]} retiré du groupe.`;
                await this.zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                await this.zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                await this.zk.sendMessage(origineMessage, { delete: key });
                break;

            case 'supp':
                txt += `Message supprimé \n @${auteurMessage.split("@")[0]} évitez les bots.`;
                await this.zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                await this.zk.sendMessage(origineMessage, { delete: key });
                break;

            case 'warn':
                await this.handleWarnAction(messageInfo, "bot");
                break;
        }
    }

    /**
     * Gère le système d'avertissement
     */
    async handleWarnAction(messageInfo, type) {
        const { origineMessage, auteurMessage, ms } = messageInfo;
        const { getWarnCountByJID, ajouterUtilisateurAvecWarnCount } = require('./bdd/warn');

        let warn = await getWarnCountByJID(auteurMessage);
        let warnlimit = conf.WARN_COUNT || 3;

        if (warn >= warnlimit) {
            const kikmsg = `${type} détecté ; vous avez atteint le nombre maximal d'avertissements.`;
            await this.zk.sendMessage(origineMessage, { text: kikmsg, mentions: [auteurMessage] }, { quoted: ms });
            await this.zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
        } else {
            const rest = warnlimit - warn;
            const msg = `${type} détecté, avertissement ${warn + 1}/${warnlimit}.`;
            await ajouterUtilisateurAvecWarnCount(auteurMessage);
            await this.zk.sendMessage(origineMessage, { text: msg, mentions: [auteurMessage] }, { quoted: ms });
        }
    }

    /**
     * Vérification des mentions du bot
     */
    async checkBotMentions(messageInfo) {
        try {
            const { ms, mtype, origineMessage, idBot } = messageInfo;

            if (!ms.message || !ms.message[mtype] || !ms.message[mtype].contextInfo) return;

            const mentionedJid = ms.message[mtype].contextInfo.mentionedJid;
            if (!mentionedJid || !mentionedJid.includes(idBot)) return;

            if (origineMessage === "120363158701337904@g.us") return;

            const extendedInfo = await this.getExtendedMessageInfo(messageInfo);
            if (extendedInfo.superUser) return;

            await this.handleBotMention(messageInfo);
        } catch (error) {
            // Ignorer les erreurs de mention
        }
    }

    /**
     * Gère les mentions du bot
     */
    async handleBotMention(messageInfo) {
        const { origineMessage, ms } = messageInfo;
        const mbd = require('./bdd/mention');
        const alldata = await mbd.recupererToutesLesValeurs();

        if (!alldata || alldata.length === 0) return;

        const data = alldata[0];
        if (data.status === 'non') return;

        await this.sendMentionResponse(messageInfo, data);
    }

    /**
     * Envoie la réponse à la mention
     */
    async sendMentionResponse(messageInfo, data) {
        const { origineMessage, ms } = messageInfo;
        const { Sticker, StickerTypes } = require('wa-sticker-formatter');

        let msg = {};

        switch (data.type.toLowerCase()) {
            case 'image':
                msg = { image: { url: data.url }, caption: data.message };
                break;
            case 'video':
                msg = { video: { url: data.url }, caption: data.message };
                break;
            case 'sticker':
                const stickerMess = new Sticker(data.url, {
                    pack: conf.NOM_OWNER || 'Supremus',
                    type: StickerTypes.FULL,
                    categories: ["🤩", "🎉"],
                    quality: 70,
                });
                const stickerBuffer = await stickerMess.toBuffer();
                msg = { sticker: stickerBuffer };
                break;
            case 'audio':
                msg = { audio: { url: data.url }, mimetype: 'audio/mp4' };
                break;
            default:
                msg = { text: data.message || '👋 Bonjour !' };
        }

        await this.zk.sendMessage(origineMessage, msg, { quoted: ms });
    }

    /**
     * Vérification auto-status
     */
    async checkAutoStatus(messageInfo) {
        const { ms } = messageInfo;

        if (ms.key && ms.key.remoteJid === "status@broadcast") {
            if (conf.LECTURE_AUTO_STATUS === "oui") {
                await this.zk.readMessages([ms.key]);
            }
            if (conf.TELECHARGER_AUTO_STATUS === "oui") {
                await this.handleAutoStatusDownload(messageInfo);
            }
        }
    }

    /**
     * Gère le téléchargement auto des status
     */
    async handleAutoStatusDownload(messageInfo) {
        const { ms, idBot } = messageInfo;

        if (ms.message.extendedTextMessage) {
            const stTxt = ms.message.extendedTextMessage.text;
            await this.zk.sendMessage(idBot, { text: stTxt }, { quoted: ms });
        } else if (ms.message.imageMessage) {
            const stMsg = ms.message.imageMessage.caption;
            const stImg = await this.downloadAndSaveMediaMessage(ms.message.imageMessage);
            await this.zk.sendMessage(idBot, { image: { url: stImg }, caption: stMsg }, { quoted: ms });
        } else if (ms.message.videoMessage) {
            const stMsg = ms.message.videoMessage.caption;
            const stVideo = await this.downloadAndSaveMediaMessage(ms.message.videoMessage);
            await this.zk.sendMessage(idBot, { video: { url: stVideo }, caption: stMsg }, { quoted: ms });
        }
    }

    /**
     * Télécharge et sauvegarde un média
     */
    async downloadAndSaveMediaMessage(message, filename = '') {
        let quoted = message.msg ? message.msg : message;
        let mime = (message.msg || message).mimetype || '';
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];

        const stream = await downloadContentFromMessage(quoted, messageType);
        let buffer = Buffer.from([]);

        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        const FileType = require('file-type');
        let type = await FileType.fromBuffer(buffer);
        let trueFileName = `./media/${filename || 'temp'}.${type.ext}`;

        await fs.ensureDir('./media');
        await fs.writeFileSync(trueFileName, buffer);
        return trueFileName;
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
            try {
                infosGroupe = await this.zk.groupMetadata(origineMessage);
                nomGroupe = infosGroupe.subject;
            } catch (error) {
                console.log('❌ Erreur métadonnées groupe:', error.message);
            }
        }

        // Auteur du message
        const auteurMessage = await this.getAuthorInfo(ms, origineMessage, idBot, verifGroupe);
        const nomAuteurMessage = ms.pushName;

        // Message répondu
        const msgRepondu = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
        let auteurMsgRepondu = '';
        if (msgRepondu) {
            auteurMsgRepondu = await getJid(
                WhatsAppBot.decodeJid(ms.message?.extendedTextMessage?.contextInfo?.participant),
                origineMessage,
                this.zk
            );
        }

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
    version: [2, 3000, 1025190524],
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
// GESTIONNAIRES D'ÉVÉNEMENTS
// ==============================

/**
 * Gère les mises à jour de connexion
 */
async function handleConnectionUpdate(con, zk) {
    const { lastDisconnect, connection } = con;

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

    // AFFICHER LA SESSION - FORCER L'AFFICHAGE
    console.log('\n🛜 CONNEXION WHATSAPP RÉUSSIE !');
    console.log('📋 SESSION PERSISTANTE À COPIER :');

    // Attendre un peu que les credentials soient chargés
    await delay(1000);

    if (zk.authState && zk.authState.creds) {
        const sessionText = Buffer.from(JSON.stringify(zk.authState.creds)).toString('base64');
        console.log(sessionText);
        console.log('💾 Garde ce texte précieusement pour restaurer la session !\n');
    } else {
        console.log('❌ Impossible de récupérer les credentials');
    }

    console.log("📦 Chargement des commandes...");
    await loadCommands();

    await activateCrons(zk);
    await sendStartupMessage(zk);
}

/**
 * Affiche une animation de connexion
 */
async function displayConnectionAnimation() {
    const steps = ["🚀 Démarrage...", "📡 Connexion...", "✅ Connecté !"];

    for (const step of steps) {
        console.log(step);
        await delay(500);
    }
}

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
    const ownerJid = conf.NUMERO_OWNER ? conf.NUMERO_OWNER.replace(/[^0-9]/g) + '@s.whatsapp.net' : '';

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
        console.log('❌ Aucun cron à activer');
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
// MESSAGE DE DÉMARRAGE
// ==============================

async function sendStartupMessage(zk) {
    if (!conf.DP || conf.DP.toLowerCase() !== 'yes') return;

    const mode = conf.MODE && conf.MODE.toLowerCase() === "oui" ? "public" : 
                conf.MODE && conf.MODE.toLowerCase() === "non" ? "privé" : "indéfini";

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
        zk.downloadAndSaveMediaMessage = (message, filename) => {
            const processor = new MessageProcessor(zk);
            return processor.downloadAndSaveMediaMessage(message, filename);
        };

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