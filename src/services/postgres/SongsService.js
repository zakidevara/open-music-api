const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, performer, genre, duration,
  }) {
    const id = `song-${nanoid()}`;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const query = {
      text: 'INSERT INTO songs(id, title, year, performer, genre, duration, inserted_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        insertedAt,
        updatedAt,
      ],
    };

    const results = await this._pool.query(query);

    if (!results.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return results.rows[0].id;
  }

  async getSongs() {
    const results = await this._pool.query('SELECT id, title, performer FROM songs');
    return results.rows.map(mapDBToModel);
  }

  async getSongById(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id=$1',
      values: [songId],
    };

    const results = await this._pool.query(query);
    if (!results.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return results.rows.map(mapDBToModel)[0];
  }

  async editSongById(songId, {
    title, year, performer, genre, duration,
  }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE songs SET title=$1, year=$2, performer=$3, genre=$4, duration=$5, updated_at=$6 WHERE id=$7 RETURNING id',
      values: [
        title,
        year,
        performer,
        genre,
        duration,
        updatedAt,
        songId,
      ],
    };

    const results = await this._pool.query(query);
    if (!results.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(songId) {
    const query = {
      text: 'DELETE FROM songs WHERE id=$1 RETURNING id',
      values: [songId],
    };

    const results = await this._pool.query(query);
    if (!results.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
