import mongoose, { Schema } from "mongoose";

const genresSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  series: [
    {
      type: Schema.Types.ObjectId,
      ref: "Series",
    },
  ],
});

export default mongoose.model("Genres", genresSchema);
