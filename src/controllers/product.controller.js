import { search as lazadaSearch } from '../models/Lazada.model.js';
import {
    getFlashSale as shopeeGetFlashSale,
    search as shopeeSearch,
} from '../models/Shopee.model.js';
import {
    getFlashSale as tikiGetFlashSale,
    search as tikiSearch,
} from '../models/Tiki.model.js';
import Product from '../models/Product.model.js';

export async function productSearch(req, rep) {
    try {
        const { keyword, market, page, sort, limit, searchType } = req.query;

        let products;

        if (searchType === 'flashSale') {
            switch (market) {
                case 'tiki':
                    products = await tikiGetFlashSale(page, limit);
                    if (!products) throw new Error();

                    // break section search keyword below
                    return rep.status(200).send({
                        status: 'success',
                        products,
                    });
                case 'shopee':
                    products = await shopeeGetFlashSale(page, limit);
                    // break section search keyword below
                    return rep.status(200).send({
                        status: 'success',
                        products,
                    });
                default:
                    rep.status(404).send({
                        status: 'error',
                        message: 'not found',
                    });
            }
        }

        switch (market) {
            case 'tiki':
                products = await tikiSearch(keyword, page, sort);
                break;

            case 'shopee':
                products = await shopeeSearch(keyword, page, sort);
                break;

            case 'lazada':
                products = await lazadaSearch(keyword, page, sort);
                break;

            case 'tiki-shopee':
            case 'shopee-tiki':
                // eslint-disable-next-line no-case-declarations
                const [_productsTiki, _productsShopee] =
                    // eslint-disable-next-line node/no-unsupported-features/es-builtins
                    await Promise.allSettled([
                        tikiSearch(keyword, page, sort).then(
                            (result) => result,
                        ),
                        shopeeSearch(keyword, page, sort).then(
                            (result) => result,
                        ),
                    ]);

                return rep.status(200).send({
                    status: 'success',
                    products: {
                        tiki: _productsTiki?.value,
                        shopee: _productsShopee?.value,
                    },
                });

            case 'tiki-lazada':
            case 'lazada-tiki':
                // eslint-disable-next-line no-case-declarations
                const [___productsTiki, ___productLazada] =
                    // eslint-disable-next-line node/no-unsupported-features/es-builtins
                    await Promise.allSettled([
                        tikiSearch(keyword, page, sort).then(
                            (result) => result,
                        ),
                        lazadaSearch(keyword, page, sort).then(
                            (result) => result,
                        ),
                    ]);

                return rep.status(200).send({
                    status: 'success',
                    products: {
                        tiki: ___productsTiki?.value,
                        lazada: ___productLazada?.value,
                    },
                });

            case 'shopee-lazada':
            case 'lazada-shopee':
                // eslint-disable-next-line no-case-declarations
                const [__productsShopee, __productLazada] =
                    // eslint-disable-next-line node/no-unsupported-features/es-builtins
                    await Promise.allSettled([
                        shopeeSearch(keyword, page, sort).then(
                            (result) => result,
                        ),
                        lazadaSearch(keyword, page, sort).then(
                            (result) => result,
                        ),
                    ]);

                return rep.status(200).send({
                    status: 'success',
                    products: {
                        shopee: __productsShopee?.value,
                        lazada: __productLazada?.value,
                    },
                });

            case 'all':
                // eslint-disable-next-line no-case-declarations
                const [productsTiki, productsShopee, productLazada] =
                    // eslint-disable-next-line node/no-unsupported-features/es-builtins
                    await Promise.allSettled([
                        tikiSearch(keyword, page, sort).then(
                            (result) => result,
                        ),
                        shopeeSearch(keyword, page, sort).then(
                            (result) => result,
                        ),
                        lazadaSearch(keyword, page, sort).then(
                            (result) => result,
                        ),
                    ]);

                return rep.status(200).send({
                    status: 'success',
                    products: {
                        tiki: productsTiki?.value,
                        shopee: productsShopee?.value,
                        lazada: productLazada?.value,
                    },
                });
        }

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
        console.error('SEARCH ERROR:: ', error);

        rep.status(500).send({
            status: 'error',
        });
    }
}

export async function getProductVotes(req, rep) {
    try {
        const { link } = req.query;

        if (!link) {
            return rep.status(404).send({
                status: 'error',
                message: 'link not found',
            });
        }

        const product = await Product.findOne({ link });

        if (!product) {
            return rep.status(404).send({
                status: 'error',
                message: 'product not found',
            });
        }

        rep.status(200).send({
            status: 'success',
            upVotes: product?.up_votes,
            downVotes: product?.down_votes,
        });
    } catch (error) {
        console.error('getProductVotes ERROR:: ', error);

        rep.status(500).send({
            status: 'error',
        });
    }
}
