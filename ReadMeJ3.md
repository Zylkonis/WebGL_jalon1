# 3eme jalon
## Attendu du jalon

Pour ce dernier jalon d'A3D, nous devions rajouter des nuage a notre scene pour cela ils nous était demandés de :

 - Définir un zone hexaédrique d'une épaisseur paramétrable afin de définir la zone de nuage. L'altitude de celle-ci étant paramétrable elle aussi.
 - Réaliser un lancer de rayon volumique basique (front-to-back) dans ce volume.
 - Générer un nuage en pré-calcul (Sphères + Perlin3D).
 - Améliorer le rendu en prenant en compte l'éclairage.
 - Mettre plusieurs nuages et animer leurs déplacements (juste les déplacements, pas de déformations).

## Rendu du jalons
Nous avons réaliser tout les attendus du jalon en essayant de rendre le paramétrage des nuages le plus complet possible.
### Définir un zone hexaédrique représentant la zone de nuage
Nous avons crée une zone manuellement (vertex, face, texture, etc... dans le code)