const { zokou } = require("../framework/zokou");

const arenesABM = [
    { nom: 'Infinity Fortress', image: 'https://i.ibb.co/1gGcfDr/Image-2025-03-21-14-41-20-14.jpg' },
    { nom: 'Shibuya Champ de Destruction', image: 'https://i.ibb.co/4v7vxCC/Image-2025-03-21-14-41-20-13.jpg' },
    { nom: 'Vallée de la Fin', image: 'https://i.ibb.co/0pn2SJmf/Image-2025-03-21-14-41-20-11.jpg' },
    { nom: 'Dimension de Jigen', image: 'https://i.ibb.co/0yz8yqpM/Image-2025-03-21-14-41-20-12.jpg' },
    { nom: 'Greed Island', image: 'https://i.ibb.co/0y8CzHZR/Image-2025-03-21-14-41-20-8.jpg' },
    { nom: 'Repair Uchiha', image: 'https://i.ibb.co/ksnG6xmC/Image-2025-03-21-14-41-20-9.jpg' },
    { nom: 'Desert Egyptien', image: 'https://i.ibb.co/39Jb3jYp/Image-2025-03-21-14-41-20-10.jpg' },
    { nom: 'Plaine Rocheuse', image: 'https://i.ibb.co/Y7F7H1Ky/Image-2025-03-21-14-41-20-6.jpg' },
    { nom: 'Tokyo Exorcism School', image: 'https://i.ibb.co/fVsbHtx8/Image-2025-03-21-14-41-20-7.jpg' },
    { nom: 'Temple des Dieux', image: 'https://i.ibb.co/VcjTcFHx/Image-2025-03-21-14-41-20-5.jpg' },
    { nom: 'Place Enneigée', image: 'https://i.ibb.co/G3JDksbn/Image-2025-03-21-14-41-20-1.jpg' },
    { nom: 'Ville Z', image: 'https://i.ibb.co/7dzdXJvD/Image-2025-03-21-14-41-20-2.jpg' },
    { nom: 'Clover Arena', image: 'https://i.ibb.co/PGtVPx8M/Image-2025-03-21-14-41-20-3.jpg' },
    { nom: 'Forêt Dense', image: 'https://i.ibb.co/XxzW23W7/Image-2025-03-21-14-41-20-0.jpg' }
];

