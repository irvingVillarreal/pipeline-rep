const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function testMemeMatchingGame() {
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().headless())
        .build();

    try {
        // Accede a la página del juego alojada en AWS S3
        await driver.get('http://bucket-pagina-memes.s3-website-us-west-2.amazonaws.com/index.html');

        // Inicia el juego
        await driver.findElement(By.id('start-game')).click();

        // Espera a que se generen las cartas
        await driver.wait(until.elementLocated(By.css('#game-board img')), 10000);

        // Define el arreglo de cartas con sus nombres e imágenes correspondientes
        const cardArray = [
            { name: 'card1', img: 'http://bucket-pagina-memes.s3-website-us-west-2.amazonaws.com/images/distracted.png' },
            { name: 'card1', img: 'http://bucket-pagina-memes.s3-website-us-west-2.amazonaws.com/images/distracted.png' },
            { name: 'card2', img: 'http://bucket-pagina-memes.s3-website-us-west-2.amazonaws.com/images/drake.png' },
            { name: 'card2', img: 'http://bucket-pagina-memes.s3-website-us-west-2.amazonaws.com/images/drake.png' },
            { name: 'card3', img: 'http://bucket-pagina-memes.s3-website-us-west-2.amazonaws.com/images/fine.png' },
            { name: 'card3', img: 'http://bucket-pagina-memes.s3-website-us-west-2.amazonaws.com/images/fine.png' },
            { name: 'card4', img: 'http://bucket-pagina-memes.s3-website-us-west-2.amazonaws.com/images/rollsafe.png' },
            { name: 'card4', img: 'http://bucket-pagina-memes.s3-website-us-west-2.amazonaws.com/images/rollsafe.png' },
            { name: 'card5', img: 'http://bucket-pagina-memes.s3-website-us-west-2.amazonaws.com/images/success.png' },
            { name: 'card5', img: 'http://bucket-pagina-memes.s3-website-us-west-2.amazonaws.com/images/success.png' },
            // Añade más parejas de cartas según sea necesario
        ];

        // Selecciona dos cartas para probar la funcionalidad
        let cards = await driver.findElements(By.css('#game-board img'));
        await cards[0].click();
        await cards[1].click();

        // Espera un momento para la comparación
        await driver.sleep(1000);

        // Verifica si las cartas coinciden
        let src0 = await cards[0].getAttribute('src');
        let src1 = await cards[1].getAttribute('src');

        if (src0 === src1) {
            // Verifica que las cartas se oculten si coinciden
            let visibility0 = await cards[0].getCssValue('visibility');
            let visibility1 = await cards[1].getCssValue('visibility');
            console.log(visibility0 === 'hidden' && visibility1 === 'hidden' ? 'Prueba superada: cartas coincidentes ocultas' : 'Prueba fallida: las tarjetas coincidentes no están ocultas');
        } else {
            // Verifica que las cartas se mantengan visibles si no coinciden
            let srcAfter0 = await cards[0].getAttribute('src');
            let srcAfter1 = await cards[1].getAttribute('src');
            console.log(srcAfter0.includes('blank.png') && srcAfter1.includes('blank.png') ? 'Prueba superada: las tarjetas que no coinciden permanecen visibles' : 'Prueba fallida: las tarjetas que no coinciden no permanecen visibles');
        }

    } finally {
        await driver.quit();
    }
})();
