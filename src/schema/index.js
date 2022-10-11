const productRequired = {
    name: { type: 'string' },
    link: { type: 'string' },
    market: { type: 'string' },
    img: { type: 'string' },
    price: { type: 'string' },
    totalSales: { type: 'string' },
};

export const bodySchema = [
    {
        $id: 'productBodySchema',
        type: 'object',
        required: ['name', 'link', 'img', 'price', 'market'],
        properties: productRequired,
    },

    {
        $id: 'subscribeBodySchema',
        type: 'object',
        required: [
            'name',
            'link',
            'img',
            'price',
            'market',
            'notifyChannel',
            'priceCondition',
        ],
        properties: {
            // eslint-disable-next-line node/no-unsupported-features/es-syntax
            ...productRequired,
            priceCondition: { type: 'string' },
            notifyChannel: { type: 'string' },
        },
    },
];
