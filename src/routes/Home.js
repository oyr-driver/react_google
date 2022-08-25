import "./Home.css";
import {useState, useEffect, useRef} from "react";

function Home(){
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

    useEffect(()=>{//로딩시간동안 구뜨 마크 뜨도록 하기 위함

        //접속 위치를 얻기
        if (navigator.geolocation && google.maps) {//구글지도가 로딩되고, geolocation 기능이 동작한다면

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

                styleSet1({display:'none'});//지도가 로딩되면 구뜨 마크 가리기
                styleSet2({display:'block'});//지도가 로딩되면 홈페이지 나타나도록

                marker = new google.maps.Marker({position: {lat: setLat, lng: setLon}, map: map});

                latlon2addr(setLat, setLon);

                //클릭하면 마커 변화
                google.maps.event.addListener(map, 'click', function(event){
                    marker.setMap(null);//마커 하나만 뜨도록 기존것 없애주기
                    marker=new google.maps.Marker({position: {lat: event.latLng.lat(), lng: event.latLng.lng()}, map: map});
                    latlon2addr(event.latLng.lat(),event.latLng.lng(),marker);
                    map.setCenter(marker.getPosition());//마커가 가운데 위치하도록
                    marker.setMap(map);
                })
            });
        }
    },[]);

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

    //주소검색 페이지로 이동
    function Search(){
        window.location.href='/search';
    }

    //서비스 이용완료
    function Done(){
        var send={
            "lat":latestLat.current,
            "lon":latestLon.current,
            "loc":latestLoc.current
        };
        localStorage.setItem("send",JSON.stringify(send));//localStorage에 저장해서 다른 파일에서도 사용할 수 있도록
        window.location.href='/done';
    }

    return (
    <>
        <div className="loading" style={style1}>GOODDRIVE</div>
        <div className="box" style={style2}>
            <div className="check">
                <img src="picture/location.png" className="pin" alt="pin mark" /> {/*public 내에 picture 있으므로 picture만 작성*/}
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