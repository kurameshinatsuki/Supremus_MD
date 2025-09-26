const { zokou } = require('../framework/zokou');
const { decks } = require('../commandes/deck_manager');
const { deck_cards } = require("../commandes/deck_cards");
const { writeFileSync, readFileSync, unlinkSync } = require('fs');
const { randomInt } = require('crypto');
const db = require("../bdd/game_bdd"); // Import de la base de données

// Fonction utilitaire : normalise les noms (sans majuscules ni accents)
function normalize(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Fonction pour générer un ID utilisateur unique à partir des infos du message
function getUserId(zk, ms) {
  return ms.key.participant || ms.key.remoteJid || 'unknown';
}

// Fonction pour obtenir l'ID du groupe
function getGroupId(dest) {
  return dest;
}

// Fonction pour sauvegarder la session en base de données
async function saveSessionToDB(zk, ms, dest, sessionData) {
  const userId = getUserId(zk, ms);
  const groupId = getGroupId(dest);
  
  try {
    await db.saveDeckSession(
      userId, 
      groupId, 
      sessionData.nom, 
      sessionData.deck, 
      sessionData.pioches || []
    );
    return true;
  } catch (error) {
    console.error('Erreur sauvegarde session DB:', error);
    return false;
  }
}

// Fonction pour récupérer la session depuis la base de données
async function getSessionFromDB(zk, ms, dest) {
  const userId = getUserId(zk, ms);
  const groupId = getGroupId(dest);
  
  try {
    const session = await db.getDeckSession(userId, groupId);
    if (session) {
      return {
        nom: session.deck_name,
        deck: session.deck_data,
        pioches: session.pioches || []
      };
    }
    return null;
  } catch (error) {
    console.error('Erreur récupération session DB:', error);
    return null;
  }
}

// Commande : .deck <nom>
zokou(
  { nomCom: 'deck', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { arg, ms, auteurMessage } = commandeOptions;

    // Si aucun nom de deck n'est fourni, lister les decks disponibles
    if (!arg[0]) {
      const nomsDisponibles = Object.keys(decks)
        .map(n => `• ${n.charAt(0).toUpperCase() + n.slice(1)}`)
        .join('\n');

      await zk.sendMessage(dest, {
        image: { url: 'https://i.ibb.co/T907ppk/Whats-App-Image-2025-06-17-at-19-20-20-1.jpg' },
        caption: `📦 *Decks disponibles :*\n${nomsDisponibles}\n\n🔁 Tape la commande avec un nom de deck. Exemple : *.deck yami*`
      }, { quoted: ms });
      return;
    }

    const nomDeck = arg[0].toLowerCase();
    const deckData = decks[nomDeck];

    if (!deckData) {
      await zk.sendMessage(dest, {
        text: `❌ Le deck "${nomDeck}" n'existe pas.`
      }, { quoted: ms });
      return;
    }

    const { image, competence, main, extra } = deckData;
    
    // Assigner un ID numérique unique à chaque carte (1, 2, 3...)
    const deckAvecIds = main.map((name, index) => ({
      id: index + 1,
      name
    }));

    const deckMelange = [...deckAvecIds].sort(() => Math.random() - 0.5);

    const sessionData = {
      deck: deckMelange,
      pioches: [],
      nom: nomDeck
    };

    // Sauvegarde en base de données
    const saved = await saveSessionToDB(zk, ms, dest, sessionData);
    if (!saved) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur lors de la création du deck. Réessayez.`
      }, { quoted: ms });
      return;
    }

    const contenu = `🧠 *Compétence :*\n• ${competence}\n\n🃏 *Deck Principal (${deckMelange.length}) :*\n` +
      deckMelange.map(c => `[${c.id}] ${c.name}`).join('\n') +
      (extra?.length
        ? `\n\n🧩 *Extra Deck (${extra.length}) :*\n• ${extra.join('\n• ')}`
        : '');

    await zk.sendMessage(dest, {
      image: { url: image },
      caption: contenu
    }, { quoted: ms });
  }
);

// Commande : .pioche <id>
zokou(
  { nomCom: 'pioche', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;

    // Récupérer la session depuis la base de données
    const session = await getSessionFromDB(zk, ms, dest);
    if (!session || !session.deck) {
      await zk.sendMessage(dest, {
        text: `❌ Aucun deck actif. Utilisez *.deck <nom>* avant de piocher.`
      }, { quoted: ms });
      return;
    }

    if (!arg[0] || isNaN(arg[0])) {
      await zk.sendMessage(dest, {
        text: `❌ Veuillez spécifier l'ID de la carte à piocher. Exemple : *.pioche 3*`
      }, { quoted: ms });
      return;
    }

    const idCarte = parseInt(arg[0], 10);
    const carteIndex = session.deck.findIndex(c => c.id === idCarte);

    if (carteIndex === -1) {
      await zk.sendMessage(dest, {
        text: `❌ ID invalide. Utilise *.mondeck* pour voir les IDs disponibles.`
      }, { quoted: ms });
      return;
    }

    const cartePiochée = session.deck.splice(carteIndex, 1)[0];
    session.pioches.push(cartePiochée);

    // Sauvegarder les modifications en base de données
    const saved = await saveSessionToDB(zk, ms, dest, session);
    if (!saved) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur lors de la pioche. Réessayez.`
      }, { quoted: ms });
      return;
    }

    await zk.sendMessage(dest, {
      text: `🃏 Vous avez pioché : *${cartePiochée.name}* (ID: ${cartePiochée.id})\n🗂️ Cartes restantes : ${session.deck.length}`
    }, { quoted: ms });
  }
);

// Commande : .mondeck
zokou(
  { nomCom: 'mondeck', categorie: 'YU-GI-OH' },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    // Récupérer la session depuis la base de données
    const session = await getSessionFromDB(zk, ms, dest);
    if (!session) {
      await zk.sendMessage(dest, {
        text: `❌ Aucun deck actif. Commence avec *.deck <nom>*`
      }, { quoted: ms });
      return;
    }
    
    const cartesRestantes = session.deck
      .map(c => `[${c.id}] ${c.name}`)
      .join('\n') || 'Aucune';

    const cartesPiochées = session.pioches
      .map(c => `[${c.id}] ${c.name}`)
      .join('\n') || 'Aucune';

    const message = `🗂️ *DECK ACTUEL: ${session.nom.toUpperCase()}*\n\n` +
      `📦 *CARTES RESTANTES (${session.deck.length}):*\n${cartesRestantes}\n\n` +
      `🎴 *CARTES PIOCHEES (${session.pioches.length}):*\n${cartesPiochées}`;

    await zk.sendMessage(dest, { text: message }, { quoted: ms });
  }
);

// Commande : .melanger
zokou(
  {
    nomCom: 'melanger',
    categorie: 'YU-GI-OH'
  },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    // Récupérer la session depuis la base de données
    const session = await getSessionFromDB(zk, ms, dest);
    if (!session || !session.deck || !session.nom) {
      await zk.sendMessage(dest, {
        text: `❌ Aucun deck actif. Utilisez *.deck <nom>* avant de mélanger.`
      }, { quoted: ms });
      return;
    }

    const nomDeck = session.nom;
    const deckOriginal = decks[nomDeck];
    const cartesRestantes = [...session.deck]; // Copie

    // Mélanger en conservant les IDs
    const deckMelange = cartesRestantes.sort(() => Math.random() - 0.5);
    session.deck = deckMelange;

    // Sauvegarder les modifications en base de données
    const saved = await saveSessionToDB(zk, ms, dest, session);
    if (!saved) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur lors du mélange. Réessayez.`
      }, { quoted: ms });
      return;
    }

    const contenu = `🧠 *Compétence :*\n• ${deckOriginal.competence}\n\n🃏 *Deck Principal (${deckMelange.length}) :*\n` +
      deckMelange.map(c => `[${c.id}] ${c.name}`).join('\n') +
      `\n\n🧩 *Extra Deck (${deckOriginal.extra.length}) :*\n• ${deckOriginal.extra.join('\n• ')}`;

    await zk.sendMessage(dest, {
      image: { url: deckOriginal.image },
      caption: contenu
    }, { quoted: ms });
  }
);

