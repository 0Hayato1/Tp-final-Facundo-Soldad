
const sqlite3 = require("better-sqlite3");
const readline = require("readline-sync");

const db = new sqlite3("aula_maker.db");

let visitas = [];
let continuar = true;

function validarVisita(nombre, curso, motivo) {

    if (nombre === "" || curso === "" || motivo === "") {
        return false;
    } else {
        return true;
    }

}

const mostrarVisitas = (lista) => {

    if (lista.length === 0) {

        console.log("\nNo hay visitas registradas.");

    } else {

        lista.forEach(function(visita) {

            console.log("-------------------------");
            console.log("ID: " + visita.id);
            console.log("Nombre: " + visita.nombre);
            console.log("Curso: " + visita.curso);
            console.log("Motivo: " + visita.motivo);

        });

    }

};

function registrarVisita() {

    console.log("\n===== REGISTRAR VISITA =====");

    let nombre = readline.question("Ingrese su nombre: ");
    let curso = readline.question("Ingrese su curso: ");
    let motivo = readline.question("Motivo de la visita: ");

    if (validarVisita(nombre, curso, motivo)) {

        const nuevaVisita = {
            nombre: nombre,
            curso: curso,
            motivo: motivo
        };

        const consulta = db.prepare(
            "INSERT INTO visitas (nombre, curso, motivo) VALUES (?, ?, ?)"
        );

        const resultado = consulta.run(
            nuevaVisita.nombre,
            nuevaVisita.curso,
            nuevaVisita.motivo
        );

        nuevaVisita.id = resultado.lastInsertRowid;

        visitas.push(nuevaVisita);

        console.log("\n¡Visita registrada correctamente!");

    } else {

        console.log("\nError: complete todos los campos.");

    }

}

function listarVisitas() {

    visitas = db.prepare("SELECT * FROM visitas").all();

    console.log("\n===== VISITAS REGISTRADAS =====");

    mostrarVisitas(visitas);

}

function buscarCurso() {

    let curso = readline.question("\nIngrese el curso que desea buscar: ");

    if (curso === "") {

        console.log("Ingrese un curso valido.");

    } else {

        const consulta = db.prepare(
            "SELECT * FROM visitas WHERE curso LIKE ?"
        );

        const resultados = consulta.all("%" + curso + "%");

        console.log("\n===== RESULTADOS DE BUSQUEDA =====");

        mostrarVisitas(resultados);

    }

}

function contarVisitas() {

    const consulta = db.prepare(
        "SELECT COUNT(*) AS total FROM visitas"
    );

    const resultado = consulta.get();

    console.log("\nCantidad total de visitas: " + resultado.total);

}

function visitasPorCurso() {

    const consulta = db.prepare(
        "SELECT curso, COUNT(*) AS cantidad FROM visitas GROUP BY curso"
    );

    const resultados = consulta.all();

    console.log("\n===== VISITAS POR CURSO =====");

    if (resultados.length === 0) {

        console.log("No hay visitas registradas.");

    } else {

        resultados.forEach((dato) => {

            console.log(dato.curso + ": " + dato.cantidad + " visitas");

        });

    }

}

while (continuar) {

    console.log("\n================================");
    console.log("          AULA MAKER");
    console.log("       Registro de visitas");
    console.log("================================");
    console.log("1. Registrar una visita");
    console.log("2. Mostrar todas las visitas");
    console.log("3. Buscar visitas por curso");
    console.log("4. Contar cantidad de visitas");
    console.log("5. Mostrar visitas por curso");
    console.log("6. Salir");
    console.log("================================");

    let opcion = readline.question("Seleccione una opcion: ");

    switch (opcion) {

        case "1":
            registrarVisita();
            break;

        case "2":
            listarVisitas();
            break;

        case "3":
            buscarCurso();
            break;

        case "4":
            contarVisitas();
            break;

        case "5":
            visitasPorCurso();
            break;

        case "6":
            continuar = false;
            console.log("\nGracias por utilizar Aula Maker.");
            break;

        default:
            console.log("\nOpcion incorrecta.");

    }

}

db.close();
