<div align="center">
  <h1>Smart Hotel API</h1>

  <h3>Une API RESTful réalisée avec Express pour le projet Smart Hotel</h3>

  <h4>
    <a href="https://github.com/alexwauquier/smart-hotel-api/blob/main/README.md">English README</a>
    •
    <a href="#aperçu-du-projet">Aperçu du Projet</a>
    •
    <a href="#pour-commencer">Pour Commencer</a>
    •
    <a href="#routes-disponibles">Routes Disponibles</a>
  </h4>

  <img src="https://img.shields.io/github/v/release/alexwauquier/smart-hotel-api?label=version" />
</div>

## Table des Matières

- [Table des Matières](#table-des-matières)
- [Aperçu du Projet](#aperçu-du-projet)
- [Technologies Utilisées](#technologies-utilisées)
- [Pour Commencer](#pour-commencer)
  - [Exigences](#exigences)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Exécuter l'API Localement](#exécuter-lapi-localement)
  - [Base de Données de Développement avec Docker](#base-de-données-de-développement-avec-docker)
- [Routes Disponibles](#routes-disponibles)
  - [Authentification](#authentification)
  - [Clients](#clients)
  - [Employés](#employés)
  - [Types d'Employés](#types-demployés)
  - [Produits](#produits)

## Aperçu du Projet

L'API Smart Hotel est le backend de l'[application mobile](https://github.com/alexwauquier/smart-hotel-mobile-app) et de l'[application web](https://github.com/alexwauquier/smart-hotel-web-app) du projet Smart Hotel, un projet de deuxième année en cybersécurité, informatique et réseaux. Elle est conçue pour gérer les commandes du bar et les capteurs environnementaux d'un l'hôtel.

## Technologies Utilisées

- **Node.js**
- **Express**
- **PostgreSQL**
- **Docker**

## Pour Commencer

### Exigences

- [Node.js](https://nodejs.org/) (>= 22.9.0)
- [PostgreSQL](https://www.postgresql.org/) (si vous n'utilisez pas Docker)
- [Docker](https://www.docker.com/) (pour le développement conteneurisé)

### Installation

1. Cloner le dépôt :
```
git clone https://github.com/alexwauquier/smart-hotel-api.git
```

2. Naviguer vers le répertoire du projet :
```
cd smart-hotel-api
```

3. Installer les dépendances :
```
npm install
```

### Configuration

Ce projet inclut un fichier `.env.development` par défaut. Vous pouvez le remplacer en ajoutant vos propres variables d'environnement dans le fichier `.env.development.local`. L'application chargera automatiquement les variables des deux fichiers, le fichier .env.development.local étant prioritaire.

| Variable    | Description                             | Valeur par défaut  |
| ----------- | --------------------------------------- | ------------------ |
| PORT        | Port sur lequel l'API sera exécutée     | 3000               |
| DB_USER     | Nom d'utilisateur de la base de données | smarthotel         |
| DB_PASSWORD | Mot de passe de la base de données      | smarthotel         |
| DB_HOST     | Adresse hôte de la base de données      | localhost          |
| DB_PORT     | Port de la base de données              | 5432               |
| DB_NAME     | Nom de la base de données               | smart_hotel_db     |
| JWT_SECRET  | Clé secrète JWT                         | smarthotel         |

### Exécuter l'API Localement

Pour démarrer l'API en mode développement avec redémarrage automatique :
```
npm run start:dev
```

L'API sera disponible à l'adresse `http://localhost:3000`.

### Base de Données de Développement avec Docker

Pour le développement local, une base de données PostgreSQL peut être mise en place en utilisant Docker Compose. Un fichier `compose.development.yaml` est fourni pour cette configuration.

Pour démarrer la base de données :
```
docker compose -f compose.development.yaml up -d
```

Ceci lancera un conteneur PostgreSQL avec la configuration requise pour tester l'API.

## Routes Disponibles

### Authentification

| Méthode | Endpoint                 | Description                                    |
| ------- | ------------------------ | ---------------------------------------------- |
| POST    | /api/auth/login/customer | Authentifie un client et renvoie un jeton JWT  |
| POST    | /api/auth/login/employee | Authentifie un employé et renvoie un jeton JWT |

### Clients

| Méthode | Endpoint           | Description                     |
| ------- | ------------------ | ------------------------------- |
| GET     | /api/customers     | Renvoie tous les clients        |
| GET     | /api/customers/:id | Renvoie un client par son ID    |
| POST    | /api/customers     | Crée un nouveau client          |
| PATCH   | /api/customers/:id | Met à jour un client par son ID |
| DELETE  | /api/customers/:id | Supprime un client par son ID   |

### Employés

| Méthode | Endpoint           | Description                      |
| ------- | ------------------ | -------------------------------- |
| GET     | /api/employees     | Renvoie tous les employés        |
| GET     | /api/employees/:id | Renvoie un employé par son ID    |
| POST    | /api/employees     | Crée un nouveau employé          |
| PATCH   | /api/employees/:id | Met à jour un employé par son ID |
| DELETE  | /api/employees/:id | Supprime un employé par son ID   |

### Types d'Employés

| Méthode | Endpoint                     | Description                             |
| ------- | ---------------------------- | --------------------------------------- |
| GET     | /api/employees/types         | Renvoie tous les types d'employés       |
| GET     | /api/employees/types/:typeId | Renvoie un type d'employé par son ID    |
| POST    | /api/employees/types         | Crée un nouveau type d'employé          |
| PATCH   | /api/employees/types/:typeId | Met à jour un type d'employé par son ID |
| DELETE  | /api/employees/types/:typeId | Supprime un type d'employé par son ID   |

### Produits

| Méthode | Endpoint          | Description                      |
| ------- | ----------------- | -------------------------------- |
| GET     | /api/products     | Renvoie tous les produits        |
| GET     | /api/products/:id | Renvoie un produit par son ID    |
| POST    | /api/products     | Crée un nouveau produit          |
| PATCH   | /api/products/:id | Met à jour un produit par son ID |
| DELETE  | /api/products/:id | Supprime un produit par son ID   |
