const { zokou } = require('../framework/zokou');
const { 
  insertPlayerProfile, 
  getPlayerProfile, 
  updatePlayerProfile, 
  deletePlayerProfile 
} = require('../bdd/player_bdd');

// Configuration des profils prédéfinis
const PREDEFINED_PROFILES = {
  'sigma': {
    displayName: 'Sigma Suprêmus',
    imageUrl: 'https://i.ibb.co/XfsZRCtV/Image-2025-09-01-13-05-32-1.jpg'
  },
  'rimuru': {
    displayName: 'Rimuru Tempest',
    imageUrl: 'https://i.ibb.co/MycMBpbZ/Image-2025-09-06-10-54-29-1.jpg'
  },
  'tenno': {
    displayName: 'Tenno Suprêmus',
    imageUrl: 'https://i.ibb.co/XkLgtVCR/Image-2025-09-07-07-05-38-1.jpg'
  },
  'nelly': {
    displayName: 'Nelly',
    imageUrl: 'https://i.ibb.co/5WjNj2qC/Image-2025-09-07-07-05-38-0.jpg'
  },
  'gaku': {
    displayName: 'Vernesis Gaku',
    imageUrl: 'https://i.ibb.co/WvhqHxDT/Image-2025-09-06-11-25-59.jpg'
  },
  'inferno': {
    displayName: 'Inferno',
    imageUrl: 'https://i.ibb.co/nNQzjF4S/Image-2025-09-06-10-54-29-4.jpg'
  },
  'kuro': {
    displayName: 'Kuro Neko',
    imageUrl: 'https://i.ibb.co/k2Qz7H3L/Image-2025-09-06-10-54-29-2.jpg'
  },
  'dohan': {
    displayName: 'Dohan',
    imageUrl: 'https://i.ibb.co/Nn1S7Nvg/Image-2025-09-06-10-54-29-0.jpg'
  },
  'manjiro': {
    displayName: 'Manjiro',
    imageUrl: 'https://i.ibb.co/8Lj9xC5v/Image-2025-09-01-16-08-08.jpg'
  },
  'rudeus': {
    displayName: 'Rudeus Hells',
    imageUrl: 'https://i.ibb.co/pjXK9W9C/Image-2025-09-06-10-54-29-5.jpg'
  },
  'lord': {
    displayName: 'Lord',
    imageUrl: 'https://i.ibb.co/cS3csSg0/Image-2025-09-01-22-16-13-1.jpg'
  },
  'xuan': {
    displayName: 'Ye Xuan',
    imageUrl: 'https://i.ibb.co/VcT9xNny/Image-2025-09-01-13-05-32-2.jpg'
  },
  'pnj': {
    displayName: 'Ultra PNJ',
    imageUrl: 'https://i.ibb.co/JR7LqqrP/Image-2025-09-01-13-05-32-0.jpg'
  }
};

// Schéma de validation des champs
const FIELD_SCHEMA = {
  // Champs numériques
  NUMERIC: new Set([
    'victoires', 'defaites', 'forfaits', 'top3', 'supremus_points', 'box_vip',
    'xp', 'sante', 'energie', 'heart', 'faim', 'soif', 'reputation',
    's_tokens', 's_gemmes', 'coupons', 'acceuil', 'arbitrage', 'transaction',
    'diffusion', 'designs', 'story', 'balance', 'depenses', 'profits', 'retraits', 'solde'
  ]),

  // Champs de type liste
  LISTS: new Set([
    'heroes', 'vehicles', 'yugioh_deck', 'items', 'skins'
  ])
};

// Liste complète des champs organisés par catégories
const FIELD_CATEGORIES = {
  'PROFIL': ['name', 'statut', 'mode'],
  'EXPLOITS': ['supremus_cup', 'division', 'statut_abm', 'statut_speed_rush', 
               'statut_yugioh', 'statut_origamy_world', 'best_game', 'defi_hebdo', 'challenge'],
  'STATS': ['victoires', 'defaites', 'forfaits', 'top3', 'supremus_points', 'box_vip'],
  'GAMES': ['heroes', 'vehicles', 'yugioh_deck', 'skins', 'rank', 'xp', 
            'sante', 'energie', 'heart', 'faim', 'soif', 'reputation', 'items'],
  'MONEY': ['s_tokens', 's_gemmes', 'coupons'],
  'COMPTEUR': ['acceuil', 'arbitrage', 'transaction', 'diffusion', 'designs', 'story', 'balance'],
  'ACCOUNT': ['depenses', 'profits', 'retraits', 'solde']
};

