const genresType: String = `
    type Genres {
        _id: ID!
        name: String!
        description: String
        series: [Series]
      }
`;

const genresInput: String = `
    input GenresInput {
        name: String!
        description: String!
    }
`;

const genresUpdateInput: String = `
    input GenresUpdateInput {
        name: String
        description: String
    }
`;

export default `${genresType}${genresInput}${genresUpdateInput}`;
