require('colors')

const { guardarDB,leerDB } = require('./helpers/guardarArchivo')
const {
    inquirerMenu, 
    pausa,
    leerInput,
    listadoTareasBorrar,
    confirmar,
    mostrarListadoChecklist,
} = require('./helpers/inquirer')

const  Tareas = require('./models/tareas')


const main = async () => {

    let opt = ''
    const tareas = new Tareas()

    const tareasDB = leerDB()

    if(tareasDB){
        tareas.cargarTareasFromArray(tareasDB)
    }


    do {
        //Imprimir el menu
        opt = await inquirerMenu()
        
        switch (opt) {
            case '1':
               //crear opcion
                const desc = await leerInput('Descripcion:')
                tareas.crearTarea(desc)
            break
            
            case '2':
                tareas.listadoCompleto()
            break

            case '3'://listar completadas
                tareas.listarPendientescompletadas(true)
            break

            case '4':// listar pendientes
                tareas.listarPendientescompletadas(false)
            break

            case '5':// listar checkins
                const ids = await mostrarListadoChecklist(tareas.listadoArr)
                tareas.toggleCompletadas(ids)
            break

            case '6'://borrar tareas
                const id = await listadoTareasBorrar(tareas.listadoArr)
                const ok = await confirmar('Esta seguro?')
                if (id !== '0') {
                    if (ok) {
                        tareas.borrarTarea(id)
                        console.log('Tarea Borrada')
                    }
                }
                
            break
            
        }
    
        guardarDB(tareas.listadoArr)


        await pausa()

    } while (opt !== '0');

    //pausa()

}

main()