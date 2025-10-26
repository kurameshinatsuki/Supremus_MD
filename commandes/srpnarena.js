const { zokou } = require('../framework/zokou');

zokou(
    { 
        nomCom: 'circuit', 
        categorie: 'SPEED-RUSH' 
    }, 
    async (dest, zk, commandeOptions) => { 
        const { repondre, arg, ms } = commandeOptions;

        const circuits = {
  volcan: `//    *🌋 CIRCUIT DES VOLCANS 🌋*   //

> *Longueur :* 20 km (échelle réduite)
> *Difficulté :* Élevée
> *Environnement :* Volcanique, instable, extrême
> *Type de circuit :* Technique & risqué, alternant vitesse, pièges et contrôle

*🗺️ STRUCTURE DU CIRCUIT :*

*1. Départ – Ligne de lancement*

> *Distance :* 1 km
> *Voie :* Grande voie (6 lignes)
> *Vitesse recommandée :* 250 km/h
> *Effets spéciaux :* Boost de départ possible
> *Conseils MJ :* Permettre un départ rapide.
> Ajouter un événement aléatoire (ex : un rival dérape légèrement).

*2. Premier Virage – Virage en descente*

> *Distance :* 1,5 km (avec descente)
> *Voie :* Moyenne voie (4 lignes)
> *Difficulté :* Risque élevé de dérapage
> *Effet descente :* +100 km/h automatique

*Effets :* 
> - Vitesse excessive = perte de contrôle, -20🚘 à -40🚘, perte de position.
> - Test de contrôle selon maniabilité.

*3. Section Ensablée – Cendres volcaniques*

> *Distance :* 2 km
> *Voie :* Petite voie (2 lignes)

*Effets :*
> - Vitesse divisée par 2
> - Temps de réaction (V.R) x2
> - Fort risque de collision
> *MJ :* Imposer une gestion stricte du contrôle de véhicule.

*4. Série de Virages Serrés – Slalom rocheux*

> *Distance :* 1,5 km
> *Voie :* Moyenne voie (4 lignes)
> *Configuration :* 3 virages à 45° (Droite > Gauche > Droite)
> *Vitesse max recommandée :* 150 km/h
> *MJ :* Dépasser 150 km/h = dérapage + perte de temps, risque de collision.

*5. Montée Volcanique – Gravité contre vous*

> *Distance :* 1,5 km
> *Voie :* Étendue

*Effets :*
> - Vitesse min requise : 220 km/h
> - < 220 km/h = ralentissement (-50 km/h), voire crash
> - Gap/Saut possible avec vitesse insuffisante = crash
> *MJ :* Gestion critique du turbo ou boost ici.

*6. Section Piège – Danger naturel*

> *Distance :* 1 km
> *Voie :* Petite voie (2 lignes)

*Effets :*
> - Chutes de pierres (-20🚘 à -40🚘)
> - Trous volcaniques (-30🚘 à -60🚘)
> - Dégâts proportionnels à la vitesse
> *MJ :* Génération aléatoire d'obstacles, maniabilité réduite.

*7. Descente Finale – Tout pour la vitesse*

> *Distance :* 2 km
> *Voie :* Grande voie (6 lignes)

*Effets :*
> *Boost automatique :* +100 km/h
> *Vitesse max autorisée :* 300 km/h
> Risque de sortie de piste en cas de dérapage
> *MJ :* Attention à ceux qui ne contrôlent pas leur bolide à haute vitesse.

*8. Ligne d'Arrivée – Sprint final*

> *Distance :* 1 km
> *Voie :* Grande voie

*Effets :*
> - Dernière ligne droite pour les dépassements
> *MJ :* Mettre l'accent sur la tension dramatique jusqu'à la dernière seconde.`,

  givre: `//  *❄️ CIRCUIT DU PIC DE GIVRE ❄️*  //

> *Longueur :* 18 km (échelle réduite)
> *Difficulté :* Moyenne à Élevée
> *Environnement :* Toundra glaciale, montagnes gelées, tempêtes de neige
> *Type de circuit :* Technique & glissant, exigeant maniabilité, anticipation et adaptation aux intempéries

*🗺️ STRUCTURE DU CIRCUIT :*

*1. Départ – Plaine Gelée*

> *Distance :* 1,5 km
> *Voie :* Grande voie (6 lignes)
> *Vitesse recommandée :* 200 à 250 km/h
> *Effets spéciaux :* Risque de glissade au démarrage
> *Conseils MJ :* Test de départ (maniabilité ou contrôle). En cas d'échec : micro-glissade = perte de temps légère. Ajoutez un rival qui patine légèrement pour une touche de réalisme.

*2. Virage Miroir – Tournant gelé*

> *Distance :* 1 km
> *Voie :* Moyenne voie (4 lignes)
> *Difficulté :* Haute, virage à 120° sur glace vive
> *Effet spécial :* Glace ultra-glissante
> *MJ :* Toute vitesse >180 km/h = test de dérapage obligatoire. Échec = -30🚘 à -50🚘, + perte de position.
> Insistez sur la difficulté à tourner sur glace vive.

*3. Tunnel de Givre – Étroit et glissant*

> *Distance :* 2 km
> *Voie :* Petite voie (2 lignes)

*Effets :*
> - Réduction de visibilité
> - Réflexes diminués (V.R +1)
> - Murs glissants
> *MJ :* Ajoutez un test de collision à mi-parcours. Toute tentative de dépassement est risquée dans cette zone.

*4. Passerelle des Pics – Danger en hauteur*

> *Distance :* 1 km
> *Voie :* Ultra-étroite (1 ligne)
> *Vitesse max recommandée :* 150 km/h
> *Effets spéciaux :* Risque de chute (ravin à gauche, falaise à droite), vents latéraux
> *MJ :* Tout joueur >150 km/h risque une sortie de piste brutale (chute = -80🚘 ou crash). Intensifiez le suspense par le vertige ou les vents.

*5. Zone de Neige Fraîche – Blizzard blanc*

> *Distance :* 2 km
> *Voie :* Moyenne voie (4 lignes)

*Effets :*
> - Vitesse divisée par 2
> - V.R x2 (blizzard + visibilité réduite)
> *MJ :* Rendez les manœuvres plus difficiles. Éventuels mini-obstacles à éviter (rochers, crevasses).

*6. Virages en S – Patinoire technique*

> *Distance :* 2,5 km
> *Voie :* Moyenne voie (4 lignes)
> *Configuration :* Gauche > Droite > Gauche
> *Vitesse max recommandée :* 160 km/h
> *MJ :* Tout joueur >160 km/h subit un test de glissade. Échec = double dérapage + risque de collision contre mur ou adversaire.

*7. Lac Gelé – Ligne droite ultra-rapide*

> *Distance :* 4 km
> *Voie :* Grande voie (6 lignes)

*Effets :*
> *Vitesse max autorisée :* 270 km/h
> - Très faible adhérence
> - Possibilité de fissures dans la glace
> *MJ :* Les joueurs rapides gagnent +50 km/h s'ils gardent le contrôle. Mais >270 km/h = risque de perte totale de contrôle ou crash.

*8. Ligne d'Arrivée – Brèche du Sommet*

> *Distance :* 1 km
> *Voie :* Moyenne voie (4 lignes)
> *Effets :* Montée progressive, neige compacte
> *MJ :* Dernière ligne dramatique. Ajoutez des effets visuels (traces dans la neige, moteurs rugissants) pour une arrivée cinématique.`,

  metropole: `//   *🌃 CIRCUIT DE MÉTROPOLE 🌃*  //

> *Longueur :* 19 km (échelle réduite)
> *Difficulté :* Moyenne
> *Environnement :* Ville futuriste, néons, autoroutes suspendues
> *Type de circuit :* Rapide & fluide, favorisant les lignes droites, les réflexes et la gestion des gadgets

*🗺️ STRUCTURE DU CIRCUIT :*

*1. Départ – Boulevard de Lumière*

> *Distance :* 2 km
> *Voie :* Grande voie (6 lignes)
> *Vitesse recommandée :* 220-260 km/h
> *Effets spéciaux :* Boost lumineux, drones spectateurs
> *Conseils MJ :* Un départ spectaculaire avec pluie de néons. Ajouter des drones suivant les joueurs, donnant un aspect "spectacle". Petit bonus de vitesse pour les plus réactifs.

*2. Carrefour Holographique – Intersection trompeuse*

> *Distance :* 1 km
> *Voie :* Moyenne voie (4 lignes)
> *Difficulté :* Moyenne, virage à 90° avec illusions

*Effets :*
> - Illusions holographiques qui masquent les virages
> - Risque de confusion/délai de réaction (V.R +1)
> *MJ :* Test de perception ou de réaction. Échec = erreur de trajectoire, possible choc (-20🚘 à -30🚘).

*3. Autoroute Suspendue – Vitesse maximale*

> *Distance :* 3 km
> *Voie :* Grande voie (6 lignes)

*Effets :* 
> *Vitesse max autorisée :* 300 km/h
> - Vent latéral léger
> *MJ :* Parfait pour les dépassements. Bonus de +50 km/h si le joueur reste stable deux tours consécutifs. Mais attention aux collisions à haute vitesse.

*4. Tunnel Digital – Zone d'interférences*

> *Distance :* 1,5 km
> *Voie :* Moyenne voie (4 lignes)

*Effets :*
> - Perturbations visuelles (clignotements de néons)
> - Réduction temporaire de précision
> *MJ :* Tout joueur activant un gadget ici peut subir une interférence (échec ou effet altéré). Ajouter une voix automatique du tunnel pour l'ambiance.

*5. Virages Laser – Séquence rythmée*

> *Distance :* 2 km
> *Voie :* Moyenne voie (4 lignes)
> *Configuration :* 4 virages enchaînés à 60° (Zigzag entre tours)
> *Vitesse max recommandée :* 180 km/h
> *MJ :* Au-delà de 180 km/h, les virages deviennent dangereux. Test de contrôle = échec = rebond contre rambardes lumineuses (-30🚘), ralentissement.

*6. Place Centrale – Zone de gadgets*

> *Distance :* 1 km
> *Voie :* Large (zone ouverte)

*Effets :*
> - Apparition aléatoire de 2 à 4 gadgets
> - Risque de carambolage
> *MJ :* Déclencher une phase où tous les joueurs peuvent tenter de récupérer un gadget (ordre selon vitesse ou V.R). Collisions possibles en cas de précipitation.

*7. Pont Néon – Dernier rush*

> *Distance :* 3 km
> *Voie :* Grande voie (6 lignes)

*Effets :*
> *Vitesse max :* 280 km/h
> - Lumières défilantes qui désorientent les joueurs
> *MJ :* Peut causer confusion de perspective. Proposez un test de concentration ou perception.
Un joueur désorienté = trajectoire instable (-Vitesse ou risque de dérapage).

*8. Ligne d'Arrivée – Écran géant*

> *Distance :* 1,5 km
> *Voie :* Moyenne voie (4 lignes)

*Effets :*
> - Chrono visible sur écran géant
> - Applaudissements sonores en fonction du classement
> *MJ :* Accentuer la tension avec des effets sonores et holographiques. Les joueurs peuvent tenter un dépassement final avec turbo, mais attention à la surchauffe.`,

  bois: `//  *🌲 CIRCUIT BOIS SOMBRES 🌲*  //

> *Longueur :* 18 km (échelle réduite)
> *Difficulté :* Moyenne à élevée
> *Environnement :* Forêt maudite, brume épaisse, créatures nocturnes
> *Type de circuit :* Technique & piégeux, mettant à l'épreuve les réflexes, la maniabilité et le courage

*🗺️ STRUCTURE DU CIRCUIT :*

*1. Départ – Sentier Brumeux*

> *Distance :* 1 km
> *Voie :* Moyenne voie (4 lignes)
> *Vitesse recommandée :* 200-230 km/h
> *Effets spéciaux :* Brouillard épais
> *Conseils MJ :* Les joueurs doivent faire un test de perception ou VR pour éviter un départ perturbé. Échec = démarrage retardé.

*2. Racines Traîtresses – Zone accidentée*

> *Distance :* 1 km
> *Voie :* Petite voie (2 lignes)
> *Difficulté :* Élevée

*Effets :* 
> -Obstacle racines (dégâts -20🚘 si mal négocié)
> - Perte de maniabilité (-VR) temporaire
> *MJ :* Demander un test de contrôle : échec = secousses, ralentissement ou perte d'équilibre.

*3. Pont de Bois Pourri – Passage risqué*

> *Distance :* 1,5 km
> *Voie :* Étroite (1 ligne)

*Effets :*
> *Vitesse max forcée :* 120 km/h
> - Risque d'effondrement si passage à plus de 150 km/h
> *MJ :* Une mauvaise vitesse ou un choc = effondrement partiel, détour forcé (+1 tour de retard possible).

*4. Lac Maudit – Route sur berge glissante*

> *Distance :* 2 km
> *Voie :* Moyenne voie (4 lignes)

*Effets :*
> - Glissement naturel
> - Reflets trompeurs (désorientation visuelle)
> *MJ :* Test de concentration ou VR. Échec = manœuvre erronée, perte de trajectoire (-vitesse ou -VR temporaire).

*5. Tunnel Racinaire – Labyrinthe végétal*

> *Distance :* 2 km
> *Voie :* Petite voie (2 lignes)
> *Configuration :* Série de virages serrés (Droite > Gauche > Droite > Gauche)

*Effets :*
> - Visibilité réduite
> - Accélérations interdites
> *MJ :* Ajouter bruitages de créatures inquiétantes pour l'ambiance. Risques accrus de collision en cas d'excès de vitesse.

*6. Zone des Feux Follets – Gadgets & mirages*

> *Distance :* 1 km
> *Voie :* Zone semi-ouverte

*Effets :*
> - Apparition aléatoire de gadgets
> - Feux follets attirent les véhicules (test VR)
> *MJ :* Un joueur échouant à son test de VR peut être attiré hors piste brièvement (-temps).

*7. Descente du Ravin Noir*

> *Distance :* 3 km
> *Voie :* Grande voie (6 lignes)

*Effets :*
> - Boost naturel : +100 km/h
> - Dénivelé brutal = risque de décollage non contrôlé
> *MJ :* Un saut est possible à la fin. Mauvais angle ou vitesse = réception instable (-contrôle ou dégâts).

*8. Ligne d'Arrivée – Clairière Sombre*

> *Distance :* 1,5 km
> *Voie :* Moyenne voie (4 lignes)

*Effets :*
> - Zone plus claire, fin de la brume
> - Possibilité de dernier gadget surprise
> *MJ :* Idéal pour un sprint final avec un piège ou un bonus dramatique. Amplifier la tension avec bruit de tambours ou créatures en chasse.`,

  sanctuaire: `//*⛩️ CIRCUIT SANCTUAIRE PERDU ⛩️*//

> *Longueur :* 19 km (échelle réduite)
> *Difficulté :* Moyenne
> *Environnement :* Temple antique, ruines mystiques, énigmes et pièges
> *Type de circuit :* Stratégique & imprévisible, mêlant vitesse modérée, choix tactiques et pièges anciens

*🗺️ STRUCTURE DU CIRCUIT :*

*1. Départ – Portes du Temple*

> *Distance :* 1 km
> *Voie :* Grande voie (6 lignes)
> *Vitesse recommandée :* 220 km/h
> *Effets spéciaux :* Aura mystérieuse = malus VR de -10% au départ
> *Conseils MJ :* Un tremblement léger pourrait déséquilibrer un joueur (aléatoire), ou un jet de perception révèle un raccourci potentiel plus tard.

*2. Couloir des Statues – Regard pesant*

> *Distance :* 1,5 km
> *Voie :* Moyenne voie (4 lignes)

*Effets :*
> - Statues géantes : obstacles fixes
> - Éviter les fissures du sol
> *MJ :* Test de contrôle requis à mi-section. Échec = heurt d'une statue (-30🚘) ou crevasse (-temps, perte de turbo).

*3. Salle de Pièges – Parcours de précision*

> *Distance :* 1 km
> *Voie :* Petite voie (2 lignes)
> *Difficulté :* Élevée

*Effets :*
> - Sols trappes, pointes mécaniques
> *Vitesse max recommandée :* 130 km/h
> *MJ :* Mouvement trop rapide = activation des pièges. Jet de chance ou VR pour y échapper. Sanction : -30🚘 à -60🚘.

*4. Pont Suspendu – Lames célestes*

> *Distance :* 2 km
> *Voie :* Étroit (1 ligne)

*Effets :*
> - Oscillations (instabilité)
> - Lames tournantes à intervalle (bonus ou malus de timing)
> *MJ :* Demander timing parfait pour traverser : +1 tour ou +2 cases gagnées si réussie, sinon ralentissement ou dégâts légers.

*5. Carreaux Mosaïques – Puzzle roulant*

> *Distance :* 2 km
> *Voie :* Moyenne voie (4 lignes)

*Effets :*
> - Sections glissantes si la mauvaise dalle est empruntée
> - Quelques mosaïques donnent un bonus de vitesse
> *MJ :* Faites choisir une couleur/direction aux joueurs : certains gagnent un petit boost, d'autres dérapent. (Choix tactique + chance)

*6. Passage Souterrain – Vibration antique*

> *Distance :* 1,5 km
> *Voie :* Petite voie (2 lignes)

*Effets :*
> - Secousses sismiques
> - Visibilité très faible
> *MJ :* Malus au VR, test de contrôle augmenté. Ajoutez des échos ou hallucinations auditives pour immersion.

*7. Rampe Sacrée – Ascension finale*

> *Distance :* 3 km
> *Voie :* Grande voie (6 lignes)

*Effets :*
> - Montée douce avec boost +80 km/h
> - Gadget mystique possible en hauteur
> *MJ :* Un saut mystique peut propulser le joueur vers un bonus, ou au contraire le faire atterrir mal (test turbo ou VR).

*8. Ligne d'Arrivée – Autel Céleste*

> *Distance :* 1 km
> *Voie :* Grande voie

*Effets :*
> - Zone calme mais électrisante
> - Dernier piège magique ou boost divin aléatoire
> *MJ :* Roulement de dés pour un dernier événement divin (bonus, malus ou changement soudain dans le classement).`
};

        const lien = 'https://i.ibb.co/k6cMHkPz/Whats-App-Image-2025-06-17-at-19-20-21-2.jpg';
        const key = (arg[0] || '').toLowerCase();

        if (!circuits[key]) {
            return repondre(`*Usage :* -circuit volcan | givre | metropole | bois | sanctuaire.`);
        }

        // Message initial avec chargement
        const messageInitial = await zk.sendMessage(dest, { 
            image: { url: lien },
            caption: "*⏳ Chargement du circuit...*\n0% [░░░░░░░░░░░░░░░░]"
        }, { quoted: ms });

        // Simulation du chargement (5 secondes)
        const etapes = 5;
        for (let i = 1; i <= etapes; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1s par étape
            
            const pourcentage = i * 20;
            const barre = '███'.repeat(i) + '░░░'.repeat(etapes - i);
            
            try {
                await zk.sendMessage(dest, { 
                    image: { url: lien },
                    caption: `*⏳ Chargement du circuit...*\n   ${pourcentage}% [${barre}]`,
                    edit: messageInitial.key 
                });
            } catch (e) {
                console.error("Erreur modification message:", e);
            }
        }

        // Envoi du message final avec le circuit sélectionné
        await zk.sendMessage(dest, { 
            image: { url: lien },
            caption: circuits[key],
            edit: messageInitial.key 
        });
    }
);

