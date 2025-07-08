const { zokou } = require('../framework/zokou');
const { 
  insertPlayerProfile, 
  getPlayerProfile, 
  updatePlayerProfile, 
  deletePlayerProfile 
} = require('../bdd/player_bdd');

// Configuration des profils prédéfinis
const PREDEFINED_PROFILES = {
  'john': {
    displayName: 'John Sũpręmũs',
    imageUrl: 'https://i.ibb.co/cSxxrVFv/Image-2025-03-24-07-41-59-2.jpg'
  },
  'assistant': {
    displayName: 'Assistant Sũpręmũs',
    imageUrl: 'https://i.ibb.co/cSxxrVFv/Image-2025-03-24-07-41-59-2.jpg'
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
    PERMISSION_DENIED: "🚫 Action réservée à l'administration."
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
    if (!data.hasOwnProperty(field)) {
      failedChanges.push({
        field,
        value: rawValue,
        error: MESSAGES.ERRORS.FIELD_NOT_EXIST.replace('%s', field)
      });
      continue;
    }
    
    try {
      const oldValue = data[field];
      let newValue = oldValue;
      
      // Traitement des champs numériques
      if (FIELD_SCHEMA.NUMERIC.has(field)) {
        const numericValue = Number(rawValue);
        
        if (isNaN(numericValue)) {
          failedChanges.push({
            field,
            value: rawValue,
            error: MESSAGES.ERRORS.NUMERIC_REQUIRED.replace('%s', field)
          });
          continue;
        }
        
        switch (operator) {
          case 'add': newValue = oldValue + numericValue; break;
          case 'remove': newValue = oldValue - numericValue; break;
          default: newValue = numericValue;
        }
      }
      // Traitement des listes
      else if (FIELD_SCHEMA.LISTS.has(field)) {
        const list = oldValue ? oldValue.split(',').map(item => item.trim()) : [];
        
        switch (operator) {
          case 'add':
            const itemsToAdd = rawValue.split(',').map(item => item.trim());
            itemsToAdd.forEach(item => {
              if (!list.includes(item)) list.push(item);
            });
            newValue = list.join(', ');
            break;
          case 'remove':
            const itemsToRemove = rawValue.split(',').map(item => item.trim());
            newValue = list.filter(item => !itemsToRemove.includes(item)).join(', ');
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
        await updatePlayerProfile(profile.displayName, updates);
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
  message += "- `champ+=valeur` : Ajoute à la valeur existante\n";
  message += "- `champ-=valeur` : Retire de la valeur existante\n";
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