async function loadRates() {
  const cacheKey = "fxRates";
  const cacheExpireKey = "fxRatesExpire";

  const now = Date.now();
  const expireTime = localStorage.getItem(cacheExpireKey);

  // 1. Si ya tienes datos en caché y no han expirado → Úsalos
  if (expireTime && now < expireTime) {
    const cached = JSON.parse(localStorage.getItem(cacheKey));
    return renderRates(cached);
  }

  try {
    // 2. Pedir datos a la API SOLO si expiró la caché
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();

    // Guardar en caché por 24 horas
    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(cacheExpireKey, now + 24 * 60 * 60 * 1000);

    renderRates(data);

  } catch (error) {
    console.error("Error cargando tasas:", error);
  }
}

function renderRates(data) {
  const container = document.getElementById("tickerMove");
  const clone = document.getElementById("tickerClone");

  const rates = {
    "Peso colombiano": data.rates.COP,
    "Euro": data.rates.EUR,
    "Peso argentino": data.rates.ARS,
    "Libra esterlina": data.rates.GBP,
    "Dolar canadiense": data.rates.CAD,
    "Peso mexicano": data.rates.MXN,
    "Real brasileño": data.rates.BRL,
    "Sol peruano": data.rates.PEN,
    "Peso uruguayo": data.rates.UYU
  };

  let html = "";
  for (let key in rates) {
    html += `<span>${key}: $${rates[key].toFixed(2)}</span>`;
  }

  // Insertamos el contenido original
  container.innerHTML = html;

  // Clonamos para la animación infinita
  clone.innerHTML = html;
}


loadRates();

