const config = require('../configs/database');
const mysql = require('mysql');
const {v4 : uuidv4} = require('uuid')
const pool = mysql.createPool(config);

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    // Ambil data semua user
    getDataUser(req,res){
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                SELECT * FROM tabel_user;
                `
            , function (error, results) {
                if(error) throw error;  
                res.send({ 
                    success: true, 
                    message: 'Berhasil ambil data!',
                    data: results 
                });
            });
            connection.release();
        })
    },
    // Ambil data user berdasarkan UUID
    getDataUserByUUID(req,res){
        let uuid = req.params.uuid;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                SELECT * FROM tabel_user WHERE user_uuid = ?;
                `
            , [uuid],
            function (error, results) {
                if(error) throw error;  
                res.send({ 
                    success: true, 
                    message: 'Berhasil ambil data!',
                    data: results
                });
            });
            connection.release();
        })
    },
    // Simpan data user
    addDataUser(req,res){
        let data = {
            user_uuid : uuidv4(),
            user_username : req.body.username,
            user_password : req.body.password,
            user_phoneNumber : req.body.phoneNumber,
            user_address : req.body.address,
            user_postalCode : req.body.postalCode,
            user_role : req.body.role
        }
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                INSERT INTO tabel_user SET ?;
                `
            , [data],
            function (error, results) {
                if(error) throw error;  
                res.send({ 
                    success: true, 
                    message: 'Berhasil tambah data!',
                });
            });
            connection.release();
        })
    },
    // Update data user
    editDataUser(req,res){
        let dataEdit = {
            user_username : req.body.username,
            user_password : req.body.password,
            user_phoneNumber : req.body.phoneNumber,
            user_address : req.body.address,
            user_postalCode : req.body.postalCode,
            user_role : req.body.role
        }
        let uuid = req.params.uuid
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                UPDATE tabel_user SET ? WHERE user_uuid = ?;
                `
            , [dataEdit, uuid],
            function (error, results) {
                if(error) throw error;  
                res.send({ 
                    success: true, 
                    message: 'Berhasil edit data!',
                });
            });
            connection.release();
        })
    },
    // Delete data user
    deleteDataUser(req,res){
        let uuid = req.params.uuid
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                DELETE FROM tabel_user WHERE user_uuid = ?;
                `
            , [uuid],
            function (error, results) {
                if(error) throw error;  
                res.send({ 
                    success: true, 
                    message: 'Berhasil hapus data!'
                });
            });
            connection.release();
        })
    }
}