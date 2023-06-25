import {Text, Pressable, StyleSheet, View, Image} from "react-native"
import * as Speech from "expo-speech"
import {useEffect, useState} from "react"

export default function Setting(props){
    const speeds = [0.25, 0.5, 1.0, 1.5, 2.0]
    const [speed, setSpeed] = useState(1.0)
    async function changeSpeed(){
        Speech.speak(`This is a test at speed ${speed}`, {rate: speed} )
        const ind = speeds.indexOf(speed)
        setSpeed(speeds[ind==speeds.length-1?0:ind+1])
    }
    useEffect(()=> {
        Speech.speak("Configure the voice speed. Tap once to change, or hold to exit.")
    }, [])
    return (
    <View style={styles.container}>
        <Pressable style={styles.pressable} onLongPress={props.onExit} onPress={changeSpeed}><Image style={styles.image} source={require("./settings.png")} /></Pressable>
    </View>
    )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
    pressable: {
        flexGrow: 1,
        backgroundColor: "#000",
        width: 1000,
        alignItems: "center"

    },
    camera: {
        width: 500,
    },
    image: {height: 200, width: 200, marginTop: 50}
});

