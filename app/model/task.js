import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   completed: {
      type: Boolean,
      required: true
   },
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   }
},
   {
      timestamps: true
   }
);

const Task = mongoose.model('Task', taskSchema)

export default Task