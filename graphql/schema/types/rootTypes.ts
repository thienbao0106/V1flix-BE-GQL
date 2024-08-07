const rootQueryType: String = `
    type SeriesPagination {
        series: [Series!]
        currentPage: Int!
        totalPage: Int!
    }

    type EpisodesPagination {
        episodes: [Episode!]
        currentPage: Int!
        totalPage: Int!
    }

    type RootQuery {
        series(pageNumber: Int, limitPerPage: Int, amount: Int, isRelation: Boolean): SeriesPagination
        images: [Image!] 
        users: [User!]
        genres: [Genres!]
        tags: [Tags!]
        episodes(pageNumber: Int, limitPerPage: Int, amount: Int): EpisodesPagination
        login(email: String!, password: String!): AuthData! 
        findSeries(title: String!, numOfLimit: Int!, genresId: String, status: String ): [Series!]
        randomSeries: Series
        searchEpisode(seriesId: String!, epNum: Int!): Episode
        sources: [Sources!]
        token: [Token!]
        findToken(kind: String!): Token
        findEpisode(episodeId: String!): Episode
        findUserByName(username: String!): User
        findUsers(username: String!): [User!]
        findSeriesByIds(listSeries: [String!]): [Series!]
        findGenresById(genreId: String!): Genres
        findTagsById(tagId: String!): Tags
        findSeriesByName(seriesTitle: String!, isRelation: Boolean): Series
    }
`;

const rootMutationType: String = `
    type RootMutation {
        createSeries(seriesInput: SeriesInput!): Series
        deleteSeries(seriesId: String!): Boolean
        updateSeries(seriesInput: SeriesUpdateInput!, seriesId: String!): Series
        addView(seriesId: String!, episodeId: String!): Int
        addFavoriteSeries(seriesId: String!, userId: String!): Boolean
        deleteFavoriteSeries(seriesId: String!, userId: String!): Boolean
        addSeriesByAnilist(id: Int!): Series
        addTrailer(idSeries: String!, trailerUrl: String!): Boolean 
        fillGenres(seriesId: String!, anilistId: Int!): Boolean
        addRelation(relationInput: RelationUpdateInput): Boolean
        fillImages(anilistId: Int!, seriesId: String!): Boolean
        deleteSeriesImages(seriesId: String!): Boolean
        addRating(seriesId: String!, userId: String!, score: Int!): Boolean
        addReview(seriesId: String!, userId: String!, review: String!, spoilerFree: Boolean!): Review
        deleteReview(seriesId: String!, reviewId: String!): Boolean
        editReview(seriesId: String!, reviewId: String!, review: String!, spoilerFree: Boolean): Boolean
        
        

        createImage(imageInput: ImageInput!): Image
        deleteImage(imageId: String!): Boolean
        updateImage(imageInput: ImageUpdateInput!, imageId: String!): Image

        createUser(username: String!, password: String!, email: String!): User
        addSeriesToList(seriesId: String!, note: String!, currentEp: Int!, status: String!, userId: String!): User
        removeSeriesFromList(seriesId: String!, userId: String!): Boolean
        updateSeriesInList(seriesId: String!, note: String!, currentEp: Int!, status: String!, userId: String!): Boolean
        removeUser(userId: String!): Boolean
        updateProfile(email: String, username: String, password: String, avatar: String, userId: String!): Boolean

        createGenres(genresInput: GenresInput!): Genres
        addSeriesToGenres(seriesArr: [String]!, genresId: String!): Genres
        deleteGenres(genresId: String!): Boolean
        updateGenres(genresInput: GenresUpdateInput!, genresId: String!): Genres 
        addGenresByAnilist: Boolean
        deleteAllGenres: Boolean

        createEpisode(episodeInput: EpisodeInput!): Episode
        createMultipleEpisodes(seriesId: String!, totalEpisode: Int!, anilistId: Int!): [Episode]
        updateEpisode(episodeInput: EpisodeUpdateInput!, episodeId: String!): Episode
        deleteEpisode(episodeId: String!): Boolean
        addSubtitle(subtitleInput: SubtitleInput!, episodeId: String!): Boolean
        addMultipleSubtitle(seriesId: String!, lang: String!, label: String!): Boolean
        deleteSubtitle(lang: String!, episodeId: String!): Boolean
        updateSubtitle(subtitleInput: SubtitleInput!, episodeId: String!): Episode
        fillEpisodeFields: Boolean
        fillDescriptionByKitsu(kitsuId: String!, seriesId: String!): Boolean
        fillThumbnailsByKitsu(kitsuId: String!, seriesId: String!): Boolean
        fillThumbnailsByAnilist(anilistId: Int!, seriesId: String! ): Boolean
        fillThumbnailsByCrunchy(url: String!, seriesId: String!, clickCount: Int): Boolean
        fillDescriptionByWiki(url: String!, seriesId: String!, skipElements: Int): Boolean
        addComments(episodeId: String!, userId: String!, content: String!): Comment
        deleteComment(episodeId: String!, commentId: String!): Boolean
        editComment(episodeId: String!, commentId: String!, content: String!): Boolean
        
        createSource(sourceInput: SourceInput!,  episodeId: String!, type: String!, lang: String): Sources
        createMultipleSource( seriesId: String!, type: String!, lang: String, kind: String!, sourceList: [String!]!): [Sources]
        addSourceToEpisode(sourceId: String!, episodeId: String!, type: String!, lang: String): Boolean
        deleteSource(sourceId: String!, episodeId: String!, type: String!): Boolean
        deleteMultipleSource(seriesId: String!, type: String!): Boolean
        editSource(sourceInput: SourceInput!, sourceId: String!): Sources

        createToken(tokenInput: TokenInput!): Token
        editToken(value: String!, expiresAt: Float!, tokenId: String!): Token
        deleteToken(tokenId: String!): Boolean
        

        addTagsByAnilist: Boolean
        deleteAllTags: Boolean
        fillTags(seriesId: String!, anilistId: Int!): Boolean

    }
`;

export default `${rootQueryType}${rootMutationType}`;
