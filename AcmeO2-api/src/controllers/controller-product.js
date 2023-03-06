const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const path = require("path");
const fs = require("fs");
const {v4 : uuidv4} = require('uuid');

pool.on("error", (err) => {
  console.error(err);
});

module.exports = {
  getDataProduct(req, res) {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
            SELECT * FROM tabel_product;
            `,
        function (error, results) {
          if (error) throw error;
          res.send({
            success: true,
            message: "Berhasil ambil data!",
            data: results,
          });
        }
      );
      connection.release();
    });
  },

  getDataProductByUUID(req, res) {
    let uuid = req.params.uuid;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
                SELECT * FROM tabel_product WHERE product_uuid = ?;
                `,
        [uuid],
        function (error, results) {
          if (error) throw error;
          res.send({
            success: true,
            message: "Berhasil ambil data!",
            data: results,
          });
        }
      );
      connection.release();
    });
  },

  addDataProduct(req, res) {
    if (req.files === null)
      return res.status(400).json({ msg: "No File Uploaded" });
      const file1 = req.files.file1;
      const file2 = req.files.file2;
      const file3 = req.files.file3;
      const name1 = file1.name;
    const ext1 = path.extname(name1);
    const ext2 = path.extname(name1);
    const ext3 = path.extname(name1);
    const fileName1 = file1===undefined ? file1 : file1.md5+'1' + ext1;
    const fileName2 = file2===undefined ? file2 : file2.md5+'2' + ext2;
    const fileName3 = file3===undefined ? file3 : file3.md5+'3' + ext3;
    const url1 = fileName1 === undefined ? 'undefined' :`${req.protocol}://${req.get("host")}/images/${fileName1}`;
    const url2 = fileName2 === undefined ? 'undefined' :`${req.protocol}://${req.get("host")}/images/${fileName2}`;
    const url3 = fileName3 === undefined ? 'undefined' :`${req.protocol}://${req.get("host")}/images/${fileName3}`;
    let data = {
      product_uuid : uuidv4(),
      product_name: req.body.name ?? "",
      product_category: req.body.category ?? "",
      product_series: req.body.series ?? "",
      product_price: req.body.price ?? "",
      product_discountPercentage: req.body.discountPercentage ?? "",
      product_sku: req.body.sku ?? "",
      product_quantityStock: req.body.quantityStock ?? "",
      product_description: req.body.description ?? "",
      product_image: fileName1 ?? "",
      product_imageUrl1: url1 ?? "",
      product_imageUrl2: url2 ?? "",
      product_imageUrl3: url3 ?? "",
    };
// console.log(data)
    // const fileSize1 = file1.data.length;
    // const fileSize2 = file2.data.length;
    // const fileSize3 = file3.data.length;
    const allowedType = [".png", ".jpg", ".jpeg", ".svg", ".pdf"];

    if (!allowedType.includes(ext1.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (!allowedType.includes(ext2.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (!allowedType.includes(ext3.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    // if (fileSize1 > 5000000)
    //   return res.status(422).json({ msg: "Image must be less than 5 MB" });
    // if (fileSize2 > 5000000)
    //   return res.status(422).json({ msg: "Image must be less than 5 MB" });
    // if (fileSize3 > 5000000)
    //   return res.status(422).json({ msg: "Image must be less than 5 MB" });
console.log(data)
    file1.mv(`./src/public/images/${fileName1}`, async (err) => {
      if (err) throw err;
    });
    file2.mv(`./src/public/images/${fileName2}`, async (err) => {
      if (err) throw err;
    });
    file3.mv(`./src/public/images/${fileName3}`, async (err) => {
      if (err) throw err;
    });

    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
                INSERT INTO tabel_product SET ?;
                `,
        [data],
        function (error, results) {
          if (error) throw error;
          res.send({
            success: true,
            message: "Berhasil tambah data!",
          });
        }
      );  
      connection.release();
    });
  },

  editDataProduct(req, res) {
    let uuid = req.params.uuid;
    if (!uuid) return res.status(404).json({ msg: "Id is required" });


    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
            SELECT * FROM tabel_product WHERE product_uuid = ?;
            `,
        [uuid],
        function (error, results) {
          if (error) throw error;
          let product;
          product = results[0];

          if (!product) return res.status(404).json({ msg: "Data Not Found" });
          let fileName = "";
          let fileName1 = "";
          let fileName2 = "";
          let fileName3 = "";
          if (!req.files) {
            fileName = product.product_image;
            fileName1 = product.product_imageUrl1;
            fileName2 = product.product_imageUrl2;
            fileName3 = product.product_imageUrl3;
          } else {
            const file1 = req.files.file1;
            const file2 = req.files.file2;
            const file3 = req.files.file3;
            // const fileSize1 = file1.data.length;
            // const fileSize2 = file2.data.length;
            // const fileSize3 = file3.data.length;
            const name1 = file1.name;
            const ext1 = path.extname(name1);
            const ext2 = path.extname(name1);
            const ext3 = path.extname(name1);
             fileName1 = file1===undefined ? file1 : file1.md5+'1' + ext1;
             fileName2 = file2===undefined ? file2 : file2.md5+'2' + ext2;
             fileName3 = file3===undefined ? file3 : file3.md5+'3' + ext3;
            const allowedType = [".png", ".jpg", ".jpeg"];

            if (!allowedType.includes(ext1.toLowerCase()))
            return res.status(422).json({ msg: "Invalid Images" });
            if (!allowedType.includes(ext2.toLowerCase()))
              return res.status(422).json({ msg: "Invalid Images" });
            if (!allowedType.includes(ext3.toLowerCase()))
              return res.status(422).json({ msg: "Invalid Images" });
            // if (fileSize1 > 5000000)
            //   return res.status(422).json({ msg: "Image must be less than 5 MB" });
            // if (fileSize2 > 5000000)
            //   return res.status(422).json({ msg: "Image must be less than 5 MB" });
            // if (fileSize3 > 5000000)
            //   return res.status(422).json({ msg: "Image must be less than 5 MB" });
            // const filepath = `./src/public/images/${fileName1}`;
            // fs.unlinkSync(filepath);

            file1.mv(`./src/public/images/${fileName1}`, async (err) => {
              if (err) throw err;
            });
            file2.mv(`./src/public/images/${fileName2}`, async (err) => {
              if (err) throw err;
            });
            file3.mv(`./src/public/images/${fileName3}`, async (err) => {
              if (err) throw err;
            });
          }

          const url1 = fileName1 === undefined ? 'undefined' :`${req.protocol}://${req.get("host")}/images/${fileName1}`;
          const url2 = fileName2 === undefined ? 'undefined' :`${req.protocol}://${req.get("host")}/images/${fileName2}`;
          const url3 = fileName3 === undefined ? 'undefined' :`${req.protocol}://${req.get("host")}/images/${fileName3}`;
          let dataEdit = {
            product_name: req.body.name ?? product.product_name,
            product_category: req.body.category ?? product.product_category,
            product_series: req.body.series ?? product.product_series,
            product_price: req.body.price ?? product.product_price,
            product_discountPercentage: req.body.discountPercentage ?? product.product_discountPercentage,
            product_sku: req.body.sku ?? product.product_sku,
            product_quantityStock: req.body.quantityStock ?? product.product_quantityStock,
            product_description: req.body.description ?? product.product_description,
            product_image: fileName1 ?? "",
            product_imageUrl1: url1 ?? "",
            product_imageUrl2: url2 ?? "",
            product_imageUrl3: url3 ?? "",
          }; console.log(dataEdit)
          pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(
              `
                  UPDATE tabel_product SET ? WHERE product_uuid = ?;
                  `,
              [dataEdit, uuid],
              function (error, results) {
                if (error) throw error;
                res.send({
                  success: true,
                  message: "Berhasil edit data!",
                  data: dataEdit
                });
              }
            );

            connection.release();
          });
        }
        );
        connection.release();
    });
  },

  deleteDataProduct(req, res) {
    let uuid = req.params.uuid;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
                DELETE FROM tabel_product WHERE product_uuid = ?;
                `,
        [uuid],
        function (error, results) {
          if (error) throw error;
          res.send({
            success: true,
            message: "Berhasil hapus data!",
          });
        }
      );
      connection.release();
    });
  },
};
