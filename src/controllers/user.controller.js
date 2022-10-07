import Product from '../models/Product.model.js';
import User from '../models/User.model.js';

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
        const product = await Product.findOneAndUpdate({ link }, req.body, {
            upsert: true,
        });

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

        if (voteType === 'up') {
            await product.updateOne({
                $addToSet: { up_votes: userId },
            });
        } else {
            await product.updateOne({
                $addToSet: { down_votes: userId },
            });
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
