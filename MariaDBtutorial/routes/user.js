import express from "express";
import pool  from "../helpers/database.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.get('/:id',async function(req,res){
    try{
        const sqlQuery = 'SELECT id, email, password, created_at FROM user WHERE id=?';
        const rows = await pool.query(sqlQuery, req.params.id);
        res.status(200).json(rows);
        return;
    }catch(error){
        res.status(400).send(error.message)
    }
    //res.status(200).json({id:req.params.})
})

router.post('/register', async function(req,res){
    try{
       const {email, password} = req.body; 

       const encryptedPassword = await bcrypt.hash(password,10)
       
       const sqlQuery ='INSERT INTO user (email, password) VALUES (?,?)';
       const result = await pool.query(sqlQuery, [email, encryptedPassword]);

       res.status(200).json({userId: result.insertId});
    }catch(error){
        res.status(400).send(error.message)
    }
})

router.post(`/login`, async function(req,res){
    try{
        const {id,password} =req.body;

        const sqlGetUser = 'SELECT password FROM user WHERE id=?'
        const rows = await pool.query(sqlGetUser,id);
        if (rows){
            res.status(200).json(rows[0]);
            const isValid = await bcrypt.compare(password,rows[0].password)
            res.status(200).json(isValid); 
        }
        console.log("2")

    }catch (error){
        console.log("in1")
        res.status(400).send(error.message)
    }
})

export default router