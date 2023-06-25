import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View, Button, Image, TouchableOpacity, ToastAndroid} from 'react-native';
import {useState} from "react";
import {Camera, CameraType} from "expo-camera"
import {Buffer} from "buffer"
import * as Haptics from 'expo-haptics';
import * as Speech from "expo-speech";
import {useEffect} from "react";
import Setting from "./Setting"

export default function App() {
    const [configuring, setConfiguring] = useState(false);
    useEffect(() => {

        Speech.speak("Welcome to Remulate! Tap once to describe your environment, or hold to configure the app.", {rate: 0.5} )
  }, []);

    const [permission, requestPermission] = Camera.useCameraPermissions()
    let camera;
    if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

    
    function confidenceToWords(confidence){
        if (confidence < 30) return "High chance not relevant"
        if (confidence >= 30 && confidence < 50) return "May not be as relevant"
        if (confidence >= 50 && confidence < 70) return "Fairly relevant"
        if (confidence >= 70 && confidence < 85) return "Very relevant"
        return "Extremely relevant"
    }
    function createPrompt(tags){
        const first = obj=>obj[Object.keys(obj)[0]]
        let openaiPrompt = "You will be given a list of tags describing an image taken from the camera of a phone along with how relevant those tags are to the image. Your job is to describe the scene in 1-2 sentences for a blind person allowing them to understand the environment around them. Do not be verbose, explain what's going on with as few words as possible, do not follow grammar rules. Here are the tags:\n"
        tags.forEach(tag=>{
            const desc = first(tag.tag); 
            const confText = confidenceToWords(tag.confidence)
            openaiPrompt += `${desc}: ${confText} \n`
        })
        return openaiPrompt
    }
    async function clickPhoto(){
        image = await camera.takePictureAsync()
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        try {
            
            let url = new URL("https://api.imagga.com/v2/uploads");
            const [key, secret, openaiToken] = ["key", "secret", "token"]
            //TODO do not leak credentials
            const formData = new FormData()
            formData.append('image', {uri: image.uri, name: "image.jpg", type: "image/jpeg"})
            let headers = {"Authorization": "Basic " + Buffer.from(key + ":" + secret).toString("base64")}
            let response = await fetch(url, {method: "POST", headers, body: formData});
            let json = await response.json()
            const image_upload_id = json.result.upload_id
            url = new URL("https://api.imagga.com/v2/tags")
            const params = {image_upload_id, threshold: 15.0}
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            response = await fetch(url, {headers})
            json = await response.json() 
            const openaiPrompt = createPrompt(json.result.tags)
            headers = {"Authorization": "Bearer " + openaiToken, "Content-Type": "application/json"}
            console.log(openaiPrompt)
            const openaiBody = {
                model: "text-davinci-003",
                prompt: openaiPrompt
            }
            response = await fetch("https://api.openai.com/v1/completions", {headers, method: "POST", body: JSON.stringify(openaiBody)});
            json = await response.json()
            const text = json.choices[0].text
            console.log(text);
            Speech.speak(text, {rate: 0.5})
        }
        catch (err) {console.log(err)}
    }

    async function configure(){
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        setConfiguring(true)
    }

    if (configuring){
        return <Setting onExit={()=>setConfiguring(false)} />
    }
  return (
        <View style={styles.container}>
          <Pressable style={styles.pressable} onPress={clickPhoto} onLongPress={configure}>
            <Camera style={styles.camera} ref={r=>camera = r} style={styles.camera} type={CameraType.back}>
                <View style={{display: "none"}}>

                </View>
              </Camera> 

              <Image style={styles.image} source={require("./remulate.png")} />

          <StatusBar style="auto" />
         </Pressable>
        </View>
  );
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
        height: 400,
        marginTop : 100,
        width: 200,

    },
    image: {
        height: 200,
        width: 200,
        marginTop: 50
    }
});
