// this approach taken from https://stackoverflow.com/questions/51529332/puppeteer-scroll-down-until-you-cant-anymore

export async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

export function unshiftProtocol(url) {
    return ['http', 'https'].some((protocol) => url.includes(protocol))
        ? url
        : `https:${url}`;
}

export function handlePriceNumber(priceNumber) {
    return priceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
}

export function handlePriceShopee(priceNumber) {
    if (!isNaN(priceNumber)) {
        return handlePriceNumber(priceNumber / 100000);
    }

    return '';
}
