---
tags:
  - Go
  - initiation
  - compilation
title: 1. Présentation du Go
date: 2026-02-16
sort: 1
---
> [!debutant] Niveau Débutant

Le **Go** (**Golang**) est un langage **compilé**, **structuré**, **concurrent** et à **typage statique**, conçu par Google en 2009 pour créer des logiciels rapides et fiables. Grâce à ces caractéristiques, Go combine performance, clarté et sécurité. Contrairement à certains langages spécialisés, Go n’est pas limité à un domaine précis, ce qui en fait un langage polyvalent et efficace pour de nombreux types de projets, comme le développement Web, les services réseau et les logiciels systèmes.
![[Pasted image 20260217042531.png]]
## Définitions

> [!info] **Compilé**
> Le **code source écrit** doit passer par une phase de **compilation** avant de pouvoir être exécuté. C'est-à-dire que le **code source** est transformé en un **binaire exécutable** (du code machine). L'**exécutable** n’a plus besoin du **code source** pour s’exécuter.
>
> ![[Pasted image 20260217043027.jpg]]
>
> Le code machine d'un fichier exécutable produit par la compilation :
![[Pasted image 20260217043803.jpg]]

---

> [!info] **Structuré**
> Le contrôle du programme passe par des **blocs de code clairs** : séquences, conditions et boucles. Les instructions s’exécutent **dans l’ordre** (séquence). Les conditions et les boucles permettent de **contrôler le flux de manière lisible et sûre**. 
>
> ![[Pasted image 20260217043654.jpg]]

---

> [!info] **Concurrent**
> Le Go est connu pour sa capacité à gérer facilement la **concurrence**. Au cœur de cette puissance se trouvent les **goroutines**, des fonctions légères qui peuvent exécuter **plusieurs tâches en parallèle** avec une complexité réduite. 
>
> ![[Pasted image 20260217044524.png]]

---

> [!info] **Typage statique**
> **Un langage à typage statique** signifie que **le type de chaque variable est connu à la compilation**. Cela permet de détecter les erreurs avant l’exécution et rend le code plus sûr et prévisible.
>
> ```go
>// chaque variable a un type précis
>var a int = 5       // a est de type int, un nombre entier
>var b float64 = 2.5 // b est de type float64, un nombre à virgule
>
>// pour additionner a + b il faut d'abord convertir a en float64
> var c float64 = float64(a) + b
>}
>```

---
## Exemples de programmes Go

> [!info] **Hello World**
> Voici un exemple d'un programme [Hello world](https://fr.wikipedia.org/wiki/Hello_world "Hello world") écrit en Go :
>
>```go
>package main
>
>import "fmt"
>
>func main() {
>	fmt.Println("Hello world!")
>}
>```
> - `package main` → définit le package principal du programme. En Go, tout programme exécutable doit être dans `package main`.
> - `import "fmt"` → Importe le package `fmt` qui contient des fonctions pour afficher et lire du texte.
> - `func main()` → Déclare la fonction `main`, le point d’entrée du programme.
>- `fmt.Println` → affiche un message dans le terminal.


> [!info] **Hello World interactif**
> Ici le programme demande d'abord à l'utilisateur son prénom avant de lui dire bonjour.
>```go
> package main
>
> import "fmt"
>
>func main() {
>    var nom string
>
>    fmt.Println("Quel est ton prénom ? ")
>    fmt.Scanln(&nom)
>
>    fmt.Println("Bonjour,", nom, "!")
>}
>```
>- `var nom string` → crée une variable `nom` de type **chaîne de caractères**. (du texte)
>- `fmt.Println` → affiche un message.
>- `fmt.Scanln(&nom)` → lit ce que l’utilisateur tape et stocke dans `nom`.
>- `fmt.Println` → affiche un message avec le `nom` dedans.

---

## Comment compiler et exécuter un programme GO ?

Votre **code** doit être écrit dans un fichier *`*.go`* :
```sh
ls
projet.go
```

Utiliser la commande **`go build`** pour compiler votre code **`projet.go`** :
```sh
go build ./projet.go
```

Vous avez créer un fichier exécutable **`projet`**  :
```sh
ls
projet.go projet
```

Vous pouvez maintenant exécuter votre programme **`projet`** :
```sh
./projet
Hello world!
```

Vous pouvez compiler et exécuter en même temps avec la commande **`go run`** :
```sh
go run ./projet.go
Hello world!
```