# Round-Robin Coupon Distribution System

A web application that distributes coupons to guest users in a round-robin manner, with built-in abuse prevention mechanisms.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
- [Abuse Prevention Strategies](#abuse-prevention-strategies)
- [Testing Instructions](#testing-instructions)
- [Deployment Guide](#deployment-guide)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)

## Overview

This application provides a fair coupon distribution system that assigns coupons sequentially to users without requiring login. It implements multiple layers of abuse prevention to ensure users cannot exploit the system to claim multiple coupons within a restricted time frame.

## Features

- **Round-Robin Coupon Distribution**: Coupons are distributed sequentially to ensure even distribution.
- **Guest Access**: Users can access the system without creating an account.
- **Abuse Prevention**: Multiple strategies to prevent users from claiming multiple coupons.
- **Real-time Feedback**: Clear messages about coupon claims and waiting periods.
- **Responsive Design**: Works on desktop and mobile devices.

## Tech Stack

- **Frontend**: React.js with Vite, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Cookie-based session tracking
- **Deployment**: vercel(for frontend) and render(for backend)

## Setup Instructions

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- MongoDB (v4.0.0 or higher)
- Git

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Vaasu02/Coupon-Distribution-System.git
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the server directory
   - Add the required environment variables (see [Environment Variables](#environment-variables))

4. Seed the database with initial coupons:
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on http://localhost:5000 by default.

### Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd coupon-distribution-system/client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on http://localhost:5173 by default.

### Environment Variables

Create a `.env` file in the server directory with the following variables:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/coupon-system
CLIENT_URL=http://localhost:5173
COUPON_CLAIM_COOLDOWN=3600000 # 1 hour in milliseconds 
```

## Abuse Prevention Strategies

The system implements multiple layers of protection to prevent abuse:

### 1. IP Address Tracking

- **How it works**: Each user's IP address is recorded when they claim a coupon.
- **Restrictions**: Users from the same IP address cannot claim another coupon within the cooldown period (default: 1 hour).
- **Implementation**: The server stores IP addresses with timestamps in the database and checks against this record for each claim attempt.
- **Blocking mechanism**: After multiple rapid claim attempts from the same IP, the system can temporarily block that IP for a longer duration (default: 24 hours).

### 2. Cookie-based Session Tracking

- **How it works**: A session cookie is set in the user's browser when they first visit the site.
- **Restrictions**: The same browser session cannot claim multiple coupons within the cooldown period.
- **Implementation**: Express-session middleware manages session cookies, which are checked against the database for previous claims.
- **Persistence**: Cookies persist even if the user refreshes the page or closes and reopens the browser.

### 3. Rate Limiting

- **How it works**: API endpoints are protected with rate limiting.
- **Restrictions**: Limits the number of requests a user can make to the coupon claim endpoint.
- **Implementation**: Express-rate-limit middleware restricts excessive requests from the same IP address.

### 4. Cooldown Period Enforcement

- **How it works**: A mandatory waiting period between coupon claims.
- **Restrictions**: Users must wait for the cooldown period to expire before claiming another coupon.
- **Implementation**: Server-side validation checks the time elapsed since the last claim before allowing a new claim.

## Testing Instructions

### Testing the Coupon Distribution

1. Open the application in your browser.
2. Click the "Get Coupon" button to claim your first coupon.
3. Note the coupon code and value.
4. Try to claim another coupon immediately - you should see a cooldown message.
5. Wait for the cooldown period to expire (for testing, you can set this to a shorter duration in the `.env` file).
6. After the cooldown period, claim another coupon and verify it's different from the first one.

### Testing Abuse Prevention

#### IP Tracking Test

1. Claim a coupon from your browser.
2. Try to claim another coupon from the same network but a different device or browser.
3. You should be prevented from claiming due to IP restrictions.

#### Cookie Tracking Test

1. Claim a coupon from your browser.
2. Clear your browser cookies.
3. Try to claim another coupon immediately.
4. Even with cleared cookies, the IP tracking should prevent the claim.

#### Multiple Attempts Test

1. Claim a coupon.
2. Repeatedly try to claim more coupons within a short period.
3. After several attempts, your IP should be temporarily blocked.
4. You should see a message indicating you're blocked with a countdown timer.

### Testing Round-Robin Distribution

1. Set up multiple devices or browsers on different networks.
2. Have each device claim a coupon in sequence.
3. Record the coupon codes and values.
4. Verify that coupons are distributed in a sequential pattern.

## Deployment Guide

### Backend Deployment

#### Option 1: Deploying to Heroku

1. Create a Heroku account and install the Heroku CLI.
2. Login to Heroku:
   ```bash
   heroku login
   ```
3. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```
4. Add MongoDB Atlas as your database:
   - Create a MongoDB Atlas account
   - Set up a cluster and get your connection string
   - Add the connection string to Heroku:
     ```bash
     heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
     ```
5. Set other environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set COUPON_CLAIM_COOLDOWN=3600
   ```
6. Deploy the backend:
   ```bash
   git subtree push --prefix server heroku main
   ```

#### Option 2: Deploying to a VPS (Digital Ocean, AWS, etc.)

1. Set up a VPS with Node.js installed.
2. Clone your repository on the server.
3. Set up environment variables.
4. Install PM2 for process management:
   ```bash
   npm install -g pm2
   ```
5. Start the server with PM2:
   ```bash
   cd server
   pm2 start index.js --name "coupon-api"
   ```
6. Set up Nginx as a reverse proxy to your Node.js application.

### Frontend Deployment

#### Option 1: Deploying to Netlify

1. Build your frontend:
   ```bash
   cd client
   npm run build
   ```
2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
3. Deploy to Netlify:
   ```bash
   netlify deploy
   ```
4. Follow the prompts to complete the deployment.
5. Set up environment variables in the Netlify dashboard.

#### Option 2: Deploying to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Deploy to Vercel:
   ```bash
   cd client
   vercel
   ```
3. Follow the prompts to complete the deployment.
4. Set up environment variables in the Vercel dashboard.

## API Documentation

### Endpoints

#### GET /api/coupons/current
- **Description**: Get the current available coupon
- **Response**: `{ coupon: { code, value, description } }`

#### POST /api/coupons/claim
- **Description**: Claim the current coupon
- **Response**: `{ success: true, coupon: { code, value, description } }`
- **Error Responses**:
  - 429: Too many requests - cooldown period
  - 403: Blocked due to abuse detection

#### GET /api/coupons/status
- **Description**: Check claim status and cooldown
- **Response**: `{ canClaim: boolean, timeRemaining: number, isBlocked: boolean, blockExpiresAt: timestamp }`

## Project Structure

```
coupon-distribution-system/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   │   ├── components/     # React components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API service functions
│   │   └── styles/         # CSS files
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── server/                 # Backend Node.js application
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── utils/              # Utility functions
│   ├── .env                # Environment variables
│   └── package.json        # Backend dependencies
└── README.md               # Project documentation
```
