import { getAxiosClient, SHOPEE_URL } from '../configs/index.js';
import { handlePriceShopee } from '../utils/index.js';

const axiosClient = getAxiosClient(SHOPEE_URL, SHOPEE_URL);

export async function search(keyword, pageParam) {
    const paginate = --pageParam * 60;

    try {
        const { data } = await axiosClient.get(
            `https://shopee.vn/api/v4/search/search_items?by=relevancy&keyword=${encodeURIComponent(
                keyword,
            )}&limit=60&newest=${
                paginate !== 0 ? paginate : ''
            }&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`,
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
        console.error('error:: ', error);
        return null;
    }
}
