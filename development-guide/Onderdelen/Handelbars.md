[< Terug](../Development-guide.md)

# Handelbars

De HTML is opgebouwd met handlebars dat is een templating language waarmee je makkelijker
componenten kan hergebruiken. Onder de map ./src/templates staat alle .hbs code. Hierin 
staat een map partials dit zijn stukken html die we veel gebruiken zoals een header of footer (bovenste en onderste deel van pagina). We coderen in de map partials deze herbruikbare componenten en je kan deze dan gebruiken in de templates door =>
{{> naam van bestand zonder .hbs}} te typen. In de helpers staat een routerLink.js bestand dit is een functie die ervoor zorgt dat je ook kan linken via handlebars naar een andere pagina door {{routerLink "simulation/new" "Upload nieuwe simulatie"}} te doen. 
Tussen de eerste aanhalingstekens zet je de route en tussen de tweede de tekst die in de html moet verschijnen dit is in de browser een <a></a> tag en in de css dus ook.

Dit is een link naar de handlebars documentatie.
https://handlebarsjs.com/guide/


