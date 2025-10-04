import mongoose from 'mongoose'

const dbConnect = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@x-social.7fxqhfj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=X-SOCIAL`);
    console.log('Database connected successfuly')
  } catch (error) {
    console.log('Database connection failed:', error);
  }
}

export default dbConnect;