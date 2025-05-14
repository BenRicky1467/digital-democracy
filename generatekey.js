
    const express = require('express');
    const crypto = require('crypto');
    const app = express();
    //... other express setup

    // Function to generate a cryptographically strong random string
    const generateSecretKey = () => {
      return crypto.randomBytes(32).toString('hex');
    };

    const secretKey = generateSecretKey();
    console.log('Generated Secret Key:', secretKey);  //DO NOT PUSH THIS TO PRODUCTION
    process.env.JWT_SECRET = secretKey; // Store in environment variable
    //...