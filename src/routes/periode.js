import { Router } from "express";
import { pool } from "../../db.js";
import { asyncHandler } from "../asyncHandler.js";

const r = Router();

r.get(
    "/",
    asyncHandler(async (_req, res) => {
        const q = await pool.query(
        'SELECT "codePer","libellePer","debutP","finP" FROM "periode" ORDER BY "codePer"'
        );
        res.json(q.rows);
    })
);

r.get(
    "/:codePer",
    asyncHandler(async (req, res) => {
        const q = await pool.query(
        'SELECT "codePer","libellePer","debutP","finP" FROM "periode" WHERE "codePer"=$1',
        [req.params.codePer]
        );
        if (!q.rows.length) return res.status(404).json({ message: "Période introuvable" });
        res.json(q.rows[0]);
    })
);

r.post(
    "/",
    asyncHandler(async (req, res) => {
        const { codePer, libellePer, debutP, finP } = req.body;
        if (!codePer) return res.status(400).json({ message: "codePer requis" });

        await pool.query(
        'INSERT INTO "periode"("codePer","libellePer","debutP","finP") VALUES ($1,$2,$3,$4)',
        [codePer, libellePer ?? null, debutP ?? null, finP ?? null]
        );
        res.status(201).json({ codePer, libellePer: libellePer ?? null, debutP: debutP ?? null, finP: finP ?? null });
    })
);

r.put(
    "/:codePer",
    asyncHandler(async (req, res) => {
        const { libellePer, debutP, finP } = req.body;
        const q = await pool.query(
        'UPDATE "periode" SET "libellePer"=$1,"debutP"=$2,"finP"=$3 WHERE "codePer"=$4',
        [libellePer ?? null, debutP ?? null, finP ?? null, req.params.codePer]
        );
        if (q.rowCount === 0) return res.status(404).json({ message: "Période introuvable" });
        res.json({ codePer: req.params.codePer, libellePer: libellePer ?? null, debutP: debutP ?? null, finP: finP ?? null });
    })
);

r.delete(
    "/:codePer",
    asyncHandler(async (req, res) => {
        const q = await pool.query('DELETE FROM "periode" WHERE "codePer"=$1', [req.params.codePer]);
        if (q.rowCount === 0) return res.status(404).json({ message: "Période introuvable" });
        res.status(204).send();
    })
);

export default r;
