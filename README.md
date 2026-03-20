GigShield AI
(AI-Powered Parametric Insurance for Delivery Workers)
## Problem Statement

Delivery partners working with platforms such as Swiggy and Zomato are highly dependent on external conditions for their daily income. Factors like heavy rainfall, extreme heat, pollution, and traffic disruptions significantly reduce their working hours, leading to a 20–30% loss in earnings.

Currently, there is no insurance solution that protects gig workers against income loss caused by such uncontrollable external disruptions.

## Objective

The objective of this project is to design and develop an AI-powered parametric insurance platform that:

Provides weekly insurance coverage aligned with gig worker earnings cycles

Detects external disruptions using real-time data

Automatically triggers payouts without manual claims

Uses AI for risk prediction, dynamic pricing, and fraud detection

## Target Persona

Primary Users:
Food delivery partners (Swiggy/Zomato) operating in urban environments such as Chennai.

These users are highly exposed to environmental and logistical disruptions that directly impact their earning potential.

## Solution Overview

GigShield AI introduces a zero-touch parametric insurance system where payouts are triggered automatically when predefined conditions are met.

### Workflow

User registers and subscribes to a weekly insurance plan

System continuously monitors external data (weather, AQI, traffic)

AI models evaluate real-time risk levels

If a disruption threshold is crossed, a payout is automatically triggered

Fraud detection mechanisms validate authenticity before processing

## Parametric Triggers
Trigger Type	Condition	Impact on Income
Heavy Rain	Rainfall > 50mm	Deliveries halted
High Pollution	AQI > 250	Unsafe working conditions
Extreme Heat	Temperature > 42°C	Reduced working hours
Traffic Congestion	High traffic index	Lower delivery efficiency
## Weekly Pricing Model

The pricing model is structured on a weekly basis to align with gig workers' earning cycles.

Plan	Weekly Premium	Coverage Amount
Basic	₹49	₹300
Standard	₹79	₹600
Premium	₹99	₹1000

Dynamic Adjustment:
Premiums are adjusted using AI-based risk scoring based on location and predicted disruptions.

## AI/ML Integration
### 1. Risk Prediction

Predicts likelihood of disruptions using weather forecasts and historical data

Outputs risk levels (Low, Medium, High)

### 2. Dynamic Pricing

Adjusts weekly premiums based on predicted risk

Enables fair and adaptive pricing

### 3. Fraud Detection

GPS-based location verification

Detection of duplicate claims

Behavioral anomaly detection

## System Workflow
User purchases weekly plan  
        ↓  
System monitors external conditions  
        ↓  
AI predicts risk levels  
        ↓  
Disruption threshold met  
        ↓  
Fraud validation  
        ↓  
Automatic payout triggered  
        ↓  
User notified  
## Tech Stack

Frontend: EJS / HTML / CSS
Backend: Node.js with Express
Database: MongoDB
APIs: OpenWeather API, AQI APIs
AI/ML: Python (Scikit-learn) or rule-based models
Payments: Razorpay (Test Mode)

## Deliverables (Phase 1)

Defined delivery partner persona

End-to-end workflow and architecture

Weekly pricing model

Parametric trigger definition

AI/ML integration strategy

GitHub repository with documentation

## Future Enhancements

Real-time risk heatmaps for different zones

Personalized insurance plans based on user behavior

Integration with delivery platforms (Swiggy, Zomato APIs)

Advanced machine learning models for improved accuracy

## Demo Plan

The system demonstration will include:

User onboarding and registration

Weekly plan selection

Simulation of disruption (e.g., heavy rainfall event)

Automatic payout triggering

Display of payout notification
