import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ngsLogo from '../assets/logos/ngsLogo.svg';
import predictorsLogo from '../assets/logos/predictorsLogo.svg';
import { landingPageStyles as styles } from '../style/styles';

const LandingPage: React.FC = () => {
  // Define animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.5, duration: 0.7 } }
  };

  const sectionVariants = {
    hover: { scale: 1.05 }
  };

  const buttonHover = {
    scale: 1.1,
    transition: { duration: 0.2 }
  };

  return (
    <motion.div style={styles.container} variants={containerVariants} initial="hidden" animate="visible">
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Welcome To The Galenvs Dashboard</h1>
        <p style={styles.headerSubtitle}>Choose a section to get started!</p>
      </div>

      <div style={styles.flexContainer}>
        <motion.div style={styles.section} whileHover="hover" variants={sectionVariants}>
          <img src={predictorsLogo} alt="Predictors Logo" height={40} style={styles.logo} />
          <motion.div whileHover={buttonHover}>
            <Link to="/predictor/pathogen" style={styles.button}><span>🔬</span> Pathogen</Link>
          </motion.div>
          <motion.div whileHover={buttonHover}>
            <Link to="/predictor/blood" style={styles.button}><span>🩸</span> Blood</Link>
          </motion.div>
          <motion.div whileHover={buttonHover}>
            <Link to="/predictor/else" style={styles.button}><span>🧬</span> Else</Link>
          </motion.div>
        </motion.div>
        
        <motion.div style={styles.section} whileHover="hover" variants={sectionVariants}>
          <img src={ngsLogo} alt="NGS Logo" height={40} style={styles.logo} />
          <motion.div whileHover={buttonHover}>
            <Link to="/ngs/reportGenerator" style={styles.button}><span>📊</span> Report Generator</Link>
          </motion.div>
          <motion.div whileHover={buttonHover}>
            <Link to="/ngs/records" style={styles.button}><span>📁</span> Records</Link>
          </motion.div>
          <motion.div whileHover={buttonHover}>
            <Link to="/ngs/tableFilter" style={styles.button}><span>🔍</span> Table Filter</Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
