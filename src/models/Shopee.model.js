import {
    getAxiosClient,
    SHOPEE_URL,
    BC_URL,
    BC_API,
} from '../configs/index.js';
import { handlePriceShopee, handlePriceNumber } from '../utils/index.js';
import slug from 'slug';

export async function search(keyword, pageParam, sort) {
    const axiosClient = getAxiosClient(SHOPEE_URL, SHOPEE_URL);
    const paginate = --pageParam * 60;

    try {
        const { data } = await axiosClient.get(
            `https://shopee.vn/api/v4/search/search_items?by=relevancy&keyword=${encodeURIComponent(
                keyword,
            )}&limit=60&newest=${paginate !== 0 ? paginate : ''}&order=${
                sort ? sort : 'desc'
            }&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`,
        );

        if (Array.isArray(data?.items)) {
            const products = data?.items.reduce((result, product) => {
                const name = product?.item_basic.name;

                const img = `https://cf.shopee.vn/file/${product?.item_basic.image}_tn`;

                let price;

                if (
                    !isNaN(product?.item_basic.price_min) &&
                    !isNaN(product?.item_basic.price_max)
                ) {
                    const minPrice = handlePriceShopee(
                        product?.item_basic.price_min,
                    );

                    const maxPrice = handlePriceShopee(
                        product?.item_basic.price_max,
                    );

                    price =
                        minPrice === maxPrice
                            ? minPrice
                            : `${minPrice} - ${maxPrice}`;
                }

                const link = `${SHOPEE_URL}/${String(name)
                    .replace(/\s/g, '-')
                    .replace(/\[|\]/g, '-')
                    .replace('%', '')}-i.${product?.item_basic.shopid}.${
                    product?.item_basic.itemid
                }`;

                const totalSales = product?.item_basic.historical_sold
                    ? `Đã bán ${product?.item_basic.historical_sold}`
                    : null;

                if (
                    name &&
                    product?.item_basic.image &&
                    totalSales &&
                    product?.item_basic.shopid &&
                    product?.item_basic.itemid
                ) {
                    result.push({ name, img, price, totalSales, link });
                }

                return result;
            }, []);

            return products ? products : [];
        }
    } catch (error) {
        const axiosClient = getAxiosClient(BC_URL, BC_URL);

        try {
            const { data } = await axiosClient.post(
                `${BC_API}/search/keyword`,
                {
                    limit: 24,
                    page: pageParam,
                    query_search_filter_sort: {
                        lst_platform_id: ['1'],
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

                    const link = `${SHOPEE_URL}/${String(name)
                        .replace(/\s/g, '-')
                        .replace(/\[|\]/g, '-')
                        .replace('%', '')}-i.${productIds[2]}.${productIds[1]}`;

                    return {
                        name,
                        img,
                        price,
                        totalSales,
                        link,
                    };
                });

                return products ? products : [];
            }

            return null;
        } catch (error) {
            return null;
        }
    }
}
