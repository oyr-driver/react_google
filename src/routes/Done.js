import "./Done.css";
import {useState, useEffect} from "react";
import axios from 'axios';//axios 사용하기 위함
import {useParams} from "react-router";//url 변수 저장 위함

function Done(){
    const {id, flag} = useParams();//id라는 url 변수를 저장
    const google=window.google;//react에서 google 사용하기 위함

    var [style1, styleSet1]=useState({display:'block'});
    var [style2, styleSet2]=useState({display:'none'});

    var receive=JSON.parse(localStorage.getItem("send"));//localStorage에 저장된 send객체값 가져오기
    var lat, lon, loc;
    lat=receive.lat;
    lon=receive.lon;
    loc=receive.loc;

    useEffect(()=>{
        if(google===undefined) console.log('loading');//구글이 로딩되지 않았다면 다시 렌더링
    });//뒤에 아무 인자도 넣지 않아 렌더링 될 때마다 실행

    useEffect(()=>{
        if(document.getElementById("insert") && google.maps) {//return이 로딩되었다면(html파일이 만들어져서 insert id가 생겼다면)
            
            var post=document.getElementById("insert");
            if(!post.innerHTML) post.append('"'+loc+'"');//안에 내용이 없었다면

            var mapOptions = { 
                center:new google.maps.LatLng(lat, lon),
                zoom:19
            };
            var map = new google.maps.Map(document.getElementById("d_googleMap"), mapOptions );

            var marker = new google.maps.Marker({position: {lat: lat, lng: lon}, map: map});

            var addr='<div class="detailAddr">'+loc+'</div>';
            var infowindow=new google.maps.InfoWindow();
            infowindow.setContent(addr);
            infowindow.open(map, marker);

            styleSet1({display:'none'});
            styleSet2({display:'block'});
        }
    },[]);//뒤에 빈 배열 넣어 처음 한번만 실행

    function textCheck(){//글자수 제한
        var text=document.getElementById('text').value;
        var textLen=text.length;

        if(textLen>500){
            alert('500자 이상 작성할 수 없습니다.');
            text=text.substr(0, 500);//0에서 500자까지만 인식
            document.getElementById('text').value=text;
            document.getElementById('text').focus();
        }
    }

    function text_axios(){//axios 써서 서버로 정보 보내기
        var text=document.getElementById('text');
        if (text){
            axios.post(`http://localhost:5000/call/message/${id}/textsubmit`, {//정보 전달할 페이지
                text:text.value,
            })
            .then((res)=>{//axios.post 성공하면
                console.log(res);
            })
            .catch((err)=> {//axios.post 에러나면
                console.log(err);
                alert(`오류가 발생했습니다.\n${err.message}`);
                return;
            })
            
            change();
        }
    }

    function change(){
        if(flag==='a') window.location.href=`/camera/${id}/${flag}`;
        else  window.location.href='/thanks';
    }

    return (
    <>
        <div className="loading" style={style1}>Wait a minutes...</div>
        <div className="d_group" style={style2}>
            <div className="here">
                <img src="../../picture/location.png" className="pin" alt="pin mark" /> {/*img 주소가 /done/a(b)/picture 로 인식되므로 ../ 삽입*/}
                현재 고객님의 위치는
                <div id="insert"></div>
                입니다.
            </div>
        
            <div id="d_googleMap"></div>  

            <br />
            <div className="write">
                불편내용 적어주세요  <span className="choose">*(선택)</span>
            </div>

            <textarea rows="10" id="text" name="text" onKeyUp={textCheck}></textarea>
            <br />
            <button className="mb-2 mr-2 btn-transition btn btn-outline-secondary checkbox camsend" onClick={text_axios}>
                등록</button>
            <button className="mb-2 mr-2 btn-transition btn btn-outline-secondary checkbox camsend" onClick={change}>
                취소</button>
        </div>
    </>
    );
}

export default Done;
