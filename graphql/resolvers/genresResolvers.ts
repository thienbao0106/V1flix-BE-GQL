import { getDefaultResultOrder } from "dns";
import Genres from "../../models/genres";
import Series from "../../models/series";
import { checkObject } from "../utils";
import { findMultipleSeries, findSeries } from "../utils/series";
import { transformGenres } from "../utils/genres";

export const genresResolvers = {
  genres: async () => {
    try {
      const result = await Genres.find();
      console.log(result);
      return result.map((genres: any) => {
        return transformGenres(genres);
      });
    } catch (error) {
      throw error;
    }
  },
  createGenres: async (args: any) => {
    try {
      const { name, description } = args.genresInput;
      const isExisted = await Genres.find({ name: name.toLowerCase() });
      console.log(isExisted);
      if (isExisted.length > 0)
        throw new Error("This genres is already existed");
      const genres = new Genres({
        name: name.toLowerCase(),
        description,
      });
      const result: any = await genres.save();
      return transformGenres(result);
    } catch (error) {
      throw error;
    }
  },
  addSeriesToGenres: async (args: any) => {
    try {
      const { seriesArr, genresId } = args;
      const currentGenres: any = await Genres.findById(genresId);
      const result: any = await Genres.findByIdAndUpdate(
        genresId,
        { series: [...currentGenres.series, seriesArr] },
        { returnDocument: "after" }
      );

      const listSeries = await findMultipleSeries([
        ...currentGenres.series,
        seriesArr,
      ]);
      listSeries.map(async (series: any) => {
        const listGenres = await series.genres();
        listGenres.push(genresId);
        await Series.findByIdAndUpdate(series._id, {
          genres: listGenres,
        });
      });

      return transformGenres(result);
    } catch (error) {
      throw error;
    }
  },
  deleteGenres: async ({ genresId }: any) => {
    try {
      const result: any = await Genres.findByIdAndDelete(genresId);
      const listSeries = await findMultipleSeries(result._doc.series);
      listSeries.map(async (series: any) => {
        const listGenres: [] = (await series.genres()).filter(
          (genres: String) => genres === genresId
        );
        await Series.findByIdAndUpdate(series._id, {
          genres: listGenres,
        });
      });
      console.log(result);
      return true;
    } catch (error) {
      throw error;
    }
  },
  updateGenres: async ({ genresId, genresInput }: any) => {
    try {
      checkObject(genresInput, "genres");
      const result: any = await Genres.findByIdAndUpdate(
        genresId,
        genresInput,
        {
          returnDocument: "after",
        }
      );
      console.log(result);
      return transformGenres(result);
    } catch (error) {
      throw error;
    }
  },
};
