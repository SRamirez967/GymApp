function registar() {
    const nombre = document.getElementById("nombre").value;
    const documento = document.getElementById("documento").value;
    const correo = document.getElementById("correo").value;
    const fecha = document.getElementById("fecha").value;
    const plan = document.getElementById("plan").value;
    const tipo = document.getElementById("tipo").value;
    const descuento = document.getElementById("descuento").checked;

    console.log(`Nombre: ${nombre}`);
    console.log(`Documento: ${documento}`);
    console.log(`Correo: ${correo}`);
    console.log(`Fecha: ${fecha}`);
    console.log(`Plan: ${plan}`);
    console.log(`Tipo: ${tipo}`);
    console.log(`Descuento: ${descuento}`);
}
