import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function orderRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {

  // Get all orders for the authenticated user
  fastify.get('/', { preHandler: [fastify.authenticate] }, async (request: any, reply) => {
    const userId = request.user.id;
    try {
      const result = await fastify.pg.query(
        'SELECT * FROM orders WHERE user_id = $1',
        [userId]
      );
      return result.rows;
    } catch (err) {
      return reply.code(500).send(err);
    }
  });

  // Create order - Vulnerability: Hardcoded Secrets
  fastify.post('/', { preHandler: [fastify.authenticate] }, async (request: any, reply) => {
    const { product_ids } = request.body;
    const userId = request.user.id;

    // VULNERABLE: Hardcoded API Key for payment processor
    const PAYMENT_PROCESSOR_KEY = 'sk_live_51MzB8xX7yY6zZ5wP4vV3uU2tR';
    console.log(`Processing payment with key: ${PAYMENT_PROCESSOR_KEY}`);

    try {
      // Calculate total (simplified)
      const productsResult = await fastify.pg.query(
        'SELECT SUM(price) as total FROM products WHERE id = ANY($1)',
        [product_ids]
      );
      const total = productsResult.rows[0].total || 0;

      const orderResult = await fastify.pg.query(
        'INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING id',
        [userId, total, 'PAID']
      );
      const orderId = orderResult.rows[0].id;

      // Link items
      for (const pid of product_ids) {
        await fastify.pg.query(
          'INSERT INTO order_items (order_id, product_id) VALUES ($1, $2)',
          [orderId, pid]
        );
      }

      return reply.code(201).send({ id: orderId, user_id: userId, total, status: 'PAID' });
    } catch (err) {
      return reply.code(500).send(err);
    }
  });

  // Get order details - Vulnerability: IDOR
  fastify.get('/:id', { preHandler: [fastify.authenticate] }, async (request: any, reply) => {
    const { id } = request.params;
    
    // VULNERABLE: We verify JWT (fastify.authenticate), 
    // but we DON'T check if the order belongs to the user (request.user.id)
    try {
      const result = await fastify.pg.query(
        'SELECT * FROM orders WHERE id = $1',
        [id]
      );

      if (result.rowCount === 0) {
        return reply.code(404).send({ error: 'Order not found' });
      }

      return result.rows[0];
    } catch (err) {
      return reply.code(500).send(err);
    }
  });
}
