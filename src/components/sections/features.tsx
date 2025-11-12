import * as React from "react";
import "./css/features.css"



const Features : React.FC= ()=>{

    return (
        <section id="features" className="Features">

            <div className="topPart" >
                <div className="bigTitle">
                  <h2> What we do in CareFlow  </h2>
                </div>
              <div className="description">
                these and more are the features we built to give you the best experience
              </div>
            </div>

            <div className="featuresList">
               <div className="Appoitments">
                <div className="featureLogo">
                    <img src="/icons/schedule.png" alt="appointments" />
                </div>
                <div className="title">Taking Appointements</div>
                <div className="description">Book and manage appointments online aith automatic confiramtion, no more conflicts.</div>
                </div> 
               <div className="Appoitments">
                <div className="featureLogo">
                    <img src="/icons/schedule.png" alt="appointments" />
                </div>
                <div className="title">Taking Appointements</div>
                <div className="description">Book and manage appointments online aith automatic confiramtion, no more conflicts.</div>
                </div> 
               <div className="Appoitments">
                <div className="featureLogo">
                    <img src="/icons/schedule.png" alt="appointments" />
                </div>
                <div className="title">Taking Appointements</div>
                <div className="description">Book and manage appointments online aith automatic confiramtion, no more conflicts.</div>
                </div> 
               <div className="Appoitments">
                <div className="featureLogo">
                    <img src="/icons/schedule.png" alt="appointments" />
                </div>
                <div className="title">Taking Appointements</div>
                <div className="description">Book and manage appointments online aith automatic confiramtion, no more conflicts.</div>
                </div> 
               <div className="Appoitments">
                <div className="featureLogo">
                    <img src="/icons/schedule.png" alt="appointments" />
                </div>
                <div className="title">Taking Appointements</div>
                <div className="description">Book and manage appointments online aith automatic confiramtion, no more conflicts.</div>
                </div> 

            </div>
        </section>
    )
}

export default Features