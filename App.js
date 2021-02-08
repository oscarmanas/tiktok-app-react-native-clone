/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';
import 'react-native-gesture-handler';
import Navigation from './src/navigation'

import  {withAuthenticator} from 'aws-amplify-react-native';

import {Auth, API, graphqlOperation} from 'aws-amplify';

import {createUser} from './src/graphql/mutations';
import {getUser} from './src/graphql/queries';

const randomImages =[
  'https://www.google.com/url?sa=i&url=https%3A%2F%2Ftwitter.com%2Fytph_random%3Flang%3Dcs&psig=AOvVaw3mIivjvga27rcw9QXnYXZG&ust=1612864906744000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCMDn85GE2u4CFQAAAAAdAAAAABAD',
  'https://www.google.com/url?sa=i&url=https%3A%2F%2Fmedium.com%2Fbetter-programming%2Fgenerate-contrasting-text-for-your-random-background-color-ac302dc87b4&psig=AOvVaw3mIivjvga27rcw9QXnYXZG&ust=1612864906744000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCMDn85GE2u4CFQAAAAAdAAAAABAI',
  'https://www.google.com/url?sa=i&url=https%3A%2F%2Fco.pinterest.com%2Fpin%2F766878642785111904%2F&psig=AOvVaw3mIivjvga27rcw9QXnYXZG&ust=1612864906744000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCMDn85GE2u4CFQAAAAAdAAAAABAN'
];

const getRandomImage = () => {
  return randomImages[Math.floor(Math.random() * randomImages.length)];
}


const App: () => React$Node = () => {
  
  useEffect(() =>{
    const  fetchUser = async () => {
      //get currently user
      const userInfo = await Auth.currentAuthenticatedUser({bypassCache: true})
      console.log(userInfo.attributes.sub)
      
     if(!userInfo) {
        return;
      }

      //check if the user exists in DB
      const getUserResponse = await API.graphql(
        graphqlOperation(
          getUser,
          {id: userInfo.attributes.sub}
        )
      );

      if(getUserResponse.data.getUser) {
        console.log("User Alredy exist in DB");
        return;
      }
      //if doesn't its newly registered user
      //Then, create a new user in DB
      const newUser = {
        id: userInfo.attributes.sub,
        username: userInfo.username,
        email: userInfo.attributes.email,
        imageUri: getRandomImage(),
      };
      await API.graphql(
        graphqlOperation(
          createUser,
          { input: newUser}
        )
      )
    };
    
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
              <Navigation />
      </SafeAreaView>
    </>
  );
};


export default withAuthenticator(App);
