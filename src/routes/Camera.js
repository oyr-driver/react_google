import "./Camera.css";
import {useState, useEffect, useRef} from "react";
import axios from 'axios';//axios 사용하기 위함
import {useParams} from "react-router";//url 변수 저장 위함

function Camera(){
    const {id, flag} = useParams();//id라는 url 변수를 저장

    var [style1, styleSet1]=useState({display:'block'});
    var [style2, styleSet2]=useState({display:'none'});
    var [style3, styleSet3]=useState({display:'none'});
    var [style4, styleSet4]=useState({display:'none'});

    var [file, setFile]=useState();//react 내에서 값 바꾸기 위하여 useState 이용해서 변수 선언
    var [imgUrl, setImgUrl]=useState();

    var latestFile=useRef(file);//바뀐 값 사용하기 위함
    var latestImgUrl=useRef(imgUrl);

    useEffect(()=>{
        if(flag==='a') {
            styleSet1({display:'none'});
            styleSet2({display:'block'});
        }
        else{
            styleSet1({display:'none'});
            styleSet3({display:'block'});
        }
    },[]);//뒤에 빈 배열 넣어 처음 한번만 실행

    useEffect(()=>{
        var take=document.getElementById('takePicture');
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

                        var show=document.querySelector('.show');
                        show.src=latestImgUrl.current;

                        styleSet2({display:'none'});
                        styleSet3({display:'none'});  
                        styleSet4({display:'block'}); 

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

    //blob을 dataUrl로 바꾸고 다른 서버로 정보 전달
    function blobToDataUrl_axios(){//form태그는 다른 서버로 전송x -> axios는 가능
        var text=document.getElementById('text');
        var reader=new FileReader();
        if (latestFile.current) reader.readAsDataURL(latestFile.current);
        reader.onload=function(event){
            var dataUrl=event.target.result;
            if (dataUrl){
                axios.post(`http://localhost:5000/call/message/${id}/imgsubmit`, {//정보 전달할 페이지
                    text:text.value,
                    dataUrl:dataUrl
                })
                .then((res)=>{//axios.post 성공하면
                    console.log(res);
                })
                .catch((err)=> {//axios.post 에러나면
                    console.log(err);
                    alert(`오류가 발생했습니다.\n${err.message}`);
                    return;
                })
                
                check();
            }
        }
    }

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

    function change(){
        styleSet2({display:'none'});
        styleSet3({display:'block'});
    }

    function check(){
        if(flag==='a') window.location.href='/thanks';
        else window.location.href=`/loc/${id}/${flag}`;
    }

    return (
    <>
        <div className="loading" style={style1}>Wait a minutes...</div>
        <div className="cam_group" style={style2}>
            <div className="buttonbox_cam">
                <img src="../../picture/camera.png" className="campic" alt="cam mark" /> {/*img 주소가 /camera/a(b)/picture 로 인식되므로 ../ 삽입*/}
                <div className="takePic">현재 상황을 사진으로<br /> 보낼까요?</div>
                <div className="cambutton">
                    <button className="mb-2 mr-2 btn-transition btn btn-outline-secondary checkpic" onClick={check}>
                        아니요</button>
                    <button className="mb-2 mr-2 btn-transition btn btn-outline-secondary checkpic" onClick={change}>
                        네</button>
                </div>
            </div>
        </div>

        <div className="cam_group" style={style3}>
            <input type="file" id="takePicture" name="picture" accept="image/*" />
            <label htmlFor="takePicture" className="mb-2 mr-2 btn-transition btn btn-outline-secondary checkbox alert">사진 촬영 및 파일 첨부</label>
        </div>

        <div className="picture" style={style4}>
            <img src="../../picture/camera.png" className="cam" alt="pin" /> {/*img 주소가 /done/a(b)/picture 로 인식되므로 ../ 삽입*/}
            &nbsp;현재 이미지를 전송할까요?
            <br /><br />
            <div className="boxgroup">
                <img className="show" alt="error" />
                <br /> <br />
                <div className="write">
                    불편내용 적어주세요  <span className="choose">*(선택)</span>
                </div>
                <textarea rows="10" id="text" name="text" onKeyUp={textCheck}></textarea>
                <br /><br />
                <button className="mb-2 mr-2 btn-transition btn btn-outline-secondary checkbox camsend" onClick={blobToDataUrl_axios}>
                    등록</button>
                <button className="mb-2 mr-2 btn-transition btn btn-outline-secondary checkbox camsend" onClick={check}>
                    취소</button>
            </div>
        </div>
    </>
    );
}

export default Camera;
