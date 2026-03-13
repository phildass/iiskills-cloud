"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import ModuleFinalTestComponent from "../../../components/ModuleFinalTestComponent";
import { getCurrentUser } from "../../../lib/supabaseClient";

const APP_KEY = "learn-ai";
const APP_DISPLAY = "Learn AI";
const NO_BADGES_KEY = "learn-ai-noBadges";

// Per-module final test question bank — 20 real questions per module
const FINAL_TEST_QUESTIONS = {
  1: [
    { question: "What is the most widely cited definition of Artificial Intelligence?", options: ["Robots that can walk and talk", "The simulation of human intelligence processes by computer systems", "A programming language used for data science", "A type of database management system"], correct_answer: 1 },
    { question: "Who proposed the Turing Test as a measure of machine intelligence?", options: ["Alan Turing", "John McCarthy", "Marvin Minsky", "Claude Shannon"], correct_answer: 0 },
    { question: "Which term describes an AI system designed to perform a single specific task?", options: ["Artificial General Intelligence (AGI)", "Super AI", "Narrow AI", "Symbolic AI"], correct_answer: 2 },
    { question: "What is machine learning?", options: ["Programming computers with explicit rules", "A subset of AI where systems learn from data without being explicitly programmed", "A method of building robots", "A database querying language"], correct_answer: 1 },
    { question: "What is the 'AI winter'?", options: ["A slow season for AI job hiring", "Periods of reduced funding and interest in AI research due to unmet expectations", "A type of neural network shutdown", "The period before modern computers were invented"], correct_answer: 1 },
    { question: "What are the three main types of machine learning?", options: ["Supervised, unsupervised, and reinforcement learning", "Deep learning, shallow learning, and transfer learning", "Regression, classification, and clustering", "Neural, symbolic, and statistical learning"], correct_answer: 0 },
    { question: "What is natural language processing (NLP)?", options: ["Teaching humans to communicate with machines using gestures", "A branch of AI enabling computers to understand and generate human language", "A method of compressing text files", "A type of optical character recognition"], correct_answer: 1 },
    { question: "What is computer vision?", options: ["A graphics processing technique", "An AI field enabling computers to interpret and understand visual information from images and videos", "The display resolution of AI systems", "A programming interface for cameras"], correct_answer: 1 },
    { question: "What is a training dataset in AI?", options: ["A checklist for AI developers", "A labelled collection of data used to teach a machine learning model to make predictions", "A database of AI research papers", "The hardware used to run AI models"], correct_answer: 1 },
    { question: "What distinguishes deep learning from traditional machine learning?", options: ["Deep learning uses larger datasets only", "Deep learning uses multi-layered neural networks to automatically extract features from raw data", "Deep learning requires human labelling of every data point", "Deep learning is faster but less accurate"], correct_answer: 1 },
    { question: "What is an algorithm?", options: ["A type of computer chip", "A step-by-step set of instructions to solve a problem or perform a task", "A database structure", "A form of computer virus"], correct_answer: 1 },
    { question: "What is the main ethical concern about AI bias?", options: ["AI systems use too much electricity", "AI models trained on biased data can perpetuate and amplify discriminatory outcomes", "AI is difficult to explain to non-experts", "AI systems are often hacked"], correct_answer: 1 },
    { question: "What is a large language model (LLM)?", options: ["A library of written books converted to digital format", "A deep learning model trained on vast amounts of text data to generate and understand language", "A translation service", "A speech-to-text transcription tool"], correct_answer: 1 },
    { question: "What is reinforcement learning?", options: ["Learning by memorising examples", "A type of learning where an agent learns by receiving rewards or penalties for actions in an environment", "Learning from labelled training data", "Learning by clustering similar items together"], correct_answer: 1 },
    { question: "What is the difference between AI and automation?", options: ["They are the same thing", "Automation follows fixed rules; AI adapts and learns from data", "Automation is more advanced than AI", "AI only works with physical robots"], correct_answer: 1 },
    { question: "What is a model in machine learning?", options: ["A physical replica of a computer", "A mathematical representation learned from data that makes predictions or decisions", "A type of AI hardware", "A software interface for databases"], correct_answer: 1 },
    { question: "What is overfitting in machine learning?", options: ["When a model is too slow to process data", "When a model learns the training data too well, performing poorly on unseen data", "When a model is trained on too little data", "When a model predicts all outcomes correctly"], correct_answer: 1 },
    { question: "What is a neural network?", options: ["A human brain scan", "A computational model of interconnected nodes inspired by biological neurons", "A network security system", "A type of database query language"], correct_answer: 1 },
    { question: "What is AI ethics?", options: ["Rules for AI programmers' workplace conduct", "The study of moral principles governing the design, deployment, and impact of AI systems", "The legal framework for robot manufacturing", "A branch of philosophy unrelated to technology"], correct_answer: 1 },
    { question: "What does the term 'black box' mean in AI?", options: ["A server used for storing AI models", "An AI system whose internal decision-making process is opaque and not easily interpretable", "A type of encrypted database", "A secure AI testing environment"], correct_answer: 1 },
  ],
  2: [
    { question: "Which of the following best describes Artificial Narrow Intelligence (ANI)?", options: ["AI that can reason across all domains like a human", "AI designed and trained to perform a single specific task", "AI that has surpassed human intelligence in all areas", "AI that can experience emotions"], correct_answer: 1 },
    { question: "What is Artificial General Intelligence (AGI)?", options: ["An AI that performs one task extremely well", "A hypothetical AI capable of performing any intellectual task a human can", "The current state of most commercial AI", "An AI system with built-in consciousness"], correct_answer: 1 },
    { question: "What is a reactive machine in AI?", options: ["An AI system that anticipates future scenarios", "The most basic type of AI that responds to inputs without memory or learning", "A robot that reacts to physical stimuli", "An AI with emotional responses"], correct_answer: 1 },
    { question: "What is a 'limited memory' AI?", options: ["An AI that never learns from new data", "An AI that uses past experiences to inform current decisions, such as self-driving cars", "An AI with restricted storage capacity", "A simple calculator program"], correct_answer: 1 },
    { question: "What is theory of mind AI?", options: ["An existing commercial AI product", "A proposed AI category capable of understanding human emotions, beliefs, and intentions", "A system for analysing psychotherapy transcripts", "An AI that learns by reading philosophy books"], correct_answer: 1 },
    { question: "What is a generative AI model?", options: ["An AI that categorises existing data", "An AI that can create new content such as text, images, or code", "An AI that generates electricity", "An AI used exclusively for scientific research"], correct_answer: 1 },
    { question: "What is a GAN (Generative Adversarial Network)?", options: ["A network security protocol", "A framework where two neural networks — a generator and a discriminator — compete to create realistic outputs", "A type of reinforcement learning algorithm", "A language translation model"], correct_answer: 1 },
    { question: "What is expert system AI?", options: ["AI trained by leading academic experts only", "A rule-based AI system that emulates the decision-making of a human expert in a specific domain", "The most advanced form of modern AI", "An AI that replaces human experts entirely"], correct_answer: 1 },
    { question: "Which of these is an example of Narrow AI in daily life?", options: ["A robot with human-level general intelligence", "A voice assistant like Siri answering specific questions", "An AI that can perform any job a human can", "A self-aware computer system"], correct_answer: 1 },
    { question: "What is robotic process automation (RPA)?", options: ["Robots performing manual labour", "Software that automates repetitive rule-based digital tasks, such as data entry", "Physical robots programmed with AI", "An AI system for managing robotic factories"], correct_answer: 1 },
    { question: "What is federated learning?", options: ["Learning from government data only", "A method of training AI models across multiple decentralised devices while keeping data local", "A type of transfer learning between organisations", "Group learning sessions for AI researchers"], correct_answer: 1 },
    { question: "What is transfer learning?", options: ["Copying an AI model from one computer to another", "Applying knowledge gained in one domain to improve performance in a related domain", "Transferring data between AI systems", "A method of data augmentation"], correct_answer: 1 },
    { question: "What type of AI is used in recommendation systems on platforms like Netflix?", options: ["Reactive machine AI", "Expert systems", "Collaborative filtering and machine learning models", "Robotic process automation"], correct_answer: 2 },
    { question: "What is autonomous AI?", options: ["AI that works without electricity", "AI that can operate independently and make decisions without continuous human direction", "AI that is open source", "AI running without an internet connection"], correct_answer: 1 },
    { question: "What is symbolic AI?", options: ["AI that uses neural networks", "AI that represents knowledge through human-readable symbols and logical rules", "AI that uses only images and icons", "An early form of robotics"], correct_answer: 1 },
    { question: "What is the main challenge in achieving Artificial General Intelligence?", options: ["Lack of processing power alone", "Creating systems that can generalise, reason, and learn across arbitrary domains as flexibly as humans", "Making AI systems faster", "Connecting AI to the internet"], correct_answer: 1 },
    { question: "What is an AI chatbot?", options: ["A physical robot that speaks", "A software application using AI to simulate text or voice conversations with users", "A human customer service agent using AI tools", "A type of search engine"], correct_answer: 1 },
    { question: "What is the primary risk of Artificial Superintelligence (ASI)?", options: ["It will be too expensive to build", "An ASI with misaligned goals could act in ways harmful to humanity and difficult to control", "It will only work on supercomputers", "It will make human jobs more difficult"], correct_answer: 1 },
    { question: "What is multimodal AI?", options: ["AI that supports multiple programming languages", "AI that processes and generates multiple types of data — text, images, audio, and video — in an integrated way", "AI trained on data from multiple countries", "AI deployed on multiple hardware platforms"], correct_answer: 1 },
    { question: "What distinguishes a foundation model from a traditional ML model?", options: ["Foundation models are smaller and faster", "Foundation models are large pre-trained models on broad data that can be adapted to many downstream tasks", "Foundation models only work for image classification", "Foundation models do not use neural networks"], correct_answer: 1 },
  ],
  3: [
    { question: "What is data science?", options: ["The science of computer hardware", "An interdisciplinary field using statistics, programming, and domain knowledge to extract insights from data", "A branch of pure mathematics", "The study of scientific databases"], correct_answer: 1 },
    { question: "What is exploratory data analysis (EDA)?", options: ["Writing the final report of a data project", "An initial investigation of data to discover patterns, spot anomalies, and check assumptions", "Deploying a machine learning model", "Cleaning and labelling raw data"], correct_answer: 1 },
    { question: "What does the Pandas library in Python primarily do?", options: ["Creates visualisations and charts", "Provides data structures and tools for data manipulation and analysis", "Builds machine learning models", "Connects to databases"], correct_answer: 1 },
    { question: "What is data wrangling?", options: ["Securing data with encryption", "The process of cleaning, transforming, and organising raw data into a usable format", "Presenting data in reports", "Collecting data from surveys"], correct_answer: 1 },
    { question: "What is a null value in a dataset?", options: ["A value of zero", "A missing or undefined value in a data field", "A negative number", "A duplicate record"], correct_answer: 1 },
    { question: "What is data imputation?", options: ["Removing all rows with missing data", "The process of filling in missing values using statistical or predictive methods", "Adding new columns to a dataset", "Converting data types"], correct_answer: 1 },
    { question: "What is a correlation coefficient?", options: ["The number of rows in a dataset", "A statistical measure indicating the strength and direction of the relationship between two variables", "The average value of a dataset", "The difference between maximum and minimum values"], correct_answer: 1 },
    { question: "What is the difference between mean, median, and mode?", options: ["They are all the same measure of central tendency", "Mean is the average; median is the middle value; mode is the most frequent value", "Mean is the most frequent; median is the average; mode is the middle", "They are all measures of data spread"], correct_answer: 1 },
    { question: "What is a histogram?", options: ["A type of bar chart showing the distribution of a continuous variable", "A timeline of historical events", "A type of scatter plot", "A geographic map of data points"], correct_answer: 0 },
    { question: "What is feature engineering?", options: ["Designing computer chips", "The process of creating or transforming input variables to improve machine learning model performance", "Writing documentation for datasets", "Collecting data from online sources"], correct_answer: 1 },
    { question: "What is the train-test split?", options: ["Dividing a dataset into a portion for training a model and a separate portion for evaluating it", "Splitting code into training scripts and test scripts", "Separating numeric and categorical features", "A method for splitting data by time period"], correct_answer: 0 },
    { question: "What is a confusion matrix?", options: ["A table showing a model's correct and incorrect predictions for each class", "A complex formula for neural network training", "A matrix of correlations between features", "A grid of hyperparameters tested during model tuning"], correct_answer: 0 },
    { question: "What is data normalisation?", options: ["Removing outliers from a dataset", "Scaling numeric features to a standard range to prevent variables with large scales from dominating models", "Translating data into different formats", "Filling in missing values"], correct_answer: 1 },
    { question: "What is the purpose of cross-validation?", options: ["Testing model performance on the training set", "Estimating how well a model generalises to unseen data by evaluating it on multiple data splits", "Checking if data is correctly formatted", "Validating data sources for accuracy"], correct_answer: 1 },
    { question: "What does SQL stand for?", options: ["Structured Query Language", "Sequential Query Language", "Standard Question Library", "Software Query List"], correct_answer: 0 },
    { question: "What is an outlier in data analysis?", options: ["The median value of a dataset", "A data point that is significantly different from other observations in a dataset", "A missing data record", "The most common value in a dataset"], correct_answer: 1 },
    { question: "What is precision in the context of a classification model?", options: ["The percentage of actual positives correctly identified", "The percentage of predicted positives that are actually positive", "The overall accuracy of the model", "The area under the ROC curve"], correct_answer: 1 },
    { question: "What is recall (sensitivity) in classification?", options: ["The percentage of predicted positives that are correct", "The percentage of actual positives that the model correctly identified", "The speed at which a model makes predictions", "The number of features used by the model"], correct_answer: 1 },
    { question: "What is the difference between structured and unstructured data?", options: ["Structured data is large; unstructured data is small", "Structured data is organised in predefined formats (e.g. tables); unstructured data lacks a fixed format (e.g. text, images)", "Structured data is collected by surveys; unstructured from databases", "There is no meaningful difference"], correct_answer: 1 },
    { question: "What is a data pipeline?", options: ["Underground cables connecting data centres", "A series of automated processes that move and transform data from source to destination", "A visual chart of data relationships", "A security firewall for data systems"], correct_answer: 1 },
  ],
  4: [
    { question: "What type of language is Python primarily classified as?", options: ["Compiled low-level language", "High-level, interpreted, dynamically typed language", "Assembly language", "Hardware description language"], correct_answer: 1 },
    { question: "What is a Python list?", options: ["An ordered, mutable collection of items that can hold mixed data types", "An unordered collection of unique items", "A fixed-size array of numbers", "A key-value mapping structure"], correct_answer: 0 },
    { question: "What is a Python dictionary?", options: ["A sorted list of words with definitions", "An unordered collection of key-value pairs", "A type of neural network layer", "A library for text processing"], correct_answer: 1 },
    { question: "What does the NumPy library provide for AI development?", options: ["Database connectivity", "Efficient multi-dimensional array operations and mathematical functions essential for numerical computation", "Web scraping tools", "Graphical user interfaces"], correct_answer: 1 },
    { question: "What is a lambda function in Python?", options: ["A named multi-line function", "A small anonymous function defined with the lambda keyword", "A recursive function", "A function imported from a library"], correct_answer: 1 },
    { question: "What is pip in Python?", options: ["A Python data structure", "The package installer for Python, used to install and manage libraries", "A type of Python loop", "A built-in Python function"], correct_answer: 1 },
    { question: "What is a virtual environment in Python?", options: ["A simulated computer for testing", "An isolated Python environment allowing different projects to use different package versions", "A cloud-based coding platform", "A GPU environment for deep learning"], correct_answer: 1 },
    { question: "What does the scikit-learn library provide?", options: ["Deep learning model architectures", "A comprehensive set of machine learning algorithms and tools for Python", "Data visualisation charts", "Database connection tools"], correct_answer: 1 },
    { question: "What is Keras?", options: ["A Python data manipulation library", "A high-level deep learning API, originally standalone and now integrated with TensorFlow", "A Python testing framework", "A statistical analysis library"], correct_answer: 1 },
    { question: "What is a Jupyter Notebook?", options: ["A Microsoft Word add-in for coding", "An interactive web-based computing environment for writing and running code, viewing outputs, and adding narrative text", "A Python debugger", "A version control system"], correct_answer: 1 },
    { question: "What is list comprehension in Python?", options: ["Understanding how lists work", "A concise syntax for creating a list from an iterable, often replacing a for-loop", "Sorting a list in Python", "Merging two lists together"], correct_answer: 1 },
    { question: "What does the `shape` attribute of a NumPy array return?", options: ["The data type of the array", "The dimensions of the array as a tuple", "The total number of elements", "The memory size of the array"], correct_answer: 1 },
    { question: "What is the purpose of train_test_split in scikit-learn?", options: ["To clean and normalise data", "To randomly split a dataset into training and testing subsets", "To cross-validate a model", "To scale features to a standard range"], correct_answer: 1 },
    { question: "What is vectorisation in the context of NumPy?", options: ["Converting text to numbers", "Performing operations on entire arrays at once without explicit loops, using optimised C code under the hood", "Creating feature vectors for ML", "Visualising high-dimensional data"], correct_answer: 1 },
    { question: "What is a Python decorator?", options: ["A way to add comments to code", "A function that wraps another function to extend or modify its behaviour without changing its source code", "A UI design element", "A type of loop"], correct_answer: 1 },
    { question: "What does `pd.read_csv()` do in Pandas?", options: ["Saves a DataFrame to a CSV file", "Reads a CSV file from disk into a Pandas DataFrame", "Creates a new empty DataFrame", "Converts a DataFrame to JSON"], correct_answer: 1 },
    { question: "What is a Python generator?", options: ["A function that creates random numbers", "A function that yields values one at a time using `yield`, enabling memory-efficient iteration", "A tool for generating Python boilerplate code", "A class that creates other classes"], correct_answer: 1 },
    { question: "What is the purpose of the `requirements.txt` file in a Python project?", options: ["Documenting project goals", "Listing all Python package dependencies so they can be installed consistently across environments", "Storing environment variables", "Defining test cases"], correct_answer: 1 },
    { question: "What is broadcasting in NumPy?", options: ["Sending data over a network", "The ability to perform arithmetic operations on arrays of different shapes by automatically expanding dimensions", "Creating multiple copies of an array", "Visualising array data"], correct_answer: 1 },
    { question: "What is the difference between `==` and `is` in Python?", options: ["They are identical operators", "`==` checks value equality; `is` checks object identity (whether both variables point to the same object in memory)", "`is` is used for numbers; `==` for strings", "`is` is a comparison; `==` is an assignment"], correct_answer: 1 },
  ],
  5: [
    { question: "What is supervised learning?", options: ["Learning without labelled data", "Learning from labelled training data where the model maps inputs to known outputs", "Learning by trial and error with rewards", "Unsupervised clustering of similar items"], correct_answer: 1 },
    { question: "What is linear regression used for?", options: ["Classifying data into categories", "Predicting a continuous numeric output based on input features", "Clustering data points", "Detecting anomalies in datasets"], correct_answer: 1 },
    { question: "What is logistic regression used for?", options: ["Predicting continuous numeric values", "Binary or multi-class classification despite its name containing 'regression'", "Clustering unlabelled data", "Reducing the dimensionality of data"], correct_answer: 1 },
    { question: "What is a decision tree?", options: ["An organisational chart of an AI team", "A tree-like model of decisions and outcomes used for classification and regression", "A diagram of neural network layers", "A graph of training loss over time"], correct_answer: 1 },
    { question: "What is a random forest?", options: ["A dataset collected in a forest", "An ensemble of decision trees that combines their predictions to improve accuracy and reduce overfitting", "A type of deep learning model", "A clustering algorithm"], correct_answer: 1 },
    { question: "What is the bias-variance trade-off?", options: ["The balance between model complexity and training speed", "The tension between a model being too simple (high bias, underfitting) and too complex (high variance, overfitting)", "The balance between labelled and unlabelled data", "The trade-off between precision and recall"], correct_answer: 1 },
    { question: "What is a support vector machine (SVM)?", options: ["A neural network with support layers", "A classifier that finds the optimal hyperplane maximising the margin between classes", "A type of decision tree", "A clustering algorithm using centroids"], correct_answer: 1 },
    { question: "What is the k-nearest neighbours (kNN) algorithm?", options: ["A method for finding k clusters in data", "A classifier that assigns a label based on the majority class among the k closest training examples", "A neural network with k hidden layers", "An algorithm for sorting k items"], correct_answer: 1 },
    { question: "What is gradient descent?", options: ["Descending through a decision tree", "An optimisation algorithm that iteratively adjusts model parameters in the direction that reduces loss", "A type of feature normalisation", "A method for splitting training data"], correct_answer: 1 },
    { question: "What is a loss function?", options: ["A measure of how much data was lost during training", "A function quantifying how far a model's predictions are from the actual target values", "The computational cost of training a model", "A metric for measuring model inference speed"], correct_answer: 1 },
    { question: "What does XGBoost stand for and what is it?", options: ["Extra Gradient Boost — a simple linear model", "eXtreme Gradient Boosting — a powerful ensemble method winning many ML competitions", "Extended General Boosting algorithm", "Exhaustive Grid Boosting technique"], correct_answer: 1 },
    { question: "What is feature selection?", options: ["Choosing which model to use", "The process of identifying and using the most relevant input variables for a model", "Normalising feature values", "Creating new features from existing data"], correct_answer: 1 },
    { question: "What is regularisation in machine learning?", options: ["Standardising the scale of features", "A technique that penalises model complexity to prevent overfitting", "Removing outliers from training data", "Splitting data into regular-sized batches"], correct_answer: 1 },
    { question: "What is the ROC-AUC score?", options: ["A measure of model training speed", "Area under the Receiver Operating Characteristic curve — measures a classifier's ability to distinguish between classes", "The ratio of correct to incorrect predictions", "A measure of recall at a fixed precision"], correct_answer: 1 },
    { question: "What is cross-validation used for?", options: ["Checking data for errors", "Estimating model generalisation by training and testing on multiple data splits", "Validating raw data sources", "Comparing two different datasets"], correct_answer: 1 },
    { question: "What is the purpose of hyperparameter tuning?", options: ["Adjusting model weights during training", "Finding the best configuration settings for a model that are not learned from data", "Cleaning the training dataset", "Selecting training data"], correct_answer: 1 },
    { question: "What is Naive Bayes?", options: ["A simple neural network", "A probabilistic classifier based on Bayes' theorem that assumes features are independent of each other", "A type of decision tree", "A linear regression variant"], correct_answer: 1 },
    { question: "What is the difference between bagging and boosting?", options: ["They are the same ensemble technique", "Bagging trains models in parallel on random data subsets; boosting trains models sequentially, each correcting the previous", "Bagging is for regression; boosting for classification", "Bagging uses decision trees; boosting uses SVMs"], correct_answer: 1 },
    { question: "What is the F1 score?", options: ["The first-round accuracy of a model", "The harmonic mean of precision and recall, providing a single balanced metric for classification", "The accuracy of a model on the first fold of cross-validation", "A measure of model training speed"], correct_answer: 1 },
    { question: "What is label encoding?", options: ["Adding labels to scatter plots", "Converting categorical text labels into numeric values for use in machine learning models", "Encrypting sensitive data", "Adding more labels to a dataset"], correct_answer: 1 },
  ],
  6: [
    { question: "What is unsupervised learning?", options: ["Learning from labelled data", "Learning patterns from unlabelled data without predefined target outputs", "Learning by trial and error with rewards", "Training a model without a computer"], correct_answer: 1 },
    { question: "What is the k-means clustering algorithm?", options: ["An algorithm that finds k decision boundaries", "An algorithm that partitions data into k clusters by iteratively assigning points to the nearest centroid", "A supervised classification method with k classes", "A method for reducing data to k dimensions"], correct_answer: 1 },
    { question: "What is PCA (Principal Component Analysis)?", options: ["A clustering technique", "A dimensionality reduction technique that transforms data into orthogonal components capturing maximum variance", "A type of neural network", "A method for detecting anomalies"], correct_answer: 1 },
    { question: "What is the purpose of dimensionality reduction?", options: ["Increasing the number of features in a dataset", "Reducing the number of input variables while preserving important information, to reduce complexity and improve models", "Removing rows from a dataset", "Scaling feature values"], correct_answer: 1 },
    { question: "What is hierarchical clustering?", options: ["Clustering by hand in stages", "A clustering method that builds a tree-like hierarchy of nested clusters, either bottom-up or top-down", "Clustering data using a k-value", "A type of decision tree"], correct_answer: 1 },
    { question: "What is DBSCAN?", options: ["A database scanning tool", "A density-based clustering algorithm that identifies clusters of arbitrary shape and marks outliers as noise", "A type of supervised classifier", "A dimensionality reduction method"], correct_answer: 1 },
    { question: "What is an autoencoder?", options: ["A tool for automatically writing code", "A neural network trained to compress input data into a lower-dimensional representation and then reconstruct it", "A type of recurrent neural network", "A method for labelling data automatically"], correct_answer: 1 },
    { question: "What is the elbow method in k-means?", options: ["A physical gesture for data scientists", "A technique for choosing k by plotting inertia vs. k and looking for the point where improvement slows (the 'elbow')", "A method for removing outliers", "A regularisation technique"], correct_answer: 1 },
    { question: "What is t-SNE used for?", options: ["Training supervised models", "Visualising high-dimensional data by reducing it to 2D or 3D in a way that preserves local structure", "Tuning model hyperparameters", "Cleaning missing values"], correct_answer: 1 },
    { question: "What is an anomaly detection algorithm?", options: ["An algorithm that detects bugs in code", "An algorithm that identifies rare or unusual data points that deviate significantly from the norm", "An algorithm for detecting fraud only", "A classification algorithm for labelled data"], correct_answer: 1 },
    { question: "What is the silhouette score?", options: ["A measure of how visually clear a data visualisation is", "A metric evaluating clustering quality by comparing intra-cluster cohesion to inter-cluster separation", "The accuracy of an unsupervised model on test data", "A measure of how many clusters are found"], correct_answer: 1 },
    { question: "What is a GAN in the context of generative AI?", options: ["A type of recurrent neural network", "A framework where a generator creates data and a discriminator judges its authenticity, training each other adversarially", "A genetic algorithm for neural networks", "A type of gradient descent optimiser"], correct_answer: 1 },
    { question: "What is feature extraction in unsupervised learning?", options: ["Selecting the best features from labelled data", "Automatically identifying meaningful representations from raw data without supervision", "Engineering new features manually", "Removing irrelevant features from a dataset"], correct_answer: 1 },
    { question: "What is topic modelling?", options: ["Building a 3D model of a topic", "An unsupervised NLP technique for discovering abstract topics within a corpus of documents", "Classifying documents into predefined topics", "A method for summarising text"], correct_answer: 1 },
    { question: "What is Latent Dirichlet Allocation (LDA)?", options: ["A dimensionality reduction technique for images", "A probabilistic topic modelling algorithm that assigns words to topics and topics to documents", "A type of clustering for numerical data", "A dimensionality reduction technique related to PCA"], correct_answer: 1 },
    { question: "What is matrix factorisation used for in unsupervised learning?", options: ["Inverting matrices for linear algebra", "Decomposing a matrix into lower-rank factors to discover latent structure, widely used in recommendation systems", "Multiplying feature matrices for deep learning", "A method for speeding up k-means"], correct_answer: 1 },
    { question: "What is UMAP?", options: ["A network mapping protocol", "Uniform Manifold Approximation and Projection — a fast dimensionality reduction technique that preserves both local and global structure", "A clustering evaluation metric", "An unsupervised anomaly detector"], correct_answer: 1 },
    { question: "What is the main challenge in evaluating unsupervised learning models?", options: ["They are always too slow to train", "There are no ground-truth labels, making it harder to objectively measure quality", "The models are too simple", "Unsupervised models cannot be deployed in production"], correct_answer: 1 },
    { question: "What is self-supervised learning?", options: ["A model that supervises itself with rewards", "A learning approach where the model generates its own supervision signal from unlabelled data, e.g., predicting masked words", "Supervised learning without a teacher", "A type of reinforcement learning"], correct_answer: 1 },
    { question: "What is a variational autoencoder (VAE)?", options: ["A standard autoencoder with variable learning rate", "A generative model that learns a probabilistic latent space, enabling sampling of new data points", "A recurrent autoencoder for time series", "An autoencoder that varies the number of hidden layers"], correct_answer: 1 },
  ],
  7: [
    { question: "What is a neural network?", options: ["A network of connected databases", "A computational model of interconnected nodes (neurons) organised in layers that learn from data", "A type of physical brain scan", "A network security architecture"], correct_answer: 1 },
    { question: "What is backpropagation?", options: ["Feeding data backwards through a model", "The algorithm for training neural networks by calculating the gradient of the loss with respect to each weight and updating weights accordingly", "Running a model in reverse to undo predictions", "A type of recurrent neural network processing"], correct_answer: 1 },
    { question: "What is a ReLU activation function?", options: ["A function that outputs values between 0 and 1", "Rectified Linear Unit — outputs the input directly if positive, otherwise zero; widely used to introduce non-linearity", "A function producing outputs between -1 and 1", "A probabilistic activation function"], correct_answer: 1 },
    { question: "What is a convolutional neural network (CNN) primarily used for?", options: ["Processing sequential text data", "Processing grid-like data such as images by applying convolutional filters to detect local features", "Time series forecasting", "Reinforcement learning tasks"], correct_answer: 1 },
    { question: "What is a recurrent neural network (RNN) designed for?", options: ["Image recognition tasks", "Processing sequential data such as time series or text by maintaining a hidden state across steps", "Object detection in video", "Generating images from text descriptions"], correct_answer: 1 },
    { question: "What problem do LSTMs (Long Short-Term Memory networks) solve?", options: ["The overfitting problem in deep networks", "The vanishing gradient problem in standard RNNs, enabling learning of long-range dependencies", "Slow training of convolutional networks", "The curse of dimensionality"], correct_answer: 1 },
    { question: "What is the Transformer architecture?", options: ["A type of convolutional network", "An architecture using self-attention mechanisms to process sequences in parallel, forming the basis of modern LLMs", "A GAN-based image generation model", "A recurrent network variant"], correct_answer: 1 },
    { question: "What is dropout in neural networks?", options: ["Removing all training data", "A regularisation technique that randomly deactivates neurons during training to prevent overfitting", "Reducing the learning rate over time", "Removing low-weight connections permanently"], correct_answer: 1 },
    { question: "What is batch normalisation?", options: ["Normalising the training dataset before feeding it to a model", "A technique that normalises the inputs to each layer within a batch to stabilise and speed up training", "Dividing data into equal-sized batches", "Normalising model weights after each epoch"], correct_answer: 1 },
    { question: "What is the vanishing gradient problem?", options: ["Gradients becoming too large during backpropagation", "Gradients shrinking to near zero in deep networks, preventing effective weight updates in early layers", "The loss function reaching zero too quickly", "Weights initialised too close to zero"], correct_answer: 1 },
    { question: "What is the Adam optimiser?", options: ["A genetic algorithm for neural networks", "An adaptive gradient optimiser combining momentum and RMSProp, widely used for training deep learning models", "An optimiser named after Adam at Google Brain", "A gradient descent variant for classification only"], correct_answer: 1 },
    { question: "What is transfer learning in deep learning?", options: ["Transferring data between GPUs", "Using weights from a pre-trained model as a starting point for a new but related task", "Moving a model from training to production", "Training a model on multiple datasets simultaneously"], correct_answer: 1 },
    { question: "What is an epoch in neural network training?", options: ["A single weight update", "One complete pass through the entire training dataset", "A single batch of training data", "A model evaluation step"], correct_answer: 1 },
    { question: "What is a fully connected (dense) layer?", options: ["A layer where only adjacent neurons are connected", "A layer where every neuron receives input from every neuron in the previous layer", "A layer used only in the output of a network", "A convolutional layer with full padding"], correct_answer: 1 },
    { question: "What is attention mechanism in deep learning?", options: ["A method for the model to focus computational resources on the most relevant parts of input when making predictions", "A technique for visualising neural networks", "A method for selecting the best model architecture", "An alert system for model performance degradation"], correct_answer: 0 },
    { question: "What is fine-tuning a pre-trained model?", options: ["Adjusting model architecture", "Continuing training a pre-trained model on a specific downstream dataset, updating its weights for the new task", "Cleaning data before training", "Removing unnecessary layers from a model"], correct_answer: 1 },
    { question: "What is a hyperparameter in neural networks?", options: ["A parameter learned during training", "A configuration setting set before training, such as learning rate, number of layers, or batch size", "The weights of a fully trained model", "A statistical measure of model accuracy"], correct_answer: 1 },
    { question: "What is the softmax function used for in neural networks?", options: ["Activation in hidden layers", "Converting raw output scores into a probability distribution for multi-class classification", "Normalising input features", "Reducing overfitting"], correct_answer: 1 },
    { question: "What is a residual network (ResNet)?", options: ["A network that recycles discarded gradients", "A deep network architecture using skip connections that add the input directly to the output of a layer, enabling very deep networks", "A type of recurrent network", "A network that resets weights periodically"], correct_answer: 1 },
    { question: "What is the difference between a shallow and a deep neural network?", options: ["Shallow networks process images; deep networks process text", "Shallow networks have one or few hidden layers; deep networks have many layers, enabling learning of hierarchical representations", "Shallow networks are newer than deep networks", "Deep networks are always slower and less accurate"], correct_answer: 1 },
  ],
  8: [
    { question: "What is AI monetisation?", options: ["Reducing costs using AI", "Generating revenue by building products, services, or workflows powered by AI capabilities", "Investing in AI company stocks", "Measuring the financial value of AI research"], correct_answer: 1 },
    { question: "What is a SaaS (Software as a Service) AI product?", options: ["AI software sold as a one-time licence", "An AI-powered application delivered over the internet via subscription, without users managing infrastructure", "A software package downloaded and installed locally", "An AI service sold directly to governments"], correct_answer: 1 },
    { question: "What is prompt engineering?", options: ["Writing code to train AI models", "Crafting effective inputs to AI language models to elicit accurate, relevant, and useful responses", "Designing hardware for AI systems", "Engineering prompts for database queries"], correct_answer: 1 },
    { question: "What is white-labelling an AI product?", options: ["Building AI from scratch and selling it", "Licensing an existing AI product or service and rebranding it as your own for sale to customers", "Publishing AI research without attribution", "Removing branding from open-source AI models"], correct_answer: 1 },
    { question: "What is an API in the context of AI monetisation?", options: ["An advanced programming algorithm", "An Application Programming Interface allowing developers to access AI capabilities over the internet for a fee per use", "An automated processing interface for databases", "A type of AI hardware", ], correct_answer: 1 },
    { question: "What is a freemium model in AI products?", options: ["Offering AI tools at a permanently free price", "Offering basic AI features for free and charging for advanced features or higher usage limits", "A pricing model where all users pay a minimum fee", "Providing free trials that automatically convert to paid subscriptions"], correct_answer: 1 },
    { question: "What is AI consulting?", options: ["Selling AI hardware", "Providing expert advice and implementation services to help organisations adopt AI strategies and technologies", "Training AI models for research institutions", "Managing cloud computing infrastructure for AI"], correct_answer: 1 },
    { question: "What is no-code AI?", options: ["AI that operates without any programming", "Platforms enabling non-technical users to build and deploy AI applications using visual interfaces without writing code", "AI built entirely in JavaScript", "AI that cannot be modified after deployment"], correct_answer: 1 },
    { question: "What is an AI agent?", options: ["A human who tests AI models", "An autonomous AI system that can perceive its environment, make decisions, and take actions to achieve goals", "A software tool for managing AI subscriptions", "A chatbot limited to answering FAQs"], correct_answer: 1 },
    { question: "What is retrieval-augmented generation (RAG)?", options: ["A method to clean messy training data", "A technique combining a language model with a document retrieval system to ground responses in specific knowledge bases", "A GAN variant for image generation", "A fine-tuning approach for small datasets"], correct_answer: 1 },
    { question: "What is content generation as an AI business model?", options: ["Publishing academic AI research papers", "Using AI to create written, visual, or audio content at scale for marketing, media, or creative industries as a service", "Training AI on existing content", "Curating human-written content using AI filters"], correct_answer: 1 },
    { question: "What is the importance of a minimum viable product (MVP) when launching an AI product?", options: ["An MVP ensures the product is fully tested before launch", "A lightweight initial version that tests the core value proposition with real users before investing in full development", "A product that meets minimum safety standards", "A product sold at the minimum viable price"], correct_answer: 1 },
    { question: "What is an AI marketplace?", options: ["A physical store selling AI hardware", "A platform where AI models, datasets, and tools can be discovered, shared, and monetised by developers and organisations", "A job board for AI professionals", "A stock exchange for AI companies"], correct_answer: 1 },
    { question: "What is data labelling as a service?", options: ["An AI that labels data automatically", "A service providing human annotators who label datasets to train supervised machine learning models", "A platform for visualising labelled data", "An API for automatic data categorisation"], correct_answer: 1 },
    { question: "What is AI automation as a revenue model?", options: ["Automating the training of AI models", "Selling or licensing AI-powered workflow automation tools that replace manual tasks, generating recurring revenue", "Using AI to automate billing processes", "Building automated chatbots for internal use only"], correct_answer: 1 },
    { question: "What is a tokenisation model in LLM APIs?", options: ["A security authentication method", "A pricing mechanism where users pay per token (word fragment) of input and output processed by a language model", "A method of converting text to numbers for training", "A type of data encryption"], correct_answer: 1 },
    { question: "What is AI personalisation?", options: ["Customising AI models to each developer's preferences", "Using AI to tailor experiences, recommendations, or content to individual users based on their behaviour and preferences", "Training separate AI models for each user", "Personalising the user interface of AI software"], correct_answer: 1 },
    { question: "What are the main costs to consider when building an AI product?", options: ["Only the cost of hiring AI researchers", "Compute (cloud/GPU), data acquisition and labelling, model training and inference, and engineering talent", "Hardware manufacturing costs only", "Marketing and sales costs only"], correct_answer: 1 },
    { question: "What is a chatbot builder platform?", options: ["A physical machine that builds chatbots", "A no-code or low-code tool enabling businesses to create AI chatbots for customer service, sales, or support", "A platform exclusively for customer service teams", "A programming library for building chatbots in Python"], correct_answer: 1 },
    { question: "What is community-led growth in the context of AI products?", options: ["Hiring a community manager for marketing", "A strategy where a user community drives product adoption through sharing, collaboration, and peer recommendations", "Selling products exclusively through community organisations", "Building AI for non-profit community groups"], correct_answer: 1 },
  ],
  9: [
    { question: "What is TensorFlow?", options: ["A Python data manipulation library", "An open-source machine learning framework developed by Google for building and deploying ML models", "A cloud storage service for ML datasets", "A visualisation library for neural networks"], correct_answer: 1 },
    { question: "What is PyTorch?", options: ["A Python plotting library", "An open-source deep learning framework developed by Meta, known for its dynamic computation graph and ease of use", "A reinforcement learning simulator", "A data preprocessing pipeline tool"], correct_answer: 1 },
    { question: "What is Hugging Face?", options: ["A social media platform for AI researchers", "A platform and open-source library hosting thousands of pre-trained transformer models and datasets for NLP and beyond", "A hardware manufacturer for AI chips", "A cloud provider specialising in AI compute"], correct_answer: 1 },
    { question: "What is LangChain used for?", options: ["Chaining Python functions together", "A framework for building applications that chain together calls to language models with other tools, data sources, and logic", "Translating between programming languages", "Managing long-term AI training runs"], correct_answer: 1 },
    { question: "What is MLflow?", options: ["A cloud service for machine learning", "An open-source platform for managing the ML lifecycle, including experiment tracking, model versioning, and deployment", "A deep learning framework", "A data pipeline orchestration tool"], correct_answer: 1 },
    { question: "What is a vector database?", options: ["A database optimised for storing geometric vectors", "A database designed to store and efficiently query high-dimensional vector embeddings, enabling semantic search and RAG", "A traditional relational database with a vector extension", "A time-series database for AI metrics"], correct_answer: 1 },
    { question: "What is OpenAI's GPT API used for?", options: ["Training custom GPT models from scratch", "Accessing OpenAI's large language models via API to integrate text generation, summarisation, and conversation into applications", "Free open-source model hosting", "Managing OpenAI subscriptions"], correct_answer: 1 },
    { question: "What is Docker used for in AI deployment?", options: ["Building neural network layers", "Containerising applications and their dependencies so they run consistently across different environments", "A type of cloud computing service", "A tool for visualising model architectures"], correct_answer: 1 },
    { question: "What is Weights & Biases (W&B)?", options: ["A term for neural network parameters", "A machine learning experiment tracking and visualisation platform for monitoring model training runs", "A Python library for statistical analysis", "An AI hardware benchmark tool"], correct_answer: 1 },
    { question: "What is ONNX?", options: ["An open-source operating system for AI", "Open Neural Network Exchange — an open standard for representing ML models, enabling interoperability between frameworks", "A type of neural network accelerator chip", "A cloud API for deploying models"], correct_answer: 1 },
    { question: "What is Stable Diffusion?", options: ["A physics simulation tool", "An open-source text-to-image generative AI model capable of producing high-quality images from text prompts", "A type of stable reinforcement learning algorithm", "A model for predicting financial markets"], correct_answer: 1 },
    { question: "What is a model serving framework?", options: ["A restaurant analogy for AI", "Software infrastructure for deploying ML models in production, handling requests, and returning predictions at scale", "A framework for training models", "A tool for labelling data"], correct_answer: 1 },
    { question: "What is Vertex AI?", options: ["A neural network optimiser", "Google Cloud's managed machine learning platform for building, deploying, and scaling AI models", "An open-source deep learning framework", "A dataset management tool"], correct_answer: 1 },
    { question: "What is a model registry?", options: ["A list of all available AI models on the internet", "A centralised repository for versioning, storing, and managing trained ML models throughout their lifecycle", "A government database of approved AI systems", "A documentation library for model architectures"], correct_answer: 1 },
    { question: "What is SageMaker?", options: ["A data annotation tool", "Amazon Web Services' managed platform for building, training, and deploying machine learning models", "An open-source model training framework", "A GPU monitoring service"], correct_answer: 1 },
    { question: "What is Gradio used for?", options: ["Building GPU clusters for training", "A Python library for rapidly creating web demos and UIs for machine learning models", "Monitoring model performance in production", "A data visualisation framework"], correct_answer: 1 },
    { question: "What is a feature store in MLOps?", options: ["A shop selling ML hardware", "A centralised repository for storing, sharing, and serving ML features for training and inference", "A database of model hyperparameters", "A tool for managing training datasets"], correct_answer: 1 },
    { question: "What is Kubeflow?", options: ["A type of Kubernetes network flow", "An open-source platform for deploying, monitoring, and managing ML workflows on Kubernetes", "A cloud-native deep learning framework", "A pipeline tool for ETL processes"], correct_answer: 1 },
    { question: "What is a transformer model and which library is most associated with pre-trained transformers?", options: ["A type of CNN; TensorFlow", "A sequence model using self-attention; Hugging Face Transformers library", "A recurrent architecture; PyTorch Lightning", "A reinforcement learning model; OpenAI Gym"], correct_answer: 1 },
    { question: "What is RAG (Retrieval-Augmented Generation)?", options: ["A GAN variant for generating images", "A technique combining retrieval from a knowledge base with language model generation to produce grounded, up-to-date responses", "A regularisation method for transformers", "Random Augmented Generation for data synthesis"], correct_answer: 1 },
  ],
  10: [
    { question: "What is the primary difference between a data scientist and a machine learning engineer?", options: ["Data scientists write more code than ML engineers", "Data scientists focus on analysis and insight; ML engineers focus on building, deploying, and scaling ML systems in production", "ML engineers work only with deep learning; data scientists with traditional statistics", "There is no meaningful difference"], correct_answer: 1 },
    { question: "What is MLOps?", options: ["A type of machine learning algorithm", "The practice of deploying, monitoring, and maintaining ML models in production reliably and efficiently, combining ML and DevOps principles", "A certification for AI professionals", "A cloud computing platform"], correct_answer: 1 },
    { question: "What makes a strong AI portfolio?", options: ["Publishing theoretical research papers only", "End-to-end projects demonstrating problem framing, data work, model building, evaluation, and deployment with documented results", "Collecting certificates from online courses", "Having the most followers on social media"], correct_answer: 1 },
    { question: "What does a machine learning engineer do?", options: ["Conducts academic research into new algorithms", "Designs, builds, and deploys scalable ML systems, including data pipelines, model training infrastructure, and serving systems", "Only writes Python scripts for data analysis", "Manages AI company employees"], correct_answer: 1 },
    { question: "What is a data engineer's primary role?", options: ["Building machine learning models", "Designing, building, and maintaining data pipelines and infrastructure that make data available and usable for analysis and AI", "Presenting data insights to stakeholders", "Conducting statistical analysis of data"], correct_answer: 1 },
    { question: "What is the role of an AI product manager?", options: ["Writing code for AI models", "Defining the vision, roadmap, and requirements for AI-powered products, bridging business objectives with technical capabilities", "Deploying AI systems in production", "Managing AI model training runs"], correct_answer: 1 },
    { question: "What are commonly used cloud platforms for AI work?", options: ["Facebook, Twitter, Instagram", "Amazon Web Services (AWS), Google Cloud Platform (GCP), Microsoft Azure", "GitHub, GitLab, Bitbucket", "Netlify, Vercel, Heroku"], correct_answer: 1 },
    { question: "What is Continuous Integration/Continuous Deployment (CI/CD) in MLOps?", options: ["A method for continuously collecting training data", "Automated pipelines for testing, validating, and deploying ML models to production whenever changes are made", "A system for continuously monitoring model performance only", "A method for continuous model retraining on new data"], correct_answer: 1 },
    { question: "What is model drift?", options: ["A model gradually improving over time", "Degradation in model performance in production as the statistical properties of input data change over time", "The process of moving a model from development to production", "A model producing different results on each run"], correct_answer: 1 },
    { question: "What is the importance of explainability (XAI) in AI careers?", options: ["It is only required by academics", "Being able to explain AI decisions to stakeholders, regulators, and users builds trust and is increasingly required by law", "XAI is only relevant for medical AI", "It makes AI models run faster"], correct_answer: 1 },
    { question: "What is a common data format for ML model serving APIs?", options: ["PDF", "JSON (JavaScript Object Notation)", "Excel spreadsheets", "Microsoft Word documents"], correct_answer: 1 },
    { question: "What is responsible AI?", options: ["AI that operates without errors", "The practice of designing, developing, and deploying AI in ways that are fair, transparent, accountable, and aligned with human values", "AI that only automates responsible tasks", "AI that requires human approval for every decision"], correct_answer: 1 },
    { question: "What is a common interview question for ML engineering roles?", options: ["How many piano tuners are there in the world?", "How would you design a machine learning system to detect spam at scale?", "Describe the history of AI", "Name the founders of major AI companies"], correct_answer: 1 },
    { question: "What is the value of contributing to open-source AI projects?", options: ["It earns direct salary income", "It demonstrates practical skills, builds reputation, connects you with the community, and contributes to the field", "It is only valuable for junior developers", "It provides access to proprietary AI models"], correct_answer: 1 },
    { question: "What certification bodies are widely recognised in the AI field?", options: ["American Institute of Accountants", "Google Professional ML Engineer, AWS Certified ML Specialty, Microsoft AI-900/AI-102", "ISO 9001 quality certification", "OSHA safety certification"], correct_answer: 1 },
    { question: "What is a common tool for version-controlling ML experiments and datasets?", options: ["Google Docs", "DVC (Data Version Control) alongside Git", "Dropbox", "Excel spreadsheets"], correct_answer: 1 },
    { question: "What is the importance of communication skills in an AI career?", options: ["Communication is irrelevant for technical AI roles", "AI professionals must translate complex technical findings into clear insights for business stakeholders and non-technical teams", "Only AI managers need strong communication skills", "Communication is only needed when writing code documentation"], correct_answer: 1 },
    { question: "What is the 'full stack' AI engineer concept?", options: ["An engineer who builds entire web applications alone", "An AI engineer capable of working across the entire AI product pipeline — from data and modelling to deployment and the product layer", "An engineer proficient in all programming languages", "A researcher who works on both hardware and software AI"], correct_answer: 1 },
    { question: "What is a key skill for an AI research scientist role?", options: ["Proficiency in Microsoft Office", "Deep understanding of mathematical foundations (linear algebra, probability, calculus) and ability to propose and test novel algorithms", "Experience with no-code AI tools", "Business development and sales skills"], correct_answer: 1 },
    { question: "What is the best way to stay current in the rapidly evolving AI field?", options: ["Only reading textbooks from university courses", "Following research papers (arXiv), attending conferences, engaging with communities, and continuously building projects", "Watching YouTube videos exclusively", "Relying on knowledge from a single online course"], correct_answer: 1 },
  ],
};

