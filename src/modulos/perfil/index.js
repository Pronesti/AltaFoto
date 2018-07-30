import * as Handlebars from 'handlebars/dist/handlebars';
import firebase from 'firebase';
import template from './template.html';

let logginbutton;
let loggoutbutton;

let database;
var provider = new firebase.auth.GoogleAuthProvider();
let imagenes = [];

let loggedUser;

export default (_database) => {
	database = _database;
	imagenes = [];
	listarImagenes();
}

const usuarioNoRegistrado = () => {
	document.getElementById('noregistradotexto').innerHTML = "Usuario no registrado";
	document.getElementById('noregistradoimagen').src = "https://png.icons8.com/ios/1600/anonymous-mask.png";
	logginbutton.style.visibility = 'visible';
	loggoutbutton.style.visibility = 'hidden';
}

const usuarioRegistrado = () => {

	try {
		document.getElementById('dondevalaimagen').src = loggedUser.photoURL;
		document.getElementById('dondevaelnombre').innerHTML = loggedUser.displayName;
		logginbutton.style.visibility = 'hidden';
		loggoutbutton.style.visibility = 'visible';
	}
	catch (err) {
		alert(err);
	}

}

const listarImagenes = () => {
	const lista = database
		.ref('/imagenes')
		.once("value")
		.then((datos_imagenes) => {

			datos_imagenes.forEach((element) => {
				const datosImagen = element.val();
				datosImagen.id = element.key;
				let object = element.val();


				try {

					if (datosImagen.owner === loggedUser.displayName) {
						imagenes.push(datosImagen);
					}
				}
				catch (err) {
				}
			});
			render();
		});
}


const render = () => {

	const t = Handlebars.compile(template);
	document.getElementById('main').innerHTML = t({ imagenes });
	logginbutton = document.getElementById("entrar");
	loggoutbutton = document.getElementById("logOut");

	logginbutton.onclick = function () {
		firebase.auth()
			.signInWithPopup(provider)
			.then(function (result) {
				//console.log(result.user);
				loggedUser = result.user;
				logginbutton.style.visibility = 'hidden';
				loggoutbutton.style.visibility = 'visible';

				listarImagenes();
			});
	}


	loggoutbutton.onclick = function () {
		firebase.auth().signOut();
		loggedUser = "sefue";
		window.location.href = "/home";
		logginbutton.style.visibility = 'visible';
		loggoutbutton.style.visibility = 'hidden';

	}

	if (typeof loggedUser === "undefined") {
		usuarioNoRegistrado();
	} else {
		if (loggedUser === "sefue") {
			usuarioNoRegistrado();
		} else {
			usuarioRegistrado();
		}
	}
}


export { loggedUser };