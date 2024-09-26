const { zokou } = require('../framework/zokou');
const { createProfile, updateProfile, getProfile } = require('../bdd/playertest');

zokou(
    {
        nomCom: 'profile',  // Peut être dynamique
        categorie: 'Player-Profile'
    }, async (dest, zk, commandeOptions) => {

        const { arg, repondre, superUser } = commandeOptions;
        const playerID = 'player1'; // Déterminez dynamiquement le joueur actuel

        if (!arg || !arg[0]) {
            // Affiche le profil du joueur
            const profile = await getProfile(playerID);
            if (profile) {
                const profilTexte = `
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
═══════════════════  
*..........| SRPN PROFIL |..........*  
═══════════════════  
> *👤 ID :* ${playerID}  
> *♨️ Statut :* ${profile.status}  
> *🪀 Mode :* ${profile.mode}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*..............| EXPLOITS |.............*  
═══════════════════  
> *🧘‍♂️ Rang :* ABM: ${profile.rank.ABM}, Speed Rush: ${profile.rank['Speed Rush']}, Yu-Gi-Oh: ${profile.rank['Yu-Gi-Oh']}  
> *🏆 Champion :* ${profile.champion}  
> *😎 Spécialité :* ${profile.specialty}  
> *👑 Leader :* ${profile.leader}  
> *🤼‍♂️ Challenge :* ${profile.challenge_count}  
> *💯 Légende :* ${profile.legend_titles}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*................| STATS |................*  
═══════════════════  
> *👊 Battles :* V: ${profile.battles.V} | D: ${profile.battles.D} | L: ${profile.battles.L}  
> *🏅 TOP 3 :* ${profile.top3}  
> *🎭 Story Mode :* M.W: ${profile.story_mode["M.W"]} / M.L: ${profile.story_mode["M.L"]}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*.........| HEROES GAME |.........*  
═══════════════════  
> *🀄 Cards AMB :* ${profile.heroes_game['Cards AMB']}  
> *🚗 Vehicles :* ${profile.heroes_game['Vehicles']}  
> *🃏 Yu-Gi-Oh :* ${profile.heroes_game['Yu-Gi-Oh']}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*.............| CURRENCY |............*  
═══════════════════  
> *🧭 S Tokens :* ${profile.currency['S Tokens']}🧭  
> *💎 S Gemmes :* ${profile.currency['S Gemmes']}💎  
> *🎟️ Coupons :* ${profile.currency['Coupons']}🎟️  
> *🎁 Box VIP :* ${profile.currency['Box VIP']}🎁  
> *📟 Compteur :* ${profile.currency['Compteur']}FCFA💸  
═══════════════════  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
...........| *♼ Chargement...* |.........
                `;
                repondre(profilTexte);
            } else {
                repondre("Aucun profil trouvé pour ce joueur.");
            }
        } else {
            // Met à jour une section du profil
            if (!superUser) {
                repondre("🛂 Réservé aux membres de la *DRPN*");
            } else {
                const [section, value] = arg.join(' ').split(';');
                await updateProfile(playerID, section, value);
                repondre(`Profil mis à jour : Section ${section}`);
            }
        }
    }
);