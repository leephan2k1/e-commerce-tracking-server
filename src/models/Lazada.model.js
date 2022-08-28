import { getAxiosClient } from '../configs/index.js';
import { LAZADA_URL } from '../configs/index.js';
import { unshiftProtocol } from '../utils/index.js';

const axiosClient = getAxiosClient(LAZADA_URL, LAZADA_URL);

export async function search(keyword, page) {
    try {
        const { data } = await axiosClient.get(
            `https://www.lazada.vn/catalog/?_keyori=ss&ajax=true&from=input&isFirstRequest=true&page=${page}&q=${encodeURIComponent(
                keyword,
            )}`,
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
        }
    } catch (error) {
        console.error('error:: ', error);
        return null;
    }
}
