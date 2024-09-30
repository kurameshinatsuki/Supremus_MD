const { zokou } = require('../framework/zokou');
const { addOrUpdateDataInPlayer, getDataFromPlayer } = require('../bdd/player'); // Fonctionnalités pour la base de données

zokou(
    {
        nomCom: 'player1',  // Peut être dynamique
        categorie: 'Test-Player'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;
        const playerName = 'player1'; // Peut être dynamique en fonction de la commande

        try {
            // Récupérer les données actuelles du joueur depuis la base de données
            const data = await getDataFromPlayer(playerName);

            if (!arg || !arg[0] || arg.join('') === '') {
                // Si aucune commande n'est spécifiée, on affiche la fiche du joueur
                if (data) {
                    // Utilisation de valeurs par défaut si certaines données sont manquantes
                    const ficheJoueur = `
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
═══════════════════  
*..........| SRPN PROFIL |..........*  
═══════════════════  
> *👤 ID :* ${data.s1 ?? 'ID inconnu'}  
> *♨️ Statut :* ${data.s2 ?? 'Statut non défini'}  
> *🪀 Mode :* ${data.s3 ?? 'Mode par défaut'}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*..............| EXPLOITS |.............*  
═══════════════════  
> *🧘‍♂️ Rang :* ${data.s4 ?? '0'}/${data.s5 ?? '0'}/${data.s6 ?? '0'}  
- *ABM :* ${data.s4 ?? 'Aucun'}  
- *SPEED RUSH :* ${data.s5 ?? 'Aucun'}  
- *YU-GI-OH :* ${data.s6 ?? 'Aucun'}  
> *🏆 Champion :* ${data.s7 ?? 'Aucun'}  
> *😎 Spécialité :* ${data.s8 ?? 'Non spécifié'}  
> *👑 Leader :* ${data.s9 ?? 'Non spécifié'}  
> *🤼‍♂️ Challenge :* ${data.s10 ?? 'Aucun'}  
> *💯 Légende :* ${data.s11 ?? 'Inconnue'}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*................| STATS |................*  
═══════════════════  
> *👊 Battles :* ${data.s12 ?? '0'}  
- *V :* ${data.s13 ?? '0'} | *D :* ${data.s14 ?? '0'} | *L :* ${data.s15 ?? '0'}  
> *🏅 TOP 3 :* ${data.s16 ?? '0'}  
> *🎭 Story Mode :*  
- *M.W :* ${data.s17 ?? '0'} / *M.L :* ${data.s18 ?? '0'}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*.........| HEROES GAME |.........*  
═══════════════════  
> *🀄 Cards AMB :*  
- ${data.s19 ?? 'Aucune'}  
> *🚗 Vehicles :*  
- ${data.s20 ?? 'Aucun'}  
> *🃏 Yu-Gi-Oh :*  
- ${data.s21 ?? 'Aucune carte'}  
> *🪐 Origamy World :*  
- *🚻 Skins :* ${data.s22 ?? 'Aucun'}  
- *🎒 Items :* ${data.s23 ?? 'Aucun'}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*.............| CURRENCY |............*  
═══════════════════  
> *🧭 S Tokens :* ${data.s24 ?? '0'}🧭  
> *💎 S Gemmes :* ${data.s25 ?? '0'}💎  
> *🎟️ Coupons :* ${data.s26 ?? '0'}🎟️  
> *🎁 Box VIP :* ${data.s27 ?? '0'}🎁  
> *📟 Compteur :* ${data.s28 ?? '0'}FCFA💸  
═══════════════════  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
...........| *♼ Chargement...* |.........`;

                    // Envoyer la fiche du joueur
                    await zk.sendMessage(dest, ficheJoueur, { quoted: ms });
                } else {
                    repondre("🛃 Aucune fiche trouvée pour ce joueur.");
                }
            } else {
                // Si l'utilisateur a fourni des arguments pour mettre à jour les données
                if (!superUser) {
                    repondre("🛂 Réservé aux membres de la *DRPS*");
                } else {
                    // Parser la commande pour obtenir les modifications
                    const updates = arg.join(' ').split(';').reduce((acc, pair) => {
                        const [key, value] = pair.split(':');
                        if (key && value) {
                            acc[key.trim()] = value.trim();
                        }
                        return acc;
                    }, {});

                    // Appliquer les mises à jour dans la base de données
                    for (const [key, value] of Object.entries(updates)) {
                        // Ajouter une logique spécifique pour chaque colonne que tu veux mettre à jour
                        await addOrUpdateDataInPlayer(playerName, key, value);
                    }

                    repondre('✔️ Données actualisées avec succès');
                }
            }
        } catch (error) {
            console.log("Erreur lors du traitement de la commande : " + error);
            repondre("🥵 Une erreur est survenue lors du traitement de votre commande. Veuillez réessayer plus tard.");
        }
    }
);


