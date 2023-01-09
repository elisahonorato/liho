import React, { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

const About = () => {
    useEffect(() => {
        Aos.init({ duration: 2000 });
    }, [])
    return (
        <div className="App">
            <h1>About</h1>
            <div className="Grid">
                <div data-aos="fade-up" className="boxes"><h1>La complejidad y abundancia de fuentes de información y bases de datos provenientes de investigaciones científicas, supone una oportunidad disciplinar que emerge desde una integración exploratoria utilizando estos datos como materia prima.</h1> </div>
                <div data-aos="fade-up" className="boxes">2</div>
                <div data-aos="fade-up" className="boxes">1</div>
            </div>
        </div>
    )
};
export default About;


