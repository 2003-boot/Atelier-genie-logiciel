import { Router } from "express";
import { pool } from "../../db.js";
import { asyncHandler } from "../asyncHandler.js";

const r = Router();

// GET /inscriptions
r.get(
    "/",
    asyncHandler(async (_req, res) => {
        const q = await pool.query(
        'SELECT "NumIns","dateIns","codecl","Matriculation" FROM "inscription" ORDER BY "NumIns"'
        );
        res.json(q.rows);
    })
);

// GET /inscriptions/:numins
r.get(
    "/:numins",
    asyncHandler(async (req, res) => {
        const q = await pool.query(
        'SELECT "NumIns","dateIns","codecl","Matriculation" FROM "inscription" WHERE "NumIns"=$1',
        [req.params.numins]
        );
        if (!q.rows.length) return res.status(404).json({ message: "Inscription introuvable" });
        res.json(q.rows[0]);
    })
);

// POST /inscriptions
r.post(
    "/",
    asyncHandler(async (req, res) => {
        const { NumIns, dateIns, codecl, Matriculation } = req.body;
        if (!NumIns || !codecl || !Matriculation)
        return res.status(400).json({ message: "NumIns, codecl, Matriculation requis" });

        await pool.query(
        'INSERT INTO "inscription"("NumIns","dateIns","codecl","Matriculation") VALUES ($1,$2,$3,$4)',
        [NumIns, dateIns ?? null, codecl, Matriculation]
        );
        res.status(201).json({ NumIns, dateIns: dateIns ?? null, codecl, Matriculation });
    })
);

// PUT /inscriptions/:numins
r.put(
    "/:numins",
    asyncHandler(async (req, res) => {
        const { dateIns, codecl, Matriculation } = req.body;
        const q = await pool.query(
        'UPDATE "inscription" SET "dateIns"=$1,"codecl"=$2,"Matriculation"=$3 WHERE "NumIns"=$4',
        [dateIns ?? null, codecl, Matriculation, req.params.numins]
        );
        if (q.rowCount === 0) return res.status(404).json({ message: "Inscription introuvable" });
        res.json({ NumIns: req.params.numins, dateIns: dateIns ?? null, codecl, Matriculation });
    })
);

// DELETE /inscriptions/:numins
r.delete(
    "/:numins",
    asyncHandler(async (req, res) => {
        const q = await pool.query('DELETE FROM "inscription" WHERE "NumIns"=$1', [req.params.numins]);
        if (q.rowCount === 0) return res.status(404).json({ message: "Inscription introuvable" });
        res.status(204).send();
    })
);

// GET /inscriptions/by-classe/:codecl
r.get(
    "/by-classe/:codecl",
    asyncHandler(async (req, res) => {
        const q = await pool.query(
        'SELECT "NumIns","dateIns","codecl","Matriculation" FROM "inscription" WHERE "codecl"=$1 ORDER BY "NumIns"',
        [req.params.codecl]
        );
        res.json(q.rows);
    })
);

// GET /inscriptions/by-etudiant/:matriculation
r.get(
    "/by-etudiant/:matriculation",
    asyncHandler(async (req, res) => {
        const q = await pool.query(
        'SELECT "NumIns","dateIns","codecl","Matriculation" FROM "inscription" WHERE "Matriculation"=$1 ORDER BY "NumIns"',
        [req.params.matriculation]
        );
        res.json(q.rows);
    })
);

export default r;
