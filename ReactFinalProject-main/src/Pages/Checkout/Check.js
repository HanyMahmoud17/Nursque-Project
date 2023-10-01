import React, { useEffect } from "react";
import checkStyle from "./checkout.module.css";
import { getPatient } from "../../Redux/Slices/PatientSlice";
import { useDispatch, useSelector } from "react-redux";
import { checkOutOrder } from "../../Redux/Slices/OrderSlice";
import PaymentPage from "../PaymentPage/PaymentPage";
import Swal from 'sweetalert2'
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import {motion} from 'framer-motion'
import DarkStyle from '../../Components/DarkMode/darkBtn.module.css'
import Slide from 'react-reveal/Slide'
import Fade from 'react-reveal/Fade'

function Check() {
  const navigate = useNavigate();
  const quantity = JSON.parse(localStorage.getItem("CartTotalQuantity"));
  const price = JSON.parse(localStorage.getItem("CartTotalPrice"));
  const api = "http://localhost:3500/";

  const patientes = useSelector((state) => state.PatientSlice.patient);
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal)
  function CheckOut(id) {
    MySwal.fire({
      title: `<p> تم اتمام الدفع بنجاح</p>`,
      icon: 'success',
      customClass: {
        confirmButton: `${checkStyle.my_ok_button_class}`,
      },
    });
    dispatch(checkOutOrder(id));
    
    setTimeout(() => {
      navigate('/patientProfile');
    }, 2000);

  }
  useEffect(() => {
    dispatch(getPatient());
      const isDarkMode = localStorage.getItem("isDarkMode");
      if (isDarkMode) {
        document.querySelector("#CheckOutPage")?.classList.toggle(DarkStyle["CheckOutPage"], isDarkMode);
        document.querySelector("#CheckoutElementsTitle")?.classList.toggle(DarkStyle["CheckoutElementsTitle"], isDarkMode);
        document.querySelector("#CheckOutInfo")?.classList.toggle(DarkStyle["CheckOutInfo"], isDarkMode);
      }
  }, []);

  return (
    <motion.div id="CheckOutPage" className={checkStyle.body}
    initial={ {opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={ {opacity: 0 }}
    variants={{duration: 0.2}}
    transition={{yoyo: Infinity}}
    >
      <div className={"container"}>
        <div
          className={`${"d-flex justify-content-between"} ${
            checkStyle.BiggestContainer
          }`}
        >
          <Slide left distance="10%" duration={1500}>
          <div className="mt-5 mb-5">
            <PaymentPage />
            <a className={checkStyle.KeepGoingAndPay}>
              <button
                onClick={() => CheckOut(patientes.order[0]._id)}
                className={checkStyle.proceed}
              >
                {" "} <i class="fa-solid fa-arrow-left-long fa-fade fa-xl"></i>{" "}
                مواصلة التقدم و تأكيد الدفع الآن 
              </button> 
          
             </a>
          </div>
          </Slide>

          <Fade top distance="10%" duration={1500}>
          <div className={checkStyle.receipt}>
            <div id="CheckOutInfo" className={checkStyle.columnItems}>
              <div>
                <p>الاسم :</p>
                <h2 className={checkStyle.seller}> {patientes.name} </h2>
              </div>
              <div>
                <p>التكلفة الكلية :</p>
                <h2 className={checkStyle.cost}>{price + 30}ج.م</h2>
              </div>
              <div>
                <p> إجمالي عدد الأجهزة :</p>
                <h2 className={checkStyle.cost}>{quantity}</h2>
              </div>
            </div>

            <div id="CheckoutElementsTitle" className={checkStyle.columnProduct}>
              <p className={`${"pb-3"} ${checkStyle.columnProductTitle}`}> عناصر الطلب :</p>
              {patientes.order &&
                patientes.order.length > 0 &&
                patientes.order[patientes.order.length - 1].products.map(
                  (item) => {
                    return (
                      <div className={checkStyle.checkout}>
                        <div className={checkStyle.checkoutImg}>
                          <img src={`${api}${item.image[0]}`} />
                        </div>

                        {/* Description */}
                        <div className={checkStyle.ItemNameAndDesc}>
                          <h3 className={checkStyle.bought_items}>
                            {item.name}
                          </h3>
                          <p
                            className={`${checkStyle.bought_items} ${checkStyle.description}`}
                          >
                            {item.details}
                          </p>
                          {/* Description */}
                        </div>
                        {/* Item Quantity */}
                        <div className={checkStyle.ItemQuantity}>
                          <h3
                            className={`${checkStyle.bought_items} ${checkStyle.description}`}
                          >
                            العدد المطلوب :
                          </h3>
                          <p>{item.quantitycart} جهاز</p>
                        </div>
                        {/* Item Price */}
                        <div className={checkStyle.ItemPrice}>
                          <h3
                            className={`${checkStyle.bought_items} ${checkStyle.price}`}
                          >
                            {" "}
                            سعر الجهاز :
                          </h3>
                          <p>{item.price} ج.م</p>
                        </div>
                        {/* Item Total Price */}
                        <div className={checkStyle.ItemTotalPrice}>
                          <h3
                            className={`${checkStyle.bought_items} ${checkStyle.price}`}
                          >
                            السعرالكلي للطلب :
                          </h3>
                          <p>{item.totalPrice} ج.م</p>
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          </div>
          </Fade>

        </div>
      </div>
    </motion.div>
  );
}

export default Check;
