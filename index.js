class Usuario {
    // Datos sobre los usuarios
    static tablaUsuarios = document.getElementById("tablaUsuarios");
    static listaUsuarios = [];
    static cantidadUsuarios = 0;

    // Cantidades fijas para todos los usuarios
    static precioBasico = 50000;
    static precioPro = 75000;
    static precioPremium = 90000;
    static descuentoEspecial = 0.75;
    static año = 2026;
    static impuesto = 1.19;

    // Estadisticas
    static ganancias = 0;
    static totalBasico = 0;
    static totalPro = 0;
    static totalPremium = 0;
    static totalAnfitrion = 0
    static totalInvitado = 0;
    static edadPromedio = 0;
    static usuarioDelMes = "";

    // Constructor para crear usuarios
    constructor (nombre, documento, correo, fecha, plan, tipo, descuento) {
        this.nombre = nombre;
        this.documento = documento;
        this.correo = correo;
        this.fecha = fecha;
        this.plan = plan;
        this.tipo = tipo;
        this.descuento = descuento;
        this.visitas = 1;
        Usuario.cantidadUsuarios++;
    }

    // Registrar un usuario en el menú registrar
    static registar() {
        // Informacion del formulario
        const nombre = document.getElementById("nombre").value;
        const documento = document.getElementById("documento").value;
        const correo = document.getElementById("correo").value;
        const fecha = document.getElementById("fecha").value;
        const plan = document.getElementById("plan").value;
        const tipo = document.getElementById("tipo").value;
        const descuento = document.getElementById("descuento").checked;

        // Informacion adicional de la pagina
        const mensajeRegistrar = document.getElementById("mensajeRegistrar");

        // Verificar si el usuario ya estaba comparando el documento y correo ingresados
        let usuarioExistente =  Usuario.listaUsuarios.filter((usuario) => {return usuario.documento == documento || usuario.correo == correo;});
        
        // Si ya existía, mostramos un mensaje que lo indique. De lo contrario, lo creamos e insertamos
        if (usuarioExistente.length >= 1) {
            mensajeRegistrar.textContent = `El usuario ya está registrado!`;
        } else if (nombre == "" || documento == "" || correo == "" || fecha == "" || plan == "" || tipo == ""){
            mensajeRegistrar.textContent = `Información incompleta! Intentalo de nuevo.`;
        } else {
            let usuario = new Usuario(nombre, documento, correo, fecha, plan, tipo, descuento ? "Sí" : "No");
            Usuario.listaUsuarios.push(usuario);

            Usuario.tablaUsuarios.innerHTML += `<tr class="text-center">
                                                <td>${usuario.nombre}</td>
                                                <td>${usuario.documento}</td>
                                                <td>${usuario.correo}</td>
                                                <td>${usuario.fecha}</td>
                                                <td>${usuario.plan}</td>
                                                <td>${usuario.tipo}</td>
                                                <td>${usuario.descuento}</td>
                                                <td>${usuario.visitas}</td>
                                            </tr>`;
        }
    }

    static ingresar() {
        // Informacion del input
        const documentoIngresar = document.getElementById("documentoIngresar").value;

        // Informacion adicional de la pagina
        const mensajeIngresar = document.getElementById("mensajeIngresar");

        // Verificar si el usuario ya estaba comparando el documento y correo ingresados
        let usuarioExistente =  Usuario.listaUsuarios.filter((usuario) => {return usuario.documento == documentoIngresar;});

        // Si no se encuentra se indice. De lo contrario se agrega una nueva visita.
        if (usuarioExistente.length >= 1) {
            usuarioExistente[0].visitas++; // Quedamos debiendo como reemplazar el valor en la tabla
        } else if (documentoIngresar == "") {
            mensajeIngresar.textContent = "Debe ingresar un número de documento!";
        } else {
            mensajeIngresar.textContent = "El usuario no figura en el sistema, por favor registrelo.";
        }
    }

    static recorrerUsuarios(usuario) {
        const impuesto = Usuario.impuesto;

        if (usuario.tipo == "Invitado"){
            Usuario.totalInvitado++;
            return 0;
        } 

        Usuario.totalAnfitrion = Usuario.cantidadUsuarios - Usuario.totalInvitado;

        Usuario.edad += Usuario.calcularEdad(usuario);

        let plan = usuario.plan;
        let descuento = usuario.descuento ? Usuario.descuentoEspecial : 1;
        switch(plan) {
            case "Básico":
                Usuario.totalBasico++;
                return Usuario.precioBasico * impuesto * descuento;
            case "Pro":
                Usuario.totalPro++;
                return Usuario.precioPro * impuesto * descuento;
            case "Premium":
                Usuario.totalPremium++;
                return Usuario.precioPremium * impuesto * descuento;
        }

    }

    static calcularEdad(usuario) {
        let edad = Usuario.año - Number(usuario.fecha.split("-")[0]);
        return edad;
    }

    static calcularGanancia() {
        const listaPrecioUsuarios = Usuario.listaUsuarios.map(Usuario.recorrerUsuarios);
        Usuario.ganancias = listaPrecioUsuarios.reduce((acumulador, valor) => {return acumulador + valor;});
        Usuario.edadPromedio /= Usuario.cantidadUsuarios;
    }

    static actualizarEstadisticas() {
        const usuariosActivos = document.getElementById("usuariosActivos");
        const gananciaMes = document.getElementById("gananciaMes");
        const masComprado = document.getElementById("masComprado");
        const pAnfitrion = document.getElementById("pAnfitrion");
        const pInvitado = document.getElementById("pInvitado");
        const edadPromedio = document.getElementById("edadPromedio");
        const masActivo = document.getElementById("masActivo");

        Usuario.calcularGanancia();
        console.log(Usuario.totalBasico, Usuario.totalPro, Usuario.totalPremium);

        usuariosActivos.textContent = `Tenemos ${Usuario.cantidadUsuarios} usuarios activos este mes`;
        gananciaMes.textContent = `Se tuvo una ganancia de $${Usuario.ganancias.toFixed(2)} este mes`;
        masComprado.textContent = `El plan más comprado es: ${Math.max(Usuario.totalBasico, Usuario.totalPro, Usuario.totalPremium)}`;
        pAnfitrion.textContent = `El porcentaje de anfitriones es de ${(Usuario.totalAnfitrion / Usuario.cantidadUsuarios * 100).toFixed(1)}%`;
        pInvitado.textContent = `El porcentaje de invitados es de ${(Usuario.totalInvitado / Usuario.cantidadUsuarios * 100).toFixed(1)}%`;
        edadPromedio.textContent = `La edad promedio es de ${Usuario.edadPromedio} años`;
        masActivo.textContent = `El usuario del mes es Juancho! Felicidades!`;
    }
}