import axios from 'axios';
import { TIKI_URL } from '../configs/index.js';
import { handlePriceNumber, getAxiosClient } from '../utils/index.js';
import { MARKET_MAPPING } from '../constants/index.js';

const axiosClient = getAxiosClient(TIKI_URL, TIKI_URL, TIKI_URL + '/api/v2');

export async function search(keyword, pageNumber, sort) {
    try {
        const { data } = await axios.get(
            `https://tiki.vn/api/v2/products?limit=48&aggregations=2&q=${encodeURIComponent(
                keyword,
            )}&page=${pageNumber}${sort ? `&sort=price,${sort}` : ''}`,
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

export async function getFlashSale(page, limit) {
    try {
        const { data } = await axios.get(
            `https://tiki.vn/api/v2/widget/deals/collection?page=${page}&per_page=${limit}`,
            {
                headers: {
                    Referer: 'https://tiki.vn/deal-hot?tab=now',
                    Cookie: '_trackity=78cb128e-f12e-acf7-7dc3-fc66590753b4; TOKENS={%22access_token%22:%22Ktbi1e4F5kYHAwLxVGsEuZ3I6QvCjyJg%22%2C%22expires_in%22:157680000%2C%22expires_at%22:1822229968368%2C%22guest_token%22:%22Ktbi1e4F5kYHAwLxVGsEuZ3I6QvCjyJg%22}; delivery_zone=Vk4wMjMwMDcwMDU=; _ga=GA1.2.875482707.1664549971; _gid=GA1.2.2017219505.1664549971; tiki_client_id=875482707.1664549971',
                },
            },
        );

        if (!data?.data && !data.data?.length) throw new Error();

        if (Array.isArray(data?.data)) {
            const products = data.data.reduce((result, prod) => {
                const name = prod?.name;

                const img = prod?.product?.thumbnail_url;

                const price = prod?.product?.price;

                const priceBeforeDiscount = prod?.product?.original_price;

                const discountPercent = prod?.discount_percent;

                const totalSales = prod?.product?.quantity_sold?.text;

                const link = `${TIKI_URL}/${prod?.product?.url_path}`;

                const qtyRemainPercent = prod?.progress?.percent;

                // eslint-disable-next-line camelcase
                const product_base_id = `3__${prod?.product?.master_id}__${prod?.product?.id}`;

                if (
                    name &&
                    img &&
                    price &&
                    priceBeforeDiscount &&
                    discountPercent &&
                    totalSales &&
                    link &&
                    qtyRemainPercent &&
                    // eslint-disable-next-line camelcase
                    product_base_id
                ) {
                    result.push({
                        name,
                        img,
                        price,
                        priceBeforeDiscount,
                        discountPercent,
                        totalSales,
                        link,
                        qtyRemainPercent,
                        // eslint-disable-next-line camelcase
                        product_base_id,
                        market: 'tiki',
                    });
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

export async function getProductDetails(url) {
    const lastStr = String(url.split('-').pop());
    const id = lastStr.slice(1, lastStr.indexOf('.'));

    try {
        const { data } = await axiosClient.get(`/products/${id}?platform=web`);

        if (!data) return null;

        const {
            name,
            description,
            images,
            price,
            original_price,
            all_time_quantity_sold,
            brand,
            id: objId,
            current_seller,
        } = data;

        return {
            name,
            description: description ? description : '',
            link: `${MARKET_MAPPING['tiki']}/${url}`,
            images: images.map((img) => img?.medium_url),
            price: handlePriceNumber(price),
            priceBeforeDiscount:
                original_price !== price
                    ? handlePriceNumber(original_price)
                    : null,
            totalSales: all_time_quantity_sold ? all_time_quantity_sold : '0',
            brand: brand?.name ? brand?.name : '',
            market: 'tiki',
            product_base_id: `3__${objId}__${current_seller?.product_id}`,
        };
    } catch (error) {
        console.error('TIKI GET DETAILS ERROR:: ', error);

        return null;
    }
}