// Messages constants
const MESSAGES = {
  ERRORS: {
    INVALID_FORMAT: "❌ Format de commande invalide. *Utilisation :* champ1=value1; champ2+=value2",
    FIELD_NOT_EXIST: "Le champ *%s* n'existe pas",
    NUMERIC_REQUIRED: "❌ La valeur pour *%s* doit être numérique",
    LIST_OPERATION: "❌ L'opération *%s* n'est pas autorisée pour le champ texte *%s*",
    DB_ERROR: "❌ Erreur base de données",
    IMAGE_LOAD: "⚠️ Impossible de charger l'image du profil",
    PERMISSION_DENIED: "🚫 Action réservée à l'administration.",
    INVALID_OPERATION: "❌ Opération non supportée pour le champ *%s*",
    DB_UPDATE_ERROR: "❌ Erreur lors de la mise à jour de la base de données"
  },
  SUCCESS: {
    PROFILE_CREATED: "_✅ Profil joueur *%s* créé avec succès_",
    PROFILE_UPDATED: "_✅ Profil *%s* mis à jour avec succès_",
    PROFILE_DELETED: "_✅ Profil de %s supprimé avec succès_"
  },
  INFO: {
    NO_CHANGES: "ℹ️ Aucune modification effectuée",
    PROFILE_NOT_FOUND: "ℹ️ Profil *%s* non trouvé",
    FIELD_LIST: "*📋 LISTE DES CHAMPS MODIFIABLES :*"
  }
};

/**
 * Formatte le message du profil joueur
 */
