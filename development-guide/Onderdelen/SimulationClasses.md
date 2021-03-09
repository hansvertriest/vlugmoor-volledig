[< Terug](../Development-guide.md)

# SimulationClasses

Hier bevinden zich de klassen die adhv de verwerkte data een beeld zullen vormen op het scherm. Ook hier kunnen we twee soorten onderscheiden: component-klassen en operationele-klassen.

# Component-klassen

Deze representeren verschillende componenten die visueel op het beeld getoond worden:

- Fender.js
- Hawser.js
- Kaai.js
- LoadingSceen.js
- Ship.js

Elk van deze klasse zijn gelijkaardig opgebouwd. Veel voorkomende methods zijn:

- this.draw()
Om het object op het scherm te tekenen. Deze method wordt voor elke frame van de animatie uitgevoerd.
- this.loadImage()
Indien een object afbeeldingen bevat worden die met deze method ingeladen
- setters
Methods zoals setPosX(), setPosY, setDirection() ... om parameters van het object aan te passen
- Andere
Elke method is vrij duidelijk en eenduidig waarvoor deze dienen. Deze zijn tevens ook telkens gedocumenteerd in de code.

Voor het effectief tonen van de simulatie maken we gebruik van het [HTML5 canvas](https://developer.mozilla.org/nl/docs/Web/API/Canvas_API). Dit is een interface ingebouwd in browsers die ons toe laat om geavanceerde tekeningen te maken. Om voldoende te begrijpen hoe de component-klassen zich uiteindelijk vertalen in een grafische voorstelling wordt het aangeraden om de documentatie hiervan eens door te lezen. 

Hoe en wanneer deze methods worden gebruikt wordt duidelijk in het stukje over de operationele klassen. Deze maken namelijk gebruik van de component-klassen om uiteindelijk een werkende animatie te bekomen. 

# Operationele-klassen

De operationele klassen combineren de verschillende component-klassen om de uiteindelijke simulatie te genereren. Er zijn er drie:

- SimulationContext.js
- Simulation.js
- Controls.js

## SimulationContext.js

Dit is de context waarin de simulatie wordt gedraaid. Hier wordt eerst en vooral het canvas waar de simulatie op getekend zal worden, geconfigureerd. Ook staan hier de variabelen om algemene parameters van de simulatie aan te passen zoals onder andere de fps waarop de simulatie oorspronkelijk draait, de schaal in het begin van de simulatie, de snelheid van de simulatie aangeduid als this.animationTimeInterval en de positie van de origin uit het model op het canvas. 

Hier vinden we ook de methods die verantwoordelijk zijn voor de conversie van model waarden (afstanden en coordinaten in meter) naar waarden in de simulatie/op het canvas (afstanden en coordinaten in pixels). Daarbij vinden we hier ook de methods om de origin op het canvas te verplaatsen en de schaal aan te passen.

## Simulation.js

Dit is het hart van de simulatie. Hier komen alle andere klassen samen. De methods hier kunnen we in verschillende categorieën opdelen:

**GENERAL**
Dit zijn algemene methods voor het initiëren/stoppen/starten/screenshot nemen/ info opvragen van de simulatie. 

Ook vinden we hier de this.addData() method waarmee we data in de vorm van een Data-object kunnen toevoegen aan de simulatie. In deze method worden dan direct ook de verschillende componenten (trossen, fenders, schepen) uit deze data aan de simulatie toegevoegd.
Tot slot is de method om een screenshot van de volledige simulatie te maken hier ook terug te vinden.

### **SETTING EN GETTING ANIMATION TIME**

Dit zijn de methods verantwoordelijk voor het updaten van de tijd van de simulatie. In de methods waar de tijd wordt gewijzigd zal u steeds als laatste een blokje code zien die callback-functies uitvoert. Dit zijn specifieke functies die er voor zorgen dat bijvoorbeeld de tijdlijn wordt aangepast wanneer de tijd verandert. Zo'n functies kunnen zelf toegevoegd worden via de Controls-klasse. Later hier meer over.

### **COMPONENTEN MAKEN EN TOEVOEGEN AAN DE SIMULATIE**

Zoals we eerder zeiden wordt in this.addData() de verschillende componenten van de simulatie toegevoegd. Dit gebeurt via de methods die we in deze categorie terugvinden. Deze methods nemen allemaal als parameters de data dat nodig is om een Component(Hawser, Fender, ship)-object aan te maken. Deze objecten worden aangemaakt en vervolgens gepusht in een array die deze zal bijhouden. Voor sommige componenten worden ook al direct de correcte afbeeldingen ingeladen.

### **TEKENEN VAN DE COMPONENTEN OP DE CANVAS**

Hier staan de methods die voor alle componenten van de simulatie de .draw() method gaan aanroep om zo de componenten op de canvas te tekenen. Voor elk type component bestaat er een method: drawFenders(), drawHawsers(), drawKaai(), drawShips(). Bijkomend is er ook nog een setBackgroundColor() method die de achtergrondkleur zal instellen.

### **SNELHEID VAN DE ANIMATIE CONTROLEREN**

Om de snelheid van de animatie te controleren hebben we ook enkele methods nodig. Het beheersen van de fps doen we als volgt:

FPS (frames per second) control
De animatie-loop (zie later) laten we op onbeperkte snelheid draaien. Hierin wordt de canvas telkens volledig gewist en vervolgens een geüpdatet simulatie opgetekend. Op deze manier krijgen we een animatie. Om de FPS te controleren houden we bij hoe lang het geleden is dat we een vorige frame hebben getekend. Daarbij berekenen we voor een voorgestelde fps een .fpsIntervalInMilS bij (hoelang een frame op het scherm mag blijven) Dan kunnen we in deze animatie-loop steeds kijken of de tijd sinds het laatst tekenen van de frame groter is dan .fpsIntervalInMilS. Indien ja, is het tijd om een nieuwe frame te tekenen. Deze procedure van het checken of een nieuwe frame getekend mag worden is vervat in .fpsIntervalIsElapsed(). Deze geeft een true of een false waarde terug afhankelijk of een nieuwe frame mag getekend worden. Wanneer we in onze animatie-loop steeds eerst deze check doen en enkel de teken commando's uitvoeren indien deze true is, krijgen we een animatie die op een vooringesteld fps draait.

Zo vinden we hier ook de .getAnimationSpeed() en de .setFPS() method.

### **ANIMATIE LOOPS**

Hier bevinden zich twee loops:

- .doLoading()
Deze tekent een laadscherm op de canvas
- .doAnimation()
Deze tekent de simulatie op het scherm. Eerst en vooral zal deze method kijken of we op het einde zijn van onze animatie. Zo ja wordt de simulatie gepauzeerd. Anders wordt er gekeken of de animatie op play (en niet op pauze) staat en of het reeds tijd is om een nieuwe frame te tekenen (zie FPS-control hierboven) Indien ja wordt eerst .updateSimulation() (zie hieronder) uitgevoerd en vervolgens wordt de tijd van de animatie aangepast. Dan gaan we over naar de tekenbewerkingen die de simulatie tekenen.

Dan hebben we ook nog de .updateSimulation() method. Deze update alle componenten naar de huidige staat van de simulatie. 

Belangrijk om te vermelden is dat de animatie-loops in stand worden gehouden door de ingebouwde method [window.requestAnimationFrame(loopFunction)](https://developer.mozilla.org/nl/docs/Web/API/Window/requestAnimationFrame). Deze is speciaal ontwikkelt om gecontroleerde infinite-loop te maken, ideaal voor animaties dus.

## Controls.js

Deze klasse is een tussenschakel voor de controls op de webpagina (tijdlijn, snelheid-,fps-inputvelden ...) en de innerlijke werking van de simulatie. Het is een goed idee om in deze klasse methods aan te maken die met de simulatie communiceren in plaats van rechtstreeks in het Simulation-object aanpassing te doen. De reden hiervoor is meer controle over welke variabelen op welke manier worden aangepast van buiten de simulatie.

### Register basic nav

Hier staan de methods om de basisch navigatie van het inzoomen en verslepen van de simulatie mogelijk te maken. Er wordt vooral gebruikgemaakt van AddEventListener. Dit is een method die het toelaat een functie te specifieren die moet worden uitgevoerd wanneer een bepaalde (mousedown, mousemove...) event optreed.

### Register controls

Elke method hier registreert een bepaalde knop of functie. Deze methods zijn vaak gelijkaardig opgebouwd. Eerst en vooral wordt de instantie van het HTML-element opgehaald. Dit wordt gedaan door [document.getElementById(ElementID) waar ElementID de id-atribuut van het html-element](https://developer.mozilla.org/nl/docs/Web/API/Document/getElementById) is. Vervolgens wordt dan bepaald welke commando's er moeten uitgevoerd worden wanneer op dit element wordt geklikt of wanneer dit element verandert (denk bij dit laatste aan een tekst-input-veld)

### Setting simulation parameters

Dit zijn de methods die effectief bepaalde variabelen in de simulatie gaan aanpassen. Deze methods worden toegepast in bovenstaande register methods.

### Getting simulation parameters

Deze methods worden gebruikt voor het verkrijgen van informatie over de simulatie.

[< Terug](../Development-guide.md)
