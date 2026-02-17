---
tags:
  - terminal
  - bash
  - wsl
  - kernel
  - shell
  - initiation
title: 1. Le terminal
date: 2026-01-20
niveau: Débutant
permalink: /Introduction-au-terminal
---
# Introduction au terminal >_

> [!debutant] Niveau Débutant
## Sommaire

> [!block] 1. Définitions
 >- Ordinateur
 >- Système d'exploitation
 >- Kernel
 >- Terminal
 >- Commande
 
> [!block] 2. Foire aux questions
>- Pourquoi Linux est largement utilisé dans l'informatique professionnelle ?
>- Pourquoi Windows est-il si répandu auprès du grand public ?
>- Pourquoi utiliser le terminal plutôt qu'une interface graphique ?
>- Comment utiliser un terminal Linux sous Windows ? (WSL)
>- Pourquoi apprendre le Bash ?

> [!block] 3. Quelques commandes linux bash
>- pwd : Affiche le dossier actuel
>- ls : Liste les fichiers et dossiers
>- cd : Se déplacer dans un dossier
>- mkdir : Créer un dossier
>- touch : Créer un fichier
>- rm : Supprimer un fichier ou dossier

---
## 1. Définitions

### Ordinateur

Un **ordinateur** est une machine programmable qui exécute des instructions pour traiter automatiquement des données.

Pour qu’une machine soit considérée comme un **ordinateur**, il faut au minimum qu’elle ait ces composants essentiels :
- Un processeur
- De la mémoire / stockage
- Des entrées et sorties
- Un programme intégré firmware (micrologiciel), et éventuellement un système d’exploitation (OS)

 Exemples d'ordinateurs spécialisés et leur firmware / OS typique :
 - Un supercalculateur (Linux)
 - L'ordinateur de bord d'un véhicule (RTOS)
 - Une console de jeu (OS propriétaire ou base Linux)
- Un smartphone (Android / iOS)
- Une imprimante moderne (RTOS ou base Linux embarqué)
- Une montre intelligente (RTOS ou base Linux embarqué)
- Une souris programmable (firmware minimaliste)
- Un pacemaker (firmware minimaliste très spécialisé)

### Système d’exploitation (OS Operating System)

 Le **système d’exploitation** est un ensemble cohérent de programmes et logiciels pour gérer toutes les ressources d'un **ordinateur** (mémoire, calcul, communications...) et fournir des services de base.

 **Exemples de systèmes d'exploitation**
- Linux (Android, Ubuntu, Debian, etc.)
- Windows
- macOS / iOS

 ### Kernel (noyau)

Le **kernel** est le coeur d'un **système d’exploitation**.

C’est le programme fondamental qui gère le processeur, la mémoire et les périphériques. C'est la partie la plus critique d'un système. Le développement d'un **kernel** est particulièrement complexe et délicat.

 **Exemples de noyaux**
- Linux → noyau Linux
- Windows → noyau NT
- macOS → noyau XNU

### Shell (coque)

Le **shell** est un programme qui permet à l'utilisateur d'interagir avec la machine, il lit et interprète des commandes, puis les envoie au **noyau**. Le shell n’exécute pas les instructions directement sur le matériel, il demande au noyau de le faire. L'ensemble des commandes d'un **shell** peuvent constituer un langage : c'est alors un langage de script spécialisé dans le contrôle d'un système.

#### Utilisateur → Shell → Noyau → Matériel

#### Exemples de shell connus

- Bash (Bourne-Again shell, Linux)
- zsh (Bash amélioré plus puissant)
- Windows PowerShell
- L'explorateur Windows est un shell graphique

### Terminal (console)

Un **terminal** est le logiciel d'interface texte permettant de contrôler un ordinateur à l’aide de commandes de **shell**.

#### Le terminal à l’origine

À l’origine, les ordinateurs étaient tellement volumineux qu'ils occupaient des salles entières. Les utilisateurs communiquaient alors avec la machine avec des équipements dédiés appelés terminaux. Ces terminaux étaient des appareils périphériques d’entrée et de sortie. Ils pouvaient être équipés d’un clavier, d’un écran, parfois d’une imprimante. Leur rôle était uniquement de permettre à l’utilisateur d’envoyer des instructions à l’ordinateur central et d’en afficher les résultats. Le terminal était donc un appareil intermédiaire entre l’humain et la machine.

#### Le terminal aujourd’hui

Aujourd’hui, le terminal n’est plus un appareil physique séparé. Il s’agit d’un logiciel intégré au système d’exploitation, qui s’exécute dans une fenêtre comme n’importe quelle autre application. Le terminal reçoit du texte au clavier, affiche des réponses et transmet les commandes au système. Il sert d’interface vers le shell, qui interprète les commandes, puis vers le noyau, qui les exécute réellement. Même si les interfaces graphiques sont devenues la norme pour le grand public, le terminal basé sur l'utilisation du clavier reste un outil central en informatique, car c'est toujours le moyen le plus direct, précis, rapide et puissant de contrôler un ordinateur.  
  
