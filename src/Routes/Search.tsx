import {useLocation} from "react-router-dom";
import {useQuery} from "react-query";
import {getMovie, IMovie} from "../api/movie";
import {makeImagePath} from "../utils";
import { AnimatePresence} from "framer-motion";
import {useState} from "react";
import {useMatch, useNavigate} from "react-router-dom";
import {IMovieSearched, ISearchResult, ITvSearched, searchMovies, searchTvs} from "../api/search";
import {getTvShow, ITvShow} from "../api/tvShow";

//styles
import {
    Wrapper,
    Loader,
    Banner,
    Title,
    Overview,
    Slider,
    Row,
    Box,
    Info,
    Overlay,
    BigMovie,
    BigCover,
    BigTitle,
    BigInfos,
    BigDiv,
    BigVotes,
    BigOverview,
    RowTitle
} from "../styles/common";
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

function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword")

    const navigate = useNavigate();
    const bigMovieMatch = useMatch('/search/movie/:id');
    const bigTvMatch = useMatch('/search/tv/:id')

    const [searchDetail, setSearchDetail] = useState<IMovie | ITvShow>();

    // 영화검색 결과
    const {data: searchedMovieData, isLoading: isSearchedMovieLoading} = useQuery<ISearchResult<IMovieSearched>>(["search","movie"], ()=>searchMovies(keyword!))

    // 티비검색 결과
    const {data: searchedTvData, isLoading: isSearchedTvLoading} = useQuery<ISearchResult<ITvSearched>>(["search","tv"], ()=>searchTvs(keyword!))

    // 영화 상세 조회
    useQuery<IMovie>(['movieDetail', bigMovieMatch?.params.id],()=> getMovie(bigMovieMatch?.params.id!), {
        onSuccess: data => {
            setSearchDetail(data)
        },
        enabled: !!(bigMovieMatch?.params.id)
    });

    // 티비 상세 조회
    useQuery<ITvShow>(['tvDetail', bigTvMatch?.params.id],()=> getTvShow(bigTvMatch?.params.id!), {
        onSuccess: data => {
            setSearchDetail(data)
        },
        enabled: !!(bigTvMatch?.params.id)
    });

    // 티비인덱스
    const [tvIndex, setTvIndex] = useState(0);
    const increaseTvIndex = () => {
        if (searchedTvData) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = searchedTvData.results.length - 1; // 1개 영화는 Banner에 사용
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setTvIndex(prev => prev === maxIndex ? 0: prev + 1);
        }
    }

    // 영화인덱스
    const [index, setIndex] = useState(0);
    const increaseIndex = () => {
        if (searchedMovieData) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = searchedMovieData.results.length - 1; // 1개 영화는 Banner에 사용
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex(prev => prev === maxIndex ? 0: prev + 1);
        }
    }

    // 인덱스 이동중 제어 변수
    const [leaving, setLeaving] = useState(false);
    const toggleLeaving = () => setLeaving((prev) => !prev)

    // 상세보기
    const onBoxClick = (searchType: 'movie' | 'tv', searchId:number) => {
        setSearchDetail(undefined);
        if (searchType === 'movie') {
            navigate(`${process.env.PUBLIC_URL}/search/movie/${searchId}?keyword=${keyword}`)
        }
        else if (searchType === 'tv'){
            navigate(`${process.env.PUBLIC_URL}/search/tv/${searchId}?keyword=${keyword}`)
        }

    }

    // 오버레이 클릭시
    const onOverlayClick = () => {
        navigate(`${process.env.PUBLIC_URL}/search?keyword=${keyword}`)
    }

    return (
        <Wrapper>
            {isSearchedMovieLoading  || isSearchedTvLoading? <Loader>Loading...</Loader>
                :
                <>
                    <Banner onClick={increaseIndex} bgPhoto={makeImagePath(searchedMovieData?.results[0].backdrop_path || "")}>
                        <Title>{searchedMovieData?.results[0].title}</Title>
                        <Overview>{searchedMovieData?.results[0].overview}</Overview>
                    </Banner>

                        <Slider>
                            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                                <RowTitle>
                                    <h2>Here are Movies we found...</h2>
                                    {
                                        searchedMovieData!.results.length > offset &&
                                        <BsFillArrowRightCircleFill onClick={increaseIndex} />
                                    }
                                </RowTitle>
                                <Row
                                    variants={rowVariants}
                                    initial={'hidden'}
                                    animate={'visible'}
                                    exit={'exit'}
                                    transition={{ type:'linear', duration: 1 }}
                                    key={index}
                                >
                                    {
                                        searchedMovieData?.results.slice(1)?.slice(offset * index, offset * index + offset).map(movie =>
                                            <Box
                                                layoutId={movie.id+''}
                                                key={movie.id}
                                                onClick={()=> onBoxClick('movie', movie.id)}
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
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <RowTitle>
                                <h2>Here are TV shows we found...</h2>
                                {
                                    searchedTvData!.results.length > offset &&
                                    <BsFillArrowRightCircleFill onClick={increaseTvIndex} />
                                }
                            </RowTitle>
                            <Row
                                variants={rowVariants}
                                initial={'hidden'}
                                animate={'visible'}
                                exit={'exit'}
                                transition={{ type:'linear', duration: 1 }}
                                key={tvIndex}
                            >
                                {
                                    searchedTvData?.results.slice(1)?.slice(offset * tvIndex, offset * tvIndex + offset).map(tvShow =>
                                        <Box
                                            layoutId={tvShow.id+''}
                                            key={tvShow.id}
                                            onClick={()=> onBoxClick('tv', tvShow.id)}
                                            variants={boxVariant}
                                            whileHover={'hover'}
                                            initial={'normal'}
                                            transition={{ type: "tween" }}
                                            bgPhoto={makeImagePath(tvShow.backdrop_path, "w500")}
                                        >

                                            <Info variants={infoVariants} >
                                                <h4>{tvShow.name}</h4>
                                            </Info>
                                        </Box>)
                                }
                            </Row>
                        </AnimatePresence>
                    </Slider>



                    <AnimatePresence>
                        {
                            bigMovieMatch || bigTvMatch ?
                                <>
                                    <Overlay
                                        onClick={onOverlayClick}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                    <BigMovie
                                        layoutId={bigMovieMatch?.params.id || bigTvMatch?.params.id}
                                    >
                                        {searchDetail &&
                                            <>
                                                <BigCover
                                                    style={{ backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(searchDetail.backdrop_path, 'w500')})` }} />
                                                <BigTitle>{"title" in searchDetail && searchDetail.title || "name" in searchDetail && searchDetail.name }</BigTitle>
                                                <BigInfos>
                                                    <BigDiv>
                                                        <BigVotes>votes: {searchDetail.vote_count} average : {searchDetail.vote_average + '/ 10'}</BigVotes>
                                                    </BigDiv>
                                                </BigInfos>
                                                <BigOverview>
                                                    <h3>Summary</h3>
                                                    {searchDetail.overview}
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

export default Search