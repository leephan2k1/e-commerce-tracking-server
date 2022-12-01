import Product from '../models/Product.model.js';
import User from '../models/User.model.js';
import Subscriber from '../models/Subscriber.model.js';
import Notification from '../models/Notification.model.js';

export async function getNotifications(req, rep) {
    try {
        const { userId } = req.params;

        const notifications = await Notification.find({
            user: userId,
        }).populate('product');

        return rep.status(200).send({
            status: 'success',
            notifications,
        });
    } catch (error) {
        console.error('getNotifications error: ', error);

        rep.status(500).send({
            message: 'internal server error',
        });
    }
}

export async function deleteNotification(req, rep) {
    try {
        const { userId } = req.params;
        const { productLink } = req.query;

        if (!productLink) {
            return rep.status(400).send({
                status: 'error',
                message: 'productLink query should be provide',
            });
        }

        const user = await Notification.findOne({
            user: userId,
            productLink,
        });

        if (!user) {
            return rep.status(404).send({
                status: 'error',
                message: 'The user does not own this notification yet',
            });
        }

        if (!user?.seen) {
            await user.updateOne({ $set: { seen: Date.now() } });
        }

        rep.status(200).send({
            status: 'success',
            message: 'notification will be deleted in 2 days',
            user,
        });
    } catch (error) {
        console.error('deleteNotification error: ', error);

        rep.status(500).send({
            message: 'internal server error',
        });
    }
}

export async function getFavoriteInfo(req, rep) {
    try {
        const { link } = req.body;
        const { userId } = req.params;

        const user = await User.findById(userId);

        const product = await Product.findOne({ link });

        if (!product) {
            return rep.status(404).send({
                status: 'product not found',
            });
        }

        // eslint-disable-next-line camelcase
        const { favorite_products } = user;

        // eslint-disable-next-line camelcase
        const check = favorite_products?.some(
            (id) => String(id) === String(product._id),
        );

        rep.status(200).send({
            status: 'success',
            isSaved: check,
        });
    } catch (error) {
        console.error('saveFavoriteProduct error: ', error);

        rep.status(500).send({
            message: 'internal server error',
        });
    }
}

export async function getDetailFavoritesInfo(req, rep) {
    try {
        const { userId } = req.params;

        const userWithFvProducts = await User.findById(userId, {
            name: 0,
            email: 0,
            image: 0,
            emailVerified: 0,
        }).populate('favorite_products');

        rep.status(200).send({
            status: 'success',
            user: userWithFvProducts,
        });
    } catch (error) {
        console.error('getDetailFavoritesInfo error: ', error);

        rep.status(500).send({
            message: 'internal server error',
        });
    }
}

export async function saveFavoriteProduct(req, rep) {
    try {
        const { userId } = req.params;
        const { link } = req.body;

        // eslint-disable-next-line node/no-unsupported-features/es-builtins
        let product = await Product.findOne({ link });

        if (!product) product = await Product.create(req.body);

        console.log('product:: ', product);

        await User.findByIdAndUpdate(userId, {
            $addToSet: { favorite_products: product?._id },
        });

        rep.status(201).send({
            status: 'success',
            data: req.body,
        });
    } catch (error) {
        console.error('saveFavoriteProduct error: ', error);

        rep.status(500).send({
            message: 'internal server error',
        });
    }
}

export async function deleteFavoriteProduct(req, rep) {
    try {
        const { userId } = req.params;
        const { link } = req.body;

        if (link === 'remove-all') {
            await User.updateOne(
                { _id: userId },
                { $set: { favorite_products: [] } },
            );

            return rep.status(200).send({
                status: 'success',
            });
        }

        const product = await Product.findOne({ link });

        if (!product) {
            return rep.status(404).send({
                status: 'error',
                message: 'product not found',
            });
        }

        await User.updateOne(
            { _id: userId },
            { $pull: { favorite_products: product._id } },
        );

        rep.status(200).send({
            status: 'success',
        });
    } catch (error) {
        console.error('deleteFavoriteProduct error: ', error);

        rep.status(500).send({
            message: 'internal server error',
        });
    }
}

export async function handleVoteProduct(req, rep) {
    try {
        const { userId } = req.params;
        const { voteType } = req.query;
        const { name, link, market, img, price, totalSales } = req.body;

        if (!voteType) {
            return rep.status(400).send({
                status: 'error',
                message: `voteType query needs to be provide, for ex: 'up' or 'down'`,
            });
        }

        const product = await Product.findOneAndUpdate(
            { link },
            {
                $set: {
                    name,
                    link,
                    market,
                    img,
                    price,
                    totalSales,
                },
            },
            {
                upsert: true,
            },
        );

        if (product) {
            if (voteType === 'up') {
                await product.updateOne({
                    $addToSet: { up_votes: userId },
                });
            } else {
                await product.updateOne({
                    $addToSet: { down_votes: userId },
                });
            }
        }

        rep.status(201).send({
            status: 'success',
        });
    } catch (error) {
        console.error('handleProductSearch ERROR:: ', error);

        rep.status(500).send({
            status: 'error',
        });
    }
}

