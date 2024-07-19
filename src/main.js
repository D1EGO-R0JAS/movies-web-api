const API = 'https://api.themoviedb.org/3';
const axiosRequest = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers:{
        'Content-Type':'application/json;charset=utf-8'
    },
    params:{
        'api_key':API_KEY,
        "language": "es-ES"
    }
});

let generos; 

/** Codigo de la interaccion del menu Hamburgesa movil*/
const hambuegerMenu = document.querySelector('.hamburger input')
const optionHamburgerMenu = document.querySelector('.nav .options')

hambuegerMenu.addEventListener('click',()=>{
    let validation = labelSearch.classList.contains('inactive')
    if (!validation) {
        labelSearch.classList.toggle('inactive')
        optionHamburgerMenu.classList.toggle('inactive')
    } else {
        optionHamburgerMenu.classList.toggle('inactive')
    }
})
/** Fin de la interaccion */


/** Interaccion de la barra de busqueda movil */

/** inicio de la interaccion del slider de trending movies **/

let currentSlide = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.backgroundImageMovie');
    const totalSlides = slides.length;
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }
    document.querySelector('.slideContainer').style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    console.log('entro');
    showSlide(currentSlide - 1);
}

// Auto-slide every 5 seconds
let sliderInterval = setInterval(nextSlide, 12000);

/** fin de la interaccion del slider de trending movies **/

const searchIcon = document.querySelector('.searchIcon')
const labelSearch = document.querySelector('.formContainer')

searchIcon.addEventListener('click',()=>{
    let validation = optionHamburgerMenu.classList.contains('inactive')
    if (!validation) {
        hambuegerMenu.checked = false;
        optionHamburgerMenu.classList.toggle('inactive')
        labelSearch.classList.toggle('inactive')
    } else {
        labelSearch.classList.toggle('inactive')
    }    
})

/** Creacion del carrusel de las peliculas trending **/

function getRandomNumber(cuantity ,limit, arr) {
    let numbers = new Set();
    const info = [];
    while (numbers.size < cuantity) {
        const randomNumber = Math.floor(Math.random()*limit)
        numbers.add(randomNumber);
    }
    numbers = Array.from(numbers)
    for (let i = 0; i < numbers.length; i++) {
        const element = numbers[i];
        info.push(arr[element])
    }
    return info
}
/** Obtencion de los generos **/
async function getGenres(arr) {
    if (arr != undefined) {
        const { data } = await axiosRequest('/genre/movie/list')
        const res = data.genres;
        generos = res;
        const newArr = [];
        for (let i = 0; i < arr.length; i++) {
            const e = arr[i];
            for (let j = 0; j < res.length; j++) {
                const f = res[j];
                if (e === f.id) {
                    newArr.push(f.name)
                }
            }        
        }
        return newArr
    }else{
        console.log('entro a los generos sin pedir el array');
        const { data } = await axiosRequest('/genre/movie/list')
        const res = data.genres;
        generos = res;
        console.log(generos);
    }
    
}

const sectionPreviewTrendingMovies = document.querySelector('.changePreviewTrendingMovies')

/** fin de la funcion de obtener los generos **/

async function getTrendingMovies() {
    sectionPreviewTrendingMovies.innerHTML = ''
    const { data } = await axiosRequest('/trending/movie/day')
    const movies = getRandomNumber(6, data.results.length, data.results)
    const btnAnterior = document.createElement('button')
    btnAnterior.classList.add('btn', 'anterior')
    const btnSiguiente = document.createElement('button')
    btnSiguiente.classList.add('btn', 'siguiente')
    btnAnterior.innerText = '<';
    btnSiguiente.innerText = '>';
    btnAnterior.onclick = prevSlide;
    btnSiguiente.onclick = nextSlide;
    sectionPreviewTrendingMovies.append(btnAnterior, btnSiguiente)
    const divContainer = document.createElement('div')
    divContainer.classList.add('slideContainer')
    movies.forEach((movie, i)=>{
        const article = document.createElement('article')
        article.classList.add('backgroundImageMovie')
        article.style.background = `linear-gradient(rgba(5, 7, 12, 0.6), rgba(5, 7, 12, 0.6)), url('https://image.tmdb.org/t/p/w1280${movie.backdrop_path}') no-repeat center`;
        article.style.backgroundSize = 'cover'
        article.setAttribute('id', `slide${i+1}`)
        const figurePoster = document.createElement('figure')
        const imgPoster = document.createElement('img')
        imgPoster.setAttribute('src',`https://image.tmdb.org/t/p/w300${movie.poster_path}`)
        const divInfoMovie = document.createElement('div')
        divInfoMovie.classList.add('previewTrendingMovies--infoMovie')
        const title = document.createElement('h2')
        const titleText = document.createTextNode(`${movie.title}`)
        title.appendChild(titleText)
        const calification = document.createElement('p')
        const imgCalification = document.createElement('img')
        imgCalification.setAttribute('src','./src/img/star-regular.png')
        const calificationText = document.createTextNode(`${movie.vote_average.toFixed(1)}`)
        const textMovie = document.createElement('p')
        const innerTextMovie = document.createTextNode(`${movie.overview}`)
        const ul = document.createElement('ul')
        let li1 = document.createElement('li')
        let li2 = document.createElement('li')
        let li1Text, li2Text; 
        const genresMovie = getGenres(movie.genre_ids).then((data)=>{
            li1Text = document.createTextNode(`${data[0]}`)
            li2Text = document.createTextNode(`${data[1]}`)
            li2.appendChild(li2Text)
            li1.appendChild(li1Text)
        })        
        ul.append(li1, li2)
        textMovie.appendChild(innerTextMovie)
        calification.append(imgCalification, calificationText)
        divInfoMovie.append(title, calification, textMovie, ul)
        figurePoster.appendChild(imgPoster)
        article.append(figurePoster, divInfoMovie)
        divContainer.appendChild(article)
    })
    sectionPreviewTrendingMovies.appendChild(divContainer)
}

