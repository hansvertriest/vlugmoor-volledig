[< Terug](../Development-guide.md)

# Mappenstructuur

Hier bespreken we de verschillende mappen binnenin het project en hun functie.

# ./client

Deze map bevat alles wat we nodige hebben voor de opbouw van de website. Hiervoor gebruikten we Handlebars: een web-framework dat ons toelaat om met sjablonen te werken in plaats van de normale lineaire HTML. 

We vinden hier allerlei mappen en bestanden:

- ./client/assets
De statische benodigdheden voor de website. Voornamelijk afbeeldingen.
- ./client/src
Dit is de absolute kern van de website. Hier bevinden zich alle javascript-, handlebar- en scss-bestanden.
- ./client/node_modules en ./client/package.json
Hier bevinden zich alle externe bibliotheken die we gebruiken in dit project.
- Overig
Overige bestanden zijn vooral nuttig voor de configuratie van het project

## ./client/assets

In deze map bevinden zich alle statische assets. Dit zijn voorlopig enkele afbeeldingen.

## ./client/src

Dit is de absolute kern van de website. Hieronder een overzicht. Merk op dat de mappen gemarkeerd in het rood normaliter niet bewerkt moeten worden. Dit zijn dan ook vaak mappen die voor de onderliggende werking van het project zorgen.

- ./client/src/assets
Een tweede assets map zoals hierboven beschreven
- ./client/src/lib
    - /api
    De code om data op te halen en op te laden van en naar de server. Dit wordt gedaan a.d.h.v. de [fetch api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
    - /core
    Deze map wordt door handlebars gebruikt om de html samen te stellen.
- ./client/src/pages
Dit zijn de javascript bestanden die de verschillende pagina's van de website initialiseren. Van hieruit wordt handlebars aangeroepen om a.d.h.v. een bepaald sjabloon (*template*) de juiste HTML samen te stellen. Verder worden in deze bestanden ook de logica van de website aangeroepen. Zoals het ophalen van data via de /api map (zie hierboven) of het initialiseren van de simulatie.
- ./client/src/scss
De verzameling van alle stijlen voor de website. Dit wordt gedaan met [SASS](https://sass-lang.com/guide) (extensie: .scss).
- ./client/src/simulation
Hier staan de twee mappen Data- en SimulationClasses die we in latere hoofdstukken bespreken. Deze mappen bevatten de functionaliteiten voor de simulatie.
- ./client/src/templates
De handlebars-sjablonen (extensie: .hbs). Deze helpen ons om variabele data in onze HTML te injecteren.
- ./client/src/*
De overige bestanden dienen ter initialisatie van de gehele website.

## ./client/node_modules en ./client/package.json

Hier bevinden zich alle externe bibliotheken die we gebruiken in dit project. 

Wanneer we in python de package numpy willen installeren typen we dit in onze command line:

```python
pip install numpy
```

 In webdevelopment doen we iets gelijkaardig a.d.h.v. npm (Node Package Manager). We gebruiken bijvoorbeeld een package genaamd xlsx dat XLSX-bestanden voor ons inleest. Analoog zoals bij python typen we in de command line:

```python
npm install xslx
```

Dit zal als volgt de package xslx installeren. Deze installatie bestaat uit twee belangrijke delen:

1. Het downloaden van de package naar de node_modules folder.
2. Het toevoegen van de naam en versie van de package in package.json onder "dependencies"
Analoog staat in dit bestand ook "devDependencies". Dit zijn de geïnstalleerde packages die enkel voor development doeleinden worden gebruikt.

Aanvankelijk zullen we dus al deze packages of dependencies moeten installeren vooralleer we van start kunnen met het project. Dit doen we door volgend commando uit te voeren in het het ./client mapje.

```python
npm install
```

Verder is in deze package.json nog het onderdeel "scripts" belangrijk. dit zijn die commando's die we kunnen uitvoeren om het project op te starten, testen, bundlen, etc... We zien hier drie opties:

- "build"
Deze zal het hele project compileren naar slechts enkele bestanden. Op deze manier krijgen we een simpel project met een index.html bestand dat we gemakkelijk online kunnen zetten. Dit versimpeld project wordt gecompileerd naar het ./docs mapje op het zelfde niveau van het ./client mapje.
- "start:dev-two" en "start:dev"
Beide zullen een development server opstarten. Deze zorgt ervoor dat de website toeganeklijk is in de browser terwijl we aanpassingen doen in de broncode. Je kan de website in de browser openen door **[localhost:8000](http://localhost:8000)** als url in te geven**.** Wanneer deze server draait zullen ook automatisch alle wijzigingen die in de bestanden worden gemaakt worden toegepast in de browser.

## ./client/src/*

Dit zijn configuratie bestanden die over het algemeen onaangepast mogen blijven. 

# ./docs

Hier staat een gecompileerde versie van de ./client map. Deze map wordt gebruikt om de website online te zetten. Zo wordt deze rechtstreeks door Github ingelezen en online geplaatst. Wanneer we in productie gaan wordt deze map op een server gezet.

# ./server

Deze map bevat alle code voor de server.

[< Terug](../Development-guide.md)