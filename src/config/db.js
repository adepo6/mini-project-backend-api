const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // This connects using the URI from your .env file [cite: 8, 47]
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with failure if connection fails [cite: 55]
    }
};

module.exports = connectDB;

