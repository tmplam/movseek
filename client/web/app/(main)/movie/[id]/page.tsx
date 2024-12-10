'use client';

import { useParams } from 'next/navigation';
import { TMDB_API } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { fetchMovieCredits, fetchMovieDetail, fetchMovieKeywords } from '@/apis/movie';
import type { Movie, Credits, Keyword } from '@/models/movie-detail-types';
import { pickMovieFields, handleMovieCredits } from '@/utils/util-functions/detail-page';
import { Button } from '@/components/ui/button';
import MainMovieInformation from '@/components/movie/main-movie-information';
import CastList from '@/components/movie/cast-list';
import AltMovieInformation from '@/components/movie/alt-movie-information';
import MainMovieInformationDummy from '@/components/movie/main-movie-information-dummy';

const MovieDetail = () => {
  const params = useParams();
  const { id } = params;
  const [imageSrc, setImageSrc] = useState('/poster-default.svg');
  const [transitioning, setTransitioning] = useState(false);
  const [transitioningCast, setTransitioningCast] = useState(false);
  const [idMovie, setIdMovie] = useState<number>(0);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [creadits, setCredits] = useState<Credits | null>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDisplayFullCastAndCrew, setIsDisplayFullCastAndCrew] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      const numericId = +id;
      setIdMovie(numericId);
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const movieResponse = await fetchMovieDetail(idMovie);
        const data = pickMovieFields(movieResponse.data);
        setImageSrc(TMDB_API.POSTER(data.poster_path));
        setMovie(data);

        const creditsResponse = await fetchMovieCredits(idMovie);
        setCredits(handleMovieCredits(creditsResponse.data));

        const keywordsResponde = await fetchMovieKeywords(idMovie);
        setKeywords(keywordsResponde.data.keywords);
      } catch (err) {
        setError('Failed to fetch movie detail');
        console.log(err);
      } finally {
        setTransitioning(true);
        setTimeout(() => {
          setLoading(false);
          setTransitioning(false);
        }, 500);
      }
    };

    if (idMovie > 0) {
      fetchData();
    }
  }, [idMovie]);

  const handleModeChange = (mode: boolean) => {
    if (mode !== isDisplayFullCastAndCrew) {
      setTransitioningCast(true);
      setTimeout(() => {
        setIsDisplayFullCastAndCrew(mode);
        setTransitioningCast(false);
      }, 300);
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className={`relative transition-opacity duration-500 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
      {movie !== null && creadits != null && !loading && imageSrc != '/poster-default.svg' ? (
        <div className="font-geist-mono">
          <MainMovieInformation movie={movie} creadits={creadits} />

          <div className="flex gap-6 container mx-auto mt-5 py-10 min-h-screen">
            <div
              className={`relative w-4/5 transition-opacity duration-300 ${
                transitioningCast ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {creadits.cast.length >= 6 && (
                <div className="flex justify-between">
                  {!isDisplayFullCastAndCrew && <h2 className="text-2xl font-bold mb-4">Top Billed Cast</h2>}
                  <div></div>
                  <Button
                    onClick={() => handleModeChange(!isDisplayFullCastAndCrew)}
                    className="text-xl border border-gray-400"
                    variant="outline"
                  >
                    {isDisplayFullCastAndCrew ? 'View less' : 'View Full Cast & Crew'}
                  </Button>
                </div>
              )}
              <CastList credits={creadits} isfull={isDisplayFullCastAndCrew} />
            </div>
            <div className="w-1/5">
              <AltMovieInformation movie={movie} keywords={keywords} />
            </div>
          </div>
        </div>
      ) : (
        <MainMovieInformationDummy />
      )}
    </div>
  );
};

export default MovieDetail;