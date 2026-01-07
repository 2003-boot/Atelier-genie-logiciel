import express from "express";
import cors from "cors";
import "dotenv/config";
import { pool } from "./db.js";

import classeRoutes from "./src/routes/classe.js";
import etudiantRoutes from "./src/routes/etudiant.js";
import enseignantRoutes from "./src/routes/enseignant.js";
import matiereRoutes from "./src/routes/matiere.js";
import periodeRoutes from "./src/routes/periode.js";
import inscriptionRoutes from "./src/routes/inscription.js";
import evaluerRoutes from "./src/routes/evaluer.js";

const app = express();
app.use(cors());
app.use(express.json());

// Health + test DB
app.get("/health", async (_req, res) => {
    const r = await pool.query("SELECT NOW() as now");
    res.json({ ok: true, now: r.rows[0].now });
});

app.use("/classes", classeRoutes);
app.use("/etudiants", etudiantRoutes);
app.use("/enseignants", enseignantRoutes);
app.use("/matieres", matiereRoutes);
app.use("/periodes", periodeRoutes);
app.use("/inscriptions", inscriptionRoutes);
app.use("/evaluer", evaluerRoutes);

// Error handler (simple)
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", detail: err.message });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
