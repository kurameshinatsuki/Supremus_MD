// index_2025.js — Bot WhatsApp compatible 2025 (Baileys 6.7.0+)

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason, jidDecode } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs-extra');
const path = require('path');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

// Auth path
const authFolder = './auth';

// Initialisation principale
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: state,
    logger: pino({ level: 'info' }),
    browser: ['Supremus-MD', 'Safari', '1.0'],
    markOnlineOnConnect: false,
    syncFullHistory: false
  });

  // Sauvegarde auto des creds
  sock.ev.on('creds.update', saveCreds);

  // Connexion
  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') {
      console.log('✅ Connexion établie à WhatsApp. Le bot est prêt !');
    } else if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('❌ Déconnecté. Reconnexion :', shouldReconnect);
      if (shouldReconnect) startBot();
    }
  });

  // Réception des messages
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (!messages || !messages[0]) return;
    const msg = messages[0];
    const jid = msg.key.remoteJid;
    const fromMe = msg.key.fromMe;
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';

    if (fromMe || !text) return;

    console.log(`📩 Message reçu de ${jid} : ${text}`);

    if (text.toLowerCase() === 'ping') {
      await sock.sendMessage(jid, { text: '🏓 Pong Supremus-MD est en ligne !' }, { quoted: msg });
    }
  });
}

// API pour Render/KeepAlive
app.get('/', (_, res) => {
  res.send('🔄 Supremus-MD tourne parfaitement.');
});

app.listen(PORT, () => console.log('🌐 Serveur Express actif sur le port', PORT));

// Lancer le bot
startBot().catch(e => console.error('Erreur critique du bot :', e));
