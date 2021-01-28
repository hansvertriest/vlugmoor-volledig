# Development guide

# Introductie

Net zoals de code is deze development guide opgesplitst in twee delen. Enerzijds is er de client (de website) en anderzijds de server (opslaan en bewerken van simulaties) Voorlopig focussen we ons vooral op het client-gedeelte.

De uitleg over de client-side is opgesplitst:

- Mappenstructuur
Een overzicht van de verschillende mappen in het project en hun functies.
- Handlebars
Het templating-framework dat we hanteren om op een efficiëntere manier de html elementen de verwerken.
- simulation.js
Het bestand waarin de verschillende componenten van de simulatie worden geïnitialiseerd.
- DataClasses
Dit zijn alle klassen die worden gebruikt voor de verwerking van de input-data.
- SimulationClasses
De nodige klassen voor de opbouw van de effectieve simulatie.

Belangrijk bij aanvang van het project is om de juiste omgeving te installeren. Voor dit project hebben we Node nodig wat u [hier](https://nodejs.org/en/download/) kan downloaden. Na installatie beschikken we over een nieuwe command line tool genaamd npm. Met volgende commando's in de root van het project installeer je alle benodigdheden voor het project:

```python
cd ./client && npm install 
cd ./server && npm install 
```

Om dan de client op te starten doen we:

```jsx
// Navigatie naar de map
cd ./client  
// Starten van de client
npm run start:dev-two
// Terug navigeren naar de root
cd ..
```

Zo kunnen we ook de server starten

```jsx
// Navigatie naar de map
cd ./server  
// Starten van de server
npm run watch:serve
// Terug navigeren naar de root
cd ..
```

# Client-side

[Mappenstructuur](Development%20guide%207d4851063efe45409ffc5c8bff2eb250/Mappenstructuur%20556e20a5fd1544159f147d348779e635.md)

[Handelbars](Development%20guide%207d4851063efe45409ffc5c8bff2eb250/Handelbars%20f19adcea3b9f4d028400afcdca8efc05.md)

[DataClasses](Development%20guide%207d4851063efe45409ffc5c8bff2eb250/DataClasses%2052f2ed7c688343ba9d09abac2c0f908f.md)

[SimulationClasses](Development%20guide%207d4851063efe45409ffc5c8bff2eb250/SimulationClasses%2037227c283b6b4d0d99966276feb34952.md)

[simulation.js](Development%20guide%207d4851063efe45409ffc5c8bff2eb250/simulation%20js%20948c0e1ce80845b5b0d5da22aa89f65f.md)

# Server-side