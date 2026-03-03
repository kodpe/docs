---
tags:
  - Go
  - integer
  - float
  - variables
  - types
title: Les types de variables
date: 2026-01-16
sort: 1
---
> [!intermediaire] Intermédiaire

Le type d'une variable permet :
- de déterminer la quantité d'espace mémoire utilisée
- d'indiquer au compilateur comment interpréter la valeur

---
## Types entiers

Les types entiers permettent de stocker des nombres sans virgule :

```
1, 2, 3, 42, -10

```

Il existe deux catégories :

- **unsigned (non signé)** → uniquement des nombres positifs
    
- **signed (signé)** → nombres positifs et négatifs
    

#### Entiers non signés (positifs uniquement)

| Type   | Taille  | Valeurs possibles              |
| ------ | ------- | ------------------------------ |
| uint8  | 8 bits  | 0 à 255                        |
| uint16 | 16 bits | 0 à 65 535                     |
| uint32 | 32 bits | 0 à 4 294 967 295              |
| uint64 | 64 bits | 0 à 18 446 744 073 709 551 615 |
#### Entiers signés (positifs et négatifs)

|Type|Taille|Valeurs possibles|
|---|---|---|
|int8|8 bits|-128 à 127|
|int16|16 bits|-32 768 à 32 767|
|int32|32 bits|-2 147 483 648 à 2 147 483 647|
|int64|64 bits|-9 223 372 036 854 775 808 à 9 223 372 036 854 775 807|

---
## Types flottants (nombres à virgule)

Les types flottants permettent de stocker des nombres décimaux :

```
3.14
1.5
0.001
```

|Type|Taille|Précision|
|---|---|---|
|float32|32 bits|~7 chiffres décimaux|
|float64|64 bits|~16 chiffres décimaux|

> [!tip] `float64` est le plus utilisé en pratique.

---

## Autres types numériques utiles

|Type|Description|
|---|---|
|byte|Alias de uint8 (souvent utilisé pour données binaires)|
|rune|Alias de int32 (utilisé pour caractères Unicode)|
|uint|Entier non signé (32 ou 64 bits selon machine)|
|int|Entier signé (32 ou 64 bits selon machine)|

> [!tip] On utilise le plus souvent simplement **`int`**.

---
## Type booléen (vrai/faux)

Un **booléen** représente une valeur logique avec seulement deux états :
- `true` → vrai
- `false` → faux

Exemple :

```go
var vivant bool = true
```

> [!tip] Très utilisé dans les conditions (`if`) pour représenter des états (actif/inactif, connecté/déconnecté…)

---
## Type string (texte)

Le type `string` permet de stocker du texte :

```go
var nom string = "Alice"
var nom string = "The cow jumped over the moon"
var nom string = "1998"
var nom string = "3.14"
```

> [!warning] Une string peut contenir des caractères représentant des nombres mais ça reste seulement des caractères (`bytes`), pas des `int` ou des `float`.

---
## Exemple

```go
package main

import "fmt"

func main() {
    var age int = 25
    var taille float64 = 1.75
    var nom string = "Bob"
    var etudiant bool = true

    fmt.Println(age, taille, nom, etudiant)
}
```

