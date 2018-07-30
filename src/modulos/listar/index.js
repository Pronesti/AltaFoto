import * as Handlebars from 'handlebars/dist/handlebars';
import template from './template.html';

let database;

let imagenes = [];

let todosboton;
let perrosboton;
let gatosboton;
let peopleboton;
let landscapeboton;


export default (_database) => {
	database = _database;
	imagenes = [];
	listarImagenes();
}

const listarImagenes = () => {
	const lista = database
		.ref('/imagenes')
		.once("value")
		.then((datos_imagenes) => {

			imagenes = [];

			datos_imagenes.forEach((element) => {
				const datosImagen = element.val();
				datosImagen.id = element.key;
				let object = element.val();

				imagenes.push(datosImagen);
			});
			render();
		});
}


const listarPerros = () => {
	const lista = database
		.ref('/imagenes')
		.once("value")
		.then((datos_imagenes) => {

			imagenes = [];

			datos_imagenes.forEach((element) => {
				const datosImagen = element.val();
				datosImagen.id = element.key;
				let object = element.val();
				if (object.filtro === "dog") {
					imagenes.push(datosImagen);
				}

			});
			render();
		});
}

const listarGatos = () => {
	const lista = database
		.ref('/imagenes')
		.once("value")
		.then((datos_imagenes) => {

			imagenes = [];

			datos_imagenes.forEach((element) => {
				const datosImagen = element.val();
				datosImagen.id = element.key;
				let object = element.val();
				if (object.filtro === "cat") {
					imagenes.push(datosImagen);
				}

			});
			render();
		});
}
const listarPeople = () => {
	const lista = database
		.ref('/imagenes')
		.once("value")
		.then((datos_imagenes) => {

			imagenes = [];

			datos_imagenes.forEach((element) => {
				const datosImagen = element.val();
				datosImagen.id = element.key;
				let object = element.val();
				if (object.filtro === "people") {
					imagenes.push(datosImagen);
				}

			});
			render();
		});
}
const listarLandscape = () => {
	const lista = database
		.ref('/imagenes')
		.once("value")
		.then((datos_imagenes) => {

			imagenes = [];

			datos_imagenes.forEach((element) => {
				const datosImagen = element.val();
				datosImagen.id = element.key;
				let object = element.val();
				if (object.filtro === "landscape") {
					imagenes.push(datosImagen);
				}

			});
			render();
		});
}


const render = () => {



	const t = Handlebars.compile(template);
	document.getElementById('main').innerHTML = t({ imagenes });


	todosboton = document.getElementById('todos');
	perrosboton = document.getElementById('dog');
	gatosboton = document.getElementById('cat');
	peopleboton = document.getElementById('people');
	landscapeboton = document.getElementById('landscape');

	todosboton.onclick = function (imagenes) {

		$('#album').empty();

		listarImagenes();

	};

	perrosboton.onclick = function (imagenes) {

		$('#album').empty();

		listarPerros();

	};

	gatosboton.onclick = function (imagenes) {

		$('#album').empty();

		listarGatos();

	};

	peopleboton.onclick = function (imagenes) {

		$('#album').empty();

		listarPeople();

	};

	landscapeboton.onclick = function (imagenes) {

		$('#album').empty();

		listarLandscape();

	};


}





