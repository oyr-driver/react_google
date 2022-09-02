import "./Check.css";
import {useState, useEffect, useRef} from "react";
import {useParams} from "react-router";//url 변수 저장 위함

function Check(){
    const {id} = useParams();//id,flag라는 url 변수를 저장

    var [style1, styleSet1]=useState({display:'block'});
    var [style2, styleSet2]=useState({display:'none'});

    useEffect(()=>{
        if(document.getElementsByClassName('c_group')) {//return이 로딩되었다면(html파일이 만들어져서 c_group이 로딩되면)
            
            styleSet1({display:'none'});
            styleSet2({display:'block'});
        }
    },[]);//뒤에 빈 배열 넣어 처음 한번만 실행

    function home(){
        window.location.href=`/loc/${id}/a`;
    }

    function camera(){
        window.location.href=`/camera/${id}/b`;
    }

    return (
    <>
        <div className="loading" style={style1}>GOODDRIVE</div>
        <div className="home">&nbsp; &nbsp;HOME</div>
        <hr className="line"/>
        <br /> <br />
        <div className="c_group" style={style2}>
            <div className="buttonbox" onClick={home}>
                <div className="c_button">취약 계층<br />위치 신고</div>
                <img src="picture/location.png" className="c_pin" alt="pin mark" /> {/*public 내에 picture 있으므로 picture만 작성*/}
            </div>
            <br /> <br /> <br /> <br />
            <div className="buttonbox" onClick={camera}> 
                <div className="c_button">재난 위험<br />사진 신고</div>
                <img src="picture/camera.png" className="c_cam" alt="cam mark" /> {/*public 내에 picture 있으므로 picture만 작성*/}
            </div>
        </div>
    </>
    );
}

export default Check;
