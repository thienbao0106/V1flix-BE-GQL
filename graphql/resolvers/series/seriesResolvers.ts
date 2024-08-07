import Genres from "../../../models/genres";
import Image from "../../../models/image";
import Series from "../../../models/series";
import User from "../../../models/user";
import Tags from "../../../models/tags";
import { checkObject, paginateResult } from "../../utils/index";
import {
  addSeriesImages,
  findSeries,
  transformSeries,
} from "../../utils/series";
import { getALShow } from "../../utils/anilist";
import { formatString } from "../../utils/string";
import { addSeriesToTag, getTagsId } from "../../utils/tags";
import { addSeriesToGenres, getGenresId } from "../../utils/genres";
import { favoriteSeries } from "./favoriteSeries";
import { ratings } from "./ratings";
import { relations } from "./relations";
import { reviews } from "./reviews";
import { trailers } from "./trailers";
import { seriesImages } from "./seriesImages";
import { views } from "./views";

export const seriesResolvers = {
  series: async ({ pageNumber, limitPerPage, amount }: any) => {
    try {
      const { result, totalPage } = await paginateResult(
        Series,
        pageNumber,
        limitPerPage,
        amount
      );

      return {
        currentPage: pageNumber + 1,
        totalPage,
        series: result.map((series: any) => {
          return transformSeries(series);
        }),
      };
    } catch (error) {
      throw error;
    }
  },
  findSeries: async ({ title, numOfLimit, genresId, status }: any) => {
    try {
      const isGenres = genresId !== "" &&
        genresId && {
          genres: {
            $elemMatch: {
              $eq: genresId,
            },
          },
        };

      const isStatus = status !== "" &&
        status && {
          status,
        };
      const result = await Series.find({
        "title.main_title": {
          $regex: title,
          $options: "i",
        },
        ...isGenres,
        ...isStatus,
      }).limit(numOfLimit);

      if (result.length > 0) {
        return result.map((series: any) => {
          return transformSeries(series);
        });
      }

      return [];
    } catch (error) {
      throw error;
    }
  },
  createSeries: async (args: any, req: any) => {
    try {
      // if (!req.isAuth) throw new Error("Unauthenticated");
      const date = Date.parse(new Date().toLocaleString());
      const {
        main_title,
        alt_title,
        description,
        total_episodes,
        type,
        season,
        status,
        duration,
      } = args.seriesInput;
      const series = new Series({
        title: {
          main_title,
          alt_title,
        },
        description,
        total_episodes,
        type,
        season,
        status,
        view: 0,
        duration,
        created_at: date,
        updated_at: date,
        favors: 0,
      });
      const result: any = await series.save();
      return transformSeries(result);
    } catch (error) {
      throw error;
    }
  },
  updateSeries: async ({ seriesInput, seriesId }: any) => {
    checkObject(seriesInput, "series");
    const updatedDate = Date.parse(new Date().toLocaleString());

    try {
      const result = await Series.findByIdAndUpdate(
        seriesId,
        { ...seriesInput, updated_at: updatedDate },
        {
          returnDocument: "after",
        }
      );
      return transformSeries(result);
    } catch (error) {
      throw error;
    }
  },
  deleteSeries: async ({ seriesId }: any) => {
    try {
      const result: any = await Series.findByIdAndDelete(seriesId);
      result.images.map(async (imageId: String) => {
        await Image.findByIdAndDelete(imageId);
        return;
      });

      //To-do: Upgrade this block of code
      Genres.updateMany(
        { series: seriesId },
        {
          $pull: { series: seriesId },
        }
      );

      Tags.updateMany(
        { series: seriesId },
        {
          $pull: { series: seriesId },
        }
      );

      const listUser: any = await User.find({ series: seriesId });
      if (listUser.length > 0) {
        listUser.map((list: any) => {
          list.series = [...list.series].filter(
            (id: String) => id === seriesId
          );
          list.save();
        });
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  randomSeries: async () => {
    try {
      const series: any = await Series.aggregate([
        {
          $sample: {
            size: 1,
          },
        },
      ]);

      return transformSeries(series[0]);
    } catch (error) {
      throw error;
    }
  },
  findSeriesByIds: async ({ listSeries }: any) => {
    try {
      return listSeries.map((seriesId: string) => {
        return findSeries(seriesId);
      });
    } catch (error) {
      throw error;
    }
  },
  findSeriesByName: async ({ seriesTitle, isRelation }: any) => {
    try {
      const result = await Series.findOne({
        "title.main_title": seriesTitle,
      });
      if (!result) throw new Error("Can't find this series!");
      return transformSeries(result, isRelation);
    } catch (error) {
      throw error;
    }
  },

  addSeriesByAnilist: async ({ id }: any) => {
    try {
      const date = Date.parse(new Date().toLocaleString());
      const alSeries: any = await getALShow(id);
      const {
        title,
        description,
        episodes,
        format,
        seasonYear,
        season,
        status,
        duration,
        trailer,
        tags,
        genres,
      } = alSeries.Media;
      const tagsArr = await getTagsId(tags);
      const genresArr = await getGenresId(genres);

      const series = new Series({
        title: {
          main_title: title.romaji.replace(/"/g, ""),
          alt_title: title.english.replace(/"/g, ""),
        },
        description,
        total_episodes: episodes || 0,
        type: format,
        season: `${formatString(season)} ${seasonYear}`,
        status: formatString(status === "FINISHED" ? "completed" : status),
        view: 0,
        duration: duration || 0,
        created_at: date,
        updated_at: date,
        favors: 0,
        genres: genresArr,
        tags: tagsArr,
        trailer: [],
      });
      const result: any = await series.save();

      const imagesIds: any = await addSeriesImages(
        result.title.main_title,
        result._id,
        id
      );

      await Series.findByIdAndUpdate(result._id, {
        $push: {
          trailer: {
            idTrailer: trailer.id,
            thumbnail: `https://i.ytimg.com/vi/${trailer.id}/hqdefault.jpg`,
            site: "youtube",
          },
          images: imagesIds,
        },
      });
      addSeriesToTag(tagsArr, result._id);
      addSeriesToGenres(genresArr, result._id);
      return transformSeries(result);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  ...favoriteSeries,
  ...ratings,
  ...relations,
  ...reviews,
  ...trailers,
  ...seriesImages,
  ...views,
};
