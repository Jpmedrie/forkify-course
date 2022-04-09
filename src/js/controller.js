import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; //npm i core-js regenerator-runtime is a package tu sustain old browsers
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
import { setTimeout } from 'core-js';
// https://forkify-api.herokuapp.com/v2

// if(module.hot){
//   module.hot.accept();     usefull for large projects with thousands of files, no consecuenses for this one
// }

const controlRecipes = async function() {
  try{
    const id = window.location.hash.slice(1);

    if(!id) return;

    // 0. Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    
    recipeView.renderSpinner();
    // 1. Loading recipe
    await model.loadRecipe(id); //it´s an async function, thus returns a promise, thus we have to wait for it
    // 2. Rendering recipe
    recipeView.render(model.state.recipe);
    
  } catch(err){
    recipeView.renderError();
    console.error(err);
  }
}

const controlSearchResults = async function(){ //subscriber
  try{
    resultsView.renderSpinner();
    // console.log(resultsView);

    // 1 Get search query
    const query = searchView.getQuery();
    if(!query) return;

    // 2 Load search results
    await model.loadSearchResults(query);

    // 3 Render results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    // 4 Render initial pagination buttons
    paginationView.render(model.state.search);
  }catch(err){
    console.log(err);
  }
}

const controlPagination = function(goToPage){
  // 3 Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4 Render NEW pagination buttons
  paginationView.render(model.state.search);
}

const controlServings = function(newServings){
  //Update the recipe servings (in state)
  model.updateServings(newServings);
  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe); //update text and atribuets in the DOM without re-rendering the view
}

const controlAddBookmark = function(){
  //1. Add || remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe);
  //2. Update recipe view
  recipeView.update(model.state.recipe);
  //3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);  
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try{
    //Show loading spinner
    addRecipeView.renderSpinner();

    //upload recipe data
    await model.upLoadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Succes message
    addRecipeView.renderMessage();

    //Render bookmarkView
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`); //history API of the browsers. pushState() allows to change the url without 
                                //reloading the page

    //Close form window
    setTimeout(function(){
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  }catch(err){
    console.error('🍕', err);
    addRecipeView.renderError(err.message);
  }
}

// ['hashchange', 'load'].array.forEach(ev => window.addEventListener(ev, controlRecipes));
const init = function(){ //Is the function responsibel for listening events in the page as an all
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination); //Calls the eventHandler function which listens to a 
                                    //click in the .btn--inline parent element
                                    //controlPagination is the function that is passed to the eventHandler
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();