# ESI'POINTS — application installable (PWA)

Même montage que les applications **Notes ESIROI** : une coque statique hébergée
sur GitHub Pages, qui affiche l'application Apps Script en plein écran et que les
navigateurs reconnaissent comme installable.

Fonctionne sur **iPhone, iPad, Android, Windows et Mac**, sans passer par aucune
boutique d'applications, sans compte développeur et sans frais.

---

## 1. Comment cela fonctionne

| Fichier | Rôle |
|---|---|
| `index.html` | La coque : écran de démarrage, plein écran, gestion hors ligne |
| `manifest.webmanifest` | Nom, icônes, couleurs — c'est lui qui rend l'application installable |
| `sw.js` | Service worker : met en cache la coque, jamais les ESI'Points |
| `icones/` | Icônes 192, 512, masquable, Apple, logo de démarrage — pastille **EP** |

Les ESI'Points ne sont **jamais** mis en cache : ils sont toujours chargés en
direct depuis Apps Script. Le cache ne concerne que l'habillage.

**Rien à modifier dans le code Apps Script.** L'application publie déjà
`setXFrameOptionsMode(ALLOWALL)`, ce qui autorise son affichage dans la coque.

---

## 2. Une différence importante avec Notes

Notes est déployée en accès **anonyme** : n'importe qui ouvrant le lien voit
l'application, et l'identification se fait autrement.

ESI'POINTS, non. L'application doit **savoir qui est connecté** — c'est ce qui
lui permet de reconnaître l'élève, de retrouver sa classe et ses points sans
qu'il ait à saisir quoi que ce soit. Le déploiement est donc restreint au
domaine, et deux conséquences en découlent.

**L'adresse par défaut n'est pas la même.** La coque utilise d'emblée la forme
`script.google.com/a/macros/univ-reunion.fr/…`, celle qui déclenche
l'identification. Ne la remplace pas par la forme anonyme : l'application ne
saurait plus qui lui parle.

**Le cadre peut rester blanc sur certains appareils.** Safari, et Chrome de plus
en plus, bloquent les cookies tiers : à l'intérieur d'un cadre venant d'un autre
site, Google ne peut alors pas reconnaître la personne. D'où la barre de secours,
enrichie par rapport à celle de Notes :

| Bouton | Ce qu'il fait |
|---|---|
| **Compte personnel** | Force `univ-reunion.fr` — le réglage par défaut |
| **Compte élève** | Force `co.univ-reunion.fr`, si les élèves relèvent d'un annuaire distinct |
| **Compte 1 / 2 / 3** | Force le 1er, 2e ou 3e compte Google connecté sur l'appareil |
| **Ouvrir dans le navigateur** | Quitte le cadre et ouvre l'application en premier plan |

Le dernier bouton est le filet de sécurité : **hors cadre, l'identification
fonctionne toujours**, sur tous les navigateurs. Le choix qui marche est mémorisé
sur l'appareil, l'utilisateur ne le refait pas.

Dis-le aux promotions en une phrase : *« si l'écran reste blanc, touchez
« Page blanche ? » en bas à droite, puis « Ouvrir dans le navigateur ». »*

---

## 3. L'adresse de l'application — déjà renseignée

`index.html` porte déjà l'adresse du déploiement en cours :

```js
var URL_APPLICATION = 'https://script.google.com/a/univ-reunion.fr/macros/s/AKfycbwOi…/exec';
```

**Peu importe la forme** sous laquelle Google te la donne : la coque en extrait
l'identifiant de déploiement (le segment entre `/s/` et `/exec`) et fabrique
elle-même les autres variantes. Les trois écritures sont acceptées :

```
script.google.com/macros/s/<ID>/exec
script.google.com/a/macros/<domaine>/s/<ID>/exec
script.google.com/a/<domaine>/macros/s/<ID>/exec
```

Si un jour tu redéploies sous une **nouvelle** adresse, il suffit de coller la
nouvelle valeur à la place, sans t'occuper de sa forme.

Tant que la valeur n'est pas remplacée, la coque affiche un message qui le dit,
plutôt qu'un cadre vide inexplicable.

---

