import fetch from "node-fetch";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;

export const fetchFromTMDB = async (endpoint, queryParams = {}) => {
    const url = new URL(`${TMDB_BASE_URL}/${endpoint}`);

    //some query requests still need api_key so this appends api_key at the end of query
    queryParams.api_key = TMDB_API_KEY;
    Object.keys(queryParams).forEach((key) => url.searchParams.append(key, queryParams[key]));

    try{
        //Bearer tokens are more secure than api_key coz api_key can be exposed in inspect network or something idk
        const options = {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${TMDB_BEARER_TOKEN}`
            }
        };

        const response = await fetch(url,options);

        if(response.status === 404){
            return { status_code: 34};
        }

        if(!response.ok) throw new Error(`TMDB API Error: ${response.statusText}`);

        return await response.json();
    } catch(error){
        console.error("Error fetching from TMDB", error.message);
        res.status(500).json({message:"Internal Server Error"});
        return null;
    }
}

export const testTMDB = async () => {
    try{
        const testResponse = await fetchFromTMDB("movie/popular");

        if(testResponse && testResponse.results){
            console.log("TMDB API Connected successfully");
        } else{
            console.log("TMDB API response format unexpected: ", testResponse);
        }
    } catch(error){
        console.error("TMDB connection failed:", error.message);
    }
}