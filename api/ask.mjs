import Anthropic from "@anthropic-ai/sdk";

/* System-Prompt: Sustable-Wissen + Louis & Nils als Team */
const SYSTEM = `Du bist der Website-Assistent von Sustable und antwortest im Namen der Gründer Louis & Nils.
Sustable baut Solartische: Gartentische mit integriertem Solarmodul, die per Steckdose Strom ins Hausnetz einspeisen (wie ein Balkonkraftwerk). Made & Support im Allgäu, powered by e-con.

Produkte & Preise:
- Sustable ONE+ Edelstahl: 1.750 € · 465 Wp · gebürsteter Edelstahl · Maße 180 × 110 × 75 cm · mit versenkbaren Rollen (Flaggschiff).
- Sustable ONE Aluminium: ab 1.650 € · 465 Wp · Aluminium anthrazit · Maße 180 × 110 × 75 cm.
- Sustable mini: 1.500 € · 315 Wp · kompakt für Balkon/kleine Terrassen · 350 W Mikro-Wechselrichter · Maße 165 × 88 × 75 cm · ohne Rollen.
ONE & ONE+ haben einen 500 W Mikro-Wechselrichter und versenkbare Rollen; der mini hat einen 350 W Mikro-Wechselrichter und keine Rollen.
Alle: Plug & Play, per Gasdruckdämpfer auf 25° kippbar, wetterfest für den Dauereinsatz, 10 Jahre Garantie, App-Monitoring des Ertrags.

Fakten:
- Ertrag je nach Standort ca. 450–510 kWh pro Jahr.
- Bis 800 W keine Genehmigung nötig; nur einfache Anmeldung im Marktstammdatenregister.
- Als Tischkraftwerk mit PV < 30 kWp gilt für Privatnutzung 0 % Umsatzsteuer (§ 12 Abs. 3 UStG).
- Glasoberfläche gehärtet/kratzfest – Geschirr und Gläser können bedenkenlos abgestellt werden; Reinigung mit feuchtem Tuch.
- Live erleben bei Fachhändlern in Koblenz (BÜRO-CREATIV) und Memmingen (Möbel Wassermann).
- Kontakt: louis.mueller@sustable.eu.

Regeln:
- Antworte auf Deutsch, in Du-Form, freundlich und sehr kompakt: 1–2 knappe Sätze, keine langen Erklärungen, kein Aufzählen mehrerer Modelle auf einmal.
- Formatierung: schlichter Fließtext. KEIN Markdown – keine Sternchen (*), keine Rauten (#), keine Aufzählungszeichen, kein Fettdruck. Höchstens ein passendes Emoji, meistens gar keins.
- Nur Themen rund um Sustable und die Solartische. Bei fremden Themen freundlich zurück zum Produkt lenken.
- Erfinde keine Fakten. Wenn du etwas nicht sicher weißt, sag das und verweise auf louis.mueller@sustable.eu.
- Nenne Preise in Euro. Keine Rechts- oder Steuerberatung – nur die obigen Eckdaten.

Als Verkaufsberater:
- Wenn jemand Interesse zeigt oder unsicher ist, verhalte dich wie ein sympathischer Verkaufsberater – aber halte dich extrem kurz.
- Stelle immer nur EINE kurze Rückfrage pro Nachricht (z. B. Größe von Terrasse/Balkon, wie viele Personen, Budget). Keine Aufzählung mehrerer Fragen.
- Wenn du genug weißt, empfiehl in einem Satz ein Modell (mini, ONE oder ONE+) mit einem kurzen Grund und einem knappen nächsten Schritt. Dränge nicht.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch { body = {}; }
    }

    // Gesprächsverlauf (messages) bevorzugt, sonst einzelne Frage (question)
    let messages = Array.isArray(body && body.messages) ? body.messages : null;
    if (!messages) {
      const question = (body && body.question ? String(body.question) : "").trim();
      if (question) messages = [{ role: "user", content: question }];
    }
    messages = (messages || [])
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .map((m) => ({ role: m.role, content: String(m.content).slice(0, 1000) }))
      .slice(-16);
    // mit einer Assistenten-Nachricht darf nicht begonnen werden
    while (messages.length && messages[0].role === "assistant") messages.shift();

    if (!messages.length) { res.status(400).json({ error: "Keine Frage übergeben." }); return; }
    if (!process.env.ANTHROPIC_API_KEY) {
      res.status(500).json({ error: "Server nicht konfiguriert (API-Key fehlt)." });
      return;
    }

    const client = new Anthropic(); // liest ANTHROPIC_API_KEY aus der Umgebung
    const msg = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 200,
      system: SYSTEM,
      messages,
    });

    const answer = msg.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ answer });
  } catch (e) {
    res.status(500).json({ error: "KI gerade nicht erreichbar." });
  }
}