// Jeu de pile ou face simple
zokou(
    {
        nomCom: 'coinflip',
        categorie: 'YU-GI-OH'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, auteurMessage, ms } = commandeOptions;

        // Fonction pour simuler un pile ou face
        const flipCoin = () => (Math.random() < 0.5) ? 'Pile' : 'Face';
        
        const coin = flipCoin();
        
        // Message affichant le résultat du pile ou face
        const resultMessage = `🪙 Vous avez lancé une pièce et obtenu : ${coin}.`;
        
        zk.sendMessage(dest, { text: resultMessage }, { quoted: ms });
    }
);

// Jeu de dés simple
zokou(
    {
        nomCom: 'dice',
        categorie: 'YU-GI-OH'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, auteurMessage, ms } = commandeOptions;
        
        // Fonction pour lancer un dé à 6 faces
        const rollDice = () => Math.floor(Math.random() * 6) + 1;
        
        const dice = rollDice();
        
        // Message affichant le résultat du dé
        const resultMessage = `🎲 Vous avez lancé un dé et obtenu un ${dice}.`;
        
        zk.sendMessage(dest, { text: resultMessage }, { quoted: ms });
    }
);


zokou(
    {
        nomCom: 'pave_story',
        categorie: 'ORIGAMY'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            // const lien = '';
            const msg = `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓[ORIGAMY  STORY]▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*[PLAYER NAME] :*

> *Section 1:* 

> *Section 2:* 
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*💠 POUVOIR :* Aucun
*🌐 POSITION :* 
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓[ CHARGEMENT... ]▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
           // zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   repondre(msg);
        }
    }
);

zokou(
    {
        nomCom: 'story_mj',
        categorie: 'ORIGAMY'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            // const lien = '';
            const msg = `▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓[ORIGAMY WORLD]▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*👤[PLAYER NAME]:* [Tours].
*🕰️TEMPS :* [Période / Météo].
*📍COORDONNÉES :* [Localisation / Destination].
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓*
*\`🎭 MAÎTRE DU JEU:\`*

> *[Résumé du pavé du joueur et analyse des statistiques affectés]*.

> *[Verdict du Maître du Jeu aux actions du joueur]*.

> *[Statistiques perdues ou gagner, distance parcourue, etc]*.
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓*
*\`💠 STATISTIQUES :\`*

*👤[PLAYER NAME]:*
> ❤️: 100 | 🌀: 100 | 🫀: 100
> 🍽️: 100 | 🍶: 100 | 🙂: 000

*\`📦 INVENTAIRES :\`* 0/3
> *💰 Bourse :* 000🧭
> *
> *
> *

[Zone de statistiques des PNJ]
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
*▓▓▓▓▓▓[À SUIVRE...]▓▓▓▓▓▓*
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;
           // zk.sendMessage(dest, { image: { url: lien }, caption: msg }, { quoted: ms });
   repondre(msg);
        }
    }
);
