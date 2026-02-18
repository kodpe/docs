---
tags:
  - C
  - algo
  - Go
  - logique
title: Créer un programme Quine
date: 2026-02-18
sort: 1
---
> [!intermediaire] Intermédiaire

>[!info] Un quine est un programme informatique qui affiche exactement son propre code source.
> **programme quine = affiche(programme quine)**

Le nom Quine en informatique rend hommage au logicien et philosophe américain Willard Van Orman Quine,  dont les travaux ont inspiré le concept de programmes capables de se reproduire eux-mêmes.

 ![[quine.jpg]]

Un programme Quine fait appel au concept de l'auto-référence, un principe fondamental également présent dans les compilateurs, la génération de code et les malwares (virus, vers informatiques…). C’est un exercice réputé difficile qui demande à la fois créativité, rigueur et une compréhension précise du langage.

 Il doit contenir en lui une représentation parfaite de lui-même : 
 
![[Capture d’écran 2026-02-18 173155.jpg]]

> [!warning] Un programme quine n'a pas le droit de lire son propre fichier ou d'utiliser une quelconque entrée de données externe (open / read / args).

Voici un exemple d'un programme quine en **C** :
```c
#include <stdio.h>
int main(){char*a="#include <stdio.h>%cint main(){char*a=%c%s%c;%cprintf(a,10,34,a,34,10);}";
printf(a,10,34,a,34,10);}
```

En **Go** :
```go
package main;import "fmt";func main(){
a:="package main;import \"fmt\";func main(){\na:=%q\nfmt.Printf(a,a)}"
fmt.Printf(a,a)}
```

 Les programmes quine nécessitent souvent d’éviter les retours à la ligne, tabulations et espaces inutiles, car ceux-ci feraient partie de la chaîne de caractères et feraient rapidement gonfler la taille du programme.