import { search as lazadaSearch } from '../models/Lazada.model.js';
import Product, { getProductDetails } from '../models/Product.model.js';
import {
    getFlashSale as shopeeGetFlashSale,
    search as shopeeSearch,
} from '../models/Shopee.model.js';
import {
    getFlashSale as tikiGetFlashSale,
    search as tikiSearch,
} from '../models/Tiki.model.js';
import { handleSubPathMarket, checkPriceCondition } from '../utils/index.js';
import { webPushNotify } from '../services/webPush.service.js';

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

export async function notifyPrice(req, rep) {
    try {
        const products = await Product.find({
            subscribers: { $exists: true, $not: { $size: 0 } },
        }).populate({
            path: 'subscribers',
            populate: {
                path: 'userId',
            },
        });

        // eslint-disable-next-line node/no-unsupported-features/es-builtins
        await Promise.allSettled(
            products.map(async (product) => {
                const purePath = handleSubPathMarket(
                    product?.market,
                    product?.link,
                );

                // revalidate:
                const prodInfo = await getProductDetails(
                    product?.market,
                    purePath,
                );

                // eslint-disable-next-line node/no-unsupported-features/es-builtins
                await Promise.allSettled(
                    product.subscribers.map(async (subscriber) => {
                        // check conditions to push notify:
                        const priceNumber = Number(
                            String(prodInfo?.price)
                                .replace('đ', '')
                                .replace('.', ''),
                        );

                        const shouldBeNotify = checkPriceCondition(
                            priceNumber,
                            subscriber.priceCondition,
                            subscriber.priceCondition,
                        );

                        if (!shouldBeNotify) {
                            return;
                        }

                        // webPush notify:
                        if (subscriber.notifyChannel?.includes('browser')) {
                            await webPushNotify(
                                subscriber.userId?.identifications,
                                prodInfo,
                            );
                        }
                    }),
                );

                // notify:
                // console.log('prod Info:: ', prodInfo);
            }),
        );

        rep.status(200).send({ data: products });
    } catch (error) {
        rep.status(200).send({ data: 'hi' });
    }
}
