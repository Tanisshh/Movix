import { useState, useEffect } from 'react'
import {fetchDataFromApi} from './utils/api'
import { Route, BrowserRouter, Routes } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux'
import { getApiConfiguration, getGenres } from './store/homeSlice';

import Headers from './components/headers/Header';
import PageNotFound from './pages/404/PageNotFound';
import Details from './pages/details/Details';
import Explore from './pages/explore/Explore';
import Home from './pages/home/Home';
import SearchReasult from './pages/searchReasult/SearchReasult';
import Footer from './components/footers/Footer';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    fetchApiConfig();
    genresCall()
  }, []); 


  const fetchApiConfig = () => {
    fetchDataFromApi("/configuration").then((res) => {
      console.log(res);
      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      }
      dispatch(getApiConfiguration(url));
    })
  }


  const genresCall = async () => {
    let promises = [];
    let endPoints = ["tv", "movie"];
    let allGenres = {};

    endPoints.forEach((url) => {
        promises.push(fetchDataFromApi(`/genre/${url}/list`));
    });

    const data = await Promise.all(promises);
    data.map(({genres}) => {
      return genres.map((item) => (allGenres[item.id]=item))
    })

    console.log(allGenres);
    dispatch(getGenres(allGenres));
  };

  return (
    <BrowserRouter>
      <Headers />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/:mediaType/:id' element={<Details />} />
        <Route path='/search/:query' element={<SearchReasult />} />
        <Route path='/explore/:mediaType' element={<Explore />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
