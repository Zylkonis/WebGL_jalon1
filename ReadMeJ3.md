Rémy Martin - Téo Itsweire

# 3eme jalon
## Attendu du jalon

Pour ce dernier jalon d'A3D, nous devions rajouter des nuages dans notre scene pour cela ils nous étaient demandés de :

 - Définir une zone hexaédrique d'une épaisseur paramétrable afin de définir la zone de nuage. L'altitude de celle-ci étant paramétrable elle aussi.
 - Réaliser un lancer de rayon volumique basique (front-to-back) dans ce volume.
 - Générer un nuage en pré-calcul (Sphères + Perlin3D).
 - Améliorer le rendu en prenant en compte l'éclairage.
 - Mettre plusieurs nuages et animer leurs déplacements (juste les déplacements, pas de déformations).

## Rendu du jalons
Nous avons réalisé tous les attendus du jalon en essayant de rendre le paramétrage des nuages le plus complet possible.
### Définir un zone hexaédrique représentant la zone de nuage
Nous avons crée un cube manuellement (vertex, face, texture, etc...), et avons intégré son paramétrage (hauteur, largeur/longueur, et distance dans les airs) directement dans l'interface.
### Réaliser un lancer de rayon volumique basique
Nous avons effectué un ray marching qui simule l'absorbtion de la lumière par les nuages en fonction de leurs épaisseurs. Nous donnons aussi la possibilité de modifier différents paramètres de rendus comme la densité ou l'absorbtion.
### Générer un nuage en pré-calcul
Un nuage est généré comme un ensemble de sphères aux coordonnées et rayons aléatoires (limité à la zone hexaédrique), auxquelles s'ajoutent un bruit de perlin généré aléatoirement. Ce calcul s'effectue une fois, avant la génération visuelle, par soucis d'optimisation.
### Améliorer le rendu en prenant en compte l'éclairage
Les nuages possèdent aussi un light marching dans leur shader simulant une lumiere venant du dessus.
### Mettre plusieurs nuages et animer leurs déplacements
Nous avons enfin ajouté une option "d'animation" qui simule de façon très simplifié les mouvements un nuages en faisant boucler leurs coordonées.

## Options dans l'interface

### Skybox color
Permet de changer la couleur de la skybox

### Number of clouds
Permet de changer le nombre de nuages. \
(attention, il faut reconstruire le nuage après changement)

### Clouds resolution (attention tres experimental)
Permet de changer la résolution du nuage, c’est-à-dire le nombre d'échantillonnages dans le perlin noise par la texture 3D.
Toutes les valeurs ne fonctionnent pas correctement. \
(attention, il faut reconstruire le nuage après changement)
 
### Clouds distance in the air
Permet de changer la distance en l'air du nuage.
 
### Clouds height
Permet de changer la hauteur du nuage. \
(attention, il faut reconstruire le nuage après changement)
 
### Clouds size
Permet de changer la taille du nuage. \
(attention, il faut reconstruire le nuage après changement)

### Regenerate clouds
Permet de reconstruire le nuage, c'est une option nécessaire pour appliquer les changements de plusieurs paramétrages.

### Clouds color
Permet de changer la couleur du nuage.

### Clouds density
Permet de changer le multiplicateur de la profondeur du nuage dans le ray marching. \
(Les zones denses diffusent moins de lumière)

### Clouds depth
Permet de changer le multiplicateur de la profondeur du nuage dans le ray marching. \
(les parties profondes sont plus sombres) 

### Clouds absorption
Permet de changer le multiplicateur de l'absorption du nuage dans le ray marching.

### Clouds transmittance
Permet de changer le multiplicateur de transmittance du nuage dans le ray marching. \
(Atténuation de la lumière à travers le nuage)

### Funny but strange clouds (experimental)
Fonctions rajoutées pour la blague suite à un bug qui donnait des nuages allant plus vite, en fonction de leurs hauteurs
Dans la zone, ce qui est censé être plus physiquement correct. Cependant, l'implémentation actuelle les déforme de plus
En plus, il est surtout présent comme une blague.

### Light marching for clouds
Options pour activer/désactiver le light marching.

### Clouds angle
Change l'angle de déplacement des nuages.

### Clouds speed
Change la vitesse de déplacement des nuages.