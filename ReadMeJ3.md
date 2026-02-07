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
Nous avons crée une zone manuellement (vertex, face, texture, etc... dans le code)
### Réaliser un lancer de rayon volumique basique
Nous avons effectué un light marching qui simule l'absorbtion de la lumière par les nuages en fonction de leurs épaisseurs. Nous donnons aussi la possibilité de modifier différents paramètres de rendus comme la densité ou l'absorbtion.
### Générer un nuage en pré-calcul
Un nuage est généré comme un ensemble de sphères aux coordonnées et rayons aléatoires (limité à la zone hexaédrique), auxquelles s'ajoutent un bruit de perlin généré aléatoirement. Ce calcul s'effectue une fois, avant la génération visuelle, par soucis d'optimisation.
### Améliorer le rendu en prenant en compte l'éclairage
Nous avons donné l'option de placer la lumière au dessus des nuages et non pas au niveau de la caméra afin d'avoir un rendus plus réaliste.
### Mettre plusieurs nuages et animer leurs déplacements
Nous avons enfin ajouté une option "d'animation" qui simule de façon très simplifié les mouvements un nuages en faisant boucler leurs coordonées.