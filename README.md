# Liho

From an epistemological perspective, we have missed an evolutionary adaptation, visual pattern recognition, as a means of identifying relationships of interest in the data we generate. And although the premise “Cum hoc ergo propter hoc”, which in Latin means “with this, therefore because of this”, or more colloquially: “correlation does not imply causation” calls us to proceed with caution in the search for patterns between distant sources of information, it is perceived as of great value to advance in platforms and tools that make it easier for us to transform data into shapes and colors with potential as channels of knowledge.

In short, the opportunity to integrate a visualization with the potential not only to show data, but also to generate knowledge, can be justified under three fundamental pillars:

The vast amount of data available The usual way of viewing information is subject to showing only a summary of what we discover Our evolutionary ability to discover visual patterns

## What
Open-source online platform for multivariate three-dimensional visualization of scientific databases with correlation potential through the detection of patterns or representation of their discoveries from the manipulation, discrimination and analysis of information.

## Why
The complexity and abundance of information sources and databases from scientific research, represents a disciplinary opportunity that emerges from an exploratory integration using these data as raw material.

## So that
Visually link divergent or complementary sources of information from open source digital tools that promote a form of inquiry based on the visual capacities of people and the scientific community.

## General objective
Develop an online platform, which through the three-dimensional and multivariable visualization of scientific data, promotes a form of inquiry through the detection of patterns.

![Alt text](https://github.com/elisahonorato/liho/blob/master/mediafiles/assets/diagram.png)


Liho Technology Stack
Frontend
Liho’s interface is built as a Single Page Application (SPA) using React (JavaScript). It uses React Router DOM for navigation and Material-UI (MUI) with Emotion for UI design and styling. The frontend integrates Three.js for interactive 3D data visualization, supported by the dat.GUI library for adjusting visual parameters. It communicates with the backend via Axios HTTP requests.

Backend
The server side is developed in Python using the Django 4 framework. The application follows Django’s modular structure (with a main project liho and an api app), and implements a REST API using Django REST Framework to serve data to the frontend. It includes CORS middleware (Django CORS Headers) and manages media files through Cloudinary. Data processing relies on libraries such as Pandas.
The backend was initially deployed using AWS EC2 and S3, but was later migrated to a more cost-effective and maintainable stack on Render.

Database
Liho uses a PostgreSQL database managed through Django ORM. The setup uses dj-database-url for environment-based configuration and connects via psycopg2.

Data Visualization
Interactive 3D data visualizations are handled by Three.js, leveraging GPU acceleration to render shapes, colors, and labels that represent multivariable datasets. dat.GUI enables real-time parameter control by the user.

Deployment
The frontend is hosted on GitHub Pages as a static site. The backend is containerized with Docker, served via Gunicorn and Nginx, and deployed on Render.com, using their free tier with managed PostgreSQL. This infrastructure allows both parts of the system to remain publicly available and fully integrated.

