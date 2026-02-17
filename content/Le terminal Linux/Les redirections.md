---
tags:
  - bash
  - terminal
  - redirections
  - pipe
  - stdio
  - initiation
  - files
title: 2. Les redirections
date: 2026-02-10
permalink: /Les-redirections
---
> [!debutant] Niveau Débutant
# Les redirections dans le terminal - Partie 1

## 1. Introduction

La **redirection** est une forme de communication entre processus et fichiers.

Les programmes (et commandes) ont très souvent besoin de recevoir des données en **entrée**, pour en produire à leur tour en **sortie**.

*Par exemple, un programme de tri aura besoin en **entrée** des données mélangées et produira en **sortie** les données triées.*

Cette **entrée** et **sortie** est matérialisée par des fichiers spéciaux, appelés des **flux de données abstraits**, respectivement `stdin` et `stdout`, pour **entrée standard** et **sortie standard**. A cela on rajoute `stderr`, une seconde sortie réservée aux messages d'erreurs.

Tous les programmes (et commandes) sont toujours rattachés à ces trois **flux**, mais ne sont pas obligés de s'en servir.

Par défaut, l'**entrée standard** correspond à ce qui est **lu dans le terminal** et la **sortie standard** à ce qui est **écrit dans le terminal**.


Ils sont accessibles via des numéros, les **descripteurs de fichiers**, ou **fd** (file descriptor).

|Flux|fd|Description|Correspondance par défaut|
|-|-|-|-|
|stdin|0|Entrée standard| lit le terminal|
|stdout|1|Sortie standard| écrit dans le terminal|
|stderr|2|Sortie d'erreur| écrit dans le terminal|

Les **redirections** consiste à modifier la provenance ou la destination des données passant par ces **flux**, en modifiant les **fd** pour qu'ils pointent vers d'autres fichiers. Dans le terminal cela se fait automatiquement en utilisant les symboles `>` `<` et `|`.

---

## 2. Rediriger la sortie d'une commande vers un fichier

Ici on écrit "hello" dans le `terminal`
```sh
echo hello
hello
```

Ici on écrit "hello" dans un fichier `file` avec le symbole de redirection de sortie `>`
```sh
echo hello > file

```

 Contenu du dossier courant
```sh
ls
file
```

Contenu de `file`
```sh
cat file
hello
```

Ici on ajoute "hello" à `file` avec le symbole d'ajout `>>` sans perdre ce qui y est déjà
```sh
echo hello >> file

```

Contenu de `file` actualisé
```sh
cat file
hello
hello
```

Contenu du dossier courant
```sh
ls
file
```

Ici on écrit "nez" dans `file` qui existe déja, on perd ce qui était dedans
```sh
echo nez > file

```

Contenu de `file` actualisé
```sh
cat file
nez
```
---

## 3. Rediriger l'entrée d'une commande avec un fichier

Ici la commande cat attend qu'on écrive sur l'entrée standard `stdin`
```sh
cat

```

Ici on a lui donné "hello" en l'écrivant dans le terminal et cat a écrit "hello" sur la sortie standard `stdout` dans le terminal
```sh
cat
hello
hello
```

Ici on donne à cat le fichier `file` avec le symbole de redirection d'entrée `<`
```sh
cat < file
nez
```

Ici on donne a cat `file` avec le symbole de redirection d'entrée `<` et on redirige la sortie vers un nouveau fichier `out`
```sh
cat < file > out

```

Contenu de `out`
```sh
cat out
nez
```
---

## 4. Rediriger la sortie d'une commande dans l'entrée d'une autre

Commande date
```sh
date
Fri Feb 13 02:12:49 AM CET 2026
```

Ici date écrit dans l'entrée de la commande rev en utilisant le pipe `|` (le tube)
```sh
date | rev
6202 TEC MA 25:21:20 31 beF irF
```

Ici la commande echo écrit "nez" dans l'entrée de la commande rev
```sh
echo nez | rev
zen
```

Ici echo écrit "nez" dans l'entrée de la commande date, date n’utilise pas l’entrée standard, donc le pipe n’a aucun effet
```sh
echo nez | date
Fri Feb 13 02:12:49 AM CET 2026
```

Ici echo écrit "nez" dans l'entrée de rev qui écrit dans l'entrée de la commande wc
```sh
echo nez | rev | wc
     1       1       4
```

Ici echo écrit "nez" dans rev qui écrit dans rev qui écrit dans rev qui écrit dans rev qui écrit dans rev qui écrit dans rev qui écrit dans rev
```sh
echo "nez" | rev | rev | rev | rev | rev | rev | rev
zen
```

---

## 5. Récap des redirections apprises
#### `>` pour écrire dans un fichier (écrase)
#### `>>` pour écrire dans un fichier (ajoute)
#### `<` pour lire depuis un fichier
#### `|` pour connecter la sortie d'une commande à l'entrée d'une autre

Les programmes (et commandes) ne savent pas si ils lisent depuis le clavier, un fichier ou un autre programme : ils lisent simplement depuis `stdin` et écrivent sur `stdout`.

## 6. Quelques fichiers spéciaux utiles

`/dev/null` : Le trou noir, tout ce qu’on écrit dedans disparaît.

`/dev/urandom` : Générateur pseudo-aléatoire.
