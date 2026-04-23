# TP-TIE
## Que hace?
- Recomienda música en base al resultado del último partido jugado del equipo seleccionado
## NUESTRA API
- localhost:3000/api/equipo/{equipo_id}
### Ejemplo de Respuesta de nuestra api

Al hacer una petición a `localhost:3000/api/equipo/135179` (Vélez Sarsfield), la API devuelve un JSON estructurado de la siguiente manera:

```json
{
  "resultado": "GANO",
  "partido": {
    "strEvent": "Vélez Sarsfield vs Central Córdoba de Santiago del Estero",
    "strHomeTeam": "Vélez Sarsfield",
    "strAwayTeam": "Central Córdoba de Santiago del Estero",
    "intHomeScore": "1",
    "intAwayScore": "0",
    "dateEvent": "2026-04-14"
  },
  "playlists": [
    {
      "name": "Pump It Up 2026",
      "description": "Hottest & Fresh New Music Everyday...",
      "external_urls": {
        "spotify": "[https://open.spotify.com/playlist/](https://open.spotify.com/playlist/)..."
      }
    },
    {
      "name": "ROCK PUM PARA ARRIBA! ALEGRÍA!",
      "description": "MÚSICA ALEGRE Y DE CARÁCTER OPTIMISTA...",
      "external_urls": {
        "spotify": "[https://open.spotify.com/playlist/](https://open.spotify.com/playlist/)..."
      }
    }
  ]
}
``` 
## Apis externas usadas
- _**https://www.thesportsdb.com/free_sports_api**_
- _**https://developer.spotify.com/**_

## Pasos para abrir la Api 
1. Crear archivo .env con las keys necesarias
2. Correr el  servidor  con node server.js donde levanto los nombres de los equipo con sus atributos en un archivo json
3. Abrir el archivo de index.html para iteracturar con la Api

# Consideraciones
- Al usar la versión gratuita de la api de sportsdb.com puede ocurrir que los partidos estén desactualizados.
