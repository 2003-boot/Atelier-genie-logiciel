import { Router } from "express";
import { pool } from "../../db.js";
import { asyncHandler } from "../asyncHandler.js";

const r = Router();

r.get(
    "/",
    asyncHandler(async (_req, res) => {
        const q = await pool.query('SELECT "codeMat","libelleMat","nbcredit" FROM "matiere" ORDER BY "codeMat"');
        res.json(q.rows);
    })
);

r.get(
    "/:codeMat",
    asyncHandler(async (req, res) => {
        const q = await pool.query('SELECT "codeMat","libelleMat","nbcredit" FROM "matiere" WHERE "codeMat"=$1', [
        req.params.codeMat,
        ]);
        if (!q.rows.length) return res.status(404).json({ message: "Matière introuvable" });
        res.json(q.rows[0]);
    })
);

r.post(
    "/",
    asyncHandler(async (req, res) => {
        const { codeMat, libelleMat, nbcredit } = req.body;
        if (!codeMat) return res.status(400).json({ message: "codeMat requis" });

        await pool.query('INSERT INTO "matiere"("codeMat","libelleMat","nbcredit") VALUES ($1,$2,$3)', [
        codeMat,
        libelleMat ?? null,
        nbcredit ?? null,
        ]);
        res.status(201).json({ codeMat, libelleMat: libelleMat ?? null, nbcredit: nbcredit ?? null });
    })
);

r.put(
    "/:codeMat",
    asyncHandler(async (req, res) => {
        const { libelleMat, nbcredit } = req.body;
        const q = await pool.query('UPDATE "matiere" SET "libelleMat"=$1,"nbcredit"=$2 WHERE "codeMat"=$3', [
        libelleMat ?? null,
        nbcredit ?? null,
        req.params.codeMat,
        ]);
        if (q.rowCount === 0) return res.status(404).json({ message: "Matière introuvable" });
        res.json({ codeMat: req.params.codeMat, libelleMat: libelleMat ?? null, nbcredit: nbcredit ?? null });
    })
);

r.delete(
    "/:codeMat",
    asyncHandler(async (req, res) => {
        const q = await pool.query('DELETE FROM "matiere" WHERE "codeMat"=$1', [req.params.codeMat]);
        if (q.rowCount === 0) return res.status(404).json({ message: "Matière introuvable" });
        res.status(204).send();
    })
);

export default r;
