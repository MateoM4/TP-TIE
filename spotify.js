require("dotenv").config();

async function getSpotifyToken() {
  const clientId     = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const credentials  = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res  = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  // ✅ Solo una lectura del body
  const data = await res.json();
  if (!data.access_token) throw new Error("No se pudo obtener el token de Spotify");
  return data.access_token;
}

async function getRecommendations(resultado) {
  const token = await getSpotifyToken();


  // Buscamos playlists según el resultado del partido
  const queries = {
    GANO:   "happy energetic pump up",
    EMPATO: "chill relax calm",
    PERDIO: "sad melancholic blues",
  };

  const query  = encodeURIComponent(queries[resultado]);
  const url    = `https://api.spotify.com/v1/search?q=${query}&type=playlist&market=AR&limit=5`;


  const res  = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });


  // ✅ Una sola lectura
  const text = await res.text();
//console.log("📦 Respuesta Search:", text);

  const data = JSON.parse(text);
  return data.playlists?.items ?? [];
}

module.exports = { getRecommendations };