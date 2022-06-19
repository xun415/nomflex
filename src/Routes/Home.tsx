import {useQuery} from "react-query";
import {getMovie, getMovies, IGetLatestMovieResult, IGetMoviesResult, IMovie, movieSearchType} from "../api/movie";
import {makeImagePath} from "../utils";
import { AnimatePresence} from "framer-motion";
import {useState} from "react";
import {useMatch, useNavigate} from "react-router-dom";
import { Wrapper, Loader, Banner,RowTitle, Title, Overview, Slider, Row, Box, Info, Overlay, BigMovie, BigCover, BigTitle, BigRuntime, BigInfos, BigDiv, BigReleaseDate, BigVotes, BigOverview }
    from '../styles/common'

import { BsFillArrowRightCircleFill } from "react-icons/bs";

const rowVariants = {
    hidden : {
        x: window.outerWidth + 5,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth - 5,
    }
}
const boxVariant = {
    normal: {
        scale: 1,
        transition: {
            type: "tween"
        }
    },
    hover: {
        scale: 1.3,
        y: -50,
        transition: {
            delay: 0.5,
            duration: 0.3,
            type: "tween"
        }
    }
}

const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,
            duration: 0.3,
            type: "tween"
        }
    }
}

const offset = 6;

interface movies {
    type: string;
    data: IGetMoviesResult;
}