function formatProfileMessage(data) {
  return `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓[SRPN PROFIL]▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *🆔 Nom :* ${data.name}  
> *♨️ Statut :* ${data.statut}  
> *🪀 Mode :* ${data.mode}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[EXPLOITS]▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ 
> *🏆 Supremus Cup :* ${data.supremus_cup}  
> *🧑‍🧑‍🧒‍🧒 DIVISION :* ${data.division}
> *🎮 STATUT :*  
> - *ABM :* ${data.statut_abm}  
> - *SPEED RUSH :* ${data.statut_speed_rush}  
> - *YU-GI-OH :* ${data.statut_yugioh}  
> - *ORIGAMY WORLD :* ${data.statut_origamy_world}
> *🌟 Best Game :* ${data.best_game}
> *💯 Défi Hebdo :* ${data.defi_hebdo}
> *👥 Challenge :* ${data.challenge}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[STATS]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *👊 Battles :* V : 00${data.victoires} | D : 00${data.defaites} | L : 00${data.forfaits}   
> *🏅TOP 3 :* 00${data.top3}  
> *🔹S Points :* ${data.supremus_points}
> *🎁 Box VIP :* ${data.box_vip}
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[GAMES]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *🎴 Heroes :* ${data.heroes}  
> *🚗 Vehicles :* ${data.vehicles} 
> *🃏 Yu-Gi-Oh :* ${data.yugioh_deck}  
> *🌐 Origamy World Story :*  
> - *🚻 Skins :* ${data.skins}  
> - *🎚️ Rank :* ${data.rank}
> - *⭐ XP :* ${data.xp}
> - *👾 Stats :* ${data.sante}❤️ | ${data.energie}🌀
> ${data.heart}🫀 | ${data.faim}🍽️
> ${data.soif}🍶 | ${data.reputation}🎭
> - *🎒 Items :* ${data.items}  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓[MONEY]▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *🧭 S Tokens :* ${data.s_tokens}🧭  
> *💎 S Gemmes :* ${data.s_gemmes}💎  
> *🎟️ Coupons :* ${data.coupons}🎟️  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[COMPTEUR]▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> - *🫂 Acceuil :* ${data.acceuil}  
> - *⚖️ Arbitrage :* ${data.arbitrage}  
> - *🤝 Transaction :* ${data.transaction}  
> - *📣 Diffusion :* ${data.diffusion}  
> - *🎨 Designs :* ${data.designs}  
> - *🌐 Story :* ${data.story}  
> *📟 BALANCE :* ${data.balance}🧭  
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[ACCOUNT]▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *💰 Dépenses :* ${data.depenses}FCFA  
> *💵 Profits :* ${data.profits}FCFA  
> *🏧 Retraits :* ${data.retraits}FCFA  
> *💳 Solde :* ${data.solde}FCFA
*▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
}

/**
 * Traite les opérations de mise à jour avec suivi détaillé
 */
function processProfileUpdates(data, command) {
  const updates = {};
  const successfulChanges = [];
  const failedChanges = [];

  const fieldPairs = command.split(';').map(pair => pair.trim());
  const allFields = Object.values(FIELD_CATEGORIES).flat();

  for (const fieldPair of fieldPairs) {
    if (!fieldPair) continue;

    let operator = null;
    let field = null;
    let rawValue = null;

    // Détection de l'opérateur
    if (fieldPair.includes('+=')) {
      [field, rawValue] = fieldPair.split('+=').map(item => item.trim());
      operator = 'add';
    } else if (fieldPair.includes('-=')) {
      [field, rawValue] = fieldPair.split('-=').map(item => item.trim());
      operator = 'remove';
    } else if (fieldPair.includes('=')) {
      [field, rawValue] = fieldPair.split('=').map(item => item.trim());
      operator = 'set';
    } else {
      failedChanges.push({
        field: fieldPair,
        error: MESSAGES.ERRORS.INVALID_FORMAT
      });
      continue;
    }

    // Validation du champ
    if (!allFields.includes(field)) {
      failedChanges.push({
        field,
        value: rawValue,
        error: MESSAGES.ERRORS.FIELD_NOT_EXIST.replace('%s', field)
      });
      continue;
    }

    try {
      const oldValue = data[field] || (FIELD_SCHEMA.NUMERIC.has(field) ? 0 : '');
      let newValue = oldValue;

      // Traitement des champs numériques
      if (FIELD_SCHEMA.NUMERIC.has(field)) {
        let numericValue;
        
        // Pour les opérations += et -=, vérifier que rawValue est numérique
        numericValue = Number(rawValue);
        if (isNaN(numericValue)) {
          failedChanges.push({
            field,
            value: rawValue,
            error: MESSAGES.ERRORS.NUMERIC_REQUIRED.replace('%s', field)
          });
          continue;
        }

        switch (operator) {
          case 'add':
            newValue = Number(oldValue) + numericValue;
            break;
          case 'remove':
            newValue = Number(oldValue) - numericValue;
            break;
          default:
            newValue = numericValue;
        }
      }
      // Traitement des listes
      else if (FIELD_SCHEMA.LISTS.has(field)) {
        const currentList = oldValue ? oldValue.split(',').map(item => item.trim()) : [];
        
        switch (operator) {
          case 'add':
            const itemsToAdd = rawValue.split(',').map(item => item.trim());
            itemsToAdd.forEach(item => {
              if (!currentList.includes(item)) currentList.push(item);
            });
            newValue = currentList.join(', ');
            break;
          case 'remove':
            const itemsToRemove = rawValue.split(',').map(item => item.trim());
            newValue = currentList.filter(item => !itemsToRemove.includes(item)).join(', ');
            break;
          default:
            newValue = rawValue;
        }
      }
      // Traitement des champs texte simples
      else {
        if (operator !== 'set') {
          failedChanges.push({
            field,
            value: rawValue,
            error: MESSAGES.ERRORS.LIST_OPERATION
              .replace('%s', operator)
              .replace('%s', field)
          });
          continue;
        }
        newValue = rawValue;
      }

      // Enregistrement des modifications
      if (newValue !== oldValue) {
        updates[field] = newValue;
        successfulChanges.push({
          field,
          oldValue,
          newValue
        });
      }
    } catch (error) {
      failedChanges.push({
        field,
        value: rawValue,
        error: error.message
      });
    }
  }

  return { updates, successfulChanges, failedChanges };
}

/**
 * Formatte les résultats des modifications pour l'affichage
 */
function formatUpdateResults(profileName, successfulChanges, failedChanges) {
  let response = `🪀 *DÉTAILS MISE À JOUR POUR :* ${profileName}*\n\n`;

  // Affichage des succès
  if (successfulChanges.length > 0) {
    response += "✅ *Modifications réussies:*\n";
    successfulChanges.forEach(change => {
      response += `• *${change.field}:* ${change.oldValue} ➡️ ${change.newValue}\n`;
    });
    response += "\n";
  }

  // Affichage des échecs
  if (failedChanges.length > 0) {
    response += "❌ *Échecs de modification:*\n";
    failedChanges.forEach(fail => {
      response += `• *${fail.field}=${fail.value}:* ${fail.error}\n`;
    });
    response += "\n";
  }

  // Suggestions si échecs
  if (failedChanges.length > 0) {
    response += "💡 *CONSEILS:*\n";
    response += "- Vérifiez l'orthographe des champs avec `-champs`\n";
    response += "- Pour les nombres, utilisez seulement des chiffres\n";
    response += "- Format: `champ=valeur` ou `champ+=valeur`\n";
  }

  return response;
}

// Enregistrement des commandes de profil
Object.entries(PREDEFINED_PROFILES).forEach(([command, profile]) => {
  zokou({
    nomCom: command,
    categorie: 'PLAYER-PROFIL',
    reaction: '👤',
    desc: `Affiche ou modifie le profil ${profile.displayName}`
  }, async (dest, zk, { ms, repondre, arg, superUser }) => {
    try {
      // Récupération ou création du profil
      let playerData = await getPlayerProfile(profile.displayName);

      if (!playerData) {
        await insertPlayerProfile(profile.displayName);
        playerData = await getPlayerProfile(profile.displayName);
        repondre(MESSAGES.SUCCESS.PROFILE_CREATED.replace('%s', profile.displayName));
      }

      // Affichage simple du profil
      if (!arg || arg.length === 0) {
        try {
          await zk.sendMessage(
            dest, 
            { 
              image: { url: profile.imageUrl }, 
              caption: formatProfileMessage(playerData) 
            }, 
            { quoted: ms }
          );
        } catch (imageError) {
          console.error('Erreur image:', imageError);
          await zk.sendMessage(
            dest, 
            { text: formatProfileMessage(playerData) }, 
            { quoted: ms }
          );
        }
        return;
      }

      // Vérification des permissions admin
      if (!superUser) {
        repondre(MESSAGES.ERRORS.PERMISSION_DENIED);
        return;
      }

      // Traitement des modifications
      const { updates, successfulChanges, failedChanges } = processProfileUpdates(
        playerData,
        arg.join(' ')
      );

      // Application des modifications
      if (Object.keys(updates).length > 0) {
        try {
          await updatePlayerProfile(profile.displayName, updates);
        } catch (error) {
          console.error('Erreur updatePlayerProfile:', error);
          repondre(MESSAGES.ERRORS.DB_UPDATE_ERROR);
          return;
        }
      }

      // Construction de la réponse
      if (successfulChanges.length > 0 || failedChanges.length > 0) {
        repondre(formatUpdateResults(
          profile.displayName,
          successfulChanges,
          failedChanges
        ));
      } else {
        repondre(MESSAGES.INFO.NO_CHANGES);
      }

    } catch (error) {
      console.error('Erreur commande:', error);
      repondre(`${MESSAGES.ERRORS.DB_ERROR}: ${error.message}`);
    }
  });
});

// Commande pour lister les champs disponibles
zokou({
  nomCom: "champs",
  categorie: "PLAYER-PROFIL",
  reaction: "📋",
  desc: "Affiche la liste des champs modifiables"
}, async (dest, zk, { repondre }) => {
  let message = `${MESSAGES.INFO.FIELD_LIST}\n\n`;

  // Construction du message par catégories
  Object.entries(FIELD_CATEGORIES).forEach(([category, fields]) => {
    message += `*${category}* :\n`;
    message += `${fields.join(', ')}\n\n`;
  });

  message += "💡 *USAGE* :\n";
  message += "- `champ=valeur` : Définit une valeur\n";
  message += "- `champ+=valeur` : Ajoute à la valeur existante (addition pour les nombres)\n";
  message += "- `champ-=valeur` : Retire de la valeur existante (soustraction pour les nombres)\n";
  message += "- Séparer plusieurs modifications par `;`";

  repondre(message);
});

// Commande de suppression de profil
zokou({
  nomCom: "delprofil",
  categorie: "DRPN",
  reaction: "🗑️",
  desc: "Supprime un profil joueur (admin)"
}, async (dest, zk, { arg, repondre, superUser }) => {
  try {
    // Vérification permission
    if (!superUser) {
      return repondre(MESSAGES.ERRORS.PERMISSION_DENIED);
    }

    const playerName = arg.join(" ").trim();

    // Validation nom joueur
    if (!playerName) {
      return repondre("❗ Spécifiez un nom de joueur");
    }

    // Suppression profil
    const result = await deletePlayerProfile(playerName);

    repondre(result ?
      MESSAGES.SUCCESS.PROFILE_DELETED.replace('%s', playerName) :
      MESSAGES.INFO.PROFILE_NOT_FOUND.replace('%s', playerName)
    );

  } catch (error) {
    console.error('Erreur suppression:', error);
    repondre(`${MESSAGES.ERRORS.DB_ERROR}: ${error.message}`);
  }
});