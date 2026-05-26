import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function productRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {

  // Get products - Vulnerability: SQL Injection via 'search' parameter
  fastify.get('/', async (request: any, reply) => {
    const { search } = request.query;
    
    let query = 'SELECT * FROM products';
    if (search) {
      // VULNERABLE: Direct string interpolation
      query += ` WHERE name ILIKE '%${search}%'`;
    }

    try {
      const result = await fastify.pg.query(query);
      return result.rows;
    } catch (err: any) {
      // VULNERABLE: Returning full stack trace to the user
      return reply.code(500).send({
        error: 'Database Error',
        message: err.message,
        stack: err.stack 
      });
    }
  });

  // Get product by ID
  fastify.get('/:id', async (request: any, reply) => {
    const { id } = request.params;
    try {
      const result = await fastify.pg.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rowCount === 0) return reply.code(404).send({ error: 'Product not found' });
      return result.rows[0];
    } catch (err) {
      return reply.code(500).send(err);
    }
  });

  // Get product reviews - Vulnerability: Stored XSS (returning unsanitized content)
  fastify.get('/:id/reviews', async (request: any, reply) => {
    const { id } = request.params;
    try {
      const result = await fastify.pg.query('SELECT * FROM reviews WHERE product_id = $1', [id]);
      return result.rows;
    } catch (err) {
      return reply.code(500).send(err);
    }
  });

  // Add product review - Vulnerability: Stored XSS (no sanitization)
  fastify.post('/:id/reviews', { preHandler: [fastify.authenticate] }, async (request: any, reply) => {
    const { id } = request.params;
    const { content } = request.body;
    const userEmail = request.user.email;

    try {
      // VULNERABLE: Content is saved exactly as provided
      await fastify.pg.query(
        'INSERT INTO reviews (product_id, user_email, content) VALUES ($1, $2, $3)',
        [id, userEmail, content]
      );
      return reply.code(201).send({ message: 'Review added' });
    } catch (err) {
      return reply.code(500).send(err);
    }
  });
}
