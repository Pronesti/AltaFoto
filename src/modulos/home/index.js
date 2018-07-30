import * as Handlebars from 'handlebars/dist/handlebars';
//import Handlebars from 'handlebars';


import template from './template.html';

let database;

let imagenes = [];

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

			datos_imagenes.forEach((element) => {
				const datosImagen = element.val();
				datosImagen.id = element.key;
				let object = element.val();
				imagenes.push(datosImagen);
			});

			render();
		});
}


const render = () => {
	const t = Handlebars.compile(template);
	document.getElementById('main').innerHTML = t({ imagenes });
}