const express = require("express")
const cors = require("cors")
const fs = require("fs")

const app = express()

app.use(cors())
app.use(express.json())

let reservas = []

// ROTA PARA RESERVAR
app.post("/reservar", (req, res) => {

  const novaReserva = req.body

  // verifica limite de reservas no mesmo horário
  const reservasNoHorario = reservas.filter(r =>
    r.data === novaReserva.data &&
    r.horario === novaReserva.horario &&
    r.mesa === novaReserva.mesa
  )

  if (reservasNoHorario.length >= 3) {
    return res.send({ erro: "Limite de mesas atingido" })
  }

  // verifica conflito (mesma mesa já reservada)
  const conflito = reservas.find(r =>
    r.data === novaReserva.data &&
    r.horario === novaReserva.horario &&
    r.mesa === novaReserva.mesa
  )

  if (conflito) {
    return res.send({ erro: "Mesa já reservada" })
  }

  reservas.push(novaReserva)

  fs.writeFileSync("reservas.json", JSON.stringify(reservas, null, 2))

  res.send({ status: "ok" })
})

// ROTA PARA VER RESERVAS
app.get("/reservas", (req, res) => {
  res.send(reservas)
})

app.get("/",  (req, res)  =>  {
  res.send ("🔥 DM Geek Bar funcionando!")
})

// PORTA (IMPORTANTE PRO RENDER)
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("🔥 Servidor rodando na porta " + PORT)
})