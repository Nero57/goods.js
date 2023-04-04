
const { Pool } = require("pg");
const express = require("express");
const app = express();
//const http = require('http')

const jsonParser = express.json();

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'NeroRider57',
  port: 5432,
  database: 'test_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})


app.get("/api/categories/get", function (req, res) {
  pool.connect((err, client, release) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error acquiring client", stack: err.stack });
    }
    client.query(
      "SELECT category_id, category_name FROM public.categories",
      (err, result) => {
        release();
        if (err) {
          return res
            .status(500)
            .send({ message: "Error executing query", stack: err.stack });
        }
        res.send(result.rows);
      }
    );
  });
});

app.post("/api/categories/post", jsonParser, function (req, res) {
  pool.connect((err, client, release) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error acquiring client", stack: err.stack });
    }
  
    const {category_name} = req.body;
    client.query(
      "insert into public.categories (category_name) VALUES ($1)", [category_name],
      (err, result) => {
        release();
        if (err) {
          return res
            .status(500)
            .send({ message: "Error executing query", stack: err.stack });
        }
        res.send(result.rows);
      }
    );
  });
});

app.delete("/api/categories/delete", jsonParser, function (req, res, next) {
  pool.connect((err, client, release) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error acquiring client", stack: err.stack });
    }
    const {category_id} = req.body;    
    client.query(
        "DELETE FROM public.categories WHERE category_id = $1", [category_id], // решение работает
      (err, result) => {
        release();
        if (err) {
          return res
            .status(500)
            .send({ message: "Error executing query", stack: err.stack });
        }
        res.send(result.rows);
      }
    );
  });
});

app.put("/api/categories/put", jsonParser, function (req, res) {
  pool.connect((err, client, release) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error acquiring client", stack: err.stack });
    }
    const {category_name, category_id} = req.body;
    client.query(
      
     "UPDATE public.categories SET category_name = $1 WHERE category_id = $2", [category_name, category_id],
      (err, result) => {
        release();
        if (err) {
          return res
            .status(500)
            .send({ message: "Error executing query", stack: err.stack });
        }
        res.send(result.rows);
      }
    );
  });
});


// app.get("/api/goods/:product_name", function (req, res) {
app.get("/api/goods", function (req, res) {
    pool.connect((err, client, release) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error acquiring client", stack: err.stack });
    }
    client.query(
      // product_id, product_name, category_id
      "SELECT * FROM public.goods", 
      (err, result) => {
        release();
        if (err) {
          return res
            .status(500)
            .send({ message: "Error executing query", stack: err.stack });
        }
      //  res.send("product_name: " + request.params["product_name"]);
        res.send(result.rows);
      }
    );
  });
});

app.post("/api/goods", jsonParser, function (req, res) {
  // var prod = request.query.prod;  
  pool.connect((err, client, release) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error acquiring client", stack: err.stack });
    }
  
    const {product_name , category_id} = req.body;
    client.query(
      "insert into public.goods (product_name, category_id) VALUES ($1, $2) RETURNING * ", [product_name, category_id],
      (err, result) => {
        release();
        if (err) {
          return res
            .status(500)
            .send({ message: "Error executing query", stack: err.stack });
        }
        res.send(result.rows);
      }
    );
  });
});

app.delete("/api/goods/", jsonParser, function (req, res, next) {
  pool.connect((err, client, release) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error acquiring client", stack: err.stack });
    }
    const {product_id} = req.body;    
    client.query(
        "DELETE FROM public.goods WHERE product_id = $1", [product_id], // решение работает
      (err, result) => {
        release();
        if (err) {
          return res
            .status(500)
            .send({ message: "Error executing query", stack: err.stack });
        }
        res.send(result.rows);
      }
    );
  });
});

app.put("/api/goods/:update", jsonParser, function (req, res) {
  pool.connect((err, client, release) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error acquiring client", stack: err.stack });
    }
    const {product_name, product_id} = req.body;
    client.query(
      "UPDATE public.goods SET product_name = $1 WHERE product_id = $2 returning *", [product_name, product_id],
      (err, result) => {
        release();
        if (err) {
          return res
            .status(500)
            .send({ message: "Error executing query", stack: err.stack });
        }
        res.send(result.rows);
      }
    );
  });
});

app.listen(3000);
