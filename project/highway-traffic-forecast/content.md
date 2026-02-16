---
title: A Time-Series Forecasting Model on Highway Traffic Volume and Speed
date: 2024-10-07
popularity: 80
excerpt: This project has won an Honorable Mention in the 2024 Intelligence Transportation Management Competition, held by the National Freeway Bureau, Ministry of Transportation and Communications, Taiwan.
cover: /project/highway-traffic-forecast/workflow.png
cover_backdrop: false
---

A Time-Series Forecasting Model on Highway Traffic Volume and Speed
===

##### Highlights: Time-Series Forecasting, Convolutional Neural Network, PyTorch

<!-- 指定不要背板 -->
<!-- <img src="/posts/shp-intro/tsp.png" alt="Shortest Hamiltonian Path" class="no-backdrop"> -->

## Introduction
This project is expected to be a long-term project, and this repository shows the achievement in Stage 1. In Stage 1, we succeeded in building a deep learning model that can estimate the traffic volume and speed on highways precisely in the short term.

## Project Scope
Both northbound and southbound traffic data on Freeway No.5 in 2023.

## Methodology
We adopted the Convolutional Neural Network (CNN) architecture to include the spatial dependence and the time-series characteristic. We have not only collected the time-series traffic data of the target vehicle detector but also the data of the upstream and the downstream vehicle detector relative to the target vehicle detector.

In this project, we chose five features, respectively were:
- Time-Series **traffic volume** data aggregated in summation in 5 minutes for the past 30 minutes
- Time-Series **traffic speed** data aggregated in summation in 5 minutes for the past 30 minutes
- Time-Series **traffic occupancy** data aggregated in summation in 5 minutes for the past 30 minutes
- **The number of lanes** detected for each vehicle detectors
- **The characteristics of the road section** for each vehicle detectors located

These five features served as a channel respectively, then stacked them all as an input of the CNN. There was composed of a `3×6` tensor for each channel.

This figure shows the workflow of this project. We built the data pipeline to crawl the traffic data from tisvcloud.freeway.gov.tw, then stored them in the local MySQL database. After that, we queried data from the MySQL database and used Python to transform them into 3-D dimensional tensors, and saved them in .h5 format. In the training process, we loaded these data through the PyTorch Dataloader and put them into the CNN regression model built by the PyTorch framework.
![](/project/highway-traffic-forecast/workflow.png "Overview of this project")

## Validation Results in Each Road Section
### Southbound
![](/project/highway-traffic-forecast/validation_southbound.png "Model performance (MAPE) in each soundbound section of Freeway No.5")
The table shown above is the validation results of the southbound sections. Almost all of the southbound sections can predict the volume and speed well throughout our model, whose MAPE is lower than 5%. 

### Northbound
![](/project/highway-traffic-forecast/validation_northbound.png "Model performance (MAPE) in each northbound section of Freeway No.5")
The table shown above is the validation results of the northbound sections. The performance of the northbound sections is slightly worse than that of the southbound, especially on the section between Yilan and Toucheng. In our opinion, this might be affected by the mainline metering near the Toucheng Interchange.
