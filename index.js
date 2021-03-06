
const db = firebase.firestore();

const btnCrear = document.getElementById('exp-form');
const expContainer = document.getElementById('exp-container');

let editStatus = false;

const crearExp = (
    ExpCod,
    KI,
    KF,
    ofi,
    plano,
    ubicacion,
    status,
    notas) =>
    db.collection('expropiaciones').doc().set({
        ExpCod,
        KI,
        KF,
        ofi,
        plano,
        ubicacion,
        status,
        notas
    });

const obtenerExp = () => db.collection('expropiaciones').orderBy("ExpCod", "asc").get();

const obtenerExpEdit = (id) => db.collection('expropiaciones').doc(id).get();

const OnObtenerExp = (callback) => db.collection('expropiaciones').orderBy("KI", "asc").onSnapshot(callback);

const deteleExp = id => db.collection('expropiaciones').doc(id).delete();

window.addEventListener('DOMContentLoaded', async (e) => {

    OnObtenerExp((querySnapshot) =>{

        expContainer.innerHTML = '';

        const urlPlano = document.querySelectorAll('#link-plano');

        querySnapshot.forEach((doc) =>{
            console.log(doc.data().plano)
    
            const expediente = doc.data();
            expediente.id = doc.id;

            const urlOficio = doc.data().plano;
            const urlPlano = doc.data().notas;
            
    
            expContainer.innerHTML += `<div>
            <div class="card card-body mt-2 bg-light">
                <div class="row">
                    <div class="col-sm d-flex flex-row"><h5>${expediente.ExpCod}</h5></div>
                    <div class="col-sm d-flex flex-row">
                        <span><a href="${urlOficio}" id="link-plano"><i class="material-icons">attach_file</i></a></span>
                        <span><a href="${urlPlano}" id="link-plano"><i class="material-icons">location_on</i></a></span>
                    </div>
                </div>
                
                <p>
                    <span style="font-size: 12px">${expediente.ofi}</span>
                    

                </p>
                <p>
                    <span>${expediente.KI}</span>
                    <span> - </span>
                    <span>${expediente.KF}</span>
                    <span class="badge rounded-pill bg-success">${expediente.status}</span>
                    
                </p>
                <div class="justify-content-start">
                    
                    <btn class="btn btn-primary col-4 btn-delete" data-id="${expediente.id}">
                        Eliminar
                    </btn>
                    <btn class="btn btn-primary col-4 btn-edit" data-id="${expediente.id}">
                        Editar
                    </btn>
                </div>
                
            </div>
            </div>`;

            const btnsDelete = document.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', async(e)=>{
                    await deteleExp(e.target.dataset.id)
                })
            });

            const btnsEdit = document.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async(e)=>{
                    const doc =  await obtenerExpEdit(e.target.dataset.id);
                    
                    btnCrear['exp-codigo'].value = doc.data().ExpCod;
                    btnCrear['ki'].value = doc.data().KI;
                    btnCrear['kf'].value = doc.data().KF;
                    btnCrear['oficio'].value = doc.data().ofi;
                    btnCrear['url-plano'].value = doc.data().plano;
                    btnCrear['ubicacion'].value = doc.data().ubicacion;
                    btnCrear['status'].value = doc.data().status;
                    btnCrear['exp-notas'].value = doc.data().notas;

                    editStatus = true;

                })
            });

        });
    });
    
});

btnCrear.addEventListener('submit', async (e) => {
    e.preventDefault();

    const ExpCod = btnCrear['exp-codigo'];
    const KI = btnCrear['ki'];
    const KF = btnCrear['kf'];
    const ofi = btnCrear['oficio'];
    const plano = btnCrear['url-plano'];
    const ubicacion = btnCrear['ubicacion'];
    const status = btnCrear['status'];
    const notas = btnCrear['exp-notas'];


    if (!editStatus) {
        await crearExp (
            ExpCod.value,
            KI.value,
            KF.value,
            ofi.value,
            plano.value,
            ubicacion.value,
            status.value,
            notas.value
        );
    }else{
        btnCrear['form-btn'].innerText = 'Modificar';
    }

    await obtenerExp();
    
    btnCrear.reset();
    ExpCod.focus();


    console.log(ExpCod, KI, KF, ofi, plano, ubicacion, status, notas)
})

