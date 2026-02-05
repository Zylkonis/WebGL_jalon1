# 1er jalon
## Attendu du jalon

Pour ce premier jalon d'A3D, il nous était demandé de faire :

 - La visualisation d'objets 3D
 - Height maps paramétrable depuis l'interface, avec un dégradé en fonction de la hauteur (couleur ou texture)
 - L'affichage en fil de fer (de l'objet et des heightmaps)
 - Bump map utilisant le modèle de Lambert
 - Shader Blin-Phong
 - Choix des height et bump map
 - Changement de la position de la lumière (optionnel)

## Rendu du jalons
Nous avons réaliser tout les attendus du jalon sauf l'optionnel.
### Visualisation d'objet 3D et leurs paramètres
Il est possible de visualiser des objets 3D, que ce soit avec une sélection préenregistrée dans le site web ou en chargeant un objet via un file picker et de changer sa couleur via un color picker.
Il est possible de changer le shader utilisé par l'objet, ainsi que de modifier les paramètres du shader Bling Fong depuis l'interface.
Nous avons enfin l'option de passer en mode de rendu "fils de fer" qui affiche le maillage de l'objet et du terrain (quand celui-ci est en mode height map).
### Bump maps et leurs paramètres
Pour les bump maps, il faut sélectionner l'option Bump Map dans les paramètres de terrain pour changer le mode de rendu du terrain.
On peut changer la bump map utilisée grâce à un filé picker et la couleur de cette dernière via un color picker.
Il faut aussi préciser que la Bump Map utilise le shader Bling Fong. Si le résultat n'est pas celui attendu, pensez à modifier les paramètres de Bling Fong pour obtenir le visuel que vous espérez.
### Height maps et leurs paramètres
Pour les height maps, il faut sélectionner Height Map dans les paramètres de terrain, ce qui nous change le mode de rendu.
Nous pouvons sélectionner une height map différente via un file picker et modifier la hauteur de cette dernière via un slider.
Enfin, il y a une case à cocher qui permet de changer le mode de rendu entre dégradé de couleur et dégradé de texture.
## Problemes du Jalon
Nous avons un bug étrange sur les height maps où une surimpression en miroir de la height map s'affiche sur le terrain, ce n'est pas un problème majeur car il n'influe en rien sur les height map en elles-mêmes, mais nous ne savons pas encore comment le régler.
Après plusieurs tests, nous savons que le problème se situe au niveau du shader, mais nous n'avons pas encore de solution.

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