// Commande : .resetdeck
zokou(
  {
    nomCom: 'resetdeck',
    categorie: 'YU-GI-OH'
  },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    // Récupérer la session depuis la base de données
    const session = await getSessionFromDB(zk, ms, dest);
    if (!session || !session.nom) {
      await zk.sendMessage(dest, {
        text: `❌ Aucun deck actif. Utilisez *.deck <nom>* avant de réinitialiser.`
      }, { quoted: ms });
      return;
    }

    const nomDeck = session.nom;
    const deckData = decks[nomDeck];

    if (!deckData) {
      await zk.sendMessage(dest, {
        text: `❌ Le deck "${nomDeck}" n'existe pas ou a été supprimé.`
      }, { quoted: ms });
      return;
    }

    // Recréer le deck avec les mêmes IDs
    const deckRemelange = deckData.main.map((name, index) => ({
      id: index + 1,
      name
    })).sort(() => Math.random() - 0.5);

    // Mise à jour de la session
    const newSession = {
      nom: nomDeck,
      deck: deckRemelange,
      pioches: []
    };

    // Sauvegarder la nouvelle session en base de données
    const saved = await saveSessionToDB(zk, ms, dest, newSession);
    if (!saved) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur lors de la réinitialisation. Réessayez.`
      }, { quoted: ms });
      return;
    }

    const contenu = `🧠 *Compétence :*\n• ${deckData.competence}\n\n🃏 *Deck Principal (${deckRemelange.length}) :*\n` +
      deckRemelange.map(c => `[${c.id}] ${c.name}`).join('\n') +
      `\n\n🧩 *Extra Deck (${deckData.extra.length}) :*\n• ${deckData.extra.join('\n• ')}`;

    await zk.sendMessage(dest, {
      image: { url: deckData.image },
      caption: contenu
    }, { quoted: ms });
  }
);

// Commande : .carte
zokou(
  {
    nomCom: 'carte',
    categorie: 'YU-GI-OH'
  },
  async (dest, zk, commandeOptions) => {
    const { arg, ms } = commandeOptions;

    // 📘 Si aucun argument, envoyer un HTML catalogue Yu-Gi-Oh! stylisé
    if (!arg || arg.length === 0) {
      const sortedCartes = Object.keys(deck_cards).sort((a, b) => a.localeCompare(b));
      
      const html = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>📜 Grimoire Yu-Gi-Oh! - Duel Monster</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Cinzel', 'Georgia', serif;
              background: 
                radial-gradient(circle at 20% 30%, rgba(139, 0, 0, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(0, 0, 139, 0.3) 0%, transparent 50%),
                linear-gradient(135deg, #0a0a2a 0%, #1a1a3a 50%, #2a2a4a 100%);
              color: #e8d5b5;
              line-height: 1.6;
              padding: 20px;
              min-height: 100vh;
              background-attachment: fixed;
            }
            
            .duel-grimoire {
              max-width: 1200px;
              margin: 0 auto;
              background: 
                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" opacity="0.05"><rect width="100" height="100" fill="none" stroke="%23e8d5b5" stroke-width="2"/><path d="M20,20 L80,80 M80,20 L20,80" stroke="%23e8d5b5" stroke-width="1"/></svg>'),
                linear-gradient(to right, rgba(10, 10, 40, 0.95), rgba(20, 20, 60, 0.95));
              border: 12px solid #8b4513;
              border-image: 
                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%238b4513"/><path d="M10,10 L90,90 M90,10 L10,90" stroke="%235d4037" stroke-width="3"/></svg>') 30 round;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 
                0 0 50px rgba(139, 0, 0, 0.5),
                inset 0 0 100px rgba(0, 0, 0, 0.4);
              position: relative;
            }
            
            .grimoire-header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 30px;
              border-bottom: 3px double #d4af37;
              position: relative;
            }
            
            .title {
              font-size: 3.5em;
              color: #d4af37;
              text-shadow: 
                0 0 15px rgba(212, 175, 55, 0.7),
                3px 3px 5px rgba(0, 0, 0, 0.8);
              margin-bottom: 10px;
              font-weight: bold;
              letter-spacing: 2px;
            }
            
            .subtitle {
              font-size: 1.3em;
              color: #b08d57;
              font-style: italic;
            }
            
            .stats-container {
              display: flex;
              justify-content: space-around;
              background: rgba(139, 0, 0, 0.2);
              padding: 20px;
              border-radius: 10px;
              margin: 25px 0;
              border: 2px solid #8b0000;
            }
            
            .stat-item {
              text-align: center;
            }
            
            .stat-number {
              font-size: 2.2em;
              color: #d4af37;
              font-weight: bold;
              text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
            }
            
            .stat-label {
              font-size: 0.9em;
              color: #b08d57;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .carte-section {
              background: 
                linear-gradient(90deg, transparent, rgba(139, 0, 0, 0.1), transparent),
                rgba(0, 0, 0, 0.3);
              padding: 25px;
              border-radius: 12px;
              margin: 30px 0;
              border: 2px solid #5d4037;
              position: relative;
            }
            
            .section-title {
              font-size: 1.8em;
              color: #d4af37;
              text-align: center;
              margin-bottom: 25px;
              text-transform: uppercase;
              letter-spacing: 2px;
              border-bottom: 1px solid #b08d57;
              padding-bottom: 10px;
            }
            
            .cartes-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 15px;
              margin-top: 20px;
            }
            
            .carte-item {
              background: 
                linear-gradient(135deg, rgba(139, 0, 0, 0.3), rgba(101, 67, 33, 0.2));
              padding: 15px;
              border-radius: 8px;
              text-align: center;
              transition: all 0.3s ease;
              border: 1px solid #5d4037;
              cursor: pointer;
              position: relative;
              overflow: hidden;
            }
            
            .carte-item:hover {
              transform: translateY(-5px);
              box-shadow: 
                0 5px 25px rgba(212, 175, 55, 0.4),
                0 0 30px rgba(139, 0, 0, 0.3);
              border-color: #d4af37;
              background: 
                linear-gradient(135deg, rgba(139, 0, 0, 0.5), rgba(101, 67, 33, 0.4));
            }
            
            .carte-item::before {
              content: '🃏';
              position: absolute;
              top: 5px;
              left: 5px;
              opacity: 0.3;
              font-size: 0.8em;
            }
            
            .carte-nom {
              font-weight: bold;
              color: #e8d5b5;
              font-size: 1.1em;
              text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
            }
            
            .footer {
              text-align: center;
              margin-top: 50px;
              padding-top: 20px;
              border-top: 2px double #d4af37;
              color: #b08d57;
              font-size: 0.9em;
            }
            
            .command-help {
              background: rgba(0, 0, 0, 0.4);
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #8b0000;
            }
            
            .alphabet-index {
              display: flex;
              justify-content: center;
              flex-wrap: wrap;
              gap: 5px;
              margin: 15px 0;
            }
            
            .letter-link {
              padding: 5px 10px;
              background: rgba(139, 0, 0, 0.3);
              border-radius: 4px;
              cursor: pointer;
              transition: all 0.2s ease;
            }
            
            .letter-link:hover {
              background: rgba(212, 175, 55, 0.3);
              transform: scale(1.1);
            }
            
            @media (max-width: 768px) {
              .duel-grimoire {
                padding: 15px;
                border-width: 8px;
              }
              
              .title {
                font-size: 2.5em;
              }
              
              .cartes-grid {
                grid-template-columns: 1fr;
              }
              
              .stats-container {
                flex-direction: column;
                gap: 15px;
              }
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="duel-grimoire">
            <div class="grimoire-header">
              <h1 class="title">🃏 YU-GI-OH! 🃏</h1>
              <p class="subtitle">Grimoire des Cartes Duel Monster</p>
            </div>
            
            <div class="stats-container">
              <div class="stat-item">
                <div class="stat-number">${sortedCartes.length}</div>
                <div class="stat-label">Cartes</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${new Date().getFullYear()}</div>
                <div class="stat-label">Édition</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">∞</div>
                <div class="stat-label">Puissance</div>
              </div>
            </div>
            
            <div class="command-help">
              <strong>📖 Commandes du Grimoire:</strong><br>
              • <code>!carte [nom]</code> - Invoquer une carte spécifique<br>
              • <code>!carte</code> - Ouvrir ce grimoire complet
            </div>
            
            <div class="carte-section">
              <h2 class="section-title">📜 Catalogue des Cartes</h2>
              
              <div class="alphabet-index">
                ${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => 
                  `<span class="letter-link">${letter}</span>`
                ).join('')}
              </div>
              
              <div class="cartes-grid">
                ${sortedCartes.map(carte => `
                  <div class="carte-item" onclick="this.style.background='rgba(212, 175, 55, 0.3)'">
                    <div class="carte-nom">${carte}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="footer">
              <p>© 2024 Yu-Gi-Oh! Duel Monster - Kaiba Corporation</p>
              <p>L'ombre de la créature se profile... le duel commence !</p>
            </div>
          </div>
          
          <script>
            // Script pour la navigation par lettre
            document.querySelectorAll('.letter-link').forEach(link => {
              link.addEventListener('click', function() {
                const letter = this.textContent;
                const targetElement = document.querySelector(\`.carte-nom:contains("$\{letter}")\`);
                if (targetElement) {
                  targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  targetElement.parentElement.style.background = 'rgba(212, 175, 55, 0.5)';
                  setTimeout(() => {
                    targetElement.parentElement.style.background = '';
                  }, 2000);
                }
              });
            });
            
            // Polyfill pour :contains
            jQuery.expr[':'].contains = function(a, i, m) {
              return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
            };
          </script>
        </body>
        </html>
      `;

      const fileName = `grimoire_yugioh_${randomInt(10000)}.html`;
      writeFileSync(fileName, html);

      try {
        await zk.sendMessage(dest, {
          document: readFileSync(fileName),
          mimetype: 'text/html',
          filename: 'grimoire_yugioh.html',
          caption: `*🃏 GRIMOIRE YU-GI-OH! - DUEL MONSTER 🃏* \n\n` +
                  `*📊 Statistiques du Duel:*\n` +
                  `• Cartes enregistrées: ${sortedCartes.length}\n` +
                  `• Édition: ${new Date().getFullYear()}\n` +
                  `• Niveau de puissance: Illimité\n\n` +
                  `*🎮 Commandes de Duel:*\n` +
                  `\`!carte [nom]\` - Invoquer une carte\n` +
                  `\`!carte\` - Grimoire complet\n\n` +
                  `_Que le cœur des cartes soit avec toi !_ ✨`
        }, { quoted: ms });
      } catch (error) {
        console.error('Erreur d\'invocation du grimoire:', error);
        await zk.sendMessage(dest, {
          text: `*❌ L'ombre des créatures bloque l'accès au grimoire !*`
        }, { quoted: ms });
      } finally {
        unlinkSync(fileName);
      }
      return;
    }

    // 🔍 Rechercher une carte spécifique avec améliorations
    const nomRecherche = normalize(arg.join(" "));
    const nomTrouve = Object.keys(deck_cards).find(
      nom => normalize(nom) === nomRecherche
    );

    if (nomTrouve) {
      // Déterminer le type de carte par le nom (simulation)
      const typeCarte = nomTrouve.includes('Dragon') ? '🐉' :
                       nomTrouve.includes('Magicien') ? '🧙' :
                       nomTrouve.includes('Guerrier') ? '⚔️' :
                       nomTrouve.includes('Magic') ? '✨' :
                       nomTrouve.includes('Piège') ? '🕳️' : '🃏';

      await zk.sendMessage(dest, {
        image: { url: deck_cards[nomTrouve] },
        caption: `*${typeCarte} ${nomTrouve} ${typeCarte}*\n\n` +
                `*💫 Type:* Monstre/Effet\n` +
                `*⭐ Étoiles:* ★★★★★\n` +
                `*💥 ATK/DEF:* 2500/2000\n\n` +
                `_"Le pouvoir des anciens Égyptiens repose dans cette carte !"_`
      }, { quoted: ms });
    } else {
      // Suggestions de cartes similaires
      const suggestions = Object.keys(deck_cards).filter(nom =>
        normalize(nom).includes(nomRecherche) || 
        nomRecherche.includes(normalize(nom).substring(0, 3))
      ).slice(0, 5);

      let message = `*❌ CARTE INTROUVABLE :* "${arg.join(" ")}"\n\n`;
      message += `*🧠 Suggestions possibles:*\n`;
      
      if (suggestions.length > 0) {
        message += suggestions.map((sugg, index) => 
          `${index + 1}. ${sugg}`
        ).join('\n');
      } else {
        message += `Aucune suggestion trouvée. Vérifie l'orthographe.`;
      }
      
      message += `\n\n*💡 Utilise \`!carte\` pour voir toutes les cartes disponibles.*`;

      await zk.sendMessage(dest, { text: message }, { quoted: ms });
    }
  }
);

// Fonction de normalisation des noms de cartes
function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

// Nouvelle commande : .cleanmydeck - Supprimer sa session
zokou(
  {
    nomCom: 'cleanmydeck',
    categorie: 'YU-GI-OH'
  },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    const userId = getUserId(zk, ms);
    const groupId = getGroupId(dest);
    
    try {
      const deleted = await db.deleteDeckSession(userId, groupId);
      if (deleted) {
        await zk.sendMessage(dest, {
          text: `✅ Votre session de deck a été supprimée avec succès.`
        }, { quoted: ms });
      } else {
        await zk.sendMessage(dest, {
          text: `ℹ️ Aucune session de deck active à supprimer.`
        }, { quoted: ms });
      }
    } catch (error) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur lors de la suppression de la session.`
      }, { quoted: ms });
    }
  }
);

// Nouvelle commande : .groupdecks - Voir les decks du groupe
zokou(
  {
    nomCom: 'groupdecks',
    categorie: 'YU-GI-OH'
  },
  async (dest, zk, commandeOptions) => {
    const { ms } = commandeOptions;

    const groupId = getGroupId(dest);
    
    try {
      const sessions = await db.getGroupDeckSessions(groupId);
      if (sessions.length === 0) {
        await zk.sendMessage(dest, {
          text: `ℹ️ Aucun deck actif dans ce groupe.`
        }, { quoted: ms });
        return;
      }

      const message = `🗂️ *DECKS ACTIFS DU GROUPE*\n\n` +
        sessions.map(session => 
          `👤 Utilisateur: ${session.user_id}\n` +
          `🃏 Deck: ${session.deck_name}\n` +
          `🕐 Dernière activité: ${new Date(session.updated_at).toLocaleString()}\n` +
          `────────────────`
        ).join('\n');

      await zk.sendMessage(dest, { text: message }, { quoted: ms });
    } catch (error) {
      await zk.sendMessage(dest, {
        text: `❌ Erreur lors de la récupération des decks du groupe.`
      }, { quoted: ms });
    }
  }
);

module.exports = { 
  // Export des fonctions utilitaires pour un usage externe si nécessaire
  getSessionFromDB,
  saveSessionToDB
};
