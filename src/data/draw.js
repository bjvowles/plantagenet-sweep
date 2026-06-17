// Plantagenet Medical sweep draw.
// teams: 2 top-24 + 2 bottom-24. bottomSeeds lists which of a person's teams are bottom-24 (for Dark Horse).
// Keeper/player format: { name, nation }.

export const DRAW = [
  { name: 'Ligia',
    teams: ['France', 'Colombia', 'Australia', 'Scotland'],
    bottomSeeds: ['Australia', 'Scotland'],
    keepers: [{ name: 'Emiliano Martínez', nation: 'Argentina' }, { name: 'Diogo Costa', nation: 'Portugal' }],
    players: [{ name: 'Kylian Mbappé', nation: 'France' }, { name: 'Luis Díaz', nation: 'Colombia' }, { name: 'Jérémy Doku', nation: 'Belgium' }, { name: 'Mohamed Salah', nation: 'Egypt' }, { name: 'Mohamed Toure', nation: 'Australia' }] },

  { name: 'Martija',
    teams: ['Argentina', 'Uruguay', 'Egypt', 'South Africa'],
    bottomSeeds: ['Egypt', 'South Africa'],
    keepers: [{ name: 'Dominik Livaković', nation: 'Croatia' }, { name: 'Alisson Becker', nation: 'Brazil' }],
    players: [{ name: 'Lionel Messi', nation: 'Argentina' }, { name: 'Darwin Núñez', nation: 'Uruguay' }, { name: 'Ferran Torres', nation: 'Spain' }, { name: 'Romelu Lukaku', nation: 'Belgium' }, { name: 'Edin Džeko', nation: 'Bosnia & Herzegovina' }] },

  { name: 'Nathan',
    teams: ['Spain', 'USA', 'Canada', 'Tunisia'],
    bottomSeeds: ['Canada', 'Tunisia'],
    keepers: [{ name: 'Yassine Bounou', nation: 'Morocco' }, { name: 'Jordan Pickford', nation: 'England' }],
    players: [{ name: 'Mikel Oyarzabal', nation: 'Spain' }, { name: 'Christian Pulisic', nation: 'USA' }, { name: 'Enner Valencia', nation: 'Ecuador' }, { name: 'Jonathan David', nation: 'Canada' }, { name: 'Breel Embolo', nation: 'Switzerland' }] },

  { name: 'Sophie',
    teams: ['England', 'Mexico', 'New Zealand', 'Bosnia & Herzegovina'],
    bottomSeeds: ['New Zealand', 'Bosnia & Herzegovina'],
    keepers: [{ name: 'Mike Maignan', nation: 'France' }, { name: 'Marc-André ter Stegen', nation: 'Germany' }],
    players: [{ name: 'Harry Kane', nation: 'England' }, { name: 'Raúl Jiménez', nation: 'Mexico' }, { name: 'Mikel Merino', nation: 'Spain' }, { name: 'Memphis Depay', nation: 'Netherlands' }, { name: 'Chris Wood', nation: 'New Zealand' }] },

  { name: 'Sarah',
    teams: ['Brazil', 'Croatia', 'Saudi Arabia', "Côte d'Ivoire"],
    bottomSeeds: ['Saudi Arabia', "Côte d'Ivoire"],
    keepers: [{ name: 'Koen Casteels', nation: 'Belgium' }, { name: 'Yann Sommer', nation: 'Switzerland' }],
    players: [{ name: 'Vinícius Júnior', nation: 'Brazil' }, { name: 'Lautaro Martínez', nation: 'Argentina' }, { name: 'Bruno Fernandes', nation: 'Portugal' }, { name: 'Youssef En-Nesyri', nation: 'Morocco' }, { name: 'Andrej Kramarić', nation: 'Croatia' }] },

  { name: 'Mandie',
    teams: ['Portugal', 'Senegal', 'Paraguay', 'Haiti'],
    bottomSeeds: ['Paraguay', 'Haiti'],
    keepers: [{ name: 'Andries Noppert', nation: 'Netherlands' }, { name: 'Uğurcan Çakır', nation: 'Türkiye' }],
    players: [{ name: 'Cristiano Ronaldo', nation: 'Portugal' }, { name: 'Sadio Mané', nation: 'Senegal' }, { name: 'Jean-Philippe Mateta', nation: 'France' }, { name: 'Son Heung-min', nation: 'Korea Republic' }, { name: 'Viktor Gyökeres', nation: 'Sweden' }] },

  { name: 'Simone',
    teams: ['Morocco', 'Switzerland', 'Czechia', 'Ghana'],
    bottomSeeds: ['Czechia', 'Ghana'],
    keepers: [{ name: 'Guillermo Ochoa', nation: 'Mexico' }, { name: 'Patrick Pentz', nation: 'Austria' }],
    players: [{ name: 'Erling Haaland', nation: 'Norway' }, { name: 'Ousmane Dembélé', nation: 'France' }, { name: 'Jamal Musiala', nation: 'Germany' }, { name: 'Scott McTominay', nation: 'Scotland' }, { name: 'Nicolas Jackson', nation: 'Senegal' }] },

  { name: 'Caitlin',
    teams: ['Netherlands', 'Austria', 'Qatar', 'DR Congo'],
    bottomSeeds: ['Qatar', 'DR Congo'],
    keepers: [{ name: 'Sergio Rochet', nation: 'Uruguay' }, { name: 'P. Beach', nation: 'Australia' }],
    players: [{ name: 'Lamine Yamal', nation: 'Spain' }, { name: 'Raphinha', nation: 'Brazil' }, { name: 'Leandro Trossard', nation: 'Belgium' }, { name: 'Yoane Wissa', nation: 'DR Congo' }, { name: 'Arda Güler', nation: 'Türkiye' }] },

  { name: 'Alannah',
    teams: ['Belgium', 'Japan', 'Uzbekistan', 'Algeria'],
    bottomSeeds: ['Uzbekistan', 'Algeria'],
    keepers: [{ name: 'Unai Simón', nation: 'Spain' }, { name: 'Jo Hyeon-woo', nation: 'Korea Republic' }],
    players: [{ name: 'Julián Álvarez', nation: 'Argentina' }, { name: 'Jude Bellingham', nation: 'England' }, { name: 'Donyell Malen', nation: 'Netherlands' }, { name: 'Anthony Elanga', nation: 'Sweden' }, { name: 'Ayase Ueda', nation: 'Japan' }] },

  { name: 'Alice',
    teams: ['Germany', 'Korea Republic', 'Cape Verde', 'Jordan'],
    bottomSeeds: ['Cape Verde', 'Jordan'],
    keepers: [{ name: 'Jindřich Staněk', nation: 'Czechia' }, { name: 'Aymen Dahmen', nation: 'Tunisia' }],
    players: [{ name: 'Kai Havertz', nation: 'Germany' }, { name: 'Alexander Isak', nation: 'Sweden' }, { name: 'Marcus Rashford', nation: 'England' }, { name: 'Folarin Balogun', nation: 'USA' }, { name: 'Nestory Irankunda', nation: 'Australia' }] },
];

// The 8 unallocated teams. Playing one of these in the GROUP STAGE earns win +3 / draw +1 / loss -3.
export const GHOST_RIDERS = ['Ecuador', 'Iran', 'Türkiye', 'Norway', 'Curaçao', 'Sweden', 'Iraq', 'Panama'];