function Home() {
    const navigate = useNavigate();
    const bigMovieMatch = useMatch('/movies/:movieId');
    const [movies, setMovies] = useState<movies[]>([])
    const [movieDetail, setMovieDetail] = useState<IMovie>();

    // 현재상영중
    const {data: nowPlayingMovieData} = useQuery<IGetMoviesResult>(["movies","nowPlaying"], ()=>getMovies(movieSearchType.NOW_PLAYING),{
        onSuccess: data => {
            const idx = movies.findIndex(item => item.type === 'nowPlaying');
            if (idx < 0) {
                setMovies(prevState => [{type: 'nowPlaying', data}, ...prevState])
            }
        }
    })
    // 최신영화
    const {data: latestMovieData} = useQuery<IGetLatestMovieResult>(["movies","latest"], ()=>getMovies(movieSearchType.LATEST));

    // 탑 영화
    useQuery<IGetMoviesResult>(["movies","topRated"], ()=>getMovies(movieSearchType.TOP_RATED),{
        onSuccess: data => {
            const idx = movies.findIndex(item => item.type === 'topRated');
            if (idx < 0) {
                setMovies(prevState => [{type: 'topRated', data}, ...prevState])
            }
        }
    });

    // 개봉예정
    useQuery<IGetMoviesResult>(["movies","upcoming"], ()=>getMovies(movieSearchType.UPCOMING),{
        onSuccess: data => {
            const idx = movies.findIndex(item => item.type === 'upcoming');
            if (idx < 0) {
                setMovies(prevState => [{type: 'upcoming', data}, ...prevState])
            }
        }
    });

    // 영화 상세
    useQuery<IMovie>(['movieDetail', bigMovieMatch?.params.movieId],()=> getMovie(bigMovieMatch?.params.movieId!), {
        onSuccess: data => {
            setMovieDetail(data)
        },
        enabled: !!(bigMovieMatch?.params.movieId)
    });

    // 다음 페이지
    const showNext = (movieType: string) => {
        if (movieType === 'upcoming') {
            const totalMovies = movies.find(item => item.type === 'upcoming')!.data.results.length-1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setUpcomingIdx(prev => prev === maxIndex ? 0: prev + 1)
        }
        if (movieType === 'topRated') {
            const totalMovies = movies.find(item => item.type === 'topRated')!.data.results.length-1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex(prev => prev === maxIndex ? 0: prev + 1)
        }
        if (movieType === 'nowPlaying') {
            const totalMovies = movies.find(item => item.type === 'nowPlaying')!.data.results.length-1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setNowPlayingIdx(prev => prev === maxIndex ? 0: prev + 1)
        }
    }

    // 영화타입별 인덱스
    const [upcomingIdx, setUpcomingIdx] = useState(0);
    const [nowPlayingIdx, setNowPlayingIdx] = useState(0);
    const [index, setIndex] = useState(0);

    // 영화타입별 인덱스 구하기
    const getIdxByMovieType = (movieType: string) => {
        if (movieType === 'upcoming') {
            return upcomingIdx
        }
        if (movieType === 'topRated') {
            return index
        }
        if (movieType === 'nowPlaying') {
            return  nowPlayingIdx
        }
        return 0
    }

    // 애니메이션 진행중 조작 변수
    const [leaving, setLeaving] = useState(false);
    const toggleLeaving = () => setLeaving((prev) => !prev)

    // 영화 상세 보기
    const onBoxClick = (movieId:number) => {
        setMovieDetail(undefined);
        navigate(`${process.env.PUBLIC_URL}/movies/${movieId}`)
    }


    const onOverlayClick = () => {
        navigate(`${process.env.PUBLIC_URL}/`)
    }




    return (
        <Wrapper>
            {movies.length < 3 ? <Loader>Loading...</Loader>
                :
                <>
                    <Banner bgPhoto={makeImagePath(nowPlayingMovieData?.results[0].backdrop_path || "")}>
                        <Title>{nowPlayingMovieData?.results[0].title}</Title>
                        <Overview>{nowPlayingMovieData?.results[0].overview}</Overview>
                    </Banner>

                    {/*  */}
                    {movies.map(movieData =>
                        <Slider>
                            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                                <RowTitle>
                                    <h2>{movieData.type} </h2>
                                    {
                                        movies.find(item => item.type === movieData.type)!.data.results.length-1 > offset &&
                                        <BsFillArrowRightCircleFill onClick={()=>showNext(movieData.type)} />
                                    }
                                </RowTitle>
                                <Row
                                    variants={rowVariants}
                                    initial={'hidden'}
                                    animate={'visible'}
                                    exit={'exit'}
                                    transition={{ type:'linear', duration: 1 }}
                                    key={movieData.type + getIdxByMovieType(movieData.type)}
                                >
                                    {
                                        movieData?.data.results.slice(1)?.slice(offset * (getIdxByMovieType(movieData.type)), offset * getIdxByMovieType(movieData.type) + offset).map(movie =>
                                        <Box
                                            layoutId={movie.id+''}
                                            key={movie.id}
                                            onClick={()=> onBoxClick(movie.id)}
                                            variants={boxVariant}
                                            whileHover={'hover'}
                                            initial={'normal'}
                                            transition={{ type: "tween" }}
                                            bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                                        >

                                            <Info variants={infoVariants} >
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>)
                                    }
                                </Row>
                            </AnimatePresence>
                        </Slider>
                    )}
                    {/* latest */}
                    {latestMovieData &&
                        <Slider>
                            <AnimatePresence initial={false} >
                                <h2>Latest Movie</h2>
                                <Row
                                    variants={rowVariants}
                                    initial={'hidden'}
                                    animate={'visible'}
                                    exit={'exit'}
                                    transition={{ type:'linear', duration: 1 }}
                                    key={'latest'}
                                >

                                    <Box
                                        layoutId={latestMovieData.id+''}
                                        key={latestMovieData.id}
                                        onClick={()=> onBoxClick(Number(latestMovieData.id))}
                                        variants={boxVariant}
                                        whileHover={'hover'}
                                        initial={'normal'}
                                        transition={{ type: "tween" }}
                                        bgPhoto={makeImagePath(latestMovieData?.backdrop_path, "w500")}
                                    >

                                        <Info variants={infoVariants} >
                                            <h4>{latestMovieData?.title}</h4>
                                        </Info>
                                    </Box>

                                </Row>
                            </AnimatePresence>
                        </Slider>
                    }


                    <AnimatePresence>
                        {
                            bigMovieMatch ?
                                <>
                                    <Overlay
                                        onClick={onOverlayClick}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                    <BigMovie
                                        layoutId={bigMovieMatch.params.movieId}
                                        >
                                        {movieDetail &&
                                        <>
                                            <BigCover
                                                style={{ backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(movieDetail.backdrop_path, 'w500')})` }} />
                                            <BigTitle>{movieDetail.title}</BigTitle>
                                            <BigInfos>
                                                <BigDiv>
                                                    <BigReleaseDate>{movieDetail.release_date}</BigReleaseDate>
                                                    <BigRuntime>runtime : {movieDetail.runtime +' minutes' || 'no information' }</BigRuntime>
                                                </BigDiv>
                                                <BigDiv>
                                                    <BigVotes>votes: {movieDetail.vote_count} average : {movieDetail.vote_average + '/ 10'}</BigVotes>
                                                </BigDiv>
                                            </BigInfos>
                                            <BigOverview>
                                                <h3>Summary</h3>
                                                {movieDetail.overview}
                                            </BigOverview>

                                        </>
                                        }

                                    </BigMovie>
                                </>
                                :
                                null
                        }

                    </AnimatePresence>
                </>
            }
        </Wrapper>
    );
}

export default Home