import express, { request, response } from "express";
import { randomUUID } from "crypto";
import fs from "fs";

const server = express();

let products:any[] = [];

readProductFile();

server.use(express.json());

server.post("/products", (request, response) => {
  const { name, price } = request.body;

  const product = {
    name: name,
    price: price,
    id: randomUUID(),
  };
  console.log(product);
  products.push(product);

  updateProductFile();

  return response.json(product);
});

server.get("/products", (request, response) => {
  return response.json(products);
});

server.get("/products/:id", (request, response) => {
  const { id } = request.params;
  const product = products.find((product) => product.id === id);
  return response.json(product);
});

server.put("/products/:id", (request, response) => {
  const { id } = request.params;
  const { name, price } = request.body;

  const productIndex = products.findIndex((product) => product.id === id);
  products[productIndex] = {
    ...products[productIndex],
    name,
    price,
  };

  updateProductFile();

  return response.json({ message: "Produto alterado com sucesso" });
});

server.delete("/products/:id", (request, response) => {
  const { id } = request.params;
  const productIndex = products.findIndex((product) => product.id === id);
  products.splice(productIndex, 1);

  updateProductFile();
});

function updateProductFile() {
  fs.writeFile("./database/products.json", JSON.stringify(products), (err) => {
    if (err) {
      console.log("Error");
    } else {
      console.log("Arquivo de produtos atualizado com sucesso");
    }
  });
}

function readProductFile() {
  fs.readFile("./database/products.json", "utf-8", (err, data) => {
    if (err) {
      console.log("Error");
    } else {
      products = JSON.parse(data);
    }
  });
}

export default server;
