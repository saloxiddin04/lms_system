// const { Pool } = require('pg')
// const pool = new Pool({ connectionString: process.env.DATABASE_URL })
// module.exports = { query: (text, params) => pool.query(text, params) }

const { Pool } = require("pg");

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

pool.connect()
	.then(client => {
		console.log("✅ Connected to Postgres DB");
		client.release();
	})
	.catch(err => {
		console.error("❌ DB connection error:", err.stack);
	});

module.exports = {
	query: (text, params) => pool.query(text, params),
};
