import styled from "styled-components";
import {motion} from "framer-motion";

const Wrapper = styled.div`
  
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0,0,0, 0), rgba(0,0,0,1)),url(${props => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  //margin-top: 20px;
  //margin-right: 20px;
  height: 40vh;
  h2 {
    font-size: 50px;
  }
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  margin-bottom: 5px;
  position: absolute;
  width: 100%;
`;

const RowTitle = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-left: 10px;
    font-size: 36px;
    transition-duration: 0.1s;
    &:hover {
      font-size: 40px;
    }
  }
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${props => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  color: red;
  font-size: 64px;
  cursor: pointer;
  width: 100%;
  max-width: 450px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 20px;
  background-color: ${props => props.theme.black.lighter};
  opacity: 0;
  color: white;
  position: absolute;
  width: 100%;
  max-width: 450px;
  
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 80vh;
  max-height: 650px;
  backgroundColor: red;
  top: 150px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${ props=> props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${props => props.theme.white.lighter};
  padding: 20px;
  font-size: 36px;
  position: relative;
  top: -80px;
`;
const BigInfos = styled.div`
  position: relative;
  top: -80px;
  display: flex;
  justify-content: space-between;
`;

const BigDiv = styled.div`
`;

const BigReleaseDate = styled.span`
  color: ${props => props.theme.white.lighter};
  margin-left: 20px;
  font-size: 12px;

`;
const BigRuntime = styled.span`
  color: ${props => props.theme.white.lighter};
  margin-left: 20px;
  font-size: 12px;

`;
const BigVotes = styled.span`
  margin-left: 20px;
  margin-right: 20px;
  font-size: 12px;
`;
const BigStatus = styled.span`
  color: ${props => props.theme.white.lighter};
  margin-left: 20px;
  font-size: 12px;

`;

const BigOverview = styled.p`
  color: ${props => props.theme.white.lighter};
  padding: 20px;
  position: relative;
  top: -80px;
  h3 {
    font-size: 25px;
  }
`;

export { Wrapper,RowTitle, Loader, Banner, Title, Overview, Slider, Row, Box, Info, Overlay, BigMovie, BigCover, BigTitle, BigInfos, BigDiv,BigStatus, BigReleaseDate, BigRuntime, BigVotes, BigOverview}