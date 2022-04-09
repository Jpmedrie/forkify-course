import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View{
	_parentElement = document.querySelector('.upload');
  _message = 'Recipe was succesfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor(){
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow(){ //separated from the function so this. points at the corresponding elements
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow(){
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    //the this. is attached to the event listener
  }

  _addHandlerHideWindow(){
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler){
    this._parentElement.addEventListener('submit', function(e){
      e.preventDefault();
      const dataArr = [...new FormData(this)]; //gives an array with all the fills with all the values
      const data = Object.fromEntries(dataArr); //the method takes an array of entries and converts it to an object
      handler(data);
    })
  }

	_generateMarkup(){
		
	}
}

export default new AddRecipeView();