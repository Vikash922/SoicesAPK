import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/health', async () => ({ ok: true, service: 'spicecart-api', ts: new Date().toISOString() }));

app.get('/v1/config/feature-flags', async () => ({
  realtimeTracking: true,
  smartPairing: true,
  voiceSearch: true,
}));

app.get('/v1/orders/:id/tracking', async (req) => {
  const { id } = req.params as { id: string };
  return {
    orderId: id,
    status: 'out_for_delivery',
    etaMinutes: 25,
    storeLocation: { latitude: 19.076, longitude: 72.8777 },
    destinationLocation: { latitude: 19.096, longitude: 72.905 },
    riderLocation: { latitude: 19.088, longitude: 72.891 },
    timeline: [
      { id: 'placed', at: '2026-05-09T14:00:00.000Z', done: true },
      { id: 'confirmed', at: '2026-05-09T14:05:00.000Z', done: true },
      { id: 'packed', at: '2026-05-09T14:15:00.000Z', done: true },
      { id: 'out_for_delivery', at: '2026-05-09T14:30:00.000Z', done: true },
      { id: 'delivered', at: null, done: false },
    ],
  };
});

app.get('/v1/products', async () => ({ items: [], page: 1, total: 0 }));
app.get('/v1/products/:id', async (req) => ({ id: (req.params as any).id }));
app.get('/v1/categories', async () => ({ items: [] }));
app.get('/v1/cart', async () => ({ items: [], couponCode: null, discount: 0 }));
app.post('/v1/cart/items', async () => ({ ok: true }));
app.patch('/v1/cart/items/:id', async () => ({ ok: true }));
app.delete('/v1/cart/items/:id', async () => ({ ok: true }));
app.get('/v1/orders', async () => ({ items: [] }));
app.get('/v1/orders/:id', async (req) => ({ id: (req.params as any).id }));
app.post('/v1/orders', async () => ({ ok: true, orderId: 'SPC-DEMO-1' }));

const start = async () => {
  const port = Number(process.env.PORT || 3001);
  await app.listen({ port, host: '0.0.0.0' });
};

start().catch((err) => {
  app.log.error(err);
  process.exit(1);
});
