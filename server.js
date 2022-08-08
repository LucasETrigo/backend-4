// Importacion de Express y app
const express = require("express");
const app = express();

// Importacion de class contenedor
const Contenedor = require("./src/contenedor");
const contenedor = new Contenedor("productos.json");

// Process.env.PORT for heroku to work
const PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.json());
// For html to work
app.use(
    express.urlencoded({
        extended: true,
    })
);

// Router express
const router = express.Router();

// Creando ruta default
app.use("/api/productos", router);

// GET
router.get("/", async (req, res) => {
    const products = await contenedor.getAll();
    res.status(200).json(products);
});

// GET
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const product = await contenedor.getById(id);

    product
        ? res.status(200).json(product)
        : res.status(404).json({ error: "Producto no encontrado" });
});

// PUT
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    const wasUpdated = await contenedor.updateById(id, body);

    wasUpdated
        ? res.status(200).send(`El producto de ID: ${id} fue actualizado`)
        : res
              .status(404)
              .send(`No se pudo actualizar porque no se encontró el ID: ${id}`);
});

// POST
router.post("/", async (req, res) => {
    const { body } = req;
    const newProductId = await contenedor.save(body);
    res.status(200).send(`Producto agregado con el ID: ${newProductId}`);
});

// DELETE
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const wasDeleted = await contenedor.deleteById(id);

    wasDeleted
        ? res.status(200).send(`El producto de ID: ${id} fue borrado`)
        : res
              .status(404)
              .send(
                  `El producto no se pudo borrar porque no se encontró el ID: ${id}`
              );
});

const server = app.listen(PORT, () => {
    console.log(` Server started at ${PORT}`);
});

server.on("error", (err) => console.log(err));
