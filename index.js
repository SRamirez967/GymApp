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
    static totalPlanes = [0, 0, 0];
    static totalTipos = [0, 0]

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

        switch(plan) {
            case "Básico":
                Usuario.totalPlanes[0]++;
                break;
            case "Pro":
                Usuario.totalPlanes[1]++;
                break;
            case "Premium":
                Usuario.totalPlanes[2]++;
                break;
        }

        switch(tipo) {
            case "Anfitrión":
                Usuario.totalTipos[0]++;
                break;
            case "Invitado":
                Usuario.totalTipos[1]++;
                break;
        }
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

            Usuario.agregarUsuarioTabla(usuario);

            // Limpiar el formulario para futuros usos
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input =>  input.value = '');
        }
    }

    // Actualizar la tabla
    static agregarUsuarioTabla(usuario) {
        Usuario.tablaUsuarios.innerHTML += `<tr class="text-center">
                                                <td>${usuario.nombre}</td>
                                                <td>${usuario.documento}</td>
                                                <td>${usuario.correo}</td>
                                                <td>${usuario.fecha}</td>
                                                <td>${usuario.plan}</td>
                                                <td>${usuario.tipo}</td>
                                                <td>${usuario.descuento ? "Si" : "No"}</td>
                                                <td>${usuario.visitas}</td>
                                            </tr>`;
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

            // Limpiar el input para futuros usos
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input =>  input.value = '');
        } else if (documentoIngresar == "") {
            mensajeIngresar.textContent = "Debe ingresar un número de documento!";
        } else {
            mensajeIngresar.textContent = "El usuario no figura en el sistema, por favor registrelo.";
        }
    }

    static calcularPrecioUsuarios(usuario) {
        const impuesto = Usuario.impuesto;

        if (usuario.tipo == "Invitado"){
            return 0;
        } 

        let plan = usuario.plan;
        let descuento = usuario.descuento ? Usuario.descuentoEspecial : 1;
        switch(plan) {
            case "Básico":
                return Usuario.precioBasico * impuesto * descuento;
            case "Pro":
                return Usuario.precioPro * impuesto * descuento;
            case "Premium":
                return Usuario.precioPremium * impuesto * descuento;
        }
    }

    static calcularMasComprado(lista) {
        let comprasMaximas = lista.reduce((anterior, actual) => {return Math.max(anterior, actual);});
        let planMaximo = lista.indexOf(comprasMaximas);
        switch(planMaximo) {
            case 0:
                return ["Plan Básico", comprasMaximas];
            case 1:
                return ["Plan Pro", comprasMaximas];
            case 2:
                return ["Plan Premium", comprasMaximas];
        }
    }

    static calcularEdadUsuario(usuario) {
        let añoNacimiento = Number(usuario.fecha.split("-")[0]);
        let edadUsuario = Usuario.año - añoNacimiento;
        return edadUsuario;
    }

    static calcularMasActivo(lista) {
        let masActivo = lista[0];
        
        // Buscamos uno por uno cual es el usuario mas activo
        for (let u of lista) {
            if (u.visitas > masActivo.visitas) {
                masActivo = u;
            }
        }

        // Aplicar descuento
        masActivo.descuento = true;

        return masActivo;
    } 

    static actualizarEstadisticas() {
        // Etiquetas donde se mostraran los resultados de las estadísticas
        const usuariosActivos = document.getElementById("usuariosActivos");
        const gananciaMes = document.getElementById("gananciaMes");
        const masComprado = document.getElementById("masComprado");
        const pAnfitrion = document.getElementById("pAnfitrion");
        const pInvitado = document.getElementById("pInvitado");
        const edadPromedio = document.getElementById("edadPromedio");
        const masActivo = document.getElementById("masActivo");

        if (Usuario.listaUsuarios.length > 0) {
            // Cantidad de usuarios
            let cantidadUsuarios = Usuario.cantidadUsuarios;

            // Ganancia mensual
            let ganancia = Usuario.listaUsuarios.map(Usuario.calcularPrecioUsuarios).reduce((acumulador, valor) => {return acumulador + valor;});
            
            // Plan mas comprado
            let planMasComprado = Usuario.calcularMasComprado(Usuario.totalPlanes);
            let plan = planMasComprado[0];
            let numeroCompras = planMasComprado[1];

            // Porcentaje anfitriones e invitados
            let porcAnfitrion = (Usuario.totalTipos[0] / Usuario.cantidadUsuarios * 100).toFixed(1);
            let porcInvitado = (Usuario.totalTipos[1] / Usuario.cantidadUsuarios * 100).toFixed(1);

            // Edad promedio
            let edad = Usuario.listaUsuarios.map(Usuario.calcularEdadUsuario).reduce((acumulador, valor) => {return acumulador + valor;});
            let edadProm = Math.floor(edad / Usuario.cantidadUsuarios);
            
            // Usuario más activo
            let usuarioDelMes = Usuario.calcularMasActivo(Usuario.listaUsuarios);
            
            // Aplicando los resultados a las etiquetas para mostrarlos en pantalla
            usuariosActivos.textContent = `Tuvimos ${cantidadUsuarios} usuarios activos este mes`;
            gananciaMes.textContent = `Se tuvo una ganancia de $${ganancia} este mes`;
            masComprado.textContent = `El plan más comprado fue ${plan} con ${numeroCompras} compras`;
            pAnfitrion.textContent = `El porcentaje de anfitriones fue de ${porcAnfitrion}%`;
            pInvitado.textContent = `El porcentaje de invitados fue de ${porcInvitado}%`;
            edadPromedio.textContent = `La edad promedio fue de ${edadProm} años`;
            masActivo.textContent = `El usuario del mes es ${usuarioDelMes.nombre} con ${usuarioDelMes.visitas} visitas! Felicidades!`;
        } else {
            usuariosActivos.textContent = `Aún no hay usuarios registrados`;
        }
    }

    static actualizarTabla() {
        Usuario.tablaUsuarios.innerHTML = `<tr class="bg-[#59C9A5]">
                                                <th>NOMBRE</th>
                                                <th>DOCUMENTO</th>
                                                <th>CORREO</th>
                                                <th>F. NACIMIENTO</th>
                                                <th>PLAN</th>
                                                <th>TIPO</th>
                                                <th>DESC</th>
                                                <th>VISITAS</th>
                                            </tr>`;

        for (let usuario of Usuario.listaUsuarios) {
            Usuario.agregarUsuarioTabla(usuario);
        }
        
    }
}
