class Persona
{
    id = 0;
    nombre = "";
    apellido = "";
    fechaNacimiento = 0;

    constructor(id, nombre, apellido, fechaNacimiento) {                
        this.id = id;  
        this.nombre = nombre;
        this.apellido = apellido; 
        this.fechaNacimiento = fechaNacimiento;                         
    }

    toString() {
        return this.id + " - " + this.nombre + " - " + this.apellido + " - " + this.fechaNacimiento;
    }  
}

class Ciudadano extends Persona
{
    dni = 0;

    constructor(id, nombre, apellido, fechaNacimiento, dni){                
        super(id, nombre, apellido, fechaNacimiento);

        this.dni = dni;
    }

    toString() {
        return super.toString() + " - " + this.dni;
    }     
}

class Extranjero extends Persona
{
    paisOrigen = "";

    constructor(id, nombre, apellido, fechaNacimiento, paisOrigen){                
        super(id, nombre, apellido, fechaNacimiento);

        this.paisOrigen = paisOrigen;
    }

    toString(){
        return super.toString() + " - " + this.paisOrigen;
    }     
}

const url = "https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero";

let listaDePersonas  = new Array();

function MostrarSpinner()
{
    if(document.getElementById("spinner").style.display == "flex") {
        document.getElementById("spinner").style.display = "none";
    }

    else {
        document.getElementById("spinner").style.display = "flex"
    }
}

function CargarListaPersona() {

    var xmlhttp = new XMLHttpRequest();
    MostrarSpinner();  

    xmlhttp.onreadystatechange = function ()
    {
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            let listaPersonasJson = JSON.parse(xmlhttp.response);
            console.log(listaPersonasJson);

            CrearListaDePersonas(listaPersonasJson); 
            CrearTabla();
            MostrarSpinner();

            alert("Se cargó correctamente.");                     
        } 
    }

    xmlhttp.open("GET", url);
    xmlhttp.setRequestHeader('Content-type', 'application/json');
    xmlhttp.send();
}

function ReiniciarAbm()
{
    document.getElementById("id").value = "";
    document.getElementById("atributo1").value = "";
    document.getElementById("atributo2").value = "";
    document.getElementById("atributo3").value = "";    
    document.getElementById("atributo4").value = "";

    if(document.getElementById("tipoPersona").disabled == true) {
        document.getElementById("tipoPersona").disabled = false;
    }    
}

function LimpiarBody(){

    let tbodyExistente = document.getElementById("tbodyPersona");

    while (tbodyExistente.firstChild) {
        tbodyExistente.removeChild(tbodyExistente.firstChild);
    }
}

function LimpiarEncabezado() {
    
    let theadExistente = document.getElementById("theadPersona");

    while (theadExistente.firstChild){
        theadExistente.removeChild(theadExistente.firstChild);
    }
}

