

import connectDB from '../../config/db';
import User from '../../../models/user';

connectDB(); // Helper function to connect to MongoDB

export default async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'POST') {
    try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Extract connection ID from request body (assuming it's provided in the request body)
      const { connectionId } = req.body;
      // Check if the connectionId already exists in the user's connections
      if (user.connections.includes(connectionId)) {
        return res.status(400).json({ error: 'Connection already exists' });
      }
      // Add the connectionId to the user's connections
      user.connections.push(connectionId);
      // Save the updated user
      await user.save();
      // Return the updated user object (optional)
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
