# Server

De server is een express server geschreven in typescript met een node.js environment en een mongoDB database. 

# Models 

In ./src/server/models/mongoose staan de modellen voor de mongoDB database hierin staan welke key - value pairs de database opslaat en of ze verplicht zijn en van welk type ze zijn. Ook extra functionaliteiten zoals hashen van wachtwoorden gebeuren hier.

# Api 

In ./src/server/api/controllers staan de controllers voor de data. Deze bepalen hoe je de data Create, Read, Update en Delete. De controller functies worden dan in de router ./src/server/api/router in het bestand ApiRouter.ts gekoppeld aan de juiste route die je dan van in de client aanspreekt.

