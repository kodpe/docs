---
tags:
  - terminal
  - bash
  - wsl
  - shell
  - commandes
title: Linux Cheatsheet
---

# Linux Commandes utiles

#### Se repérer et se déplacer
|||
|-|-|
**`ls`** | Affiche les fichiers et dossiers présents dans le dossier courant
|| **`-l`** Affiche sous forme de liste
|| **`-a`** Affiche les fichiers et dossiers cachés
|| **`-R`** Récursivité (qui continue dans les sous dossiers...)
**`cd`** | Permet de se déplacer dans un autre dossier
**`cd ..`** | Retour arrière
**`cd /`** | Racine
**`cd`** | Home
**`pwd`** | Affiche le chemin du dossier où vous êtes
**`history`** | Afficher l'historique des commandes
**`clear`** | Nettoyer l'écran de terminal
**`sh`** / **`bash`** / **`zsh`** | Ouvrir un nouveau shell
**`exit`** | Quitter le shell
**`man`** | Afficher le manuel d'une commande


#### Programmation Go
|||
|-|-|
**`go`** | Compilateur go
**`go run`** | Pour compiler
**`go build`** | Pour compiler et exécuter

#### Manipuler des fichiers
|||
|-|-|
**`find`** | Trouver des fichiers ou dossiers
**`diff`** | Afficher la différence entre deux fichiers
**`touch`** | Crée un fichier vide
**`mkdir`** | Crée un nouveau dossier
**`mv`** | Déplacer ou renommer des fichiers ou dossier
**`cp`** | Copier des fichiers
|| **`-r`** Copier des dossiers et fichiers
**`rm`** | Supprime des fichiers
|| **`-r`** Supprime des dossiers et fichiers
|| **`-f`** Forcer la supression sans confirmation
**`chmod`** | Change les permissions d'un fichier ou dossier

#### Manipuler des données
|||
|-|-|
**`cat`** | Affiche le contenu d'un fichier
**`echo`** | Afficher du texte
**`printf`** | Afficher du texte formaté
**`grep`** | Trouver des chaînes de caractères précises
**`curl`** | Récupérer les données d'une page web
**`jq`** | Filtrer et transformer des données JSON
**`wc`** | Pour compter les choses
**`tr`** | Convertir ou éliminer des caractères 
**`sed`** | Filtrer et transformer du texte
**`yes`** | Créer un affichage en continu
**`rev`** | Inverser le texte
**`vim`** | Editeur de texte dans le terminal

#### Gérer le système
|||
|-|-|
**`apt`** | Gérer et installer des programmes
**`env`** | Afficher l'environnement
**`date`** | Récupérer la date
**`uname`** | Récupérer des infos du système
**`top`** / **`htop`** | Afficher les processus
**`kill`** / **`pkill`** | Tuer des processus
**`ssh-keygen`** | Créer une clé ssh

#### Utiliser Git
|||
|-|-|
**`git clone`** | Télécharge un repo git
**`git add`** | Ajoute des fichiers dans le prochain commit
**`git commit -m`** | Crée un commit
**`git push`** | Envoi le commit sur le repo distant 
**`git status`** | Affiche le statut des fichiers du repo 
**`git log`** | Historique des commits
**`git fetch`** | Met à jour le repo local en fonction du repo distant