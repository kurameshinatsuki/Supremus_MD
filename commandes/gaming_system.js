const { zokou } = require('../framework/zokou');
const { writeFileSync, readFileSync, unlinkSync } = require('fs');
const { randomInt } = require('crypto');

// Commande pour envoyer le système ABM en HTML
zokou(
  { nomCom: 'abm_system', categorie: 'ABM' },
  async (dest, zk, { ms }) => {
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>ABM Système de Combat - SRPN</title>
    <style>
        body {
            background-color: #1e1e1e;
            color: #ffffff;
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        h1, h2 {
            text-align: center;
            color: #f39c12;
        }
        h3 {
            color: #00aced;
            margin-top: 40px;
        }
        pre {
            background: #2e2e2e;
            padding: 15px;
            border-left: 4px solid #f39c12;
            overflow-x: auto;
            white-space: pre-wrap;
        }
        .section {
            margin-bottom: 40px;
        }
    </style>
</head>
<body>
    <h1>⚔️ ABM - SYSTÈME DE COMBAT ⚔️</h1>
<div class="section"><h3>BASIC RULE</h3><pre>
PAVÉ : Divisé en sections, 1 action max par section (ou simultanées si cohérentes).
Décrivez précisément l&#x27;action : membre, mouvement, zone ciblée, intention.
Les techniques doivent mentionner le niveau et la distance.

ARMES : Dégâts classiques : 20💥. Coup critique ou membre : 30💥.
Portée projectile : 20m⭕ / Vitesse : 5m/s🎯.

ALTÉRATIONS D’ÉTAT :
- Saignement léger : -20❤️/section.
- Saignement grave : -40❤️/section.
- Étourdissement : +200ms⚡.
- Douleur intense : -50% vitesse et force.
- Paralysie, Brûlure, Empoisonnement, Froid intense : Effets variés.

RÉGÉNÉRATION : 
- Instantanée : seule la décapitation ou 0❤️ tue.
- +20🌀 si immobile une section / +10🫀 au repos.
</pre></div><div class="section"><h3>CLOSE COMBAT</h3><pre>
FORCE PHYSIQUE :
Brown &lt; Gray &lt; Yellow &lt; Blue &lt; Green.
- Brown : 10💥 / Gray : 20💥 / Yellow+ : 30💥+
- Dégâts augmentés sur zone sensible, fractures ou impacts violents.
- Se libérer d&#x27;une saisie : -10🫀 sauf si force supérieure.

VITESSE :
- Réaction (V.R) en ms⚡ / Déplacement (V.D) en m/s🎯.
- Déplacement max = -10🫀.

Réaction retardée :
- ≥500ms : aucune réaction
- 400ms : bloquer seulement
- 300ms : esquive ou blocage
- 100-200ms : riposte possible

TEMPO :
- Défensive normale : 200ms⚡
- Attaque rapprochée : +100ms⚡
- Hors vision / perception sensorielle : +100ms⚡

- Combo = 3 coups max par tour.
- Combo exclut action simultanée.
- Personnage plus rapide peut enchaîner.

- Angle mort : +300ms⚡ pour l’adversaire.
- Anticipation ou VR supérieure réduit le retard.

OVERDRIVE :
- Utilisable défensivement 1 fois/2 sections.
- Coût : -20🫀
- Contre une technique :
  - Niv B : -20🫀
  - Niv A : -30🫀
  - Niv S : -40🫀
</pre></div><div class="section"><h3>FULL POWER</h3><pre>
Rangs définissent V.R, V.D, potentiel :

- Rang C : 5m/s🎯 | 500ms⚡
- Rang B : 6m/s🎯 | 400ms⚡
- Rang A : 7m/s🎯 | 300ms⚡
- Rang S : 8m/s🎯 | 200ms⚡
- Rang Z : 10m/s🎯 | 100ms⚡

Potentiel physique :
- Défini force, résistance ou durabilité.
- Brown = de base / Gray+ = avantage spécifique.
</pre></div><div class="section"><h3>CLASSEMENT DES TECHNIQUES</h3><pre>
--------------------------------------------------------------
| Niveau | Portée | Dégâts | Vitesse | Effet |
|--------|--------|--------|---------|--------|
|  Niv B |  5m⭕   |  30💥  |   6m🎯  |   1/2  |
|  Niv A |  8m⭕   |  50💥  |   8m🎯  |   2    |
|  Niv S | 10m⭕   |  80💥  |  10m🎯 |   3    |
--------------------------------------------------------------

- Attaque sup. brise défense inf. (-50% puissance).
- Écart de 2 niveaux ou + = puissance intacte.
- Certaines techniques échappent aux règles (ex : dématérialisation).
- Techniques à grande échelle : portée en km.
- Combinaisons possibles (ex : 2x A &gt; 1x S).
</pre></div>
    <h2>SRPN - ABM v1</h2>
</body>
</html>`;

    const filename = `abm_system_${randomInt(10000)}.html`;
    writeFileSync(filename, html);

    await zk.sendMessage(dest, {
      document: readFileSync(filename),
      mimetype: 'text/html',
      filename: 'systeme_abm.html',
      caption: '*📜 ABM SYSTEM – COMBAT SRPN*'
    }, { quoted: ms });

    unlinkSync(filename);
  }
);

// Commande pour envoyer le système Origamy World en HTML
zokou(
  { nomCom: 'origamy_system', categorie: 'ORIGAMY' },
  async (dest, zk, { ms }) => {
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Système Origamy World</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f8f9fa;
      color: #111;
      margin: 2rem;
      padding: 1rem;
    }
    h1, h2, h3 {
      border-bottom: 2px solid #ccc;
      padding-bottom: 0.2em;
    }
    section {
      margin-bottom: 2rem;
    }
    .highlight {
      background-color: #e9ecef;
      padding: 0.5em;
      border-radius: 0.4em;
    }
    pre {
      background: #f1f1f1;
      padding: 0.8em;
      border-radius: 6px;
      overflow-x: auto;
    }
    code {
      font-family: 'Courier New', monospace;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    table th, table td {
      border: 1px solid #ccc;
      padding: 0.5em;
      text-align: center;
    }
    .emojis {
      font-size: 1.2em;
    }
  </style>
</head>
<body>
  <h1>📜 ORIGAMY WORLD - SYSTÈME D’AVENTURE RP TEXTUEL SRPN</h1>

  <section>
    <h2>🔹 STRUCTURE DU PAVÉ RP STORY</h2>
    <pre><code>▓▓▓▓[ORIGAMY STORY]▓▓▓▓
[PLAYER NAME] :

> Section 1: [Première description...]
> Section 2: [Seconde description...]

💠 POUVOIR : [Techniques Actifs]
🌐 POSITION : [Localisation du joueur]
❤️: 100 | 🌀: 100 | 🫀: 100
🍽️: 100 | 🍶: 100 | 🎭: 000
📦 INVENTAIRE : 0/2
💰 Bourse : 0
▓▓▓▓[CHARGEMENT...]▓▓▓▓</code></pre>
  </section>

  <section>
    <h2>🔹 EXPLORATION ET DÉPLACEMENTS</h2>
    <div class="highlight">
      <p>🚶‍♂️ À PIED : 0.5 km (marche), 1 km (-10🫀), 2 km en overdrive (-20🫀)<br>
      🐎 MONTURES : 1.5 à 3 km selon la vitesse, affectée par l’environnement et la stamina 🐾.<br>
      🏃‍♂️ POURSUITE : Bonus de vitesse selon différence en m/s 🎯.</p>
    </div>
  </section>

  <section>
    <h2>🔹 ENVIRONNEMENTS SPÉCIFIQUES</h2>
    <ul>
      <li>🌊 SWIM : -10🫀, -20🌬️ sous l'eau</li>
      <li>⛰️ MONTAGNE : double Heart à pied, -50% vitesse monture</li>
      <li>❄️ NEIGE : Maladies, froid, besoin d’équipement</li>
    </ul>
  </section>

  <section>
    <h2>🔹 CLIMAT, SAISONS ET MÉTÉO</h2>
    <p>Effets variables : 🌧️ pluie (sol glissant), ❄️ neige (-20❤️), 🌡️ canicule, 🌪️ tempêtes</p>
  </section>

  <section>
    <h2>🔹 INTERACTIONS & PNJ</h2>
    <p>Réputation : +20🙂 ou +20😈 selon vos actions<br>
    PNJ dynamiques : routine, réactivité, trahison possible</p>
  </section>

  <section>
    <h2>🔹 CRAFTING ET POSSESSIONS</h2>
    <p>📦 Construction coûte en ressources (2 unités / m²)<br>
    ⚙️ Durabilité : 🥉 100, 🥈 200, 🥇 300, 🏅 infini</p>
  </section>

  <section>
    <h2>🔹 STATS & SURVIE</h2>
    <p>🍽️ Faim & 🍶 Soif : -30% tous les 3 tours<br>
    ❤️ Santé : soins médicaux<br>
    🌀 Énergie : +20🌀 / accumulation<br>
    🫀 Endurance : +10🫀 / repos</p>
  </section>

  <section>
    <h2>🔹 RESSOURCES</h2>
    <ul>
      <li>🌿 Médicinales, ☠️ Toxiques, ✨ Magiques</li>
      <li>🪵 Bois, 🪨 Pierre, 💠 Précieux, ⚙️ Rares</li>
      <li>🍎 Nourriture : Fruits, Viandes, Poissons...</li>
      <li>🐺 Animaux : sauvages, bétail, magiques</li>
    </ul>
  </section>

  <section>
    <h2>🔹 PROGRESSION & RANG</h2>
    <table>
      <thead>
        <tr><th>Rang</th><th>Normal</th><th>Fort</th><th>Extrême</th></tr>
      </thead>
      <tbody>
        <tr><td>C</td><td>50-100</td><td>100-150</td><td>150-200</td></tr>
        <tr><td>B</td><td>100-200</td><td>200-300</td><td>300-400</td></tr>
        <tr><td>A</td><td>200-400</td><td>400-600</td><td>600-800</td></tr>
        <tr><td>S</td><td>400-800</td><td>800-1200</td><td>1200-1600</td></tr>
        <tr><td>Z</td><td>800-1600</td><td>1600-2400</td><td>2400-3200</td></tr>
      </tbody>
    </table>
    <p><strong>LEVELUP :</strong> C ➜ B (1000 XP), B ➜ A (2500 XP), A ➜ S (5000 XP), S ➜ Z (10000+ XP)</p>
  </section>

  <section>
    <h2>⚠️ COMBAT</h2>
    <p>Utilise le <strong>système ABM</strong> pour les affrontements dans Origamy World.</p>
  </section>
</body>
</html>`;

    const filename = `origamy_system_${randomInt(10000)}.html`;
    writeFileSync(filename, html);

    await zk.sendMessage(dest, {
      document: readFileSync(filename),
      mimetype: 'text/html',
      filename: 'systeme_origamy.html',
      caption: '*🌍 ORIGAMY WORLD – SYSTÈME RP*'
    }, { quoted: ms });

    unlinkSync(filename);
  }
);

// Commande pour envoyer le système YU-GI-OH en HTML
zokou(
    { nomCom: 'yugioh_system', categorie: 'YU-GI-OH' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;

        const html = `<!DOCTYPE html><html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🎴 Yu-Gi-Oh : Speed Duel 🎴 - Gameplay SRPN</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #121212;
      color: #f8f8f8;
      padding: 2rem;
      line-height: 1.6;
    }
    h1, h2, h3 {
      color: #ffe600;
      text-align: center;
    }
    .section {
      margin: 2rem 0;
      padding: 1rem;
      background-color: #1f1f1f;
      border-left: 5px solid #ffcc00;
    }
    code {
      background: #333;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.95em;
    }
    ul {
      padding-left: 1.2rem;
    }
    li {
      margin-bottom: 0.5rem;
    }
    .highlight {
      color: #00ffff;
    }
  </style>
</head>
<body>
  <h1>🎴 Yu-Gi-Oh! Speed Duel 🎴</h1>
  <h2>— GAMEPLAY SRPN —</h2>  <div class="section">
    <h3>1. PRÉPARATION DU DUEL</h3>
    <ul>
      <li>Choisissez votre deck via la commande <code>~deck [nom]</code> (ex : <code>~deck yami</code>, <code>~deck kaiba</code>).</li>
      <li>Le duel est supervisé par un arbitre (modo).</li>
      <li>Chaque joueur commence avec <strong>4 cartes en main</strong>.</li>
    </ul>
  </div>  <div class="section">
    <h3>2. DÉROULEMENT DU TOUR</h3>
    <p>Le tour est divisé en 3 phases (pavés) :</p>
    <ul>
      <li><strong>Phase 1 : Pioche & Main Phase 1</strong><br>Ex: "Je pioche. J’invoque [monstre]. Je pose une carte face cachée."</li>
      <li><strong>Phase 2 : Battle Phase</strong><br>Ex: "[Monstre] attaque [cible]. Dommages : ..."</li>
      <li><strong>Phase 3 : Main Phase 2 & End Phase</strong><br>Ex: "Je pose une magie. Fin du tour."</li>
    </ul>
    <p><em>À chaque phase, attendre la validation de l’arbitre ou une réaction adverse.</em></p>
  </div>  <div class="section">
    <h3>3. CARTES FACE CACHÉE & EFFETS</h3>
    <ul>
      <li>Déclarez en privé toute carte posée face cachée à l’arbitre.</li>
      <li>Ex: Carte posée : <code>Les 7 Outils du Bandit</code> | Effet : Annule une carte piège (-1000 LP)</li>
      <li>Lors de l’activation : "J’active ma carte piège posée T1."</li>
    </ul>
  </div>  <div class="section">
    <h3>4. INTERRUPTIONS & RÉACTIONS</h3>
    <ul>
      <li>L’adversaire peut réagir à chaque phase : piège, magie, effet.</li>
      <li>Déclarez : "Je réagis avec une [carte/effet]" puis détaillez ou contactez l’arbitre.</li>
    </ul>
  </div>  <div class="section">
    <h3>5. RÈGLES DE BASE</h3>
    <ul>
      <li>1 seule invocation normale par tour (hors effets).</li>
      <li>3 actions majeures max par tour.</li>
      <li>Les effets doivent être expliqués à l’arbitre.</li>
      <li>Respecter les phases et leur ordre.</li>
    </ul>
  </div>  <div class="section">
    <h3>6. COMMANDES UTILES</h3>
    <ul>
      <li><code>~deck</code> : Voir les decks disponibles</li>
      <li><code>~deck [Nom]</code> : Choisir un deck</li>
      <li><code>~carte</code> : Voir toutes les cartes</li>
      <li><code>~carte [Nom]</code> : Afficher une carte</li>
    </ul>
  </div>  <div class="section">
    <h3>RÈGLES DU SPEED DUEL</h3>
    <ul>
      <li><strong>LP :</strong> 4000 par joueur</li>
      <li><strong>Deck :</strong> 20-30 cartes (max 3 exemplaires)</li>
      <li><strong>Extra Deck :</strong> max 5 cartes (Fusion)</li>
      <li><strong>Terrain :</strong> 6 zones (Deck, Extra Deck, Cimetière, Terrain, 3 Monstres, 3 Magies/Pièges)</li>
      <li><strong>Tour :</strong> Piocher, poser/invoquer, attaquer</li>
    </ul>
    <p><strong>Position & Niveaux :</strong></p>
    <ul>
      <li>Niv 1-4 : Aucun tribut</li>
      <li>Niv 5-6 : 1 tribut</li>
      <li>Niv 7+ : 2 tributs</li>
    </ul>
    <p>Magies = jouables depuis la main. Pièges = posés, activables au tour suivant sauf exception.</p>
  </div></body>
</html>`;

        const filename = `yugioh_system_${randomInt(10000)}.html`;
        writeFileSync(filename, html);

        await zk.sendMessage(dest, {
            document: readFileSync(filename),
            mimetype: 'text/html',
            filename: 'yugioh_system.html',
            caption: '*🎴 C\'est l\'heure du duel !*'
        }, { quoted: ms });

        unlinkSync(filename);
    }
);

// Commande pour envoyer le système Speed Rush en HTML
zokou(
    { nomCom: 'speedrush_system', categorie: 'SPEED-RUSH' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;

        const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>SPEED RUSH SYSTEM</title>
    <style>
        body {
            background-color: #1a1a1a;
            color: #f0f0f0;
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        h1, h2 {
            text-align: center;
            color: #f39c12;
        }
        h3 {
            color: #00aced;
            margin-top: 40px;
        }
        .section {
            margin-bottom: 40px;
        }
        pre {
            background: #222;
            padding: 15px;
            border-left: 4px solid #f39c12;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <h1>🏁 SPEED RUSH SYSTEM 🏁</h1>

    <div class="section"><h3>1. RÈGLES DE BASE</h3><pre>
Tours De Jeu :

Chaque tour, vous pouvez effectuer 2 actions maximum :

Actions de conduite : Accélérer, ralentir, manœuvrer, drifter. 

Utilisation de gadgets 1 seule par tour.

Zone d&#x27;infos : Affiche l’état du véhicule (🚘résistance, ⛽carburant, 🛢️turbo).
</pre></div>
    <div class="section"><h3>2. STATISTIQUES DES VÉHICULES</h3><pre>
⏫ VITESSE (KM/H ou KM/Tour)
Détermine la rapidité sur le circuit, la distance sur le circuit est à échelle réduite (100 km/h = 1,0km/tour) donc rouler à 220 km durant un tour vous fera parcourir 2,2 km sur le circuit.

🛞 MANIABILITÉ
Détermine la capacité à éviter les obstacles.

Règle d’évitement :
- Hors trajectoire = pas de collision.
- Sur trajectoire = ralentir ou changer de ligne.
Ex : À 220 km/h, obstacle à 1,8 km = collision si pas de freinage/évitement.

🚘 RÉSISTANCE
Définit la robustesse face aux collisions.

Dommages selon impact :
- Joueur percute joueur : -10🚘 (attaquant), -30🚘 (défenseur) + dérapage.
- Obstacles légers : -20🚘.
- Obstacles solides : -40🚘 + -50 km/h (2 tours).
- Obstacles très solides : -60🚘 + -100 km/h (2 tours).
- Moto percute solide = crash direct.
- Résistance à 0 = explosion.

🛢️ TURBO
- Phase Incomplète (Orange) : +100 km/h (coût -20🛢️).
- Phase Complète (Bleue) : +200 km/h (coût -40🛢️, après Incomplète).

Durée : 2 tours. Supprime consommation ⛽.

⛽ CARBURANT
- ≤ 200 km/h : -10⛽/tour.
- &gt; 200 km/h : -20⛽/tour.
- 0⛽ = fin de course.
</pre></div>
    <div class="section"><h3>3. CIRCUIT ET ENVIRONNEMENT</h3><pre>
DÉPASSEMENT
Basé sur la différence de vitesse convertie en distance (100 km/h = 1km/tour).
Dépassement si distance &lt; 0. Influencé par maniabilité et obstacles.

VIRAGES
- Drift ≤ 90° : aucune limite.
- Virage &gt; 90° : ≤ 200 km/h, sinon dérive de 3m + risques.

MONTÉES / DESCENTES
- Montée : &gt; 200 km/h requis, sinon -50 km/h + risque crash.
- Descente : +100 km/h auto, tout dérapage = crash possible.

VOIES ET LIGNES
Chaque voie = 3m ; véhicule = 2m, moto = 1m.

PETITE VOIE (6m) : 1 ligne/sens ↔
MOYENNE VOIE (12m) : 2 lignes/sens ⇄
GRANDE VOIE (18m) : 3 lignes/sens ⇆
</pre></div>
    <div class="section"><h3>4. ZONES À RISQUE</h3><pre>
🏜️ SECTION ENSABLÉE
-50 km/h ; risque d&#x27;enfoncement &lt; 200 km/h.

❄️ SECTION GLISSANTE
&gt; 200 km/h = dérapage/crash possible.

⚠️ SECTION PIÈGE
Pièges, obstacles, explosions imprévisibles.
</pre></div>
    <div class="section"><h3>5. GADGETS DE COURSE</h3><pre>
🛢️ TURBO THUNDER : +50% turbo.
💠 VELOCITY THRUSTER : +200 km/h (1 tour).
🛡️ GUARDIAN SHIELD : Immunité (2 tours).
🪞 MIRROR ARMOR : Renvoi de dégâts (2 tours).
🎳 PLASMA CANNON : Projectile, -50🚘.
🔊 SHOCKWAVE BLASTER : Onde, -100 km/h aux proches.
🔧 INSTANT REPAIR : +50% réparations.
♾️ PHOENIX REBORN : Résurrection avec stats d’origine.
</pre></div>

    <h2 style="text-align:center;">SRPN - Speed Rush v1</h2>
</body>
</html>`;

        const filename = `speedrush_system_${randomInt(10000)}.html`;
        writeFileSync(filename, html);

        await zk.sendMessage(dest, {
            document: readFileSync(filename),
            mimetype: 'text/html',
            filename: 'speedrush_system.html',
            caption: '*🏎️ SPEED RUSH – SYSTÈME DE COURSE*'
        }, { quoted: ms });

        unlinkSync(filename);
    }
);