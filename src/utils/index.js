/* eslint-disable camelcase */
const mapDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  inserted_at,
  updated_at,
}) => ({
  id,
  title,
  year: year ? Number(year) : undefined,
  performer,
  genre,
  duration: duration ? Number(duration) : undefined,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

module.exports = { mapDBToModel };
