import { Router } from "express";
import { pool } from "../../db.js";
import { asyncHandler } from "../asyncHandler.js";

const r = Router();

r.get(
    "/",
    asyncHandler(async (_req, res) => {
        const q = await pool.query(
        'SELECT "Matriculation","Nom","Prenom","PhotoEt","email" FROM "etudiant" ORDER BY "Matriculation"'
        );
        res.json(q.rows);
    })
);

r.get(
    "/:matriculation",
    asyncHandler(async (req, res) => {
        const q = await pool.query(
        'SELECT "Matriculation","Nom","Prenom","PhotoEt","email" FROM "etudiant" WHERE "Matriculation"=$1',
        [req.params.matriculation]
        );
        if (!q.rows.length) return res.status(404).json({ message: "Etudiant introuvable" });
        res.json(q.rows[0]);
    })
);

r.post(
    "/",
    asyncHandler(async (req, res) => {
        const { Matriculation, Nom, Prenom, PhotoEt, email } = req.body;
        if (!Matriculation || !Nom || !Prenom)
        return res.status(400).json({ message: "Matriculation, Nom, Prenom requis" });

        await pool.query(
        'INSERT INTO "etudiant"("Matriculation","Nom","Prenom","PhotoEt","email") VALUES ($1,$2,$3,$4,$5)',
        [Matriculation, Nom, Prenom, PhotoEt ?? null, email ?? null]
        );

        res.status(201).json({ Matriculation, Nom, Prenom, PhotoEt: PhotoEt ?? null, email: email ?? null });
    })
);

r.put(
    "/:matriculation",
    asyncHandler(async (req, res) => {
        const { Nom, Prenom, PhotoEt, email } = req.body;

        const q = await pool.query(
        'UPDATE "etudiant" SET "Nom"=$1,"Prenom"=$2,"PhotoEt"=$3,"email"=$4 WHERE "Matriculation"=$5',
        [Nom, Prenom, PhotoEt ?? null, email ?? null, req.params.matriculation]
        );
        if (q.rowCount === 0) return res.status(404).json({ message: "Etudiant introuvable" });
        res.json({ Matriculation: req.params.matriculation, Nom, Prenom, PhotoEt: PhotoEt ?? null, email: email ?? null });
    })
);

r.delete(
    "/:matriculation",
    asyncHandler(async (req, res) => {
        const q = await pool.query('DELETE FROM "etudiant" WHERE "Matriculation"=$1', [req.params.matriculation]);
        if (q.rowCount === 0) return res.status(404).json({ message: "Etudiant introuvable" });
        res.status(204).send();
    })
);

export default r;
