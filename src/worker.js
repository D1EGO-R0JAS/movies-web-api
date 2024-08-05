"use strict";

// Manejar mensajes del hilo principal
self.onmessage = async function(event) {
    const { id, type, data} = event.data;
    switch (type) {
        case 'getRandomNumber':
            const { cuantity, limit, arr } = data;
            const randomNumbers = getRandomNumber(cuantity, limit, arr);
            self.postMessage({ id, data: randomNumbers });
            break;
        case 'identifyGenres':
            const { arrG, arrG2 } = data;
            try {
                const getGenresArr = await identifyGenre(arrG, arrG2); // Espera a que la promesa se resuelva
                self.postMessage({ id, data: getGenresArr });
            } catch (error) {
                console.log('error de identificar los generos: ' , error);
                self.postMessage({ id, error: error.message });
            }
            break;        
        default:
            self.postMessage({ id, error: 'Unknown message type' });
    }
};


        // Agrega más casos según sea necesario

// Función para generar números aleatorios
function getRandomNumber(cuantity, limit, arr) {
    let numbers = new Set();
    const info = [];
    while (numbers.size < cuantity) {
        const randomNumber = Math.floor(Math.random() * limit);
        numbers.add(randomNumber);
    }
    numbers = Array.from(numbers);
    for (let i = 0; i < numbers.length; i++) {
        const element = numbers[i];
        info.push(arr[element]);
    }
    return info;
}

// Función para realizar la busqueda de los generos
async function identifyGenre(arr, arrGenre) {
    const newArr = [];
    for (let i = 0; i < arr.length; i++) {
        const e = arr[i];
        for (let j = 0; j < arrGenre.length; j++) {
            const f = arrGenre[j];
            if (e === f.id) {
                newArr.push(f.name);
            }
        }        
    }
    return newArr;
}
