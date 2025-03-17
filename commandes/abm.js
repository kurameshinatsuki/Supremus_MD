const { zokou } = require("../framework/zokou");

const arenesABM = [
    { nom: 'Onigashima', image: 'https://i.ibb.co/mDvjVL0/20240925-123112.jpg' },
    { nom: 'Exorcism School', image: 'https://i.ibb.co/1z3LZhZ/20240925-121617.jpg' },
    { nom: 'Plaine', image: 'https://i.ibb.co/4R0WptC/20240925-114159.jpg' },
    { nom: 'Fairy Tail Building', image: 'https://i.ibb.co/sq8ymQC/20240925-113237.jpg' }
];

const duelsABM = {};
let lastArenaIndex = -1;

function tirerArABM() {
    let index;
    do {
        index = Math.floor(Math.random() * arenesABM.length);
    } while (index === lastArenaIndex);
    lastArenaIndex = index;
    return arenesABM[index];
}

function limiterStatsABM(stats, stat, valeur) {
    if (stats[stat] === 100 && valeur > 0) {
        return { stats, message: '_⚠️ Statistique déjà au maximum!_' };
    }
    stats[stat] = Math.min(stats[stat] + valeur, 100);
    return { stats, message: null };
}

function generateFicheDuelABM(duel) {
    return `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓*
    🌐 𝐒𝐔𝐏𝐑𝐄𝐌𝐔𝐒 𝐍𝐀𝐓𝐈𝐎𝐍 🌐
   👊 𝐀𝐧𝐢𝐦𝐞 𝐁𝐚𝐭𝐭𝐥𝐞 𝐌𝐮𝐥𝐭𝐢𝐯𝐞𝐫𝐬 👊
*▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*\`👤 ${duel.equipe1[0].nom} :\`* 
> ❤️: ${duel.equipe1[0].stats.vie} | 🌀: ${duel.equipe1[0].stats.energie} | 🫀: ${duel.equipe1[0].stats.heart}

                     *𝙑𝙎*

*\`👤 ${duel.equipe2[0].nom} :\`* 
> ❤️: ${duel.equipe2[0].stats.vie} | 🌀: ${duel.equipe2[0].stats.energie} | 🫀: ${duel.equipe2[0].stats.heart}
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
          *\`FIGHTING RULE\`*

> - *Wtf :* MC
> - *Latence :* +100ms⚡
> - *Potentiel :* ${duel.statsCustom}
> - *Items :* (voir perso)
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
> *🔄 Tourneur :* ${duel.equipe2[0].nom} -> ${duel.equipe1[0].nom}
> *⚖️ Arbitre :* Auto Modo
> *🌦️ Météo :* (voir arène)
> *🌍 Zone :*  ${duel.arene.nom}
> *📌 Distance initiale :* 5m
> *⭕ Arène Stats :* (voir arène)
> *⏱️ Délai :* 6 + 2min max
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
> *🌍 Environnement :* (voir arène)

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
    *MAÎTRISE INITIALE "⭐" : 5*

> *❌ Sans Visuel :* -1⭐
> *❌ Pavé Lassant :* -2⭐
> *❌ Contredit Verdict :* -2⭐
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
> *🥇 Easy: 3:* Victory.
> *🥈 Medium: 2:* +30%🫀def
> *🥉 Hard: 1:* -70%❤️/+50%🫀
> *🏅 Perfect: 5:* No variation.
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
> *⚠️ Si vous achevez l'adversaire d'un seul coup, c'est un "ONE SHOT" +2⭐. Si vous l'achevez en full power, c'est "RAMPAGE" +2⭐. Et si vous gagnez contre un personnage de rang supérieur, c'est "MONSTER KILLER" +4⭐.*
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
> *⏱️ DELAY:* Si vous ne parvenez pas à battre l'adversaire avant la fin du compteur, la victoire revient au joueur en meilleure posture *(stats ou domination).*
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓[ CHARGEMENT... ]▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
}

// Commande pour démarrer un duel
zokou(
    { nomCom: 'abm_rule', categorie: 'ABM' },
    async (dest, zk, { repondre, arg, ms }) => {
        if (!arg[0]) {
            return repondre('Usage: -duel_abm joueur1 vs joueur2 / stats. Ex: -duel_abm Gojo vs Sukuna / Sukuna F: Gray');
        }

        try {
            const input = arg.join(' ');
            const [joueursInput, statsCustom] = input.split('/').map(p => p.trim());
            const [equipe1Str, equipe2Str] = joueursInput.split('vs').map(p => p.trim());

            if (!equipe1Str || !equipe2Str) return repondre('Erreur de format !');

            const equipe1 = equipe1Str.split(',').map(n => ({ nom: n.trim(), stats: { heart: 100, energie: 100, vie: 100 } }));
            const equipe2 = equipe2Str.split(',').map(n => ({ nom: n.trim(), stats: { heart: 100, energie: 100, vie: 100 } }));
            const areneT = tirerArABM();

            const duelKey = `${equipe1Str} vs ${equipe2Str}`;
            duelsABM[duelKey] = { equipe1, equipe2, statsCustom: statsCustom || 'Aucune stat personnalisée', arene: areneT };

            const ficheDuel = generateFicheDuelABM(duelsABM[duelKey]);
            await zk.sendMessage(dest, { image: { url: areneT.image }, caption: ficheDuel }, { quoted: ms });

        } catch (error) {
            console.error('Erreur lors du duel ABM:', error);
            repondre('Une erreur est survenue.');
        }
    }
);

zokou(
    { nomCom: 'duel_abm', categorie: 'ABM' },
    (dest, zk, { repondre, arg, ms }) => {
        if (arg.length < 1) return repondre(
            'Format: \n' +
            '- Pour ajuster une stat : @Joueur stat +/- valeur\n' +
            '  Ex: duel_abm Sukuna heart - 30\n' +
            '- Pour réinitialiser un joueur : reset @Joueur\n' +
            '- Pour réinitialiser tous les joueurs : reset all\n' +
            '- Pour supprimer tous les duels : delete'
        );

        const action = arg[0].trim().toLowerCase();

        // Gestion de la suppression de tous les duels
        if (action === 'delete') {
            for (const duelKey in duelsABM) {
                delete duelsABM[duelKey];
            }
            return repondre('Tous les duels en cours ont été supprimés.');
        }

        // Gestion de la réinitialisation des statistiques
        if (action === 'reset') {
            if (arg.length < 2) return repondre('Format: reset @Joueur ou reset all');

            const joueurId = arg[1].trim().toLowerCase();
            const duelKey = Object.keys(duelsABM).find(key => key.includes(joueurId));

            if (joueurId === 'all') {
                // Réinitialisation de tous les joueurs dans tous les duels
                for (const key in duelsABM) {
                    const duel = duelsABM[key];
                    duel.equipe1.forEach(j => j.stats = { heart: 100, energie: 100, vie: 100 });
                    duel.equipe2.forEach(j => j.stats = { heart: 100, energie: 100, vie: 100 });
                }
                return repondre('Les statistiques de tous les joueurs ont été réinitialisées.');
            }

            if (!duelKey) return repondre('Joueur non trouvé ou aucun duel en cours.');

            const duel = duelsABM[duelKey];
            const joueur = duel.equipe1.find(j => j.nom.toLowerCase() === joueurId) || duel.equipe2.find(j => j.nom.toLowerCase() === joueurId);

            if (!joueur) return repondre('Joueur non trouvé.');
            joueur.stats = { heart: 100, energie: 100, vie: 100 };
            repondre(`Les statistiques de ${joueur.nom} ont été réinitialisées.`);

            const ficheDuel = generateFicheDuelABM(duel);
            return zk.sendMessage(dest, { image: { url: duel.arene.image }, caption: ficheDuel }, { quoted: ms });
        }

        // Gestion de l'ajustement des statistiques
        if (arg.length < 4) return repondre('Format: @Joueur stat +/- valeur');

        const [joueurId, stat, signe, valeurStr] = arg;
        const valeur = parseInt(valeurStr);
        if (isNaN(valeur)) return repondre('Valeur invalide.');

        const duelKey = Object.keys(duelsABM).find(key => key.includes(joueurId));
        if (!duelKey) return repondre('Joueur non trouvé.');

        const duel = duelsABM[duelKey];
        const joueur = duel.equipe1.find(j => j.nom === joueurId) || duel.equipe2.find(j => j.nom === joueurId);
        if (!joueur || !['heart', 'energie', 'vie'].includes(stat)) return repondre('Stat invalide.');

        const { stats, message } = limiterStatsABM(joueur.stats, stat, (signe === '-' ? -valeur : valeur));
        joueur.stats = stats;

        if (message) repondre(message);

        const ficheDuel = generateFicheDuelABM(duel);
        zk.sendMessage(dest, { image: { url: duel.arene.image }, caption: ficheDuel }, { quoted: ms });
    }
);