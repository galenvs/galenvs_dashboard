
# Galenvs Dashboard

## Project Description
Galenvs Dashboard is a unified web application that provides an intuitive interface for users to interact with both NGS (Next-Generation Sequencing) and machine learning predictor functionalities. With the Galenvs Dashboard, users can:

- **NGS Dashboard Features**:
  - Upload IonCode experiment results in multiple formats. Once uploaded, the dashboard automatically generates comprehensive reports, encompassing essential metrics such as Amplicon Coverage, Base Depth, and Uniformity.
  - Seamlessly access and manage your generated reports, ensuring you have full control over your NGS data analysis workflow.
  - Efficiently filter CNV and SNP sample results, preparing them for easy and insightful customer viewing and analysis.

- **Predictors Dashboard (Machine Learning Predictor) Features**:
 - Pathogen Delta Cq Predictor:  predict pathogen presence and changes in cycle quantification (Cq) values. This predictor offers insights into the relative abundance and dynamics of pathogens within your samples.

## Tech Stack
The project is built using the MERN stack with TypeScript. The report generation is accomplished using R Markdown. Here's a brief overview of the tech stack:

- MongoDB: A source-available cross-platform document-oriented database program.
- Express.js: A back-end web application framework for Node.js.
- React.js: A JavaScript library for building user interfaces.
- Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- TypeScript: An open-source language that builds on JavaScript by adding static type definitions.
- R Markdown: An authoring format that enables easy creation of dynamic documents, presentations, and reports from R.
- Python: An interpreted, high-level general-purpose programming language used for the training and prediction models.
- Jupyter: An open-source interactive computing environment that allows users to create and share documents containing live code, equations, visualizations, and narrative text.

## Setup and Installation
To set up and install the Galenvs Dashboard on your local machine, follow these steps:

1. Install [Node.js](https://nodejs.org/) and [R](https://www.r-project.org/) on your machine. These are essential to run the application and generate the reports.

2. Clone the repository: `git clone https://github.com/jonathan-githubofficial/galenvs_dashboard`.

3. Navigate into the project directory: `cd galenvs_dashboard`.

4. Install the dependencies:
   - For the server, navigate into the server directory (`cd server`) and run `npm install`.
   - For the client, navigate into the client directory (`cd client`) and run `npm install`.
   - [Any additional installation steps for the machine learning predictor]

   Note: If you encounter any issues installing Material-UI, try installing the packages individually with `npm install @material-ui/core` and `npm install @material-ui/icons`.

5. To install the necessary R packages and libraries for R Markdown, open R in the terminal by running the command `R`, then run the following command:
   - `install.packages(c("rmarkdown", "knitr", "tidyverse", "ggpubr", "kableExtra", "scales", "viridis", "xtable", "purrr", "gplots", "formatR"))`

6. Update the `.env` file in the server and the client directory and fill it with your environment variables.
   
   Note: You also need to update this line `knitr::opts_knit$set(root.dir = "/home/testvm/galenvs_dashboard/server/records/")` inside of the `pgx_qc.Rmd` code with the right directory of the records folder in the server directory. 

8. Start the server by running `npm run dev` in the server directory.

9. In a separate terminal, start the client by running `npm run dev -- --host` in the client directory.


## Important Notes About This Project's Further Development

### 1. Pathogen Predictors Development:
- The pathogen predictors were preprocessed, trained, and optimized using this [Google Colab Notebook](https://colab.research.google.com/drive/1S4evNfZmwAfr1tqi9OYh40RuNusimOdb?usp=sharing#scrollTo=-eP5engoL7AK).
- The Google Colab notebook is organized into distinct phases and sub-phases or steps. All procedures and methodologies are thoroughly documented within the notebook.
- It's imperative to execute everything in the specified order: Initialization -> Phase 1 -> Phase 2.
- Upon completion, an output file named `trained_model.pkl` will be generated and saved in the runtime. This file should be saved and subsequently placed within the `server/predictors_data_and_scripts` directory for integration.

### 2. Predictors Development for the Pathogen Kit:
- For the ongoing development of the predictors for the pathogen kit, consider the following steps (note that the frontend for the predictors is still under development and requires further evaluation):
  - The recipes files should be formatted either as SQL or MongoDB documents. This ensures more efficient and reliable access to the fields from both the frontend (as selectable options) and the backend.
  - Backend routes and controller logic should be implemented to facilitate the retrieval of these recipe files.
  - Input restrictions must be incorporated into the frontend. This includes defining the acceptable ranges and types of inputs for each field to ensure data integrity and accuracy.


