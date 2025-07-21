import express from 'express';
import router from "./routes/router.js";
import { DBConnection } from './database/db.js';
import dotenv from 'dotenv';
import cors from "cors";

const app = express();


dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const allowedOrigins = [
    "https://online-judge-fj7y.vercel.app",
    "https://movie-flix-app-lac.vercel.app",
    "https://movie-flix-app-sumanths-projects-952cfa2b.vercel.app",
    "https://movie-flix-app-git-master-sumanths-projects-952cfa2b.vercel.app",
    "https://online-judge-fj7y-git-main-sumanths-projects-952cfa2b.vercel.app",
    "https://online-judge-fj7y-4q598qt6e-sumanths-projects-952cfa2b.vercel.app",
];
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Trending movies (weekly)
app.get('/api/trending', async (req, res) => {
  const { page = 1 } = req.query;
  try {
    const response = await axios.get(`${BASE_URL}/trending/all/week`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        page
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching trending movies:', error.message);
    res.status(500).json({ error: 'Failed to fetch trending movies' });
  }
});


app.get('/api/movie/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/movie/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching movie details:', error.message);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});


app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        optionsSuccessStatus: 200,
    })
);




app.use("/", router);


DBConnection();


const PORT =8001;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