## 4. Mise en ligne — indispensable

Une application installable exige une adresse en **HTTPS**. Ouvrir `index.html`
par un double-clic ne suffit pas : le service worker sera refusé.

### Le plus simple : ajouter au dépôt qui héberge déjà Notes

GitHub Pages y est déjà actif, il n'y a donc rien à configurer.

1. Ouvre le dépôt `notes-esiroi` sur **github.com**.
2. **Add file → Upload files**, et glisse-dépose le dossier `ESIPOINTS`
   (icônes comprises) à la racine.
3. **Commit changes**.

Au bout de quelques minutes, l'adresse est :

```
https://<compte>.github.io/notes-esiroi/ESIPOINTS/
```

L'adresse des applications Notes déjà installées **ne change pas** — c'est la
raison de ne pas renommer ni réorganiser le dépôt existant : une application
installée pointe sur son adresse, et la déplacer casserait toutes les icônes
déjà posées sur les téléphones.

### Si tu préfères un dépôt séparé

Crée un dépôt public `esipoints-esiroi`, dépose-y le **contenu** du dossier
`ESIPOINTS` (et non le dossier lui-même), puis **Settings → Pages**, branche
`main`, dossier `/ (root)`. L'adresse devient
`https://<compte>.github.io/esipoints-esiroi/`.

### En ligne de commande, si tu as Git installé

```bash
git clone https://github.com/<compte>/notes-esiroi.git
cd notes-esiroi
cp -r /chemin/vers/ESIPOINTS .
git add ESIPOINTS
git commit -m "Ajout de l'application ESI'POINTS"
git push
```

### À terme

Le service informatique de l'université peut héberger ces fichiers sur un
serveur institutionnel. C'est préférable : l'adresse serait alors en
`univ-reunion.fr`, plus rassurante pour les étudiants. GitHub Pages permet de
démarrer immédiatement en attendant.

---

## 5. Installation par les utilisateurs

### iPhone et iPad
Ouvrir l'adresse **dans Safari** (obligatoire, Chrome iOS ne le permet pas),
toucher **Partager**, puis **Sur l'écran d'accueil**.

### Android
Ouvrir l'adresse dans Chrome. Une bannière **Installer l'application** apparaît,
ou via le menu ⋮ → **Installer l'application**.

### Windows et Mac
Ouvrir l'adresse dans Chrome ou Edge. Une icône d'installation apparaît dans la
barre d'adresse, à droite. L'application obtient sa propre fenêtre et son entrée
dans le menu Démarrer.

---

## 6. Mises à jour

Rien à republier. Toute modification de l'application Apps Script est visible
immédiatement par tous les utilisateurs, sur toutes les plateformes — à condition
d'avoir redéployé en **Gérer les déploiements → Nouvelle version**, ce qui
conserve l'adresse.

Si tu modifies la **coque** elle-même (`index.html`, icônes, couleurs),
incrémente le numéro de version en tête de `sw.js` :

```js
const CACHE = 'esiroi-esipoints-v1.3';   // 1.2 → 1.3
```

Sans cela, les navigateurs continueraient de servir l'ancienne coque.

---

## 7. Points de vigilance

- Si tu **redéploies** l'application Apps Script avec une nouvelle URL, il faut
  la reporter dans `index.html`, variable `URL_APPLICATION`. Passer par
  « Gérer les déploiements → Nouvelle version » évite ce problème : l'URL reste
  identique.
- Sur iPhone, l'application installée s'ouvre sans barre d'adresse, mais iOS
  limite certaines fonctions par rapport à Android — l'impression du bilan par
  classe peut ouvrir un onglet Safari plutôt que la boîte d'impression.
- Les élèves sont sur `co.univ-reunion.fr`, les personnels sur
  `univ-reunion.fr`. Si les deux domaines ne relèvent pas du même compte Google
  Workspace, les élèves seront bloqués par Google **avant** que la coque
  n'entre en jeu. Un essai avec un vrai compte élève, en navigation privée,
  lève le doute en deux minutes.

---

*ESIROI — Université de La Réunion*
*Édité par Jean-Jacques KADJO — Direction des études*
