import "./Done.css";
import {useState, useEffect, useRef} from "react";

function Done(){
    const google=window.google;//react에서 google 사용하기 위함

    var [style1, styleSet1]=useState({display:'block'});
    var [style2, styleSet2]=useState({display:'none'});
    var [style3, styleSet3]=useState({display:'none'});

    var [file, setFile]=useState();//react 내에서 값 바꾸기 위하여 useState 이용해서 변수 선언
    var [imgUrl, setImgUrl]=useState();

    var latestFile=useRef(file);//바뀐 값 사용하기 위함
    var latestImgUrl=useRef(imgUrl);

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
            post.append('"'+loc+'"');

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

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

    var take=document.getElementById('takePicture');
    var show=document.querySelector('.show');

    useEffect(()=>{
        if (take){
            take.onchange=function(event){
                var files=event.target.files;
                if (files && files.length>0) {
                    setFile=files[0];
                    latestFile.current=setFile;//useEffect 밖에서도 사용하기 위함
                    try{//오류있을수도 있는 문장
                        var link=window.URL||window.webkitURL;//window.URL 객체 얻기
                        setImgUrl=link.createObjectURL(latestFile.current);//objectURL 생성
                        latestImgUrl.current=setImgUrl;//useEffect 밖에서도 사용하기 위함

                        show.src=latestImgUrl.current;

                        styleSet2({display:'none'});
                        styleSet3({display:'block'});  

                        var picture=document.querySelector('.picture');
                        picture.onload=function(){link.revokeObjectURL(imgUrl);}//이미지 띄우고 url 취소하기(메모리 절약 위함)
                    }
                    catch(e){//에러 있다면
                        console.log('error');
                        try{
                            var fileReader=new FileReader();//createObject가 안되는 경우
                            fileReader.onload=function(event){
                                setImgUrl=event.target.result;//useEffect 밖에서도 사용하기 위함
                                latestImgUrl.current=setImgUrl;
                            };
                            fileReader.readAsDataURL(file);
                        }
                        catch(e){
                            var error=document.getElementById('error');
                            if(error) error.innerHTML="Neither createObjectURL or FileReader are supported";
                        }
                    }
                }
            }
        }
    });

    var dataUrl;
    function blobToDataUrl(){
        var reader=new FileReader();
        if (latestFile.current) reader.readAsDataURL(latestFile.current);/////////////file
        reader.onload=function(event){
            dataUrl=event.target.result;
            if (dataUrl){
                console.log(dataUrl);
                //해당 위치로 전송하기

                thanks();
            }
        }
    }

    function thanks(){
        window.location.href='/thanks';
    }

    function done(){
        window.location.href='/done';
    }

    return (
    <>
        <div className="loading" style={style1}>Wait a minutes...</div>
        <div className="d_group" style={style2}>
            <div className="here">
                <img src="https://e7.pngegg.com/pngimages/199/694/png-clipart-computer-icons-map-location-sign-cdr-black-thumbnail.png" 
                className="s_pin" alt="pin mark" />
                현재 고객님의 위치는
                <div id="insert"></div>
                입니다.
            </div>
        
            <div id="d_googleMap"></div>  

            <div className="camera">현재 상황을 사진으로 알리고 싶다면?</div>
            <input type="file" id="takePicture" name="picture" accept="image/*" />
            <label htmlFor="takePicture" className="mb-2 mr-2 btn-transition btn btn-outline-secondary checkbox">현 상황 알리기</label>
        </div>

        <div className="picture" style={style3}>
            <div className="send">
                <img src="https://e7.pngegg.com/pngimages/199/694/png-clipart-computer-icons-map-location-sign-cdr-black-thumbnail.png" 
                className="pin" alt="pin" />
                현재 이미지를 전송할까요?
            </div>
            <br />
            <div className="boxgroup">
                <img className="show" alt="error" />
                <br /><br />
                <button className="mb-2 mr-2 btn-transition btn btn-outline-secondary checkbox" onClick={blobToDataUrl}>
                    전송</button>
                <button className="mb-2 mr-2 btn-transition btn btn-outline-secondary checkbox" onClick={done}>
                    다른 파일 전송</button>
            </div>
        </div>
    </>
    );
}


export default Done;
