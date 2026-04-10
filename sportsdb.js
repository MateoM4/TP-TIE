require('dotenv').config();
const { getRecommendations } = require("./spotify");
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// 1. Mapeo de los 30 equipos extraídos de tu JSON
const equipos = [
    { num: 1, id: "135150", nombre: "Aldosivi" },
    { num: 2, id: "135151", nombre: "Argentinos Juniors" },
    { num: 3, id: "135681", nombre: "Atlético Tucumán" },
    { num: 4, id: "135154", nombre: "Banfield" },
    { num: 5, id: "137771", nombre: "Barracas Central" },
    { num: 6, id: "135155", nombre: "Belgrano" },
    { num: 7, id: "135156", nombre: "Boca Juniors" },
    { num: 8, id: "137603", nombre: "Central Córdoba" },
    { num: 9, id: "135159", nombre: "Defensa y Justicia" },
    { num: 10, id: "137782", nombre: "Deportivo Riestra" },
    { num: 11, id: "135160", nombre: "Estudiantes de La Plata" },
    { num: 12, id: "137773", nombre: "Estudiantes de Río Cuarto" },
    { num: 13, id: "135161", nombre: "Gimnasia y Esgrima LP" },
    { num: 14, id: "137778", nombre: "Gimnasia y Esgrima (Mendoza)" },
    { num: 15, id: "135163", nombre: "Huracán" },
    { num: 16, id: "135164", nombre: "Independiente" },
    { num: 17, id: "137777", nombre: "Independiente Rivadavia" },
    { num: 18, id: "137786", nombre: "Instituto" },
    { num: 19, id: "135165", nombre: "Lanús" },
    { num: 20, id: "135166", nombre: "Newell's Old Boys" },
    { num: 21, id: "137775", nombre: "Platense" },
    { num: 22, id: "135170", nombre: "Racing Club" },
    { num: 23, id: "135171", nombre: "River Plate" },
    { num: 24, id: "135172", nombre: "Rosario Central" },
    { num: 25, id: "135173", nombre: "San Lorenzo" },
    { num: 26, id: "135175", nombre: "Sarmiento" },
    { num: 27, id: "136674", nombre: "Talleres de Córdoba" },
    { num: 28, id: "135177", nombre: "Tigre" },
    { num: 29, id: "135178", nombre: "Unión" },
    { num: 30, id: "135179", nombre: "Vélez Sarsfield" }
];

console.log("⚽ EL SELECTOR DE EQUIPOS ARGENTINOS ⚽");
console.log("-----------------------------------------");
equipos.forEach(eq => {
    // Formateamos para que la lista se vea prolija en consola
    console.log(`[${eq.num.toString().padStart(2, '0')}] ${eq.nombre}`);
});
console.log("-----------------------------------------\n");

// 2. Pedimos el input por consola
readline.question('Ingresa el número de tu equipo (1 - 30): ', async (inputNum) => {
    const seleccion = parseInt(inputNum);
    const equipoElegido = equipos.find(eq => eq.num === seleccion);

    if (!equipoElegido) {
        console.log("❌ Número inválido. Debes ingresar un número del 1 al 30.");
        readline.close();
        return;
    }

    console.log(`\n🔎 Buscando el último partido de ${equipoElegido.nombre}...`);

    try {
        // 3. Hacemos el Fetch a TheSportsDB
        const url = `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${equipoElegido.id}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            console.log("⚠️ No se encontraron partidos recientes para este equipo.");
            readline.close();
            return;
        }

        // Tomamos el partido más reciente (el primero de la lista)
        const ultimoPartido = data.results[0];
        
        const golesLocal = parseInt(ultimoPartido.intHomeScore);
        const golesVisitante = parseInt(ultimoPartido.intAwayScore);
        const idLocal = ultimoPartido.idHomeTeam;

        // 4. Lógica para determinar si ganó, perdió o empató
        let resultadoFinal = "";

        if (equipoElegido.id === idLocal) {
            // El equipo jugó de Local
            if (golesLocal > golesVisitante) resultadoFinal = "GANO";
            else if (golesLocal < golesVisitante) resultadoFinal = "PERDIO";
            else resultadoFinal = "EMPATO";
        } else {
            // El equipo jugó de Visitante
            if (golesVisitante > golesLocal) resultadoFinal = "GANO";
            else if (golesVisitante < golesLocal) resultadoFinal = "PERDIO";
            else resultadoFinal = "EMPATO";
        }

        // 5. Imprimimos el resultado
        console.log(`\n🗓️  Fecha: ${ultimoPartido.dateEvent}`);
        console.log(`🏟️  Partido: ${ultimoPartido.strEvent} (${golesLocal} - ${golesVisitante})`);
        console.log(`=========================================`);
        console.log(`🔥 RESULTADO: Tu equipo ${resultadoFinal}`);
        console.log(`=========================================\n`);

        // 6. Obtenemos recomendaciones de Spotify según el resultado
        const playlists = await getRecommendations(resultadoFinal);
        if (playlists.length === 0) {
            console.log("⚠️  Sin recomendaciones musicales disponibles.");
        } else {
            console.log("🎶 Playlists recomendadas para este momento:");
            console.log("------------------------------------------");
        playlists.forEach((p, i) => {
            if (!p) return; // Spotify a veces devuelve nulls en la lista
            console.log(`  ${i + 1}. ${p.name}`);
            console.log(`     👤 ${p.owner?.display_name}`);
            console.log(`     🔗 ${p.external_urls?.spotify}`);
        });
            console.log("------------------------------------------\n");
    }
    } catch (error) {
        console.log("❌ Hubo un error al conectarse con la API:", error);
    }

    // Cerramos la consola
    readline.close();
});