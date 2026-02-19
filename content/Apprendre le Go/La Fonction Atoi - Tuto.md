---
tags:
  - atoi
  - Go
  - algorithm
  - initiation
title: 3. La fonction Atoi - Tuto
date: 2026-01-14
sort: 1
permalink: /atoi-go
draft: "true"
---
> [!debutant] Niveau Débutant
> Lecture préalable conseillée : [[Presentation du Go]] + [[Conditions et boucles]]

La fonction **`Atoi`** signifie **“ASCII to integer”**, c’est-à-dire que sa tâche est de **convertir une chaîne de caractères en nombre entier**.

Parfois, on reçoit un nombre sous forme de texte, ou chaîne de caractères (string) et on veut l’utiliser comme un nombre entier (integer) dans les calculs.  

Exemple : l’utilisateur saisit `"123"` au clavier, mais on veut que le programme comprenne **123** comme un entier.

Elle fait partie de la bibliothèque standard du **Go** [strconv.Atoi](https://pkg.go.dev/strconv#Atoi)

```go
func Atoi(s string) (int, error) // version standard officielle
```

C'est une fonction fondamentale intéressante à reproduire lorsque l'on débute en programmation.

> [!todo] Vous allez apprendre ci-dessous à recoder vous même en **Go** une version simplifiée de la fonction **`Atoi`**.

### Code expliqué pas à pas

Voici le corps de votre fonction **`Atoi`** :

```go
func Atoi(s string) int {
	// votre code ici
}
```

```go
s string // est l'argument en entrée, le texte à convertir
```

```go
int // la valeur de retour, le nombre entier correspondant au texte
```

Voici un **main de test** que vous pouvez utiliser pour tester les cas particuliers et vérifier le bon comportement de votre fonction **`Atoi`** :

```go
package main

import (
	"fmt"
	"strconv"
)

func Atoi(s string) int {
	var nb int
	// votre code ici
	return nb
}

func test(id int, s string) {
	var you = Atoi(s) // Your Atoi
	var std, err = strconv.Atoi(s) // Standard Atoi
	if err != nil {
		std = 0;
	}
	if you == std { // check and print result
		fmt.Print("[\033[32m OK \033[0m]")
	} else {
		fmt.Print("[\033[31m KO \033[0m]")
	}
	fmt.Printf(" %02d : %d == %d\n", id, std, you)
}

func main() {
	// ici on cherche à lister tous les cas bizarres/particuliers/extremes
	// la fiabilité d'un code dépend souvent de la fiabilité des tests
	test(1, "1")
	test(2, "0")
	test(3, "123")
	test(4, "0123")
	test(5, "00123")
	test(6, "123a")
	test(7, "a123")
	test(8, "-123")
	test(9, "+123")
	test(10, "-123+")
	test(11, "--123")
	test(12, "++123")
	test(13, "123 456")
	test(14, "9223372036854775807")
	test(15, "-9223372036854775808")
}
```

Le résultat final attendu est le suivant :

```bash
go run ./AtoiTest.go
[ OK ] 01 : 1 == 1
[ OK ] 02 : 0 == 0
[ OK ] 03 : 123 == 123
[ OK ] 04 : 123 == 123
[ OK ] 05 : 123 == 123
[ OK ] 06 : 0 == 0
[ OK ] 07 : 0 == 0
[ OK ] 08 : -123 == -123
[ OK ] 09 : 123 == 123
[ OK ] 10 : 0 == 0
[ OK ] 11 : 0 == 0
[ OK ] 12 : 0 == 0
[ OK ] 13 : 0 == 0
[ OK ] 14 : 9223372036854775807 == 9223372036854775807
[ OK ] 15 : -9223372036854775808 == -9223372036854775808
```

> [!info] Pour simplifier la gestion d'erreur dans cet exercice, en cas d'erreur votre fonction devra retourner **`0`**.
> Cela peut arriver si la conversion est impossible, par exemple si l'utilisateur insère des lettres dans votre fonction au lieu d'un nombre.

Reprenons le début de votre fonction **`Atoi`** :

```go
func Atoi(s string) int {
    // votre code ici
}
```

On ajoute un nombre entier nommé **nb** en variable (**`int`**) qui servira de valeur de **retour** :

```go
func Atoi(s string) int {
	var nb int
	
	return nb
}
```

Ensuite comme on sait qu'on a une **`string`** en argument, donc on va devoir la parcourir avec une boucle **`for`** :

```go
func Atoi(s string) int {
	var nb int
	
	for i := 0; i < len(s); i++ {
		// dans le for on va pouvoir utiliser chaque caractere de la string
	}
	
	return nb
}
```

Pour convertir un caractère ascii en nombre entier on doit faire deux choses :
- Effectuer une opération mathématique
- Caster le résultat pour le convertir dans le type de variable que l'on veut obtenir

```go
var nb int = (int)(c - 48)
/*
on soustrait 48 au caractere 'c' pour obtenir sa valeur numérique décimale
	car le code decimale du caractere ascii '0' vaut 48, 48 - 48 = 0
	car le code decimale du caractere ascii '1' vaut 49, 49 - 48 = 1
	car le code decimale du caractere ascii '2' vaut 50, 50 - 48 = 2
	on obtient le nombre correspondant à chaque fois ...
(int)(...) pour caster le type byte (caractere) en type int
*/
```

Ce qui nous donne dans notre code :

```go
func Atoi(s string) int {
	var nb int
	
	for i := 0; i < len(s); i++ {
		nb = (int)(s[i] - 48)
	}
	
	return nb
}
```

Le problème de ce code est que la valeur de retour correspondra toujours au chiffre de la dernière lettre de la **string** **`s`**, car la variable **`nb`** est **écrasée** à chaque fois dans la boucle **`for`**, donc on perd tous les chiffres précédents. Pour y remédier et construire le nombre avec tous les chiffres l'astuce consiste à décaler tous les précédents chiffres chaque fois qu'on veut en ajouter un nouveau. 

On décale d'un cran **`nb`** vers la gauche à chaque fois en le multipliant par **10** :

```go
func Atoi(s string) int {
	var nb int
	
	for i := 0; i < len(s); i++ {
		// ici nb vaut par exemple 123 (imagine)
		
		nb = nb * 10 
		// ici nb vaut 123 * 10 = 1230, 
		
		nb = nb + (int)(s[i] - 48) // imaginons s[i] = '4' (52 en décimal)
		// ici le nouveau zero est remplacé par le prochain chiffre (4)
		// nb devient donc 1230 + 4 = 1234
		
		// on répète la même chose dans le for pour tous les chiffres
		// suivants en agrandissant nb au fur et à mesure
	}
	
	return nb
}
```

Simplification du code :

```go
func Atoi(s string) int {
	var nb int
	
	for i := 0; i < len(s); i++ {
		nb = nb * 10 + (int)(s[i] - 48)
	}
	
	return nb
}
```

A ce stade on peut voir qu'on passe déjà une partie des tests :

```bash
go run .\AtoiTest.go
[ OK ] 01 : 1 == 1
[ OK ] 02 : 0 == 0
[ OK ] 03 : 123 == 123
[ OK ] 04 : 123 == 123
[ OK ] 05 : 123 == 123
[ KO ] 06 : 0 == 1279
[ KO ] 07 : 0 == 49123
[ KO ] 08 : -123 == 253123
[ KO ] 09 : 123 == 251123
[ KO ] 10 : 0 == 2531481
[ KO ] 11 : 0 == 2783123
[ KO ] 12 : 0 == 2761123
[ KO ] 13 : 0 == 1470456
[ OK ] 14 : 9223372036854775807 == 9223372036854775807
[ KO ] 15 : -9223372036854775808 == -6427310135063347200
```

Les tests **KO** sont dues à la présence des signes **+**/**-** et de lettres ou caractères non chiffres :

```go
    test(6, "123a")
    test(7, "a123")
    test(8, "-123")
    test(9, "+123")
    test(10, "-123+")
    test(11, "--123")
    test(12, "++123")
    test(13, "123 456")
    test(15, "-9223372036854775808")
```

Pour gérer la détection de caractères invalides (les non chiffres) on ajoute une vérification avec un **`if`** dans la boucle **`for`** :

```go
func Atoi(s string) int {
	var nb int
	
	for i := 0; i < len(s); i++ {
		if s[i] < '0' || s[i] > '9' { // si on a un caractere non chiffre
			return 0 // on return 0 comme valeur d'erreur
		}
		nb = nb * 10 + (int)(s[i] - 48)
	}
	
	return nb
}
```

Pour détecter si notre nombre est signé, si il est négatif ou positif, on ajoute des **`if`** au début pour détecter si le premier caractère de la **string** est un signe **`+`** ou **`-`** , on sauvegarde le signe dans une variable pour le multiplier à la fin par notre nombre final.

```go
func Atoi(s string) int {
	var nb int
	var sign int = 1 // sauvegarde du signe, 1 si '+' ou -1 si '-'
	var start int = 0 // début de la boucle for décalé si signe

	if s[0] == '-' {
		sign = -1	// inversion de sign
		start = 1	// on reporte le début du for si on a un signe '-'
	}
	if s[0] == '+' {
		start = 1	// on reporte le début du for si on a un signe '+'
	}

	for i := start; i < len(s); i++ {
		if s[i] < '0' || s[i] > '9' { // invalid byte check
			return 0
		}
		nb = nb * 10 + (int)(s[i] - 48)	// conversion byte -> int
	}
	return nb * sign 
	// si par exemple nb = 58
	// et sign = -1 parce qu'on avait détecté le signe '-'
	// alors le return vaut 58 * -1 = -58
}
```

> [!success] Et voilà bravo votre fonction **`Atoi`** passe maintenant tous les tests :

```bash
go run ./AtoiTest.go
[ OK ] 01 : 1 == 1
[ OK ] 02 : 0 == 0
[ OK ] 03 : 123 == 123
[ OK ] 04 : 123 == 123
[ OK ] 05 : 123 == 123
[ OK ] 06 : 0 == 0
[ OK ] 07 : 0 == 0
[ OK ] 08 : -123 == -123
[ OK ] 09 : 123 == 123
[ OK ] 10 : 0 == 0
[ OK ] 11 : 0 == 0
[ OK ] 12 : 0 == 0
[ OK ] 13 : 0 == 0
[ OK ] 14 : 9223372036854775807 == 9223372036854775807
[ OK ] 15 : -9223372036854775808 == -9223372036854775808
```

> [!tip] Utiliser des **mains de test** est une bonne pratique pour **vérifier**, **expliquer** et **démontrer** que votre code se comporte correctement. La **fiabilité d’un code** dépend souvent de la **fiabilité des tests**.