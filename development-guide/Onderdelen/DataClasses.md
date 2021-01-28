# DataClasses

Alle bestanden onder de map ./src/simulation/DataClasses worden gebruikt om de de bestanden die worden geüpload op de pagina te verwerken naar een handiger formaat. We kunnen deze klassen opdelen in twee soorten: de "blauwdrukken" en de "fabrieken".

# Blauwdrukken

Deze bevatten geen methods en worden dus enkel gebruikt om bepaalde data steeds op dezelfde manier op te slaan. In deze category horen volgende klassen:

- HawserData.js
- FenderData.js
- ShipData.js
- TimePoint.js

Wanneer we in onze Data-klasse (zie later) de data uit onze geuploadde bestanden verwerken, maken we voor **elke record** een TimePoint-object aan. Deze ziet er als volgt uit:

```jsx
import ShipData from './ShipData';

export default class TimePoint {
    constructor(
        hawserDataArray,
        fenderDataArray,
        posShipX,
        posShipY,
        rotationShip
    ) {
        this.hawserData = hawserDataArray;
        this.fenderData = fenderDataArray;
        this.shipData = new ShipData(posShipX, posShipY, rotationShip);
    }
}
```

We zien hier dat het aanmaken van een TimePoint vijf parameters vraagt. 

- hawserDataArray
Deze array bestaat uit een array met daarin HawserData-objecten voor elke tros in de simulatie.
- fenderDataArray
Analoog aan hawserDataArray
- posShipX
De x-positie van het schip in het gespecificeerde record.
- posShipY
De y-positie van het schip in het gespecificeerde record.
- rotationShip
De rotatie van het schip in het gespecificeerde record.

De laatste drie parameters worden gebruikt om een ShipData-object aan te maken. 

```jsx
				________________________TimePoint____________________
				|                           |                       |
    hawserData[]               fenderData[]             shipData
```

# Fabrieken

De fabrieken worden gebruikt om aan de hand van de blauwdrukken, de data in de geuploadde bestanden te verwerken naar handiger formaat. We hebben drie klassen:

- MetaData.js
- EventCollection.js
- Data.js

## MetaData.js

Deze klasse haalt alle belangrijke gegevens uit het geuploadde XLSX-bestand op en verwerkt ze in een MetaData-object. Hier zijn de twee belangrijkste methods de .load() en .interpretFile(). De .load() method start het verwerken van de data. Hierin wordt eerst en vooral .interpretFile() aangeroepen. Deze method overloopt elke waarde van de A kolom zolang deze geen lege kolom tegen komt. Voor elke cel wordt er gekeken of de bijhorende waarde overeenkomt met een titel in this.fileTitles, voorgedefinieerd in de constructor van deze klasse.

Aanpassen van de structuur van het XLSX-bestand
Omdat het interpreteren van het XLSX-bestand is gebaseerd op de tussentitels, is het belangrijk dat volgende zaken in acht worden genomen bij het veranderen van de XLSX-structuur:
1) In de A kolom mogen geen lege velden staan. Het programma stopt namelijk met inlezen zodra een leeg veld wordt gevonden.
2) Elk nieuw onderdeel van de XLSX-structuur moet een eenduidige titel hebben die zich bevind in de A kolom, direct aansluitend aan het vorig onderdeel.
3) Deze titel wordt dan ook toegevoegd aan this.fileTitles in de constructor van de MetaData-klasse adhv een key-value pair bv.:  windCoeff: 'Windcoefficienten Vlugmoor'
4) Een nieuwe method wordt aangemaakt in de MetaData-klasse. Hierin wordt relatief aan de locatie van de titel, te vinden in this.fileTitleLocations met de analoge key als in this.titleLocations, de nodige gegevens uitgelezen en samen als een object teruggegeven op het einde van de method.
5) Tot slot voegen we de naam van het onderdeel toe in de constructor als een leeg object of array, wijzen we aan deze property het teruggegeven object uit onze pas gemaakte method toe  in de .load() en voegen we deze property ook toe in de get() method.

Werkwijze wordt duidelijk bij het bekijken van de analoge voorbeelden in MetaData.js.

## Data.js

Dit is de klasse om het algemene Data-object te maken. Per simulatie wordt dit object slechts een keer aangemaakt. In de constructor zien we direct de drie onderdelen van dit object:

- this.caseMetaData = caseMetaData
Een MetaData-object dat wordt meegegeven als parameter bij het maken van een nieuw Data-object
- this.timePoints = []
Hier worden alle TimePoint-objecten in toegevoegd.
- [this.events](http://this.events) = new EventCollection(...)
Een object van de EventCollection klasse (zie later)

Deze klasse heeft slechts twee methods: .get() en .addTimePoints(). Deze laatste wordt. gebruikt om het object te vullen met data. Daarom worden volgende parameters gevraagd:

- dataCoords: 2D array met de coordinaten van de trossen. Bv. voor de tweede tros: x = dataCoords*[time]*[tros*2], y = dataCoords[time][tros*2+1]
- dataForces: 2D array met de krachten op de trossen dataForces[time][tros]
- shipTranslation: 2D array met de beweging van het schip x = shipTranslation[time][0], y = shipTranslation[time][1], rotation = shipTranslation[time][2]

Deze method overloopt elke record en maakt voor elke tijdsstap eerst een HawserData-object aan, dan een FenderData-object en tot slot met o.a. behulp van deze twee objecten wordt ook een TimePoint-object aangemaakt. Dit TimePoint-object wordt dan toegevoegd aan this.timePoints. Tijdens het aanmaken van het HawserData- en FenderData-object worden ook respectievelijk this.events.checkHawserForEvent en this.events.checkFenderForEvent aangeroepen. Wat de bedoeling hiervan is kan u in de volgende sectie lezen.

## EventCollection.js

Hier worden de events in de simulatie vastgelegd. Dit zijn  de momenten dat een tros of een fender een bepaalde limiet overschrijdt. Zoals eerder gezegd worden de .checkHawserForEvent() en .checkFenderForEvent() aangeroepen bij het aanmaken van corresponderende objecten. Wat deze methods doen is kijken of er een event plaatsvind bij die bepaalde tros of fender op dat bepaald tijdspunt. Indien dit zo is wordt er een event-object aangemaakt via de .constructLimitEvent() method en vervolgens toegevoegd aan de juiste array van het EventCollection-object.