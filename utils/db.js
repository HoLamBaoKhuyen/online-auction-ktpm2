import fn from "knex";

// export const connectionInfo = {
//   host: "127.0.0.1",
//   port: 3306,
//   user: "root",
//   password: "Baokhuyen2001@",
//   database: "onlauction",
// };

export const connectionInfo = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: 3306,
  database: process.env.DB_DATABASE,
  ssl: {
    // Force unsecured connection to PlanetScale
    // https://www.w3resource.com/node.js/nodejs-mysql.php#SSL_options
    rejectUnauthorized: false,
  },
};

const knex = fn({
  client: "mysql2",
  connection: connectionInfo,
  pool: {
    min: 0,
    max: 10,
  },
  debug: true,
});

export default knex;