function generateFinalTestQuestions(moduleId) {
  const id = parseInt(moduleId, 10);
  if (!FINAL_TEST_QUESTIONS[id]) {
    console.warn(`No final test questions found for module ${moduleId}, falling back to module 1`);
  }
  return FINAL_TEST_QUESTIONS[id] || FINAL_TEST_QUESTIONS[1];
}

export default function ModuleFinalTestPage() {
  const router = useRouter();
  const { moduleId } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passed, setPassed] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [noBadges, setNoBadges] = useState(false);

  // Load noBadges flag from localStorage on mount
  useEffect(() => {
    try {
      setNoBadges(localStorage.getItem(NO_BADGES_KEY) === "true");
    } catch {
      // localStorage unavailable (SSR or private mode)
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleComplete = async (testPassed, score) => {
    setPassed(testPassed);
    if (user) {
      try {
        await fetch("/api/module-final-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ moduleId, appKey: APP_KEY, score, userId: user.id }),
        });
      } catch (err) {
        console.error("Error saving final test result:", err);
      }
    }
  };

  const goToNextModule = () => {
    const nextModuleId = parseInt(moduleId) + 1;
    if (nextModuleId <= 10) {
      router.push(`/modules/${nextModuleId}/lesson/1`);
    } else {
      router.push("/curriculum");
    }
  };

  const confirmSkip = () => {
    try {
      localStorage.setItem(NO_BADGES_KEY, "true");
    } catch {
      // localStorage unavailable
    }
    setNoBadges(true);
    setShowSkipDialog(false);
    goToNextModule();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          Module {moduleId} Final Test – {APP_DISPLAY}
        </title>
      </Head>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Skip-mode banner */}
          {noBadges && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-yellow-400 bg-yellow-50 px-4 py-3 text-yellow-800 text-sm"
            >
              ⚠️ <strong>You&apos;re in Skip mode.</strong> You can continue without quizzes, but
              you won&apos;t earn badges or a certificate for this course.
            </div>
          )}

          <div className="mb-6">
            <button
              onClick={() => router.push(`/modules/${moduleId}/lesson/1`)}
              className="text-purple-600 hover:text-purple-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Module
            </button>
          </div>

          <div className="card mb-8">
            <h1 className="text-3xl font-bold mb-2">Module {moduleId} – Final Test</h1>
            <p className="text-gray-600">
              Complete all 20 questions. You need to score 14/20 or higher to pass and unlock the
              next level.
            </p>
          </div>

          <ModuleFinalTestComponent
            questions={generateFinalTestQuestions(moduleId)}
            moduleId={moduleId}
            appKey={APP_KEY}
            onComplete={handleComplete}
          />

          {/* Skip quiz button — shown below test when not yet passed */}
          {!passed && !noBadges && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowSkipDialog(true)}
                className="text-sm text-gray-500 underline hover:text-gray-700"
              >
                Skip quiz and continue
              </button>
            </div>
          )}

          {/* Skip mode: Continue without taking the test */}
          {noBadges && !passed && (
            <div className="card bg-yellow-50 border-2 border-yellow-400 mt-6">
              <p className="text-gray-700 mb-4">Continue to the next module.</p>
              <button onClick={goToNextModule} className="btn-primary">
                Continue to Next Module
              </button>
            </div>
          )}

          {passed && (
            <div className="card bg-green-50 border-2 border-green-500 mt-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                🎉 Module Complete – Next Level Unlocked!
              </h3>
              <button onClick={() => router.push("/curriculum")} className="btn-primary">
                Continue to Curriculum
              </button>
            </div>
          )}

          {/* Skip confirmation dialog */}
          {showSkipDialog && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="skip-dialog-title"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6">
                <h2 id="skip-dialog-title" className="text-xl font-semibold mb-3">
                  Skip quizzes?
                </h2>
                <p className="text-gray-700 mb-6">
                  You can continue to the next module, but you won&apos;t earn badges or a
                  certificate for this course. <strong>This cannot be undone.</strong>
                </p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowSkipDialog(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button onClick={confirmSkip} className="btn-primary">
                    Skip
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
