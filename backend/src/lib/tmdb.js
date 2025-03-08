import fetch from "node-fetch";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;

export const fetchFromTMDB = async (endpoint, queryParams = {}, retries = 3, delay = 1000) => {
    const url = new URL(`${TMDB_BASE_URL}/${endpoint}`);

    if (!TMDB_BEARER_TOKEN) {
        queryParams.api_key = TMDB_API_KEY;
    }

    Object.keys(queryParams).forEach((key) => url.searchParams.append(key, queryParams[key]));

    const options = {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${TMDB_BEARER_TOKEN}`
        }
    };

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            console.log(`Fetching from TMDB (Attempt ${attempt + 1}):`, url.toString());

            const response = await fetch(url, options);
            const data = await response.json();

            if (!response.ok) {
                console.error("TMDB API Error:", data);
                return null;
            }

            if (data.status_code === 34) {
                return { status_code: 34 };
            }

            return data;
        } catch (error) {
            console.error(`Error fetching from TMDB (Attempt ${attempt + 1}):`, error.message);
            if (attempt < retries - 1) {
                await new Promise((res) => setTimeout(res, delay * (attempt + 1))); // Exponential backoff
            } else {
                console.error("TMDB request failed after retries.");
                return null;
            }
        }
    }
};

export const testTMDB = async () => {
    try{
        const testResponse = await fetchFromTMDB("movie/550");

        if(testResponse){
            console.log("TMDB API Connected successfully");
        } else{
            console.log("TMDB API response format unexpected: ", testResponse);
        }
    } catch(error){
        console.error("TMDB connection failed:", error.message);
    }
}