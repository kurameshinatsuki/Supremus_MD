const { zokou } = require('../framework/zokou');
const db = require('../bdd/playertest'); // Assurez-vous d'importer votre module de base de données

zokou(
    {
        nomCom: 'profil_player',
        categorie: 'ABM'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg } = commandeOptions;

        // Vérifiez si l'ID du joueur est fourni
        if (!arg || arg.length === 0) {
            return repondre("Veuillez spécifier l'ID du joueur.");
        }

        const joueurID = arg[0]; // On prend le premier argument comme ID du joueur

        // Récupérer les données du joueur depuis la base de données
        const joueurData = await db.getDataFromPlayer(joueurID);
        if (!joueurData) {
            return repondre("Joueur non trouvé.");
        }

        // Si d'autres données à mettre à jour sont fournies
        const updates = arg.slice(1);
        if (updates.length > 0) {
            const modifications = {};
            updates.forEach(update => {
                const [key, value] = update.split('=');
                modifications[key.trim()] = value.trim(); // Ajoute chaque modification à l'objet
            });

            // Mettre à jour les données du joueur
            await db.addOrUpdateDataInPlayer(joueurID, modifications.message || joueurData.message, modifications.lien || joueurData.lien);
            repondre(`Profil de ${joueurID} mis à jour avec succès.`);
        }

        // Préparer le message d'affichage du profil
        const msg = `
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
═══════════════════  
*..........| SRPN PROFIL |..........*  
═══════════════════  
> *👤 ID :* ${joueurID}  
> *♨️ Statut :* ${joueurData.statut || 'Non spécifié'}  
> *🪀 Mode :* ${joueurData.mode || 'Non spécifié'}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*..............| EXPLOITS |.............*  
═══════════════════  
> *🧘‍♂️ Rang :* 
- *ABM :* ${joueurData.rang_abm || 'Non spécifié'}  
- *SPEED RUSH :* ${joueurData.rang_speed || 'Non spécifié'}  
- *YU-GI-OH :* ${joueurData.rang_yugioh || 'Non spécifié'}  
> *🏆 Champion :* ${joueurData.champion || 'Non spécifié'}  
> *😎 Spécialité :* ${joueurData.specialite || 'Non spécifié'}  
> *👑 Leader :* ${joueurData.leader || 'Non spécifié'}  
> *🤼‍♂️ Challenge :* ${joueurData.challenge || 0}  
> *💯 Légende :* ${joueurData.legend || 'Non spécifié'}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*................| STATS |................*  
═══════════════════  
> *👊 Battles :* ${joueurData.battles ? `Victoire : ${joueurData.battles.v} | Défaite : ${joueurData.battles.d} | Forfait : ${joueurData.battles.l}` : 'Non spécifié'}  
> *🏅 TOP 3 :* ${joueurData.top3 || 0}  
> *🎭 Story Mode :* 
- *M.W :* ${joueurData.storyMode ? joueurData.storyMode.mw : 0} / *M.L :* ${joueurData.storyMode ? joueurData.storyMode.ml : 0}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*.........| HEROES GAME |.........*  
═══════════════════  
> *🀄 Cards AMB :* ${joueurData.cards_amb ? joueurData.cards_amb.join(', ') : 'Aucune carte AMB'}  
> *🚗 Vehicles :* ${joueurData.vehicles ? joueurData.vehicles.join(', ') : 'Aucun véhicule'}  
> *🃏 Yu-Gi-Oh :* ${joueurData.yugioh || 'Aucun deck Yu-Gi-Oh'}  
> *🪐 Origamy Skins :* 
- *🚻 Skins :* ${joueurData.origamy_skins ? joueurData.origamy_skins.join(', ') : 'Aucun skin'}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*.............| CURRENCY |............*  
═══════════════════  
> *🧭 S Tokens :* ${joueurData.s_tokens || 0}🧭  
> *💎 S Gemmes :* ${joueurData.s_gemmes || 0}💎  
> *🎟️ Coupons :* ${joueurData.coupons || 0}🎟️  
> *🎁 Box VIP :* ${joueurData.box_vip || 0}🎁  
> *📟 Compteur :* ${joueurData.compteur || 0}FCFA💸  
═══════════════════  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
...........| *♼ Chargement...* |.........`;

        repondre(msg);
    }
);