function CrearTabla() {

    let tabla = document.getElementById("tablaPersonas");
    let thead;

    if (document.getElementById("theadPersona") == null) {
        thead = document.createElement("thead");
        thead.id = "theadPersona";
        tabla.appendChild(thead);
    }

    else {
        LimpiarEncabezado();
    }

    thead = document.getElementById("theadPersona");

    let trHead = document.createElement("tr");
    thead.appendChild(trHead);

    let arrayEncabezado = 
    [
        "ID",
        "Nombre",
        "Apellido",
        "Fecha de Nacimiento",
        "DNI",
        "Pais Origen",       
        "Modificar",
        "Eliminar"
    ];

    for (let i = 0; i < arrayEncabezado.length; i++) {

        let th = document.createElement("th");
        let thTexto = document.createTextNode(arrayEncabezado[i]);
        th.appendChild(thTexto);
        trHead.appendChild(th);
    }

    tabla.appendChild(thead);

    let tbody

    if (document.getElementById("tbodyPersona") == null) {

        tbody = document.createElement("tbody");
        tbody.id = "tbodyPersona";
        tabla.appendChild(tbody);
    }
    else {
        LimpiarBody();
    }

    tbody = document.getElementById("tbodyPersona");

    let contador = 0;
    listaDePersonas.forEach(function (persona) 
    {
        console.log(persona);
        if (persona instanceof Persona) {

            let tr = document.createElement("tr");
            tr.id = "tr" + contador;
            contador++;

            tbody.appendChild(tr);

            for (let i = 0; i < arrayEncabezado.length - 2; i++) {

                let td = document.createElement("td");
                let tdTexto = document.createTextNode("N/A");

                switch (i) {
                    case 0:
                        tdTexto = document.createTextNode(persona.id);
                        break;

                    case 1:
                        tdTexto = document.createTextNode(persona.nombre);
                        break;

                    case 2:
                        tdTexto = document.createTextNode(persona.apellido);
                        break;

                    case 3:
                        tdTexto = document.createTextNode(persona.fechaNacimiento);
                        break;

                    case 4:
                        if (persona instanceof Ciudadano){
                            tdTexto = document.createTextNode(persona.dni);
                        }
                        break; 

                    case 5:
                        if (persona instanceof Extranjero){
                            tdTexto = document.createTextNode(persona.paisOrigen);
                        }
                        break;             
                }

                td.appendChild(tdTexto);
                tr.appendChild(td);
            }

            let tdModificar = document.createElement("td");
            let botonModificar = document.createElement("input");
            botonModificar.type = "button";
            botonModificar.id = "modificar";
            botonModificar.value = "Modificar";

            botonModificar.addEventListener("click", function()
            { 
                document.getElementById("encabezadoFormularioABM").textContent = "Formulario para modificar datos";
                document.getElementById('formularioABM').style.display = 'block';                
                document.getElementById('formLista').style.display = 'none';

                ObtenerDatosFila(tr, 'modificar');                
            });

            tdModificar.appendChild(botonModificar);
            tr.appendChild(tdModificar);

            let tdEliminar = document.createElement("td");
            let botonEliminar = document.createElement("input");
            botonEliminar.type = "button";
            botonEliminar.id = "eliminar";
            botonEliminar.value = "Eliminar";
            tdEliminar.appendChild(botonEliminar);

            botonEliminar.addEventListener("click", function()
            { 
                document.getElementById("encabezadoFormularioABM").textContent = "Formulario para eliminar registros";                
                document.getElementById('formLista').style.display = 'none';

                ObtenerDatosFila(tr, 'eliminar');                         
            });

            tr.appendChild(tdEliminar);
        }
    });
}

