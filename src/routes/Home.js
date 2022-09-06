import "./Home.css";
import {useState, useEffect, useRef} from "react";
import axios from 'axios';//axios 사용하기 위함
import {useParams} from "react-router";//url 변수 저장 위함

function Home(){
    const {id, flag} = useParams();//id라는 url 변수를 저장
    const google=window.google;//react에서 google 사용하기 위함

    var map, marker;

    var [lat, setLat]=useState();//useEffect 안에서도 사용하기 위하여 useState 이용해서 변수 선언
    var [lon, setLon]=useState();
    var [loc, setLoc]=useState();

    var latestLat=useRef(lat);//useEffect 밖에서도 바뀐 값 사용하기 위함
    var latestLon=useRef(lon);
    var latestLoc=useRef(loc);

    var [style1, styleSet1]=useState({display:'block'});
    var [style2, styleSet2]=useState({display:'none'});
    var [style3, styleSet3]=useState({display:'none'});

    useEffect(()=>{//로딩시간동안 wait a minutes 뜨도록 하기 위함

        //접속 위치를 얻기
        if (navigator.geolocation && google.maps) {//구글지도가 로딩되고, geolocation 기능이 동작한다면

            if(flag==='b') {
                styleSet1({display:'none'});
                styleSet2({display:'block'});//b이면 style2 보이게
            }

            navigator.geolocation.getCurrentPosition(function(position) {
                setLat = position.coords.latitude; // 위도
                setLon = position.coords.longitude; // 경도
                latestLat.current=setLat;//useEffect 밖에서도 사용할 수 있도록
                latestLon.current=setLon;

                var mapOptions = { 
                    center:new google.maps.LatLng(setLat, setLon),
                    zoom:19
                };
                map = new google.maps.Map(document.getElementById("googleMap"), mapOptions );

                if(flag==='a'){
                    styleSet1({display:'none'});//지도가 로딩되면 구뜨 마크 가리기
                    styleSet3({display:'block'});//지도가 로딩되면 홈페이지 나타나도록
                }

                marker = new google.maps.Marker({position: {lat: setLat, lng: setLon}, map: map});

                latlon2addr(setLat, setLon);//위도경도를 주소로 변환

                //클릭하면 마커 변화
                google.maps.event.addListener(map, 'click', function(event){
                    marker.setMap(null);//마커 하나만 뜨도록 기존것 없애주기
                    marker=new google.maps.Marker({position: {lat: event.latLng.lat(), lng: event.latLng.lng()}, map: map});
                    latlon2addr(event.latLng.lat(),event.latLng.lng(),marker);//위도경도를 주소로 변환
                    map.setCenter(marker.getPosition());//마커가 가운데 위치하도록
                    marker.setMap(map);
                })
            });
        }
    },[]);//빈 배열을 넣어 처음 한번만 실행

    //위도 경도를 주소로 변환
    function latlon2addr(lat, lon){
        var geocoder=new google.maps.Geocoder();//주소를 위도 경도로 변환
        geocoder.geocode({'location':{lat: lat, lng: lon}},function(results,status){
            if (status==='OK') {
                makebox(results[0].formatted_address,map);//주소표시
            }
            else alert('error address');
        });
    }

    //주소 표시하기
    function makebox(addr){
        setLoc=addr;
        latestLoc.current=setLoc;
        var detail='<div class="roadAddr">도로명주소 : '+addr+'</div>';
        var content='<div class="detailAddr"><span class="addr">법정동 주소정보</span>'
            +detail+'</div>';
        
        var infowindow=new google.maps.InfoWindow();
        infowindow.setContent(content);
        infowindow.open(map, marker);
    }

    function change(){
        styleSet2({display:'none'});//위치 전송 묻기 없애기
        styleSet3({display:'block'});//위치 뜨도록
    }

    //주소검색 페이지로 이동
    function Search(){
        window.location.href=`/search/${id}/${flag}`;
    }

    //서버로 위도, 경도, 주소 전달
    function sendAddr_axios(){//form태그는 다른 서버로 전송x -> axios는 가능
        var url = process.env.SEND_URL+`/call/message/${id}/locsubmit`
        axios.post(url, {//정보 전달할 페이지
            lat:latestLat.current,
            lon:latestLon.current,
            loc:latestLoc.current
        })
        .then((res)=>{//axios.post 성공하면
            console.log(res);
        })
        .catch((err)=> {//axios.post 오류나면
            console.log(err);
            alert(`오류가 발생했습니다.\n${err.message}`);
            return;
        })

        window.location.href=`/done/${id}/${flag}`;
    }

    //서비스 이용완료
    function Done(){
        var send={
            "lat":latestLat.current,
            "lon":latestLon.current,
            "loc":latestLoc.current
        };
        localStorage.setItem("send",JSON.stringify(send));//localStorage에 저장해서 다른 파일에서도 사용할 수 있도록

        sendAddr_axios();//서버로 위도, 경도, 주소 전달
    }

    function thanks(){
        window.location.href='/thanks';
    }

    return (
    <>
        <div className="loading" style={style1}>Wait a minutes...</div>

        <div className="cam_group" style={style2}>
            <div className="buttonbox_cam">
                <img src="../../picture/location.png" className="locpic" alt="loc mark" /> {/*img 주소가 /loc/a(b)/picture 로 인식되므로 ../ 삽입*/}
                <div className="takePic">현재 위치를 <br />전송하시겠습니까?</div>
                <div className="cambutton">
                    <button className="mb-2 mr-2 btn-transition btn btn-outline-secondary checkbox camsend" onClick={thanks}>
                        아니요</button>
                    <button className="mb-2 mr-2 btn-transition btn btn-outline-secondary checkbox camsend" onClick={change}>
                        네</button>
                </div>
            </div>
        </div>

        <div className="box" style={style3}>
            <div className="check">
                <img src="../../picture/location.png" className="pin" alt="pin mark" /> {/*img 주소가 /loc/a(b)/picture 로 인식되므로 ../ 삽입*/}
                현재 위치가 맞습니까?
            </div>
            <div className="adjust">
                &nbsp;&nbsp;&nbsp;&nbsp;<strong>※아닐경우 위치를 조정해주세요!</strong>
            </div>
            
            <br />
            <div id="googleMap"></div>
            <br /><br />
            <div className="boxgroup">
                <button className="mb-2 mr-2 btn-transition btn btn-outline-secondary checkbox write" onClick={Search}>
                    작성할게요</button>
                <button className="mb-2 mr-2 btn-transition btn btn-outline-secondary checkbox ok" onClick={Done}>
                    네, 맞습니다</button>
            </div>
        </div>
    </>//react는 항상 한 태그 안에 전체가 감싸져있어야함
    );
}

export default Home;