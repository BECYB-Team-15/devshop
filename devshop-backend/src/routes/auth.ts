import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function authRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  
  // Register endpoint - Vulnerability: No password strength validation
  fastify.post('/register', async (request: any, reply) => {
    const { email, password } = request.body;
    
    try {
      // Check if user exists
      const userExists = await fastify.pg.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );
      
      if (userExists.rowCount && userExists.rowCount > 0) {
        return reply.code(400).send({ error: 'Email already taken' });
      }
      
      // Store password as plain text (CRITICAL VULNERABILITY)
      await fastify.pg.query(
        'INSERT INTO users (email, password) VALUES ($1, $2)',
        [email, password]
      );
      
      return reply.code(201).send({ message: 'User registered successfully' });
    } catch (err) {
      return reply.code(500).send(err);
    }
  });

  // Login endpoint - Vulnerability: No Rate Limiting (Brute-force possible)
  fastify.post('/login', async (request: any, reply) => {
    const { email, password } = request.body;
    
    try {
      const result = await fastify.pg.query(
        'SELECT id, email, password FROM users WHERE email = $1',
        [email]
      );
      
      if (result.rowCount === 0) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }
      
      const user = result.rows[0];
      
      // Plain text comparison
      if (user.password !== password) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }
      
      const token = fastify.jwt.sign({ id: user.id, email: user.email });
      return { token };
    } catch (err) {
      return reply.code(500).send(err);
    }
  });
}