let duelsABM = {};
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
> *⏱️ Délai :* 5 + 1min max
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
            duelsABM[duelKey] = {
                equipe1,
                equipe2,
                statsCustom: statsCustom || 'Aucune stat personnalisée',
                arene: areneT
            };

            const ficheDuel = generateFicheDuelABM(duelsABM[duelKey]);

            // 1. Envoi de l'arène avec la fiche
            await zk.sendMessage(dest, {
                image: { url: areneT.image },
                caption: ficheDuel
            }, { quoted: ms });

            // 2. Envoi d’un seul pavé vide pour le RP combat
            const modelePave = `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[PAVE ABM]▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*[Perso] :*

> ▪️ [Décris tes actions RP ici]

*💠 TECHNIQUES :* 
*📌 DISTANCE :* 
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓[ CHARGEMENT... ]▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;

            await zk.sendMessage(dest, { text: modelePave }, { quoted: ms });

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
            '- Pour ajuster des stats : @Joueur stat +/- valeur [@Joueur stat +/- valeur ...]\n' +
            '  Ex: duel_abm Sukuna heart - 30 energie + 20\n' +
            '- Pour réinitialiser un joueur : reset @Joueur\n' +
            '- Pour réinitialiser tous les joueurs : reset all\n' +
            '- Pour supprimer tous les duels : delete'
        );

        const action = arg[0].trim().toLowerCase();

        // Suppression de tous les duels
        if (action === 'delete') {
            duelsABM = {}; // Réinitialisation complète
            return repondre('Tous les duels en cours ont été supprimés.');
        }

        // Réinitialisation des statistiques
        if (action === 'reset') {
            if (arg.length < 2) return repondre('Format: reset @Joueur ou reset all');

            const joueurId = arg[1].trim().toLowerCase();

            if (joueurId === 'all') {
                for (const key in duelsABM) {
                    duelsABM[key].equipe1.forEach(j => j.stats = { heart: 100, energie: 100, vie: 100 });
                    duelsABM[key].equipe2.forEach(j => j.stats = { heart: 100, energie: 100, vie: 100 });
                }
                return repondre('Les statistiques de tous les joueurs ont été réinitialisées.');
            }

            const duelKey = Object.keys(duelsABM).find(key => key.includes(joueurId));
            if (!duelKey) return repondre('Joueur non trouvé.');

            const duel = duelsABM[duelKey];
            const joueur = duel.equipe1.find(j => j.nom.toLowerCase() === joueurId) || duel.equipe2.find(j => j.nom.toLowerCase() === joueurId);
            if (!joueur) return repondre('Joueur non trouvé.');

            joueur.stats = { heart: 100, energie: 100, vie: 100 };
            repondre(`Les statistiques de ${joueur.nom} ont été réinitialisées.`);

            const ficheDuel = generateFicheDuelABM(duel);
            return zk.sendMessage(dest, { image: { url: duel.arene.image }, caption: ficheDuel }, { quoted: ms });
        }

        // Gestion de l'ajustement des stats pour plusieurs joueurs
        if (arg.length < 4) return repondre('Format: @Joueur stat +/- valeur [@Joueur stat +/- valeur ...]');

        let i = 0;
        let modifsEffectuées = false;
        while (i < arg.length) {
            const joueurId = arg[i];
            const stat = arg[i + 1];
            const signe = arg[i + 2];
            const valeurStr = arg[i + 3];

            if (!joueurId || !stat || !signe || !valeurStr) break; // Arrêter si format incorrect

            const valeur = parseInt(valeurStr);
            if (isNaN(valeur)) return repondre(`Valeur invalide pour ${joueurId}.`);

            const duelKey = Object.keys(duelsABM).find(key => key.includes(joueurId));
            if (!duelKey) return repondre(`Joueur ${joueurId} non trouvé.`);

            const duel = duelsABM[duelKey];
            const joueur = duel.equipe1.find(j => j.nom === joueurId) || duel.equipe2.find(j => j.nom === joueurId);
            if (!joueur || !['heart', 'energie', 'vie'].includes(stat)) return repondre(`Stat invalide pour ${joueurId}.`);

            const { stats, message } = limiterStatsABM(joueur.stats, stat, (signe === '-' ? -valeur : valeur));
            joueur.stats = stats;
            if (message) repondre(message);

            modifsEffectuées = true;
            i += 4; // Passer au prochain joueur/stat
        }

        if (modifsEffectuées) {
            const duelKey = Object.keys(duelsABM)[0]; // On prend un duel quelconque pour renvoyer une fiche mise à jour
            const duel = duelsABM[duelKey];
            const ficheDuel = generateFicheDuelABM(duel);
            return zk.sendMessage(dest, { image: { url: duel.arene.image }, caption: ficheDuel }, { quoted: ms });
        }
    }
);

// Définition des circuits
const circuitsSpeedRush = [
  { nom: 'Volcans', image: 'https://i.ibb.co/k6cMHkPz/Whats-App-Image-2025-06-17-at-19-20-21-2.jpg' },
  { nom: 'Pic de Givre', image: 'https://i.ibb.co/k6cMHkPz/Whats-App-Image-2025-06-17-at-19-20-21-2.jpg' },
  { nom: 'Metropole Nocturne', image: 'https://i.ibb.co/k6cMHkPz/Whats-App-Image-2025-06-17-at-19-20-21-2.jpg' },
  { nom: 'Bois Sombres', image: 'https://i.ibb.co/k6cMHkPz/Whats-App-Image-2025-06-17-at-19-20-21-2.jpg' },
  { nom: 'Sanctuaire Perdu', image: 'https://i.ibb.co/k6cMHkPz/Whats-App-Image-2025-06-17-at-19-20-21-2.jpg' }
];

// Stockage des courses en cours
let coursesSpeedRush = {};

// Fonction pour tirer un circuit aléatoire
function tirerCircuitSpeedRush() {
  return circuitsSpeedRush[Math.floor(Math.random() * circuitsSpeedRush.length)];
}

// Fonction pour limiter les stats (0-100)
function limiterStatsSpeedRush(stats, stat, valeur) {
  if (stats[stat] === 100 && valeur > 0) {
    return { stats, message: '⚠️ Statistique déjà au maximum!' };
  }
  stats[stat] = Math.max(0, Math.min(stats[stat] + valeur, 100)); // S'assure que la valeur reste entre 0 et 100
  return { stats, message: null };
}

// Fonction pour générer la fiche de course
function generateFicheCourseSpeedRush(course) {
  return `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
   🌐 𝐒𝐔𝐏𝐑𝐄𝐌𝐔𝐒 𝐍𝐀𝐓𝐈𝐎𝐍 🌐
             🏁 𝐒𝐩𝐞𝐞𝐝 𝐑𝐮𝐬𝐡 🏁
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*🏎️ ${course.pilote1.nom} :* 
> 🚘: ${course.pilote1.stats.voiture} | ⛽: ${course.pilote1.stats.essence} | 🛢️: ${course.pilote1.stats.turbo}

