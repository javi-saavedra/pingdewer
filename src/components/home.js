import React from 'react';
import NavBar from './navbar';
import { useGlobalState } from '../state';
import MyMap from './locations/myMap';

function Home() {
  const [ signedIn ] = useGlobalState('signedIn');

  return (
    <div>
      <NavBar />
      {signedIn &&
        <MyMap/>
      }
    </div>
  );
} 

export default Home;