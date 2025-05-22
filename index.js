const express = require("express")
const mysql = require("mysql2")

const app = express()

app.use(express.json())

const consulta = []

const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    passaword: "",
    database: "consultorio_medico"
})

app.post("/consultas", (req, res) => {
    const consulta = {
        paciente: req.body.paciente,
        medico: req.body.medico,
        especialidade: req.body.especialidade,
        data: req.body.data,
        horario: req.body.horario,
        observacoes: req.body.observacoes
    }

    if (!consulta.paciente || typeof consulta.paciente != 'string' || consulta.paciente.trim() == '') {
        return res.status(400).send('O nome do paciente é obrigatório!');
    }

    if (!consulta.medico || typeof consulta.medico != 'string' || consulta.medico.trim() == '') {
        return res.status(400).send('O nome do médico deve ser informado!');
    }

    if (!consulta.especialidade || typeof consulta.especialidade != 'string' || consulta.especialidade.trim() == '') {
        return res.status(400).send('A especialidade do médico deve ser informada!');
    }
    
    if (!consulta.data || consulta.data.trim() == '') {
        return res.status(400).send('A data deverá ser informada!');
    }

    if (!consulta.horario || consulta.horario.trim() == '') {
        return res.status(400).send('O horário de agendamento de consulta é obrigatório!');
    }

    conexao.query(
        "INSERT INTO pacientes (paciente, medico, especialidade, data, horario, observacoes) VALUES (?, ?, ?, ?, ?, ?)",
        [consulta.paciente, consulta.medico, consulta.especialidade, consulta.data, consulta.horario, consulta.observacoes],
        () => {
        res.status(201).send("Consulta realizada com sucesso!")
        }
    )
})

app.get("/consultas", (req, res) => {
    conexao.query("SELECT paciente, medico, especialidade, data, horario, observacoes FROM pacientes", (err, results) => {
        if (err) {
            return res.status(500).send("Erro ao realizar a consulta")
        }
        res.status(200).send(results)
    })
})

app.listen(3000, () => {
    console.log("Servidor Back-End online!")
})