async function CrearPersona() 
{
    let nombre = document.getElementById("atributo1").value;
    let apellido = document.getElementById("atributo2").value;
    let fechaNacimiento = document.getElementById("atributo3").value;
    let tipo = document.getElementById("tipoPersona").value;
    let atributo4 = document.getElementById("atributo4").value;

    if (tipo == "ciudadano") {
        data = 
        {
            nombre: nombre,
            apellido: apellido,
            fechaNacimiento: fechaNacimiento,
            dni: atributo4,
        }
    }
    else if (tipo == "extranjero") {
        data = 
        {
            nombre: nombre,
            apellido: apellido,
            fechaNacimiento: fechaNacimiento,
            paisOrigen: atributo4,
        }
    }

    console.log(data);
    MostrarSpinner();

    try 
    {
        const response = await fetch(url,
        {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: 
            {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });

        if (response.ok){
            response.json().then(resultado => 
            {
                if (resultado.id != null && !isNaN(resultado.id)) {
                    
                    let nuevaPersona;

                    if (tipo == "ciudadano" && nombre != null && nombre != "" && apellido != null && apellido != "" && atributo4 != null && atributo4 != ""){

                        nuevaPersona = new Ciudadano(resultado.id, nombre, apellido, fechaNacimiento, atributo4);
                        listaDePersonas.push(nuevaPersona);

                        alert("El Ciudadano fue registrado correctamente.");
                    }

                    else if (tipo == "extranjero" && nombre != null && nombre != "" && apellido != null && apellido != "" && atributo4 != null && atributo4 != "") {
                        
                        nuevaPersona = new Extranjero(resultado.id, nombre, apellido, fechaNacimiento, atributo4);
                        listaDePersonas.push(nuevaPersona);

                        alert("El Extranjero fue registrado correctamente.");
                    }

                    else {
                        alert("Error. Datos incorrectos. Reintentar.");
                    }    

                    CrearTabla();  
                }
    
                else {
                    alert("Error. Datos incorrectos.");
                }

                MostrarSpinner();
                ReiniciarAbm();
                
            });
        }
        else {
            let resultado = await response.text();
            throw new Error(resultado);
        }
    }
    catch (error) 
    {
        console.error("Error en la Solicitud:", error);
        alert(error);

        MostrarSpinner();
        ReiniciarAbm();        
    }
}

function ObtenerDatosFila(fila, accion) 
{
    var datos = [];
    var celdas = fila.querySelectorAll('td');
    document.getElementById("tipoPersona").disabled = true;  

    celdas.forEach(function(celda) 
    {
        datos.push(celda.textContent || '');
    });
    
    
    if(datos[4] != 'N/A') {

        ciudadanoSeleccionado = new Ciudadano(datos[0],datos[1],datos[2],datos[3],datos[4]);

        console.log(ciudadanoSeleccionado.toString());
        document.getElementById("id").value = ciudadanoSeleccionado.id;
        document.getElementById("tipoPersona").value = "ciudadano";
        document.getElementById("atributo1").value = ciudadanoSeleccionado.nombre;
        document.getElementById("atributo2").value = ciudadanoSeleccionado.apellido;
        document.getElementById("atributo3").value = ciudadanoSeleccionado.fechaNacimiento;
        document.getElementById("atributo4").value = ciudadanoSeleccionado.dni;

        document.getElementById("formularioABM").style.display = 'block';

        CambiarAtributos();
    }
    else {      

        extranjeroSeleccionado = new Extranjero(datos[0],datos[1],datos[2],datos[3],datos[5]);
        
        console.log(extranjeroSeleccionado.toString());
        document.getElementById("id").value = datos[0];
        document.getElementById("tipoPersona").value = "extranjero";
        document.getElementById("atributo1").value = extranjeroSeleccionado.nombre;
        document.getElementById("atributo2").value = extranjeroSeleccionado.apellido;
        document.getElementById("atributo3").value = extranjeroSeleccionado.fechaNacimiento;
        document.getElementById("atributo4").value = extranjeroSeleccionado.paisOrigen;

        CambiarAtributos();
    }

    if(accion == 'modificar'){
        document.getElementById("agregarAbm").style.display = 'none';  
        document.getElementById("modificarAbm").style.display = 'block';    
        document.getElementById("eliminarAbm").style.display = 'none';   
    }
    else if(accion == 'eliminar'){
        document.getElementById("agregarAbm").style.display = 'none';  
        document.getElementById("modificarAbm").style.display = 'none';    
        document.getElementById("eliminarAbm").style.display = 'block';   
        document.getElementById("formularioABM").style.display = 'block';
    }
}

function ModificarPersona() 
{
    let id = document.getElementById("id").value;
    let nombre = document.getElementById("atributo1").value;
    let apellido = document.getElementById("atributo2").value;
    let fechaNacimiento = document.getElementById("atributo3").value;
    let tipo = document.getElementById("tipoPersona").value;    
    let atributo4 = document.getElementById("atributo4").value;

    if (tipo == "ciudadano") {
        data = 
        {
            id: id,
            nombre: nombre,
            apellido: apellido,
            fechaNacimiento: fechaNacimiento,
            dni: atributo4,
        }
    }
    else if (tipo == "extranjero") {
        data = 
        {
            id: id,
            nombre: nombre,
            apellido: apellido,
            fechaNacimiento: fechaNacimiento,
            paisOrigen: atributo4,
        }
    }

    MostrarSpinner();

    fetch(url,
        {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        }).then(response => 
            {
            if (!response.ok) {
                return response.text().then(mensajeError => 
                {
                    throw new Error(mensajeError);
                });
            }
            else 
            {
                if (tipo == "ciudadano" && nombre != null && nombre != "" && apellido != null && apellido != "" && atributo4 > 0) {
                    
                    CambiarAtributos();

                    response.text().then(mensajeExito => 
                    {
                        listaDePersonas.map(persona => 
                        {
                            if (persona.id == id) {
                                persona.nombre = nombre;
                                persona.apellido = apellido;
                                persona.fechaNacimiento = fechaNacimiento;
                                persona.dni = atributo4;                                                           
                            }
                        });

                        alert(mensajeExito);

                        CrearTabla();
                    })

                }
                else if (tipo == "extranjero" && nombre != null && nombre != "" && apellido != null && apellido != "" && atributo4 != null && atributo4 != "") {
                    
                    CambiarAtributos();

                    response.text().then(mensajeExito => 
                    {
                        listaDePersonas.map(persona => 
                        {
                            if (persona.id == id) {
                                persona.nombre = nombre;
                                persona.apellido = apellido;
                                persona.fechaNacimiento = fechaNacimiento;
                                persona.paisOrigen = atributo4;                                                             
                            }
                        });

                        alert(mensajeExito);

                        CrearTabla();
                    })
                }
                
                else {
                    alert("Error. Verificar datos.");
                }
            }
        }).catch(error => 
        {
            console.error("Error en la Solicitud:", error);
            alert(error);
        }).then(() => 
        {
            MostrarSpinner();           
            ReiniciarAbm();
        });
}

async function EliminarPersona() 
{
    idBorrar = document.getElementById("id").value;
    idBorrarObj = { id: idBorrar };

    MostrarSpinner();

    try 
    {
        const response = await fetch(url,
        {
            method: 'DELETE',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: 
            {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(idBorrarObj)
        });
        let resultado = await response.text();
        if (!response.ok) 
        {
            throw new Error(resultado);
        }
        else 
        {
            listaDePersonas = listaDePersonas.filter(persona => persona.id != idBorrar);            
            alert(resultado);

            CrearTabla();
        }

    }
    catch (error) 
    {
        console.error("Error en la Solicitud:", error);
        alert(error);
    }

    MostrarSpinner();
    CrearTabla();
}

function CrearListaDePersonas(objetoPersona)
{
    listaDePersonas = objetoPersona.map(persona => 
    {
        let personaCreada;
        
        if ("dni" in persona) {
            personaCreada = new Ciudadano(persona.id, persona.nombre, persona.apellido, persona.fechaNacimiento, persona.dni);
        }
        else if ("paisOrigen" in persona) {
            personaCreada = new Extranjero(persona.id, persona.nombre, persona.apellido, persona.fechaNacimiento, persona.paisOrigen);
        }
        
        return personaCreada;
    });
}

function CambiarAtributos() 
{
    const tipo = document.getElementById('tipoPersona').value;
    const labelAtributo1 = document.getElementById('labelAtributo1');
    const labelAtributo2 = document.getElementById('labelAtributo2');
    const labelAtributo3 = document.getElementById('labelAtributo3');
    const labelAtributo4 = document.getElementById('labelAtributo4');

    switch(tipo) {
        case "ciudadano":
            labelAtributo1.textContent = 'Nombre: ';
            labelAtributo2.textContent = 'Apellido: ';
            labelAtributo3.textContent = 'Fecha de Nacimiento: ';
            labelAtributo4.textContent = 'DNI: ';
            break;

        case "extranjero":
            labelAtributo1.textContent = 'Nombre: ';
            labelAtributo2.textContent = 'Apellido: ';
            labelAtributo3.textContent = 'Fecha de Nacimiento: ';
            labelAtributo4.textContent = 'Pais Origen: ';
            break;     
    }
}

window.onload = CargarListaPersona();

document.getElementById('agregar').addEventListener('click', function() 
{
    document.getElementById('formularioABM').style.display = 'block';
    document.getElementById('formLista').style.display = 'none';
    document.getElementById("agregarAbm").style.display = 'block';  
    document.getElementById("modificarAbm").style.display = 'none';    
    document.getElementById("eliminarAbm").style.display = 'none';

    CambiarAtributos();
});

document.getElementById('agregarAbm').addEventListener('click', function() 
{
    document.getElementById('formularioABM').style.display = 'none';
    document.getElementById('formLista').style.display = 'block';
});

document.getElementById('modificarAbm').addEventListener('click', function() 
{
    document.getElementById('formularioABM').style.display = 'none';
    document.getElementById('formLista').style.display = 'block';

    ReiniciarAbm();
});

document.getElementById('eliminarAbm').addEventListener('click', function() 
{
    document.getElementById('formularioABM').style.display = 'none';
    document.getElementById('formLista').style.display = 'block';
    document.getElementById("agregarAbm").style.display = 'none';  
    document.getElementById("modificarAbm").style.display = 'none';    
    document.getElementById("eliminarAbm").style.display = 'block';

    ReiniciarAbm();
});

document.getElementById('cancelar').addEventListener('click', function() 
{
    document.getElementById('formularioABM').style.display = 'none';
    document.getElementById('formLista').style.display = 'block';

    ReiniciarAbm();
});