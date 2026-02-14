---
tags:
  - terminal
  - shell
  - json
  - commandes
  - curl
  - jq
  - grep
  - sort
  - wc
  - chmod
  - rev
title: Combiner des commandes - Tuto
---

### Cas pratique : Récupérer et filtrer des données JSON

<br>

Le **JSON** (JavaScript Object Notation) est un format de texte pour représenter des données.

Exemple de fichier texte au format **JSON** :

```json
"employee_id": 1,
    "name": "Employee 1",
    "age": 28,
    "position": "Analyst",
    "department": "IT",
    "manager": "Diana Prince",
    "contact": {
      "email": "employee1@company.com",
      "phone": "+1-202-555-1001"
    },
    "address": {
      "street": "609 Main St",
      "city": "Phoenix",
      "zip_code": "32121",
      "country": "USA"
    },
```

<br>

Pour cet exercice nous allons utiliser le fichier en ligne suivant qui contient une **liste d'employés** :

**https://files.jsons.live/employees/5-level/1-MB/minified.json**

<br>

On aimerait savoir quelles sont les **villes** où habitent les employés, mais il y a plus de 1000 employés dans la liste donc ça serait très long de vérifier à la main chaque ville. Pour ce faire nous allons utiliser une **combinaison de commandes** dans le terminal grâce au pipe **`|`** (tube).

<br>

On récupère le contenu du fichier json avec la commande **`curl`** :

```bash
curl -s https://files.jsons.live/employees/5-level/1-MB/minified.json
```

<br>

Pour simplifier la suite on va stocker le lien du fichier dans une variable nommée **`URL`** :

```bash
URL='https://files.jsons.live/employees/5-level/1-MB/minified.json'
```

<br>

Et on utilisera la variable **`URL`** qui contient l'url du fichier comme ceci avec un **`$`** devant :
Le résultat est le même.

```bash
curl -s $URL
```

<br>

On obtient alors tout le fichier brute pas formaté et difficilement lisible :

```json
...
work_history":[{"company":"Company 1","role":"Role 1","duration":"2 years"}],"projects":[{"project_id":"P11811","name":"Project 1","status":"Ongoing","tasks":[{"task_id":"T118111","description":"Task 1 for Project 1","status":"In Progress","subtasks":[{"subtask_id":"ST1181111","name":"Subtask 1","status":"Completed"}]},{"task_id":"T118112","description":"Task 2 for Project 1","status":"In Progress","subtasks":[{"subtask_id":"ST1181121","name":"Subtask 1","status":"In Progress"}]}]}]}]%
```

<br>

On obtient un meilleur affichage en ajoutant après un pipe **`|`** la commande **`jq`** qui formate correctement le json, la sortie de **`curl`** devient alors l'entrée de **`jq`** :

```sh
curl -s $URL | jq 
```

```json
...
  {
    "employee_id": 1181,
    "name": "Employee 1181",
    "age": 48,
    "position": "Designer",
    "department": "IT",
    "manager": "Alice Johnson",
    "contact": {
      "email": "employee1181@company.com",
      "phone": "+1-202-555-2181"
    },
    "address": {
      "street": "761 Main St",
      "city": "Houston",
      "zip_code": "11417",
      "country": "USA"
    },
...
```

<br>

On remarque que le fichier **JSON** est structuré de cette manière :

```json
[
  { ... }, # données de l'employé 1
  { ... }, # données de l'employé 2
  { ... }, # données de l'employé 3
  { ... }  # ...
]
```

<br>

Et que la ville de chaque employé est écrite dans le champ **city** :

```json
      "city": "Houston",
```

<br>

Pour récupérer toutes les villes on peut utiliser la commande **`grep`** avec l'argument **`city`** :

```sh
curl -s $URL | jq | grep city
```

<br>

On obtient une longue liste avec des doublons car plusieurs employés habitent dans la même ville :

```json
...
      "city": "Los Angeles",
      "city": "Los Angeles",
      "city": "Houston",
      "city": "Los Angeles",
      "city": "Los Angeles",
      "city": "Houston",
```

<br>

Grep cherche seulement du texte sans connaître les champs JSON structurés.
Une méthode plus fiable en évitant d'utiliser **`grep`** avec seulement **`jq`** :

```sh
curl -s $URL | jq -r '.[].address.city'
```

<br>

Pour éliminer les doublons et obtenir les villes qui contiennent des employés on peut ajouter la commande **`sort`** avec l'argument **`-u`** :

```sh
curl -s $URL | jq -r '.[].address.city' | sort -u
```

<br>

Voilà on a identifié toutes les villes où habitent des employés, il y en a cinq :

```json
Chicago
Houston
Los Angeles
New York
Phoenix
```

<br>

Maintenant essaye de trouver une combinaison de commandes pour trouver **combien d'employés habitent à Houston**. Pour t'aider tu peux utiliser la commande **`wc -l`** qui permet de **compter le nombre de lignes**. 



<br>

### Descendre tout en bas pour révéler la solution
<div style="margin-top:2000px;"></div>

<br>

### Solutions possibles

```bash
curl -s $URL | grep -o '"city":"Houston"' | wc -l
```

```bash
curl -s $URL | jq -r '.[].address.city' | grep Houston | wc -l
```

```bash
curl -s $URL | jq -r '.[].address.city' | grep -c '^Houston$'
```

```bash
curl -s $URL | jq '.[] | select(.address.city=="Houston") | 1' | wc -l
```

```bash
curl -s $URL | jq '[.[] | select(.address.city=="Houston")] | length'
```

⚠️ Les solutions utilisant **`grep`** sont moins fiables dans ce cas précis car **`grep`** n'est pas spécialisé dans le traitement de données **JSON** contrairement à **`jq`**.

<br>

### Le script bash

Vous pouvez mettre votre commande dans un fichier pour créer un **script bash** pour la sauvegarder et l'utiliser sans avoir besoin de la réecrire à chaque fois :

Création d'un fichier **`countHouston.sh`** de **script bash** (c'est comme un mini programme)

```bash
#!/bin/bash

URL='https://files.jsons.live/employees/5-level/1-MB/minified.json'

curl -s $URL | jq '[.[] | select(.address.city=="Houston")] | length'
```

Ajouter les droits d'exécution sur votre **script bash**

```
chmod +x countHouston.sh
```

**Utilisation**

```bash
./countHouston.sh
216 # nombre d'employés habitant à Houston
```

Votre **script bash** peut alors être automatisable et être utilisé dans de nouvelles combinaisons de commandes :
```bash
➜  ~ ./countHouston.sh | rev
612
```

<br>

### Conclusion

Le pipe **`|`** et la création de **script bash** sont souvent indispensables pour réaliser des tâches puissantes ou résoudre des problèmes complexes.