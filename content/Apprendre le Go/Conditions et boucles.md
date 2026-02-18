---
tags:
  - condition
  - boucle
  - for
  - Go
  - initiation
title: 2. Conditions et boucles
date: 2026-01-16
sort: 1
---
> [!debutant] Niveau Débutant
# Les conditions et les boucles - Partie 1

> [!info] En Go, tu peux contrôler le **flux d’exécution** de ton programme grâce aux **conditions** et aux **boucles**. Le programme peut alors **prendre des décisions** et **répéter des actions**.

## Condition `if`

Ici le 2ème message (ligne 12) s'affiche seulement si `age` vaut `21` :

```go
package main

import "fmt"

func main() {
	var age int

    fmt.Print("Quel âge as-tu ? ")
    fmt.Scanln(&age)

    if age == 21 {
        fmt.Println("Tu as exactement 21 ans !")
    } 
}
```

> [!info] Le mot clé `if` (ligne 11) permet de tester la condition `age == 21` (si âge égal 21).

Pour vérifiez si l'âge de l'utilisateur est strictement en dessous de 21 ans on écrit :
```go
    if age < 21 {
		// code exécuté seulement si la condition est vraie
	}
	// suite du code dans tous les cas
```

Pour vérifiez si l'âge de l'utilisateur est supérieur ou égale à 21 ans on écrit :
```go
    if age >= 21 {
		// code exécuté seulement si la condition est vraie
	}
	// suite du code dans tous les cas
```

> [!warning] Attention au placement des **accolades { }**, elles délimitent le **bloc conditionnel**, les instructions dedans seront exécutées seulement si la **condition est vraie**.

---

## Opérateurs de comparaison

Voici les opérateurs de comparaison possibles pour écrire des conditions :
|Opérateur|Description|Exemple|Résultat|
|---|---|---|---|
|**`==`**|Compare deux valeurs et vérifie leur égalité|`x == 7`|La condition est vraie si x est égal à 7|
|**`<`**|Vérifie qu'une variable est strictement inférieure à une valeur|`x < 7`|La condition est vraie si x est strictement inférieure à 7|
|**`<=`**|Vérifie qu'une variable est inférieure ou égale à une valeur|`x <= 7`|La condition est vraie si x est inférieure ou égale à 7|
|**`>`**|Vérifie qu'une variable est strictement supérieure à une valeur|`x > 7`|La condition est vraie si x est strictement supérieure à 7|
|**`>=`**|Vérifie qu'une variable est supérieure ou égale à une valeur|`x >= 7`|La condition est vraie si x est supérieure ou égale à 7|
|**`!=`**|Vérifie qu'une variable est différente à une valeur|`x != 7`|La condition est vraie si x est différent à 7|

---

## Conditions `if` / `else if` / `else`

> [!info] Après un **`if`** (« **si** »),  on peut ajouter des **`else if`** (« **sinon si** »),  et terminer si besoin par un **`else`**  (« **sinon** »). 

```go
package main

import "fmt"

func main() {
    var age int

    fmt.Print("Quel âge as-tu ? ")
    fmt.Scanln(&age)

    if age < 18 {
        fmt.Println("Tu es mineur.")
    } else if age == 18 {
        fmt.Println("Tu as exactement 18 ans !")
    } else {
        fmt.Println("Tu es majeur.")
    }
}
```

> [!info] **`if`** → teste une condition `age < 18`.
    
> [!info] **`else if`** → teste une autre condition si la première est fausse. `age == 18`
    
> [!info] **`else`** → s’exécute si aucune des conditions `if`/`else if` précédentes n’est vraie.

> [!warning] **`else if`** et **`else`** ne peuvent pas être utilisé seuls sans **`if`**.

> [!warning] **`else`** ne peut être utilisé qu'une seule fois après un **`if`** ou un **`else if`**.

---

## Opérateurs logiques ou / et / non

> [!info] On peut former des conditions plus complexes en associant des conditions avec les opérateurs logiques  `&&` (« **et** »),   `||` (« **ou** »),  et `!`  (« **non** »). 

| Opérateur  | Signification | Description                                                                     |
| ---------- | ------------- | ------------------------------------------------------------------------------- |
| **`\|\|`** | OU            | Vrai si au moins une des comparaisons est vraie                                 |
| **`&&`**   | ET            | Vrai si toutes les comparaisons sont vraies                                     |
| **`!`**    | NON           | Retourne faux si la comparaison est vraie et vraie si la comparaison est fausse |

```go
if a > b && c == d {
	// si a supérieur à b ET c égal à d
}
```

```go
if a > b || c > d {
	// si a supérieur à b OU c supérieur à d
}
```

```go
if !a {
	// si non a
}
```
---

## Boucle (`for`)

> [!info] La boucle `for` permet de **répéter des instructions plusieurs fois**.

```go
package main

import "fmt"

func main() {

	for i := 0; i < 4; i++ {
        fmt.Println("The cow jumped over the moon!", i)
	}
}
```

```sh
go run ./main
The cow jumped over the moon! 0
The cow jumped over the moon! 1
The cow jumped over the moon! 2
The cow jumped over the moon! 3
```

> [!info] La boucle **`for`** est presque toujours constituée de 3 éléments :
> - `i := 0` → initialisation du compteur.
> - `i < 4` → condition de continuation de la boucle (« **tant que** »). 
> - `i++` → incrémentation du compteur à chaque tour de boucle.

```go
package main

import "fmt"

func main() {
// initialisation ; condition ; incrementation
    for i := 0    ; i < 4     ; i++ {
		// code exécuté 4 fois
    }
	// suite du code
}
```

> [!warning] Attention au placement des **accolades { }**, elles délimitent le **bloc de la boucle**, seules les instructions dedans pourront s'exécuter **plusieurs fois**.

