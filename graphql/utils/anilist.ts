import axios from "axios";
import { transferImagesArr, uploadToCloudinary } from "./image";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const getALShow = async (id: number) => {
  try {
    const query = `
        query getShow($id: Int) {
            Media(id: $id) {
                title {
                    romaji
                    english
                  }
                description
                season
                seasonYear
                format
                episodes
                status
                duration
                tags {
                  name
                }
                genres
                trailer {
                  id
                  site
                  thumbnail
                }
            }
        }
    `;

    const result = await axios.post("https://graphql.anilist.co", {
      query,
      headers,
      variables: {
        id,
      },
    });
    if (!result.data.data) throw new Error("Can't find this series");
    console.log(result.data.data);
    return result.data.data;
  } catch (error) {
    throw error;
  }
};

export const getALGenresShow = async (id: number) => {
  try {
    const query = `
      query getGenresShow($id: Int) {
        Media(id: $id) {
           genres
        }  
      }  
    `;
    const result = await axios.post("https://graphql.anilist.co", {
      query,
      headers,
      variables: {
        id,
      },
    });
    if (!result.data.data) throw new Error("Can't find this series");
    console.log(result.data.data);
    return result.data.data.Media.genres;
  } catch (error) {
    throw error;
  }
};

export const getALTagsShow = async (id: number) => {
  try {
    const query = `
      query getGenresShow($id: Int) {
        Media(id: $id) {
           tags {
              name
           }
        }  
      }  
    `;
    const result = await axios.post("https://graphql.anilist.co", {
      query,
      headers,
      variables: {
        id,
      },
    });
    if (!result.data.data) throw new Error("Can't find this series");
    console.log(result.data.data);
    return result.data.data.Media.tags;
  } catch (error) {
    throw error;
  }
};

export const getMultipleEpisodeTitle = async (id: number) => {
  try {
    const query = `
       query getGenresShow($id: Int) {
            Media(id: $id) {
              streamingEpisodes {
                title 
            }
        }   
      }  
    `;
    const result = await axios.post("https://graphql.anilist.co", {
      query,
      headers,
      variables: {
        id,
      },
    });
    if (!result.data.data) throw new Error("Can't find this series");
    console.log(result.data.data);
    return result.data.data.Media.streamingEpisodes.map((episode: any) => {
      return episode.title.split("- ")[1];
    });
  } catch (error) {
    throw error;
  }
};

export const getALGenres = async () => {
  try {
    const query = `
      query getGenres {
        GenreCollection
      }
    `;
    const result = await axios.post("https://graphql.anilist.co", {
      query,
      headers,
    });
    console.log(result.data.data);
    if (!result.data.data) throw new Error("Can't handle tag");
    const genres = result.data.data.GenreCollection.filter(
      (genre: any) => genre !== "Hentai"
    ).map((name: string) => {
      return {
        name,
      };
    });
    return genres;
  } catch (error) {
    throw error;
  }
};

export const getALTags = async () => {
  try {
    const query = `
        query getTags {
           MediaTagCollection {
            name
            description
            isAdult
          }
        }
    `;
    const result = await axios.post("https://graphql.anilist.co", {
      query,
      headers,
    });
    console.log(result.data.data);
    if (!result.data.data) throw new Error("Can't handle tag");
    const tags = result.data.data.MediaTagCollection.filter(
      (tag: any) => !tag.isAdult
    );
    return tags;
  } catch (error) {
    throw error;
  }
};

export const getALImages = async (
  id: any,
  titleSeries: string,
  seriesId: string
) => {
  try {
    const query = `
      query getImagesShow($id: Int) {
        Media(id: $id) {
          coverImage {
            extraLarge 
            large 
            medium
          } 
          bannerImage
        }  
      }  
    `;
    const result = await axios.post("https://graphql.anilist.co", {
      query,
      headers,
      variables: {
        id,
      },
    });
    console.log(result.data.data);
    //Cloudinary handle
    if (!result.data.data) throw new Error("Can't handle images");
    const images = result.data.data.Media;
    const bannerUrl = await uploadToCloudinary(
      images.bannerImage,
      "banner",
      titleSeries
    );
    const coverUrl = await uploadToCloudinary(
      images.coverImage.large,
      "cover",
      titleSeries
    );

    const thumbnailUrl = await uploadToCloudinary(
      images.coverImage.medium,
      "thumbnail",
      titleSeries
    );
    console.log("---------result images");
    console.log(
      transferImagesArr({
        titleSeries,
        seriesId,
        bannerUrl,
        coverUrl,
        thumbnailUrl,
      })
    );

    return transferImagesArr({
      titleSeries,
      seriesId,
      bannerUrl,
      coverUrl,
      thumbnailUrl,
    });
  } catch (error) {
    throw error;
  }
};
