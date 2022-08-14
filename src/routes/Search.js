import "./Search.css";
import {useState, useEffect, useRef} from "react";

function Search(){
    const google=window.google;//react에서 google 사용하기 위함

    var [map,setMap]=useState(); //useEffect 안에서도 사용하기 위하여 useState 이용해서 변수 선언
    var [marker, setMarker]=useState(); 
    var [geocoder, setGeocoder]=useState(); 
    
    var latestMap=useRef(map);//useEffect 안에서 바뀐 값을 useEffect 밖에서도 사용하기 위함
    var latestMarker=useRef(marker);
    var latestGeocoder=useRef(geocoder);
    
    var [lat, setLat]=useState();//react 내에서 값 바꾸기 위하여 useState 이용해서 변수 선언
    var [lon, setLon]=useState();
    var [loc, setLoc]=useState();

    var latestLat=useRef(lat);//바뀐 값 사용하기 위함
    var latestLon=useRef(lon);
    var latestLoc=useRef(loc);
    
    var [style1, styleSet1]=useState({display:'block'});
    var [style2, styleSet2]=useState({display:'none'});
    var [change1, setChange1]=useState({display:'inline'});
    var [change2, setChange2]=useState({display:'none'});
    var [find, setFind]=useState({display:'inline'});
    var [again, setAgain]=useState({display:'none'});
    var [done, setDone]=useState({display:'none'});
    var [show, setShow]=useState({display:'none'});

    useEffect(()=>{
        if(google===undefined) console.log('loading');//구글이 로딩되지 않았다면 다시 렌더링
    });

    useEffect(()=>{
        if(document.getElementById("s_googleMap") && google.maps){//html파일이 로딩되고 maps가 로딩되면

            var mapOptions = { 
                center:new google.maps.LatLng(33.450701, 126.570667),//임의의 위치정보 넣음
                zoom:19
            };
            setMap = new google.maps.Map(document.getElementById("s_googleMap"), mapOptions );

            setMarker = new google.maps.Marker({position: {lat: 33.450701, lng: 126.570667}, map: map});

            setGeocoder=new google.maps.Geocoder();

            latestMap.current=setMap;//useEffect 밖에서도 사용하기 위함
            latestMarker.current=setMarker;
            latestGeocoder.current=setGeocoder;

            //주소 자동완성기능
            var autocomplete = new google.maps.places.Autocomplete(document.getElementById('addr'), {
                types: ['geocode']
            });
            autocomplete.addListener('place_changed');

            styleSet1({display:'none'});
            styleSet2({display:'block'});
        }
    },[]);//빈 배열을 넣어 처음 한번만 실행

    //주소를 위도 경도로 변환
    function addrsearch(){
        geocodeAddress(latestGeocoder.current, latestMap.current);
    }
    function geocodeAddress(geocoder, resultMap){
        var address=document.getElementById('addr').value;//입력한 주소
        geocoder.geocode({'address':address},function(result, status){
            if (status==='OK'){//geocode 오류없이 수행

                setChange1({display:'none'});
                setChange2({display:'inline'});

                document.getElementById('addr').disabled=true;//주소입력창 비활성화

                setFind({display:'none'});
                setAgain({display:'inline'});

                resultMap.setCenter(result[0].geometry.location);//맵 중심좌표 설정
                resultMap.setZoom(18);
                marker=new google.maps.Marker({
                    map:resultMap,
                    position:result[0].geometry.location
                });
                setShow({display:'block'});//지도 보이게

                setLat=result[0].geometry.location.lat();
                setLon=result[0].geometry.location.lng();
                setLoc=address;
                latestLat.current=setLat;
                latestLon.current=setLon;
                latestLoc.current=setLoc;

                var detail='<div>'+address+'</div>';
                var content='<div class="detailAddr">'+detail+'</div>';
                var infowindow=new google.maps.InfoWindow();
                infowindow.setContent(content);
                infowindow.open(map, marker);

                setDone({display:'inline'});
            }
            else alert('geocode error'+status);
        });
    }

    //메인페이지로
    function Index(){
        window.location.href='/';
    }

    //위치 재검색
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
        <div className="loading" style={style1}>Wait a minutes...</div>
        <div className="group" style={style2}>
            <div className="head">
                <img src="https://e7.pngegg.com/pngimages/199/694/png-clipart-computer-icons-map-location-sign-cdr-black-thumbnail.png" 
                className="s_pin" alt="pin mark" />
                <span className="change1" style={change1}>위치를 작성해주세요</span>
                <span className="change2" style={change2}>작성하신 위치가 맞습니까?</span>
            </div>

            <br /><br />
            <div className="enter">
                &nbsp;&nbsp;&nbsp;주소입력&nbsp;
                <input type="text" id="addr" placeholder="도로명주소" />
                <button className="mb-2 mr-2 btn-transition btn btn-outline-secondary search s_box" onClick={addrsearch} style={find}>
                    확인</button>
            </div>

            <br />
            <div id="s_googleMap" style={show}></div>

            <br />
            <div className="button_group">
                <button className="mb-2 mr-2 btn-transition btn btn-outline-secondary s_box" onClick={Index}>
                    이전페이지</button>
                <button className="mb-2 mr-2 btn-transition btn btn-outline-secondary again s_box" onClick={Search} style={again}>
                    다시 입력하기</button>
                <button className="mb-2 mr-2 btn-transition btn btn-outline-secondary done s_box" onClick={Done} style={done}>
                    위치 선택 완료</button>
            </div>
        </div>
    </>
    );
}

export default Search;