/** Creacion de la seccion de peliculas por genero **/
const movies = document.querySelector('.movies')
async function getMovies() {
    try{
        const { data } = await axiosRequest('/genre/movie/list')
        const dataGenres = data.genres;

        const mapeo = dataGenres.map(async(genre)=>{
            const { data: result } = await axiosRequest('/discover/movie',{
                params:{
                    with_genres: genre.id
                }
            })
            return { genre: genre.name, movies: result.results }
        })

        const responsePromise = await Promise.all(mapeo)         
        movies.innerHTML = ''
        responsePromise.forEach((genre)=>{
            const article = document.createElement('article')
            article.classList.add('categoryMovies')
            const h2 = document.createElement('h2')
            h2.addEventListener('click',()=>{
                const content = h2.innerText
                detectGenreOrType(content)
            })
            const h2Text = document.createTextNode(`${genre.genre}`)
            h2.appendChild(h2Text)
            article.appendChild(h2)
            const btnPrev = document.createElement('button')
            const btnNext = document.createElement('button')
            btnPrev.classList.add('btnPrev')
            btnNext.classList.add('btnNext')
            btnPrev.innerHTML = '<';
            btnNext.innerHTML = '>';
            btnNext.onclick = () => scrollRight(event)
            btnPrev.onclick = () => left(event)
            article.append(btnPrev, btnNext)
            const div = document.createElement('div')
            div.classList.add('categoryMovie--Container')
            genre.movies.forEach((movie)=>{
                const divMovie = document.createElement('div')
                divMovie.classList.add('posterMovieImage')
                divMovie.setAttribute('id-movie',`${movie.id}`)
                const img = document.createElement('img')
                img.setAttribute('src',`https://image.tmdb.org/t/p/w300${movie.poster_path}`)
                img.setAttribute('alt',`${movie.title}`)
                divMovie.appendChild(img)
                const divInfo = document.createElement('div')
                divInfo.classList.add('infoMovie')
                const h3 = document.createElement('h3')
                const h3Text = document.createTextNode(`${movie.title}`)
                h3.appendChild(h3Text)
                const p = document.createElement('p')
                const imgStar = document.createElement('img')
                imgStar.setAttribute('src','./src/img/star-regular.png')
                const pText = document.createTextNode(`${movie.vote_average.toFixed(1)}`)
                p.appendChild(imgStar)
                p.appendChild(pText)
                const p2 = document.createElement('p')
                const pText2 = document.createTextNode(`${movie.overview}`)
                p2.appendChild(pText2)
                const ul = document.createElement('ul')
                const li1 = document.createElement('li')
                const li2 = document.createElement('li')
                let li1Text, li2Text;
                getGenres(movie.genre_ids).then((data)=>{
                    li1Text = document.createTextNode(`${data[0]}`)
                    li2Text = document.createTextNode(`${data[1]}`)
                    li2.appendChild(li2Text)
                    li1.appendChild(li1Text)
                    ul.append(li1, li2)
                })
                divInfo.append(h3, p, p2, ul)
                divMovie.appendChild(divInfo)
                div.appendChild(divMovie)
            })
            article.appendChild(div)
            movies.appendChild(article)
        })
        return responsePromise
    }
    catch(error){
        console.log(error);
    }
}

