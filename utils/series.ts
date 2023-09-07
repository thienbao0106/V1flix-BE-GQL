import Series from "../models/series";
import { findImages } from "./images";

export const findSeries = async (seriesId: string): Promise<any> => {
  try {
    const result: any = await Series.findById(seriesId);
    return {
      ...result._doc,
      _id: result.id,
      images: findImages.bind(this, result.images),
    };
  } catch (err: any) {
    throw err;
  }
};

export const findMultipleSeries = async (seriesId: []): Promise<any> => {
  try {
    const result: any = await Series.find({ _id: { $in: seriesId } });
    return result.map((series: any) => {
      return {
        ...series._doc,
        _id: series.id,
        images: findImages.bind(this, series.images),
      };
    });
  } catch (err: any) {
    throw err;
  }
};
