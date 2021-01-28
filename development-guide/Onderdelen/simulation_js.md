[< Terug](../Development-guide.md)

# simulation.js

Locatie: ./client/src/pages/simulation.js

Hier wordt onze simulatie pagina in feite geïnitialiseerd. Het grootste deel van deze file staat in een functie (export default () → {...}) Dit omdat deze functie wordt gebruikt door het Handlebars framework om de pagina te initialiseren. Dit bestand is tevens opgedeeld in verschillende delen.

# Render page

Hier worden de nodige stappen ondernomen om de pagina te renderen volgens een gedefinieerd sjabloon.

# Functions

## appInit()

Deze functie wordt aangeroepen wanneer alle bestanden zijn ingeladen. Als parameters wordt een Simulation- en een files-object meegegeven. Deze laatste is van de vorm:

```jsx
{
	"metaData": {...}, // MetaDat-object
	"forces": [...], // Inhoud van forces-bestand
	"coords": [...], // Inhoud van coords-bestand
}
```

In deze functie wordt eerst en vooral een Control-object aangemaakt en alle verschillende controls worden geregistreerd. Voor meer informatie over de Control-klasse zie het stukje over SimulationClasses.

Vervolgens worden de coordinaten en rotatie-waarden van het schip uit de files.forces gehaald. De reden hiervoor is dat deze gegevens zich in hetzelfde bestand samen met de forces bevinden. We moeten deze dus tijdig scheiden

Daarna wordt een Data-object geïnitialiseerd met behulp van het MetaData-object. Later worden de records hier ook aan toegevoegd via de .addTimePoints() method. Ook wordt er een waarde toegewezen aan de variabele serverData. De data die in deze variabele zit wordt later geüpload naar de server.

Tot slot starten we de simulatie door het Data-object eraan toe te voegen, de .init() method aan te roepen, de schepen al te laten tekenen en de animatie op play te zetten.

## filesHaveLoaded()

Hier wordt gekeken of alle bestanden succesvol zijn ingeladen. Indien dit zo is, wordt .appInit() aangeroepen.

## getParsedCSVData()

Deze functie converteert een csv bestand naar een nested array.

# Begin script

Vanaf hier worden alle commando's chronologisch uitgevoerd. De functies die we hierboven bespraken zullen hier ook aangeroepen worden.

Het eerste stukje configureert de dimensies en de kleur van het canvas-element.

Daarna maken we een [eventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventListener) voor ieder file-input-element waar een bestand zal worden geüpload. Deze eventListener dienen enkel voor het genereren van de animatie op de knop wanneer een bestand succesvol is geselecteerd. Daarna wordt echter een eventListener gezet op de submit-knop. Wanneer deze wordt ge-'click't wordt voor elke file-input-input een functie gedefinieerd dat zal worden aangesproken wanneer het desbetreffende bestand volledig is ingeladen in de browser. Voor het XLSX-bestand zal deze functie een metaData-object aanmaken en toewijzen aan files.metadata. Voor de andere twee csv-bestanden wordt een array gegenereerd via de getParsedCSVData() functie. Deze worden dan ook aan het files-object toegevoegd. Tot slot wordt in elke onload-functie filesHaveLoaded() aangeroepen zodat appInit() zal worden aangeroepen als alle bestanden zijn ingeladen.

Tot slot halen we alle knop-elementen op voor het openen van de twee popups. Wat daarna volgt is de logica voor het al dan niet tonen van deze popups.

[< Terug](../Development-guide.md)