export async function handleRemoveVoteProduct(req, rep) {
    try {
        const { userId } = req.params;
        const { voteType } = req.query;
        const { name, link, market, img, price, totalSales } = req.body;

        if (!voteType) {
            return rep.status(400).send({
                status: 'error',
                message: `voteType query needs to be provide, for ex: 'up' or 'down'`,
            });
        }

        const product = await Product.findOneAndUpdate(
            { link },
            {
                $set: {
                    name,
                    link,
                    market,
                    img,
                    price,
                    totalSales,
                },
            },
            {
                upsert: true,
            },
        );

        if (voteType === 'up') {
            await product.updateOne({ $pull: { up_votes: { $in: [userId] } } });
        } else {
            await product.updateOne({
                $pull: { down_votes: { $in: [userId] } },
            });
        }

        rep.status(201).send({
            status: 'success',
        });
    } catch (error) {
        console.error('handleRemoveVoteProduct ERROR:: ', error);

        rep.status(500).send({
            status: 'error',
        });
    }
}

export async function handleSubscribeToNotifyProduct(req, rep) {
    try {
        const { userId } = req.params;

        const {
            notifyChannel,
            priceCondition,
            price,
            link,
            name,
            market,
            img,
            totalSales,
        } = req.body;

        let subscriber = await Subscriber.findOne({
            userId,
            productLink: link,
        });

        if (!subscriber) {
            subscriber = await Subscriber.create({
                userId,
                notifyChannel,
                productLink: link,
                priceCondition,
                priceAtSubscribe: Number(
                    price.replace('đ', '').replace('.', ''),
                ),
            });
        } else {
            await subscriber.updateOne({
                userId,
                notifyChannel,
                productLink: link,
                priceCondition,
                priceAtSubscribe: Number(
                    price.replace('đ', '').replace('.', ''),
                ),
            });
        }

        // save to product's subscribers list
        await Product.updateOne(
            { link },
            { $set: { link, name, market, img, totalSales, price } },
            { upsert: true },
        );

        await Product.updateOne(
            { link },
            {
                $addToSet: { subscribers: subscriber?._id },
            },
        );

        return rep.status(201).send({
            status: 'success',
            data: req.body,
        });
    } catch (error) {
        console.error('handleSubscribeToNotifyProduct ERROR:: ', error);

        return rep.status(500).send({
            status: 'error',
        });
    }
}

export async function handleDeleteSubscriber(req, rep) {
    try {
        const { productLink, opt } = req.query;
        const { userId } = req.params;

        if (opt === 'removeAll') {
            const subProds = await Subscriber.find({ userId });

            // eslint-disable-next-line node/no-unsupported-features/es-builtins
            await Promise.allSettled(
                subProds.map(async (prod) => {
                    // eslint-disable-next-line node/no-unsupported-features/es-builtins
                    await Promise.allSettled([
                        await Subscriber.findByIdAndDelete(prod._id),
                        await Product.updateOne(
                            {
                                subscribers: { $in: [prod._id] },
                            },
                            { $pull: { subscribers: { $in: [prod._id] } } },
                        ),
                    ]);
                }),
            );

            return rep.status(200).send({
                status: 'success',
                message: `${userId} has unsubscribed all products successfully`,
            });
        }

        const subscriber = await Subscriber.findOne({ userId, productLink });

        if (!subscriber) {
            return rep.status(400).send({
                status: 'error',
                message: `${userId} has not subscribes ${productLink} yet`,
            });
        }

        const product = await Product.findOne({ link: productLink });

        if (!product) {
            return rep.status(400).send({
                status: 'error',
                message: `${productLink} not exist`,
            });
        }

        // remove n.n relationship:
        await product.update({
            $pull: { subscribers: { $in: [subscriber._id] } },
        });
        await subscriber?.remove();

        rep.status(200).send({
            status: 'success',
            message: `${userId} has unsubscribed ${productLink} successfully`,
        });
    } catch (error) {
        console.error('handleDeleteSubscriber ERROR:: ', error);

        rep.status(500).send({
            status: 'error',
        });
    }
}

export async function getInfoSubscriber(req, rep) {
    try {
        const { productLink } = req.query;
        const { userId } = req.params;

        const subscriber = await Subscriber.findOne({ userId, productLink });

        rep.status(200).send({ status: 'success', isSubscribed: !!subscriber });
    } catch (error) {
        console.error('getInfoSubscriber ERROR:: ', error);

        rep.status(500).send({
            status: 'error',
        });
    }
}
