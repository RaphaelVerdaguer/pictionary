# Etat des lieux et plan de refonte Pictionary

## Resume executif

Le projet est une application statique HTML/CSS/JavaScript composee de deux experiences principales :

- `board/` : plateau de jeu, selection des joueurs, lancer de de et deplacement des pions.
- `card/` : tirage de cartes, affichage des categories et minuteur.

Le depot est actuellement sur `develop`, avec une branche stable `main` et plusieurs branches distantes `feature/*`. Il n'y a pas de `package.json`, pas de tooling identifie, pas de tests automatises et pas de pipeline de qualite local.

La refonte recommandee doit rester pragmatique : conserver une application statique simple, mais reorganiser le code autour de regles pures testables, d'une couche applicative lisible, d'adaptateurs DOM/audio/JSON explicites et d'une UI plus professionnelle, responsive et accessible.

## Etat des lieux

### GitFlow

- Les branches `main` et `develop` existent.
- `develop` est la branche active et suit `origin/develop`.
- Des branches distantes `feature/board`, `feature/cards`, `feature/dice`, `feature/draw`, `feature/move_player` et `feature/player` existent deja.
- La refonte doit partir de `develop` sur une branche dediee, par exemple `feature/audit-clean-architecture-ui-ux`.
- `main` doit rester la branche stable ; les changements doivent passer par `develop`, puis par une release lorsque la refonte est validee.

### Architecture actuelle

- `board/script.js` melange l'etat du jeu, les regles de deplacement, la manipulation DOM, les prompts utilisateur, les logs et les handlers d'evenements.
- `card/script.js` melange chargement JSON, tirage aleatoire, timer, audio, manipulation DOM et logique de flip.
- Les regles metier ne sont pas isolees : deplacement, rebond en fin de plateau, tirage de carte, timer et selection du joueur dependent directement du DOM.
- `board/index.html` contient les 55 cases du plateau en dur, ce qui rend les changements de parcours couteux et fragiles.
- `card/index.html` contient aussi les 55 cases miniatures en dur.
- `board/index.html` importe `../card/styles.css`, ce qui couple l'ecran plateau a l'ecran carte.

### Clean Code

- Plusieurs variables globales pilotent l'etat (`currentPlayer`, `currentPlayersPositions`, `currentDiceResult`, `numberOfPlayers`, `categories`, `timer`, etc.).
- `computeNewPosition(start, target, max = 54)` declare un parametre `start` inutilise.
- `beepInterval` est declare dans `card/script.js`, puis nettoye dans `resetDrawButton`, mais il n'est jamais initialise.
- `Audio.prototype.stop` est modifie globalement, ce qui cree un effet de bord inutile sur l'API native.
- `card/flipCard.js` duplique une logique deja presente dans `card/script.js`.
- Certains commentaires decrivent directement la ligne suivante au lieu d'expliquer une intention ou une contrainte.
- Les identifiants et textes melangent francais, anglais et abreviations (`drawButton`, `topComment`, `Start`, `Finish`, `P, L, A`).

### UI/UX et accessibilite

- Le nombre de joueurs est demande via `prompt`, avec validation via `alert`. Ce flux est bloquant, peu mobile-friendly et peu professionnel.
- Le de, les pions, les cases et la carte sont principalement des `div`/`span` cliquables sans semantique de bouton.
- Les interactions clavier ne sont pas clairement prises en charge.
- L'etat courant de la partie n'est pas explicite : joueur actif, derniere valeur du de, position et prochaine action ne sont pas presentes dans une zone d'information dediee.
- Le timer de carte est porte par le texte du bouton, ce qui melange action et etat.
- Les erreurs de chargement des categories restent dans la console au lieu d'etre visibles par l'utilisateur.
- Le responsive repose surtout sur l'orientation et des tailles en `vh`/`vw`; il manque une adaptation fine mobile, tablette et desktop.
- Les styles sont repartis entre fichiers sans systeme visuel commun clair : tokens, composants, etats, focus, espacements.

### Robustesse et maintenance

- Le chargement des categories utilise `XMLHttpRequest` alors que `fetch` serait plus lisible pour ce cas.
- Le format de `categories.json` n'est pas valide explicitement avant utilisation.
- Les timers et `setTimeout` ne sont pas centralises, ce qui peut provoquer des effets inattendus si l'utilisateur clique rapidement.
- Les animations de flip et le timer ne sont pas synchronises par un etat applicatif clair.
- Les erreurs utilisateur et systeme ne sont pas remontees dans l'interface.

## Plan de refonte

### 1. Workflow GitFlow

1. Partir de `develop` a jour.
2. Creer `feature/audit-clean-architecture-ui-ux`.
3. Realiser la refonte par increments courts :
   - documentation et audit ;
   - extraction des regles pures ;
   - refonte structurelle HTML/JS ;
   - refonte UI/UX ;
   - outillage et tests.
4. Fusionner dans `develop` apres revue et validation manuelle.
5. Creer une release vers `main` quand `develop` est stable.

### 2. Clean Architecture legere

Conserver une app statique, mais separer les responsabilites :

- `domain/` : fonctions pures pour les joueurs, positions, de, categories, timer et contraintes du plateau.
- `application/` : cas d'usage tels que initialiser une partie, choisir le nombre de joueurs, lancer le de, changer de joueur, deplacer un pion, tirer une carte et demarrer une manche.
- `infrastructure/` : chargement de `categories.json`, gestion audio, stockage local eventuel.
- `ui/` : rendu DOM, composants plateau, carte, timer, controles et messages d'etat.

