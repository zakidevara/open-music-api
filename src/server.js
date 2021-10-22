require('dotenv').config();
const Hapi = require('@hapi/hapi');
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Register plugins
  const songsService = new SongsService();
  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  });
  // Start the server
  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

init();
