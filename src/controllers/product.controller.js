import { search as lazadaSearch } from '../models/Lazada.model.js';
import Product, { getProductDetails } from '../models/Product.model.js';
import Subscriber from '../models/Subscriber.model.js';
import {
    getFlashSale as shopeeGetFlashSale,
    search as shopeeSearch,
} from '../models/Shopee.model.js';
import Notification from '../models/Notification.model.js';
import {
    getFlashSale as tikiGetFlashSale,
    search as tikiSearch,
} from '../models/Tiki.model.js';
import {
    handleSubPathMarket,
    checkPriceCondition,
    logEvents,
} from '../utils/index.js';
import { webPushNotify } from '../services/webPush.service.js';
import { sendMail } from '../services/mail.service.js';
import fastify from '../index.js';
import {
    WEB_URL,
    TIKI_AF_TOKEN,
    TIKI_OWNER_ID,
    SP_COOKIE,
} from '../configs/index.js';
import { nanoid } from 'nanoid';
import axios from 'axios';
import qs from 'fast-querystring';
import { format } from 'date-fns';
import ShortLink from '../models/ShortLink.model.js';

export async function generateProductLink(req, rep) {
    const { market, productLink } = req.query;
    let axiosClient;

    if (!productLink) {
        return rep.status(400).send({
            status: 'error',
            message: 'please provide product link',
        });
    }

    if (market !== 'tiki' && market !== 'shopee' && market !== 'lazada') {
        return rep.status(400).send({
            status: 'error',
            message: 'please provide exact market: tiki, shopee, lazada',
        });
    }

    const shortLinkData = await ShortLink.findOne({ productLink });

    if (shortLinkData) {
        return rep.status(200).send({
            status: 'success',
            productLink: shortLinkData.shortLink,
        });
    }

    if (market === 'tiki') {
        axiosClient = axios.create({
            baseURL: 'https://affiliate.tiki.com.vn/api/v1',
            paramsSerializer: (params) => qs.stringify(params),
            headers: {
                referer: 'https://affiliate.tiki.com.vn/get-link/build-link',
                origin: 'https://affiliate.tiki.com.vn',
                authorization: TIKI_AF_TOKEN,
            },
        });
    }

    if (market === 'shopee') {
        axiosClient = axios.create({
            baseURL: 'https://affiliate.shopee.vn/api/v1',
            paramsSerializer: (params) => qs.stringify(params),
            headers: {
                referer: 'https://affiliate.shopee.vn/offer/custom_link',
                origin: 'https://affiliate.shopee.vn',
                cookie: SP_COOKIE,
            },
        });
    }

    try {
        const code = String(nanoid(8)).toUpperCase();
        if (market === 'tiki') {
            const { data } = await axiosClient.post(
                '/universal-campaigns/create',
                {
                    code,
                    name:
                        'Campaign ' + format(new Date(), 'YYY-MM-dd HH:mm:ss'),
                    type: 'UNIVERSAL',
                    tially_links: [
                        {
                            partner_name: 'TIKI-AFF',
                            partner_code: 'TIKIAFF',
                            original_link: productLink,
                        },
                    ],
                    owner: TIKI_OWNER_ID,
                },
            );

            if (!data) throw new Error();

            await ShortLink.create({
                productLink,
                shortLink: data.data?.tially_links[0].short_link,
                market,
            });

            return rep.status(201).send({
                status: 'success',
                productLink: data.data?.tially_links[0].short_link,
            });
        }

        if (market === 'shopee') {
            const { data } = await axiosClient.post(`/link/gen_by_custom`, {
                advanced: { sub_id1: code },
                original_url: productLink,
            });

            if (!data || !data?.data?.short_link) throw new Error();

            await ShortLink.create({
                productLink,
                shortLink: data.data?.short_link,
                market,
            });

            return rep.status(201).send({
                status: 'success',
                productLink: data.data?.short_link,
            });
        }

        rep.status(400).send({
            status: 'error',
        });
    } catch (error) {
        console.error('error: ', error);
        await logEvents('products.log', JSON.stringify(error));

        return rep.status(400).send({
            status: 'error',
        });
    }
}

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

