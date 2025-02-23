const { zokou } = require('../framework/zokou');

// Fonction pour vérifier si un joueur a assez de coupons
const verifierCoupons = (joueur, prix) => {
    return joueur.coupons >= prix;
};

// Fonction pour générer le contenu du pack
const genererPack = (typePack) => {
    const packs = {
        bronze: { communs: 80, rares: 15, epics: 5, prix: 150 },
        argent: { communs: 60, rares: 30, epics: 10, prix: 200 },
        or: { communs: 40, rares: 40, epics: 15, legendaires: 5, prix: 250 },
        special: { communs: 20, rares: 40, epics: 30, legendaires: 10, prix: 300 }
    };

    const probabilites = packs[typePack.toLowerCase()];
    if (!probabilites) return null;

    // Générer le contenu en fonction des probabilités
    const contenu = [];
    const types = Object.keys(probabilites).filter(k => k !== 'prix');
    
    for (const type of types) {
        if (Math.random() * 100 <= probabilites[type]) {
            contenu.push(type);
        }
    }
    
    return { contenu, prix: probabilites.prix };
};

// Commande `acheter`
zokou(
    { nomCom: 'acheter', categorie: 'TRANSACTION' },
    async (dest, zk, commandeOptions) => {
        try {
            const { ms, args } = commandeOptions;

            if (!args || args.length < 2) {
                await zk.sendMessage(dest, { text: "⚠️ Utilisation correcte : `-acheter [jeu] [pack]`" }, { quoted: ms });
                return;
            }

            const [jeu, typePack] = args;
            const joueur = { coupons: 500 }; // Simulation du joueur (à remplacer par une vraie BDD)

            // Vérifier si le pack existe
            const pack = genererPack(typePack);
            if (!pack) {
                await zk.sendMessage(dest, { text: "❌ Pack invalide ! Choisissez parmi : Bronze, Argent, Or, Spécial." }, { quoted: ms });
                return;
            }

            // Vérifier si le joueur a assez de coupons
            if (!verifierCoupons(joueur, pack.prix)) {
                await zk.sendMessage(dest, { text: "💰 Fonds insuffisants ! Vous avez " + joueur.coupons + "🎫" }, { quoted: ms });
                return;
            }

            // Simuler la réduction des coupons du joueur
            joueur.coupons -= pack.prix;

            // Générer le message de confirmation
            const message = `🎁 **Achat Réussi !** 🎁\n\n📌 **Jeu :** ${jeu}\n📦 **Pack :** ${typePack}\n🪙 **Prix :** ${pack.prix}🎫\n📜 **Contenu :** ${pack.contenu.join(", ")}\n\nMerci pour votre achat !`;

            await zk.sendMessage(dest, { text: message }, { quoted: ms });

        } catch (error) {
            console.error("❌ Erreur Commande Acheter :", error);
            await zk.sendMessage(dest, { text: "⚠️ Une erreur est survenue lors de l'achat." }, { quoted: ms });
        }
    }
);