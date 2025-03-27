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
  - [Commandes](#commandes)
  - [Statuts de commandes](#statuts-de-commandes)
  - [Produits](#produits)
  - [Types de Produits](#types-de-produits)
  - [Espaces](#espaces)
  - [Types d'Espaces](#types-despaces)

## Aperçu du Projet

L'API Smart Hotel est le backend de l'[application mobile](https://github.com/alexwauquier/smart-hotel-mobile-app) et de l'[application web](https://github.com/alexwauquier/smart-hotel-web-app) du projet Smart Hotel, un projet de deuxième année en cybersécurité, informatique et réseaux. Elle est conçue pour gérer les commandes du bar et les capteurs environnementaux d'un l'hôtel.

## Technologies Utilisées

- **Node.js**
- **Express**
- **PostgreSQL**
- **Docker**

## Pour Commencer

### Exigences

- [Node.js](https://nodejs.org/) (>=22.9.0 pour le développement)
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

| Méthode | Endpoint                          | Description                       |
| ------- | --------------------------------- | --------------------------------- |
| GET     | /api/customers                    | Renvoie tous les clients          |
| GET     | /api/customers/:customerId        | Renvoie un client                 |
| GET     | /api/customers/:customerId/orders | Renvoie les commandes d'un client |
| POST    | /api/customers                    | Crée un nouveau client            |
| PATCH   | /api/customers/:customerId        | Met à jour un client              |
| DELETE  | /api/customers/:customerId        | Supprime un client                |

### Employés

| Méthode | Endpoint                   | Description               |
| ------- | -------------------------- | ------------------------- |
| GET     | /api/employees             | Renvoie tous les employés |
| GET     | /api/employees/:employeeId | Renvoie un employé        |
| POST    | /api/employees             | Crée un nouvel employé    |
| PATCH   | /api/employees/:employeeId | Met à jour un employé     |
| DELETE  | /api/employees/:employeeId | Supprime un employé       |

### Types d'Employés

| Méthode | Endpoint                     | Description                       |
| ------- | ---------------------------- | --------------------------------- |
| GET     | /api/employees/types         | Renvoie tous les types d'employés |
| GET     | /api/employees/types/:typeId | Renvoie un type d'employé         |
| POST    | /api/employees/types         | Crée un nouveau type d'employé    |
| PATCH   | /api/employees/types/:typeId | Met à jour un type d'employé      |
| DELETE  | /api/employees/types/:typeId | Supprime un type d'employé        |

### Commandes

| Méthode | Endpoint                    | Description                         |
| ------- | --------------------------- | ----------------------------------- |
| GET     | /api/orders                 | Renvoie toutes les commandes        |
| GET     | /api/orders/:orderId        | Renvoie une commande                |
| POST    | /api/orders                 | Crée une nouvelle commande          |
| PATCH   | /api/orders/:orderId/status | Met à jour le statut d'une commande |

### Statuts de commandes

| Méthode | Endpoint                       | Description                           |
| ------- | ------------------------------ | ------------------------------------- |
| GET     | /api/orders/statuses           | Renvoie tous les statuts de commandes |
| GET     | /api/orders/statuses/:statusId | Renvoie un statut de commande         |
| POST    | /api/orders/statuses           | Crée un nouveau statut de commande    |
| PATCH   | /api/orders/statuses/:statusId | Met à jour un statut de commande      |
| DELETE  | /api/orders/statuses/:statusId | Supprime un statut de commande        |

### Produits

| Méthode | Endpoint                 | Description               |
| ------- | ------------------------ | ------------------------- |
| GET     | /api/products            | Renvoie tous les produits |
| GET     | /api/products/:productId | Renvoie un produit        |
| POST    | /api/products            | Crée un nouveau produit   |
| PATCH   | /api/products/:productId | Met à jour un produit     |
| DELETE  | /api/products/:productId | Supprime un produit       |

### Types de Produits

| Méthode | Endpoint                    | Description                        |
| ------- | --------------------------- | ---------------------------------- |
| GET     | /api/products/types         | Renvoie tous les types de produits |
| GET     | /api/products/types/:typeId | Renvoie un type de produit         |
| POST    | /api/products/types         | Crée un nouveau type de produit    |
| PATCH   | /api/products/types/:typeId | Met à jour un type de produit      |
| DELETE  | /api/products/types/:typeId | Supprime un type de produit        |

### Espaces

| Méthode | Endpoint             | Description              |
| ------- | -------------------- | ------------------------ |
| GET     | /api/spaces          | Renvoie tous les espaces |
| GET     | /api/spaces/:spaceId | Renvoie un espace        |
| POST    | /api/spaces          | Crée un nouvel espace    |
| PATCH   | /api/spaces/:spaceId | Met à jour un espace     |
| DELETE  | /api/spaces/:spaceId | Supprime un espace       |

### Types d'Espaces

| Méthode | Endpoint                  | Description                      |
| ------- | ------------------------- | -------------------------------- |
| GET     | /api/spaces/types         | Renvoie tous les types d'espaces |
| GET     | /api/spaces/types/:typeId | Renvoie un type d'espace         |
| POST    | /api/spaces/types         | Crée un nouveau type d'espace    |
| PATCH   | /api/spaces/types/:typeId | Met à jour un type d'espace      |
| DELETE  | /api/spaces/types/:typeId | Supprime un type d'espace        |