*🏎️ ${course.pilote2.nom} :* 
> 🚘: ${course.pilote2.stats.voiture} | ⛽: ${course.pilote2.stats.essence} | 🛢️: ${course.pilote2.stats.turbo}

${course.pilote3 ? `*🏎️ ${course.pilote3.nom} :*\n> 🚘: ${course.pilote3.stats.voiture} | ⛽: ${course.pilote3.stats.essence} | 🛢️: ${course.pilote3.stats.turbo}` : ''}
═══════════════════
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
 *⚠️ RÈGLES DE COURSE ⚠️*

> - Saut de défi : Reboot 🔄
> - Latence : Tour Suivant
> - Gadgets : 3 max
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
*🔄 Tourneur :* ${course.tourneur}
*⚖️ Master :* ${course.master}
*🌦️ Conditions :* ${course.conditions}
*🌐 Circuit :* ${course.circuit.nom}
*📌 Départ :* ${course.depart}
*⏱️ Latence :* 5 + 1min max
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
═══════════════════
 *MAÎTRISE INITIALE "⭐" : 5*

> *❌ Sortie de Piste :* -1⭐
> *❌ Collision obstacle :* -2⭐
> *❌ Saut de défi :* -1⭐
═══════════════════
> *🥇 1ère PLACE: 3*
> *🥈 2ème PLACE: 2*
> *🥉 3ème PLACE: 1*
═══════════════════
> *⚠️ Si vous dépassez vos adversaires dans le dernier tour, c'est un "OVERTAKE" +2⭐. Si vous finissez la course avec boost total, c'est "TURBO MASTER" +2⭐. Et si vous gagnez sans avoir reçu de dégâts au véhicule, c'est "KING OF THE ROAD" +4⭐.*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
> *⏱️ TEMPS LIMITE: Si vous ne terminez pas avant la fin du chrono, la victoire revient au pilote avec le meilleur chrono ou la meilleure position.*
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
}

