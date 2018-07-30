import './index.scss';
import Navigo from 'navigo';
import firebase from 'firebase';
import catchLinks from 'catch-links';
import firebaseConfig from '../firebase.config';

import home from './modulos/home';
import listar from './modulos/listar';
import nuevo from './modulos/nuevo';
import perfil from './modulos/perfil';

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

// Esto es de navigo
var root = null;
var useHash = false;
var router = new Navigo(root, useHash);


router
	.on({
		'listar': () => listar(database),
		'nuevo': () => nuevo(database, firebase),
		'home': () => home(database),
		'perfil': () => perfil(database)
	})
	.resolve();


catchLinks(window, function (href) {
	router.navigate(href);
});

// requires httprequest
firebase.auth().onAuthStateChanged(user => {
	if (user) {
		if (user.emailVerified === false) {
			firebase.auth().signOut()
		} else {
			;
			//console.log('usario registrado');
		}
	} else {
		//console.log('usuario desconectado');
		// will get to here from a logout event
	}
});
