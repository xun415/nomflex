import {useQuery} from "react-query";
import {IGetLatestMovieResult, IGetMoviesResult} from "../api/movie";
import {makeImagePath} from "../utils";
import { AnimatePresence} from "framer-motion";
import {useState} from "react";
import {useMatch, useNavigate} from "react-router-dom";
import {ETvSearchType, getTvShow, getTvShows, ITvShow} from "../api/tvShow";

import { Wrapper, Loader, Banner, Title,RowTitle, Overview, Slider, Row, Box, Info, Overlay, BigMovie, BigCover, BigTitle,BigStatus, BigInfos, BigDiv, BigReleaseDate, BigVotes, BigOverview }
from '../styles/common'
import {BsFillArrowRightCircleFill} from "react-icons/bs";

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

function Tv() {
    const navigate = useNavigate();
    const biTvMatch = useMatch(`${process.env.PUBLIC_URL}/tv/:tvId`);
    const [tvs, setTvs] = useState<movies[]>([])
    const [tvDetail, setTvDetail] = useState<ITvShow>();

    const {data: airingTodayTvData} = useQuery<IGetMoviesResult>(["tv","airingToday"], ()=>getTvShows(ETvSearchType.AIRING_TODAY),{
        onSuccess: data => {
            const idx = tvs.findIndex(item => item.type === 'airingToday');
            if (idx < 0) {
                setTvs(prevState => [{type: 'airingToday', data}, ...prevState])
            }
        }
    })

    const {data: latestTvData} = useQuery<IGetLatestMovieResult>(["tv","latest"], ()=>getTvShows(ETvSearchType.LATEST));

    useQuery<IGetMoviesResult>(["tv","topRated"], ()=>getTvShows(ETvSearchType.TOP_RATED),{
        onSuccess: data => {
            const idx = tvs.findIndex(item => item.type === 'topRated');
            if (idx < 0) {
                setTvs(prevState => [{type: 'topRated', data}, ...prevState])
            }
        }
    });
    useQuery<IGetMoviesResult>(["tv","popular"], ()=>getTvShows(ETvSearchType.POPULAR),{
        onSuccess: data => {
            const idx = tvs.findIndex(item => item.type === 'popular');
            if (idx < 0) {
                setTvs(prevState => [{type: 'popular', data}, ...prevState])
            }
        }
    });

    useQuery<ITvShow>(['tvDetail', biTvMatch?.params.tvId],()=> getTvShow(biTvMatch?.params.tvId!), {
        onSuccess: data => {
            console.log('detail: ', data)
            setTvDetail(data)
        },
        enabled: !!(biTvMatch?.params.tvId)
    });


    // 다음 페이지
    const showNext = (tvType: string) => {
        console.log('tvType', tvType)
        if (tvType === 'airingToday') {
            const totalMovies = tvs.find(item => item.type === 'airingToday')!.data.results.length-1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex(prev => prev === maxIndex ? 0: prev + 1)
        }
        if (tvType === 'topRated') {
            const totalMovies = tvs.find(item => item.type === 'topRated')!.data.results.length-1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setTopRatedIdx(prev => prev === maxIndex ? 0: prev + 1)
        }
        if (tvType === 'popular') {
            const totalMovies = tvs.find(item => item.type === 'popular')!.data.results.length-1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setPopularIdx(prev => prev === maxIndex ? 0: prev + 1)
        }
    }

    // 티비 타입별 인덱스
    const [popularIdx, setPopularIdx] = useState(0);
    const [topRatedIdx, setTopRatedIdx] = useState(0);
    const [index, setIndex] = useState(0); // nowAiring

    // 티비타입별 인덱스 구하기
    const getIdxByMovieType = (movieType: string) => {
        if (movieType === 'airingToday') {
            return index
        }
        if (movieType === 'topRated') {
            return topRatedIdx
        }
        if (movieType === 'popular') {
            return popularIdx
        }
        return 0
    }

    const [leaving, setLeaving] = useState(false);
    const toggleLeaving = () => setLeaving((prev) => !prev)

    const onBoxClick = (movieId:number) => {
        setTvDetail(undefined);
        navigate(`${process.env.PUBLIC_URL}/tv/${movieId}`)
    }
    const onOverlayClick = () => {
        navigate(`${process.env.PUBLIC_URL}/tv`)
    }



    return (
        <Wrapper>
            {tvs.length < 3 ? <Loader>Loading...</Loader>
                :
                <>
                    <Banner bgPhoto={makeImagePath(airingTodayTvData?.results[0].backdrop_path || "")}>
                        <Title>{airingTodayTvData?.results[0].title}</Title>
                        <Overview>{airingTodayTvData?.results[0].overview}</Overview>
                    </Banner>
                    {tvs.map(tvData =>
                        <Slider>
                            <AnimatePresence initial={false} >
                                <RowTitle>
                                    <h2>{tvData.type}</h2>
                                    {
                                        tvs.find(item => item.type === tvData.type)!.data.results.length-1 > offset &&
                                        <BsFillArrowRightCircleFill onClick={()=>showNext(tvData.type)} />
                                    }
                                </RowTitle>
                                <Row
                                    variants={rowVariants}
                                    initial={'hidden'}
                                    animate={'visible'}
                                    exit={'exit'}
                                    transition={{ type:'linear', duration: 1 }}
                                    key={tvData.type + getIdxByMovieType(tvData.type)}
                                >
                                    {
                                        tvData?.data.results.slice(1)?.slice(offset * (getIdxByMovieType(tvData.type)), offset * (getIdxByMovieType(tvData.type)) + offset).map(movie =>
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
                    {latestTvData &&
                        <Slider>
                            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
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
                                        layoutId={latestTvData.id+''}
                                        key={latestTvData.id}
                                        onClick={()=> onBoxClick(Number(latestTvData.id))}
                                        variants={boxVariant}
                                        whileHover={'hover'}
                                        initial={'normal'}
                                        transition={{ type: "tween" }}
                                        bgPhoto={makeImagePath(latestTvData?.backdrop_path, "w500")}
                                    >

                                        <Info variants={infoVariants} >
                                            <h4>{latestTvData?.title}</h4>
                                        </Info>
                                    </Box>

                                </Row>
                            </AnimatePresence>
                        </Slider>
                    }


                    <AnimatePresence>
                        {
                            biTvMatch ?
                                <>
                                    <Overlay
                                        onClick={onOverlayClick}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                    <BigMovie
                                        layoutId={biTvMatch.params.tvId}
                                    >
                                        {tvDetail &&
                                            <>
                                                <BigCover
                                                    style={{ backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(tvDetail.backdrop_path, 'w500')})` }} />
                                                <BigTitle>{tvDetail.name}</BigTitle>
                                                <BigInfos>
                                                    <BigDiv>
                                                        <BigReleaseDate>{tvDetail.last_air_date}</BigReleaseDate>
                                                        <BigStatus>status : {tvDetail.status +' minutes' || 'no information' }</BigStatus>
                                                    </BigDiv>
                                                    <BigDiv>
                                                        <BigVotes>votes: {tvDetail.vote_count} average : {tvDetail.vote_average + '/ 10'}</BigVotes>
                                                    </BigDiv>
                                                </BigInfos>
                                                <BigOverview>
                                                    <h3>Summary</h3>
                                                    {tvDetail.overview}
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

export default Tv