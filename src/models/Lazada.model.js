import {
    getAxiosClient,
    LAZADA_URL,
    BC_URL,
    BC_API,
} from '../configs/index.js';
import { unshiftProtocol } from '../utils/index.js';
import { handlePriceNumber } from '../utils/index.js';
import slug from 'slug';

const axiosClient = getAxiosClient(LAZADA_URL, LAZADA_URL);

export async function search(keyword, page, sort) {
    try {
        const { data } = await axiosClient.get(
            `https://www.lazada.vn/catalog/?_keyori=ss&ajax=true&from=input&isFirstRequest=true&page=${page}&q=${encodeURIComponent(
                keyword,
            )}${sort ? `&sort=price${sort}` : ''}`,
        );

        if (data?.mods && Array.isArray(data?.mods.listItems)) {
            const product = data?.mods.listItems.reduce((result, product) => {
                const name = product?.name;

                const img = product?.image;

                const price = product?.priceShow;

                const link = unshiftProtocol(String(product?.itemUrl));

                // bc lazada doesn't show historical_sales, but they have 1 buyer = 1 review
                const totalSales = product?.review;

                if (name && img && price && totalSales && product?.itemUrl) {
                    result.push({ name, img, price, link, totalSales });
                }

                return result;
            }, []);

            return product ? product : [];
        } else {
            throw new Error();
        }
    } catch (error) {
        const axiosClient = getAxiosClient(BC_URL, BC_URL);

        try {
            const { data } = await axiosClient.post(
                `${BC_API}/search/keyword`,
                {
                    limit: 24,
                    page: --page,
                    query_search_filter_sort: {
                        lst_platform_id: ['2'],
                        sort: 'google_queries.pos__asc',
                    },
                    slug: slug(keyword),
                },
            );

            const listResult = data?.data?.lst_product;

            if (Array.isArray(listResult)) {
                const products = listResult.map((product) => {
                    const img = product?.url_thumbnail;

                    const name = String(product?.name).trim();

                    const price = handlePriceNumber(Number(product?.price));

                    const totalSales = product?.rating_count;

                    const productIds = String(product?.product_base_id)
                        .trim()
                        .split('__');

                    const link = `${LAZADA_URL}/products/${String(slug(name))
                        .replace(/\s/g, '-')
                        .replace(/\[|\]/g, '-')
                        .replace('%', '')}-i${productIds[1]}-s${
                        productIds[1]
                    }.html`;

                    return {
                        img,
                        name,
                        price,
                        totalSales,
                        link,
                    };
                });

                return products ? products : [];
            }
        } catch (error) {
            return null;
        }
    }
}
