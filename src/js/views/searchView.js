class SearchView {
    _parentEl = document.querySelector('.search');

    getQuery(){
        const query =  this._parentEl.querySelector('.search__field').value;
        this._clearInput();
        return query;
    }

    _clearInput(){
        this._parentEl.querySelector('.search__field').value = '';
    }

    addHandlerSearch(handler) { //handler
        this._parentEl.addEventListener('submit', function(e){ //submit listens to the click or the enter
            e.preventDefault();
            handler();
        }) 
    }
}

export default new SearchView();