zokou(
    {
        nomCom: 'player2',  // Peut être dynamique
        categorie: 'Test-Player'
    }, async (dest, zk, commandeOptions) => {

        const { ms, arg, repondre, superUser } = commandeOptions;
        const playerName = 'player2'; // Peut être dynamique en fonction de la commande

        try {
            // Récupérer les données actuelles du joueur depuis la base de données
            const data = await getDataFromPlayer(playerName);

            if (!arg || !arg[0] || arg.join('') === '') {
                // Si aucune commande n'est spécifiée, on affiche la fiche du joueur
                if (data) {
                    // Utilisation de valeurs par défaut si certaines données sont manquantes
                    const ficheJoueur = `
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
═══════════════════  
*..........| SRPN PROFIL |..........*  
═══════════════════  
> *👤 ID :* ${data.s1 ?? 'ID inconnu'}  
> *♨️ Statut :* ${data.s2 ?? 'Statut non défini'}  
> *🪀 Mode :* ${data.s3 ?? 'Mode par défaut'}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*..............| EXPLOITS |.............*  
═══════════════════  
> *🧘‍♂️ Rang :* ${data.s4 ?? '0'}/${data.s5 ?? '0'}/${data.s6 ?? '0'}  
- *ABM :* ${data.s4 ?? 'Aucun'}  
- *SPEED RUSH :* ${data.s5 ?? 'Aucun'}  
- *YU-GI-OH :* ${data.s6 ?? 'Aucun'}  
> *🏆 Champion :* ${data.s7 ?? 'Aucun'}  
> *😎 Spécialité :* ${data.s8 ?? 'Non spécifié'}  
> *👑 Leader :* ${data.s9 ?? 'Non spécifié'}  
> *🤼‍♂️ Challenge :* ${data.s10 ?? 'Aucun'}  
> *💯 Légende :* ${data.s11 ?? 'Inconnue'}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*................| STATS |................*  
═══════════════════  
> *👊 Battles :* ${data.s12 ?? '0'}  
- *V :* ${data.s13 ?? '0'} | *D :* ${data.s14 ?? '0'} | *L :* ${data.s15 ?? '0'}  
> *🏅 TOP 3 :* ${data.s16 ?? '0'}  
> *🎭 Story Mode :*  
- *M.W :* ${data.s17 ?? '0'} / *M.L :* ${data.s18 ?? '0'}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*.........| HEROES GAME |.........*  
═══════════════════  
> *🀄 Cards AMB :*  
- ${data.s19 ?? 'Aucune'}  
> *🚗 Vehicles :*  
- ${data.s20 ?? 'Aucun'}  
> *🃏 Yu-Gi-Oh :*  
- ${data.s21 ?? 'Aucune carte'}  
> *🪐 Origamy World :*  
- *🚻 Skins :* ${data.s22 ?? 'Aucun'}  
- *🎒 Items :* ${data.s23 ?? 'Aucun'}  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
*.............| CURRENCY |............*  
═══════════════════  
> *🧭 S Tokens :* ${data.s24 ?? '0'}🧭  
> *💎 S Gemmes :* ${data.s25 ?? '0'}💎  
> *🎟️ Coupons :* ${data.s26 ?? '0'}🎟️  
> *🎁 Box VIP :* ${data.s27 ?? '0'}🎁  
> *📟 Compteur :* ${data.s28 ?? '0'}FCFA💸  
═══════════════════  
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
...........| *♼ Chargement...* |.........`;

                    // Envoyer la fiche du joueur
                    await zk.sendMessage(dest, ficheJoueur, { quoted: ms });
                } else {
                    repondre("🛃 Aucune fiche trouvée pour ce joueur.");
                }
            } else {
                // Si l'utilisateur a fourni des arguments pour mettre à jour les données
                if (!superUser) {
                    repondre("🛂 Réservé aux membres de la *DRPS*");
                } else {
                    // Parser la commande pour obtenir les modifications
                    const updates = arg.join(' ').split(';').reduce((acc, pair) => {
                        const [key, value] = pair.split(':');
                        if (key && value) {
                            acc[key.trim()] = value.trim();
                        }
                        return acc;
                    }, {});

                    // Appliquer les mises à jour dans la base de données
                    for (const [key, value] of Object.entries(updates)) {
                        // Ajouter une logique spécifique pour chaque colonne que tu veux mettre à jour
                        await addOrUpdateDataInPlayer(playerName, key, value);
                    }

                    repondre('✔️ Données actualisées avec succès');
                }
            }
        } catch (error) {
            console.log("Erreur lors du traitement de la commande : " + error);
            repondre("🥵 Une erreur est survenue lors du traitement de votre commande. Veuillez réessayer plus tard.");
        }
    }
);