function scrollRight(event){
    const container = event.target.closest('article').querySelector('.categoryMovie--Container');
    container.scrollBy({
        left: 170, // Desplaza hacia la derecha
        behavior: 'smooth'
    });
}
function left(event){
    const container = event.target.closest('article').querySelector('.categoryMovie--Container');
    container.scrollBy({
        left: -170, // Desplaza hacia la izquierda
        behavior: 'smooth'
    });
}

/** Busqueda de peliculas segun la opcion estreno, popular y tendencia**/

const moviesType = document.querySelector('.listMovieType')

const moviesGenresList = document.querySelector('.listMovieGenre')

moviesType.addEventListener('click',(event)=>{
    const li = event.target.closest('li').innerText;
    console.log(li);
    detectGenreOrType(li)

})

moviesGenresList.addEventListener('click',(event)=>{
    const li = event.target.closest('li').innerText;
    detectGenreOrType(li)
})

function detectGenreOrType(value) {
    if (value === 'Tendencias') {
        console.log('tendencias');
        location.hash = `#type=${value}`
        async function tendencia(){
            console.log('entro');
            const { data: moviesTendencia} = await axiosRequest('/trending/movie/week')
            drawMoviesGenresAndType(moviesTendencia.results, value)
        }
        tendencia()
    }else if(value === 'Populares'){
        console.log('populares');
        async function populares(){
            console.log('entro');
            location.hash = `#type=${value}`
            const { data: moviesPopular1} = await axiosRequest('/movie/popular',{
                params:{
                    page: 1
                }
            })
            const { data: moviesPopular2} = await axiosRequest('/movie/popular',{
                params:{
                    page: 2
                }
            })
            const arrMoviesPopular = [ ...moviesPopular1.results, ...moviesPopular2.results ]
            drawMoviesGenresAndType(arrMoviesPopular, value)
        }
        populares()        
    }else if (value === 'Estrenos') {
        console.log('estrenos');
        location.hash = `#type=${value}`
        async function estrenos(){
            console.log('entro');
            const { data: moviesEstrenos1} = await axiosRequest('/movie/now_playing',{
                params:{
                    page: 1
                }
            });
            const { data: moviesEstrenos2} = await axiosRequest('/movie/now_playing',{
                params:{
                    page: 2
                }
            });
            const arrMoviesEstrenos = [ ...moviesEstrenos1.results, ...moviesEstrenos2.results ]
            drawMoviesGenresAndType(arrMoviesEstrenos, value)
        }
        estrenos()
    }else{
        generos.forEach(async(genere)=>{
        console.log('aqui entro al foreach');
            if (genere.name === value || genere.id === value) {
                console.log('encontro la opcion');
                location.hash = `#genre=${genere.id}-${genere.name}`
                const { data: moviesGenres1 } = await axiosRequest('/discover/movie',{
                    params:{
                        page: 1,
                        with_genres: genere.id
                    }
                })
                const { data: moviesGenres2 } = await axiosRequest('/discover/movie',{
                    params:{
                        page: 2,
                        with_genres: genere.id
                    }
                })
                const arrMoviesGenres = [ ...moviesGenres1.results, ...moviesGenres2.results ]
                console.log(arrMoviesGenres);
                drawMoviesGenresAndType(arrMoviesGenres, genere.name)
            }        
        })        
    }
}

function drawMoviesGenresAndType(arr, genero) {
    console.log('esta dibujando');
    const moviesGenreContainer = document.createElement('article')
    const moviesGenre = document.querySelector('.moviesGenre')
    sectionMovies.innerHTML = ''
    const titleGenre = document.createElement('h2')
    titleGenre.innerText = genero;
    moviesGenre.append(titleGenre)    
    moviesGenreContainer.classList.add('moviesGenre--Container')
    arr.forEach((movie)=>{
        const divMovie = document.createElement('div')
        divMovie.classList.add('movieGenrePoster')
        divMovie.setAttribute('id-movie',`${movie.id}`)
        const imgPosterMovie = document.createElement('img')
        imgPosterMovie.setAttribute('src',`https://image.tmdb.org/t/p/w300${movie.poster_path}`)
        imgPosterMovie.setAttribute('alt',`${movie.title}`)
        divMovie.append(imgPosterMovie)
        const movieGenreInfo = document.createElement('div')
        movieGenreInfo.classList.add('movieGenreInfo')
        const h3 = document.createElement('h3')
        h3.classList.add('movieGenreTitle')
        const h3Text = document.createTextNode(`${movie.title}`)
        h3.appendChild(h3Text)
        const p = document.createElement('p')
        const imgStar = document.createElement('img')
        imgStar.setAttribute('src','./src/img/star-regular.png')
        const pText = document.createTextNode(`${movie.vote_average.toFixed(1)}`)
        p.appendChild(imgStar)
        p.appendChild(pText)
        const p2 = document.createElement('p')
        const pText2 = document.createTextNode(`${movie.overview}`)
        p2.appendChild(pText2)
        const ul = document.createElement('ul')
        const li1 = document.createElement('li')
        const li2 = document.createElement('li')
        let li1Text, li2Text;
        getGenres(movie.genre_ids).then((data)=>{
            li1Text = document.createTextNode(`${data[0]}`)
            li2Text = document.createTextNode(`${data[1]}`)
            li2.appendChild(li2Text)
            li1.appendChild(li1Text)
            ul.append(li1, li2)
        })
        movieGenreInfo.append(h3, p, p2, ul)
        divMovie.append(movieGenreInfo)
        moviesGenreContainer.append(divMovie)
    })
    moviesGenre.appendChild(moviesGenreContainer)
}

