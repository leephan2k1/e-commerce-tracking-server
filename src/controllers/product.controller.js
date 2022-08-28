import { search as shopeeSearch } from '../models/Shopee.model.js';
import { search as tikiSearch } from '../models/Tiki.model.js';
import { search as lazadaSearch } from '../models/Lazada.model.js';

export async function productSearch(req, rep) {
    try {
        const { keyword, market, page } = req.query;

        let products;

        switch (market) {
            case 'tiki':
                products = await tikiSearch(keyword, page);
                break;

            case 'shopee':
                products = await shopeeSearch(keyword, page);
                break;

            case 'lazada':
                products = await lazadaSearch(keyword, page);
                break;
        }

        // if (!products) {
        //     return rep.status(400).send({
        //         status: 'error',
        //     });
        // }

        return rep.status(200).send({
            status: 'success',
            products,
        });

        // const browser = await puppeteer.launch({ headless: true });
        // const page = await browser.newPage();
        // await page.goto(`https://lichsugia.com`);

        // await page.type(
        //     '#in_product_url',
        //     'https://tiki.vn/bo-ban-phim-gia-co-va-chuot-chuyen-game-g21-led-7-mau-p3953455.html?spid=41527257',
        // );

        // await page.click('#buttoncheck');

        // await page.waitForSelector(
        //     '#price-history-main > div > div.history-content.bg-light.p-md-3 > div > div.col-md-10.col-12 > h3',
        // );

        // const price = await page.$eval(
        //     '#price-history-main > div > div.history-content.bg-light.p-md-3 > div > div.col-md-10.col-12 > h3',
        //     (dom) => {
        //         return dom?.textContent.trim();
        //     },
        // );

        // console.log('price:::::::', price);

        // await browser.close();

        // rep.status(200).send({
        //     status: 'success',
        //     // products,
        //     price,
        // });
        // const kwSlug = slug(keyword);

        // // Get the height of the rendered page
        // const bodyHandle = await page.$('body');
        // const { height } = await bodyHandle.boundingBox();
        // await bodyHandle.dispose();

        // // Scroll one viewport at a time, pausing to let content load
        // const viewportHeight = page.viewport().height;
        // let viewportIncr = 0;
        // while (viewportIncr + viewportHeight < height) {
        //     await page.evaluate((_viewportHeight) => {
        //         window.scrollBy(0, _viewportHeight);
        //     }, viewportHeight);
        //     await wait(20);
        //     viewportIncr = viewportIncr + viewportHeight;
        // }

        // // Scroll back to top
        // await page.evaluate((_) => {
        //     window.scrollTo(0, 0);
        // });

        // // Some extra delay to let images load
        // await wait(100);

        // const products = await page.$$eval(
        //     '#product-item-container > a',
        //     (dom) => {
        //         const productList = dom.map((aTag) => {
        //             const name = aTag.querySelector('p')?.textContent.trim();
        //             const price = aTag
        //                 .querySelector(
        //                     'div > div.h-max.flex-shrink-0 > div > div:nth-child(3) > span',
        //                 )
        //                 ?.textContent.trim();
        //             const img = aTag
        //                 .querySelector(
        //                     'div > div.h-full.relative.overflow-hidden > img',
        //                 )
        //                 ?.getAttribute('data-src');

        //             return {
        //                 name,
        //                 price,
        //                 img,
        //             };
        //         });

        //         return productList;
        //     },
        // );

        // await browser.close();
    } catch (error) {
        rep.status(400).send({
            status: 'error',
            message: error,
        });
    }
}
