import React from 'react';
import Hero from '../components/Hero';
import DataCategories from '../components/DataCategories';
import FeaturedProviders from '../components/FeaturedProviders';
import DataServices from '../components/DataServices';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';

const Home = () => {
  return (
    <>
      <Hero />
      <DataCategories />
      <FeaturedProviders />
      <DataServices />
      <Testimonials />
      <CallToAction />
    </>
  );
};

export default Home;