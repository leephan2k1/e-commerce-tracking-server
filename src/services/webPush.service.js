import webPush from 'web-push';
import { WEB_URL } from '../configs/index.js';
import { handleSubPathMarket } from '../utils/index.js';

export async function webPushNotify(identifications, product) {
    try {
        // eslint-disable-next-line node/no-unsupported-features/es-builtins
        await Promise.allSettled(
            identifications.map(async (identification) => {
                await webPush.sendNotification(
                    {
                        endpoint: identification.endpoint,
                        keys: identification.keys,
                    },
                    JSON.stringify({
                        title: `${product?.name} đã có giá mới`,
                        body: `${product?.price} là giá hiện tại`,
                        badge: 'https://i.ibb.co/XjGVZ3S/logo-1.png',
                        icon: 'https://i.ibb.co/XjGVZ3S/logo-1.png',
                        image:
                            (product?.images?.length && product?.images[0]) ||
                            product?.images[1],
                        data: {
                            url: `${WEB_URL}/products/${
                                product.market
                            }/${handleSubPathMarket(
                                product?.market,
                                product?.link,
                            )}`,
                        },
                    }),
                );
            }),
        );
    } catch (error) {
        console.error('webPush ERROR::: ', error);
    }
}