// Commande pour démarrer une course
zokou(
  { nomCom: 'sr_rule', categorie: 'SPEED-RUSH' },
  async (dest, zk, { repondre, arg, ms }) => {
    if (arg.length < 2) {
      return repondre('*Usage:* -sr_rule pilote1 pilote2 [pilote3] / <tourneur> <master> <conditions> <depart>');
    }

    try {
      const [pilotesStr, detailsCourse] = arg.join(' ').split('/').map(p => p.trim());
      const pilotes = pilotesStr.split(' ').map(p => ({
        nom: p.trim(),
        stats: { voiture: 100, essence: 100, turbo: 100 }
      }));

      if (pilotes.length < 2 || pilotes.length > 3) {
        return repondre('Il faut 2 ou 3 pilotes pour démarrer une course.');
      }

      const [tourneur, master, conditions, depart] = detailsCourse
        ? detailsCourse.split(' ').map(p => p.trim())
        : ['Auto', 'Auto', 'Sec', 'Ligne'];

      const circuit = tirerCircuitSpeedRush();

      const courseKey = `${pilotes[0].nom} vs ${pilotes[1].nom}${pilotes[2] ? ' vs ' + pilotes[2].nom : ''}`;
      coursesSpeedRush[courseKey] = {
        pilote1: pilotes[0],
        pilote2: pilotes[1],
        pilote3: pilotes[2] || null,
        tourneur,
        master,
        conditions,
        depart,
        circuit
      };

      const ficheCourse = generateFicheCourseSpeedRush(coursesSpeedRush[courseKey]);

      // 1. Envoi de la fiche + image
      await zk.sendMessage(dest, {
        image: { url: circuit.image },
        caption: ficheCourse
      }, { quoted: ms });

      // 2. Pavé pour les joueurs
      const paveJoueur = `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  *▓▓▓▓▓[PAVÉ PILOTE]▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*🚗 Pilote :* [Ton nom ici]

> ▪️ [Décris ta manœuvre RP ici (accélération, esquive, turbo...)]
———————————————————
*| ⛽ : 100 | 🛢️ : 100 | 🚘 : 100 |*

*📦 Gadgets utilisés :* ...  
*🎯 Position actuelle :* ...
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓[ CHARGEMENT... ]▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;

      // 3. Pavé pour le superviseur
      const paveSuperviseur = `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
*.......| 🏁 SPEED RUSH 🏁 |......*

> ▪️*[Pilote 1]*

> ▪️*[Pilote 2]*

▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;

      // Envoi pavé joueur
      await zk.sendMessage(dest, { text: paveJoueur }, { quoted: ms });

      // Envoi pavé superviseur
      await zk.sendMessage(dest, { text: paveSuperviseur }, { quoted: ms });

    } catch (error) {
      console.error('Erreur lors du démarrage de la course Speed Rush:', error);
      repondre('Une erreur est survenue lors du démarrage de la course.');
    }
  }
);

// Commande pour suivre une course 
zokou(
  { nomCom: 'sr', categorie: 'SPEED-RUSH' },
  (dest, zk, { repondre, arg, ms }) => {
    if (arg.length < 1) {
      return repondre('*Usage:* -sr stats/delete [options]');
    }

    const action = arg[0].toLowerCase();

    switch (action) {
      case 'stats':
        if (arg.length < 5) {
          return repondre('*Usage:* -sr stats @Pilote stat +/- valeur [@Pilote stat +/- valeur ...]\n' +
            'Ex: -sr stats @Pilote1 voiture - 20 essence + 15 @Pilote2 turbo - 10');
        }

        let i = 1;
        let modificationsEffectuées = false;

        while (i < arg.length) {
          const piloteId = arg[i];
          const stat = arg[i + 1];
          const signe = arg[i + 2];
          const valeurStr = arg[i + 3];

          if (!piloteId || !stat || !signe || !valeurStr) break; // Arrêter si format incorrect

          const valeur = parseInt(valeurStr);
          if (isNaN(valeur)) return repondre(`Valeur invalide pour ${piloteId}.`);

          if (!['voiture', 'essence', 'turbo'].includes(stat)) {
            return repondre(`Stat invalide pour ${piloteId}. Les stats valides sont : voiture, essence, turbo.`);
          }

          const courseKey = Object.keys(coursesSpeedRush).find(key => key.includes(piloteId));
          if (!courseKey) return repondre(`Pilote ${piloteId} non trouvé dans une course en cours.`);

          const course = coursesSpeedRush[courseKey];
          let pilote = [course.pilote1, course.pilote2, course.pilote3].find(p => p?.nom === piloteId);

          if (!pilote) return repondre(`Pilote ${piloteId} non trouvé dans cette course.`);

          const { stats, message } = limiterStatsSpeedRush(pilote.stats, stat, (signe === '-' ? -valeur : valeur));
          pilote.stats = stats;
          if (message) repondre(message);

          modificationsEffectuées = true;
          i += 4; // Passer au prochain bloc de stats
        }

        if (modificationsEffectuées) {
          const courseKey = Object.keys(coursesSpeedRush)[0]; // On prend une course quelconque pour renvoyer une fiche mise à jour
          const course = coursesSpeedRush[courseKey];
          const ficheCourse = generateFicheCourseSpeedRush(course);
          return zk.sendMessage(dest, { image: { url: course.circuit.image }, caption: ficheCourse }, { quoted: ms });
        }
        break;

      case 'delete':
        if (arg.length < 2) {
          return repondre('*Usage:* -sr delete courseKey. Ex: -sr delete @Pilote1 vs @Pilote2');
        }

        const courseKeyToDelete = arg.slice(1).join(' ');

        if (!coursesSpeedRush[courseKeyToDelete]) {
          return repondre('Course non trouvée.');
        }

        delete coursesSpeedRush[courseKeyToDelete];
        return repondre(`La course ${courseKeyToDelete} a été supprimée.`);

      default:
        return repondre('Action invalide. Utilisez "stats" ou "delete".');
    }
  }
);


