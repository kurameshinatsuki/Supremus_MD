// ============================================================
// Nom du fichier : rc_bot.js
// Auteur : Supremus Prod
//
// Description : Ce fichier contient les fonctions et les logiques
//               liées à la communauté RC par Supremus Prod.
//
// Date de création : 28/08/2025
// Dernière modification : 28/08/2025
//
// ============================================================

const { zokou } = require('../framework/zokou');
const { addOrUpdateDataInPlayer, getDataFromPlayer } = require('../bdd/rc_db');

// Utilitaire pour envoyer une image avec légende
async function envoyerImage(dest, zk, ms, lien, caption = '') {
    await zk.sendMessage(dest, { image: { url: lien }, caption }, { quoted: ms });
}

// Fonction pour créer dynamiquement des commandes `playerX`
function createPlayerCommand(playerName) {
    zokou({
        nomCom: playerName,
        categorie: 'RC'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;

        try {
            const data = await getDataFromPlayer(playerName);

            if (!arg || !arg[0] || arg.join('') === '') {
                // Affichage des données existantes
                if (data) {
                    const { message, lien } = data;
                    const alivemsg = `${message}`;

                    if (/\.(mp4|gif)$/i.test(lien)) {
                        await zk.sendMessage(dest, { video: { url: lien }, caption: alivemsg }, { quoted: ms });
                    } else if (/\.(jpeg|png|jpg)$/i.test(lien)) {
                        await zk.sendMessage(dest, { image: { url: lien }, caption: alivemsg }, { quoted: ms });
                    } else {
                        repondre(alivemsg);
                    }

                } else {
                    const baseMsg = `🔃 Aucune fiche trouvée pour ce joueur. Pour l'enregistrer, entrez après la commande votre message et votre lien d'image ou vidéo dans ce format : -${playerName} Message;Lien\n*⚠️ Attention aux infos que vous tapez.*`;
                    superUser ? repondre(baseMsg) : repondre("*🛃 Aucune fiche trouvée pour ce joueur.*");
                }

            } else {
                // Mise à jour des données
                if (!superUser) return repondre("*⚠️ Vous n'êtes pas autorisé à exécuter cette commande.*");

                const [texte, tlien] = arg.join(' ').split(';');

                if (texte && tlien) {
                    await addOrUpdateDataInPlayer(playerName, texte.trim(), tlien.trim());
                    repondre('*✔️ Données actualisées avec succès*');
                } else {
                    repondre(`*❌ Format incorrect. Veuillez utiliser :* -${playerName} Message;Lien`);
                }
            }

        } catch (error) {
            console.error("Erreur lors du traitement de la commande :", error);
            repondre("🥵 Une erreur est survenue. Veuillez réessayer plus tard.");
        }
    });
}

// Création de commandes dynamiques (ajoute autant de joueurs que tu veux ici)
['test1', 'test2', 'test3', 'test4'].forEach(player => createPlayerCommand(player));

// Commande des règles RC
zokou(
    { nomCom: 'system', categorie: 'RC' },
    async (dest, zk, { ms }) => {
        const liens = [
    'https://i.ibb.co/6RM3WpY1/IMG-20250827-WA0134.jpg',
    'https://i.ibb.co/1GW1qwG6/IMG-20250827-WA0133.jpg',
    'https://i.ibb.co/mVRf0brh/IMG-20250827-WA0132.jpg',
    'https://i.ibb.co/v91vmzW/IMG-20250827-WA0131.jpg',
    'https://i.ibb.co/4gwtnSv4/IMG-20250827-WA0130.jpg',
    'https://i.ibb.co/RTWx7MSQ/IMG-20250827-WA0129.jpg',
    'https://i.ibb.co/xK4RT1Mm/IMG-20250827-WA0128.jpg',
    'https://i.ibb.co/ZzGvfYpm/IMG-20250827-WA0127.jpg',
    'https://i.ibb.co/nMXvmK4D/IMG-20250827-WA0126.jpg',
    'https://i.ibb.co/67VD4HXv/IMG-20250827-WA0125.jpg',
    'https://i.ibb.co/fzdDFLx2/IMG-20250827-WA0124.jpg',
    'https://i.ibb.co/GQtSMC7g/IMG-20250827-WA0123.jpg',
    'https://i.ibb.co/PsqQ89vX/IMG-20250827-WA0122.jpg',
    'https://i.ibb.co/39qkZQCF/IMG-20250827-WA0121.jpg',
    'https://i.ibb.co/PRSbKqQ/IMG-20250827-WA0120.jpg',
    'https://i.ibb.co/rGx4rJkR/IMG-20250826-WA0169.jpg',
    'https://i.ibb.co/60P3ncYf/IMG-20250826-WA0170.jpg',
    'https://i.ibb.co/kk19YGc/IMG-20250826-WA0168.jpg'
];
        for (const lien of liens) {
            await envoyerImage(dest, zk, ms, lien);
        }
    }
);

// Menu principal RC_BOT
zokou(
    { nomCom: 'rc_menu', categorie: 'RC' },
    async (dest, zk, { ms }) => {
        const lien = 'https://i.ibb.co/TxwgXfRM/image.jpg';
        const msg = `┏━━━━━━━━━━━━━━━━━◇
┃            *RC_BOT_MENU*
┣━━━━━━━━━━━━━━━━━◇
┃ #rc_menu
┃ #rules
┃ #minuteur
┃ #fiche
┃ #(playerName)
┗━━━━━━━━━━━━━━━━━◇`;
        await envoyerImage(dest, zk, ms, lien, msg);
    }
);

// Fiche de joueur (template statique)
zokou(
    { nomCom: 'fiche', categorie: 'RC' },
    async (dest, zk, { arg, repondre }) => {
        if (!arg || arg.length === 0) {
            const msg = `*•×•* *Pseudonyme* 


*•×•* *Âge*  

*•×•* *Sexe* 

*•×•* *Force & Résistance.*  


*•×•* *Intelligence* .  


*•×•* *Vitesse & Agilité.* 


*•×•* *Endurance* . 


*•×•* *Sensorialité* . 


*•×•*  *Niveau du joueur.* 
NIVEAU 1

 *•×•* *EXP* 
10 EXP

🪙 *MT 00*

💎 *00*

🪃 *00*`;
            repondre(msg);
        }
    }
);

zokou({
  nomCom: "minuteur",
  categorie: "RC",
  reaction: "⏳",
  description: "Minuteur visuel (1-15 minutes)"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;

  // Configuration
  const dureeMax = 15; // 15 minutes maximum
  let minutes = parseInt(arg[0]) || 10; // 10min par défaut

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