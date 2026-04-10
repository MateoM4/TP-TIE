require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getRecommendations } = require("./spotify");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// lista simplificada
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

// 🔥 ENDPOINT: OBTENER TODOS LOS EQUIPOS
app.get("/api/equipos", (req, res) => {
  res.json(equipos);
});
// endpoint
app.get("/api/equipo/:id", async (req, res) => {
    
  const { id } = req.params;

  try {
    const url = `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${id}`;
    const response = await fetch(url);
    const data = await response.json();

    const partido = data.results[0];
    const golesLocal = parseInt(partido.intHomeScore);
    const golesVisitante = parseInt(partido.intAwayScore);
    const idLocal = partido.idHomeTeam;

    let resultado = "";

    if (id === idLocal) {
      if (golesLocal > golesVisitante) resultado = "GANO";
      else if (golesLocal < golesVisitante) resultado = "PERDIO";
      else resultado = "EMPATO";
    } else {
      if (golesVisitante > golesLocal) resultado = "GANO";
      else if (golesVisitante < golesLocal) resultado = "PERDIO";
      else resultado = "EMPATO";
    }

    const playlists = await getRecommendations(resultado);

    res.json({
      resultado,
      partido,
      playlists
    });

  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});