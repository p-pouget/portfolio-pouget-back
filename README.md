# Portfolio Pierre Pouget — Backend (`portfolio-pouget-back`)

Projet fullstack développé dans le cadre de la formation **Développeur Web et Web Mobile** à La Fabrique du Numérique Paloise (2026), présenté comme projet fil rouge pour l'obtention du titre professionnel.

L'application est découpée en trois dépôts distincts :

| Dépôt                    | Rôle                                     |
| ------------------------ | ---------------------------------------- |
| `portfolio-pouget-p`     | Frontend public — vitrine et contact     |
| `portfolio-pouget-back`  | API REST — logique métier et persistance |
| `portfolio-pouget-admin` | Back-office — administration du contenu  |

## Stack technique

**Frontend public** (`portfolio-pouget-p`)
React 19 · React Router v7 · Tailwind CSS v4 · React Toastify · Vite 8

**Backend** (`portfolio-pouget-back`)
Node.js · Express 5 · MongoDB / Mongoose · JWT (cookie httpOnly) · bcrypt · Nodemailer · Helmet · CORS · dotenv

**Back-office** (`portfolio-pouget-admin`)
React 19 · React Admin v5 · ra-data-simple-rest · Vite 8

## Architecture

Authentification par cookie httpOnly avec JWT — pas de token en localStorage. Le back-office communique exclusivement avec les routes protégées `/api/admin`, le frontend public avec les routes ouvertes `/api`.

---

## À propos de ce dépôt

API REST construite avec Express 5 et MongoDB. Elle expose les données du portfolio (hero, curriculum, projets, mail de contact), gère l'authentification de l'unique administrateur et l'envoi des messages du formulaire de contact.

L'API distingue deux familles de routes :

- les routes publiques `/api/...`, en lecture seule, consommées par le frontend ;
- les routes protégées `/api/admin/...`, en écriture, consommées par le back-office après authentification.

## Stack

- **Express 5** — serveur HTTP et routage
- **Mongoose 9 / MongoDB** — modélisation et persistance
- **jsonwebtoken** — génération et vérification du JWT
- **bcrypt** — hachage du mot de passe administrateur
- **cookie-parser** — lecture du cookie httpOnly
- **Helmet** — en-têtes HTTP de sécurité
- **CORS** — restriction d'origine au front public et au back-office
- **Nodemailer** — envoi des mails du formulaire de contact
- **dotenv** — chargement des variables d'environnement

## Structure du projet

```
portfolio-pouget-back/
├── middlewares/
│   └── auth.middleware.js        # Vérification du JWT (cookie)
├── models/
│   ├── curriculum.model.js
│   ├── hero.model.js
│   ├── mail.model.js
│   ├── projets.model.js
│   └── user.model.js
├── routes/
│   ├── auth.route.js             # Login
│   ├── admin.utils.route.js      # Logout + ping token
│   ├── contact.route.js          # Envoi formulaire de contact
│   ├── hero.route.js             # Lecture publique + lecture admin
│   ├── admin.hero.route.js       # Écriture admin
│   ├── curriculum.route.js
│   ├── admin.curriculum.route.js
│   ├── mail.route.js
│   ├── admin.mail.route.js
│   ├── projets.route.js
│   └── admin.projets.route.js
├── scripts/
│   └── seed-admin.js             # Création de l'admin unique
├── .env.example
├── server.js                     # Point d'entrée
└── package.json
```

## Modèle de données

| Modèle       | Particularité                                                              |
| ------------ | -------------------------------------------------------------------------- |
| `User`       | Administrateur unique. Mot de passe haché (bcrypt).                        |
| `Hero`       | Document unique (singleton). Titre, valeurs, description.                  |
| `Curriculum` | Document unique. Tableaux d'expériences et formations, compétences, photo. |
| `Projet`     | Collection classique. Champ `selected` pour la mise en avant.              |
| `Mail`       | Document unique. Adresse de contact affichée.                              |

Les documents singletons (`Hero`, `Curriculum`, `Mail`) exposent un champ virtuel `id` calculé à partir de `_id` pour rester consommables par React Admin.

## Authentification

Le login vérifie l'identifiant et le mot de passe (bcrypt), signe un JWT et le dépose dans un cookie **httpOnly** d'une durée de 2 h. Le navigateur le renvoie automatiquement sur les routes protégées.

Le middleware `auth.middleware.js` est appliqué en tête de chaque routeur `admin.*` : il lit le cookie, vérifie le token et refuse l'accès (401) en cas d'absence ou d'expiration.

Le drapeau `secure` du cookie est piloté par la variable `SECURE_COOKIE` (à `true` en production sur HTTPS, absent en développement).

## Variables d'environnement

Copier `.env.example` en `.env` et renseigner :

| Variable         | Rôle                                                  |
| ---------------- | ----------------------------------------------------- |
| `PORT`           | Port d'écoute (défaut : 3050)                         |
| `MONGO_URI`      | Chaîne de connexion MongoDB                           |
| `CLIENT_URL`     | Origine autorisée du frontend public (CORS)           |
| `ADMIN_URL`      | Origine autorisée du back-office (CORS)               |
| `JWT_SECRET`     | Clé de signature du JWT                               |
| `SECURE_COOKIE`  | `true` en production (HTTPS), absent en développement |
| `ADMIN_USERNAME` | Nom de l'administrateur à créer (seed)                |
| `ADMIN_EMAIL`    | Email de l'administrateur (seed)                      |
| `ADMIN_PASSWORD` | Mot de passe en clair, haché au seed                  |
| `GMAIL_ADRESS`   | Adresse Gmail expéditrice/réceptrice du formulaire    |
| `GMAIL_PASS`     | Mot de passe d'application Gmail                      |

Génération d'un `JWT_SECRET` :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Installation et lancement

```bash
# Installation
npm install

# Création de l'administrateur (une fois la BDD configurée)
npm run seed

# Développement (rechargement automatique via nodemon)
npm run dev

# Production (seed automatique puis démarrage du serveur)
npm start
```

Le script `start` enchaîne `seed-admin.js` puis `server.js` : le seed ne recrée pas l'admin s'il existe déjà, ce qui rend la commande sûre à chaque déploiement.

## Points d'attention

- **Documents uniques.** Hero, Curriculum et Mail sont des singletons. Les routes admin utilisent `findOneAndUpdate({}, ...)` pour cibler l'unique document, et renvoient un `id` factice (celui du document) afin que React Admin mette son cache à jour. La suppression y est volontairement interdite (405).
- **Sous-documents Curriculum.** Expériences et formations sont des tableaux gérés via les opérateurs MongoDB `$push`, `$pull`, `$set`.
- **En-tête `Content-Range`.** Les routes de liste exposent cet en-tête, requis par le `dataProvider` de React Admin pour la pagination.
- **Ordre des routes.** Les routes fixes sont toujours déclarées avant les routes dynamiques (`:id`), Express prenant la première correspondance.