movies.addEventListener('click', (event) => {
    if (event.target.tagName === 'H3' && event.target.closest('.infoMovie')) {
        console.log('entro por el de movies');
        const movieElement = event.target.closest('.posterMovieImage');
        const title = event.target.textContent
        if (movieElement) {
            const movieId = movieElement.getAttribute('id-movie'); 
            location.hash = `#movie=${movieId}-${title}`;
            drawMovieById(movieId)
        } else {
            console.log('Elemento del producto no encontrado.');
        }
    }else if (event.target.tagName === 'H3' && event.target.closest('.movieGenreInfo')) {
        console.log('entro por el de los generos');
        const movieElement = event.target.closest('.movieGenrePoster');
        const title = event.target.textContent
        if (movieElement) {
            const movieId = movieElement.getAttribute('id-movie'); 
            location.hash = `#movie=${movieId}-${title}`;
            drawMovieById(movieId)
        } else {
            console.log('Elemento del producto no encontrado.');
        }
    }
});

async function drawMovieById(movieId){
    console.log('entro a dibujar por id');
    const { data: movie } = await axiosRequest(`/movie/${movieId}`)    
    sectionPreviewTrendingMovies.innerHTML = ''
    const articleMovie = document.createElement('article')
    articleMovie.classList.add('backgroundImageMovie')
    articleMovie.style.background = `linear-gradient(rgba(5, 7, 12, 0.6), rgba(5, 7, 12, 0.6)), url('https://image.tmdb.org/t/p/w1280${movie.backdrop_path}') no-repeat center`;
    articleMovie.style.backgroundSize = 'cover'
    const figure = document.createElement('figure')
    const imgMovie = document.createElement('img')
    imgMovie.setAttribute('src',`https://image.tmdb.org/t/p/w300${movie.poster_path}`)
    figure.append(imgMovie)
    const divInfo = document.createElement('div')
    divInfo.classList.add('previewTrendingMovies--infoMovie')
    const h2 = document.createElement('h2')
    const h2Text = document.createTextNode(`${movie.title}`)
    h2.appendChild(h2Text)
    const p = document.createElement('p')
    const imgStar = document.createElement('img')
    imgStar.setAttribute('src','./src/img/star-regular.png')
    const pText = document.createTextNode(`${movie.vote_average.toFixed(1)}`)
    p.append(imgStar , pText)
    const p2 = document.createElement('p')
    const p2Text = document.createTextNode(`${movie.overview}`)
    p2.appendChild(p2Text)
    const ul = document.createElement('ul')
    const genresMovie = movie.genres;
    const li1 = document.createElement('li')
    const li2 =document.createElement('li')
    genresMovie.forEach((genre, i)=>{
        const liText = document.createTextNode(`${genre.name}`)
        if (i === 0) {
            li1.appendChild(liText)
            ul.append(li1)
        }else if (i === 2) {
            li2.appendChild(liText)
            ul.append(li2)
        }
        
    })
    divInfo.append(h2, p, p2, ul)
    articleMovie.append(figure, divInfo)
    sectionPreviewTrendingMovies.append(articleMovie)

    const { data: recomendationMovies } = await axiosRequest(`/movie/${movieId}/recommendations`)
    if (recomendationMovies.results.length === 0) {
        sectionMovies.innerHTML = `<h2 class="noRecomendations">No hay recomendaciones para este Pelicula Aun</h2>`
    }else{
        drawMoviesGenresAndType(recomendationMovies.results, 'Recomendaciones')
    }
    
}

/** Interaccion de Busqueda **/
const from = document.querySelector('.from')
const inputSeacrh = document.querySelector('.input')

inputSeacrh.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = inputSeacrh.value.trim()
            if (input) {
                location.hash = `#search=${input}`;
                drawSearchMovie(input)
        }
    }
})
async function drawSearchMovie(value){
    const { data: moviesSearch } = await axiosRequest(`/search/movie`,{
        params:{
            query: value
        }
    })
    drawMoviesGenresAndType(moviesSearch.results, value)
}