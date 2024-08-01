let infiniteScroll;
window.addEventListener('hashchange',navigator,false);
window.addEventListener('DOMContentLoaded',navigator,false);
window.addEventListener('scroll',infiniteScroll,false);
let maxGenres;
let iGenres = 2;
const sectionMovies = document.querySelector('.changeMovies');
const btnReturn = document.querySelector('.btnReturn');
btnReturn.addEventListener('click',()=>{
    setTimeout(()=>{history.back()},100)
})
async function navigator() {
    console.log(location.hash);
    const genres = await getGenres()
    maxGenres = genres.length
    console.log(maxGenres);
    if(infiniteScroll){
        window.removeEventListener('scroll', infiniteScroll, { passive: false });
        infiniteScroll = undefined;
    }
    if (location.hash.startsWith('#genre')) {
        console.log('genre');
        clearInterval(sliderInterval);
        sectionPreviewTrendingMovies.innerHTML = '';
        sectionPreviewTrendingMovies.classList.remove('previewTrendingMovies');
        sectionMovies.innerHTML = ''
        sectionMovies.classList.remove('movies');
        sectionMovies.classList.add('moviesGenre');
        btnReturn.classList.remove('inactive')
        const [ a, b ] = location.hash.split('=');
        let [value, c] = b.split('-');
        value = Number(value)
        console.log('el tipo del valor es: ' + typeof value);
        getGenres()
        detectGenreOrType(value)
    }else if(location.hash.startsWith('#type')){
        console.log('type');
        clearInterval(sliderInterval);
        sectionPreviewTrendingMovies.innerHTML = '';
        sectionPreviewTrendingMovies.classList.remove('previewTrendingMovies');
        sectionMovies.innerHTML = ''
        sectionMovies.classList.remove('movies');
        sectionMovies.classList.add('moviesGenre');
        btnReturn.classList.remove('inactive')
        getGenres()
        const [ a, b ] = location.hash.split('=');
        detectGenreOrType(b)
    }else if(location.hash.startsWith('#search')){
        console.log('search');
        clearInterval(sliderInterval);
        sectionPreviewTrendingMovies.innerHTML = '';
        sectionPreviewTrendingMovies.classList.remove('previewTrendingMovies');
        sectionMovies.innerHTML = ''
        sectionMovies.classList.remove('movies');
        sectionMovies.classList.add('moviesGenre');
        btnReturn.classList.remove('inactive')
        const searchQuery = decodeURI(location.hash.split('=')[1]);
        drawSearchMovie(searchQuery)
    }else if(location.hash.startsWith('#movie')){
        console.log('movie');
        clearInterval(sliderInterval);
        sectionPreviewTrendingMovies.innerHTML = '';
        sectionPreviewTrendingMovies.classList.remove('previewTrendingMovies');
        sectionMovies.innerHTML = ''
        sectionMovies.classList.remove('movies');
        sectionMovies.classList.add('moviesGenre');
        btnReturn.classList.remove('inactive')
        getGenres()
        const [ a, b ] = location.hash.split('=');
        const [value, c] = b.split('-');
        drawMovieById(value)
    }else{
        console.log('home');
        sectionPreviewTrendingMovies.classList.add('previewTrendingMovies');
        sectionMovies.classList.add('movies');
        sectionMovies.classList.remove('moviesGenre');
        btnReturn.classList.add('inactive')
        infiniteScroll = getMoviesPaginatedInMain;
        skeleton()
        getTrendingMovies()
        getMovies()
    }
    if(infiniteScroll){
        window.addEventListener('scroll',infiniteScroll,false);
    }
}