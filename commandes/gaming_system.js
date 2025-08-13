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
    <title>ABM SYSTEM – SRPN</title>
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
        p {
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
    <h1>🆚 ABM - SYSTÈME DE COMBAT 🌐</h1>
<div class="section"><h3>BASIC RULE</h3><p><strong>PAV&Eacute; :</strong> Le pav&eacute; est divis&eacute; en sections et vous pouvez ex&eacute;cuter que (1) action max par section ou simultan&eacute;es si coh&eacute;rentes (une action qui se d&eacute;roule durant une autre action sans d&eacute;fier la physique, ex: d&eacute;gainer une arme durant son d&eacute;placement / donner un coup de pied durant un saut / etc.) d&eacute;crire l&#39;action avec pr&eacute;cision (le membre utilis&eacute;, le mouvement d&#39;ex&eacute;cution, la zone cibl&eacute;e et l&#39;intention).<br><br>

Les techniques peuvent &ecirc;tre ex&eacute;cut&eacute;es en une section et doivent respecter leur description. Vous devez pr&eacute;ciser la technique utilis&eacute;e, son niveau et la distance entre vous et l&#39;adversit&eacute;.<br><br>

<strong>ARMES :</strong> Les armes classiques causent 20💥 de d&eacute;g&acirc;ts. La section d&#39;un membre ou un coup critique cause 30💥 de d&eacute;g&acirc;ts, avec risque de saignement. Une attaque vitale peut &ecirc;tre mortelle. La vitesse normale d&#39;un projectile est de 5 m&egrave;tres par section (5m/s🎯) pour une port&eacute;e de 20 m&egrave;tres (20m⭕).<br><br>

<strong>ALT&Eacute;RATIONS D&#39;&Eacute;TAT :</strong> un Saignement l&eacute;ger : -20❤️ par section. un Saignement grave : -40❤️ par section. un &Eacute;tourdissement : r&eacute;action ralentie de +200ms⚡. une Douleur Intense : vitesse et force physique r&eacute;duites de 50%. la Paralysie : immobilit&eacute; temporaire. les Br&ucirc;lures : effets saignement + douleur intense. l&#39;Empoisonnement : Effet variable selon le poison. Froid Intense : -20❤️ par tour.<br><br>

<strong>R&Eacute;G&Eacute;N&Eacute;RATION :</strong> Les personnages pouvant se r&eacute;g&eacute;n&eacute;rer instantan&eacute;ment (ex: d&eacute;mon, attribut...) ne peuvent &ecirc;tre tu&eacute;s que par d&eacute;capitation ou r&eacute;duction de la sant&eacute; &agrave; 0❤️. Ils ne restaurent pas la sant&eacute; sauf si la comp&eacute;tence mentionne le contraire. Vous r&eacute;cup&eacute;rez +20🌀 une section immobile &agrave; accumuler de l&#39;&eacute;nergie et +10🫀 au repos.</p></div><div class="section"><h3>CLOSE COMBAT</h3><p><strong>FORCE PHYSIQUE :</strong> 🟤Brown &lt; ⚪Gray &lt; 🟡Yellow &lt; 🔵Blue &lt; 🟢Green. Les coups de personnage de force Brown causent 10💥 de d&eacute;g&acirc;ts et peuvent repousser un adversaire &eacute;gal jusqu&#39;&agrave; 5m mais chaque niveau suppl&eacute;mentaire ajoute plus 10💥 de d&eacute;g&acirc;ts.<br>
Briser un membre ou frapper une zone sensible (c&ocirc;te, colonne vert&eacute;brale, etc...) cause plus 10💥 de d&eacute;g&acirc;ts suppl&eacute;mentaires. Les coups de personnage de force Gray peuvent envoyer un adversaire &eacute;gal ou inf&eacute;rieur valser &agrave; 10m et sup&eacute;rieur &agrave; 5m, mais ceux de force Yellow ou plus peuvent litt&eacute;ralement envoyer l&#39;adversaire voler dans le d&eacute;cor et m&ecirc;me briser des membres ou perforer le corps humain.<br>
Se lib&eacute;rer d&#39;une saisie vous co&ucirc;te 10🫀 mais les personnages plus forts ne perdent rien.<br><br>

<strong>VITESSE :</strong> R&eacute;action (V.R) : mesur&eacute;e en millisecondes (ms ou ⚡). D&eacute;placement (V.D) : mesur&eacute; en m&egrave;tres par section (m/s ou 🎯). Se d&eacute;placer &agrave; vitesse maximale vous co&ucirc;te 10🫀.<br><br>

- Le personnage r&eacute;agissant avec 500ms⚡ de retard ne peut que mettre sa garde (bloquer) ce qui l'expose &agrave; plus de 500ms⚡, ne peut pas r&eacute;agir.<br>
- Le personnage r&eacute;agissant avec 400ms⚡ de retard peut seulement bloquer ou esquiver.<br>
- Le personnage r&eacute;agissant avec 300ms⚡ de retard peut bloquer, esquiver ou m&ecirc;me riposter (attaquer simultan&eacute;ment, mais peut s'exposer &agrave; l'attaque adverse.)<br>
- Le personnage r&eacute;agissant avec 100ms⚡ ou 200ms⚡ de retard peut r&eacute;agir normalement.<br>
- Si le personnage n'est pas affect&eacute; par le retard de r&eacute;action, il peut attaquer avant m&ecirc;me que l'adversaire puisse ex&eacute;cuter son action.<br><br>

<strong>TEMPO :</strong> Le retard de r&eacute;action normal en position d&eacute;fensive est de 200ms⚡. R&eacute;agir au lancement d&#39;un coup &agrave; close distance augmente le temps de r&eacute;action de +100ms⚡ : vous devez donc r&eacute;agir &agrave; la pr&eacute;pa du coup (mouvement) afin de contrer normalement.<br>
Vous ne pouvez pas r&eacute;agir &agrave; une attaque que vous ne voyez pas (de profil ou de dos), vous devez donc r&eacute;agir &agrave; ce que vous ressentez (perception sensorielle). Cela aussi augmente le temps de r&eacute;action de +100ms⚡.<br>
Vous ne pouvez pas annuler une action en cours, mais la modifier pour 10🫀 ou ex&eacute;cuter une action simultan&eacute;e. Idem pour les techniques. Les personnages capables d&#39;anticiper ou avec un potentiel de vitesse sup&eacute;rieure peuvent r&eacute;agir normalement.<br><br>

Le personnage en position d&eacute;fensive doit r&eacute;agir section par section aux attaques adverses. S&#39;il esquive, l&#39;attaquant le suit automatiquement pour placer son attaque suivante, mais seulement si la cible reste dans son champ de vision et sa port&eacute;e sensorielle.<br>
Si le personnage d&eacute;fensif quitte la zone de perception adverse, il peut riposter sans &ecirc;tre suivi.<br>
Un contre ne signifie pas une annulation totale de l&#39;offensive adverse, mais juste une r&eacute;ponse &agrave; la section en cours.<br>
Vous pouvez encha&icirc;ner un combo de 3 coups max en 1 section. Le personnage d&eacute;fensif peut aussi contrer avec un combo.<br>
Vous ne pouvez ex&eacute;cuter un combo qu&#39;une fois par tour et il ne peut pas &ecirc;tre ex&eacute;cut&eacute; dans la m&ecirc;me section qu&#39;une action simultan&eacute;e.<br>
Seul un personnage plus rapide en (V.D🎯) peut encha&icirc;ner d&eacute;placement et coup sans casser l&#39;encha&icirc;nement.<br><br>

Si un personnage se d&eacute;place plus vite que l&#39;adversaire, celui-ci r&eacute;agit avec +100ms⚡ de retard.<br>
Dans le cas o&ugrave; le personnage plus rapide se repositionne dans l&#39;angle mort de l&#39;adversaire (hors du champ de vision : 180&deg; pour les deux yeux et 90&deg; pour un &oelig;il), l&#39;adversaire r&eacute;agit avec +200ms⚡ de retard.<br>
Les personnages plus r&eacute;actifs verront leur retard r&eacute;duit selon la diff&eacute;rence de r&eacute;action entre eux et leur adversaire.<br><br>

<strong>OVERDRIVE :</strong> L&#39;Overdrive, utilisable seulement en position d&eacute;fensive et 1 fois toutes les 4 sections, permet de r&eacute;agir face &agrave; une attaque impossible &agrave; r&eacute;agir normalement.<br>
Mais cela co&ucirc;te -20🫀 de hearts et aussi la possibilit&eacute; de contrer une technique, variable selon le niveau de la technique :<br><br>

Niv B = -20🫀 &nbsp;|&nbsp; Niv A = -30🫀 &nbsp;|&nbsp; Niv S = -40🫀</p></div><div class="section"><h3>FULL POWER</h3><p><strong>CLASSIFICATION DES PERSONNAGES :</strong><br>
Les personnages sont class&eacute;s par rang d&eacute;finissant leur capacit&eacute; physique comme : vitesse de r&eacute;action (V.R), vitesse de d&eacute;placement (V.D) et potentiels (Brown &lt; Gray &lt; Yellow &lt; Blue &lt; Green)<br><br>

<strong>D&eacute;finition des valeurs par rang :</strong><br>
- Rang C : V.D = 05m/s🎯 | V.R = 500ms⚡<br>
- Rang B : V.D = 06m/s🎯 | V.R = 400ms⚡<br>
- Rang A : V.D = 07m/s🎯 | V.R = 300ms⚡<br>
- Rang S : V.D = 08m/s🎯 | V.R = 200ms⚡<br>
- Rang Z : V.D = 10m/s🎯 | V.R = 100ms⚡<br><br>

Le potentiel est un syst&egrave;me hi&eacute;rarchique variable. Un personnage de Rang C pourrait avoir une grande force physique, une grande r&eacute;sistance ou une grande durabilit&eacute; (Gray) ou sup&eacute;rieure (peu probable), ce qui le rend unique et lui offre un atout propre.<br><br>

Par exemple :<br>
- Un personnage avec une force brute Gray causera 20💥 de d&eacute;g&acirc;ts alors qu&#39;un Brown causera 10💥 de d&eacute;g&acirc;ts.<br>
- Un personnage de durabilit&eacute; Gray pourrait continuer &agrave; se battre normalement malgr&eacute; une douleur intense.<br>
- Un personnage de r&eacute;sistance Yellow pourrait r&eacute;duire les d&eacute;g&acirc;ts des coups de niveau inf&eacute;rieur de 50%.<br><br>

Le potentiel normal des personnages est Brown sauf si sa description indique le contraire.<br><br>

<strong>CLASSEMENT DES TECHNIQUES :</strong><br>
Les techniques sont class&eacute;es en 3 niveaux de puissance mais aussi selon leur efficacit&eacute; gr&acirc;ce au nombre d&#39;effets qu&#39;elles peuvent avoir.</p><br><br>

<table border="1" cellpadding="5" cellspacing="0">
  <thead>
    <tr>
      <th>Niveau</th>
      <th>Port&eacute;e</th>
      <th>D&eacute;g&acirc;ts</th>
      <th>Vitesse</th>
      <th>Effet</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Niv B</td>
      <td>5m⭕</td>
      <td>30💥</td>
      <td>6m🎯</td>
      <td>1 / 2</td>
    </tr>
    <tr>
      <td>Niv A</td>
      <td>8m⭕</td>
      <td>50💥</td>
      <td>8m🎯</td>
      <td>2</td>
    </tr>
    <tr>
      <td>Niv S</td>
      <td>10m⭕</td>
      <td>80💥</td>
      <td>10m🎯</td>
      <td>3</td>
    </tr>
  </tbody>
</table><br>

<p><strong>R&egrave;gles de sup&eacute;riorit&eacute; :</strong><br>
- Une attaque de niveau sup&eacute;rieur brise la d&eacute;fense de niveau inf&eacute;rieur mais voit sa puissance r&eacute;duite de 50%.<br>
- Si l&#39;&eacute;cart est de 2 niveaux ou plus, l&#39;attaque garde sa puissance initiale.<br>
- Certaines techniques peuvent &ecirc;tre efficaces en raison de leur nature (ex : d&eacute;mat&eacute;rialisation, distorsion spatiale, etc.).<br>
- Les techniques de grande port&eacute;e (t&eacute;l&eacute;portation, invocations...) affectent toute la zone de combat. Une technique &agrave; grande &eacute;chelle verra sa port&eacute;e convertie en kilom&egrave;tres (X m = X km).<br>
- Combinaison de techniques possible pour cr&eacute;er des attaques ou d&eacute;fenses avanc&eacute;es, par exemple : combiner deux attaques de niveau A pourrait contrer une attaque de niveau S.<br><br>

<strong>Exemples de hi&eacute;rarchie (plus petit que &lt;) :</strong><br>
- Brown &lt; Gray &lt; Yellow &lt; Blue &lt; Green<br>
- Rang C &lt; Rang B &lt; Rang A &lt; Rang S &lt; Rang Z<br>
- Niveau B &lt; Niveau A &lt; Niveau S</p></div>
    <h2>SRPN - ABM v1</h2>
</body>
</html>`;

    const filename = `abm_system_${randomInt(10000)}.html`;
    writeFileSync(filename, html);

    await zk.sendMessage(dest, {
      document: readFileSync(filename),
      mimetype: 'text/html',
      filename: 'systeme_abm.html',
      caption: '*🆚 ABM SYSTEM – RP COMBAT*'
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
  <title>ORIGAMY SYSTEM – SRPN</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f8f9fa;
      color: #111;
      margin: 2rem;
      padding: 1rem;
    }
    h2, h3 {
      border-bottom: 2px solid #ccc;
      padding-bottom: 0.2em;
    }
    h1 {
      text-align: center;
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
  <h1>🌐 ORIGAMY WORLD – SYSTEM SRPN 🌐</h1>

  <section>
    <h2>🔹 STRUCTURE DU PAVÉ RP STORY</h2>
    <div class="highlight">
      <p><br>
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁<br>
*▓▓▓▓[ORIGAMY  STORY]▓▓▓▓*<br>
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔<br>
*[PLAYER NAME] :*<br><br>

&gt; *Section 1:* [Premi&egrave;re description d&#39;actions du joueur respectant les r&egrave;gles du jeu].<br><br>

&gt; *Section 2:* [Seconde description d&#39;actions du joueur respectant les r&egrave;gles du jeu].<br>
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁<br>
*💠 POUVOIR :* [Techniques Actifs]<br>
*🌐 POSITION :* [Localisation/Destination du joueur]<br>
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔<br>
❤️: 100 | 🌀: 100 | 🫀: 100<br>
🍽️: 100 | 🍶: 100 | 🎭: 000<br><br>

*📦 INVENTAIRE :* 0/2<br>
&gt; *💰 Bourse :* 0<br>
&gt; *<br>
&gt; *<br>
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁<br>
*▓▓▓▓[ CHARGEMENT... ]▓▓▓▓*<br>
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔<br><br></p>
    </div><strong>R&Egrave;GLES DE JEU RP STORY</strong><br><br>

<div class="highlight">
      <p><strong>ORIGAMY SERVEURS :</strong> Origamy World est divis&eacute; en plusieurs serveurs repr&eacute;sentant une zone chacune. Il est important de respecter les r&egrave;gles suivantes : pas de spam [message, stickers, etc.], juste vos pav&eacute;s et questions ; apr&egrave;s 3⚠️ avertissements c&#39;est -30 XP et -3 000🧭. Vous ne pouvez pas &ecirc;tre dans plusieurs serveurs &agrave; la fois ; si vous changez de zone vous devez rejoindre le serveur de cette zone et quitter le pr&eacute;c&eacute;dent, sous peine de sanction. Veuillez rester r&eacute;aliste, respecter le syst&egrave;me de jeu et les lois de la physique.</p>
    </div><br><br></section>

  <section>
    <h2>🔹 EXPLORATION ET DÉPLACEMENTS</h2>
    <div class="highlight">
      <p>Les d&eacute;placements sont bas&eacute;s sur des unit&eacute;s de distance et des consommations d’&eacute;nergie adapt&eacute;es.<br><br>

<strong>&Agrave; PIED :</strong> Vous parcourez 0.5 km par section en marche, et 1 km par section (-10🫀 Heart) en course. En Overdrive vous parcourez 2 km par section (-20🫀 Heart). 🫀 HEART : la jauge va de 100🫀 à 0🫀 ; vous perdez connaissance durant 3 tours, au repos vous r&eacute;couvrez +20🫀 par section.<br><br>

<strong>MONTURES :</strong><br>
• Terrestres : vitesse normale 1,5 km🎯 | mod&eacute;r&eacute;e 2 km🎯 (-10🐾) | max 3 km🎯 (-20🐾).<br>
• Volantes : vitesse normale 2 km🎯 | mod&eacute;r&eacute;e 2,5 km🎯 (-10🐾) | max 4 km🎯 (-20🐾).<br>
🐾 STAMINA : la jauge va de 100🐾 à 0🐾 ; la cr&eacute;ature succombe à la fatigue. Immobile : +20🐾 ; &agrave; vitesse normale : +10🐾 par section.<br><br>

<strong>POURSUITE :</strong> La vitesse de d&eacute;placement durant une poursuite diff&egrave;re du d&eacute;placement normal. &Agrave; &eacute;chelle r&eacute;duite vous vous d&eacute;placez en m/s🎯, et en km/s🎯 à grande &eacute;chelle. Lorsqu’une poursuite est engag&eacute;e, le plus rapide obtient un bonus de +0.5 km🎯 pour chaque 1 m/s🎯 de diff&eacute;rence. Ex : un perso avec V.D = 7 m/s🎯 aura un d&eacute;placement de 2 km🎯 au lieu de 1 km🎯.</p>
    </div>
  </section>

  <section>
    <h2>🔹 ENVIRONNEMENTS SPÉCIFIQUES</h2>
    <div class="highlight">
      <p><ul>
        </li><strong>SWIM :</strong> Nager vous co&ucirc;te -10🫀 par section et sous l&#39;eau vous perdez -20🌬️ d&#39;oxyg&egrave;ne par section. Sur une jauge de 100🌬️ &agrave; 0, que ce soit en 🫀 ou en 🌬️, c&#39;est la noyade. R&eacute;cup&eacute;rer votre souffle restaure votre jauge d&#39;oxyg&egrave;ne &agrave; &laquo;&nbsp;100%&nbsp;&raquo;.</li><br><br>

</li><strong>MONTAGNE :</strong> Cet environnement double la perte de Heart🫀 si vous &ecirc;tes &agrave; pied, et r&eacute;duit de 50% la vitesse de d&eacute;placement des montures terrestres.</li><br><br>

<li><strong>NEIGE :</strong> Risque de maladie en raison de l&#39;humidit&eacute; (ex : forte fi&egrave;vre, incapacit&eacute; &agrave; combattre, et double perte de 🫀), ainsi que l&#39;effet du froid intense. Vous devez poss&eacute;der un &eacute;quipement adapt&eacute;.</li>
    </p>
    </div></ul>
  </section>

  <section>
    <h2>🔹 CLIMAT, SAISONS ET MÉTÉO</h2>
    <div class="highlight">
      <p>Influencent la survie et l’acc&egrave;s aux ressources.<br>
Par exemple : la surp&ecirc;che ou chasse excessive entra&icirc;ne des esp&egrave;ces en voie de disparition.<br>
Des catastrophes (incendies, inondations, temp&ecirc;tes) peuvent modifier durablement une zone.<br>
Chacun pouvant impacter le gameplay.<br><br></p>
    </div>
  </section>

  <section>
    <h2>🔹 INTERACTIONS & PNJ</h2>
    <div class="highlight">
      <p><strong>RELATIONS &amp; R&Eacute;PUTATION :</strong> Vos actions sociales influencent la mani&egrave;re dont les PNJ r&eacute;agissent.<br>
Ex : un PNJ pourrait alerter les autorit&eacute;s locales si vous &ecirc;tes fugitif ou que vous chassez pour la prime.<br>
Une bonne action vous rapporte +20🙂, une mauvaise action +20😈.<br>
L&#39;interpr&eacute;tation d&#39;une action d&eacute;pend de la vision des PNJ &agrave; votre &eacute;gard.<br>
Vous pouvez avoir une relation intime ou professionnelle avec un PNJ selon ses go&ucirc;ts et pr&eacute;f&eacute;rences.<br><br>

<strong>FACTIONS &amp; COMMERCE :</strong> Cr&eacute;er ou rejoindre une faction permet d&rsquo;obtenir des avantages exclusifs.<br>
Mais cela requiert diff&eacute;rentes &eacute;tapes ou &eacute;v&eacute;nements : gagner la confiance, passer des tests, faire des recrutements, etc.<br>
Ceci est aussi influenc&eacute; par votre r&eacute;putation.<br>
Les prix varient selon l&rsquo;offre et la demande, les guerres ou la raret&eacute; des ressources.<br>
Les March&eacute;s Noirs proposent des objets ill&eacute;gaux, mais co&ucirc;teux et risqu&eacute;s (trahison, complot, etc.).<br><br>

<strong>PNJ DYNAMIQUES :</strong> Chaque PNJ poss&egrave;de une routine et une personnalit&eacute; propre, avec des r&eacute;actions cr&eacute;dibles, le rendant unique.<br>
Ils peuvent alerter les autorit&eacute;s, se d&eacute;fendre, ou faire preuve d&rsquo;intelligence et de combativit&eacute;.<br>
Certains PNJ peuvent influencer l&rsquo;histoire, devenir leaders, trahir ou comploter.<br><br>

<strong>QU&Ecirc;TES &amp; ENQU&Ecirc;TES :</strong> Certaines zones contiennent des myst&egrave;res et dangers n&eacute;cessitant :<br>
- collecte d&rsquo;indices,<br>
- interrogatoires,<br>
- perspicacit&eacute;,<br>
- ou comp&eacute;tences de combat.<br>
Vous y trouverez des pi&egrave;ges et &eacute;v&eacute;nements impr&eacute;vus : sables mouvants, embuscades, hallucinations, ennemis vari&eacute;s avec niveaux, comp&eacute;tences cr&eacute;dibles et impressionnantes.<br><br>

<strong>CYCLE TEMPOREL &amp; M&Eacute;T&Eacute;O :</strong> La journ&eacute;e dure 16 tours. Chaque p&eacute;riode dure 4 tours. Une journ&eacute;e compl&egrave;te repr&eacute;sente 24 heures in-game, avec chaque tour &eacute;quivalant &agrave; 1h30.<br>
- <em>Matin (Tours 5 &agrave; 8 / 06:00 - 12:00)</em> : visibilit&eacute; accrue, PNJ actifs.<br>
- <em>Apr&egrave;s-midi (Tours 9 &agrave; 12 / 12:00 - 18:00)</em> : activit&eacute; marchande, fort ensoleillement.<br>
- <em>Soir&eacute;e (Tours 13 &agrave; 16 / 18:00 - 00:00)</em> : plus dangereuse (monstres, embuscades).<br>
- <em>Nuit (Tours 1 &agrave; 4 / 00:00 - 06:00)</em> : visibilit&eacute; r&eacute;duite (-50% perception).<br><br>

<strong>EFFETS CLIMATIQUES :</strong><br>
🌧️ <strong>Pluie</strong> : taux de coup critique &eacute;lev&eacute;, sol glissant, avantage aux comp&eacute;tences &eacute;lectriques, d&eacute;savantage aux comp&eacute;tences feu.<br>
❄️ <strong>Neige</strong> (moins 30&deg;C) : -20❤️ par tour sans protection, risque de maladie.<br>
🌡️ <strong>Canicule</strong> (plus 40&deg;C) : double perte en 🫀 et en Soif 🍶.<br>
🌪️ <strong>Temp&ecirc;tes</strong> : malus vari&eacute;s (sable, glace, foudre).</p>
    </div>
  </section>

  <section>
    <h2>🔹 CRAFTING ET POSSESSIONS</h2>
    <div class="highlight">
      <p><strong>CONSTRUCTION :</strong> Le crafting vous co&ucirc;te en unit&eacute;s de ressources.<br>
Une surface minimale de 1m&sup2; &eacute;quivaut &agrave; 2 unit&eacute;s, donc 5m&sup2; = 10 unit&eacute;s.<br>
Exemple :<br>
&nbsp;&nbsp;- Sol en bois (5m&sup2;) = 10🪵.<br>
&nbsp;&nbsp;- Mur en pierre (20m&sup2;) = 40🪨.<br><br>

Collectez les ressources n&eacute;cessaires en explorant les lieux ou zones de la carte.<br><br>

<strong>DURABILIT&Eacute; :</strong> Les objets sont class&eacute;s par niveau, ce qui d&eacute;finit leur efficacit&eacute; et durabilit&eacute;.<br>
Toujours pr&eacute;ciser le niveau.<br><br>

Niveau bronze (🥉) : objets classiques (ex : &eacute;p&eacute;e de fer, lance, hache, pioche, etc.), durabilit&eacute; de 100⚙️.<br>
Niveau argent (🥈) : objets r&eacute;sistants faits &agrave; base de m&eacute;taux rares (ex : &eacute;p&eacute;e de mithril, outils dwarven, etc.), durabilit&eacute; de 200⚙️, efficacit&eacute; de 200% par rapport aux outils classiques.<br>
Niveau or (🥇) : objets puissants faits &agrave; base de m&eacute;taux pr&eacute;cieux (ex : &eacute;p&eacute;e en diamant, outils en or, etc.), durabilit&eacute; de 300⚙️, efficacit&eacute; de 300% par rapport aux outils classiques.<br>
Niveau sp&eacute;cial (🏅) : objets particuliers faits &agrave; base de magie, durabilit&eacute; ind&eacute;finie et efficacit&eacute; variable.<br><br>

L&#39;utilisation d&#39;un outil durant une activit&eacute; (affrontement, r&eacute;colte, fuite, etc.) lui fait perdre 10⚙️ de durabilit&eacute; apr&egrave;s l&#39;activit&eacute;.<br>
Lorsque sa durabilit&eacute; atteint 0⚙️, l&#39;outil est inutilisable ou d&eacute;truit.</p>
    </div>
  </section>

  <section>
    <h2>🔹 STATS & SURVIE</h2>
    <div class="highlight">
      <p><strong>BESOINS VITAUX :</strong> La Faim (🍽️) et la Soif (🍶) baissent de -30% tous les 3 tours.<br>
À 0%, la perte de Heart🫀 est doubl&eacute;e et vous risquez de perdre connaissance.<br>
Elles peuvent &ecirc;tre restaur&eacute;es par la consommation d&#39;aliment ou de boisson.<br><br>

<strong>R&Eacute;G&Eacute;N&Eacute;RATION :</strong> La Sant&eacute; (❤️) requiert des soins m&eacute;dicaux ou des techniques adapt&eacute;es.<br>
L&#39;&Eacute;nergie (🌀) se restaure de +20🌀 apr&egrave;s une section d&#39;accumulation.<br>
L&#39;Endurance (Heart) se restaure de +10🫀 apr&egrave;s une section de repos ou immobilit&eacute;.<br><br>

<strong>NOTICE :</strong> Les comp&eacute;tences des joueurs peuvent influencer le syst&egrave;me de jeu.<br>
Par exemple : un joueur avec une technique de r&eacute;g&eacute;n&eacute;ration pourrait soigner ses blessures ou r&eacute;cuperer des points de sant&eacute;.<br>
Un joueur avec une technique de vitesse pourrait se d&eacute;placer plus vite sans overdrive (voir la description de la technique).</p>
    </div>
  </section>

  <section>
    <h2>🔹 RESSOURCES</h2>
    <div class="highlight">
      <p>Les ressources sont class&eacute;es en diff&eacute;rentes cat&eacute;gories avec leurs caract&eacute;ristiques sp&eacute;cifiques, et chaque ressource a des particularit&eacute;s propres.<br>
Vous r&eacute;coltez 1 unit&eacute; de ressource pour 1 tour de r&eacute;colte &agrave; main nue.<br>
Equip&eacute; d&#39;un outil appropri&eacute; (pioche, hache, pelle, etc.), vous r&eacute;coltez 2 unit&eacute;s pour 1 section de r&eacute;colte.<br><br>

<strong>COURANTES :</strong><br>
- <strong>BOIS</strong> (🪵) : Utilis&eacute; pour le crafting de base (meubles, torches, etc.). &Eacute;quipez-vous d&#39;une hache.<br>
- <strong>PIERRE</strong> (🪨) : Mat&eacute;riau de construction et pour fabriquer des outils de base. &Eacute;quipez-vous d&#39;une pioche.<br><br>

<strong>NOURRITURE :</strong><br>
- <strong>FRUITS</strong> (🍎, 🍇, 🍊, 🍓) : Faciles &agrave; r&eacute;colter dans des zones comme les vergers, for&ecirc;ts ou prairies.<br>
Certaines vari&eacute;t&eacute;s peuvent avoir des effets b&eacute;n&eacute;fiques (ex : pomme dor&eacute;e pour r&eacute;g&eacute;n&eacute;rer la sant&eacute;).<br>
- <strong>L&Eacute;GUMES</strong> (🥕, 🥔, 🌽) : Croissent dans des fermes ou champs cultiv&eacute;s.<br>
Les l&eacute;gumes peuvent &ecirc;tre cuisin&eacute;s pour donner des plats plus puissants.<br>
- <strong>VIANDES</strong> (🥩, 🍗) : Provenant d&#39;animaux chass&eacute;s ou d&#39;abattage.<br>
La viande fournit une bonne quantit&eacute; de sant&eacute; mais peut provoquer des effets secondaires (empoisonnement si mal cuite).<br>
- <strong>POISSON</strong> (🐟, 🦑) : Trouv&eacute; dans des zones aquatiques, les poissons ont des bienfaits vari&eacute;s selon les types.<br>
Le poisson peut aussi servir dans des potions aquatiques.<br><br>

<strong>M&Eacute;DICINALES :</strong><br>
- <strong>PLANTES</strong> (🌿, 🌸, 🌻) : Trouv&eacute;es principalement dans les for&ecirc;ts, montagnes ou pr&egrave;s de ruisseaux.<br>
Les plantes m&eacute;dicinales sont utilis&eacute;es dans les potions de gu&eacute;rison et d&#39;am&eacute;lioration.<br>
- <strong>TOXIQUES</strong> (☠️) : Ces plantes peuvent &ecirc;tre utilis&eacute;es pour empoisonner les ennemis ou cr&eacute;er des potions puissantes mais risqu&eacute;es.<br>
- <strong>MAGIQUES</strong> (✨) : Ces herbes poss&egrave;dent des propri&eacute;t&eacute;s magiques et sont utilis&eacute;es dans la cr&eacute;ation de potions ou pour la fabrication d&#39;objets enchant&eacute;s.<br><br>

<strong>MINERAIS ET M&Eacute;TAUX :</strong><br>
Ces ressources sont utilis&eacute;es principalement pour le crafting d&#39;outils, armes et armures.<br>
- <strong>PR&Eacute;CIEUX</strong> (💠) : Tr&egrave;s rares et difficiles &agrave; extraire sans outils adapt&eacute;s (pioche, etc.).<br>
Ces minerais servent &agrave; forger des armes et armures l&eacute;gendaires.<br>
- <strong>RARES</strong> (⚙️) : M&eacute;taux plus r&eacute;sistants et plus l&eacute;gers que les m&eacute;taux ordinaires, recherch&eacute;s pour &eacute;quipements d&#39;&eacute;lite.<br>
- <strong>FER</strong> (🗜️) : Facilement disponible dans les carri&egrave;res, utilis&eacute; pour fabriquer des objets communs (&eacute;p&eacute;es, haches, outils).<br><br>

<strong>ANIMAUX :</strong><br>
Les animaux sont une ressource importante, principalement pour leur viande, peau, fourrure, et parfois leurs capacit&eacute;s magiques.<br>
Ils peuvent &ecirc;tre agressifs ou fuyants si menac&eacute;s.<br>
- <strong>SAUVAGES</strong> (🐺, 🦌, 🦊) : Chass&eacute;s principalement pour leur viande et fourrure.<br>
Certaines esp&egrave;ces peuvent fournir des mat&eacute;riaux magiques ou rares.<br>
- <strong>B&Eacute;TAIL</strong> (🐄, 🐑, 🐔) : Animaux de ferme &eacute;lev&eacute;s pour leur lait, &oelig;ufs, laine et viande.<br>
Essentiels pour les ressources r&eacute;guli&egrave;res.<br>
- <strong>MAGIQUES</strong> (🐉, 🦄) : Cr&eacute;atures rares pouvant &ecirc;tre chass&eacute;es ou apprivois&eacute;es.<br>
Elles fournissent des ressources magiques comme &eacute;cailles, plumes ou griffes, utilis&eacute;es dans des recettes magiques ou artisanat l&eacute;gendaire.</p>
    </div>
  </section>

  <section>
    <h2>🔹 PROGRESSION & RANG</h2>
    <div class="highlight">
      <p>La progression en rang (C, B, A, S, Z) est d&eacute;termin&eacute;e par l&#39;accumulation d&#39;XP.<br>
Chaque rang n&eacute;cessite un nombre d&#39;XP cumul&eacute; sp&eacute;cifique.<br>
La progression en rang permet d&#39;acc&eacute;der &agrave; des comp&eacute;tences et des &eacute;quipements plus puissants.</p>
    </div><br><br>

<strong>COMBATIVIT&Eacute; :</strong> L&#39;augmentation du niveau de combativit&eacute; au sein d&#39;un m&ecirc;me rang permet d&#39;affronter des PNJ plus puissants.<br><br>

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
  <tr>
    <th>Rang</th>
    <th>Niveau</th>
    <th>XP requis</th>
    <th>→</th>
    <th>Rang</th>
    <th>Niveau</th>
    <th>XP requis</th>
    <th>→</th>
    <th>Rang</th>
    <th>Niveau</th>
    <th>XP requis</th>
  </tr>
  <tr>
    <td>C</td><td>Normal</td><td>50-100 XP</td><td>→</td><td>C</td><td>Fort</td><td>100-150 XP</td><td>→</td><td>C</td><td>Extrême</td><td>150-200 XP</td>
  </tr>
  <tr>
    <td>B</td><td>Normal</td><td>100-200 XP</td><td>→</td><td>B</td><td>Fort</td><td>200-300 XP</td><td>→</td><td>B</td><td>Extrême</td><td>300-400 XP</td>
  </tr>
  <tr>
    <td>A</td><td>Normal</td><td>200-400 XP</td><td>→</td><td>A</td><td>Fort</td><td>400-600 XP</td><td>→</td><td>A</td><td>Extrême</td><td>600-800 XP</td>
  </tr>
  <tr>
    <td>S</td><td>Normal</td><td>400-800 XP</td><td>→</td><td>S</td><td>Fort</td><td>800-1200 XP</td><td>→</td><td>S</td><td>Extrême</td><td>1200-1600 XP</td>
  </tr>
  <tr>
    <td>Z</td><td>Normal</td><td>800-1600 XP</td><td>→</td><td>Z</td><td>Fort</td><td>1600-2400 XP</td><td>→</td><td>Z</td><td>Extrême</td><td>2400-3200 XP</td>
  </tr>
</table><br>

<strong>ENTRAÎNEMENT :</strong> L&#39;entra&icirc;nement journalier vous permet de cumuler des XP sans avoir besoin de faire des missions ou combats.<br><br>

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
  <tr>
    <th>Rang</th>
    <th>Durée</th>
    <th>XP</th>
    <th>→</th>
    <th>Rang</th>
    <th>Durée</th>
    <th>XP</th>
    <th>→</th>
    <th>Rang</th>
    <th>Durée</th>
    <th>XP</th>
  </tr>
  <tr>
    <td>C</td><td>2 tours</td><td>100 XP</td><td>→</td><td>C</td><td>4 tours</td><td>200 XP</td><td>→</td><td>C</td><td>8 tours</td><td>300 XP</td>
  </tr>
  <tr>
    <td>B</td><td>4 tours</td><td>200 XP</td><td>→</td><td>B</td><td>8 tours</td><td>400 XP</td><td>→</td><td>B</td><td>12 tours</td><td>600 XP</td>
  </tr>
  <tr>
    <td>A</td><td>6 tours</td><td>400 XP</td><td>→</td><td>A</td><td>8 tours</td><td>800 XP</td><td>→</td><td>A</td><td>16 tours</td><td>1200 XP</td>
  </tr>
  <tr>
    <td>S</td><td>8 tours</td><td>800 XP</td><td>→</td><td>S</td><td>16 tours</td><td>1600 XP</td><td>→</td><td>S</td><td>32 tours</td><td>2400 XP</td>
  </tr>
  <tr>
    <td>Z</td><td>10 tours</td><td>1600 XP</td><td>→</td><td>Z</td><td>20 tours</td><td>3200 XP</td><td>→</td><td>Z</td><td>40 tours</td><td>4800 XP</td>
  </tr>
</table><br>

<strong>LEVELUP :</strong> Lorsque vous atteignez le seuil de XP d&eacute;fini pour votre rang, vous passez au rang sup&eacute;rieur avec des stats am&eacute;lior&eacute;es.<br><br>

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
  <tr>
    <td>C</td><td>1000 XP</td><td>→</td><td>B</td><td>2500 XP</td><td>→</td><td>A</td><td>5000 XP</td>
  </tr>
  <tr>
    <td>S</td><td>10000 XP</td><td>→</td><td>Z</td><td>20000 XP</td><td></td><td></td><td></td>
  </tr>
</table>
  </section>

  <section>
    <h2>⚠️ COMBAT :</h2>
    <div class="highlight">
      <p>Utilise le <strong>système ABM</strong> pour les affrontements dans Origamy World.</p>
    </div>
  </section>
</body>
</html>`;

    const filename = `origamy_system_${randomInt(10000)}.html`;
    writeFileSync(filename, html);

    await zk.sendMessage(dest, {
      document: readFileSync(filename),
      mimetype: 'text/html',
      filename: 'systeme_origamy.html',
      caption: '*🌍 ORIGAMY WORLD – RP AVENTURE*'
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
  <title>YU-GI-OH! SPEED DUEL – GAMEPLAY SRPN</title>
  <style>
  body {
    font-family: 'Segoe UI', sans-serif;
    background-color: #121212;
    color: #f8f8f8;
    padding: 1rem;
    line-height: 1.5;
    font-size: 14px;
  }

  h1, h2, h3 {
    color: #ffe600;
    text-align: center;
    margin: 0.5rem 0;
    font-size: 18px;
  }

  .section {
    margin: 1rem 0;
    padding: 0.75rem 1rem;
    background-color: #1f1f1f;
    border-left: 4px solid #ffcc00;
    border-radius: 4px;
  }

  code {
    background: #333;
    padding: 0.15rem 0.3rem;
    border-radius: 4px;
    font-size: 13px;
  }

  ul {
    padding-left: 1.1rem;
    margin: 0.5rem 0;
  }

  li {
    margin-bottom: 0.3rem;
  }

  .highlight {
    color: #00ffff;
    font-weight: bold;
  }

  .small {
    font-size: 12px;
    opacity: 0.85;
  }
</style>
</head>
<body>
  <h1>🎴 YU-GI-OH! SPEED DUEL 🎴</h1>
  <h2>— GAMEPLAY SRPN —</h2>  <div class="section">
   <p>
    Le Speed Duel est une version simplifi&eacute;e de Yu-Gi-Oh! avec les r&egrave;gles suivantes :
  </p>

  <h3>D&Eacute;BUT DU DUEL</h3>
  <p>
    Chaque joueur pioche 4 cartes pour sa main de d&eacute;part. Le premier joueur ne pioche pas lors de son premier tour.
    Vous pouvez directement jou&eacute; vos cartes en mentionnant comment vous les utiliser (face cach&eacute;, pose, invocation, attaque, etc.).
    Utiliser une carte face cach&eacute;e pour vos actions cach&eacute;es. Certaines cartes ou comp&eacute;tences peuvent &ecirc;tre activ&eacute;es durant le tour adverse
    et les actions cach&eacute;es doivent &ecirc;tre divulgu&eacute;es &agrave; l&#39;arbitre avant leur lancement.
  </p>

  <h3>TERRAIN DE JEU</h3>
  <p>
    Votre terrain de jeu compte 6 sections qui sont :
    le Deck Principal (20 &agrave; 30 cartes), l&#39;Extra Deck (0 &agrave; 5 cartes), le Cimeti&egrave;re,
    la Zone Magie de Terrain, la Zone Monstre (3 max) et la Zone Magies et Pi&egrave;ges (3 max).
  </p>

  <h3>POINTS DE VIE (LP)</h3>
  <p>
    Chaque joueur commence avec 4000 LP. La d&eacute;faite survient si les LP tombent &agrave; z&eacute;ro ou si le joueur ne peut plus piocher de cartes.
  </p>

  <h3>EXTRA DECK</h3>
  <p>
    Contient les Monstres Fusion (cartes violettes, comme &quot;Dragon Mill&eacute;naire&quot;). Il peut contenir entre 0 et 5 cartes.
  </p>

  <h3>MAIN DECK</h3>
  <p>
    Doit contenir entre 20 et 30 cartes. Les cartes doivent &ecirc;tre m&eacute;lang&eacute;es avant le duel.
    Maximum 3 exemplaires de la m&ecirc;me carte.
  </p>

  <h3>CARTE COMP&Eacute;TENCE</h3>
  <p>
    Chaque joueur choisit une carte comp&eacute;tence face cach&eacute;e avant le duel.
  </p>

  <h3>TOUR DE JEU</h3>
  <p>
    Piocher une carte, puis poser des Pi&egrave;ges, jouer des Magies et invoquer un monstre dans l&#39;ordre souhait&eacute;. Ensuite, le joueur peut attaquer.
  </p>

  <h3>INVOCATION ET POSE</h3>
  <ul>
    <li>Invoquer un monstre en Position d&#39;Attaque (verticale) ou le Poser face verso en Position de D&eacute;fense (horizontale).</li>
    <li>Le nombre d&#39;&eacute;toiles indique le niveau :</li>
    <ul>
      <li>Niveau 1 &agrave; 4 : Pas de tribut.</li>
      <li>Niveau 5 et 6 : 1 tribut.</li>
      <li>Niveau 7 ou plus : 2 tributs.</li>
      <li>Les Invocations Sp&eacute;ciales ne n&eacute;cessitent pas de tributs.</li>
    </ul>
  </ul>

  <h3>CARTES MAGIE ET PI&Egrave;GE</h3>
  <p>
    Les Magies peuvent &ecirc;tre jou&eacute;es directement depuis la main. Les Magies de Terrain sont plac&eacute;es dans la Zone Terrain.
    Les Magies et Pi&egrave;ges d&#39;&Eacute;quipement restent en jeu. Les autres vont au cimeti&egrave;re.
  </p>

  <h3>CARTES PI&Egrave;GE</h3>
  <p>
    Doivent &ecirc;tre pos&eacute;es face verso et ne peuvent pas &ecirc;tre activ&eacute;es le tour o&ugrave; elles sont pos&eacute;es, sauf indication contraire.
    Elles vont au cimeti&egrave;re apr&egrave;s usage.
  </p>

  <h3>PHASE DE COMBAT</h3>
  <p>
    Chaque monstre en Position d&#39;Attaque peut attaquer une fois par tour. Si l&#39;adversaire n&#39;a pas de monstre, les LP peuvent &ecirc;tre attaqu&eacute;s directement.<br>
    Si un monstre face verso est attaqu&eacute;, il est retourn&eacute; face recto. Si le monstre attaqu&eacute; survit, il reste face recto en Position de D&eacute;fense.<br>
    Aucun LP n&#39;est perdu si la DEF du monstre attaqu&eacute; est sup&eacute;rieure &agrave; l&#39;ATK du monstre attaquant.
  </p>
  </div>  <div class="section">
  <h2>1. <strong>PR&Eacute;PARATION DU DUEL</strong></h2>
  <ul>
    <li>Chaque joueur choisit son deck via <code>.deck [nom]</code>. <em>Ex :</em> ~deck yami, ~deck kaiba, etc.</li>
    <li>Le duel se joue sous la supervision d&rsquo;un arbitre (<em>modo</em>).</li>
    <li>Chaque joueur commence avec <strong>4 cartes en main</strong>.</li>
  </ul>

  <h2>2. <strong>D&Eacute;ROULEMENT DU TOUR</strong></h2>
  <ul>
    <li>Le joueur divise ses actions en 3 pav&eacute;s, correspondant aux phases du tour.</li>
    <li>Apr&egrave;s chaque pav&eacute;, il attend la validation de l&rsquo;arbitre et une &eacute;ventuelle r&eacute;action de l&rsquo;adversaire (cartes pi&egrave;ge, contre, etc.).</li>
  </ul>

  <h3>&#128221; Structure du Tour &#128221;</h3>

  <h4>Phase 1 : Pioche &amp; Main Phase 1</h4>
  <p>Je pioche une carte.<br>
  J&rsquo;invoque [Monstre] en mode [Position].<br>
  Je pose 1 carte face cach&eacute;e.</p>
  <p><em>➡️ Attendre la validation ou interruption avant de continuer.</em></p>

  <h4>Phase 2 : Battle Phase</h4>
  <p>[Monstre] attaque [Monstre adverse ou Joueur].<br>
  Dommages : [si calcul connu]</p>
  <p><em>➡️ Attendre la validation ou interruption.</em></p>

  <h4>Phase 3 : Main Phase 2 &amp; End Phase</h4>
  <p>Je pose une carte magie face cach&eacute;e.<br>
  Fin de mon tour.</p>

  <h2>3. <strong>CARTES FACE CACH&Eacute;E &amp; EFFETS</strong></h2>
  <ul>
    <li>Toute carte pos&eacute;e face cach&eacute;e (magie/pi&egrave;ge) doit &ecirc;tre d&eacute;clar&eacute;e en priv&eacute; &agrave; l&rsquo;arbitre :</li>
  </ul>
  <p><code>Carte pos&eacute;e :</code> Les 7 Outils du Bandit<br>
  <code>Effet :</code> Annule une carte pi&egrave;ge (co&ucirc;t 1000 LP)</p>
  <p><strong>Lors de son activation :</strong><br>
  &ldquo;J&rsquo;active ma carte pi&egrave;ge pos&eacute;e T1.&rdquo;<br>
  <em>➡️ L&rsquo;arbitre confirme l&rsquo;effet.</em></p>

  <h2>4. <strong>INTERRUPTIONS &amp; R&Eacute;ACTIONS</strong></h2>
  <p>L&rsquo;adversaire peut r&eacute;agir entre chaque phase.<br>
  <strong>Pour cela, il annonce :</strong><br>
  &ldquo;Je r&eacute;agis avec une carte pi&egrave;ge/magie/effet.&rdquo;<br>
  Ensuite, il d&eacute;crit l&rsquo;effet ou contacte l&rsquo;arbitre si c&rsquo;est une carte pos&eacute;e face cach&eacute;e.</p>

  <h2>5. <strong>R&Egrave;GLES DE BASE</strong></h2>
  <ul>
    <li>1 seule invocation normale par tour (hors effets sp&eacute;ciaux).</li>
    <li>Limite : 3 actions majeures par tour (ex : invocation + attaque + carte pos&eacute;e).</li>
    <li>Tous les effets doivent &ecirc;tre clairement expliqu&eacute;s &agrave; l&rsquo;arbitre.</li>
    <li>Respecter les phases, le rythme, et l&rsquo;arbitre.</li>
  </ul>

  <h2>6. <strong>COMMANDES UTILES</strong></h2>
  <ul>
    <li><code>~deck</code> : Voir les decks disponibles</li>
    <li><code>~deck [Nom]</code> : Choisir un deck</li>
    <li><code>~carte</code> : Voir toutes les cartes du jeu</li>
    <li><code>~carte [Nom]</code> : Afficher la carte</li>
  </ul>

  <h3>&#128221; Modèle de Tour &#128221;</h3>

<strong>Phase 1 :</strong>
<p><strong>YUGI :</strong><br>
Je pioche une carte !<br>
J’invoque <strong>Axe Raider</strong> (★★★ [ATK: 1700 / DEF: 1000]) en Position d'Attaque.<br>
Je pose 1 carte Magie/Piège face cachée.</p>

<em>(Kaiba ne réagit pas. La phase continue.)</em>

<strong>Phase 2 :</strong>
<p>J’attaque <strong>Soldat du Lustre Noir</strong> (★★★ [ATK: 1600]) avec <strong>Axe Raider</strong> !<br>
<strong>Dommages :</strong> 1700 - 1600 = <strong>100 points</strong> de dégâts à Kaiba.</p>

<em>(Kaiba serre les dents mais ne contre pas.)</em>

<strong>Phase 3 :</strong>
<p>J’active ma carte Magie face cachée : <strong>Équipement Éclair</strong> !<br>
<strong>Axe Raider</strong> gagne 500 ATK jusqu'à la End Phase (1700 → 2200).<br>
Fin de mon tour.</p>
  </div></body>
</html>`;

        const filename = `yugioh_system_${randomInt(10000)}.html`;
        writeFileSync(filename, html);

        await zk.sendMessage(dest, {
            document: readFileSync(filename),
            mimetype: 'text/html',
            filename: 'yugioh_system.html',
            caption: '*🎴 C\'EST L\'HEURE DU DU...DU...DU...DUEL !*'
        }, { quoted: ms });

        unlinkSync(filename);
    }
);

// Commande pour envoyer le système Speed Rush en HTML
zokou(
    { nomCom: 'sr_system', categorie: 'SPEED-RUSH' },
    async (dest, zk, commandeOptions) => {
        const { ms } = commandeOptions;

        const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>SPEED RUSH SYSTEM – SRPN</title>
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
            caption: '*🏎️ SPEED RUSH – RP COURSE*'
        }, { quoted: ms });

        unlinkSync(filename);
    }
);