let duelsYugi = {};
const imageYugiDuel = 'https://i.ibb.co/rKxJ2g7r/image.jpg';

function generateFicheDuelYugi(duel) {
    const formatZones = (zones) => zones.length > 0 ? zones.join(' | ') : '---';

    return `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
    🌐 𝐒𝐔𝐏𝐑𝐄𝐌𝐔𝐒 𝐍𝐀𝐓𝐈𝐎𝐍 🌐
         🎴 𝐒𝐩𝐞𝐞𝐝 𝐃𝐮𝐞𝐥 🎴
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔

👤 *${duel.j1.nom}*
> LP❤️: ${duel.j1.lp} | CM🀄: ${duel.j1.cm}
> Deck Principal: ${duel.j1.deck.main}/30
> Extra Deck: ${duel.j1.deck.extra}/5
> Cimetière: ${duel.j1.deck.cimetiere}
> Magie de Terrain: ${duel.j1.deck.terrain || '---'}
> Zone Monstre: ${formatZones(duel.j1.deck.zone_monstre)}
> Zone Magie/Piège: ${formatZones(duel.j1.deck.zone_magie_piege)}

                     *𝙑𝙎*

👤 *${duel.j2.nom}*
> LP❤️: ${duel.j2.lp} | CM🀄: ${duel.j2.cm}
> Deck Principal: ${duel.j2.deck.main}/30
> Extra Deck: ${duel.j2.deck.extra}/5
> Cimetière: ${duel.j2.deck.cimetiere}
> Magie de Terrain: ${duel.j2.deck.terrain || '---'}
> Zone Monstre: ${formatZones(duel.j2.deck.zone_monstre)}
> Zone Magie/Piège: ${formatZones(duel.j2.deck.zone_magie_piege)}

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
   *\`⚠️ RÈGLES DU DUEL ⚠️\`*

> - Triche : Game Over
> - Latence : -1⭐
> - Zones : 3 Monstres / 3 Magies-Pièges
> 🔄 Tourneur : ${duel.tourneur}
> ⚖️ Arbitre : Auto Modo
> ⌚ Délai : 5 + 2 min max
> 💥 Conditions : LP 0 ou Deck out

▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
> 🏅 *Perfect:* Aucun dégât subis = 5⭐
> 🥉 *Hard:* -2000LP ou -10 cartes
> 💣 *POWER STRIKE:* >2000 dégâts directs = +2⭐
> 🧠 *COMBO MASTER:* Victoire combo = +2⭐

▓▓▓▓[ CHARGEMENT... ]▓▓▓▓`;
}

function parseDeckDetails(text) {
    const players = {};
    text.split(';').forEach(section => {
        const [name, ...stats] = section.trim().split(/\s+/);
        players[name.toLowerCase()] = { main: 30, extra: 0 };
        stats.forEach(st => {
            const [key, val] = st.split(':');
            if (key && val && ['main', 'extra'].includes(key.toLowerCase())) {
                players[name.toLowerCase()][key.toLowerCase()] = parseInt(val);
            }
        });
    });
    return players;
}