Cette organisation doit permettre de tester les regles sans navigateur et de limiter les effets de bord aux adaptateurs.

### 3. Clean Code

- Remplacer les variables globales par un etat centralise explicite, par exemple `gameState` pour le plateau et `cardState` pour les cartes.
- Extraire les fonctions pures :
  - calcul de position avec rebond ;
  - tirage de de ;
  - tirage aleatoire par categorie ;
  - validation des categories ;
  - calcul du statut de timer.
- Generer les cases du plateau et du mini-plateau depuis une configuration unique des 55 positions.
- Remplacer `XMLHttpRequest` par `fetch` avec gestion de `loading`, `success` et `error`.
- Supprimer l'extension de `Audio.prototype` et utiliser une fonction locale `stopAudio(audio)`.
- Supprimer `card/flipCard.js` ou le transformer en module partage sans duplication.
- Normaliser le vocabulaire des fonctions et du texte visible.
- Garder les commentaires uniquement pour les decisions non evidentes.

### 4. UI/UX professionnelle

- Remplacer `prompt` par un panneau ou une modale de configuration :
  - choix 2, 3 ou 4 joueurs ;
  - couleurs visibles ;
  - bouton de demarrage ;
  - validation inline.
- Transformer les elements interactifs en boutons semantiques ou leur ajouter les attributs ARIA necessaires quand un bouton natif n'est pas possible.
- Ajouter une zone d'etat du plateau :
  - joueur actif ;
  - derniere valeur du de ;
  - position du joueur actif ;
  - action attendue.
- Ajouter une zone d'etat des cartes :
  - etat de chargement ;
  - temps restant ;
  - erreur visible si les cartes ne chargent pas ;
  - action de relance.
- Ajouter des etats visuels coherents : hover, focus visible, active, disabled, erreur, chargement.
- Stabiliser le responsive :
  - mobile portrait : plateau lisible et controles sous le plateau ;
  - tablette : plateau et panneau d'etat cote a cote si possible ;
  - desktop : mise en page plus dense, sans surdimensionner les cartes.
- Introduire des variables CSS communes pour couleurs, typographie, espacements, rayons, ombres, transitions et tailles de controles.
- Conserver l'identite Pictionary avec des couleurs franches, mais ameliorer les contrastes et la lisibilite.

### 5. Qualite et tests

- Ajouter un outillage minimal si la refonte code est lancee :
  - formatage ;
  - lint JavaScript ;
  - tests unitaires des fonctions pures.
- Tester en priorite :
  - position normale et rebond sur la case finale ;
  - lancer de de borne entre 1 et 6 ;
  - selection de 2 a 4 joueurs ;
  - tirage d'une carte avec toutes les categories ;
  - erreur de chargement de `categories.json` ;
  - fin de timer et reactivation du bouton ;
  - navigation clavier sur les controles principaux.
- Realiser une verification manuelle sur `board/index.html` et `card/index.html` en mobile et desktop.

## Priorites recommandees

### Priorite 1 - Securiser la base

- Creer la branche GitFlow de refonte.
- Introduire une configuration de plateau unique.
- Extraire les regles pures du plateau et des cartes.
- Supprimer les duplications evidentes et les globals les plus risqués.

### Priorite 2 - Rendre l'experience utilisable

- Remplacer `prompt`/`alert` par une UI de configuration.
- Ajouter les zones d'etat et les messages d'erreur visibles.
- Rendre les controles accessibles au clavier.
- Clarifier le flux joueur actif -> lancer -> deplacement -> carte.

### Priorite 3 - Professionnaliser l'interface

- Mettre en place les tokens CSS.
- Harmoniser plateau, carte, bouton, timer et etats.
- Verifier les contrastes et la lisibilite.
- Ajuster les layouts responsive.

### Priorite 4 - Installer une qualite durable

- Ajouter tests unitaires sur les fonctions pures.
- Ajouter lint/format.
- Documenter le workflow de contribution.
- Preparer une release depuis `develop` vers `main`.

## Criteres d'acceptation de la refonte

- Le comportement actuel reste disponible : plateau, deplacement des joueurs, lancer de de, tirage de cartes, timer et beep.
- Les regles principales sont testables sans DOM.
- Le plateau et le mini-plateau ne dupliquent plus les 55 cases en HTML statique.
- Le nombre de joueurs se choisit dans une interface non bloquante.
- Les erreurs de chargement sont visibles et actionnables.
- Les controles principaux sont utilisables au clavier.
- Les styles partagent un design system minimal.
- La branche de refonte est fusionnee dans `develop` avant toute release vers `main`.

## Hors perimetre de cette etape documentaire

- Ne pas modifier le comportement applicatif.
- Ne pas reorganiser les fichiers JavaScript ou CSS.
- Ne pas introduire de dependances.
- Ne pas ajouter de build system.

## Verification documentaire

Ce document couvre :

- l'etat des lieux ;
- les risques principaux ;
- le plan GitFlow ;
- le plan Clean Architecture ;
- le plan Clean Code ;
- le plan UI/UX professionnel ;
- les priorites ;
- les criteres d'acceptation ;
- les tests a prevoir.
