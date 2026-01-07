import { Router } from "express";
import { pool } from "../../db.js";
import { asyncHandler } from "../asyncHandler.js";

const r = Router();

r.get(
    "/",
    asyncHandler(async (_req, res) => {
        const q = await pool.query(
        'SELECT "MatriculeEns","nomEns","PrenomEns","telEns","Email" FROM "enseignant" ORDER BY "MatriculeEns"'
        );
        res.json(q.rows);
    })
);

r.get(
    "/:matricule",
    asyncHandler(async (req, res) => {
        const q = await pool.query(
        'SELECT "MatriculeEns","nomEns","PrenomEns","telEns","Email" FROM "enseignant" WHERE "MatriculeEns"=$1',
        [req.params.matricule]
        );
        if (!q.rows.length) return res.status(404).json({ message: "Enseignant introuvable" });
        res.json(q.rows[0]);
    })
);

r.post(
    "/",
    asyncHandler(async (req, res) => {
        const { MatriculeEns, nomEns, PrenomEns, telEns, Email } = req.body;
        if (!MatriculeEns) return res.status(400).json({ message: "MatriculeEns requis" });

        await pool.query(
        'INSERT INTO "enseignant"("MatriculeEns","nomEns","PrenomEns","telEns","Email") VALUES ($1,$2,$3,$4,$5)',
        [MatriculeEns, nomEns ?? null, PrenomEns ?? null, telEns ?? null, Email ?? null]
        );
        res.status(201).json({ MatriculeEns, nomEns: nomEns ?? null, PrenomEns: PrenomEns ?? null, telEns: telEns ?? null, Email: Email ?? null });
    })
);

r.put(
    "/:matricule",
    asyncHandler(async (req, res) => {
        const { nomEns, PrenomEns, telEns, Email } = req.body;
        const q = await pool.query(
        'UPDATE "enseignant" SET "nomEns"=$1,"PrenomEns"=$2,"telEns"=$3,"Email"=$4 WHERE "MatriculeEns"=$5',
        [nomEns ?? null, PrenomEns ?? null, telEns ?? null, Email ?? null, req.params.matricule]
        );
        if (q.rowCount === 0) return res.status(404).json({ message: "Enseignant introuvable" });
        res.json({ MatriculeEns: req.params.matricule, nomEns: nomEns ?? null, PrenomEns: PrenomEns ?? null, telEns: telEns ?? null, Email: Email ?? null });
    })
);

r.delete(
    "/:matricule",
    asyncHandler(async (req, res) => {
        const q = await pool.query('DELETE FROM "enseignant" WHERE "MatriculeEns"=$1', [req.params.matricule]);
        if (q.rowCount === 0) return res.status(404).json({ message: "Enseignant introuvable" });
        res.status(204).send();
    })
);

export default r;
