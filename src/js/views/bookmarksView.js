import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View{
	_parentElement = document.querySelector('.bookmarks__list'); //it can be taken even tho its an ul (un-ordered list)
	_errorMessage = 'No bookmarks yet. Find a nice recipe and bookmartk it ;)';
	_message = '';

	addHandlerRender(hanlder){
		window.addEventListener('load', hanlder);
	}

	_generateMarkup(){
		// console.log(this._data);
		return this._data.map(bookmark => previewView.render(bookmark, false)).join();
	}

	
}

export default new BookmarksView();