Il est massivement utilisé pour :

- le développement logiciel
- l’administration des systèmes / des serveurs
- l’automatisation de tâches

### Commande

Une **commande** de **shell** est une instruction que l’on tape dans un **terminal** pour demander au **noyau** du **système d'exploitation** d’exécuter une action.

Elle peut être composée de :

- Le nom de la commande (`ls`, `cat`, `exit`).
- Des options qui modifient son comportement (`-l`, `-c`).
- Des arguments qui précisent sur quoi la commande doit agir (nom de fichiers, dossiers, processus, utilisateurs, etc.).

Exemple :
```sh
ls -l Documents

```


Ici, `ls` est le nom de la commande, `-l` est une option pour afficher des détails supplémentaires, et `documents` est l’argument (le dossier sur lequel agir). L'état ou le resultat de la commande s'affichera sous la commande dans le terminal.

---
## 2. FAQ

### Pourquoi Linux est largement utilisé dans l'informatique professionnelle ?

- gratuit, libre et open source
- plus léger, plus rapide, et plus stable que Windows
- La très grande majorité des serveurs dans le monde utilisent Linux
- généralement plus sécurisé que Windows, plus de contrôle, moins sujet aux virus et attaques
- Meilleur pour la protection de la vie privée, distributions spécialisées dans la privacy

### Pourquoi Windows est-il si répandu auprès du grand public ?

- préinstallé sur la plupart des ordinateurs
- interface plus simple à utiliser
- énorme catalogue de logiciels, écosystème intégré et homogène
- standard professionnel dans beaucoup de domaines
- support principal pour les jeux vidéo

### Pourquoi utiliser le terminal plutôt qu’une interface graphique ?

Le terminal permet d'utiliser plusieurs milliers de commandes différentes et de les combiner entre elles.

Les possibilités sont presque infinies, seule une petite partie de ces actions est possible via les interfaces graphiques.

Grâce au terminal, un utilisateur peut accomplir des tâches répétitives ou complexes en quelques secondes et les automatiser, voici quelques exemples :

1. Compter combien de fois un mot apparaît dans tous les fichiers d’un dossier.

Cette commande compte le nombre de fois que le mot "bouton" apparaît dans tous les fichiers d'un dossier et sous dossiers.

```sh
grep -Rc "bouton" *

```

2. Créer rapidement plusieurs dossiers pour organiser des fichiers :

Cette commande crée 40 dossiers nommés "photos_1990" à "photos_2030" en une seule ligne.

```sh
mkdir photos_{1990..2030}

```


3. Copier, renommer ou déplacer en masse des fichiers :

Cette commande déplace tous les fichiers .txt dans le dossier "archive".

```sh
mv *.txt archive/

```


4. Gérer des processus :

Cette commande ferme tous les processus dont le nom contient "firefox", même si ils sont freeze.

```sh
pkill -9 firefox

```


### Comment utiliser un terminal Linux sous Windows ? (WSL)

Sous Windows, nous utilisons WSL (Windows Subsystem for Linux) pour disposer d’un terminal Linux. WSL permet d’exécuter un environnement Linux directement dans Windows, sans machine virtuelle. L'installation est simplifiée et offre les mêmes commandes et comportement que sur Linux. On peut ainsi profiter des avantages des deux systèmes.

### Pourquoi apprendre le Bash ?

Bash est le langage de script shell le plus utilisé, il est présent sur presque tous les systèmes et serveurs.

C'est le standard dans les écoles, les cours et la documentation. C’est celui que l’on apprend en priorité.

---

## 3. Quelques commandes linux bash

 ### `pwd`
 
Affiche le chemin du dossier actuel dans lequel vous vous trouvez.
 ```sh
 pwd
 /home/utilisateur/Documents
 ```

        

### `ls`

Liste les fichiers et dossiers présents dans le dossier courant (ou vous vous trouvez).
```js
ls
Documents  Téléchargements  script.sh  image.png
```

        

### `cd`

Permet de se déplacer dans un autre dossier. Exemple : aller dans "Documents".
```sh
cd Documents

```

        

### `mkdir`

Crée un nouveau dossier. Exemple : créer un dossier "projet".

```sh
mkdir projet

```
        

### `touch`

Crée un nouveau fichier vide. Exemple : créer un fichier "monsite.html".
```sh
touch monsite.html

```

        

### `rm`

Supprime des fichiers ou dossiers (attention : suppression définitive).
```sh
rm fichier.txt

```