export async function notifyPrice() {
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

                if (!prodInfo) throw new Error();

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
                            subscriber.priceAtSubscribe,
                            subscriber.priceCondition,
                        );

                        if (!shouldBeNotify) {
                            return;
                        }

                        // emit socket notify (default)
                        // eslint-disable-next-line node/no-unsupported-features/es-builtins
                        subscriber.userId?.socketIds?.map((socketId) => {
                            fastify.io
                                .to(socketId)
                                .emit('productNotifications', prodInfo);
                        });

                        const clientProductURL = `${WEB_URL}/products/${
                            prodInfo?.market
                        }/${handleSubPathMarket(
                            prodInfo?.market,
                            prodInfo?.link,
                        )}`;

                        // webPush notify:
                        if (subscriber.notifyChannel?.includes('browser')) {
                            await webPushNotify(
                                subscriber.userId?.identifications,
                                prodInfo,
                            );
                        }

                        // send email notify:
                        if (subscriber.notifyChannel?.includes('email')) {
                            await sendMail({
                                to: subscriber.userId?.email,
                                subject: 'Thông báo giá mới',
                                templateVars: {
                                    realCostLogo:
                                        'https://i.ibb.co/XjGVZ3S/logo-1.png',
                                    productImg: `${
                                        (prodInfo.images?.length &&
                                            prodInfo?.images[0]) ||
                                        prodInfo?.images[1]
                                    }`,
                                    productDesc: `Sản phẩm bạn theo dõi ${prodInfo?.name} đã có giá mới: ${prodInfo?.price}, chọn "Xem chi tiết" bên dưới hoặc vào link ${clientProductURL} để xem!`,
                                    productLink: clientProductURL,
                                },
                            });
                        }

                        // set a new price:
                        await Subscriber.findByIdAndUpdate(subscriber?._id, {
                            $set: { priceAtSubscribe: priceNumber },
                        });

                        // set notification
                        await Notification.updateOne(
                            {
                                user: subscriber.userId?._id,
                                productLink: product.link,
                            },
                            {
                                user: subscriber.userId?._id,
                                product: product._id,
                                productLink: product.link,
                                $unset: { seen: '' },
                            },
                            { upsert: true },
                        );
                    }),
                );

                await Product.updateOne(
                    { link },
                    {
                        $set: {
                            price: prodInfo.price,
                        },
                    },
                );
            }),
        );

        // await logEvents('cron-job.log', 'notify successfully');
    } catch (error) {
        console.error('notifyPrice error: ', error);
        // await logEvents('products.log', JSON.stringify(error));
    }
}

export async function cleanupNotifications() {
    try {
        const currentTime = new Date(Date.now()).getTime();

        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        for await (const notification of Notification.find().cursor()) {
            const { seen } = notification;

            if (seen) {
                const diff = new Date(currentTime - new Date(seen).getTime());

                if (diff.getUTCDate() >= 2) {
                    await notification.remove();
                }
            }
        }

        // await logEvents('clean-notifications.log', 'success');
    } catch (error) {
        console.error('cleanupNotifications error: ', error);

        // await logEvents('clean-notifications.log', JSON.stringify(error));
    }
}

export async function getRecentlyVotes(req, rep) {
    try {
        const { limit } = req.query;

        const products = await Product.find(
            {
                $or: [
                    { up_votes: { $exists: true, $not: { $size: 0 } } },
                    { down_votes: { $exists: true, $not: { $size: 0 } } },
                ],
            },
            { updatedAt: 0, _id: 0, __v: 0 },
        )
            .sort({ updatedAt: -1 })
            .limit(limit);

        rep.status(200).send({
            status: 'success',
            products,
        });
    } catch (error) {
        console.error('getRecentlyVotes ERROR:: ', error);

        rep.status(500).send({
            status: 'error',
        });
    }
}
