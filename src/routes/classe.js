import { Router } from "express";
import { asyncHandler } from "../asyncHandler.js";
import { pool } from "../../db.js";


const r = Router();

// GET /classes
r.get(
    "/",
    asyncHandler(async (_req, res) => {
        const q = await pool.query('SELECT "codecl","libellecl" FROM "classe" ORDER BY "codecl"');
        res.json(q.rows);
    })
);

// GET /classes/:codecl
r.get(
    "/:codecl",
    asyncHandler(async (req, res) => {
        const q = await pool.query('SELECT "codecl","libellecl" FROM "classe" WHERE "codecl"=$1', [
        req.params.codecl,
        ]);
        if (!q.rows.length) return res.status(404).json({ message: "Classe introuvable" });
        res.json(q.rows[0]);
    })
);

// POST /classes
r.post(
    "/",
    asyncHandler(async (req, res) => {
        const { codecl, libellecl } = req.body;
        if (!codecl) return res.status(400).json({ message: "codecl requis" });

        await pool.query('INSERT INTO "classe"("codecl","libellecl") VALUES ($1,$2)', [
        codecl,
        libellecl ?? null,
        ]);
        res.status(201).json({ codecl, libellecl: libellecl ?? null });
    })
);

// PUT /classes/:codecl
r.put(
    "/:codecl",
    asyncHandler(async (req, res) => {
        const { libellecl } = req.body;
        const q = await pool.query('UPDATE "classe" SET "libellecl"=$1 WHERE "codecl"=$2', [
        libellecl ?? null,
        req.params.codecl,
        ]);
        if (q.rowCount === 0) return res.status(404).json({ message: "Classe introuvable" });
        res.json({ codecl: req.params.codecl, libellecl: libellecl ?? null });
    })
);

// DELETE /classes/:codecl
r.delete(
    "/:codecl",
    asyncHandler(async (req, res) => {
        const q = await pool.query('DELETE FROM "classe" WHERE "codecl"=$1', [req.params.codecl]);
        if (q.rowCount === 0) return res.status(404).json({ message: "Classe introuvable" });
        res.status(204).send();
    })
);

export default r;
