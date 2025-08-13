const { zokou } = require("../framework/zokou");
const axios = require("axios");
const fs = require('fs-extra');
const path = require ('path');

zokou({
  nomCom: "minuteur",
  categorie: "MON-BOT",
  reaction: "⏳",
  description: "Minuteur visuel (1-15 minutes)"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;

  // Configuration
  const dureeMax = 15; // 15 minutes maximum
  let minutes = parseInt(arg[0]) || 3; // 3min par défaut

  // Validation
  if (isNaN(minutes) || minutes < 1 || minutes > dureeMax) {
    return repondre(`❌ Durée invalide ! Choisis entre 1 et ${dureeMax} minutes.`);
  }

  // Conversion en secondes pour l'animation
  const totalSeconds = minutes * 60;
  const etapes = 10;
  const interval = (totalSeconds * 1000) / etapes;

  // Message initial
  const msgInit = await zk.sendMessage(origineMessage, {
    text: `⏳ Minuteur démarré (${minutes}min)\n\n[${'░'.repeat(etapes)}] 0%`
  });

  // Animation
  for (let i = 1; i <= etapes; i++) {
    await new Promise(resolve => setTimeout(resolve, interval));
    
    const pourcentage = i * 10;
    const barre = '█'.repeat(i) + '░'.repeat(etapes - i);
    
    await zk.sendMessage(origineMessage, {
      text: `⏳ Temps restant: ${Math.round(minutes - (minutes * pourcentage/100))}min\n\n[${barre}] ${pourcentage}%`,
      edit: msgInit.key
    });
  }

  // Message final (nouveau message)
  await zk.sendMessage(origineMessage, {
    text: `✅ Minuteur terminé ! (${minutes} minutes écoulées)`
  });
});

zokou({
  nomCom: "diffusion",
  categorie: "MON-BOT",
  reaction: "🚀"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, arg, superUser } = commandeOptions;

  // 1. Vérifie si c'est le propriétaire
  if (!superUser) {
    return repondre("🚫 Commande réservée au propriétaire du bot.");
  }

  // 2. Vérifie que le message est bien fourni
  const message = arg.join(" ").trim();
  if (!message) {
    return repondre("❗ Veuillez fournir le message à diffuser.\n\nExemple : `-diffusion Bonjour à tous !`");
  }

  try {
    // 3. Récupération des groupes actifs
    const groupes = await zk.groupFetchAllParticipating();
    const groupesActifs = Object.values(groupes).filter(g => !g.isAnnounceGrpRestrict);

    // 4. Préparation des logs
    const logPath = path.join(process.cwd(), "broadcast_logs.txt");
    let succes = 0;

    for (const groupe of groupesActifs) {
      try {
        await zk.sendMessage(
          groupe.id,
          { text: message },
          { waitForAck: true }
        );
        fs.appendFileSync(logPath, `[SUCCES] ${new Date().toISOString()} | ${groupe.subject || 'Sans nom'} | ${groupe.id}\n`);
        succes++;
        await new Promise(resolve => setTimeout(resolve, 1500)); // Anti-ban
      } catch (e) {
        fs.appendFileSync(logPath, `[ERREUR] ${new Date().toISOString()} | ${groupe.subject || 'Sans nom'} | ${e.message}\n`);
      }
    }

    // 5. Rapport final
    await repondre(`
✅ *Diffusion terminée*
• Groupes atteints : ${succes}/${groupesActifs.length}
• Consultez \`${logPath}\` pour les détails
    `.trim());

  } catch (e) {
    console.error("Erreur diffusion :", e);
    repondre("❌ Erreur lors de la diffusion du message.");
  }
});

let intervalPing = null;
let latenceTimeout = null;
let dernierDelaiMinutes = null; // <= On mémorise le dernier délai utilisé