zokou(
    { nomCom: 'yugirule', categorie: 'YU-GI-OH' },
    async (dest, zk, { repondre, arg, ms }) => {
        if (!arg || arg.length < 1) return repondre('Ex : -yugi_rule Yugi vs Kaiba / Yugi main:26 extra:3; Kaiba main:28 extra:3');

        try {
            const input = arg.join(' ');
            const [duelPart, deckStatsPart] = input.split('/').map(s => s.trim());
            const [p1, p2] = duelPart.split('vs').map(s => s.trim());

            const deckStats = deckStatsPart ? parseDeckDetails(deckStatsPart) : {};

            const j1 = {
                nom: p1,
                lp: 4000,
                cm: 4,
                deck: {
                    main: deckStats[p1.toLowerCase()]?.main ?? 30,
                    extra: deckStats[p1.toLowerCase()]?.extra ?? 0,
                    cimetiere: 0,
                    terrain: '',
                    zone_monstre: [],
                    zone_magie_piege: []
                }
            };
            const j2 = {
                nom: p2,
                lp: 4000,
                cm: 4,
                deck: {
                    main: deckStats[p2.toLowerCase()]?.main ?? 30,
                    extra: deckStats[p2.toLowerCase()]?.extra ?? 0,
                    cimetiere: 0,
                    terrain: '',
                    zone_monstre: [],
                    zone_magie_piege: []
                }
            };

            const duelKey = `${p1}_vs_${p2}`;
            duelsYugi[duelKey] = { j1, j2, tourneur: Math.random() < 0.5 ? p1 : p2 };

            const fiche = generateFicheDuelYugi(duelsYugi[duelKey]);
            await zk.sendMessage(dest, { image: { url: imageYugiDuel }, caption: fiche }, { quoted: ms });

        } catch (e) {
            console.error('Erreur duel Yugi:', e);
            repondre('Une erreur est survenue.');
        }
    }
);

