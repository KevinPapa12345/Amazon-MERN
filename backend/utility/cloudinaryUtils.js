import cloudinary from "../config/cloudinary.js";

const folderExists = async (folderPath) => {
  const parts = folderPath.split("/");
  let currentPath = "";

  for (const part of parts) {
    const parentPath = currentPath;
    currentPath = parentPath ? `${parentPath}/${part}` : part;

    try {
      const { folders } = await cloudinary.api.sub_folders(parentPath);
      const found = folders.some((f) => f.name === part);
      if (!found) {
        return false;
      }
    } catch (err) {
      return false;
    }
  }
  return true;
};

export const deleteCloudinaryFolder = async (folderPath, options = {}) => {
  const { deleteResources = true } = options;

  try {
    const exists = await folderExists(folderPath);
    if (!exists) {
      console.log(`Folder "${folderPath}" does not exist. Skipping deletion.`);
      return;
    }

    if (deleteResources) {
      await cloudinary.api.delete_resources_by_prefix(folderPath);
    }

    await cloudinary.api.delete_folder(folderPath);
    console.log(`Deleted folder "${folderPath}" successfully.`);
  } catch (err) {
    console.error(`Failed to delete folder "${folderPath}":`, err);
  }
};
