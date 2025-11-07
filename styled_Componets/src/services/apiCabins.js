import supabase, { supabaseUrl } from "./supabase";

// supabase
export const getCabins = async () => {
    let { data, error } = await supabase.from("cabins").select("*");
    if (error) {
        console.error(error);

        throw new Error("cabins could not be loaded");
    }

    return data;
};



export const deleteCabins = async (id, msg = '') => {
    if (!id) {
        throw new Error("No cabin id provided for deletion");
    }

    const { data, error } = await supabase.from('cabins').delete().eq('id', id);
    if (error) {
        console.log(error);
        throw new Error(msg === '' ? "cabins could not be deleted" : msg);
    }
    return data;
};


export const createEditCabins = async (newCabinData, id) => {
    // Defensive checks
    if (!newCabinData) {
        throw new Error("No cabin data provided");
    }

    // Determine image type:
    const imageValue = newCabinData.image;
    const isImageUrl = typeof imageValue === "string" && imageValue.startsWith?.(supabaseUrl);
    const isFile = imageValue && typeof imageValue !== "string" && imageValue.name; // file-like

    // If you require an image, uncomment this:
    // if (!isImageUrl && !isFile) throw new Error("Image required: either upload a file or provide a stored URL");

    // compute image name only if uploading a File
    const imageName = isFile
        ? `${Math.random().toString(36).slice(2)}-${imageValue.name}`.replaceAll("/", "")
        : null;

    const imagePath = isImageUrl
        ? imageValue
        : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

    try {
        // Insert or update DB row first so we have an id to rollback if upload fails
        let res;
        if (!id) {
            res = await supabase
                .from("cabins")
                .insert([{ ...newCabinData, image: imagePath }])
                .select()
                .single();
        } else {
            res = await supabase
                .from("cabins")
                .update({ ...newCabinData, image: imagePath })
                .eq("id", id)
                .select()
                .single();
        }

        const { data, error } = res;
        if (error) {
            console.error("supabase insert/update error:", error);
            throw new Error("Cabin could not be saved to DB");
        }

        // If image is already a hosted URL, we're done
        if (isImageUrl) return data;

        // If there's no file to upload, return — nothing more to do
        if (!isFile) return data;

        // Upload file to storage
        const { error: storageError } = await supabase.storage
            .from("cabin-images")
            .upload(imageName, imageValue);

        if (storageError) {
            console.error("storage upload failed:", storageError);
            // rollback DB row we just created/updated (for create we remove, for edit you may want to restore previous image)
            try {
                const dt = await deleteCabins(data.id);
                console.log(dt)
            } catch (rbErr) {
                console.error("rollback failed:", rbErr);
            }
            throw new Error("File upload failed after saving DB row");
        }

        // success
        return data;
    } catch (err) {
        console.error("createEditCabins failed:", err);
        throw err;
    }
};

