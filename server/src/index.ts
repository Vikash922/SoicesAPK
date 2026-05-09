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

const start = async () => {
  const port = Number(process.env.PORT || 3001);
  await app.listen({ port, host: '0.0.0.0' });
};

start().catch((err) => {
  app.log.error(err);
  process.exit(1);
});
