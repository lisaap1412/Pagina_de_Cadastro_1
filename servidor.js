const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

let registros = [];

app.get("/api/registrar/:id", (req, res) => {
  const registro = registros.find((r) => r.id === req.params.id);
  if (!registro) {
    return res.status(404).send("Registro não encontrado!");
  }
  res.send(registro);
});

app.post("/api/registrar", (req, res) => {
  const registro = req.body;
  if (
    !registro.id ||
    (!registro.cliente && !registro.hospital && !registro.quarto)
  ) {
    return res
      .status(400)
      .send("Por favor, preencha todos os campos obrigatórios!");
  }
  registros.push(registro);
  res.send("Registro criado com sucesso!");
});

app.get("/api/registrar", (req, res) => {
  res.send(registros);
});

const PORT = process.env.PORT || 5504;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
