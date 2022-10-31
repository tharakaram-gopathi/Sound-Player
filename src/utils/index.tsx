

import {
    RESULTS,
    requestMultiple,
} from 'react-native-permissions';





// This function can be used anywhere as it supports multiple permissions. 
// It checks for permissions and then requests for it.
const checkMultiplePermissions = async (permissions: any) => {
    let isPermissionGranted = false;
    const statuses = await requestMultiple(permissions);
    for (var index in permissions) {
        if (statuses[permissions[index]] === RESULTS.GRANTED) {
            isPermissionGranted = true;
        } else {
            isPermissionGranted = false;
            break;
        }
    }
    return isPermissionGranted;
}

const AUDIO_ACTIONS = {
    PLAY: "PLAY",
    PAUSE: "PAUSE",
    STOP: "STOP",
}


export { checkMultiplePermissions, AUDIO_ACTIONS }