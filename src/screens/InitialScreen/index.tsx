import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, Alert, Linking, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';
import Header from '../../components/Header';
import { checkMultiplePermissions, AUDIO_ACTIONS } from '../../utils'
interface Props {
}

const InitialScreen: React.FC<Props> = ({ }) => {
  const [audioActionType, setAudioActionType]: any = useState(AUDIO_ACTIONS.PAUSE);
  const [isShowPlayBtn, setIsShowPlayBtn]: any = useState(false);
  const [isDownloading, setIsDownloading]: any = useState(false);

  let audio: any = null;
  const AUDIO_URL = "https://file-examples.com/storage/feb1825f1e635ae95f6f16d/2017/11/file_example_MP3_700KB.mp3"; // External Audio clip URL
  const findAndGetPermissions = async () => {
    debugger
    const PERMISSION_DATA =
      Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY]
        : [PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE];
    debugger
    // Call our permission service and check for permissions
    const IS_PERMISSION_GRANTED = await checkMultiplePermissions(PERMISSION_DATA);
    debugger
    if (!IS_PERMISSION_GRANTED) {
      // Show an alert in case permission was not granted!
      Alert.alert(
        'Permission Request',
        'Please allow permission to access to memory to download the Audio file ',
        [
          {
            text: 'Go to Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: false },
      );
    }
    debugger
    console.log('IS_PERMISSION_GRANTED==>', IS_PERMISSION_GRANTED);
    return IS_PERMISSION_GRANTED;
  }
  const downloadFileToLocalStorage = async () => {
    try {
      const GRANTED = await findAndGetPermissions();
      setIsDownloading(true)
      if (GRANTED) {
        const FIND_INDEX_OF_FILENAME = AUDIO_URL.lastIndexOf('/');
        const FILE_NAME = AUDIO_URL.substring(FIND_INDEX_OF_FILENAME);
        const { dirs: { DownloadDir, DocumentDir } } = RNFetchBlob.fs;
        const TARGET_PATH_IN_OS = Platform.select({ ios: DocumentDir, android: DownloadDir });
        const DESTINATION_PATH = TARGET_PATH_IN_OS + FILE_NAME;
        const CONFIG_OPTIONS: any = Platform.select({
          ios: {
            fileCache: true,
            path: DESTINATION_PATH,
            notification: true,
            appendExt: 'mp3',
            indicator: true,
            IOSBackgroundTask: true,
          },
          android: {
            appendExt: 'mp3',
            fileCache: true,
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              path: DESTINATION_PATH,
              title: FILE_NAME,
              description: "Audio downloaded by download manager.",
            }
          },
        });

        const RnFetchConfig = await await RNFetchBlob.config(CONFIG_OPTIONS);
        const fileResp = await RnFetchConfig.fetch('GET', AUDIO_URL, {})
        if (fileResp && fileResp.path()) {
          await AsyncStorage.setItem('audio_clip_path', fileResp.path());
          console.log('The file saved to ===>', fileResp.path());
        }
        console.log(fileResp);
      } else {
      }
    } catch (ex) {
      console.log("Ex is getting on File download : ", ex);
    }
    finally {
      setIsDownloading(false)
    }
  }

  const loadAudioClip = async () => {
    const AUDIO_PATH = await AsyncStorage.getItem('audio_clip_path');
    console.log('Load Audio Clip from Local Storage : ', AUDIO_PATH);
    audio = new Sound(AUDIO_PATH || AUDIO_URL, Sound.MAIN_BUNDLE, (error: any) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      setIsShowPlayBtn(true);
      console.log('Audio File is successfully loaded:');
      console.log('duration in seconds: ' + audio.getDuration());
      audioActions(AUDIO_ACTIONS.PLAY);
    });
  }

  useEffect(
    () => {
      debugger
      console.log('Calling UseEffect===>');
      (async function auioPlayOperations() {
        const loadAudioOperations = async () => {
          const audioClip = await AsyncStorage.getItem('audio_clip_path');
          if (!audioClip) {
            console.log('Audio file downloading is started:');
            await findAndGetPermissions();
            await downloadFileToLocalStorage();
          }
          await loadAudioClip();
        }
        // now you can await the async function to make sure it completes
        await loadAudioOperations();
        audio.setVolume(1);
      })();
      return () => {
        audio.release();
      };
    }, [isShowPlayBtn])



  const playAudio = () => {
    try {
      audio.play((success: any) => {
        if (success) {
          console.log('successfully finished playing');
          setAudioActionType(AUDIO_ACTIONS.PLAY)
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    } catch (error) {
      console.log('error is occurred :', error);
    }
  };
  const pauseAudio = () => {
    try {
      audio.pause((success: any) => {
        if (success) {
          console.log('successfully finished pausing');
          setAudioActionType(AUDIO_ACTIONS.PLAY)

        } else {
          console.log('pausing failed due to audio decoding errors');
        }
      });
    } catch (error) {
      console.log('error is occurred :', error);
    }
  };

  const stopAudio = () => {
    try {
      audio.stop((success: any) => {
        if (success) {
          console.log('successfully finished stoping');
          setAudioActionType(AUDIO_ACTIONS.PLAY)
        } else {
          console.log('stoping failed due to audio decoding errors');
        }
      });
    } catch (error) {
      console.log('error is occurred :', error);
    }
  };



  const audioActions = (action: string) => {
    switch (action) {
      case AUDIO_ACTIONS.PLAY:
        playAudio();
        setAudioActionType(AUDIO_ACTIONS.PAUSE)
        break;
      case AUDIO_ACTIONS.PAUSE:
        pauseAudio();
        setAudioActionType(AUDIO_ACTIONS.PLAY)
        break;
      case AUDIO_ACTIONS.STOP:
        stopAudio();
        setAudioActionType(AUDIO_ACTIONS.PLAY)
        break;
      default:
        break;
    }

  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Header title={"Audio Actions"} />
      </View>
      <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center', paddingVertical: 100 }}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: "#FFFFFF", fontSize: 20 }}>{`The Audio File is ${isDownloading ? "Downloading..." : audioActionType === AUDIO_ACTIONS.PAUSE ? "Playing..." : audioActionType === AUDIO_ACTIONS.PLAY ? "Paused..." : audioActionType === AUDIO_ACTIONS.STOP ? "Stoped..." : ''}`}</Text>
        </View>
        <View style={styles.actionView}>
          {isDownloading ?
            <ActivityIndicator size="large" color={"#FFFFFF"} />
            :
            <TouchableOpacity onPress={() => audioActions(audioActionType)} style={styles.actionBtn}>
              <Text style={styles.actionText}>{audioActionType}</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    </SafeAreaView>
  );
};




const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cfcfcf',
    alignItems: 'center',
  },
  actionText: {
    textAlign: 'center', fontSize: 15, color: "#4566e0"
  },
  actionView: {
    justifyContent: 'center', alignItems: 'center', paddingVertical: 30
  },
  actionBtn: {
    justifyContent: 'center', alignItems: 'center', height: 50, width: 120, backgroundColor: "#FFFFFF", borderRadius: 10
  }
});

export default InitialScreen;