import React from 'react'
import Hero from '../../Components/AboutComponent/Hero/Hero'
import Work from '../../Components/AboutComponent/Work/Work'
import Ourservices from '../../Components/AboutComponent/Our-services/Ourservices'
import {motion} from 'framer-motion'
import Fade from 'react-reveal/Fade'



function About() {
  return (
    <motion.div
    initial={ {opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={ {opacity: 0 }}
      variants={{duration: 0.2}}
      transition={{yoyo: Infinity}}
  style={{overflow: 'hidden'}}
    >
      <Fade bottom distance="10%" duration={1500}>

    <Hero></Hero>
    <Work></Work>
    <Ourservices></Ourservices>
      </Fade>
    </motion.div>
    
  )
}

export default About