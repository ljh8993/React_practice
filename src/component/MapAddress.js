import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    frame: {
        border: "1px solid darkgray"
    },
    subtitle: {
        fontSize: "16px"
    }
})) ;

export default function MapAddress() {
    const classes = useStyles();
    const [fullName, setFullName] = useState('');
    const [roadName, setRoadName] = useState('');
    const [jibunName, setJibunName] = useState('');
    
    const handleComplete = (data) => {
      let fullname = data.address;
      if (data.addressType === 'R') {
          let extraAddress = ''; 
        if (data.bname !== '') {
          extraAddress += data.bname;
        }
        if (data.buildingName !== '') {
          extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
        }
        fullname += (extraAddress !== '' ? ` (${extraAddress})` : '');
      }
      setFullName(fullname);
      setRoadName(`${data.roadAddress}(${data.roadAddressEnglish})`);
      data.userSelectedType === 'J' 
      ? setJibunName(`${data.jibunAddress} (${data.jibunAddressEnglish})`)
      : setJibunName(`${data.autoJibunAddress} (${data.autoJibunAddressEnglish})`);
    }
    
    return (
        <>
            <h4>선택된 주소 정보</h4>
            {
                fullName === ''
                ? ('')
                : (
                <div>
                    <p className={classes.subtitle}>주소 : {fullName}</p>
                    <p className={classes.subtitle}>도로명 : {roadName}</p>
                    <p className={classes.subtitle}>지번 : {jibunName}</p>
                </div>
                )
            }
            <DaumPostcode
                onComplete={handleComplete}
                width={500}
                className={classes.frame}
            />
        </>
    );
}
