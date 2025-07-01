import React, { PureComponent, useEffect, useState } from 'react';

import Alert from '@mui/material/Alert';


var snd = new Audio("https://www.filterblade.xyz/assets/sounds/AlertSound1.mp3");

function AlertMessage() {

    snd.play()

    return <Alert style={{position:'fixed', zIndex:'9999', width:'100%', textAlign:'center', bottom:'0px'}} severity="success">
    Trade accept
  </Alert>

}

export default AlertMessage;
