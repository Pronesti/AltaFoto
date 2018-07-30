
import * as Handlebars from 'handlebars/dist/handlebars';
import { guid } from '../../utils';
import template from './template.html';
import { loggedUser } from '../../index.js';


let mensaje = '';
let database;

// Obtener Elementos
let uploader;
let fileButton;
let firebase;
let storageRef;
let downloadURL;
let porcentaje;

function check(filtro) {
  if (document.getElementById("filtro").value === filtro) {
    return true;
  } else {
    return false;
  }
}

export default (_database, _firebase) => {
  database = _database;
  firebase = _firebase;
  render();
};

const checkUser = (w) => {
  let respuesta;
  if (typeof w === "undefined") {
    respuesta = "No Registrado"
  }
  else {
    respuesta = w.displayName;
  }
  return respuesta;

}

const checkUserPhoto = (w) => {
  let respuesta;
  if (typeof w === "undefined") {
    respuesta = "https://webiconspng.com/wp-content/uploads/2017/09/Anonymous-Mask-PNG-Image-10453.png"
  }
  else {
    respuesta = w.photoURL;
  }
  return respuesta;

}

const crearNuevaImagen = (e) => {

  e.preventDefault();

  const imagen = {
    id: guid(),
    titulo: document.getElementById('titulo').value,
    descripcion: document.getElementById('descripcion').value,
    imagen: downloadURL,
    filtro: document.getElementById("filtro").value,
    owner: checkUser(loggedUser),
    ownerphoto: checkUserPhoto(loggedUser)
  };
  console.log(imagen);
  database.ref(`imagenes/${imagen.id}`).set({
    titulo: imagen.titulo,
    descripcion: imagen.descripcion,
    imagen: imagen.imagen,
    filtro: imagen.filtro,
    owner: imagen.owner,
    ownerphoto: imagen.ownerphoto
  })
    .then(() => {
      mensaje = 'Imagen creada correctamente!';
      render();
    });

  return false;
};

const render = () => {
  const t = Handlebars.compile(template);
  document.getElementById('main').innerHTML = t({ mensaje });
  document.getElementById('boton-nuevo').onclick = crearNuevaImagen;
  createUploader();
}


const createUploader = () => {
  uploader = document.getElementById('uploader');
  fileButton = document.getElementById('fileButton');
  porcentaje = document.getElementById('porcentaje');

  // Vigilar selección archivo
  fileButton.addEventListener('change', function (e) {
    //Obtener archivo
    var file = e.target.files[0];
    // Crear un storage ref
    storageRef = firebase.storage().ref('mis_fotos/' + file.name);

    // Subir archivo
    var task = storageRef.put(file);
    // Actualizar barra progreso
    task.on('state_changed',
      function progress(snapshot) {
        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // uploader.value = percentage;
        $('#porcentaje')
          .css("width", percentage + "%")
          .attr("aria-valuenow", percentage)
          .text(Math.round(percentage) + "% Complete");
      },
      function error(err) {
        // Delete the file
        storageRef.delete().then(function () {
          // File deleted successfully
          console.log("archivo borrado");
        }).catch(function (error) {
          // Uh-oh, an error occurred!
          console.log("error borrando archivo");
        });

      },
      function complete() {

        console.log(storageRef.getDownloadURL().then(function (url) {
          downloadURL = url;
        }));
        //console.log(file);

      }
    )
  });
}

