import axios from 'axios';
import { TIKI_URL } from '../configs/index.js';
import { handlePriceNumber } from '../utils/index.js';

export async function search(keyword, pageNumber) {
    try {
        const { data } = await axios.get(
            `https://tiki.vn/api/v2/products?limit=48&aggregations=2&q=${encodeURIComponent(
                keyword,
            )}&page=${pageNumber}`,
        );

        if (Array.isArray(data?.data)) {
            const products = data?.data.reduce((result, product) => {
                const name = product?.name;
                const img = product?.thumbnail_url;
                const price = handlePriceNumber(product?.price);
                const totalSales = product?.quantity_sold?.text;
                const link = `${TIKI_URL}/${product?.url_path}`;
                if (
                    name &&
                    img &&
                    product?.price &&
                    totalSales &&
                    product?.url_path
                ) {
                    result.push({ name, img, price, totalSales, link });
                }
                return result;
            }, []);
            return products ? products : null;
        }
        return null;
    } catch (error) {
        return null;
    }
}
