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
        return { stats, message: '*_⚠️ Statistique déjà au maximum!_*' };
    }
    stats[stat] = Math.min(stats[stat] + valeur, 100);
    return { stats, message: null };
}

// ... (le reste du code reste inchangé jusqu'à la fonction generateFicheDuelABM)

function generateFicheDuelABM(duel) {
    let equipe1Text = '';
    for (const joueur of duel.equipe1) {
        equipe1Text += `*👤 ${joueur.nom} :*\n> ❤️: ${joueur.stats.vie} | 🌀: ${joueur.stats.energie} | 🫀: ${joueur.stats.heart}\n\n`;
    }

    let equipe2Text = '';
    for (const joueur of duel.equipe2) {
        equipe2Text += `*👤 ${joueur.nom} :*\n> ❤️: ${joueur.stats.vie} | 🌀: ${joueur.stats.energie} | 🫀: ${joueur.stats.heart}\n\n`;
    }

    return `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓*
    🌐 𝐒𝐔𝐏𝐑𝐄𝐌𝐔𝐒 𝐍𝐀𝐓𝐈𝐎𝐍 🌐
   👊 𝐀𝐧𝐢𝐦𝐞 𝐁𝐚𝐭𝐭𝐥𝐞 𝐌𝐮𝐥𝐭𝐢𝐯𝐞𝐫𝐬 👊
*▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*👥 ${duel.equipe1.length} JOUEUR${duel.equipe1.length > 1 ? 'S' : ''} :*
${equipe1Text}
                     *𝙑𝙎*

*👥 ${duel.equipe2.length} JOUEUR${duel.equipe2.length > 1 ? 'S' : ''} :*
${equipe2Text}
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
> *⏱️ Délai :* 4 + 1min max
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

// Commande pour démarrer un duel dynamique
zokou(
    { nomCom: 'abm_rule', categorie: 'ABM' },
    async (dest, zk, { repondre, arg, ms }) => {
        if (!arg[0]) {
            return repondre('*🔹Usage:* -abm_rule joueur1,joueur2 vs joueur3 / stats. *Ex:* -abm_rule Gojo,Sukuna vs Madara / Madara F: Gray.');
        }

        try {
            const input = arg.join(' ');
            const [joueursInput, statsCustom] = input.split('/').map(p => p.trim());
            const [equipe1Str, equipe2Str] = joueursInput.split('vs').map(p => p.trim());

            if (!equipe1Str || !equipe2Str) return repondre('*_⚠️ Erreur de format ! Utilisez "vs" pour séparer les équipes._*');

            // Gestion des équipes dynamiques
            const equipe1 = equipe1Str.split(',').map(n => ({ 
                nom: n.trim(), 
                stats: { heart: 100, energie: 100, vie: 100 } 
            }));

            const equipe2 = equipe2Str.split(',').map(n => ({ 
                nom: n.trim(), 
                stats: { heart: 100, energie: 100, vie: 100 } 
            }));

            const areneT = tirerArABM();
            const duelKey = `${equipe1.map(j => j.nom).join(',')} vs ${equipe2.map(j => j.nom).join(',')}`;

            duelsABM[duelKey] = {
                equipe1,
                equipe2,
                statsCustom: statsCustom || 'Non defini',
                arene: areneT
            };

            const ficheDuel = generateFicheDuelABM(duelsABM[duelKey]);

            await zk.sendMessage(dest, {
                image: { url: areneT.image },
                caption: ficheDuel
            }, { quoted: ms });

            // Modèle de pavé pour le RP combat
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
            repondre('Une erreur est survenue: ' + error.message);
        }
    }
);


// Commande duel_abm version premium
zokou(
    { nomCom: 'duel_abm', categorie: 'ABM' },
    async (dest, zk, { repondre, arg, ms }) => {
        const input = arg.join(' ');

        // Aide enrichie
        if (!input) return repondre(
            '🆚 *ABM ULTIMATE HELP* 🆚\n\n' +
            '➤ *MàJ Perso:* `-duel_abm [Joueur] [stat]±[valeur] ...`\n' +
            '   *Ex:* `-duel_abm Gojo vie-20 energie+30`\n\n' +
            '➤ *MàJ Multi:* `-duel_abm [Joueur1] [stat]±[valeur]; [Joueur2] ...`\n' +
            '   *Ex:* `-duel_abm Gojo heart+15; Sukuna vie-10`\n\n' +
            '➤ *Réinitialisé:* `-duel_abm reset [Joueur1] [Joueur2]...`\n' +
            '➤ *Tout Réinitialisé:* `-duel_abm resetall`\n' +
            '➤ *Supprimer:* `-duel_abm delete [duelKey]`\n' +
            '➤ *Liste:* `-duel_abm list`\n\n' +
            '📊 *Stats disponibles:* vie, energie, heart\n' +
            '*Exemple complet:*\n' +
            '-duel_abm Gojo vie-10,energie+20; Sukuna heart+15'
        );

        // Commandes spéciales
        if (input === 'resetall') {
            Object.values(duelsABM).forEach(duel => {
                [...duel.equipe1, ...duel.equipe2].forEach(j => {
                    j.stats = { heart: 100, energie: 100, vie: 100 };
                });
            });
            return repondre('*_♻️ Toutes les stats ont été réinitialisées !_*');
        }

        if (input === 'list') {
            if (Object.keys(duelsABM).length === 0) {
                return repondre('*_ℹ️ Aucun duel actif._*');
            }
            let liste = '🆚 *DUELS EN COURS* 🆚\n';
            Object.keys(duelsABM).forEach(key => {
                liste += `\n▸ ${key}`;
            });
            return repondre(liste);
        }

        if (input.startsWith('delete ')) {
            const duelKey = input.slice(7).trim();
            if (duelsABM[duelKey]) {
                delete duelsABM[duelKey];
                return repondre(`*_🗑️ Duel "${duelKey}" supprimé !_*`);
            }
            return repondre('*_❌ Duel non trouvé. Utilisez `-duel_abm list` pour voir les duels actifs._*');
        }

        if (input.startsWith('reset ')) {
            const noms = input.slice(6).split(' ').filter(n => n);
            let count = 0;

            noms.forEach(nom => {
                for (const duel of Object.values(duelsABM)) {
                    const joueur = [...duel.equipe1, ...duel.equipe2].find(j => j.nom === nom);
                    if (joueur) {
                        joueur.stats = { heart: 100, energie: 100, vie: 100 };
                        count++;
                    }
                }
            });

            return repondre(count > 0 ? `*_🔄 ${count} joueur(s) réinitialisé(s) !_*` : '*_❌ Joueur(s) non trouvé(s)_*');
        }

        // Gestion des stats (version optimisée)
        const processPlayerUpdates = async (inputStr) => {
            const joueursInputs = inputStr.split(';').map(j => j.trim()).filter(j => j);
            let results = [];
            let updatedDuel = null;

            for (const joueurInput of joueursInputs) {
                const [nomJoueur, ...modifs] = joueurInput.split(' ').filter(p => p);
                if (!nomJoueur || modifs.length === 0) continue;

                // Trouver le joueur
                let joueurTrouve = null;
                let duelTrouve = null;

                for (const duel of Object.values(duelsABM)) {
                    const joueur = [...duel.equipe1, ...duel.equipe2].find(j => j.nom === nomJoueur);
                    if (joueur) {
                        joueurTrouve = joueur;
                        duelTrouve = duel;
                        break;
                    }
                }

                if (!joueurTrouve) {
                    results.push(`❌ "${nomJoueur}" non trouvé`);
                    continue;
                }

                // Traiter chaque modification
                for (const mod of modifs) {
                    const match = mod.match(/^(vie|energie|heart)([+-])(\d+)$/);
                    if (!match) {
                        results.push(`❌ Format invalide: "${mod}"`);
                        continue;
                    }

                    const [_, stat, op, valStr] = match;
                    const valeur = parseInt(valStr) * (op === '+' ? 1 : -1);
                    const result = limiterStatsABM(joueurTrouve.stats, stat, valeur);

                    joueurTrouve.stats = result.stats;
                    updatedDuel = duelTrouve;
                    results.push(result.message || `*✅ ${nomJoueur} ${stat} ${op}*= ${valStr}`);
                }
            }

            if (results.length > 0) await repondre(results.join('\n'));
            return updatedDuel;
        };

        const updatedDuel = await processPlayerUpdates(input);

        // Mettre à jour la fiche
        if (updatedDuel) {
            await zk.sendMessage(dest, {
                image: { url: updatedDuel.arene.image },
                caption: generateFicheDuelABM(updatedDuel)
            }, { quoted: ms });
        } else if (!['reset', 'delete', 'list', 'resetall'].some(cmd => input.startsWith(cmd))) {
            repondre('*_ℹ️ Aucun duel actif trouvé. Créez d\'abord un duel avec -abm_rule_*');
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
    return { stats, message: '*_⚠️ Statistique déjà au maximum!_*' };
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
*⏱️ Latence :* 4 + 1min max
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
      return repondre('*🔹Usage:* -sr_rule pilote1 pilote2 [pilote3] / <tourneur> <master> <conditions> <depart>');
    }

    try {
      const [pilotesStr, detailsCourse] = arg.join(' ').split('/').map(p => p.trim());
      const pilotes = pilotesStr.split(' ').map(p => ({
        nom: p.trim(),
        stats: { voiture: 100, essence: 100, turbo: 100 }
      }));

      if (pilotes.length < 2 || pilotes.length > 3) {
        return repondre('*_💬 Il faut 2 ou 3 pilotes pour démarrer une course._*');
      }

      const [tourneur, master, conditions, depart] = detailsCourse
        ? detailsCourse.split(' ').map(p => p.trim())
        : ['Pilote1', 'Auto', 'voir circuit', 'Section 1'];

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
      repondre('*_😅 Une erreur est survenue lors du démarrage de la course._*');
    }
  }
);


// Commande pour suivre une course (version améliorée)
zokou(
  { nomCom: 'sr', categorie: 'SPEED-RUSH' },
  async (dest, zk, { repondre, arg, ms }) => {
    const input = arg.join(' ');

    // Aide
    if (!input) return repondre(
      '🏁 *SPEED-RUSH HELP* 🏁\n\n' +
      '➤ *MàJ Perso:* `-sr [Pilote] [stat]±[valeur] ...`\n' +
      '   *Ex:* `-sr Pilote1 voiture-20 essence+15`\n\n' +
      '➤ *MàJ Multi:* `-sr [Pilote1] [stat]±[valeur]; [Pilote2] ...`\n' +
      '   *Ex:* `-sr Pilote1 turbo+10; Pilote2 essence-5`\n\n' +
      '➤ *Réinitialisé:* `-sr reset [Pilote1] [Pilote2]...`\n' +
      '➤ *Tout Réinitialisé:* `-sr resetall`\n' +
      '➤ *Supprimer:* `-sr delete [courseKey]`\n' +
      '➤ *Liste:* `-sr list`\n\n' +
      '📊 *Stats disponibles:* voiture, essence, turbo'
    );

    // Commandes spéciales
    if (input === 'resetall') {
      Object.values(coursesSpeedRush).forEach(course => {
        [course.pilote1, course.pilote2, course.pilote3].forEach(p => {
          if (p) p.stats = { voiture: 100, essence: 100, turbo: 100 };
        });
      });
      return repondre('*_♻️ Toutes les stats des pilotes réinitialisées !_*');
    }

    if (input === 'list') {
      if (Object.keys(coursesSpeedRush).length === 0) {
        return repondre('*_ℹ️ Aucune course en cours._*');
      }
      let liste = '🏎️ *COURSE ACTIVES* 🏎️\n';
      Object.keys(coursesSpeedRush).forEach(key => {
        liste += `\n▸ ${key}`;
      });
      return repondre(liste);
    }

    if (input.startsWith('delete ')) {
      const courseKey = input.slice(7).trim();
      if (coursesSpeedRush[courseKey]) {
        delete coursesSpeedRush[courseKey];
        return repondre(`*_🗑️ Course "${courseKey}" supprimée !_*`);
      }
      return repondre('*_❌ Course non trouvée. Utilisez `-sr list` pour voir les courses actives._*');
    }

    if (input.startsWith('reset ')) {
      const noms = input.slice(6).split(' ').filter(n => n);
      let count = 0;

      noms.forEach(nom => {
        for (const course of Object.values(coursesSpeedRush)) {
          const pilote = [course.pilote1, course.pilote2, course.pilote3].find(p => p?.nom === nom);
          if (pilote) {
            pilote.stats = { voiture: 100, essence: 100, turbo: 100 };
            count++;
          }
        }
      });

      return repondre(count > 0 ? `*_🔄 ${count} pilote(s) réinitialisé(s) !_*` : '*_❌ Pilote(s) non trouvé(s)_*');
    }

    // Gestion des stats
    if (input.includes(';')) {
      // Mode multi-pilotes
      const pilotesInputs = input.split(';').map(p => p.trim()).filter(p => p);
      let results = [];
      let updatedCourse = null;

      for (const piloteInput of pilotesInputs) {
        const [nomPilote, ...modifs] = piloteInput.split(' ').filter(p => p);
        if (!nomPilote || modifs.length === 0) continue;

        // Trouver le pilote
        let piloteTrouve = null;
        let courseTrouvee = null;

        for (const course of Object.values(coursesSpeedRush)) {
          const pilote = [course.pilote1, course.pilote2, course.pilote3].find(p => p?.nom === nomPilote);
          if (pilote) {
            piloteTrouve = pilote;
            courseTrouvee = course;
            break;
          }
        }

        if (!piloteTrouve) {
          results.push(`❌ "${nomPilote}" non trouvé`);
          continue;
        }

        // Appliquer les modifs
        for (const mod of modifs) {
          const match = mod.match(/^(voiture|essence|turbo)([+-])(\d+)$/);
          if (!match) {
            results.push(`❌ Format invalide: "${mod}"`);
            continue;
          }

          const [_, stat, op, valStr] = match;
          const valeur = parseInt(valStr) * (op === '+' ? 1 : -1);
          const result = limiterStatsSpeedRush(piloteTrouve.stats, stat, valeur);

          piloteTrouve.stats = result.stats;
          updatedCourse = courseTrouvee;
          results.push(result.message || `*✅ ${nomPilote} ${stat} ${op}*= ${valStr}`);
        }
      }

      if (results.length > 0) await repondre(results.join('\n'));
      if (updatedCourse) {
        return zk.sendMessage(dest, {
          image: { url: updatedCourse.circuit.image },
          caption: generateFicheCourseSpeedRush(updatedCourse)
        }, { quoted: ms });
      }
    } else {
      // Mode single-pilote
      const [nomPilote, ...modifs] = input.split(' ').filter(p => p);
      if (!nomPilote || modifs.length === 0) return;

      let piloteTrouve = null;
      let courseTrouvee = null;
      const results = [];

      for (const course of Object.values(coursesSpeedRush)) {
        const pilote = [course.pilote1, course.pilote2, course.pilote3].find(p => p?.nom === nomPilote);
        if (pilote) {
          piloteTrouve = pilote;
          courseTrouvee = course;
          break;
        }
      }

      if (!piloteTrouve) return repondre(`*_❌ Pilote "${nomPilote}" non trouvé_*`);

      for (const mod of modifs) {
        const match = mod.match(/^(voiture|essence|turbo)([+-])(\d+)$/);
        if (!match) {
          results.push(`❌ Format invalide: "${mod}"`);
          continue;
        }

        const [_, stat, op, valStr] = match;
        const valeur = parseInt(valStr) * (op === '+' ? 1 : -1);
        const result = limiterStatsSpeedRush(piloteTrouve.stats, stat, valeur);

        piloteTrouve.stats = result.stats;
        results.push(result.message || `*✅ ${stat} ${op}*= ${valStr}`);
      }

      if (results.length > 0) await repondre(results.join('\n'));
      if (courseTrouvee) {
        return zk.sendMessage(dest, {
          image: { url: courseTrouvee.circuit.image },
          caption: generateFicheCourseSpeedRush(courseTrouvee)
        }, { quoted: ms });
      }
    }
  }
);


let duelsYugi = {};
const imageYugiDuel = 'https://i.ibb.co/rKxJ2g7r/image.jpg';

function generateFicheDuelYugi(duel) {
    const formatZones = (zones) => zones.length > 0 ? zones.join(' | ') : '___';

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
> Magie de Terrain: ${duel.j1.deck.terrain || '___'}
> Zone Monstre: ${formatZones(duel.j1.deck.zone_monstre)}
> Zone Magie/Piège: ${formatZones(duel.j1.deck.zone_magie_piege)}

                     *𝙑𝙎*

👤 *${duel.j2.nom}*
> LP❤️: ${duel.j2.lp} | CM🀄: ${duel.j2.cm}
> Deck Principal: ${duel.j2.deck.main}/30
> Extra Deck: ${duel.j2.deck.extra}/5
> Cimetière: ${duel.j2.deck.cimetiere}
> Magie de Terrain: ${duel.j2.deck.terrain || '___'}
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
> 💥 Conditions : LP 0 ou Deck out.
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
> 🏅 *Perfect:* Aucun dégât subis = 5⭐
> 🥉 *Hard:* -2000LP ou -10 cartes
> 💣 *POWER STRIKE:* >2000 dégâts directs = +2⭐
> 🧠 *COMBO MASTER:* Victoire combo = +2⭐

▓▓▓▓[ CHARGEMENT... ]▓▓▓▓\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
}

zokou(
    { nomCom: 'yugirule', categorie: 'YU-GI-OH' },
    async (dest, zk, { repondre, arg, ms }) => {
        if (!arg || arg.length < 1) return repondre('🔹*Usage :* -yugirule Yugi vs Kaiba / Yugi main:26 extra:3; Kaiba main:28 extra:3');

        try {
            const input = arg.join(' ');
            const [duelPart, deckStatsPart] = input.split('/').map(s => s.trim());
            const [p1, p2] = duelPart.split('vs').map(s => s.trim());

            // Création des joueurs avec valeurs par défaut
            const j1 = {
                nom: p1,
                lp: 4000,
                cm: 4,
                deck: {
                    main: 30,
                    extra: 0,
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
                    main: 30,
                    extra: 0,
                    cimetiere: 0,
                    terrain: '',
                    zone_monstre: [],
                    zone_magie_piege: []
                }
            };

            // Mise à jour avec les stats personnalisées
            if (deckStatsPart) {
                deckStatsPart.split(';').forEach(section => {
                    const [name, ...stats] = section.trim().split(/\s+/);
                    const playerName = name.toLowerCase();

                    stats.forEach(st => {
                        const [key, val] = st.split(':');
                        if (key && val) {
                            const statKey = key.toLowerCase();
                            const value = parseInt(val);

                            if (playerName === p1.toLowerCase()) {
                                if (statKey === 'main') j1.deck.main = value;
                                else if (statKey === 'extra') j1.deck.extra = value;
                            } else if (playerName === p2.toLowerCase()) {
                                if (statKey === 'main') j2.deck.main = value;
                                else if (statKey === 'extra') j2.deck.extra = value;
                            }
                        }
                    });
                });
            }

            const duelKey = `${p1}_vs_${p2}`;
            duelsYugi[duelKey] = { j1, j2, tourneur: Math.random() < 0.5 ? p1 : p2 };

            const fiche = generateFicheDuelYugi(duelsYugi[duelKey]);
            await zk.sendMessage(dest, { image: { url: imageYugiDuel }, caption: fiche }, { quoted: ms });

        } catch (e) {
            console.error('Erreur duel Yugi:', e);
            repondre('*_😥 Une erreur est survenue:* ' + e.message);
        }
    }
);

zokou(
  { nomCom: 'duel_yugi', categorie: 'YU-GI-OH' },
  async (dest, zk, { repondre, arg, ms }) => {
    const input = arg.join(' ').trim();

    if (!input) {
      return repondre(
        '🎴 *YU-GI-OH DUEL MANAGER* 🎴\n\n' +
        '➤ *MàJ Perso:* `-duel_yugi [joueur] [modif1] [modif2] ...`\n' +
        '  *Ex:* `-duel_yugi Yugi lp-500 main+2 zone_monstre+Dragon Blanc`\n\n' +
        '➤ *MàJ Multi:* `-duel_yugi [joueur1] [modifs]; [joueur2] [modifs]`\n' +
        '  *Ex:* `-duel_yugi Yugi lp-500; Kaiba zone_monstre+Dragon Blanc`\n\n' +
        '➤ *Réinitialiser:* `-duel_yugi reset [joueur]`\n' +
        '➤ *Tout réinitialiser:* `-duel_yugi resetall`\n' +
        '➤ *Supprimer:* `-duel_yugi delete [clé_duel]`\n' +
        '➤ *Liste:* `-duel_yugi list`\n\n' +
        '📌 *Modifs disponibles:* lp, cm, main, extra, cimetiere, terrain, zone_monstre, zone_magie_piege'
      );
    }

    // Commandes spéciales
    if (input === 'resetall') {
      for (const key in duelsYugi) {
        ['j1', 'j2'].forEach(j => {
          duelsYugi[key][j].lp = 4000;
          duelsYugi[key][j].cm = 4;
          duelsYugi[key][j].deck = {
            main: 30,
            extra: 0,
            cimetiere: 0,
            terrain: '',
            zone_monstre: [],
            zone_magie_piege: []
          };
        });
      }
      return repondre('*_♻️ Toutes les parties ont été réinitialisées !_*');
    }

    if (input === 'list') {
      const duels = Object.keys(duelsYugi);
      if (duels.length === 0) return repondre('Aucun duel en cours');
      return repondre('*🎴 DUEL ACTIFS 🎴*\n' + duels.join('\n'));
    }

    if (input.startsWith('delete ')) {
      const duelKey = input.slice(7).trim();
      if (duelsYugi[duelKey]) {
        delete duelsYugi[duelKey];
        return repondre(`*_🗑️ Duel "${duelKey}" supprimé !_*`);
      } else {
        return repondre('*_❌ Duel non trouvé_*');
      }
    }

    if (input.startsWith('reset ')) {
      const joueurNom = input.slice(6).trim();
      let duelModifie = null;

      for (const key in duelsYugi) {
        const duel = duelsYugi[key];
        if (duel.j1.nom.toLowerCase() === joueurNom.toLowerCase()) {
          duel.j1.lp = 4000;
          duel.j1.cm = 4;
          duel.j1.deck = {
            main: 30,
            extra: 0,
            cimetiere: 0,
            terrain: '',
            zone_monstre: [],
            zone_magie_piege: []
          };
          duelModifie = duel;
          break;
        } else if (duel.j2.nom.toLowerCase() === joueurNom.toLowerCase()) {
          duel.j2.lp = 4000;
          duel.j2.cm = 4;
          duel.j2.deck = {
            main: 30,
            extra: 0,
            cimetiere: 0,
            terrain: '',
            zone_monstre: [],
            zone_magie_piege: []
          };
          duelModifie = duel;
          break;
        }
      }

      if (duelModifie) {
        repondre(`*_♻️ ${joueurNom} réinitialisé !_*`);
        const fiche = generateFicheDuelYugi(duelModifie);
        return zk.sendMessage(dest, { image: { url: imageYugiDuel }, caption: fiche }, { quoted: ms });
      } else {
        return repondre(`*_❌ ${joueurNom} non trouvé dans un duel actif_*`);
      }
    }

    // Gestion des modifications
    let duelModifie = null;
    const results = [];

    // Support multi-joueurs avec séparateur ;
    const sections = input.split(';').map(s => s.trim());

    for (const section of sections) {
      const parts = section.split(/\s+/);
      if (parts.length < 2) continue;

      const joueurNom = parts[0];
      const modifs = parts.slice(1);

      // Trouver le joueur dans un duel
      let joueur = null;
      let duelKeyFound = null;

      for (const key in duelsYugi) {
        const duel = duelsYugi[key];
        if (duel.j1.nom.toLowerCase() === joueurNom.toLowerCase()) {
          joueur = duel.j1;
          duelKeyFound = key;
          break;
        } else if (duel.j2.nom.toLowerCase() === joueurNom.toLowerCase()) {
          joueur = duel.j2;
          duelKeyFound = key;
          break;
        }
      }

      if (!joueur) {
        results.push(`❌ ${joueurNom} non trouvé`);
        continue;
      }

      duelModifie = duelsYugi[duelKeyFound];

      // Traiter chaque modification
      for (const mod of modifs) {
        const match = mod.match(/^(\w+)([+-])(.+)$/);
        if (!match) {
          results.push(`❌ Format invalide: ${mod}`);
          continue;
        }

        const [_, stat, op, value] = match;
        const statKey = stat.toLowerCase();

        // Gestion des zones spéciales
        if (statKey === 'zone_monstre' || statKey === 'zone_magie_piege') {
          const cartes = value.split(',').map(c => c.trim());

          if (op === '+') {
            // Ajouter les cartes si la zone n'est pas pleine
            cartes.forEach(carte => {
              if (joueur.deck[statKey].length < 3 && !joueur.deck[statKey].includes(carte)) {
                joueur.deck[statKey].push(carte);
                results.push(`✅ ${joueurNom}: ${stat} + ${carte}`);
              }
            });
          } else if (op === '-') {
            // Retirer les cartes
            joueur.deck[statKey] = joueur.deck[statKey].filter(c => !cartes.includes(c));
            results.push(`✅ ${joueurNom}: ${stat} - ${cartes.join(', ')}`);
          }
          continue;
        }

        // Gestion du terrain
        if (statKey === 'terrain') {
          if (op === '+') {
            joueur.deck.terrain = value;
            results.push(`✅ ${joueurNom}: Terrain défini = ${value}`);
          } else if (op === '-') {
            joueur.deck.terrain = '';
            results.push(`✅ ${joueurNom}: Terrain supprimé`);
          }
          continue;
        }

        // Gestion des valeurs numériques
        const numValue = parseInt(value);
        if (isNaN(numValue)) {
          results.push(`❌ Valeur numérique invalide: ${value}`);
          continue;
        }

        switch(statKey) {
          case 'lp':
            joueur.lp = op === '+' ? joueur.lp + numValue : joueur.lp - numValue;
            joueur.lp = Math.max(0, joueur.lp);
            results.push(`✅ ${joueurNom}: LP ${op}= ${numValue} (${joueur.lp})`);
            break;

          case 'cm':
            joueur.cm = op === '+' ? joueur.cm + numValue : joueur.cm - numValue;
            joueur.cm = Math.max(0, joueur.cm);
            results.push(`✅ ${joueurNom}: CM ${op}= ${numValue} (${joueur.cm})`);
            break;

          case 'main':
            joueur.deck.main = op === '+' ? joueur.deck.main + numValue : joueur.deck.main - numValue;
            joueur.deck.main = Math.min(30, Math.max(0, joueur.deck.main));
            results.push(`✅ ${joueurNom}: Main ${op}= ${numValue} (${joueur.deck.main})`);
            break;

          case 'extra':
            joueur.deck.extra = op === '+' ? joueur.deck.extra + numValue : joueur.deck.extra - numValue;
            joueur.deck.extra = Math.min(5, Math.max(0, joueur.deck.extra));
            results.push(`✅ ${joueurNom}: Extra ${op}= ${numValue} (${joueur.deck.extra})`);
            break;

          case 'cimetiere':
            joueur.deck.cimetiere = op === '+' ? joueur.deck.cimetiere + numValue : joueur.deck.cimetiere - numValue;
            joueur.deck.cimetiere = Math.max(0, joueur.deck.cimetiere);
            results.push(`✅ ${joueurNom}: Cimetière ${op}= ${numValue} (${joueur.deck.cimetiere})`);
            break;

          default:
            results.push(`❌ Stat inconnue: ${stat}`);
        }
      }
    }

    // Envoyer les résultats
    if (results.length > 0) {
      await repondre(results.join('\n'));
    }

    // Mettre à jour la fiche
    if (duelModifie) {
      const fiche = generateFicheDuelYugi(duelModifie);
      await zk.sendMessage(dest, { image: { url: imageYugiDuel }, caption: fiche }, { quoted: ms });
    }
  }
);