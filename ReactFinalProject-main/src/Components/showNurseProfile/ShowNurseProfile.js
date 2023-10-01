import { useContext, useEffect, useRef, useState } from "react";
import nurseProfilee from "./ShowNurseProfile.module.css";
import { useSelector, useDispatch } from "react-redux";
import ShowNurseResume from "./ShowNurseResume";
import { useLocation, useParams } from 'react-router-dom';
import { getNurseById } from "../../Redux/Slices/PatientSlice";
import { motion } from 'framer-motion'
import { NavLink,Link, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import Rating from "../nurseProfile/Rates";
import DarkStyle from '../DarkMode/darkBtn.module.css'
import Fade from 'react-reveal/Fade'
import axios from "axios";
import { io } from "socket.io-client";

function ShowNurseProfile({ data }) {
  const location = useLocation();
  const page = location.pathname.split('/')[2];
  const username = JSON.parse(localStorage.getItem("user"))?.name;
  const PatientId = JSON.parse(localStorage.getItem("user"))?._id;
  const { id } = useParams();
  const nurseprofileid = useSelector((state) => state.PatientSlice.device);

  const url = "http://localhost:3500/";
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0,0);
    dispatch(getNurseById(id));
    const isDarkMode = localStorage.getItem("isDarkMode")
    if(isDarkMode){
    document.querySelector("#MainShowProfileBackground")?.classList.toggle(DarkStyle["MainProfileBackground"], isDarkMode);
    document.querySelector("#MainShowProfile")?.classList.toggle(DarkStyle["MainProfile"], isDarkMode);
    document.querySelector("#ShowNurseName")?.classList.toggle(DarkStyle["NurseName"], isDarkMode);
    document.querySelector("#ShowNurseCounter")?.classList.toggle(DarkStyle["NurseCounter"], isDarkMode);
    document.querySelector("#ShowNurseCounterFastService")?.classList.toggle(DarkStyle["NurseCounter"], isDarkMode);
    document.querySelector("#ShowNurseCounterHomeShift")?.classList.toggle(DarkStyle["NurseCounter"], isDarkMode);
    }
    // window.scrollTo(0, 0);
  }, []);

  // Chat
  const socket = useRef();
  useEffect(() => {
    socket.current = io("ws://localhost:3500");
    
  }, []);
  
  const joinRoom = () => {
    // Socket?.emit("join_room", id);
    socket.current.emit("notifcationChat",{
      patientId:PatientId,
      nurseId:id,
      patientName:username
  })
  axios.post('http://localhost:3500/chat/',{
    senderId:PatientId,
    receiverId:id
  })
  };

  // Modal TRy
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const nav = useNavigate()
  function goTo() {
    nav(`/FormNurse/${id}`, { state: nurseprofileid })
  }
  return (
    <motion.div id="MainShowProfileBackground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      variants={{ duration: 0.2 }}
      transition={{ yoyo: Infinity }}
      style={{ overflow: 'hidden' }}
    >
      {nurseprofileid && (
        <Fade top distance="10%" duration={1500}>
        <section
          style={{ direction: "rtl" }}
          className={`${nurseProfilee.profile_page} ${nurseProfilee.container}`}
        >
          <div
            className={`${nurseProfilee.page_header} ${nurseProfilee.header_filter}`}
            data-parallax="true"
            style={{
              background:
                'rgba(0,0,0,.5)url("https://pikwizard.com/pw/medium/04672da5e3057cd167bc931bd321ada9.webp") ',
              backgroundSize: "cover",
            }}
          ></div>
          <div id="MainShowProfile" className={`${nurseProfilee.main} ${nurseProfilee.main_raised}`}>
            <div className={"profile-content"}>
              <div className={"container"}>
                <div className={"row"}>
                  <div className={"col-md-6 ms-auto me-auto "}>
                    <div className={nurseProfilee.profile}>
                      <div className={nurseProfilee.profIMG}>
                        <img
                          src={`${url}${nurseprofileid.profile}`}
                          // src="https://www.heathsidevets.co.uk/wp-content/uploads/2020/03/heathside-vets-vet-in-southampton-team-staff-bianca-collings.jpg"
                          alt="Circle Image"
                          className={
                            nurseProfilee["img_raised rounded_circle  img_fluid"]
                          }
                          style={{
                            borderRadius: "50%",
                            width: "100%",
                            margin: "0 auto",
                          }}
                        />
                      </div>

                      <div id="ShowNurseName" className={nurseProfilee.name}>
                        <h3 className={nurseProfilee.title}>{nurseprofileid.name}</h3>
                        <div className={`${nurseProfilee.r} ${" mt-4 "}`}>
                          <Rating rate={nurseprofileid.rates} />
                      </div>
                        <h6>
                          {nurseprofileid.experience &&
                            nurseprofileid.experience.length > 0 &&
                            `${nurseprofileid.experience[0].title} في ${nurseprofileid.experience[0].company}`}
                        </h6>
                          <Link to={`/Messenger/${PatientId}/${id}`}>
                        <Button className={`${"btn"} ${nurseProfilee['btn_outline_primary']}`} onClick={() => { joinRoom(); }}>
                              تواصل  <i className="fa-solid fa-comment-dots "></i>
                          </Button>
                            </Link>

                      
                        <Button onClick={goTo} className={`${"btn me-2"} ${nurseProfilee['btn_outline_secondary']}`}>
                          ارسل طلب <i className="fa-solid fa-hand fa-bounce"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${nurseProfilee.description} ${"text-center"}`}>
                </div>
              </div>

              <div className={nurseProfilee.parent}>
                <div className={nurseProfilee.row}>
                  <div className={"col-md-3 col-sm-6 m-4"}>
                    <div id="ShowNurseCounter" className={nurseProfilee.counter}>
                      <div className={nurseProfilee.counter_content}>
                        <div className={nurseProfilee.counter_icon}>
                          <i class="fa-solid fa-bed-pulse fa-2xl"></i>
                        </div>
                        <h3>مريض سعيد</h3>
                      </div>
                      <span className={nurseProfilee.counter_value}>
                        {/* {nurseprofileid.booking.length + nurseprofileid.booking.length} */}
                          40
                      </span>
                    </div>
                  </div>

                  <div className={"col-md-3 col-sm-6 m-4"}>
                    <div id="ShowNurseCounterFastService" className={nurseProfilee.counter}>
                      <div className={nurseProfilee.counter_content}>
                        <div className={nurseProfilee.counter_icon}>
                          <i class="fa-solid fa-syringe fa-2xl"></i>
                        </div>
                        <h3>خدمة سريعة</h3>
                      </div>
                      <span className={nurseProfilee.counter_value}>
                        {/* {nurseprofileid.booking.length} */}
                        15
                      </span>
                    </div>
                  </div>

                  <div className={"col-md-3 col-sm-6 m-4 "}>
                    <div id="ShowNurseCounterHomeShift" className={nurseProfilee.counter}>
                      <div className={nurseProfilee.counter_content}>
                        <div className={nurseProfilee.counter_icon}>
                          <i class="fa-solid fa-house-medical fa-2xl"></i>
                        </div>
                        <h3> شفت منزلي</h3>
                      </div>
                      <span className={nurseProfilee.counter_value}>
                        {/* {nurseprofileid.booking.length} */}
                        25
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <ShowNurseResume />
            </div>
          </div>
        </section>
        </Fade>
      )}
    </motion.div>
  );
}

export default ShowNurseProfile;
