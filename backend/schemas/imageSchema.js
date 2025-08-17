export const imageSchema = {
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  originalName: { type: String },
  size: { type: Number },
};
