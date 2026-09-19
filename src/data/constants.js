export const FIELD_DIRECTIONS = [
  { id: 'third_man',   name: 'Third Man',   angle: 45,  label: 'Third Man',   sector: 'Off Side' },
  { id: 'point',       name: 'Point',       angle: 90,  label: 'Point',       sector: 'Off Side' },
  { id: 'cover',       name: 'Cover',       angle: 120, label: 'Cover',       sector: 'Off Side' },
  { id: 'mid_off',     name: 'Mid Off',     angle: 150, label: 'Mid Off',     sector: 'Off Side' },
  { id: 'long_off',    name: 'Long Off',    angle: 170, label: 'Long Off',    sector: 'Off Side' },
  { id: 'long_on',     name: 'Long On',     angle: 190, label: 'Long On',     sector: 'Leg Side' },
  { id: 'mid_on',      name: 'Mid On',      angle: 210, label: 'Mid On',      sector: 'Leg Side' },
  { id: 'mid_wicket',  name: 'Mid Wicket',  angle: 240, label: 'Mid Wicket',  sector: 'Leg Side' },
  { id: 'square_leg',  name: 'Square Leg',  angle: 270, label: 'Square Leg',  sector: 'Leg Side' },
  { id: 'fine_leg',    name: 'Fine Leg',    angle: 315, label: 'Fine Leg',    sector: 'Leg Side' }
];

export const INITIAL_SCORECARD = {
  batting: [],
  extras: { total: 0, byes: 0, legByes: 0, wides: 0, noBalls: 0 },
  bowling: [],
  fallOfWickets: [],
};