zokou({ nomCom: "latence", categorie: "MON-BOT", reaction: "⏱️" }, async (origineMessage, zk, commandeOptions) => {
    const { repondre, arg } = commandeOptions;

    if (intervalPing) {
        repondre("*_⏳ Une latence est déjà en cours..._*");
        return;
    }

    // Déterminer le délai demandé par l'utilisateur
    let minutes = parseInt(arg[0]);
    if (isNaN(minutes) || minutes <= 0) {
        minutes = 8; // Valeur par défaut = 8 minutes
    }

    dernierDelaiMinutes = minutes; // On mémorise le délai

    intervalPing = setInterval(async () => {
        try {
            const response = await axios.get("https://zokouscan-din3.onrender.com");
            console.log(`[PING] ${new Date().toLocaleTimeString()} - Statut : ${response.status}`);
            await zk.sendMessage(origineMessage, { text: `*_⌛ Intervalle écoulé ${dernierDelaiMinutes} min._*` });
        } catch (err) {
            console.error(`[PING] Erreur : ${err.message}`);
            await zk.sendMessage(origineMessage, { text: `Erreur : ${err.message}` });
        }
    }, minutes * 60 * 1000); // Conversion minutes -> millisecondes

    repondre(`*_⏱️ Latence démarré. Fin de la latence dans ${minutes} minute(s)._*`);
});


zokou({ nomCom: "stop", categorie: "MON-BOT", reaction: "🛑" }, async (origineMessage, zk, commandeOptions) => {
    const { repondre } = commandeOptions;

    if (intervalPing) {
        clearInterval(intervalPing);
        intervalPing = null;
        dernierDelaiMinutes = null;
        repondre("*_⏱️ Latence arrêté._*");
    } else {
        repondre("*_⏱️ Aucune latence en cours._*");
    }
});

// Nouvelle fonction pour convertir les JID en LID de manière fiable
function convertToLid(jid) {
    if (!jid) return jid;
    // Conversion forcée pour les groupes
    if (jid.endsWith('@g.us')) return jid.replace('@g.us', '@lid');
    // Gestion des numéros de téléphone
    if (jid.includes('@s.whatsapp.net')) return jid.replace('@s.whatsapp.net', '@lid');
    return jid;
}

zokou({ 
    nomCom: "groupes", 
    categorie: "MON-BOT", 
    reaction: "🌐" 
}, async (origineMessage, zk, { repondre }) => {
    try {
        const groupes = await zk.groupFetchAllParticipating();
        const liste = Object.values(groupes)
            .map(g => `• ${g.subject || 'Sans nom'} (${convertToLid(g.id)})`)
            .join("\n");
        
        repondre(`*📋 Groupes Visibles (${Object.values(groupes).length}) :*\n${liste}`);
    } catch (e) {
        console.error("Erreur groupes:", e);
        repondre("❌ Erreur lors de la récupération des groupes");
    }
});


zokou({
  nomCom: "chargement",
  categorie: "MON-BOT",
  reaction: "⏳"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;

  // Durée du chargement en secondes (par défaut 5s)
  const duree = parseInt(arg[0]) || 5;
  
  if (duree > 30) {
    return repondre("❌ La durée maximale est de 30 secondes.");
  }

  // Envoi du message initial
  const messageInitial = await zk.sendMessage(origineMessage, { 
    text: `⏳ Chargement en cours... 0%` 
  });

  // Simulation du chargement
  const etapes = 10;
  const interval = (duree * 1000) / etapes;
  
  for (let i = 1; i <= etapes; i++) {
    await new Promise(resolve => setTimeout(resolve, interval));
    
    const pourcentage = i * 10;
    const barre = '█'.repeat(i) + '░'.repeat(etapes - i);
    
    try {
      await zk.sendMessage(origineMessage, { 
        text: `⏳ Chargement en cours... ${pourcentage}%\n${barre}`,
        edit: messageInitial.key 
      });
    } catch (e) {
      console.error("Erreur modification message:", e);
    }
  }

  // Message final
  await zk.sendMessage(origineMessage, { 
    text: `✅ Chargement terminé en ${duree} secondes !`,
    edit: messageInitial.key 
  });
});