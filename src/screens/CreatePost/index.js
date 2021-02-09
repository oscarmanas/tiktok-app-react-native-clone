import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './styles.js';
import { v4 as uuidv4 } from 'uuid';

import {Storage, API, graphqlOperation, Auth} from 'aws-amplify';
import {useRoute, useNavigation} from '@react-navigation/native';

import {createPost} from '../../graphql/mutations';

const CreatePost = (props) => {
    const [description, setdescription] = useState("");
    const [videoKey, setvideoKey] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    
        // upload video to cloud
            const uploadToStorage = async (imagePath) => {
                try{
                    const response = await fetch(imagePath);

                    const blob = await response.blob();

                    const filename = `${uuidv4()}.mp4`;
                    const s3Response = await Storage.put(filename, blob)

                    setvideoKey(s3Response.key);

                    console.log(s3Response);
                } catch (e) {
                    console.error(e);
                }
            }

            useEffect(() => {
                uploadToStorage(route.params.videoUri)
            }, [])

        // create post in DB (API)
        const onPublish = async () => {
            if(!videoKey) {
                console.warn('Video is not yet uploaded')
                return;
            }

            try{

                const userInfo = await Auth.currentAuthenticatedUser();

                const newPost = {
                    videoUri: videoKey,
                    description: description,
                    userID: userInfo.attribute.sub,
                    songID: "87007777-5027-480f-8f53-940b28e924a4"
                }

                const response = await API.graphql(
                    graphqlOperation(
                        createPost,
                        {input: newPost}
                    )
                );
                navigation.navigate("Home", {screen: "Home"});
            }catch (e) {
                console.error(e);
            }
    }
        return (
            <View>
                <TextInput
                value={description}
                onChangeText={setdescription}
                numberOfLines={5}
                placeholder={"Desciption"}
                style={styles.TextInput}
                />
                <TouchableOpacity onPress={onPublish}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Publish</Text>
                    </View>  
                </TouchableOpacity>
            </View>
        );
};

export default CreatePost;