zokou(
  { nomCom: 'duel_yugi', categorie: 'YU-GI-OH' },
  (dest, zk, { repondre, arg, ms }) => {
    if (arg.length < 1) {
      return repondre(
        'Usage:\n' +
        '- Modifier stats: @Joueur stat +/- valeur [@Joueur stat +/- valeur ...]\n' +
        '  Ex: duel_yugi Yugi lp -500 main +2 zone_monstre +Dragon,Magicien\n' +
        '- Réinitialiser un joueur: reset @Joueur\n' +
        '- Réinitialiser tous: reset all\n' +
        '- Supprimer tous les duels: delete'
      );
    }

    const action = arg[0].toLowerCase();

    if (action === 'delete') {
      duelsYugi = {};
      return repondre('Tous les duels Yu-Gi-Oh ont été supprimés.');
    }

    if (action === 'reset') {
      if (arg.length < 2) return repondre('Format: reset @Joueur ou reset all');

      const cible = arg[1].toLowerCase();

      if (cible === 'all') {
        for (const key in duelsYugi) {
          ['j1', 'j2'].forEach(joueurKey => {
            duelsYugi[key][joueurKey].lp = 4000;
            duelsYugi[key][joueurKey].cm = 4;
            duelsYugi[key][joueurKey].deck = {
              main: 30,
              extra: 0,
              cimetiere: 0,
              terrain: '',
              zone_monstre: [],
              zone_magie_piege: []
            };
          });
        }
        return repondre('Tous les joueurs ont été réinitialisés.');
      }

      // Trouver le duel et joueur
      const duelKey = Object.keys(duelsYugi).find(k =>
        duelsYugi[k].j1.nom.toLowerCase() === cible || duelsYugi[k].j2.nom.toLowerCase() === cible
      );

      if (!duelKey) return repondre(`Joueur ${cible} non trouvé.`);

      const duel = duelsYugi[duelKey];
      const joueur = duel.j1.nom.toLowerCase() === cible ? duel.j1 : duel.j2;

      joueur.lp = 4000;
      joueur.cm = 4;
      joueur.deck = {
        main: 30,
        extra: 0,
        cimetiere: 0,
        terrain: '',
        zone_monstre: [],
        zone_magie_piege: []
      };

      repondre(`Statistiques de ${joueur.nom} réinitialisées.`);

      const fiche = generateFicheDuelYugi(duel);
      return zk.sendMessage(dest, { image: { url: imageYugiDuel }, caption: fiche }, { quoted: ms });
    }

    // Modification stats
    // Format attendu: joueur stat signe valeur ...
    // Exemple: duel_yugi Yugi lp - 500 main + 2 zone_monstre + Dragon,Magicien

    let i = 0;
    let modifOk = false;
    while (i < arg.length) {
      const joueurNom = arg[i];
      const duelKey = Object.keys(duelsYugi).find(k =>
        duelsYugi[k].j1.nom.toLowerCase() === joueurNom.toLowerCase() ||
        duelsYugi[k].j2.nom.toLowerCase() === joueurNom.toLowerCase()
      );

      if (!duelKey) {
        repondre(`Joueur ${joueurNom} non trouvé.`);
        return;
      }

      const duel = duelsYugi[duelKey];
      const joueur = duel.j1.nom.toLowerCase() === joueurNom.toLowerCase() ? duel.j1 : duel.j2;

      // Parcourir stat / signe / valeur tant que possible
      let j = i + 1;
      while (j + 2 <= arg.length) {
        const stat = arg[j].toLowerCase();
        const signe = arg[j + 1];
        let valeur = arg[j + 2];

        if (!['lp', 'cm', 'main', 'extra', 'cimetiere', 'terrain', 'zone_monstre', 'zone_magie_piege'].includes(stat)) break;

        // Pour zone_monstre et zone_magie_piege, valeur est une liste de noms séparés par ","
        if (stat === 'zone_monstre' || stat === 'zone_magie_piege') {
          if (signe !== '+' && signe !== '-') {
            repondre(`Format invalide pour ${stat}. Utilise + ou - suivi d'une liste séparée par virgule.`);
            return;
          }
          const noms = valeur.split(',');
          if (signe === '+') {
            const zone = joueur.deck[stat];
            noms.forEach(n => {
              if (zone.length < 3 && !zone.includes(n.trim())) zone.push(n.trim());
            });
          } else if (signe === '-') {
            joueur.deck[stat] = joueur.deck[stat].filter(n => !noms.includes(n));
          }
          modifOk = true;
          j += 3;
          continue;
        }

        // Pour terrain c'est une chaîne simple, signe + ou - remplace ou vide
        if (stat === 'terrain') {
          if (signe === '+') {
            joueur.deck.terrain = valeur;
          } else if (signe === '-') {
            joueur.deck.terrain = '';
          } else {
            repondre(`Signe invalide pour terrain, utilise + ou -`);
            return;
          }
          modifOk = true;
          j += 3;
          continue;
        }

        // Pour les stats numériques
        valeur = parseInt(valeur);
        if (isNaN(valeur)) {
          repondre(`Valeur invalide pour ${stat} de ${joueurNom}`);
          return;
        }

        // Appliquer modif selon signe
        let nouvelleValeur;
        switch (stat) {
          case 'lp':
            nouvelleValeur = signe === '+' ? joueur.lp + valeur : joueur.lp - valeur;
            joueur.lp = Math.max(0, nouvelleValeur);
            break;
          case 'cm':
            nouvelleValeur = signe === '+' ? joueur.cm + valeur : joueur.cm - valeur;
            joueur.cm = Math.max(0, nouvelleValeur);
            break;
          case 'main':
            nouvelleValeur = signe === '+' ? joueur.deck.main + valeur : joueur.deck.main - valeur;
            joueur.deck.main = Math.min(30, Math.max(0, nouvelleValeur));
            break;
          case 'extra':
            nouvelleValeur = signe === '+' ? joueur.deck.extra + valeur : joueur.deck.extra - valeur;
            joueur.deck.extra = Math.min(5, Math.max(0, nouvelleValeur));
            break;
          case 'cimetiere':
            nouvelleValeur = signe === '+' ? joueur.deck.cimetiere + valeur : joueur.deck.cimetiere - valeur;
            joueur.deck.cimetiere = Math.max(0, nouvelleValeur);
            break;
        }

        modifOk = true;
        j += 3;
      }

      i = j;
    }

    if (!modifOk) return repondre('Aucune modification valide détectée.');

    // Renvoi fiche à jour (pour le premier duel modifié)
    const duelKey = Object.keys(duelsYugi)[0];
    if (!duelKey) return repondre('Aucun duel en cours.');

    const duel = duelsYugi[duelKey];
    const fiche = generateFicheDuelYugi(duel);
    return zk.sendMessage(dest, { image: { url: imageYugiDuel }, caption: fiche }, { quoted: ms });
  }
);
