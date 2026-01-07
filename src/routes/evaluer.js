import { Router } from "express";
import { pool } from "../../db.js";
import { asyncHandler } from "../asyncHandler.js";

const r = Router();

// GET /evaluer (brut)
r.get(
    "/",
    asyncHandler(async (_req, res) => {
        const q = await pool.query(
        'SELECT "MatriculeEns","NumIns","codeMat","codePer" FROM "evaluer" ORDER BY "MatriculeEns","NumIns","codeMat","codePer"'
        );
        res.json(q.rows);
    })
);

// GET /evaluer/full (jointure utile)
r.get(
    "/full",
    asyncHandler(async (_req, res) => {
        const q = await pool.query(`
        SELECT
            e."MatriculeEns",
            ens."nomEns",
            ens."PrenomEns",
            e."NumIns",
            i."Matriculation",
            et."Nom" as "NomEtudiant",
            et."Prenom" as "PrenomEtudiant",
            e."codeMat",
            m."libelleMat",
            e."codePer",
            p."libellePer",
            p."debutP",
            p."finP"
        FROM "evaluer" e
        JOIN "enseignant" ens ON ens."MatriculeEns" = e."MatriculeEns"
        JOIN "inscription" i ON i."NumIns" = e."NumIns"
        JOIN "etudiant" et ON et."Matriculation" = i."Matriculation"
        JOIN "matiere" m ON m."codeMat" = e."codeMat"
        JOIN "periode" p ON p."codePer" = e."codePer"
        ORDER BY e."MatriculeEns", e."NumIns", e."codeMat", e."codePer"
        `);
        res.json(q.rows);
    })
);

// POST /evaluer
r.post(
    "/",
    asyncHandler(async (req, res) => {
        const { MatriculeEns, NumIns, codeMat, codePer } = req.body;
        if (!MatriculeEns || !NumIns || !codeMat || !codePer)
        return res.status(400).json({ message: "MatriculeEns, NumIns, codeMat, codePer requis" });

        await pool.query(
        'INSERT INTO "evaluer"("MatriculeEns","NumIns","codeMat","codePer") VALUES ($1,$2,$3,$4)',
        [MatriculeEns, NumIns, codeMat, codePer]
        );

        res.status(201).json({ MatriculeEns, NumIns, codeMat, codePer });
    })
);

// DELETE /evaluer (suppression par clé composite via query params)
r.delete(
    "/",
    asyncHandler(async (req, res) => {
        const { MatriculeEns, NumIns, codeMat, codePer } = req.query;

        if (!MatriculeEns || !NumIns || !codeMat || !codePer) {
        return res.status(400).json({
            message: "Fournis MatriculeEns, NumIns, codeMat, codePer en query params",
        });
        }

        const q = await pool.query(
        'DELETE FROM "evaluer" WHERE "MatriculeEns"=$1 AND "NumIns"=$2 AND "codeMat"=$3 AND "codePer"=$4',
        [MatriculeEns, NumIns, codeMat, codePer]
        );

        if (q.rowCount === 0) return res.status(404).json({ message: "Liaison introuvable" });
        res.status(204).send();
    })
);

export default r;
