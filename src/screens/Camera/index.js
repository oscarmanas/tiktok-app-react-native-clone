import React, {useState} from 'react';
import { useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {RNCamera} from 'react-native-camera';
import styles from './styles.js';

const Camera = () => {
    const [isRecording, setIsRecording] = useState(false)
    const camera = useRef();

    const onRecord = async () => {
        if (isRecording) {
            camera.current.stopRecording();
        } else {
            const data = await camera.current.recordAsync();
            console.log(data)
        }
    };

    return (
        <View style={styles.container}> 
            <RNCamera
            ref={camera}
            onRecordingStart={() => setIsRecording (true)}
            onRecordingEnd={() => setIsRecording(false)}
            style={styles.preview} 
            />
            <TouchableOpacity 
            onPress={onRecord} 
            style={isRecording? styles.buttonStop : styles.buttonRecord}>

            </TouchableOpacity>
        </View>
    );
};

export default Camera
