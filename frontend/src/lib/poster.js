export const getMoviePoster = (path, size = "w500") => {
    if (!path) {
        return "/placeholder-image.jpg"; // Use a local placeholder if no image is available
    }
    return `https://image.tmdb.org/t/p/${size}${path}`;
};
